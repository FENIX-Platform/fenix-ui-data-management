define(function(){

    'use strict';

    return {

        el: "",
        lang : "",
        environment: "",

        defaultSelectors: ['freeText', 'resourceType', 'contextSystem'],
        hideCloseButton: true,
        pluginRegistry: {
            contextSystem: {
                selector: {
                    id: "dropdown",
                    source: [
                        {value: "uneca", label: "UNECA"},
                        {value: "cstat_training", label: "CountrySTAT Training"}
                    ],
                    default: ["uneca"],
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