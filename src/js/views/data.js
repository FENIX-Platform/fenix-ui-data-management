define([
    "jquery",
    "backbone",
    "loglevel",
    "q",
    "fenix-ui-DataEditor",
    "../components/file-uploader",
    '../../nls/labels',
    "../../html/data.hbs",
    "../../html/file-uploader.hbs"
], function ($, Backbone, log, Q, DataEditor, FileUploader, labels, template, templateFileUploader) {

    "use strict";

    var rowlimit = null;

    var s = {

        DATA_EL: '[data-role="data"]',
        SAVE_BUTTON: "[data-role='save']",
        KEEP_NEW_DATA_BUTTON: "[data-role='keep-new']",
        KEEP_OLD_DATA_BUTTON: "[data-role='keep-old']",
        ABORT_MERGE_BUTTON: "[data-role='abort-merge']",
        CSV_MATCHER_OK: "[data-role='csv-matcher-ok']",
        CSV_MATCHER_CANCEL: "[data-role='csv-matcher-cancel']",


        utility: '#fx-data-management-utility-holder',
        btnFileUploader: "#btnFileUploader",
        btnDelAllData: "#btnDelAllData",
        dataFileUpload: "#dataFUpload",
        csvSeparator: "#csvSeparator"
    };

    var p = {
        lblUpload : "#lblUpload",
        lblSeparator : "#lblSeparator",
        csvSeparatorComma : "#csvSeparatorComma",
        csvSeparatorSemi : "#csvSeparatorSemi"
    };

    var DataView = Backbone.View.extend({

        render: function (o) {
            $.extend(true, this, {initial: o});

            this._parseInput();

            var valid = this._validateInput();

            if (valid === true) {

                log.info("{Data} Rendering View");

                this._attach();

                this._initVariables();

                this._initFileUploader();

                this._initViews();

                this._bindEventListeners();

            } else {
                log.error("Impossible to render Data");
                log.error(valid)
            }

            log.info("{Data} Rendering View", this);

            return this;
        },

        _parseInput: function () {

            this.environment = this.initial.environment;
            this.lang = this.initial.lang.toLowerCase();
            this.cLists = this.initial.codelists;
            this.dsd = this.initial.dsd;
            this.data = this.initial.data;
            this.generator = this.initial.generator;
        },

        _validateInput: function () {

            var valid = true,
                errors = [];

            return errors.length > 0 ? errors : valid;
        },

        _attach: function () {
            this.$el.html(template({
                saveBtn: labels[this.lang]['btnUpdateResource']
            }));

        },

        _initVariables: function () {

            this.$savebtn = this.$el.find(s.SAVE_BUTTON);

            this.$dataEditorEl = this.$el.find(s.DATA_EL);

            this.$utility = this.$el.find(s.utility);

        },

        _initViews: function () {
            log.info("{Data} initViews");

            var self = this;
            this.$utility.hide();
            this.$savebtn.prop("disabled", true);

            DataEditor.init(this.$dataEditorEl, { lang:this.lang }, null);

            DataEditor.on("data:restoreupload", function(){
                self.$utility.show();
                self.$savebtn.prop("disabled", false);
            });

            DataEditor.on("error:showerrormsg", function (msg) {
                Backbone.trigger("error:showerrormsg", msg);
            });

            DataEditor.on("data:loaded", function () {
                self.$utility.show();
                self.$savebtn.prop("disabled", false);
                Backbone.trigger("data:loaded");
            });

            log.info('{Data} Calling the Codelists');

            this.generator.then(function (result) {
                //Data.isEditable(false);

                self.cLists = result;
                log.info('{Data} Calling the DSD');//, result);
                var dsd = self.dsd.columns;
                log.info('{Data} Setting the DSD...');//, dsd);
                log.warn(JSON.stringify(dsd));
                log.warn(JSON.stringify(self.cLists));
                DataEditor.setColumns(dsd, self.cLists, null);
                log.info("{Data} DSD Columns Setted.");//, self.data);
                if (self.data !== undefined) {
                    DataEditor.setData(self.data, rowlimit);
                    log.info("{Data} But not the data!");
                }
                DataEditor.setStatus('loaded');
                self.$utility.show();
                self.$savebtn.prop("disabled", false);
            })

        },

        _initFileUploader: function () {


            this.$utility.html(templateFileUploader({
                uploadCSV: labels[this.lang]['DatalblUpload'],
                csvSparator: labels[this.lang]['DatalblSeparator'],
                csvSeparatorComma: labels[this.lang]['DatalblcsvSeparatorComma'],
                csvSeparatorSemi: labels[this.lang]['DatalblcsvSeparatorSemi']
            }));

            this.$btnFileUploader = this.$el.find(s.btnFileUploader);
            this.$csvSeparator = this.$el.find(s.csvSeparator);
            this.$lblSeparator = this.$el.find(p.lblSeparator);
            this.$dataFileUpload = this.$el.find(s.dataFileUpload);

            this.$csvSeparator.on("click", function(e){
                e.stopPropagation();
            });

            log.info('init file uploader');
            this.fUpload = new FileUploader({accept: ['csv']});
            this.fUpload.render(s.dataFileUpload);

        },

        _bindEventListeners: function () {
            log.info('{Data} _bindEventListeners');
            var self = this;

            this.$savebtn.on("click", function () {
                var exist = DataEditor.getData();
                log.info("{DATA} saving", exist);
                if (!!exist) {
                    Backbone.trigger("data:saving",exist);
                } else {
                    Backbone.trigger("error:showerror", "invalidData");
                }
            });

            this.listenTo(Backbone, "data:uploaded", function (str) {
                log.info("{DATA}[EVT] data:uploaded ");
                self._csvLoaded(str);
            });
        },

        _removeEventListeners: function () {

            this.$savebtn.off();
        },

        _csvLoaded: function (data) {
            log.info(' csv loaded ');
            if (this.$csvSeparator.val() === '') {
                this.$btnFileUploader.addClass('has-error');
                this.$lblSeparator.addClass('has-error');
                Backbone.trigger("error:showerrormsg", labels[this.lang]['CSVSEPARATOR']);
                this.$dataFileUpload.val('');
            } else {
                this.$btnFileUploader.removeClass('has-error');
                this.$lblSeparator.removeClass('has-error');
                this.fUpload.reset();
                this.$utility.hide();
                this.$savebtn.prop("disabled", true);
                DataEditor.csvLoaded(data, {}, this.$csvSeparator.val());
            }
        },

        accessControl: function (Resource) {

            return new Q.Promise(function (fulfilled, rejected) {
                if (!$.isEmptyObject(Resource)) {
                    fulfilled();
                } else {
                    rejected();
                }
            });
        },

        remove: function () {
            log.warn("{DATA} - Remove View");
            this._removeEventListeners();
            DataEditor.destroy();
            this.$utility.html('');
            this.$utility.show();
            this.$savebtn.prop("disabled", false);
            Backbone.View.prototype.remove.apply(this, arguments);
        }
    });

    return DataView;

});