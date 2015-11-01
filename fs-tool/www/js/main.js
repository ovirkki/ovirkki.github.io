requirejs.config({
    baseUrl: "js/lib",
    paths: {
        app: "../"
    }
});

requirejs(["jquery", "gapiClient", "app/eventHandler", "app/renderer"],
    function($, gapiClient, eventHandler, renderer) {
        $(document).ready(function() {
            renderer.initialize();
            eventHandler.initialize();
        });
    }
);
