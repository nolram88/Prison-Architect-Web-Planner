define(function() {

	var Canvas = {}, Editor;

	Canvas.cursor = [];
	Canvas.cursor.last = {};

	/* ======================== */
	/* ====== INITIALIZE ====== */
	/* ======================== */

	Canvas.initialize = function() {

		Editor = require("editor");
	
		Editor.$("#canvas").draggable({
			mouseButton: 1,
			cursor: "move",
			start: function() {
				if (!Editor.keystatus.spacebar) {
					Editor.$("body").css("cursor", "");
					return false;
				}
			}
		});

		this.reposition();
		Editor.$("#canvas").fadeIn();
		Editor.$(window).on("resize", this.reposition);

		
	};

	/* ==================== */
	/* ====== EVENTS ====== */
	/* ==================== */

	Canvas.events = {

		// Selection movement
		"mousedown|mousemove|mouseup #canvas": function(e) {

			if (!Editor.activeTileset) { return; }
			if (e.which == 3) { Editor.Tilesets.resetSelection(); return; }

			var tileset = Editor.activeTileset,
		        tw = tileset.tilewidth,
		        th = tileset.tileheight,

			    offset = Editor.$("#canvas").offset(),
			    x = Math.floor((e.pageX - offset.left) / tw),
			    y = Math.floor((e.pageY - offset.top) / th);

			Canvas.cursor[0] = x;
			Canvas.cursor[1] = y;

			Editor.$(".selection").css({
				top: y * th,
				left: x * tw
			});

			if (!Editor.keystatus.spacebar) {

				if (Editor.selection && ((e.type == "mousedown" && e.which == 1) || Editor.mousedown)) {

					if (Editor.tool == "draw") { 

						// Prevent redrawing of previous drawn tiles.
						// Start x, Start x, End x, End y
				        var sx = Editor.selection[0][0],
					        sy = Editor.selection[0][1],
					        ex = Editor.selection[1][0],
					        ey = Editor.selection[1][1],

					        // Length for iterated x and y variables
					        lx = ex - sx,
					        ly = ey - sy;

					    // Iterate through selected tiles check to see if they have been previously drawn.
						for (y = 0; y <= ly; y++) {
							for (x = 0; x <= lx; x++) {
								if ([Canvas.cursor[0]+x,Canvas.cursor[1]+y] in Canvas.cursor.last) { return ;}
							}
						}

						Canvas.draw();

					}

					else if (Editor.tool == "fill" && e.type == "mousedown") { Canvas.fill(); }	
				}

				else if (Editor.tool == "erase" && Editor.mousedown) { Canvas.erase(); }
				else if (!Editor.selection) { Canvas.makeSelection(e); }

				//On mouseup with selection clear last draw cache.
				if (Editor.selection && !Editor.mousedown){
					Canvas.cursor.last = {};
				}
			}
		}
	};

	/* =================== */
	/* ====== ERASE ====== */
	/* =================== */

	Canvas.erase = function() {

		var layer = Editor.Layers.getActive(),

		    // Cursor position
		    cx = this.cursor[0],
		    cy = this.cursor[1];

		$tile = Editor.$(layer.elem).find("div[data-coords='" + cx + "." + cy + "']");
		if ($tile.length) { $tile.remove(); }
	};

	/* ================== */
	/* ====== DRAW ====== */
	/* ================== */

	Canvas.draw = function() {

		var tileset = Editor.activeTileset,
		    layer = Editor.Layers.getActive(),

		    // Cursor position
		    cx = this.cursor[0],
		    cy = this.cursor[1],

		    // Tilsize
		    tw = tileset.tilewidth,
		    th = tileset.tileheight,

		    // Start x, Start x, End x, End y
		    sx = Editor.selection[0][0],
		    sy = Editor.selection[0][1],
		    ex = Editor.selection[1][0],
		    ey = Editor.selection[1][1],

		    // Length for iterated x and y variables
		    lx = ex - sx,
		    ly = ey - sy,

		    // Background position
		    bgpos = Editor.$(".selection").css("background-position").split(" "),
		    bgx = parseInt(bgpos[0], 10),
		    bgy = parseInt(bgpos[1], 10),

		    // Tile position on the canvas
		    pos_x, pos_y, coords,

		    // Misc
		    $div, x, y, query, cxp, cyp, $tile, top, left;

		// TODO optimize this:
		// Checks if the current tileset differs
		// from the one used on the current layer
		if (!Editor.$(layer.elem).attr("data-tileset")) {

			Editor.$(layer.elem).addClass("ts_" + tileset.id);
			Editor.$(layer.elem).attr("data-tileset", tileset.name);

		} else if (Editor.$(layer.elem).attr("data-tileset") != tileset.name) {

			if (!Editor.$("#canvas .warning:visible").length)
			{ Editor.$("#canvas .warning").html("Cannot use different tilesets on one layer, please clear the layer first.").show().delay(2000).fadeOut(1000); }
			
			return;
		}

		if (Editor.selection.custom) {

			cxp = cx*tw;
			cyp = cy*th;

			Editor.$(".selection").find("div").each(function() {
				top = parseInt(Editor.$(this).css("top"), 10);
				left = parseInt(Editor.$(this).css("left"), 10);

				$tile = Editor.$(this).clone();
				$tile.css({
					top: top + cyp,
					left: left + cxp
				});

				coords = ((left+cxp)/tw) + "." + ((top+cyp)/th);
				query = Editor.$(layer.elem).find("div[data-coords='" + coords + "']");

				if (query.length) {
					Editor.$(query).attr("style", $tile.attr("style"));
				} else {
					$tile.attr("data-coords", coords);
					Editor.$(layer.elem).append($tile);
				}
			});

		} else {
			// Iterate through selected tiles
			for (y = 0; y <= ly; y++) {
				for (x = 0; x <= lx; x++) {
					
					pos_x = cx + x;
					pos_y = cy + y;
					Canvas.cursor.last[[pos_x,pos_y]] = true;
					coords = pos_x + "." + pos_y;
					query = Editor.$(layer.elem).find("div[data-coords='" + coords + "']");

					// Update existing tile or create a new one and position it
					$div = query.length ? query : Editor.$("<div>").css({
						position: "absolute",
						left: pos_x * tw,
						top: pos_y * th
					}).attr("data-coords", coords);


					// Set/update the tileset information
					$div.attr("data-coords-tileset", (Math.abs(bgx/tw)+x) + "." + (Math.abs(bgy/th)+y));
					$div.css("background-position", (bgx-(x*tw)) + "px" + " " + (bgy-(y*th)) + "px");

					// Append the tile if it didn't on that coordinate
					if (!query.length) { Editor.$(layer.elem).append($div); }
				}
			}
		}
	};

	/* ================== */
	/* ====== FILL ====== */
	/* ================== */

	// TODO throw this in a webworker

	Canvas.fill = function(e) {

		var tileset = Editor.activeTileset,
		    layer = Editor.Layers.getActive(),

		    // Cursor position
		    cx = this.cursor[0],
		    cy = this.cursor[1],

		    // Tilsize
		    tw = tileset.tilewidth,
		    th = tileset.tileheight,

		    // Start x, Start x, End x, End y
		    sx = Editor.selection[0][0],
		    sy = Editor.selection[0][1],
		    ex = Editor.selection[1][0],
		    ey = Editor.selection[1][1],

		    // Field size in tiles
		    fx = Editor.$("#canvas").width()/tw,
		    fy = Editor.$("#canvas").height()/th,

		    bgpos = Editor.$(".selection").css("background-position").split(" "),
		    bgx = parseInt(bgpos[0], 10),
		    bgy = parseInt(bgpos[1], 10),

		    query = Editor.$(layer.elem).find("div[data-coords='" + cx + "." + cy + "']"),
		    search_bgpos = query.length ? query.attr("data-coords-tileset") : null,
		    replace_bgpos = Math.abs(bgx/tw) + "." + Math.abs(bgy/th),
		    
		    documentFragment = document.createDocumentFragment(),
		    closedList = [];

		    fill_recursive = function(ox, oy) {

				var coords = [
					[ox, oy-1], // top
					[ox, oy+1], // bottom
					[ox-1, oy], // left
					[ox+1, oy]  // right
				], $elem, x, y;

				coords.forEach(function(arr) {

					x = arr[0],
					y = arr[1];

					if (x < 0 || x >= fx || y < 0 || y >= fy) { return; }
					if (closedList.indexOf(x + "." + y) != -1) { return; }

					$elem = Editor.$(layer.elem).find("div[data-coords='" + arr[0] + "." + arr[1] + "']");

					if ((!$elem.length && !search_bgpos) || $elem.attr("data-coords-tileset") == search_bgpos) {

						if (!$elem.length) {
							$elem = Editor.$("<div>").css({
								position: "absolute",
								left: x * tw,
								top: y * th
							})

							.attr("data-coords", x + "." + y);
							documentFragment.appendChild($elem[0]);
						}

					$elem.css("background-position", bgx + "px" + " " + bgy + "px");
					$elem.attr("data-coords-tileset", replace_bgpos);

						closedList.push(x + "." + y);
						fill_recursive(x, y);
					}
				});
			};

		// TODO unify this
		if (!Editor.$(layer.elem).attr("data-tileset")) {

			Editor.$(layer.elem).addClass("ts_" + tileset.id);
			Editor.$(layer.elem).attr("data-tileset", tileset.name);

		} else if (Editor.$(layer.elem).attr("data-tileset") != tileset.name) {

			if (!Editor.$("#canvas .warning:visible").length)
			{ Editor.$("#canvas .warning").html("Cannot use different tilesets on one layer, please clear the layer first.").show().delay(2000).fadeOut(1000); }
			
			return;
		}

		// Start the recursive search
		fill_recursive(cx, cy);
		Editor.$(layer.elem).append(documentFragment);
	};

	/* ============================ */
	/* ====== MAKE SELECTION ====== */
	/* ============================ */

	Canvas.makeSelection = function(e) {

		var tileset, tw, th, ex, ey, $selection, layer, top, left, $tile;

		Editor.Utils.makeSelection(e, "#canvas");

		if (e.type == "mousedown") {

			Editor.$(".selection").css("background-color", "rgba(0, 0, 0, 0.3)");

		} else if (e.type == "mouseup") {

			tileset = Editor.activeTileset;
			tw = tileset.tilewidth;
			th = tileset.tileheight;

			sx = Editor.selection[0][0] * tw;
			sy = Editor.selection[0][1] * th;
			ex = Editor.selection[1][0] * tw;
			ey = Editor.selection[1][1] * th;

			$selection = Editor.$(".selection");
			layer = Editor.Layers.getActive();

			// Find all elements that are in range of
			// the selection and append a copy of them
			Editor.$(layer.elem).find("div").each(function() {

				top = parseInt(Editor.$(this).css("top"), 10);
				left = parseInt(Editor.$(this).css("left"), 10);

				if (left >= sx && left <= ex && top >= sy && top <= ey) {
					$tile = Editor.$(this).clone();

					$tile.css({
						top: top - sy,
						left: left - sx
					});
						
					$selection.append($tile);
				}
			});

			$selection.css("background-color", "transparent");
			$selection.addClass(Editor.$(layer.elem).attr("class").replace("layer", "nobg"));
			Editor.selection.custom = true;
		}
	};

	/* ======================== */
	/* ====== REPOSITION ====== */
	/* ======================== */

	Canvas.reposition = function(e) {
		var extra = Editor.$("#toolbar").width() + Editor.$("#canvas").width() < Editor.$(window).width() ? Editor.$("#toolbar").width() / 2 : 0,
		    left = (Editor.$(window).width() / 2) - (Editor.$("#canvas").width() / 2) + extra,
		    top = (Editor.$(window).height() / 2) - (Editor.$("#canvas").height() / 2);

		Editor.$("#canvas").css({ top: top, left: left });
	};

	/* ========================= */
	/* ====== UPDATE GRID ====== */
	/* ========================= */

	// Creates a base64 image with two borders
	// resulting in a grid when used as a repeated background
	
	Canvas.updateGrid = function() {

		var buffer = document.createElement("canvas"),
		    bfr = buffer.getContext("2d"),
		    tileset = Editor.activeTileset,
		    tw = tileset.tilewidth,
		    th = tileset.tileheight;

		buffer.width = tw;
		buffer.height = th;

		bfr.fillStyle = "rgba(0, 0, 0, 0.1)";
		bfr.fillRect(0, th-1, tw, 1);
		bfr.fillRect(tw-1, 0, 1, th);

		Editor.$("#canvas").css("backgroundImage", "url(" + buffer.toDataURL() + ")");
		Editor.$(".selection").css({
			width: tw,
			height: th
		});
	};

	return Canvas;
});