define([
    'views/base/view',
    'text!fx-d-m/templates/data.hbs',
    'fx-DataEditor/start',
    'fx-d-m/components/resource-manager',
    'chaplin'
], function (View, template, DataEditor, ResourceManager, Chaplin) {
    'use strict';

    var DataView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'data-view',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        attach: function () {
            View.prototype.attach.call(this, arguments);

            var columns, data;
            this.resource = ResourceManager.getCurrentResource();
            if (!this.resource || !this.resource.metadata || !this.resource.metadata.dsd || !this.resource.metadata.dsd.columns)
                return;
            columns = this.resource.metadata.dsd.columns;
            data = this.resource.data;

            //columns = [{"id":"Year","title":{"EN":"Year"},"key":true,"dataType":"year","domain":null,"subject":"time","supplemental":null},{"id":"Item","title":{"EN":"Item"},"key":true,"dataType":"code","domain":{"codes":[{"idCodeList":"ECO_Elements"}]},"subject":"item","supplemental":null},{"id":"Value","title":{"EN":"Value"},"key":false,"dataType":"number","subject":"value","supplemental":null}]
            //data = [["2000","310229","100"],["2000","310500","200"],["2001","310229","150"],["2001","31","20"]]

            /*console.log("Columns")
            console.log(columns)
            console.log("Data")
            console.log(data)*/

            //DSD Editor service URLs
            var servicesUrls = {
                metadataUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources/metadata",
                dsdUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources/dsd",
                dataUrl: "http://faostat3.fao.org/d3s2/v2/msd/resources"
            };
            this.bindEventListeners();
            //Data Editor container
            var dataEditorContainerID = "#DataEditorMainContainer";
            DataEditor.init(dataEditorContainerID,
                { servicesUrls: servicesUrls },
                function () {
                    DataEditor.setColumns(columns,
                        function () { DataEditor.setData(data); })
                });
        },

        bindEventListeners: function () {
            var me = this;
            $('#dataEditEnd').on("click", function () {
                console.log('click');
                var data = DataEditor.getData();
                var colDist = DataEditor.getColumnsWithDistincts();

                me.resource.metadata.dsd.columns = colDist;
                me.resource.data = data;

                ResourceManager.putData(me.resource,
                    ResourceManager.updateDSD(me.resource, function () {
                        ResourceManager.loadResource(me.resource,
                        function () { Chaplin.utils.redirectTo('data#show'); })
                    })
                    );

                console.log(JSON.stringify(data));
                console.log(JSON.stringify(colDist));

                console.log("---------------------")

            });


            /*


            $('#btnColsEditDone').on('click', function () {
                columnsDSD = DSDEditor.getColumns();
                if (columnsDSD) {
                    if (data)
                        me.resource.data = data;
                    if (!me.resource.metadata.dsd)
                        me.resource.metadata.dsd = {};
                    me.resource.metadata.dsd.columns = columnsDSD;
                    ResourceManager.updateDSD(me.resource.metadata.uid,
                        me.resource.metadata.version,
                        me.resource.metadata.dsd,
                        function () {
                            ResourceManager.loadResource(me.resource,
                            function () { Chaplin.utils.redirectTo('data#show'); })
                        });
                }
            })


            */
        },

        unbindEventListeners: function () {
            $('#dataEditEnd').off();
        },

        dispose: function () {

            DataEditor.destroy();

            View.prototype.dispose.call(this, arguments);
        }



    });

    return DataView;
});
