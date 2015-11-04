requirejs.config({
    baseUrl: "js/lib",
    paths: {
        app: "../",
        jquery: 'jquery',
        'jquery.mobile-config': 'jquery.mobile-config',
        'jquery.mobile': 'jqm/jquery.mobile-1.4.5',
        //'jquery.mobile.asyncfilter': 'libs/jqm/asyncfilter',
        underscore: 'underscore'
    },
    shim: {
        'underscore': {
            exports: "_"
        },
        'jquery.mobile-config': ['jquery'],
        'jquery.mobile': ['jquery','jquery.mobile-config'],
        //'jquery.mobile.asyncfilter': ['jquery.mobile'],
        "app/dataHandler": ["gapiClient"]
    }
});

requirejs(["jquery", "jquery.mobile", "gapiClient", "app/dataHandler", "app/eventHandler", "app/renderer"],
    function($, mobile, gapiClient, dataHandler, eventHandler, renderer) {
        $(function(){
            //setTimeout(function() {
                dataHandler.initialize();
            //}, 2000);
            //renderer.initialize();
            eventHandler.initialize();
        });
        /*$(document).ready(function() {
            renderer.initialize();
            eventHandler.initialize();
        });*/
    }
);
