define(["underscore"], function(_) {

    function getNoteListElement(formationData) {
        var noteData = formationData.notes;
        var noteListElement = $("<ul></ul>").addClass("notelist");
        var notesAsHtmlElementList = Object.keys(notes).map(function(noteId) {
            var noteText = notes[noteId].freeText;
            if(noteText === undefined) {
                return "Text not found";
            }
            var removeButton = $("<button>remove</button>").addClass("noteButton");
            return $("<li>" + noteText + "</li>").append(removeButton);
        });
        return noteListElement.append(notesAsHtmlElementList);
    }

    function renderOnePicture(key, noteData) {
        var addButton = $("<button>add</button>").addClass("noteButton addButton").attr("id", "add-" + key);
        var pictureElement = $("<li></li>").addClass("pictureItem").attr("id", "picture-" + key).html(key.toUpperCase());
        //pictureElement.append(addButton);

        pictureElement.append(renderNotes(noteData));
        return pictureElement;
    }

    return {
        renderData: function(data) {
            console.log(JSON.stringify(data));
            $formationTable = $("<table></table>");
            $formationTable.append(_.keys(data).map(function(key) {
                var rowElement = $("<tr></tr>").addClass("row").attr("id", "row-" + key);
                rowElement.append($("<td>" + key + "</td>").addClass("formationCode"));
                rowElement.append(getNoteListElement(data[key]));
                return rowElement;
            }));
            $("#output").append($formationTable);
        }
    };
});
