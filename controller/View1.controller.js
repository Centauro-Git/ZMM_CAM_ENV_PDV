sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History"
], function (Controller, JSONModel, MessageBox, History) {
	"use strict";

	return Controller.extend("ZMM_CAM_PERSO_ENV_PDV.controller.View1", {

		/*
		 OnInit
		 */
		onInit: function () {
			var btnSalvar = this.getView().byId("btnSalvar");
			btnSalvar.setTooltip(this.onTolltipSalvar());

			//Inicia Radio com Generico selecionado
			this.getView().byId("rbNumFt").setSelectedIndex(3);
			var vParameters = {
				selected: true
			};
			this.getView().byId("NumFt4").fireSelect(vParameters);

			this.getOwnerComponent().getModel().oGlobalBusyDialog = new sap.m.BusyDialog();

			this.getOwnerComponent().getModel().i18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			this.i18n = this.getOwnerComponent().getModel().oResourceBundle;

			this.getView().byId("rbNmPos").setColumns(2);
			this.getView().byId("rbNmAli").setColumns(2);

		},

		/*
		 Processo do botão Salvar
		 */
		onSalvaPedido: function (oEvent) {

			if (this.getView().byId("numPerso").getValue() === "" &&
				this.getView().byId("nmPerso").getValue() === "") {
				this.getView().byId("nmPerso").setValueState(sap.ui.core.ValueState.Error);
				this.getView().byId("numPerso").setValueState(sap.ui.core.ValueState.Error);
				MessageBox.error(this.i18n.getText("me01"));
				return;
			}

			if (this.getView().byId("cpf").getValueState() !== sap.ui.core.ValueState.None) {
				MessageBox.error(this.i18n.getText("me02"));
				return;
			}

			if (this.getView().byId("numPerso").getValueState() !== sap.ui.core.ValueState.None) {
				MessageBox.error(this.i18n.getText("me03"));
				return;
			}

			if (this.getView().byId("email").getValueState() !== sap.ui.core.ValueState.None) {
				MessageBox.error(this.i18n.getText("me06"));
				return;
			}

			// Local Templates
			var oEntryTemplate = {};

			oEntryTemplate.Vendedor = "";
			oEntryTemplate.NmCliente = "";
			oEntryTemplate.Stcd1 = "";
			oEntryTemplate.Stcd2 = "";
			oEntryTemplate.Smtpadr = "";
			oEntryTemplate.Matnr = "";
			oEntryTemplate.NmPers = "";
			oEntryTemplate.NmPos = "";
			oEntryTemplate.NmAli = "";
			oEntryTemplate.NmFonte = "";
			oEntryTemplate.NmTpMat = "";
			oEntryTemplate.NmCor = "";
			oEntryTemplate.NmAno = "";
			oEntryTemplate.NumPers = 0;
			oEntryTemplate.NumFonte = "";
			oEntryTemplate.NumTpMat = "";
			oEntryTemplate.NmCor = "";
			oEntryTemplate.NumAno = "";
			oEntryTemplate.Perso = "";
			oEntryTemplate.EvMensagem = "";
			oEntryTemplate.EvStatus = "";

			// Local Object
			var oModel = this.getView().getModel(),
				oEntry = oEntryTemplate;

			// Local Variables
			var vNmFt = this.getView().byId("rbNmFt").getSelectedIndex(),
				vNmMat = this.getView().byId("rbNmMat").getSelectedIndex(),
				vNumFt = this.getView().byId("rbNumFt").getSelectedIndex(),
				vNumMat = this.getView().byId("rbNumMat").getSelectedIndex(),
				vCpfCpnj = this.getView().byId("cpf").getValue().replace(/\.|-|\//g, "");

			// Preenchimento da Entity pra envio ao PDV
			oEntry.Vendedor = this.getView().byId("colab").getValue();
			oEntry.NmCliente = this.getView().byId("nome").getValue();
			if (vCpfCpnj.length > 11)
				oEntry.Stcd1 = vCpfCpnj;
			else
				oEntry.Stcd2 = vCpfCpnj;

			oEntry.Smtpadr = this.getView().byId("email").getValue();

			oEntry.Matnr = this.getView().byId("produto").getValue();
			oEntry.NmPers = this.getView().byId("nmPerso").getValue();

			if (oEntry.NmPers !== "") {

				oEntry.NmFonte = this.fillNumc2(vNmFt);
				oEntry.NmTpMat = this.fillNumc2(vNmMat);
				if (oEntry.NmFonte === "04")
					oEntry.NmCor = this.getView().byId("oNmCor").getSelectedItem().getKey();
				else if (oEntry.NmTpMat === "02")
					oEntry.NmAno = this.getView().byId("oNmAno").getSelectedItem().getKey();
			}

			if (this.getView().byId("numPerso").getValue() !== "")
				oEntry.NumPers = parseInt( this.getView().byId("numPerso").getValue() );

			oEntry.NmAli = this.getView().byId("rbNmAli").getSelectedIndex() + 1;
			oEntry.NmAli = "0" + oEntry.NmAli;
			oEntry.NmPos = this.getView().byId("rbNmPos").getSelectedIndex() + 1;
			oEntry.NmPos = "0" + oEntry.NmPos;

			if (oEntry.NumPers !== "") {
				oEntry.NumFonte = this.fillNumc2(vNumFt);
				oEntry.NumTpMat = this.fillNumc2(vNumMat);
				if (oEntry.NumFonte === "04")
					oEntry.NumCor = this.getView().byId("oNumCor").getSelectedItem().getKey();
				else
					oEntry.NumAno = this.getView().byId("oNumAno").getSelectedItem().getKey();
			}

			if (this.getView().byId("cbPerso").getSelected())
				oEntry.Perso = "X";
			var that = this;

			oModel.create("/CamPersoEnviaPDVSet", oEntry, {
				success: function (oSucess) {
					that.onSucessCall(oSucess);
				},
				error: function (oError) {
					that.onErrorCall(oError);
				}
			});

			oModel.oGlobalBusyDialog.open();

		},

		onCancelaPedido: function () {
			this.getView().byId("colab").setValue("");
			this.getView().byId("colab").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("nome").setValue("");
			this.getView().byId("nome").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("cpf").setValue("");
			this.getView().byId("cpf").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("email").setValue("");
			this.getView().byId("email").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("produto").setValue("");
			this.getView().byId("produto").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("nmPerso").setValue("");
			this.getView().byId("nmPerso").setValueState(sap.ui.core.ValueState.None);
			this.getView().byId("rbNmFt").setSelectedIndex(0);
			this.getView().byId("rbNmAli").setSelectedIndex(0);
			this.getView().byId("rbNmPos").setSelectedIndex(0);
			this.getView().byId("rbNmMat").setSelectedIndex(0);
			this.getView().byId("numPerso").setValue("");
			this.getView().byId("rbNumMat").setSelectedIndex(1);
			this.getView().byId("rbNumFt").setSelectedIndex(0);
			this.getView().byId("cbPerso").setSelected(false);

			this.getView().byId("NM_OPT").setVisible(false);
			this.getView().byId("NUM_COR").setVisible(false);

			this.getView().byId("btnSalvar").setEnabled(false);

		},

		/*
		 Controla a disponibilidade do botão salvar
		 */
		onEnableSalvar: function (oEvnt) {
			var btnSalvar = this.getView().byId("btnSalvar");

			if (this.getView().byId("colab").getValueState() !== sap.ui.core.ValueState.Error &&
				this.getView().byId("nome").getValue() !== "" &&
				this.getView().byId("produto").getValue() !== "")
				btnSalvar.setEnabled(true);
			else
				btnSalvar.setEnabled(false);

			btnSalvar.setTooltip(this.onTolltipSalvar(!btnSalvar.getEnabled()));
		},

		/*
			Ação após o produto ser inserido
		*/
		onProdutoChange: function (oEvent) {
			this.onEnableSalvar(oEvent);

			// if (this.getView().byId("rbNmMat").getSelectedIndex() === 1 ||
			// 	this.getView().byId("rbNumMat").getSelectedIndex() === 1)
			// 	this.getAno(this.getView().byId("NmMat2"), oEvent.getParameters().value);

			this.getAnos(oEvent.getSource().getValue());

		},

		/*
		 Tolltip para quando o botão salvar está desabilitado
		 */
		onTolltipSalvar: function (pActive = true) {
			var i18n = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			if (pActive === true)
				return i18n.getText("me04");
			else
				return "";
		},

		/*
		 Validação de CPF entrado
		 */
		onValidaCpfCnpj: function (oEvent) {
			if (oEvent.getSource().getValue() === "") {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
				return;
			}

			var strCpfCnpj = oEvent.getSource().getValue().replace(/\.|-/g, "");
			if (isNaN(strCpfCnpj)) {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
				return;
			}

			if (strCpfCnpj)
				if (strCpfCnpj.length > 11) {
					oEvent.getSource().setValueState(this.verificaCNPJ(strCpfCnpj));
					if (oEvent.getSource().getValueState() === sap.ui.core.ValueState.None)
						oEvent.getSource().setValue(this.applyCNPJmask(strCpfCnpj));
				} else {
					oEvent.getSource().setValueState(this.verificaCPF(strCpfCnpj));
					if (oEvent.getSource().getValueState() === sap.ui.core.ValueState.None)
						oEvent.getSource().setValue(this.applyCPFmask(strCpfCnpj));
				}
		},

		/*
		 Valida se o numero da camisa é um número
		 */
		onNumPersoChange: function (oEvent) {
			if (oEvent.getSource().getValue() === "")
				oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
			else {
				if (isNaN(oEvent.getSource().getValue()))
					oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
				else
					oEvent.getSource().setValueState(sap.ui.core.ValueState.None)
			}
		},

		/*
		 Calculo de validação do CPF
		 */
		verificaCPF: function (vCPF) {
			var Soma;
			var Resto;
			var Error = false;
			var i;
			Soma = 0;

			if (vCPF.lenght < 11)
				Error = true;
			else {
				for (i = 1; i <= 9; i++)
					Soma = Soma + parseInt(vCPF.substring(i - 1, i)) * (11 - i);

				Resto = (Soma * 10) % 11;

				if ((Resto == 10) || (Resto == 11))
					Resto = 0;
				if (Resto != parseInt(vCPF.substring(9, 10)))
					Error = true;

				if (Error === false) {
					Soma = 0;
					for (i = 1; i <= 10; i++)
						Soma = Soma + parseInt(vCPF.substring(i - 1, i)) * (12 - i);

					Resto = (Soma * 10) % 11;

					if ((Resto == 10) || (Resto == 11))
						Resto = 0;
					if (Resto != parseInt(vCPF.substring(10, 11)))
						Error = true;
				}
			}
			if (Error === true)
				return sap.ui.core.ValueState.Error;
			else {
				return sap.ui.core.ValueState.None;
			}
		},

		/*
		 Calculo de validação do CNPJ
		 */
		verificaCNPJ: function (vCNPJ) {

			if (vCNPJ.length != 14)
				return sap.ui.core.ValueState.Error;

			// Valida DVs
			var tamanho = vCNPJ.length - 2;
			var numeros = vCNPJ.substring(0, tamanho);
			var digitos = vCNPJ.substring(tamanho);
			var soma = 0;
			var pos = tamanho - 7;
			var i = 0;

			for (i = tamanho; i >= 1; i--) {
				soma += numeros.charAt(tamanho - i) * pos--;
				if (pos < 2)
					pos = 9;
			}
			var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
			if (resultado != digitos.charAt(0))
				return sap.ui.core.ValueState.Error;

			tamanho = tamanho + 1;
			numeros = vCNPJ.substring(0, tamanho);
			soma = 0;
			pos = tamanho - 7;

			for (i = tamanho; i >= 1; i--) {
				soma = soma + numeros.charAt(tamanho - i) * pos--;
				if (pos < 2)
					pos = 9;
			}

			resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;

			if (resultado != digitos.charAt(1))
				return sap.ui.core.ValueState.Error;

			return sap.ui.core.ValueState.None;
		},

		/*
		 Função que aplica a mascara de CNPJ caso o mesmo seja informado corretamente
		 */
		applyCNPJmask: function (vCNPJ) {
			//Coloca ponto entre o segundo e o terceiro dígitos
			vCNPJ = vCNPJ.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
			return vCNPJ;
		},

		/*
		  Função que aplica a mascara de CPF caso o mesmo seja informado corretamente
		 */
		applyCPFmask: function (vCPF) {
			//Coloca ponto entre o segundo e o terceiro dígitos
			vCPF = vCPF.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
			return vCPF;
		},

		/*
		 Ação ao editar um dos campos, (Nome personalizado ou Numero personalizado)
		 */
		onPersoChange: function (oEvent) {
			if (this.getView().byId("nmPerso").getValue() !== "" &&
				isNaN(this.getView().byId("nmPerso").getValue()))
				return;

			if (this.getView().byId("numPerso").getValueState() === sap.ui.core.ValueState.Error)
				if (this.getView().byId("colab").getValue() !== "" ||
					this.getView().byId("nome").getValue() !== "") {
					this.getView().byId("nmPerso").setValueState(sap.ui.core.ValueState.None);
					this.getView().byId("numPerso").setValueState(sap.ui.core.ValueState.None);
				}
		},

		/*
		 Ação do radio button "Generico"
		 */
		onGenSelected: function (oSts) {
			var len = oSts.getParameters().id.length;
			var field = oSts.getParameters().id.substring(12, len - 3);
			var cor;
			var opt;
			var ano;
			var radio;

			if (field === "Nm") {
				radio = "rbNmMat";
				this.getView().byId(radio).setEditable(!oSts.getParameters().selected);
				this.getView().byId(radio).setSelectedIndex(0);
				opt = "NM_OPT";
				cor = "NM_COR";
				ano = "NM_ANO";
			} else {
				radio = "rbNumMat";
				cor = "NUM_COR";
				ano = "NUM_ANO";
			}

			if (oSts.getParameters().selected === true) {
				this.getView().byId(radio).setSelectedIndex(2);
			}
			if (typeof(opt) !== "undefined")
				this.getView().byId(opt).setVisible(oSts.getParameters().selected);

			this.getView().byId(cor).setVisible(oSts.getParameters().selected);
			this.getView().byId(ano).setVisible(!oSts.getParameters().selected);

		},
		
		onNmFolSelected: function (oSts) {
			this.getView().byId("NM_OPT").setVisible(false);
			this.getView().byId("NM_ANO").setVisible(false);
		},

		onNmInsSelected: function (oSts) {
			var oCombo = this.getView().byId("oNmAno");
			var oModel = this.getView().getModel();

			if (oSts.getParameters().selected) {

				if (this.getView().byId("produto").getValue() === "" ||
				    oCombo.getBinding("items").getLength() === 0       ) {
				    if (this.getView().byId("produto").getValue() === "")
						MessageBox.error(oModel.i18n.getText("me07"));
					else
						MessageBox.error(oModel.i18n.getText("me08"));
					oSts.getParameters().selected = false;
					this.setNmIni();
				} else {
					this.getView().byId("NM_OPT").setVisible(oSts.getParameters().selected);
					this.getView().byId("NM_ANO").setVisible(oSts.getParameters().selected);
				}
			}
		},

		onNumInsSelected: function (oSts) {
			var oCombo = this.getView().byId("oNumAno");
			var oModel = this.getView().getModel();

			if (oSts.getParameters().selected) {
				if (this.getView().byId("produto").getValue() === ""  || 
				    oCombo.getBinding("items").getLength() === 0        ) {
					if (this.getView().byId("produto").getValue() === "")
						MessageBox.error(oModel.i18n.getText("me07"));
					else
						MessageBox.error(oModel.i18n.getText("me08"));
					oSts.getParameters().selected = false;
					this.setNumIni();
				} else {
					this.getView().byId("NUM_ANO").setVisible(oSts.getParameters().selected);
					this.getView().byId("rbNumMat").setSelectedIndex(1);
				}
			}
		},

		/*
		  Seleciona os anos dos insumos caradastrados para o produto
		 */
		getAnos: function (vProd) {
			var oEntryTemplate = {};
			var vFilters = new Array();
			var oModel = this.getView().getModel();
			var that = this;
			var oNmCombo = this.getView().byId("oNmAno");
			var oNumCombo = this.getView().byId("oNumAno");
			var vFilter = new sap.ui.model.Filter("IvSku", sap.ui.model.FilterOperator.EQ, vProd);

			vFilters.push(vFilter);
			oModel.oGlobalBusyDialog.open();
			oModel.read("/CamPersoAnoSkuSet", {
				filters: vFilters,
				success: function (oResponse) {
					var oModelCombo = new sap.ui.model.json.JSONModel();
					var values = new Array();
					var oComboTemplate = new sap.ui.core.Item({
						key: "{Gjahr}",
						text: "{Gjahr}"
					});

					that.getView().getModel().oGlobalBusyDialog.close();

					values = oResponse.results;
					oModelCombo.setData({
						anos: values
					});

					// oCombo = that.getView().byId("NM_ANO");
					// oCombo = that.getView().byId(ano);
					oNmCombo.setModel(oModelCombo, "model1");
					oNumCombo.setModel(oModelCombo, "model1");

				},
				error: function (oError) {
					var oModelCombo = new sap.ui.model.json.JSONModel();
					var values = new Array();
					
					that.getView().getModel().oGlobalBusyDialog.close();

					oModelCombo.setData({
						anos: values
					});

					oNmCombo.setModel(oModelCombo, "model1");
					oNumCombo.setModel(oModelCombo, "model1");

					if (that.getView().byId("rbNumFt").getSelectedIndex() !== 3)
						that.setNumIni();
						
					if (that.getView().byId("rbNmMat").getSelectedIndex() === 1)
						that.setNmIni();
				}
			})
		},

		setNumIni: function () {
			this.getView().byId("rbNumFt").setSelectedIndex(3);
			this.getView().byId("rbNumMat").setSelectedIndex(2);
			this.getView().byId("NUM_COR").setVisible(true);
			this.getView().byId("NUM_ANO").setVisible(false)
		},

		setNmIni: function () {
			this.getView().byId("rbNmMat").setSelectedIndex(0);
			this.getView().byId("NM_OPT").setVisible(false);
			this.getView().byId("NM_ANO").getVisible(false);
		},

		/*
		 Função para preenchimento de zeros a esquerda vindo do index
		 */
		fillNumc2: function (iNum) {
			return "0" + (iNum + 1);
		},

		/*
		 Função para retorno de sucesso vindo do oData
		 */
		onSucessCall: function (oSucess) {
			var oModel = sap.ui.getCore().getModel("default");
			oModel.oGlobalBusyDialog.close();
			this.onCancelaPedido();
			MessageBox.success(oSucess.EvMensagem);
		},

		onColabChange: function (oEvent) {
			if (isNaN(oEvent.getSource().getValue())) {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
				this.getView().byId("btnSalvar").setEnabled(false);
			} else
				oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
		},

		onEmailValidation: function (oEvent) {

			var email = oEvent.getSource().getValue();
			var msg = "";

			if (this.validateEmail(email)) {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.None);
			} else {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
			}
		},

		validateEmail: function (email) {
			var re =
				/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		},

		/*
		 Função para retorno de erro vindo do oData
		 */
		onErrorCall: function (oError) {
			var oModel = sap.ui.getCore().getModel("default");
			oModel.oGlobalBusyDialog.close();
			if (oError.statusCode === 400 ||
				oError.statusCode === "400") {

				var errorRes = JSON.parse(oError.responseText);
				var i = 0;
				var oErrorModel = new JSONModel();
				var oMessage = {};

				if (!errorRes.error.innererror.errordetails[0]) {
					MessageBox.error(oModel.i18n.getText("me05"));
					return;

				}

				var oLink = new sap.m.Link({
					text: "Show more information",
					href: "",
					target: "_blank"
				});

				var oMessageTemplate = new sap.m.MessageItem({
					type: "{type}",
					title: "{title}",
					description: "{description}",
					subtitle: "{subtitle}",
					counter: "{counter}",
					markupDescription: "{markupDescription}",
					link: oLink
				});

				var oMessageView = new sap.m.MessageView({
					showDetailsPageHeader: false,
					itemSelect: function () {
						oBackButton.setVisible(true);
					},
					items: {
						path: "/",
						template: oMessageTemplate
					}
				});

				var oBackButton = new sap.m.Button({
					icon: sap.ui.core.IconPool.getIconURI("nav-back"),
					visible: false,
					press: function () {
						oMessageView.navigateBack();
						this.setVisible(false);
					}
				});

				// Le mensages de erro
				do {
					var erroDetail = errorRes.error.innererror.errordetails[i];
					if (erroDetail.code === "") {
						oMessage[i] = ({
							type: "Error",
							title: erroDetail.message,
							description: ""
						});
					}
					i++;

				} while (errorRes.error.innererror.errordetails[i]);

				if (!oMessage[0]) {
					MessageBox.error(oModel.i18n.getText("me05"));
					return;
				}

				oErrorModel.setData(oMessage);

				oMessageView.setModel(oErrorModel);

				var oDialog = new sap.m.Dialog({
					resizable: true,
					content: oMessageView,
					state: "Error",
					beginButton: new sap.m.Button({
						press: function () {
							this.getParent().close();
						},
						text: "Close"
					}),
					customHeader: new sap.m.Bar({
						contentMiddle: [
							new sap.m.Text({
								text: "Error"
							})
						],
						contentLeft: [oBackButton]
					}),
					contentHeight: "300px",
					contentWidth: "500px",
					verticalScrolling: false
				});

				oDialog.open();

			} else {
				sap.m.MessageBox.error(oModel.i18n.getText("me05"));
				return;
			}
		}

	});

});