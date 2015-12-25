require.config({

	shim: {
		"jquery-ui": {
			exports: "$",
			deps: [
				"jquery",
				"jquery.mousewheel",
				"jquery.jscrollpane",
				"jquery.draggable"
			]
		},

		"jquery.mousewheel": { deps: ["jquery"] },
		"jquery.jscrollpane": { deps: ["jquery"] },
		"jquery.draggable": { deps: ["jquery"] },

		"underscore": {
			exports: "_"
		}
	},

	paths: {
		"jquery": "libs/jquery",
		"jquery-ui": "libs/jquery-ui",
		"jquery.mousewheel": "plugins/jquery.mousewheel",
		"jquery.jscrollpane": "plugins/jquery.jscrollpane",
		"jquery.draggable": "plugins/jquery.draggable",

		"editor": "modules/editor",
		"underscore": "libs/underscore",
		"text": "plugins/text",
		"templates": "../templates"
		
		
	}
});

require(["jquery-ui", "editor"], function($, Editor) {
	Editor.$ = $;
	$(document).ready(Editor.initialize);
});