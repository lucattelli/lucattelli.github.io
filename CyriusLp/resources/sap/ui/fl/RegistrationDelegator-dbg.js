/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides object sap.ui.fl.RegistrationDelegator
sap.ui.define([
	"sap/ui/fl/FlexController",
	"sap/ui/core/Component",
	"sap/ui/fl/registry/ChangeHandlerRegistration",
	"sap/ui/fl/ChangePersistenceFactory",
	"sap/ui/fl/PreprocessorImpl",
	"sap/ui/core/mvc/Controller"
], function(FlexController, Component, ChangeHandlerRegistration, ChangePersistenceFactory, PreprocessorImpl, MvcController) {
	"use strict";

	/**
	 * This class takes care of all the registration (hooks) needed to run flex!
	 *
	 * @name sap.ui.fl.RegistrationDelegator
	 * @class
	 * @constructor
	 * @author SAP SE
	 * @version 1.44.8
	 * @experimental Since 1.43.0
	 */
	var RegistrationDelegator = {
	};

	/**
	 * Register the changes in the component
	 *
	 * @public
	 */
	RegistrationDelegator.registerChangesInComponent = function() {
		Component._fnOnInstanceCreated = FlexController.getChangesAndPropagate.bind(FlexController);
	};

	/**
	 * Register change handlers
	 *
	 * @public
	 */
	RegistrationDelegator.registerChangeHandlers = function() {
		ChangeHandlerRegistration.getChangeHandlersOfLoadedLibsAndRegisterOnNewLoadedLibs();
	};

	/**
	 * Register the event handler
	 *
	 * @public
	 */
	RegistrationDelegator.registerLoadComponentEventHandler = function() {
		Component._fnLoadComponentCallback = ChangePersistenceFactory._onLoadComponent.bind(ChangePersistenceFactory);
	};

	/**
	 * Register the extension provider
	 *
	 * @public
	 */
	RegistrationDelegator.registerExtensionProvider = function() {
		MvcController.registerExtensionProvider("sap.ui.fl.PreprocessorImpl");
	};

	/**
	 * Register everything in one call
	 *
	 * @public
	 */
	RegistrationDelegator.registerAll = function() {
		RegistrationDelegator.registerChangeHandlers();
		RegistrationDelegator.registerLoadComponentEventHandler();
		RegistrationDelegator.registerExtensionProvider();
		RegistrationDelegator.registerChangesInComponent();
	};

	return RegistrationDelegator;

}, /* bExport= */true);
