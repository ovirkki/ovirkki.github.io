requirejs.config({
    baseUrl: "js/lib",
    paths: {
        app: "../"
    }
});

requirejs(["jquery", "app/eventHandler"],
    function($, eventHandler) {
        $(document).ready(function() {
            eventHandler.initialize();
        });
    }
);
