define(function(){

    'use strict';

    return {

        defaultSelectors: ['freeText', 'resourceType', 'contextSystem'],
        hideCloseButton: true,
        pluginRegistry: {
            contextSystem: {
                selector: {
                    id: "dropdown",
                    source: [
                        {value: "fenix_develop", label: "FENIX develop"},
                        {value: "gift", label: "GIFT"},
                        {value: "cstat_training", label: "CountrySTAT Training"}
                    ],
                    default: ["cstat_training"],
                    hideSummary: true,
                    config: {
                        plugins: ['remove_button'],
                        mode: 'multi'
                    }
                },

                template: {
                    hideRemoveButton: false
                },

                format: {
                    output: "enumeration",
                    metadataAttribute: "dsd.contextSystem"
                }
            }
        }

    }
});