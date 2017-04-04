sap.ui.define([
	"it/cyrius/mysignature/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("it.cyrius.mysignature.controller.Signature", {

		onInit: function () {
			var oModel = sap.ui.getCore().getModel();
			var HTML = this.getView().byId("signatureHtmlContent");
			HTML.setContent("<iframe id='sign' src='res/assinatura/index.html" + 
				"?name=" + oModel.getProperty("/Name") + 
				"&job=" + oModel.getProperty("/Job") + 
				"&telephone=" + oModel.getProperty("/Telephone") +
				"&mobile=" + oModel.getProperty("/Mobile") + 
				"&email=" + oModel.getProperty("/Email") +
				"' width='700' height='500' target='search' frameborder='0'></iframe>");
		},

		onNavPress: function () {
			this.getRouter().navTo("Form");
		}
	});
});