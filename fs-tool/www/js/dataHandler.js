define(["app/databaseIF", "app/renderer", "underscore", "bluebird"], function(databaseIF, renderer, _, Promise) {

    var downloadedData = {};
    var renderedData = {};

    function deepCloneObject(source) {
        var asString = JSON.stringify(source);
        return JSON.parse(asString);
        //return JSON.parse(JSON.stringify(source));
    }

    function getFirstFreeNoteId(notesObject) {
        var idList = Object.keys(notesObject);
        return idList.length + 1;
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
        if(renderedData[key] === undefined) {
            console.log("ERROR: Tried to remove note from non-existing formation!! Key: " + key + ", id: " + noteId);
            return;
        }
        if(renderedData[key].notes === undefined || renderedData[key].notes[noteId]) {
            console.log("ERROR: Tried to remove non-existing note!! Key: " + key + ", id: " + noteId);
            return;
        }
        renderedData[key].notes[noteId] = undefined;

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
