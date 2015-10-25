define(["app/databaseIF"], function(databaseIF) {

    return {
        initialize: function() {
            //init page
            $("#dataLoad").click(databaseIF.downloadFile);

        }
    };
});