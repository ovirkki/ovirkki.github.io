define([], function() {

    return {
        renderData: function(data) {
            $("#output").text(JSON.stringify(data));
        }
    };
});
