define([
    'jquery',
    'loglevel',
    'backbone'
],function ($, log, Backbone) {
        var widgetName = 'data';
        var evtTextFileUploading = 'uploading';
        var evtTextFileUploaded = 'uploaded';
        var defConfig = {
            accept: [],
            maxFileBytes: 0
        };

        function FileUploadHelper(config) {
            log.info("{FUH} started.");
            this.config = {};
            $.extend(true, this.config, defConfig, config);
            for (var i = 0; i < this.config.accept.length; i++)
                this.config.accept[i] = this.config.accept[i].toLowerCase();
            this.$uploadInput;
        };

        FileUploadHelper.prototype.render = function (fileInputId) {
            log.info("{FUH} render ");
            this.initUploadInput(fileInputId);
        }

        FileUploadHelper.prototype.reset = function () {
            log.info("{FUH} reset ");
            this.$uploadInput.val('');
        }

        FileUploadHelper.prototype.initUploadInput = function (inputId) {
            log.info("{FUH} initUploadInput ");
            this.$uploadInput = $(inputId);
            var me = this;

            this.$uploadInput.on('change', function (e) {
                log.info("{FUH} changed ");
                if (me.config.accept && me.config.accept.length > 0) {
                    var ext = me.$uploadInput.val().split(".").pop().toLowerCase();
                    if ($.inArray(ext, me.config.accept) == -1) {
                        //alert(mlRes.wrongFileType);
                        alert("wrong file type");
                        me.reset();
                        return false;
                    }
                }
                if (me.config.maxFileBytes != 0) {
                    if (e.target.files.item(0).size > me.config.maxFileBytes) {
                        //alert(mlRes.maxFileSizeIs.replace("%max%", (me.config.maxFileBytes / 1048576)));
                        alert('too big');
                        me.reset();
                        return false;
                    }
                }
                if (e.target.files != undefined) {
                    var reader = new FileReader();
                    Backbone.trigger(widgetName+":"+evtTextFileUploading);
                    reader.onload = function (e) {
                        var str = e.target.result;
                        log.info("{FUH} event triggering ");
                        log.info(widgetName+":"+evtTextFileUploaded);
                        Backbone.trigger(widgetName+":"+evtTextFileUploaded,str);
                    };
                    reader.readAsText(e.target.files.item(0));
                }
                return false;
            });
        }

        FileUploadHelper.prototype.enabled = function (isEnabled) {
            log.info("{FUH} enabled ");
            if (isEnabled) {
                this.$uploadInput.removeAttr('disabled');
            }
            else {
                this.$uploadInput.attr('disabled', 'disabled');
            }
        }

        FileUploadHelper.prototype.destroy = function () {
            log.info("{FUH} destroy ");
            this.$uploadInput.off('change');
        }

        return FileUploadHelper;
    });
