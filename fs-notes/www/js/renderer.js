define(["bluebird", "underscore", "app/dataHandler"], function(Promise, _, dataHandler) {

    var RANDOMS = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "O", "P", "Q"];
    var BLOCKS_AAA = _.range(1, 23).map(convertToString);
    var BLOCKS_A = [2, 4, 6, 7, 8, 9, 19, 21].map(convertToString);

    function convertToString(item) {
        return item.toString();
    }

    function updateNoteCount(key) {
        var noteCount = dataHandler.getNoteCount(key);
        console.log("new notecount for " + key + ": " + noteCount);
        $("#data-" + key).data("noteCount", noteCount);
    }

    function getAllFormations() {
        //check checkbox for inter/open
        var className = $("input[name=class]:checked").val();
        console.log("get all formations, class: " + className);
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

                return generateNoteListItem(formationKey, noteId, notes[noteId].freeText);
            });
            $("#data-" + formationKey.toUpperCase()).show();
            return $notesAsTableRows;
        }
    }

    function noteUpdateHandler(key, noteId, currentText) {
        //$("#newNoteFormation-button span").val(key);
        generateFormationSelection(key);
        //$("#newNoteFormation").empty();
        //$("#newNoteFormation").val(key);
        //$('select').selectmenu('refresh');
        $("#newNoteFormation").prop("disabled", true);
        //$("#newNoteFormation").trigger("refresh");
        $("#noteTextfield").data("noteId", noteId);
        $("#noteTextfield").val(currentText);
        $("#noteAddPopup").popup("open", {
            transition: "fade"
        });
    }

    function generateNoteListItem(key, noteId, noteText) {
        var $listItem = $("<li></li>").addClass("notelistitem").attr("id", "noteId-" + noteId);//.css("display", "inline");
        if(noteText === undefined) {
            noteText = "Text not found";
        }

        var $textField = $('<a href="#"></a>').attr("id", "noteText").text(noteText);
        $textField.bind( "taphold", function(event) {
            event.preventDefault();
            noteUpdateHandler(key, noteId, noteText);
            //avaa popup form, ehkä yhteinen note addin kanssa
            //also update textField
        });

        var $removeButton = $('<a href="#">remove</a>').attr("data-icon", "delete").attr("id", "removeButton");
        $removeButton.bind("tap", function(event) {
            event.preventDefault();
            dataHandler.removeNote(key, noteId);
            $listItem.remove();
            updateNoteCount(key);
            executeFilters();
        });
        return $listItem.append($textField).append($removeButton);
    }

    function executeFilters() {
        console.log("execute filters!!");
        var formationList = RANDOMS.concat(BLOCKS_AAA);
        formationList.forEach(function(key) {
            var $formationElement = $("#data-" + key);
            if(!isInSelectedClass(key)) {
                $formationElement.hide();
                return;
            }
            if($("#filterEmpty").prop("checked") && $formationElement.data("noteCount") === 0) {
                $formationElement.hide();
                return;
            }
            $formationElement.show();
        });
    }

    function clearData() {
        $("#contentContainer").empty();
    }

    function initRows() {

        clearData();
        var formationList = RANDOMS.concat(BLOCKS_AAA);

        var $formations = formationList.map(function(key) {
            var $formationElement = $("<div></div>").attr("data-role", "collapsible").attr("data-collapsed-icon", "arrow-d").attr("data-expanded-icon", "arrow-u");
            $formationElement.addClass("formationdata").attr("id", "data-" + key);
            $formationElement.data("noteCount", dataHandler.getNoteCount(key));
            var $formationKey = $("<h4>" + key + "</h4>");
            var $noteList = $("<ul></ul>").attr("data-role", "listview").addClass("notelist");
            $noteList.trigger("create");
            $formationElement.append($formationKey).append($noteList);
            if($("#filterEmpty").prop("checked")) {
                $formationElement.hide();
            }
            return $formationElement;
        });
        $("#contentContainer").append($formations);//.collapsible({theme:'c',refresh:true});
        $('div[data-role=collapsible]').collapsible({theme:'c',refresh:true});
        $("#contentContainer").trigger("refresh");

    }

    function generateNewNoteForm() {
        var $form = $("<form></form>").attr("id", "addNoteForm");
        var $textField = $('<label for="noteDescription">Add note:</label>' +
                '<input type="text" name="noteDescription" class="txtfield">');
        var $submit = $('<input type="submit" value="Add note">');
        return $form.append($textField, $submit);
    }

    function generateFormationSelection(formationKey) {
        $("#newNoteFormation").empty();
        var formationList = getAllFormations();
        var $formationElements = formationList.map(function(formationKey) {
            return $("<option>" + formationKey + "</option>").attr("value", formationKey);
        });
        $("#newNoteFormation").append($formationElements);
        $("#newNoteFormation").val(formationKey || "A");
        $('select').selectmenu('refresh');
    }

    function isEmptyElement($element) {
        return $element.children().length === 0;
    }

    function hideRowIfTableElementisEmpty($noteElement) {
        //console.log("table html: " + $tableElement.html());
        console.log($noteElement);
        if(isEmptyElement($noteElement)) {
            console.log("isempty!!");
            $noteElement.closest(".formationData").hide();
        }
    }

    function hideEmptys() {
        console.log("hide empty");
        //NOT WORKING BECAUSE NOTELIST IS ARIA-HIDDEN WHEN NOTES ARE HIDDEN. MAybe add counter anyway in key data about the number of notes?
        $(".formationdata").each(function(index, element) {
            console.log("each");
            if($(element).data("noteCount") === 0) {
                $(element).hide();
            }
            //hideRowIfTableElementisEmpty($(element));
        });
    }
    function showAllData() {
        $(".formationdata").show();
    }

    function initButtonListeners() {
//pitäisikö kaikissa käyttää jquery mobilen "tap" clickin sijaan?

        $("#dataLoad").click(dataHandler.loadData); //TODO: joku oletko varma-tyylinen varmistus. Vai tarviiko lainkaan?
        $("#addnote").click(function() {
            generateFormationSelection();
            $("#noteAddPopup").popup("open", {
                transition: "fade"
            });
            //dataHandler.addNote("F", "Code generated text");
            //renderer.addNewNote("F", 3, "Code generated text");
        });
        $("#dataUpload").click(dataHandler.uploadData);

        $("#addNoteForm").submit(function(event) {
            event.preventDefault();
            var key = $("#newNoteFormation").val();
            var noteText = $("#noteTextfield").val();
            var noteId = $("#noteTextfield").data("noteId");
            $("#noteTextfield").removeData("noteId"); // remove to not cause fuzz later
            if(noteId) {
                dataHandler.updateNote(key, noteId, noteText);
                $("#data-" + key + " #noteId-" + noteId + " #noteText").text(noteText);
                console.log("Note updated");
            } else {
                dataHandler.addNote(key, noteText);
                $("#data-" + key + " .notelist").append(generateNoteListItem(key, noteId, noteText));
                updateNoteCount(key);
                console.log("Note added");
            }
            //var noteId = dataHandler.getNoteId(key, noteText);

            $("#data-" + key + " .notelist").listview("refresh");
            if(isInSelectedClass(key)) {
                $("#data-" + key).show();
            }
            $("#newNoteFormation").prop("disabled", false);
            $("#noteAddPopup").popup("close");
        });
        $("input[name=class]").change(function() {
            executeFilters();
            /*
            var data = dataHandler.getRenderedData();
            if(!_.isEmpty(data)) {
                renderData(data);
            }*/
        });
        $("#filterEmpty").click(function() {
            executeFilters();
            /*
            if($("#filterEmpty").prop("checked")) {
                hideEmptys();
            } else {
                showAllData();
            }*/
        });
    }

    function renderData(data) {
        initRows();
        _.keys(data).forEach(function(key) {
            $("#data-" + key.toUpperCase() + " .notelist").append(getNoteDataElement(data, key));
        });
        executeFilters();
        $(".notelist").listview().listview("refresh");

    }

    return {
        initialize: function() {
            $(".startsUgly").show();
            initButtonListeners();
            dataHandler.downloadData()
            .then(function(data) {
                renderData(data);
            });
        },
        removeNote: function(key, id) {
            $("#data-" + key + " #noteId-" + id).remove();
            hideRowIfTableElementisEmpty($("#row-" + key + " .noteCell"));
        },
    };
});
