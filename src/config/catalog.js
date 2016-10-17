define(function(){

    'use strict';

    return {
        el: "",
        lang : "",
        defaultSelectors: ['resourceType', 'contextSystem'],
        environment: "",
        hideCloseButton : true,
        pluginRegistry : {
        contextSystem : {
            selector : {
                id : "dropdown",
                    source : [
                    {value : "uneca", label : "UNECA"},
                    {value : "cstat_afg", label : "CountrySTAT Afghanistan"}
                ],
            default : ["uneca"],
                    hideSummary : true,
                    config : {
                    plugins: ['remove_button'],
                        mode: 'multi'
                }
            },

            template : {
                hideRemoveButton : false
            },

            format : {
                output : "enumeration",
                    metadataAttribute: "dsd.contextSystem"
            }
        }
     }

    }
});