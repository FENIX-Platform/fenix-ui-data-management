define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    "fenix-ui-DSDEditor",
    '../components/resource-manager'

],function($, Backbone, log, Q, DSD, RM){

    "use strict";

    var DSDView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, o);

            this.lang = this.lang.toLowerCase();
            log.info("{DSD} Rendering View", this);
            this.initViews();
            this.bindEventListeners();
            return this;
        },

        bindEventListeners: function () {
            log.info("{DSD} bindEventListeners()");
            $(this.savebtn).on("click", function(){
                RM.setDSD(DSD.get());
            });

        },

        initViews: function() {
            log.info("{DSD} initViews", this.config);
/*
            var cfg = {
                columnEditor: {
                    codelists: "../config/dev_codelists.json"
                },
                MLEditor: {
                    langs: ["EN", "FR"]
                },
                D3SConnector: {
                },
                lang: "EN",
                DSD_EDITOR_CODELISTS: [
                    {
                        "value": "GAUL|2014",
                        "text": {
                            "EN": "GAUL",
                            "FR": "GAUL FR"
                        },
                        "subject": "geo"
                    },
                    {
                        "value": "CPC|2.1",
                        "text": {
                            "EN": "CPC 2.1",
                            "FR": "CPC 2.1 FR"
                        },
                        "subject": "item"
                    },
                    {
                        "value": "Flag",
                        "text": {
                            "EN": "Flag",
                            "FR": "Flag FR"
                        },
                        "subject": "flag"
                    },
                    {
                        "value": "CountrySTAT_Agricultural_Population",
                        "text": {
                            "EN": "Agricultural",
                            "FR": "Agricultural FR"
                        },
                        "subject": "agriculturalPopulation"
                    },
                    {
                        "value": "CountrySTAT_DAC",
                        "text": {
                            "EN": "DAC",
                            "FR": "DAC FR"
                        },
                        "subject": "sector"
                    },
                    {
                        "value": "CountrySTAT_Field_Management",
                        "text": {
                            "EN": "Field Management",
                            "FR": "Field Management FR"
                        },
                        "subject": "fieldManagement"
                    },
                    {
                        "value": "CountrySTAT_Food",
                        "text": {
                            "EN": "Food",
                            "FR": "Food FR"
                        },
                        "subject": "food"
                    },
                    {
                        "value": "CountrySTAT_Gender",
                        "text": {
                            "EN": "Gender",
                            "FR": "Gender FR"
                        },
                        "subject": "gender"
                    },
                    {
                        "value": "CountrySTAT_Residence",
                        "text": {
                            "EN": "Residence",
                            "FR": "Residence FR"
                        },
                        "subject": "residence"
                    },
                    {
                        "value": "CountrySTAT_Indicators",
                        "text": {
                            "EN": "CountrySTAT Indicators",
                            "FR": "CountrySTAT Indicators FR"
                        },
                        "subject": "indicator"
                    },
                    {
                        "value": "HS|full",
                        "text": {
                            "EN": "HS Full",
                            "FR": "HS Full FR"
                        },
                        "subject": "item"
                    },
                    {
                        "value": "CountrySTAT_UM",
                        "text": {
                            "EN": "CountrySTAT UM",
                            "FR": "CountrySTAT UM FR"
                        },
                        "subject": "um"
                    },
                    {
                        "value": "CountrySTAT_Fishery_products",
                        "text": {
                            "EN": "Fishery products",
                            "FR": "Fishery products FR"
                        },
                        "subject": "item"
                    },
                    {
                        "value": "CountrySTAT_Forest_products",
                        "text": {
                            "EN": "Forest products",
                            "FR": "Forest products FR"
                        },
                        "subject": "item"
                    },
                    {
                        "value": "CountrySTAT_Fishery_products_scientific",
                        "text": {
                            "EN": "Fishery scientific products",
                            "FR": "Fishery scientific products FR"
                        },
                        "subject": "item"
                    },
                    {
                        "value": "Activités_agricoles",
                        "text": {
                            "EN": "Activités agricoles",
                            "FR": "Activités agricoles"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Activités_forestières",
                        "text": {
                            "EN": "Activités forestières",
                            "FR": "Activités forestières"
                        },
                        "subject": "census"
                    },


                    {
                        "value": "Alphabetisation",
                        "text": {
                            "EN": "Alphabetisation",
                            "FR": "Alphabetisation"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Approvisionement_en_eau",
                        "text": {
                            "EN": "Approvisionement en eau",
                            "FR": "Approvisionement en eau"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Classe_de_distance",
                        "text": {
                            "EN": "Classe de distance",
                            "FR": "Classe de distance"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Difficultés_rencontrées",
                        "text": {
                            "EN": "Difficultés rencontrées",
                            "FR": "Difficultés rencontrées"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Distance",
                        "text": {
                            "EN": "Distance",
                            "FR": "Distance"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Equipments_agricoles",
                        "text": {
                            "EN": "Equipments agricoles",
                            "FR": "Equipments agricoles"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Existence",
                        "text": {
                            "EN": "Existence",
                            "FR": "Existence"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Group_Age",
                        "text": {
                            "EN": "Group Age",
                            "FR": "Group Age"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Indicateurs_Recensement",
                        "text": {
                            "EN": "Indicateurs Recensement",
                            "FR": "Indicateurs Recensement"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Main_d'oeuvre",
                        "text": {
                            "EN": "Main d'oeuvre",
                            "FR": "Main d'oeuvre"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Matériel",
                        "text": {
                            "EN": "Matériel",
                            "FR": "Matériel"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Mode_de_faire_valoir",
                        "text": {
                            "EN": "Mode de faire valoir",
                            "FR": "Mode de faire valoir"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Niveau_Instruction",
                        "text": {
                            "EN": "Niveau Instruction",
                            "FR": "Niveau Instruction"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Nombre_conjointes",
                        "text": {
                            "EN": "Nombre conjointes",
                            "FR": "Nombre conjointes"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Nombre_de_champs_possédés",
                        "text": {
                            "EN": "Nombre de champs possédés",
                            "FR": "Nombre de champs possédés"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Nombre_de_pieds",
                        "text": {
                            "EN": "Nombre de pieds",
                            "FR": "Nombre de pieds"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Objectifs_de_production",
                        "text": {
                            "EN": "Objectifs de production",
                            "FR": "Objectifs de production"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Oui_Non",
                        "text": {
                            "EN": "Oui Non EN",
                            "FR": "Oui Non"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Répartition_exploitations",
                        "text": {
                            "EN": "Répartition exploitations EN",
                            "FR": "Répartition exploitations"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Route_bitumée",
                        "text": {
                            "EN": "Route bitumée EN",
                            "FR": "Route bitumée"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Situation_Matrimoniale",
                        "text": {
                            "EN": "Situation Matrimoniale EN",
                            "FR": "Situation Matrimoniale"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Source_éléctricité",
                        "text": {
                            "EN": "Source éléctricité EN",
                            "FR": "Source éléctricité"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Superficie_cultivée",
                        "text": {
                            "EN": "Superficie cultivée EN",
                            "FR": "Superficie cultivée"
                        },
                        "subject": "census"
                    },
                    {
                        "value": "Taille_de_menage",
                        "text": {
                            "EN": "Taille de menage EN",
                            "FR": "Taille de menage"
                        },
                        "subject": "census"
                    }

                ]
            };
*/
            var cfg = this.config;
            var callB = function() {
                log.info('{DSD} Editor Callback');
                DSD.set(RM.getDSD());
                log.info('{DSD} is editable ',RM.isDSDEditable());
                DSD.editable(RM.isDSDEditable());
            };

            DSD.init(this.$el, cfg, callB);

        },

        accessControl: function () {

            return new Q.Promise(function (fulfilled, rejected) {
                if (!$.isEmptyObject(RM.resource)) {
                    fulfilled();
                } else {
                    rejected();
                }
            });
        },

        remove: function() {
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return DSDView;

});