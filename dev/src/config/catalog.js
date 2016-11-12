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
                        {value: "uneca", label: "UNECA"},
                        {value: "cstat_training", label: "CountrySTAT Training"}
                    ],
                    default: ["fenix_develop"],
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