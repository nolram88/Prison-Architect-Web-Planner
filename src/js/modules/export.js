define(function() {

	var Export = {}, Editor;

	/* ======================== */
	/* ====== INITIALIZE ====== */
	/* ======================== */

	Export.initialize = function() {

		Editor = require("editor");
	};

	/* ==================== */
	/* ====== EVENTS ====== */
	/* ==================== */

	Export.events = {
		"click #export": function(e) { Export.process(e); }
	};

	/* ===================== */
	/* ====== PROCESS ====== */
	/* ===================== */

	// Will need to 

	Export.process = function() {

		var type = Editor.$("select[name=export_format]").val(),
			include_base64 = Editor.$("select[name=include_base64]").val() == "yes",
			format_output = Editor.$("select[name=format_output]").val() == "yes",
		    tileset = Editor.activeTileset,
		    anchor = document.createElement("a"),

		    w = Editor.$("#canvas").width() / tileset.tilewidth,
		    h = Editor.$("#canvas").height() / tileset.tileheight,

		    output, layer, coords, y, x, query, elem, data;

		anchor.download = "map." + type.toLowerCase();

		//I kept these since they should work
		if (type == "JSON") {
			
			output = {};
			output.layers = [];

			Editor.$(".layer").each(function() {

				layer = {
					name: Editor.$(this).attr("data-name"),
					tileset: Editor.$(this).attr("data-tileset"),
					data: []
				};

				for (y = 0; y < h; y++) {
					for (x = 0; x < w; x++) {
						query = Editor.$(this).find("div[data-coords='" + x + "." + y + "']");
						coords = query.length ? parseFloat(query.attr("data-coords-tileset"), 10) : -1;
						layer.data.push(coords);
					}
				}

				output.layers.push(layer);
			});

			output.tilesets = [];

			for (tileset in Editor.Tilesets.collection) {
				tileset = Editor.Tilesets.collection[tileset];

				output.tilesets.push({
					name: tileset.name,
					image: include_base64 ? tileset.base64 : tileset.name,
					imagewidth: tileset.width,
					imageheight: tileset.height,
					tilewidth: tileset.tilewidth,
					tileheight: tileset.tileheight
				});
			}

			output.canvas = {
				width: window.parseInt(Editor.$("#canvas").css("width"), 10),
				height: window.parseInt(Editor.$("#canvas").css("height"), 10)
			};

			output = JSON.stringify(output);
			anchor.href = "data:application/json;charset=UTF-8;," + encodeURIComponent(output);

		} else if (type == "XML") {

			output = Editor.$("<root>").append("<layers>");

			Editor.$(".layer").each(function() {

				layer = Editor.$("<layer>");
				layer.attr({
					name: Editor.$(this).attr("data-name"),
					tileset: Editor.$(this).attr("data-tileset"),
				});

				data = [];

				for (y = 0; y < h; y++) {
					for (x = 0; x < w; x++) {
						query = Editor.$(this).find("div[data-coords='" + x + "." + y + "']");
						coords = query.length ? query.attr("data-coords-tileset") : "-1";
						if (x == w-1 && format_output) { coords += "\r\n"; }
						data.push(coords);
					}
				}

				layer.text(data.join(","));
				output.find("layers").append(layer);
			});

			output.append("<tilesets>");

			for (tileset in Editor.Tilesets.collection) {
				tileset = Editor.Tilesets.collection[tileset];

				elem = Editor.$("<tileset>");

				elem.attr({
					name: tileset.name,
					image: include_base64 ? tileset.base64 : tileset.name,
					imagewidth: tileset.width,
					imageheight: tileset.height,
					tilewidth: tileset.tilewidth,
					tileheight: tileset.tileheight
				});

				output.find("tilesets").append(elem);
			}

			output.append(
				"<canvas " +
					"width=\"" + window.parseInt(Editor.$("#canvas").css("width"), 10) + "\"" +
					"height=\"" + window.parseInt(Editor.$("#canvas").css("height"), 10) + "\"" +
				" />"
			);

			output = encodeURIComponent((new XMLSerializer()).serializeToString(output[0]));
			anchor.href = "data:text/xml;charset=UTF-8;," + output;
		

		} if (type == "PASAVE") {
			//Havent gotten started yet
			//basically take sprite coordinates are what will be in the data layer
			//take those and compare against Tilesets.assetmap to get the associated object
			//then build a block for the .prison file like 
			//"BEGIN "15 20"      Mat Sand  Con 39.19983  END"
			//This the first 2 numbers are the coordinates in the prison map the next pairs
			//are basically the objects in that spot layered from left to right

			output = {};
			output.layers = [];

			Editor.$(".layer").each(function() {

				layer = {
					name: Editor.$(this).attr("data-name"),
					tileset: Editor.$(this).attr("data-tileset"),
					data: []
				};

				for (y = 0; y < h; y++) {
					for (x = 0; x < w; x++) {
						query = Editor.$(this).find("div[data-coords='" + x + "." + y + "']");
						coords = query.length ? parseFloat(query.attr("data-coords-tileset"), 10) : -1;
						layer.data.push(coords);
					}
				}

				output.layers.push(layer);
			});

			output.tilesets = [];

			for (tileset in Editor.Tilesets.collection) {
				tileset = Editor.Tilesets.collection[tileset];

				output.tilesets.push({
					name: tileset.name,
					image: include_base64 ? tileset.base64 : tileset.name,
					imagewidth: tileset.width,
					imageheight: tileset.height,
					tilewidth: tileset.tilewidth,
					tileheight: tileset.tileheight
				});
			}

			output.canvas = {
				width: window.parseInt(Editor.$("#canvas").css("width"), 10),
				height: window.parseInt(Editor.$("#canvas").css("height"), 10)
			};

			output = JSON.stringify(output);
			anchor.href = "data:application/json;charset=UTF-8;," + encodeURIComponent(output);

		}

		anchor.click();
	};

	return Export;
});