define(["underscore", "require"], function(_, require) {

    var RANDOMS = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "O", "P", "Q"];
    var BLOCKS_AAA = _.range(1, 23).map(convertToString);
    var BLOCKS_A = [2, 4, 6, 7, 8, 9, 19, 21].map(convertToString);

    function convertToString(item) {
        return item.toString();
    }

    function getAllFormations() {
        //check checkbox for inter/open
        var className = $("input[name=classSelector]:checked").val();
        if(className === "open") {
            return RANDOMS.concat(BLOCKS_AAA);
        } else {
            return RANDOMS.concat(BLOCKS_A);
        }
    }

    function isInSelectedClass(key) {
        return _.contains(getAllFormations(), key);
    }

    function getNoteDataElement(formationData, formationKey) {
        if(_.isEmpty(formationData[formationKey]) || _.isEmpty(formationData[formationKey].notes)) {
        } else {
            var notes = formationData[formationKey].notes;
            var $notesAsTableRows = _.keys(notes).map(function(noteId) {

                return generateNoteTableRow(formationKey, noteId, notes[noteId].freeText);
            });
            $("#row-" + formationKey.toUpperCase()).show();
            return $notesAsTableRows;
        }
    }

    function generateNoteTableRow(key, id, noteText) {
        var $noteTableRowElement = $("<tr></tr>").attr("id", "noteId-" + id);
        if(noteText === undefined) {
            return "Text not found";
        }
        return $noteTableRowElement.append($("<td>" + noteText + "</td>")).append($("<td></td>").append(generateNoteButtons(key, id)));
    }

    function generateNoteButtons(key, noteId) {
        var relevanceCheck = ""; //checkpoint
        var $removeButton = $("<button>remove</button>").addClass("noteRemoveButton");
        /*$removeButton.click(function(event) {
            console.log("rem");
            require("app/dataHandler").removeNote("a",4);
        });*/
        $removeButton.data("key", key);
        $removeButton.data("noteId", noteId);
        require("app/eventHandler").addListenerForNoteRemoveButton($removeButton, key, noteId);
        var $updateButton = $("<button>update</button>").addClass("noteButton");
        return $("<div></div>").append($updateButton).append($removeButton);
    }

    function clearStatusBar() {
        $(".statusbar").empty();
    }

    function clearData() {
        $("#dataTable").empty();
    }

    function initRows() {
        clearData();
        var formationList = RANDOMS.concat(BLOCKS_AAA);

        var $formationRows = formationList.map(function(key) {
            var $rowElement = $("<tr></tr>").addClass("formationRow").attr("id", "row-" + key);
            $rowElement.append($("<td>" + key.toUpperCase() + "</td>").addClass("formationCode"));
            var $notesTableElement = $("<table><tbody></tbody></table>").addClass("noteTable").attr("id", "notetable-" + key);

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
        $("#addNewNoteModal").hide();
        $("#overlay").hide();
        $(".noteTextfield").empty();
    }

    function generateNewNoteForm() {
        var $form = $("<form></form>").attr("id", "addNoteForm");
        var $textField = $('<label for="noteDescription">Add note:</label>' +
                '<input type="text" name="noteDescription" class="txtfield">');
        var $submit = $('<input type="submit" value="Add note">');
        return $form.append($textField, $submit);
    }

    function generateFormationSelection() {
        $("#newNoteFormation").empty();
        var formationList = getAllFormations();
        var $formationElements = formationList.map(function(formationKey) {
            return $("<option>" + formationKey + "</option>").attr("value", formationKey);
        });
        return $("#newNoteFormation").append($formationElements);
    }

    function isEmptyElement($element) {
        return $element.children().length === 0;
    }

    function hideRowIfTableElementisEmpty($tableElement) {
        console.log("table html: " + $tableElement.html());
        if(isEmptyElement($tableElement) || $tableElement.html() == "<tbody></tbody>") {
            $tableElement.closest(".formationRow").hide();
        }
    }

    return {
        initialize: function() {
            //initNoteAddModalElements();
            $(".requiresData").prop( "disabled", true );
        },

        initDataTable: function() {
            initRows();
        },

        renderData: function(data) {
            console.log(JSON.stringify(data));
            initRows();
            _.keys(data).filter(isInSelectedClass).forEach(function(key) {
                $("#row-" + key.toUpperCase() + " .noteTable").append(getNoteDataElement(data, key)); //add some check that if row(formation) not in data then it is nodata
            });
            $(".requiresData").prop( "disabled", false );
        },
        addNewNote: function(key, id, text) {
            var rowId = "#row-" + key.toUpperCase();
            $(rowId + " .noteTable").append(generateNoteTableRow(key, id, text));
            $(rowId).show();
        },
        removeNote: function(key, id) {
            $("#row-" + key + " #noteId-" + id).remove();
            hideRowIfTableElementisEmpty($("#row-" + key + " .noteTable"));
        },
        updateStatusBar: function(text) {
            clearStatusBar();
            $(".statusbar").text(text);
        },
        clearStatusBar: clearStatusBar,
        filterData: function() {
            console.log("clicked");

            $(".noteTable").each(function(index, element) {
                hideRowIfTableElementisEmpty($(element));
            });
        },
        unfilterData: function() {
            $(".formationRow").show();
        },
        openNoteAddModal: function() {
            generateFormationSelection();
            $("#addNewNoteModal").show();
            $("#overlay").show();
        },
        closeNewNoteModal: closeModal,
        generateFormationSelection: generateFormationSelection
    };
});
