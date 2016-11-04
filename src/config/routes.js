/*global define*/
define(function() {

        'use strict';

        return {
            '(/)': 'onLanding',
            '(/)landing(/)': 'onLanding',

            '(/)home(/)': 'onHome',
            '(/)add(/)': 'onAdd',

            '(/)metadata(/)': 'onMetadata',
            '(/)dsd(/)': 'onDSD',
            '(/)data(/)': 'onData',

            '(/)close(/)' : 'onClose',
            '(/)delete(/)': 'onDelete',
            '(/)search(/)': 'onSearch',
            '(/)not-found(/)': 'onNotFound',

            '(/)denied(/)': 'onDenied',

            // fallback route
            '(/)*path': 'onDefaultRoute'
        }
    }
);