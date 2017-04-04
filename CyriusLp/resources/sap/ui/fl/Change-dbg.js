/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2016 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/base/EventProvider", "sap/ui/fl/Utils", "sap/ui/fl/registry/Settings"
], function(EventProvider, Utils, Settings) {

	"use strict";

	/**
	 * A change object based on the json data with dirty handling.
	 * @constructor
	 * @alias sap.ui.fl.Change
	 * @param {object} oFile - file content and admin data
	 * @experimental Since 1.25.0
	 * @author SAP SE
	 * @version 1.44.8
	 */
	var Change = function(oFile) {
		EventProvider.apply(this);
		if (typeof (oFile) !== "object") {
			Utils.log.error("Constructor : sap.ui.fl.Change : oFile is not defined");
		}

		this._oDefinition = oFile;
		this._oOriginDefinition = JSON.parse(JSON.stringify(oFile));
		this._sRequest = '';
		this._bIsDeleted = false;
		this._bUserDependent = (oFile.layer === "USER");
	};

	Change.events = {
		markForDeletion: "markForDeletion"
	};

	Change.prototype = jQuery.sap.newObject(EventProvider.prototype);

	/**
	 * Returns if the change protocol is valid
	 * @returns {boolean} Change is valid (mandatory fields are filled, etc)
	 *
	 * @public
	 */
	Change.prototype.isValid = function() {
		var bIsValid = true;

		if (typeof (this._oDefinition) !== "object") {
			bIsValid = false;
		}
		if (!this._oDefinition.fileType) {
			bIsValid = false;
		}
		if (!this._oDefinition.fileName) {
			bIsValid = false;
		}
		if (!this._oDefinition.changeType) {
			bIsValid = false;
		}
		if (!this._oDefinition.layer) {
			bIsValid = false;
		}
		if (!this._oDefinition.originalLanguage) {
			bIsValid = false;
		}

		return bIsValid;
	};

	/**
	 * Returns if the change is of type variant
	 * @returns {boolean} fileType of the change document is a variant
	 *
	 * @public
	 */
	Change.prototype.isVariant = function() {
		return this._oDefinition.fileType === "variant";
	};

	/**
	 * Returns the change type
	 *
	 * @returns {String} Changetype of the file, for example LabelChange
	 * @public
	 */
	Change.prototype.getChangeType = function() {
		if (this._oDefinition) {
			return this._oDefinition.changeType;
		}
	};

	/**
	 * Returns the the original language in ISO 639-1 format
	 *
	 * @returns {String} Original language
	 *
	 * @public
	 */
	Change.prototype.getOriginalLanguage = function() {
		if (this._oDefinition && this._oDefinition.originalLanguage) {
			return this._oDefinition.originalLanguage;
		}
		return "";
	};

	/**
	 * Returns the the context in which the change should be applied
	 *
	 * @returns {Object[]} context - List of objects determine the context
	 * @returns {string} selector  - names the key of the context
	 * @returns {string} operator - instruction how the values should be compared
	 * @returns {Object} value - values given to the comparison
	 *
	 * @public
	 */
	Change.prototype.getContext = function() {
		if (this._oDefinition && this._oDefinition.context) {
			return this._oDefinition.context;
		}
		return "";
	};

	/**
	 * Returns the abap package name
	 * @returns {string} ABAP package where the change is assigned to
	 *
	 * @public
	 */
	Change.prototype.getPackage = function() {
		return this._oDefinition.packageName;
	};

	/**
	 * Returns the namespace. The changes' namespace is
	 * also the namespace of the change file in the repository.
	 *
	 * @returns {String} Namespace of the change document
	 *
	 * @public
	 */
	Change.prototype.getNamespace = function() {
		return this._oDefinition.namespace;
	};

	/**
	 * Returns the id of the change
	 * @returns {string} Id of the change document
	 *
	 * @public
	 */
	Change.prototype.getId = function() {
		return this._oDefinition.fileName;
	};

	/**
	 * Returns the content section of the change
	 * @returns {string} Content of the change document. The content structure can be any JSON.
	 *
	 * @public
	 */
	Change.prototype.getContent = function() {
		return this._oDefinition.content;
	};

	/**
	 * Sets the object of the content attribute
	 *
	 * @param {object} oContent The content of the change document. Can be any JSON object.
	 *
	 * @public
	 */
	Change.prototype.setContent = function(oContent) {
		this._oDefinition.content = oContent;
	};

	/**
	 * Returns the selector from the file content
	 * @returns {object} selector in format selectorPropertyName:selectorPropertyValue
	 *
	 * @public
	 */
	Change.prototype.getSelector = function() {
		return this._oDefinition.selector;
	};

	/**
	 * Returns the text in the current language for a given id
	 *
	 * @param {string} sTextId
	 * 				text id which was used as part of the <code>oTexts</code> object
	 * @returns {string} The text for the given text id
	 *
	 * @function
	 */
	Change.prototype.getText = function(sTextId) {
		if (typeof (sTextId) !== "string") {
			Utils.log.error("sap.ui.fl.Change.getTexts : sTextId is not defined");
		}
		if (this._oDefinition.texts) {
			if (this._oDefinition.texts[sTextId]) {
				return this._oDefinition.texts[sTextId].value;
			}
		}
		return "";
	};

	/**
	 * Sets the new text for the given text id
	 *
	 * @param {string} sTextId
	 * 				text id which was used as part of the <code>oTexts</code> object
	 * @param {string} sNewText the new text for the given text id
	 *
	 * @public
	 */
	Change.prototype.setText = function(sTextId, sNewText) {
		if (typeof (sTextId) !== "string") {
			Utils.log.error("sap.ui.fl.Change.setTexts : sTextId is not defined");
			return;
		}
		if (this._oDefinition.texts) {
			if (this._oDefinition.texts[sTextId]) {
				this._oDefinition.texts[sTextId].value = sNewText;
			}
		}
	};

	/**
	 * Returns true if the current layer is the same as the layer
	 * in which the change was created or the change is from the
	 * end-user layer and for this user created.
	 * @returns {boolean} is the change document read only
	 *
	 * @public
	 */
	Change.prototype.isReadOnly = function() {
		var bIsReadOnly = this._isReadOnlyDueToLayer();
		if ( !bIsReadOnly ){
			bIsReadOnly = this._isReadOnlyWhenNotKeyUser();
		}
		return bIsReadOnly;
	};

	/**
	 * Checks if the change is read-only
	 * because the current user is not a key user and the change is "shared"
	 * @returns {boolean} Flag whether change is read only
	 *
	 * @private
	 */
	Change.prototype._isReadOnlyWhenNotKeyUser = function() {
		var bIsReadOnly = false;
		if ( !this.isUserDependent() ){
			var sReference = this.getDefinition().reference;
			if ( sReference ){
				var oSettings = Settings.getInstanceOrUndef(sReference);
				if ( oSettings ){
					var bIsKeyUser = oSettings.isKeyUser();
					if ( bIsKeyUser === false ){
						bIsReadOnly = true;
					}
				}
			}
		}
		return bIsReadOnly;
	};

	/**
	 * Returns true if the label is read only. The label might be read only because of the current layer or because the logon language differs from the original language of the change document.
	 *
	 * @returns {boolean} is the label read only
	 *
	 * @public
	 */
	Change.prototype.isLabelReadOnly = function() {
		if (this._isReadOnlyDueToLayer()) {
			return true;
		}
		return this._isReadOnlyDueToOriginalLanguage();
	};

	/**
	 * Checks if the layer allows modifying the file
	 * @returns {boolean} Flag whether change is read only
	 *
	 * @private
	 */
	Change.prototype._isReadOnlyDueToLayer = function() {
		var sCurrentLayer;
		sCurrentLayer = Utils.getCurrentLayer(this._bUserDependent);
		return (this._oDefinition.layer !== sCurrentLayer);
	};

	/**
	 * A change can only be modified if the current language equals the original language.
	 * Returns false if the current language does not equal the original language of the change file.
	 * Returns false if the original language is initial.
	 *
	 * @returns {boolean} flag whether the current logon language differs from the original language of the change document
	 *
	 * @private
	 */
	Change.prototype._isReadOnlyDueToOriginalLanguage = function() {
		var sCurrentLanguage, sOriginalLanguage;

		sOriginalLanguage = this.getOriginalLanguage();
		if (!sOriginalLanguage) {
			return false;
		}

		sCurrentLanguage = Utils.getCurrentLanguage();
		return (sCurrentLanguage !== sOriginalLanguage);
	};

	/**
	 * Mark the current change to be deleted persistently
	 *
	 * @public
	 */
	Change.prototype.markForDeletion = function() {
		this._bIsDeleted = true;
	};

	/**
	 * Determines if the Change has to be updated to the backend
	 * @returns {boolean} content of the change document has changed (change is in dirty state)
	 * @private
	 */
	Change.prototype._isDirty = function() {
		var sCurrentDefinition = JSON.stringify(this._oDefinition);
		var sOriginDefinition = JSON.stringify(this._oOriginDefinition);

		return (sCurrentDefinition !== sOriginDefinition);
	};

	/**
	 * Sets the transport request
	 *
	 * @param {string} sRequest Transport request
	 *
	 * @public
	 */
	Change.prototype.setRequest = function(sRequest) {
		if (typeof (sRequest) !== "string") {
			Utils.log.error("sap.ui.fl.Change.setRequest : sRequest is not defined");
		}
		this._sRequest = sRequest;
	};

	/**
	 * Gets the transport request
	 * @returns {string} Transport request
	 *
	 * @public
	 */
	Change.prototype.getRequest = function() {
		return this._sRequest;
	};

	/**
	 * Gets the layer type for the change
	 * @returns {string} The layer of the change document
	 *
	 * @public
	 */
	Change.prototype.getLayer = function() {
		return this._oDefinition.layer;
	};

	/**
	 * Gets the component for the change
	 * @returns {string} The SAPUI5 component this change is assigned to
	 *
	 * @public
	 */
	Change.prototype.getComponent = function() {
		return this._oDefinition.reference;
	};

	/**
	 * Gets the creation timestamp
	 *
	 * @returns {String} creation timestamp
	 *
	 * @public
	 */
	Change.prototype.getCreation = function() {
		return this._oDefinition.creation;
	};

	/**
	 * Returns true if the change is user dependent
	 * @returns {boolean} Change is only relevant for the current user
	 *
	 * @public
	 */
	Change.prototype.isUserDependent = function() {
		return (this._bUserDependent);
	};

	/**
	 * Returns the pending action on the change item
	 * @returns {string} contains one of these values: DELETE/NEW/UPDATE/NONE
	 *
	 * @public
	 */
	Change.prototype.getPendingAction = function() {
		if (this._bIsDeleted) {
			return "DELETE";
		} else if (!this._oDefinition.creation) {
			return "NEW";
		} else if (this._isDirty() === true) {
			return "UPDATE";
		}
		return "NONE";
	};

	/**
	 * Gets the JSON definition of the change
	 * @returns {object} the content of the change document
	 *
	 * @public
	 */
	Change.prototype.getDefinition = function() {
		return this._oDefinition;
	};

	/**
	 * Set the response from the backend after saving the change
	 * @param {object} oResponse the content of the change document
	 *
	 * @public
	 */
	Change.prototype.setResponse = function(oResponse) {
		var sResponse = JSON.stringify(oResponse);
		if (sResponse) {
			this._oDefinition = JSON.parse(sResponse);
			this._oOriginDefinition = JSON.parse(sResponse);
		}
	};

	Change.prototype.getFullFileIdentifier = function () {
		var sLayer = this.getLayer();
		var sNamespace = this.getNamespace();
		var sFileName = this.getDefinition().fileName;
		var sFileType = this.getDefinition().fileType;

		return sLayer + "/" + sNamespace + "/" + sFileName + "." + sFileType;
	};

	/**
	 * Creates and returns a instance of change instance
	 *
	 * @param {Object}  [oPropertyBag] property bag
	 * @param {String}  [oPropertyBag.service] name of the OData service
	 * @param {String}  [oPropertyBag.componentName] name of the component
	 * @param {String}  [oPropertyBag.changeType] type of the change
	 * @param {Object}  [oPropertyBag.texts] map object with all referenced texts within the file
	 *                                      these texts will be connected to the translation process
	 * @param {Object}  [oPropertyBag.content] content of the new change
	 * @param {Boolean} [oPropertyBag.isVariant] variant?
	 * @param {String}  [oPropertyBag.namespace] namespace
	 * @param {String}  [oPropertyBag.packageName] ABAP package name
	 * @param {Object}  [oPropertyBag.selector] name value pair of the attribute and value
	 * @param {String}  [oPropertyBag.id] name/id of the file. if not set implicitly created
	 * @param {Boolean} [oPropertyBag.isVariant] name of the component
	 * @param {Boolean} [oPropertyBag.isUserDependent] true for enduser changes
	 *
	 * @returns {Object} The content of the change file
	 *
	 * @public
	 */
	Change.createInitialFileContent = function(oPropertyBag) {

		if (!oPropertyBag) {
			oPropertyBag = {};
		}

		var oNewFile = {
			fileName: oPropertyBag.id || Utils.createDefaultFileName(oPropertyBag.changeType),
			fileType: (oPropertyBag.isVariant) ? "variant" : "change",
			changeType: oPropertyBag.changeType || "",
			reference: oPropertyBag.reference || "",
			packageName: oPropertyBag.packageName || "",
			content: oPropertyBag.content || {},
			selector: oPropertyBag.selector || {},
			layer: oPropertyBag.layer || Utils.getCurrentLayer(oPropertyBag.isUserDependent),
			texts: oPropertyBag.texts || {},
			namespace: Utils.createNamespace(oPropertyBag, "changes"),
			creation: "",
			originalLanguage: Utils.getCurrentLanguage(),
			conditions: {},
			context: oPropertyBag.context || "",
			support: {
				generator: "Change.createInitialFileContent",
				service: oPropertyBag.service || "",
				user: ""
			}
		};

		return oNewFile;
	};

	return Change;
}, true);
