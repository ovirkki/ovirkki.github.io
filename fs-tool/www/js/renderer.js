define(["underscore"], function(_) {

    function getNoteDataElement(formationData, formationKey) {
        var allNotes = formationData[formationKey].notes;
        console.log("formationData: " + JSON.stringify(formationData));
        var notesTableElement = $("<table></table>").addClass("noteTable").attr("id", "notetable-" + formationKey);
        if(!_.isEmpty(allNotes)) {
            var notesAsTableRows = _.values(allNotes).map(function(noteData) {
                return generateNoteTableRow(noteData.freeText);
            });
            return notesTableElement.append(notesAsTableRows);
        }
        return notesTableElement;
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

    return {
        renderData: function(data) {
            console.log(JSON.stringify(data));
            $formationTable = $("<table></table>");
            $formationTable.append(_.keys(data).map(function(key) {
                var rowElement = $("<tr></tr>").addClass("row").attr("id", "row-" + key);
                rowElement.append($("<td>" + key.toUpperCase() + "</td>").addClass("formationCode"));
                rowElement.append($("<td></td>").append(getNoteDataElement(data, key)));
                return rowElement;
            }));
            $("#output").append($formationTable);
        },
        addNewNote: function(key, text) {
            $("#notetable-" + key).append(generateNoteTableRow(text));
        }
    };
});
