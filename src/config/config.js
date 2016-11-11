/*global define*/
define(function() {

        'use strict';

       return {
           lang : "EN",

           menuItems : ['home', 'landing', 'search', 'add', 'metadata', 'dsd', 'data', 'delete', 'close'],
           menuItemsEnabledOnStart : ['add', 'search', 'landing'],
           menuItemsEnableOnValidResource : ['delete', 'metadata', 'dsd', 'data', 'home', 'close']
       };

    }
);