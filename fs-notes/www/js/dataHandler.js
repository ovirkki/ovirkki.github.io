define(["app/databaseIF", "app/renderer", "underscore", "bluebird"], function(databaseIF, renderer, _, Promise) {

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
        renderer.addNewNote(key, noteId, noteText);
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
        renderedData[key].notes[noteId] = undefined;
        renderer.removeNote(key, noteId);

        console.log("renderedData after note removal: " + JSON.stringify(renderedData));
    }

    return {
        loadData: function() {
            databaseIF.downloadData()
            .then(function(data) {
                downloadedData = data;
                renderedData = deepCloneObject(downloadedData);
                renderer.renderData(renderedData);

            })
            .then(function() {

            })
            .catch(function(err) {
                console.log(err);
                renderer.updateStatusBar("Download failed.");
            });

        },
        uploadData: function() {
            databaseIF.uploadData(renderedData)
            .catch(function() {
                renderer.updateStatusBar("Upload failed.");
            });
        },
        addNote: addNote,
        removeNote: removeNote,
        getRenderedData: function() {
            return renderedData;
        }
    };
});
