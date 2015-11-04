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
        'jquery.mobile': ['jquery','jquery.mobile-config']
        //'jquery.mobile.asyncfilter': ['jquery.mobile'],
    }
});

requirejs(["jquery", "jquery.mobile", "gapiClient", "app/eventHandler", "app/renderer"],
    function($, mobile, gapiClient, eventHandler, renderer) {
        $(function(){
            renderer.initialize();
            eventHandler.initialize();
        });
        /*$(document).ready(function() {
            renderer.initialize();
            eventHandler.initialize();
        });*/
    }
);
