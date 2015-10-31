requirejs.config({
    baseUrl: "js/lib",
    paths: {
        app: "../"
    }
});

requirejs(["jquery", "gapiClient", "app/eventHandler"],
    function($, gapiClient, eventHandler) {
        $(document).ready(function() {
            eventHandler.initialize();
        });
    }
);
