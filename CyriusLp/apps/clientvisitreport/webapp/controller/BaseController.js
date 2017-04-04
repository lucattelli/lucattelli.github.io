sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Controller, History) {
	"use strict";

	return Controller.extend("it.cyrius.clientvisitreport.controller.BaseController", {
		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		handlePressHome: function () {
			window.location = window.location.origin + "index.html";
		}

	});

});
