define(["app/dataHandler", "app/renderer", "underscore"], function(dataHandler, renderer, _) {

    return {
        initialize: function() {
            $("#dataLoad").click(dataHandler.loadData);
            //$("#addnote").click(renderer.openNoteAddModal);
            $("#addnote").click(function() {
                dataHandler.addNote("F", "Code generated text");
                //renderer.addNewNote("F", 3, "Code generated text");
            });
            $("#dataUpload").click(dataHandler.uploadData);
            $("#dataFiltering").click(function() {
                if($("#dataFiltering").prop("checked")) {
                    renderer.filterData();
                } else {
                    renderer.unfilterData();
                }
            });
            $("#addNoteForm").submit(function(event) {
                event.preventDefault();
                dataHandler.addNote($("#newNoteFormation").val(), $(".noteTextfield").val());
                renderer.closeNewNoteModal(event);
            });
            $("#cancelNewNote").click(renderer.closeNewNoteModal);
            $(".classRadio").change(function() {
                var data = dataHandler.getRenderedData();
                if(!_.isEmpty(data)) {
                    renderer.renderData(data);
                    renderer.generateFormationSelection();
                }
            });
        },
        addListenerForNoteRemoveButton: function($button, key, noteId) {
            $button.bind( "tap", function(event) {
            //$button.click(function(event) {
                event.preventDefault();
                //console.log("eventhand remove!: " + $button.data("key") + $button.data("noteId"));
                //var key = $(this).closest(".formationCode").val();
                //console.log("button: " + JSON.stringify($button));
                //console.log("KEY: " + key);
                dataHandler.removeNote(key, noteId);
            });
            //maybe disable buttons by default and enable here to prevent non respondance at the beginning of page load
        },
        addListenerForNoteUpdateEvent: function($button, key, noteId, noteText) {
            $button.bind( "taphold", function(event) {
                event.preventDefault();
                dataHandler.updateNote(key, noteId, noteText);
            });
            //maybe disable buttons by default and enable here to prevent non respondance at the beginning of page load
        }
    };
});
