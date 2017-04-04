sap.ui.define([
	"it/cyrius/mysignature/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("it.cyrius.mysignature.controller.Form", {

		onInit: function(oEvent) {
			var oModel = sap.ui.getCore().getModel();
			this.getView().setModel(oModel);
			this.getView().bindElement("/");
		},

		generateSignature : function(oEvent) {
			this.getRouter().navTo("yourSignature");
		}
		
	});

});
