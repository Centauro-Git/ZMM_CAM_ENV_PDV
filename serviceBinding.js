function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZMM_CAM_PERSO_ENV_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}