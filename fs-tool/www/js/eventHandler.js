define(["app/dataHandler", "app/renderer", "underscore"], function(dataHandler, renderer, _) {

    return {
        initialize: function() {
            $("#dataLoad").click(dataHandler.loadData);
            $("#addNote").click(renderer.openNoteAddModal);
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
            $(".noteRemoveButton").click(function() {
                //JOSTAIN SYYSTÄ CLICK EI TOIMI TÄSSÄ!!
                console.log("remove!");
                var key = $(this).closest(".formationCode").val();
                console.log("KEY: " + keyremove);
            });
            //maybe disable buttons by default and enable here to prevent non respondance at the beginning of page load
        }
    };
});
