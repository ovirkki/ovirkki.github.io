define(["underscore"], function(_) {

    function getNoteListElement(formationData, formationKey) {
        var noteData = formationData[formationKey].notes;
        console.log("formationData: " + JSON.stringify(formationData));
        var noteListTableElement = $("<td></td>");
        var noteListElement = $("<ul></ul>").addClass("notelist").attr("id", "notelist-" + formationKey);
        if(!_.isEmpty(noteData)) {
            var notesAsHtmlElementList = Object.keys(noteData).map(function(noteId) {
                var noteText = noteData[noteId].freeText;
                if(noteText === undefined) {
                    return "Text not found";
                }
                return generateNoteListItem(noteText);
            });
            noteListElement.append(notesAsHtmlElementList);
        }
        return noteListTableElement.append(noteListElement);
    }

    function renderOnePicture(key, noteData) {
        var addButton = $("<button>add</button>").addClass("noteButton addButton").attr("id", "add-" + key);
        var pictureElement = $("<li></li>").addClass("pictureItem").attr("id", "picture-" + key).html(key.toUpperCase());
        //pictureElement.append(addButton);

        pictureElement.append(renderNotes(noteData));
        return pictureElement;
    }

    function generateNoteListItem(noteText) {
        var removeButton = $("<button>remove</button>").addClass("noteButton");
        return $("<li>" + noteText + "</li>").append(removeButton);
    }

    return {
        renderData: function(data) {
            console.log(JSON.stringify(data));
            $formationTable = $("<table></table>");
            $formationTable.append(_.keys(data).map(function(key) {
                var rowElement = $("<tr></tr>").addClass("row").attr("id", "row-" + key);
                rowElement.append($("<td>" + key + "</td>").addClass("formationCode"));
                rowElement.append(getNoteListElement(data, key));
                return rowElement;
            }));
            $("#output").append($formationTable);
        },
        addNewNote: function(key, text) {
            $("#notelist-" + key).append(generateNoteListItem(text));
        }
    };
});
