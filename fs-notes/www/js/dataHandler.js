define(["app/databaseIF", "bluebird"], function(databaseIF, Promise) {

    var downloadedData = {};
    var renderedData = {};

    function deepCloneObject(source) {
        var asString = JSON.stringify(source);
        return JSON.parse(asString);
    }

    function getFirstFreeNoteId(notesObject) {
        for(var i = 1;true;i++) {
            if(notesObject[i] === undefined) {
                return i;
            }
        }
    }

    function addNote(key, noteText) {
        console.log("Add note for " + key + ": " + noteText);
        if(renderedData[key] === undefined) {
            renderedData[key] = {};
        }
        if(renderedData[key].notes === undefined) {
            renderedData[key].notes = {};
        }
        var noteId = getFirstFreeNoteId(renderedData[key].notes);
        renderedData[key].notes[noteId] = {
            freeText: noteText
        };
        console.log("renderedData after note add: " + JSON.stringify(renderedData));
    }

    function removeNote(key, noteId) {
        if(renderedData[key] === undefined) {
            console.log("ERROR: Tried to remove note from non-existing formation!! Key: " + key + ", id: " + noteId);
            return;
        }
        if(renderedData[key].notes === undefined || renderedData[key].notes[noteId] === undefined) {
            console.log("ERROR: Tried to remove non-existing note!! Key: " + key + ", id: " + noteId);
            return;
        }
        console.log("Remove note, id: " + noteId + ", note text: " + renderedData[key].notes[noteId].freeText);
        delete renderedData[key].notes[noteId];
        console.log("renderedData after note removal: " + JSON.stringify(renderedData));
    }

    function updateNote(key, noteId, noteText) {
        renderedData[key].notes[noteId].freeText = noteText;
        console.log("renderedData after note update: " + JSON.stringify(renderedData));

    }

    function downloadData() {
        return databaseIF.downloadData()
        .then(function(data) {
            console.log("Data: " + JSON.stringify(data));
            downloadedData = data;
            renderedData = deepCloneObject(downloadedData);
            return renderedData;
        });
    }

    return {
        downloadData: downloadData,
        uploadData: function() {
            databaseIF.uploadData(renderedData);
        },
        addNote: addNote,
        removeNote: removeNote,
        updateNote: updateNote,
        getNoteId: function(key, noteText) {
            return _.findKey(renderedData[key].notes, function(value) {
                return value.freeText === noteText;
            });
        },
        getNoteCount: function(key) {
            if(renderedData[key] === undefined || _.isEmpty(renderedData[key].notes)) {
                return 0;
            } else {
                return _.keys(renderedData[key].notes).length;
            }
        },
        getRenderedData: function() {
            return renderedData;
        }
    };
});
