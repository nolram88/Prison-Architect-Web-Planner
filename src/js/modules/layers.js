define(function() {

	var Layers = {}, Editor;

	/* ======================== */
	/* ====== INITIALIZE ====== */
	/* ======================== */

	Layers.initialize = function() {

		Editor = require("editor");

		// Make layers sortable
		Editor.$("#layerlist").sortable({
			axis: "y",
			mouseButton: 1,
			appendTo: document.body,
			update: this.sortByIndex,
			containment: "#layers > div"
		});

		// Add predefined layers
		this.add("utilities");
		this.add("groundfloor");
		this.add("objects");
	};

	/* ==================== */
	/* ====== EVENTS ====== */
	/* ==================== */

	Layers.events = {
		
		"click #layer-clear": function(e) { Layers.clear(e); },
		"click #layer-rename": function(e) { Layers.rename(e); },
		"click #layer-remove": function(e) { Layers.remove(e); },
		"click #layers-add": function(e) { Layers.add(); },

		// Layer UI functionality
		"click #layerlist li": function(e) {
			Editor.$("#layerlist li").removeClass("active");
			Editor.$(e.currentTarget).addClass("active");
		},

		"click #layerlist li span:first-child": function(e) { Layers.toggleVisibility(e); },
		"click #layerlist li span:last-child": function(e) { Layers.openContextmenu(e); },

		"mousedown": function(e) {
			if ($(e.target).parent().attr("id") != "contextmenu") {
				if ($("body #contextmenu").length)
				{ $("body #contextmenu").remove(); }
			}
		}
	};

	/* ================= */
	/* ====== ADD ====== */
	/* ================= */

	Layers.add = function(name) {

		var id = 0, ids = [];

		if ($("#layerlist li").length) {
			Editor.$("#layerlist li").each(function() { ids.push(+this.getAttribute("data-id")); });
			while (ids.indexOf(id) != -1) { id++; }
		}

		if (!name) { name = window.prompt("Layer name: (a-z, A-Z, _, -)"); }
		if (!name || !name.match(/^[a-zA-Z_-][a-zA-Z0-9_-]{2,}$/)) {
			if (name) { alert("Name invalid or too short!"); }
			return;
		}

		Editor.$("#layerlist li").removeClass("active");
		Editor.$("#layerlist").append("<li class='active' data-id='" + id + "'><span class='fa fa-eye'></span> " + name + "<span class='fa fa-cog'></span></li>");
		Editor.$("#layerlist").sortable("refresh");

		// Create and append an associated layer div inside the canvas
		Editor.$("#tiles").append("<div class='layer' data-name='" + name + "' data-id='" + id + "'></div>");
		Layers.sortByIndex();
	};

	/* ==================== */
	/* ====== REMOVE ====== */
	/* ==================== */

	Layers.remove = function() {

		var name = $(Layers.contextTarget).text().trim(),
		    id = $(Layers.contextTarget).attr("data-id");

		if (confirm("Remove \"" + name + "\" ?")) {

			// TODO make this possible?
			if ($("#layerlist li").length == 1) {
				alert("Cannot remove last layer!");
				return;
			}

			Editor.$(Layers.contextTarget).remove();
			Editor.$("#contextmenu").remove();
			Editor.$(".layer[data-id=" + id + "]").remove();
		}
	};

	/* =================== */
	/* ====== CLEAR ====== */
	/* =================== */

	Layers.clear = function(e) {

		var name = $(Layers.contextTarget).text().trim(),
		    id = $(Layers.contextTarget).attr("data-id");

		if (confirm("Remove all tiles from \"" + name + "\" ?")) {
			Editor.$(".layer[data-id=" + id + "]").html("").attr({
				"data-tileset": "",
				"class": "layer"
			});

			Editor.$("#contextmenu").remove();
		}
	};

	/* ==================== */
	/* ====== RENAME ====== */
	/* ==================== */

	Layers.rename = function(e) {

		var name = $(Layers.contextTarget).text().trim(),
		    id = $(Layers.contextTarget).attr("data-id"),
		    newName = prompt("Enter new name for \"" + name + "\":");

		if (!newName || newName.length < 3) {
			if (newName) { alert("Name too short!"); }
			return;
		}

		// Rename associated div too
		Editor.$(".layer[data-id=" + id + "]").attr("data-name", newName);

		// Create and append a new layer element to the toolbar
		Editor.$(Layers.contextTarget).html("<span class='fa fa-eye'></span> " + newName + "<span class='fa fa-cog'></span>");
		Editor.$("#contextmenu").remove();
	};

	/* ======================== */
	/* ====== GET ACTIVE ====== */
	/* ======================== */

	Layers.getActive = function() {

		var id = $("#layerlist li.active").attr("data-id");

		return { 
			id: $("#layerlist li.active").attr("data-id"),
			elem: $(".layer[data-id=" + id + "]")[0]
		}
	};

	/* =========================== */
	/* ====== SORT BY INDEX ====== */
	/* =========================== */

	// TODO Switch z-index while sorting

	Layers.sortByIndex = function(e, ui) {

		Editor.$("#layerlist li").each(function(i) {
			var id = $(this).attr("data-id");
			Editor.$(".layer[data-id=" + id + "]").css("z-index", i);
		});
	};

	/* =============================== */
	/* ====== TOGGLE VISIBILITY ====== */
	/* =============================== */

	Layers.toggleVisibility = function(e) {

		var visible = $(e.currentTarget).hasClass("fa fa-eye"),
		    className = visible ? "fa fa-eye-slash" : "fa fa-eye",
		    id = $(e.currentTarget).parent().attr("data-id");

		Editor.$(e.currentTarget).attr("class", "icon " + className);
		Editor.$(".layer[data-id=" + id + "]").toggle(!visible);
	};

	/* ============================== */
	/* ====== OPEN CONTEXTMENU ====== */
	/* ============================== */

	Layers.openContextmenu = function(e) {

		Layers.contextTarget = $(e.currentTarget).parent();

		Editor.$.get("templates/cm_layer.tpl", function(data) {
			Editor.$("body").append(data);
			Editor.$("#contextmenu").css("left", e.pageX);
			Editor.$("#contextmenu").css("top", e.pageY);
		});
	};

	return Layers;
});