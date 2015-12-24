define(function() {

	var Import = {}, Editor;

	/* ======================== */
	/* ====== INITIALIZE ====== */
	/* ======================== */

	Import.initialize = function() {

		Editor = require("editor");
	};

	/* ==================== */
	/* ====== EVENTS ====== */
	/* ==================== */

	Import.events = {
		
		"change input[name=file_import]": function(e) { Import.cacheFile(e); },
		"click #import": function(e) {

			if (!Import.tmp) { return alert("No file selected"); }

			var type = Import.tmp.name.split(".").pop().toLowerCase(),
			    reader = new FileReader();

			if (window.FileReader) {
				reader.readAsText(Import.tmp);
				reader.onload = function(e) { Import.process(e.target.result, type); };
			} else { Import.process(Import.tmp, type); }
		}
	};

	/* ===================== */
	/* ====== PROCESS ====== */
	/* ===================== */

	Import.process = function(data, type) {

		if (type == "json") {
			data = JSON.parse(data);
		} else {
			var json = {
				tilesets: [],
				layers: [],
				canvas: {}
			};

			Editor.$(data).find("tileset").each(function(i) {
				json.tilesets.push({
					name: $(this).attr("name"),
					image: $(this).attr("image"),
					imagewidth: $(this).attr("imagewidth"),
					imageheight: $(this).attr("imageheight"),
					tilewidth: $(this).attr("tilewidth"),
					tileheight: $(this).attr("tilewidth")
				});
			});

			Editor.$(data).find("layer").each(function(i) {
				json.layers.push({
					name: $(this).attr("name"),
					tileset: $(this).attr("tileset"),
					data: $(this).html().split(",")
				});
			});

			json.canvas = {
				width: Editor.$(data).find("canvas").attr("width"),
				height: Editor.$(data).find("canvas").attr("height")
			};

			data = json;
		}

		Editor.$("#layerlist li, #tilesets option, .layer").remove();

		var error = false;

		data.tilesets.forEach(function(tileset) {

			var id = tileset.name.replace(/[^a-zA-Z]/g, '_');
			var hasSrc = tileset.image.indexOf("data:image") === 0;

			if (!hasSrc && !Editor.$("#tileset_" + id).length) {

				alert(
					"Error: the source for the tileset \"" + tileset.name + "\" " + 
					"is not currently present and is not included in your map file either. " +
					"Importing will be aborted."
				);

				error = true;
				return false;

			} else if (hasSrc && !Editor.$("#tileset_" + id).length) {
				Editor.Tilesets.add(tileset);
			} else if (Editor.$("#tileset_" + id).length) {
				Editor.$("#tilesets select").append("<option>" + tileset.name + "</option>");
			}
		});

		if (error) { return; }
		Editor.Tilesets.set(data.tilesets[0].name);

		data.layers.forEach(function(layer) {

			Editor.Layers.add(layer.name);
			if (!layer.tileset) { return; }

			var tilesetId;

			data.tilesets.forEach(function(v, i) {
				if (v.name == layer.tileset) {
					tilesetId = i;
					return false;
				}
			});

			var tileset = data.tilesets[tilesetId];
			var w = Math.round(data.canvas.width / tileset.tilewidth);
			var tw = tileset.tilewidth;
			var th = tileset.tileheight;
			var className = "ts_" + tileset.name.replace(/[^a-zA-Z]/g, '_');

			Editor.$(".layer[data-name=" + layer.name + "]").addClass(className);
			Editor.$(".layer[data-name=" + layer.name + "]").attr("data-tileset", tileset.name);

			layer.data.forEach(function(coords, i) {

				if (coords == -1) { return true; }

				coords = coords.toString();
				if (coords.length == 1) { coords += ".0"; }

				var x = i%w;
				var y = ~~(i/w);
				var bgpos = coords.split(".");

				var $div = Editor.$("<div>").css({
					position: "absolute",
					left: x * tw,
					top: y * th
				}).attr("data-coords", x + "." + y);

				$div.attr("data-coords-tileset", coords);
				$div.css("background-position", (-(bgpos[0]*tw)) + "px" + " " + (-(bgpos[1]*th)) + "px");

				Editor.$(".layer." + className).append($div);
			});
		});

		Editor.$("#dialog").dialog("close");

		delete Import.tmp;
	};

	Import.cacheFile = function(e) {

		if (!window.FileReader) {
			e.preventDefault();
			Import.tmp = prompt("Your browser doesn't support local file upload.\nPlease insert an image URL below:", "");
		} else if (e.type == "change") {
			Import.tmp = e.target.files[0];
			Editor.$("#dialog input[name=file_overlay]").val(Import.tmp.name);
		}
	};

	return Import;
});