define([
	"underscore",
	"modules/utils",
	"modules/menubar",
	"modules/tools",
	"modules/canvas",
	"modules/tilesets",
	"modules/layers",
	"modules/import",
	"modules/export"
], function() {

	var Editor = {};
	var args = arguments;
	var argNames = ["_", "Utils", "Menubar", "Tools", "Canvas", "Tilesets", "Layers", "Export", "Import"];

	Editor.tool = "draw";
	Editor.keystatus = {};
	Editor.mousedown = false;
	Editor.selection = null;

	/* ======================== */
	/* ====== INITIALIZE ====== */
	/* ======================== */

	Editor.initialize = function() {

		// Initialize sub modules
		argNames.forEach(function(v, i) {

			Editor[v] = args[i];

			if (typeof Editor[v].initialize == "function")
			{ Editor[v].initialize(); }
		});

		// Register module events
		Editor.registerEvents();

		// Menubar interaction
		$("#menubar > li").on("click mouseover", function(e) {
			if (e.type == "mouseover" && !$("#menubar > li.open").length) { return; }
			$("#menubar > li").removeClass("open");
			$(e.currentTarget).addClass("open");
		});

		$("body").on("mousedown", function(e) {
			if (!$("#menubar").find(e.target).length) {
				$("#menubar > li").removeClass("open");
			}
		});

		// Make toolbar resizable
		$("#toolbar").resizable({
			minWidth: 250,
			mouseButton: 1,
			handles: "e",
			alsoResize: "#tileset, #tileset .jspPane, #tileset .jspContainer, #tileset .jspHorizontalBar *",
			stop: function() { $("#tileset").jScrollPane(); }
		});

		// Global mouse status
		$(document).on("mousedown mouseup", function(e) {
			Editor.mousedown = e.type == "mousedown" && e.which == 1;
		});

		// Global input status
		$(document).on("keydown keyup", function(e) {
			var c = e.keyCode, down = e.type == "keydown";
			
			if (e.altKey) { Editor.keystatus.altKey = down; }
			if (e.ctrlKey) { Editor.keystatus.ctrlKey = down; }
			if (e.shiftKey) { Editor.keystatus.shiftKey = down; }
			if (c == 32) { Editor.keystatus.spacebar = down; }
		});

		// Disable selection
		$("#tileset, #canvas_wrapper").disableSelection();

		// Hide the loading screen
		$("#loading_screen").delay(1000).fadeOut();
	};


	/* ============================= */
	/* ====== REGISTER EVENTS ====== */
	/* ============================= */

	Editor.registerEvents = function() {

		// Register module events
		var pair, type, selector;

		argNames.forEach(function(v) {
			if (Editor[v].events) {
				for (var evt in Editor[v].events) {
					pair = evt.split(" ");
					type = pair.shift().replace(/\|/g, " ");
					selector = pair.join(" ");
					$("body").on(type, selector, Editor[v].events[evt]);
				}
			}
		});
	};

	return Editor;
});