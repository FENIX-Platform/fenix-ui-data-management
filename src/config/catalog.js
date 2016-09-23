define(function(){

    'use strict';

    return {
        el: this.$el,
        lang : this.lang,
        defaultSelectors: ['resourceType', 'contextSystem'],
        environment: this.environment,
        hideCloseButton : true,
        pluginRegistry : {
        contextSystem : {
            selector : {
                id : "dropdown",
                    source : [
                    {value : "cstat_afg", label : "CountrySTAT Afghanistan"},
                    {value : "uneca", label : "UNECA"}
                ],
            default : ["cstat_afg"],
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