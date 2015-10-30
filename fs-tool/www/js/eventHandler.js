define(["app/dataHandler"], function(dataHandler) {

    return {
        initialize: function() {
            $("#dataLoad").click(dataHandler.loadData);
            $("#addNote").click(dataHandler.addNote);
        }
    };
});
