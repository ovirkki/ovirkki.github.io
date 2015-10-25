requirejs.config({
    baseUrl: "js/lib",
    paths: {
        app: "../"
    }
});

requirejs(["jquery", "app/renderer"],
    function($, renderer) {
        $(document).ready(function() {
            renderer.initialize();
        });
    }
);