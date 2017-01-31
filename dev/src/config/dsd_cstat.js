define(function () {

    'use strict';


    return {
        MLEditor: {
            langs: ["EN", "FR"]
        },
        datasources:["D3S"],
        D3SConnector: { },
        lang: "EN",
        columnEditorReader: {
            "dimension": [
                {
                    "subject": "item",
                    "datatypes": [
                        "code"
                    ]
                },
                {
                    "subject": "indicator",
                    "datatypes": [
                        "code"
                    ]
                },
                {
                    "subject": "time",
                    "datatypes": [
                        "year",
                        "month",
                        "date"
                    ]
                },
                {
                    "subject": "geo",
                    "datatypes": [
                        "code"
                    ]
                }
            ],
            "value": [
                {
                    "subject": "value",
                    "datatypes": [
                        "number"
                    ]
                }
            ],
            "other": [
                {
                    "subject": "flag",
                    "datatypes": [
                        "code"
                    ]
                },
                {
                    "subject": "um",
                    "datatypes": [
                        "code"
                    ]
                }
            ]
        },
        subjects: [
            {
                "value": "freesubject",
                "text": {
                    "EN": "Free Subject",
                    "FR": "Free Subject"
                },
                "codelistSubject": "freesubject"
            },
            {
                "value": "item",
                "text": {
                    "EN": "Item",
                    "FR": "Article"
                },
                "codelistSubject": "item"
            },
            {
                "value": "indicator",
                "text": {
                    "EN": "Indicator",
                    "FR": "Indicateur"
                },
                "codelistSubject": "indicator"
            },
            {
                "value": "time",
                "text": {
                    "EN": "Time",
                    "FR": "Temps"
                }
            },
            {
                "value": "geo",
                "text": {
                    "EN": "Geo",
                    "FR": "Geo"
                },
                "codelistSubject": "geo"
            },
            {
                "value": "flag",
                "text": {
                    "EN": "Flag",
                    "FR": "Flag"
                },
                "codelistSubject": "flag"
            },
            {
                "value": "value",
                "text": {
                    "EN": "Value",
                    "FR": "Valeur"
                }
            },
            {
                "value": "um",
                "text": {
                    "EN": "UM",
                    "FR": "Unité"
                },
                "codelistSubject": "um"
            }
        ],
        DSD_EDITOR_CODELISTS: [
            {
                "value": "GAUL|2014",
                "text": {
                    "EN": "GAUL",
                    "FR": "GAUL"
                },
                "subject": "geo"
            },
            {
                "value": "CPC|2.1",
                "text": {
                    "EN": "CPC 2.1",
                    "FR": "CPC 2.1"
                },
                "subject": "item"
            },
            {
                "value": "Flag",
                "text": {
                    "EN": "Flag",
                    "FR": "Flag"
                },
                "subject": "flag"
            },
            {
                "value": "CountrySTAT_Agricultural_Population",
                "text": {
                    "EN": "Agricultural",
                    "FR": "Population agricole"
                },
                "subject": "freesubject"
            },
            {
                "value": "CountrySTAT_DAC",
                "text": {
                    "EN": "DAC",
                    "FR": "DAC"
                },
                "subject": "freesubject"
            },
            {
                "value": "CountrySTAT_Field_Management",
                "text": {
                    "EN": "Field Management",
                    "FR": "Gestion du terrain"
                },
                "subject": "fieldManagement"
            },
            {
                "value": "CountrySTAT_Food",
                "text": {
                    "EN": "Food",
                    "FR": "Alimentaire"
                },
                "subject": "freesubject"
            },
            {
                "value": "CountrySTAT_Gender",
                "text": {
                    "EN": "Gender",
                    "FR": "Genre"
                },
                "subject": "freesubject"
            },
            {
                "value": "CountrySTAT_Residence",
                "text": {
                    "EN": "Residence",
                    "FR": "Résidence"
                },
                "subject": "freesubject"
            },
            {
                "value": "CountrySTAT_Indicators",
                "text": {
                    "EN": "CountrySTAT Indicators",
                    "FR": "Indicateurs de CountrySTAT"
                },
                "subject": "indicator"
            },
            {
                "value": "HS|full",
                "text": {
                    "EN": "HS Full",
                    "FR": "HS complet"
                },
                "subject": "item"
            },
            {
                "value": "CountrySTAT_UM",
                "text": {
                    "EN": "CountrySTAT UM",
                    "FR": "CountrySTAT Unité de mesure"
                },
                "subject": "um"
            },
            {
                "value": "CountrySTAT_Fishery_products",
                "text": {
                    "EN": "Fishery products",
                    "FR": "Produits de la pêche"
                },
                "subject": "item"
            },
            {
                "value": "CountrySTAT_Forest_products",
                "text": {
                    "EN": "Forest products",
                    "FR": "Produits forestiers"
                },
                "subject": "item"
            },
            {
                "value": "CountrySTAT_Fishery_products_scientific",
                "text": {
                    "EN": "Fishery scientific products",
                    "FR": "Produits de la pêche - scientifiques"
                },
                "subject": "item"
            },
            {
                "value": "Activités_agricoles",
                "text": {
                    "EN": "Farm activities",
                    "FR": "Activités agricoles"
                },
                "subject": "freesubject"
            },
            {
                "value": "Activités_forestières",
                "text": {
                    "EN": "Forestry activities",
                    "FR": "Activités forestières"
                },
                "subject": "freesubject"
            },
            {
                "value": "Alphabetisation",
                "text": {
                    "EN": "Alphabetisation",
                    "FR": "Alphabetisation"
                },
                "subject": "freesubject"
            },
            {
                "value": "Approvisionement_en_eau",
                "text": {
                    "EN": "Water supply",
                    "FR": "Approvisionement en eau"
                },
                "subject": "freesubject"
            },
            {
                "value": "Classe_de_distance",
                "text": {
                    "EN": "Distance class",
                    "FR": "Classe de distance"
                },
                "subject": "freesubject"
            },
            {
                "value": "Difficultés_rencontrées",
                "text": {
                    "EN": "Encountered difficulties",
                    "FR": "Difficultés rencontrées"
                },
                "subject": "freesubject"
            },
            {
                "value": "Distance",
                "text": {
                    "EN": "Distance",
                    "FR": "Distance"
                },
                "subject": "freesubject"
            },
            {
                "value": "Equipments_agricoles",
                "text": {
                    "EN": "Agricultural equipments",
                    "FR": "Equipments agricoles"
                },
                "subject": "freesubject"
            },
            {
                "value": "Existence",
                "text": {
                    "EN": "Existence",
                    "FR": "Existence"
                },
                "subject": "freesubject"
            },
            {
                "value": "Group_Age",
                "text": {
                    "EN": "Group Age",
                    "FR": "Group Age"
                },
                "subject": "freesubject"
            },
            {
                "value": "Indicateurs_Recensement",
                "text": {
                    "EN": "Census Indicators",
                    "FR": "Indicateurs Recensement"
                },
                "subject": "freesubject"
            },
            {
                "value": "Main_d'oeuvre",
                "text": {
                    "EN": "Workforce",
                    "FR": "Main d'oeuvre"
                },
                "subject": "freesubject"
            },
            {
                "value": "Matériel",
                "text": {
                    "EN": "Equipment",
                    "FR": "Matériel"
                },
                "subject": "freesubject"
            },
            {
                "value": "Mode_de_faire_valoir",
                "text": {
                    "EN": "How to claim",
                    "FR": "Mode de faire valoir"
                },
                "subject": "freesubject"
            },
            {
                "value": "Niveau_Instruction",
                "text": {
                    "EN": "Level Instruction",
                    "FR": "Niveau Instruction"
                },
                "subject": "freesubject"
            },
            {
                "value": "Nombre_conjointes",
                "text": {
                    "EN": "Number of joint",
                    "FR": "Nombre conjointes"
                },
                "subject": "freesubject"
            },
            {
                "value": "Nombre_de_champs_possédés",
                "text": {
                    "EN": "Number of owned fields",
                    "FR": "Nombre de champs possédés"
                },
                "subject": "freesubject"
            },
            {
                "value": "Nombre_de_pieds",
                "text": {
                    "EN": "Number of feet",
                    "FR": "Nombre de pieds"
                },
                "subject": "freesubject"
            },
            {
                "value": "Objectifs_de_production",
                "text": {
                    "EN": "Production targets",
                    "FR": "Objectifs de production"
                },
                "subject": "freesubject"
            },
            {
                "value": "Oui_Non",
                "text": {
                    "EN": "Yes No",
                    "FR": "Oui Non"
                },
                "subject": "freesubject"
            },
            {
                "value": "Répartition_exploitations",
                "text": {
                    "EN": "Breakdown of holdings",
                    "FR": "Répartition exploitations"
                },
                "subject": "freesubject"
            },
            {
                "value": "Route_bitumée",
                "text": {
                    "EN": "Bitumen road",
                    "FR": "Route bitumée"
                },
                "subject": "freesubject"
            },
            {
                "value": "Situation_Matrimoniale",
                "text": {
                    "EN": "Marriage Situation",
                    "FR": "Situation Matrimoniale"
                },
                "subject": "freesubject"
            },
            {
                "value": "Source_éléctricité",
                "text": {
                    "EN": "Source Electricity",
                    "FR": "Source éléctricité"
                },
                "subject": "freesubject"
            },
            {
                "value": "Superficie_cultivée",
                "text": {
                    "EN": "Cultivated area",
                    "FR": "Superficie cultivée"
                },
                "subject": "freesubject"
            },
            {
                "value": "Taille_de_menage",
                "text": {
                    "EN": "Household Size",
                    "FR": "Taille de menage"
                },
                "subject": "freesubject"
            },
            {
                "value": "Size",
                "text": {
                    "EN": "Size",
                    "FR": "Taille"
                },
                "subject": "freesubject"
            }

        ]
    };

});