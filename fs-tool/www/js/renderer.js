define(["underscore"], function(_) {

    var RANDOMS = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "O", "P", "Q"];
    var BLOCKS_AAA = _.range(1, 22).map(convertToString);
    var BLOCKS_A = [2, 4, 6, 7, 8, 9, 19, 21].map(convertToString);

    function convertToString(item) {
        return item.toString();
    }

    function getNoteDataElement(formationData, formationKey) {
        console.log("get note data for " + formationKey);
        //var allNotes = formationData[formationKey].notes;
        console.log("formationData: " + JSON.stringify(formationData));
        var $notesTableElement = $("<table></table>").addClass("noteTable").attr("id", "notetable-" + formationKey.toUpperCase());
        if(_.isEmpty(formationData[formationKey]) || _.isEmpty(formationData[formationKey].notes)) {
            return $notesTableElement.addClass("noData");
        } else {
            var notesAsTableRows = _.values(formationData[formationKey].notes).map(function(noteData) {
                return generateNoteTableRow(noteData.freeText);
            });
            return $notesTableElement.append(notesAsTableRows);
        }
    }

    function generateNoteTableRow(noteText) {
        var noteTableRowElement = $("<tr></tr>");
        if(noteText === undefined) {
            return "Text not found";
        }
        return noteTableRowElement.append($("<td>" + noteText + "</td>")).append($("<td></td>").append(generateNoteButtons));
    }

    function generateNoteButtons(noteText) {
        var relevanceCheck = ""; //checkpoint
        var removeButton = $("<button>remove</button>").addClass("noteButton");
        var updateButton = $("<button>update</button>").addClass("noteButton");
        return $("<div></div>").append(updateButton).append(removeButton);
    }

    function clearStatusBar() {
        $(".statusbar").empty();
    }

    function initRows() {

        var formationList = RANDOMS.concat(BLOCKS_A); //TODO select blocks according to checkbox for inter/open

        var $formationRows = formationList.map(function(key) {
            var $rowElement = $("<tr></tr>").addClass("formationRow").attr("id", "row-" + key);
            $rowElement.append($("<td>" + key.toUpperCase() + "</td>").addClass("formationCode"));
            $rowElement.append($("<td></td>").addClass("noteData"));
            return $rowElement;
        })
        $("#dataTable").append($formationRows);
    }

    return {
        initDataTable: function() {
            initRows();
        },

        renderData: function(data) {
            console.log(JSON.stringify(data));
            initRows();
            _.keys(data).forEach(function(key) {
                $("#row-" + key.toUpperCase() + " .noteData").append(getNoteDataElement(data, key)); //add some check that if row(formation) not in data then it is nodata
            })
        },
        addNewNote: function(key, text) {
            $("#notetable-" + key).append(generateNoteTableRow(text));
        },
        updateStatusBar: function(text) {
            clearStatusBar();
            $(".statusbar").text(text);
        },
        clearStatusBar: clearStatusBar,
        filterData: function() {
            console.log("clicked");
            /*$(".noData").each(function(index, row) {
                $(row + ".noData")
            });*/
            $(".noData").closest(".formationRow").hide();
        }
    };
});
