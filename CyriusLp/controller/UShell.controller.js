sap.ui.define([
		'jquery.sap.global',
		'sap/m/MessageToast',
		'sap/ui/core/Fragment',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel'
	], function(jQuery, MessageToast, Fragment, Controller, JSONModel) {
	"use strict";

	var ControllerController = Controller.extend("sap.bc.ui5_ui5.ui2.ushell.shells.abap.controller.UShell", {
		onInit: function() {
			var oModel = new JSONModel();
			oModel.loadData("model/tiles.json", "", false);
			this.getView().setModel(oModel);
			var oJson = this.getView().getModel().getData();
			var tileContainer = this.getView().byId("TileContainer");
			tileContainer.removeAllContent();
			for (var i = 0; i < oJson.tileset.length; i++) {
				
				var panel = new sap.m.Panel({
					headerText: oJson.tileset[i].headerText,
					width: "auto",
					backgroundDesign: "Transparent"
				});
				panel.addStyleClass("sapUiNoContentPadding");
				panel.addStyleClass("sapUiNoMarginBegin");
				panel.addStyleClass("sapUiLargeMarginTop");

				for (var j = 0; j < oJson.tileset[i].tiles.length; j++) {
					var tile = new sap.m.GenericTile({
						header : oJson.tileset[i].tiles[j].header,
						subheader: oJson.tileset[i].tiles[j].subheader,
						press: this.getPressAction(oJson.tileset[i].tiles[j].press)
					});
					tile.addStyleClass("sapUiTinyMarginBegin");
					tile.addStyleClass("sapUiTinyMarginTop");
					tile.addStyleClass("tileLayout");

					var tileContent = new sap.m.TileContent({
						unit : oJson.tileset[i].tiles[j].unit,
						footer : oJson.tileset[i].tiles[j].footer
					});
					var imageContent = new sap.m.ImageContent({
						src: oJson.tileset[i].tiles[j].icon
					});
					tileContent.setContent(imageContent);
					tile.addTileContent(tileContent);

					panel.addContent(tile);
				}
				tileContainer.addContent(panel);
			}

/*
			var tile = new sap.m.GenericTile({
				header : "{i18n>apps.mysignature}"
			});
			tile.addStyleClass("sapUiTinyMarginBegin");
			tile.addStyleClass("sapUiTinyMarginTop");
			tile.addStyleClass("tileLayout");

			var tileContent = new sap.m.TileContent();
			var imageContent = new sap.m.ImageContent({
				src: "sap-icon://signature"
			});
			tileContent.setContent(imageContent);
			tile.addTileContent(tileContent);
			
			var panel = new sap.m.Panel({
				headerText: "{i18n>tilegroup.Employee}",
				width: "auto",
				backgroundDesign: "Transparent"
			});
			panel.addStyleClass("sapUiNoContentPadding");
			panel.addStyleClass("sapUiNoMarginBegin");
			panel.addStyleClass("sapUiLargeMarginTop");
			panel.addContent(tile);

			var tileContainer = this.getView().byId("TileContainer");
			tileContainer.removeAllContent();
			tileContainer.addContent(panel);
*/

		},
		getPressAction: function(press) {
			if (press.type === "app") {
				return function() { window.location = window.location.origin + press.value; };
			} else if (press.type === "url") {
				return function() { window.location = press.value; };
			} else {
				return false;
			}
		}
	});

	return ControllerController;

});
