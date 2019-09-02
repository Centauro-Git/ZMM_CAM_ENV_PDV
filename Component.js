sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"ZMM_CAM_PERSO_ENV_PDV/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("ZMM_CAM_PERSO_ENV_PDV.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			var oRouter = this.getRouter();
			if (oRouter) {
				oRouter.initialize();
			}

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			sap.ui.getCore().setModel(this.getModel(), "default");
		}
	});

});