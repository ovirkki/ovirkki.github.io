define(["app/databaseIF"], function(databaseIF) {

    return {
        initialize: function() {
            $("#dataLoad").click(databaseIF.downloadFile);
        }
    };
});
