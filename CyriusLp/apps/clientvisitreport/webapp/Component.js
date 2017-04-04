sap.ui.define([
	"sap/ui/core/UIComponent"
], function (UIComponent) {
	"use strict";

	return UIComponent.extend("it.cyrius.clientvisitreport.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {

			// sets the default model for usage in application across views
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				Name : "",
				Job : "",
				Telephone : "",
				Mobile : "",
				Email : ""
			});
			sap.ui.getCore().setModel(oModel);

			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			// create the views based on the url/hash
			this.getRouter().initialize();
		}

	});

});
