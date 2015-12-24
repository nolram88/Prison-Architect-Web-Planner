define(["views/tileset_view", "jquery.mousewheel", "jquery.jscrollpane"], function(TilesetView) {

	var Tilesets = {}, Editor;
	Tilesets.collection = {};
	Tilesets.assetMetadataMap = {};
	Tilesets.assetMap = {};

	/* ======================== */
	/* ====== INITIALIZE ====== */
	/* ======================== */

	Tilesets.initialize = function() {

		Editor = require("editor");
		this.view = TilesetView.initialize();

		this.add({
			image: "img/tilesets/splash.png",
			metadata:"img/tilesets/empty.txt",
			tilewidth: 64,
			tileheight: 64
		});
	};

	/* ================= */
	/* ====== SET ====== */
	/* ================= */

	Tilesets.set = function(name) {

		var tileset = Tilesets.collection[name];
		Editor.activeTileset = tileset;

		Editor.$("#tileset_container").css({
			width: tileset.width,
			height: tileset.height,
		}).attr("class", "ts_" + tileset.id);

		Editor.$("#tilesets select").val(name);
		Editor.$("#tilesets .loading").remove();
		this.resetSelection();
	};

	/* ================= */
	/* ====== ADD ====== */
	/* ================= */

	Tilesets.add = function(data) {

		var img = new Image(),
		bfr = document.createElement("canvas").getContext("2d"),
		name = data.name || data.image.match(/(?:.+)\/([^\/]+)/)[1],
		style = document.createElement("style"),
		id = name.replace(/[^a-zA-Z]/g, '_'), css;

		img.src = data.image;
		img.addEventListener("load", function() {
			var fileAsString = "";
			var self = this;
			try{
				if(data.metadata){
					if( typeof data.metadata !== 'string'){
						var reader  = new FileReader();
						
						reader.onload = function () {
							
							fileAsString = reader.result;
							buildFromMetadata(fileAsString,bfr,img);
						};
						reader.readAsText(data.metadata,"UTF-8");
					} else {

						buildFromMetadata("",bfr,this);

					}



				} 
			}catch(e){
				console.log(e.toString());
			}
		}, false);


		// Takes materials.txt and maps out the individual parts for use later like exports
		buildFromMetadata = function(fileAsString,bfr, context){

			var allGameAssets = fileAsString.split("\n");
			if(!Object.keys(Tilesets.assetMetadataMap).length){

			
			var results = [];
			var scratchObj = {};
		

		for(var z = 0; z < allGameAssets.length -1; z++){
			var scratchStr = allGameAssets[z];
			
			var words = scratchStr.match(/\S+/g);
			if( !words || !scratchStr || words.length === 0 || scratchStr.trim() === ""|| scratchStr === " " || scratchStr =="\n"){
				continue;
			}
			if(words[0] === 'BEGIN' && words[1] ==="Requirement" && words[2] === "Type"){
				if(scratchObj.requirements === undefined){
					scratchObj.requirements = {};
				}
				if(words[3] ==='MinimumSize'){
					scratchObj.requirements[words[3]] = {'x':words[4],'y':words[5]};
					continue;
				} else if(words[3] ==='Object'){
					scratchObj.requirements[words[3]] = {'id':words[5]};
					continue;
				}
				//May change how this is handled when validating
				scratchObj.requirements[words[3]] = words[3];
				continue;
			} else if(words[0] === 'BEGIN' && words[1] === "Grading"){
				if(scratchObj.grading === undefined){
					scratchObj.grading = {};
					scratchObj.grading.roomsize = [];
					scratchObj.grading.items = [];	
				}
				if(words[3] === 'RoomSize'){
					scratchObj.grading.roomsize.push(words[5]);
					continue;
				}else if(words[3] === 'Item'){
					scratchObj.grading.items.push(words[5]);
					continue;
				}
				scratchObj.grading[words[3]] = true;
				continue;
			} else if(words[0] === 'BEGIN' && words[1] === "LikelyObject"){
				if(scratchObj.suggestedItems === undefined){
					scratchObj.suggestedItems = [];
				}
				scratchObj.suggestedItems.push(words[3]);
				continue;
			}
			if(words[0] === 'BEGIN' && words[1].startsWith("Sprite")){
				if(scratchObj.sprites === undefined){
					scratchObj.sprites = [];
				}
				scratchObj.sprites.push({'x':words[3],'y':words[4]});
				continue;
			}
			if(words[0] === 'BEGIN'){
				scratchObj = {};
				scratchObj.type = words[1];
				continue;
			}
			if(words[0] === 'END' || scratchStr.match("BEGIN .* END") !== null){
				results.push(scratchObj);
				continue;
			}
			scratchObj[words[0]] = words[1];
		}
		
		Tilesets.assetMetadataMap = results;
		}

		bfr.canvas.width = data.width = 2048;
		bfr.canvas.height = data.height = 2048;

			// Process tileset
			
			if (!Object.keys(Tilesets.assetMetadataMap).length) { 
				data.base64 = Tilesets.slice(context, data); 
			}

			//throw in a validator
			if(Object.keys(Tilesets.assetMetadataMap).length){
				bfr.drawImage(context, 0, 0);
				data.base64 = bfr.canvas.toDataURL();
			}

			data.id = id;
			data.name = name;

			Tilesets.collection[name] = data;
			Tilesets.set(name);

			// Add a global css class so tiles can use
			// it in conjunction with background-position
			Editor.$(style).attr("id", "tileset_" + id);
			Editor.$(style).attr("class", "tileset");

			css = ".ts_" + id + ", .ts_" + id + " > div {\n";
			css += "\twidth: " + data.tilewidth + "px;\n";
			css += "\theight: " + data.tileheight + "px;\n";
			css += "\tbackground-image: url('" + data.base64 + "');\n";
			css += "}";
			Editor.$(style).append(css);

			Editor.$("head").append(style);

			// Update select element
			Editor.$("#tilesets select").append("<option>" + name + "</option>");
			Editor.$("#tilesets select").val(name);

			// Update custom scrollbars and grid
			Editor.$("#tileset").jScrollPane();
			Editor.Canvas.updateGrid();
		}
		
	};



/* =================== */
/* ====== SLICE ====== */
/* =================== */

	// Slices the tileset according to asset metadata
	Tilesets.slice = function(img, data) {

		var bfr = document.createElement("canvas").getContext("2d");
		var tilew = data.tilewidth;
		var tileh = data.tileheight;
		var imgData; 
		var red;
		var x;
		var y;
		var totalx;
		var totaly;
		//PA asset png files are currently only 2048 x 2048 but this would let you use a bigger sheet
		 bfr.canvas.width = (img.width) ? img.width: 2048 ;
		 bfr.canvas.height = (img.height) ? img.height: 2048 ;
		 //Discovered that objects on a canvas dont hold any data
		 //Could migrate to SVG at some point but that would require a large rewrite
		for (y = 0, totaly = Math.floor(bfr.canvas.height / tileh); y < totaly; y++) {
			for (x = 0, totalx = Math.floor(bfr.canvas.width / tilew); x < totalx; x++) {
				bfr.drawImage(
					img,

					(x * tilew) ,
					(y * tileh) ,

					tilew, 
					tileh,

					x*tilew,
					y*tileh,

					tilew, 
					tileh
					);
			}
		}

		return bfr.canvas.toDataURL();
	};

	/* ============================= */
	/* ====== RESET SELECTION ====== */
	/* ============================= */

	Tilesets.resetSelection = function() {
		Editor.$(".selection").remove();
		delete Editor.selection;
	};

	/* ======================== */
	/* ====== GET ACTIVE ====== */
	/* ======================== */

	Tilesets.getActive = function() { 
		return Tilesets.collection[	Editor.$("#tilesets select option:selected").val()]; 
	}

	return Tilesets;
});
