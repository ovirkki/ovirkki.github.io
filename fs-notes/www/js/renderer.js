define(["bluebird", "underscore", "app/dataHandler"], function(Promise, _, dataHandler) {

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

                return generateNoteListItem(formationKey, noteId, notes[noteId].freeText);
            });
            $("#data-" + formationKey.toUpperCase()).show();
            return $notesAsTableRows;
        }
    }

    function generateNoteListItem(key, noteId, noteText) {
        var $listItem = $("<li></li>").addClass("notelistitem").attr("id", "noteId-" + noteId);//.css("display", "inline");
        if(noteText === undefined) {
            noteText = "Text not found";
        }

        var $textField = $('<a href="#"></a>').text(noteText);
        $textField.bind( "taphold", function(event) {
            event.preventDefault();
            dataHandler.updateNote(key, noteId, "testText");
            $textField.text("testText");
            //avaa popup form, ehkä yhteinen note addin kanssa
            //also update textField
        });

        var $removeButton = $('<a href="#">remove</a>').attr("data-icon", "delete").attr("id", "removeButton");
        $removeButton.bind( "tap", function(event) {
            event.preventDefault();
            dataHandler.removeNote(key, noteId);
            $listItem.remove();
        });
        return $listItem.append($textField).append($removeButton);
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
            var $formationKey = $("<h4>" + key + "</h4>");
            var $noteList = $("<ul></ul>").attr("data-role", "listview").addClass("notelist");
            $noteList.trigger("create");
            //$noteList.append("<li>afadf</li>");
            $formationElement.append($formationKey).append($noteList);
            $formationElement.hide();
            return $formationElement;
        });
        $("#contentContainer").append($formations);//.collapsible({theme:'c',refresh:true});
        $('div[data-role=collapsible]').collapsible({theme:'c',refresh:true});
        //$("#contentContainer").trigger("refresh");

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

    function hideRowIfTableElementisEmpty($noteElement) {
        //console.log("table html: " + $tableElement.html());
        if(isEmptyElement($noteElement)) {
            $noteElement.closest(".formationRow").hide();
        }
    }

    function initButtonListeners() {
//pitäisikö kaikissa käyttää jquery mobilen "tap" clickin sijaan?

        $("#dataLoad").click(dataHandler.loadData); //TODO: joku oletko varma-tyylinen varmistus. Vai tarviiko lainkaan?
        $("#addnote").click(function() {
            dataHandler.addNote("F", "Code generated text");
            //renderer.addNewNote("F", 3, "Code generated text");
        });
        $("#dataUpload").click(dataHandler.uploadData);
        /*$("#dataFiltering").click(function() {
            if($("#dataFiltering").prop("checked")) {
                filterData();
            } else {
                unfilterData();
            }
        });*/
        /*$("#addNoteForm").submit(function(event) {
            event.preventDefault();
            dataHandler.addNote($("#newNoteFormation").val(), $(".noteTextfield").val());
            renderer.closeNewNoteModal(event);
        });*/
        //$("#cancelNewNote").click(renderer.closeNewNoteModal);
        /*$(".classRadio").change(function() {
            var data = dataHandler.getRenderedData();
            if(!_.isEmpty(data)) {
                renderer.renderData(data);
                renderer.generateFormationSelection();
            }
        });*/
    }



    return {
        initialize: function() {
            $(".startsUgly").show();
            dataHandler.downloadData()
            .then(function(data) {
                initRows();
                _.keys(data).filter(isInSelectedClass).forEach(function(key) {
                    $("#data-" + key.toUpperCase() + " .notelist").append(getNoteDataElement(data, key));
                });
                $(".notelist").listview().listview("refresh");
                $(".requiresData").prop( "disabled", false );
            });
        },
        addNewNote: function(key, id, text) {
            $("#data-" + key.toUpperCase() + " .notelist").append(generateNoteListItem(key, id, text));
            $("#data-" + key.toUpperCase() + " .notelist").listview("refresh");
            $("#data-" + key.toUpperCase()).show();
        },
        removeNote: function(key, id) {
            $("#data-" + key + " #noteId-" + id).remove();
            hideRowIfTableElementisEmpty($("#row-" + key + " .noteCell"));
        },
        filterData: function() {
            console.log("clicked");

            $(".noteCell").each(function(index, element) {
                hideRowIfTableElementisEmpty($(element));
            });
        },
        unfilterData: function() {
            $(".formationRow").show();
        },
        openNoteAddModal: function() {
            console.log("ADD");
            //generateFormationSelection();
            $("#addNewNoteModal").show();
            $("#overlay").show();
        },
        closeNewNoteModal: closeModal,
        generateFormationSelection: generateFormationSelection
    };
});
