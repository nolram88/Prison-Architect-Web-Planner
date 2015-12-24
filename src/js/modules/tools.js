define(function() {

	var Tools = {}, Editor;

	/* ======================== */
	/* ====== INITIALIZE ====== */
	/* ======================== */

	Tools.initialize = function() {

		Editor = require("editor");
	};

	/* ==================== */
	/* ====== EVENTS ====== */
	/* ==================== */

	Tools.events = {
		"click *[data-tool]": function(e) { Tools.select(e); }
	};

	/* ==================== */
	/* ====== SELECT ====== */
	/* ==================== */

	Tools.select = function(e) {
		var $target = Editor.$(e.currentTarget);

		Editor.$("#tools").find("span").removeClass("active");
		$target.addClass("active");
		Editor.tool = $target.attr("data-tool");

		if (Editor.tool == "erase") { Editor.Tilesets.resetSelection(); }
	};

	return Tools;
});