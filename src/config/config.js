/*global define*/
define(function() {

        'use strict';

       return {
           lang : "EN",

           config: {
               contextSystem :"fenix_develop",
               datasources : ["D3S"],
               resourceRepresentationType: "dataset"
           },

           menuItems : ['home', 'landing', 'search', 'add', 'metadata', 'dsd', 'data', 'delete', 'close'],
           menuItemsEnabledOnStart : ['add', 'search', 'landing'],
           menuItemsEnableOnValidResource : ['delete', 'metadata', 'dsd', 'data', 'home', 'close']
       };

    }
);