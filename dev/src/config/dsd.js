define(function () {

    'use strict';


    return {

        MLEditor: {
            langs: ["EN", "FR"]
        },
        D3SConnector: {},
        lang: "EN",
        DSD_EDITOR_CODELISTS: [
            {
                "value": "UNECA_ISO3",
                "text": {
                    "EN": "UNECA_ISO3",
                    "FR": "UNECA_ISO3 FR"
                },
                "subject": "geo"
            },
            {
                "value": "UNECA_ClassificationOfActivities|2.0",
                "text": {
                    "EN": "UNECA_ClassificationOfActivities 2.0",
                    "FR": "UNECA_ClassificationOfActivities 2.0 FR"
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
                "value": "UNECA_Gender",
                "text": {
                    "EN": "UNECA_Gender",
                    "FR": "UNECA_Gender FR"
                },
                "subject": "gender"
            },
            {
                "value": "UNECA_Energy",
                "text": {
                    "EN": "UNECA_Energy",
                    "FR": "UNECA_Energy"
                },
                "subject": "item"
            },
            {
                "value": "UNECA_UnitMeasure",
                "text": {
                    "EN": "UNECA_UnitMeasure UM",
                    "FR": "UNECA_UnitMeasure UM FR"
                },
                "subject": "um"
            }

        ]
    };

});