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
        //var $notesTableElement = $("<table></table>").addClass("noteTable").attr("id", "notetable-" + formationKey.toUpperCase());
        if(_.isEmpty(formationData[formationKey]) || _.isEmpty(formationData[formationKey].notes)) {
            //return $notesTableElement.addClass("noData");
        } else {
            var $notesAsTableRows = _.values(formationData[formationKey].notes).map(function(noteData) {
                return generateNoteTableRow(noteData.freeText);
            });
            //$notesTableElement.append(notesAsTableRows);
            console.log("SHOW1: " + formationKey);
            $("#row-" + formationKey.toUpperCase()).show();
            return $notesAsTableRows;
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
            var $notesTableElement = $("<table></table>").addClass("noteTable").attr("id", "notetable-" + key);

            $rowElement.append($("<td></td>").addClass("noteData").append($notesTableElement));

            $rowElement.hide();
            return $rowElement;
        });
        $("#dataTable").append($formationRows);
    }

    function initNoteAddModalElements() {
        var $content = $('<div id="newNoteQuery"></div>');
        var $close = $('<a id="close" href="#">close</a>');

        $("#modal").hide();
        $("#overlay").hide();
        $("#modal").append($content, $close);
    }

    function closeModal(event) {
        event.preventDefault();
        $("#modal").hide();
        $("#overlay").hide();
        $("#newNoteQuery").empty();
    }

    function generateNewNoteForm() {
        var $form = $("<form></form>").attr("id", "addNoteForm");
        var $textField = $('<label for="noteDescription">Add note:</label>' +
                '<input type="text" name="noteDescription" class="txtfield">');
        var $submit = $('<input type="submit" value="Add note">');
        return $form.append($textField, $submit);
    }

    return {
        initialize: function() {
            initNoteAddModalElements();
        },

        initDataTable: function() {
            initRows();
        },

        renderData: function(data) {
            console.log(JSON.stringify(data));
            initRows();
            _.keys(data).forEach(function(key) {
                $("#row-" + key.toUpperCase() + " .noteTable").append(getNoteDataElement(data, key)); //add some check that if row(formation) not in data then it is nodata
            });
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

            $(".noteTable").each(function(index, element) {
                if($(element).children().length === 0) {
                    $(element).closest(".formationRow").hide();
                }
            });
        },
        unfilterData: function() {
            $(".formationRow").show();
        },
        openNoteAddModal: function() {
            $("#newNoteQuery").append(generateNewNoteForm());
            $("#addNewNoteModal").show();
            $("#overlay").show();
        }
    };
});
