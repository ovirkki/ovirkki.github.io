requirejs.config({
    baseUrl: "www/js/lib",
    paths: {
        app: "../",
        jquery: 'jquery',
        'jquery.mobile-config': 'jquery.mobile-config',
        'jquery.mobile': 'jqm/jquery.mobile-1.4.5',
        //'jquery.mobile.asyncfilter': 'libs/jqm/asyncfilter',
        underscore: 'underscore',
        'async': 'requirejs-plugins/async'
    },
    shim: {
        'underscore': {
            exports: "_"
        },
        "mobileOverride": ['jquery'],
        'jquery.mobile-config': ['jquery'],
        'jquery.mobile': ['jquery','jquery.mobile-config']
        //'jquery.mobile.asyncfilter': ['jquery.mobile'],
        //"app/dataHandler": ["gapiClient"]
    }
});

define('gapi', ['async!https://apis.google.com/js/client.js!onload'],
    function(){
        console.log('gapi loaded');
        return gapi;
    }
);

requirejs(["jquery", "jquery.mobile", "mobileOverride", "app/renderer", "gapi"],
    function($, mobile, mobileOverride, renderer, gapi) {
        $(function(){
        //$(document).on("pagecreate",function() {
            if ( $.mobile.autoInitializePage === false) {
                $.mobile.initializePage();
            }
            renderer.initialize();
        });
        /*$(document).ready(function() {
            renderer.initialize();
            eventHandler.initialize();
        });*/
    }
);
