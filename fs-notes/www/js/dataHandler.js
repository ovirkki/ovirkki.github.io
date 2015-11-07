define(["app/databaseIF", "bluebird"], function(databaseIF, Promise) {

    var downloadedData = {};
    var renderedData = {};

    function deepCloneObject(source) {
        var asString = JSON.stringify(source);
        return JSON.parse(asString);
        //return JSON.parse(JSON.stringify(source));
    }

    function getFirstFreeNoteId(notesObject) {
        var unoccupied = _.findKey(notesObject, function(value) {
            return value === undefined;
        });
        return unoccupied || Object.keys(notesObject).length + 1; //If no empty id, fill
    }

    function addNote(key, noteText) {
        console.log("Add note for " + key + ": " + noteText);
        key = key.toUpperCase();
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
        console.log("REMOVE called: " + key + noteId);
        console.log("key data: " + JSON.stringify(renderedData[key]));
        if(renderedData[key] === undefined) {
            console.log("ERROR: Tried to remove note from non-existing formation!! Key: " + key + ", id: " + noteId);
            return;
        }
        if(renderedData[key].notes === undefined || renderedData[key].notes[noteId] === undefined) {
            console.log("ERROR: Tried to remove non-existing note!! Key: " + key + ", id: " + noteId);
            return;
        }
        console.log("Remove note: " + renderedData[key].notes[noteId]);
        //renderedData[key].notes[noteId] = undefined;
        delete renderedData[key].notes[noteId];
        console.log("renderedData after note removal: " + JSON.stringify(renderedData));
    }

    function updateNote(key, noteId, noteText) {
        console.log("UPDATE!!");
        console.log("key: " + key + ", " + noteId + ", " + noteText);
        renderedData[key].notes[noteId].freeText = noteText;
        console.log("renderedData after note update: " + JSON.stringify(renderedData));

    }

    function downloadData() {
        return databaseIF.downloadData()
        .then(function(data) {
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
                console.log("data hand get note count: " + _.keys(renderedData[key].notes).length);
                return _.keys(renderedData[key].notes).length;
            }
        },
        getRenderedData: function() {
            return renderedData;
        }
    };
});
