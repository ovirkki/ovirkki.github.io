define(["app/dataHandler", "app/renderer"], function(dataHandler, renderer) {

    return {
        initialize: function() {
            $("#dataLoad").click(dataHandler.loadData);
            $("#addNote").click(dataHandler.addNote);
            $("#dataUpload").click(dataHandler.uploadData);
            $("#dataFiltering").click(function() {
                if($("#dataFiltering").prop("checked")) {
                    renderer.filterData();
                } else {
                    renderer.unfilterData();
                }
            });
            $("#addNoteForm").submit(function() {
                console.log("submitted!");
            })
            //maybe disable buttons by default and enable here to prevent non respondance at the beginning of page load
        }
    };
});
