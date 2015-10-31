define(["app/dataHandler", "app/renderer"], function(dataHandler, renderer) {

    return {
        initialize: function() {
            $("#dataLoad").click(dataHandler.loadData);
            $("#addNote").click(dataHandler.addNote);
            $("#dataUpload").click(dataHandler.uploadData);
            $("#dataFiltering").click(renderer.filterData);
            //maybe disable buttons by default and enable here to prevent non respondance at the beginning of page load
        }
    };
});
