define(["app/databaseIF", "app/renderer", "underscore", "bluebird"], function(databaseIF, renderer, _, Promise) {

    var downloadedData = {};
    var renderedData = {};

    function deepCloneObject(source) {
        var asString = JSON.stringify(source);
        console.log("as string: " + asString);
        return JSON.parse(asString);
        //return JSON.parse(JSON.stringify(source));
    }

    function getFirstFreeNoteId(notesObject) {
        var idList = Object.keys(notesObject);
        return idList.length + 1;
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
        renderer.addNewNote(key, noteText);
        console.log("renderedData after note add: " + JSON.stringify(renderedData));
    }

    return {
        loadData: function() {

            databaseIF.downloadData()
            .then(function(data) {
                console.log("datahandler data: " + JSON.stringify(data));
                downloadedData = data;
                renderedData = deepCloneObject(downloadedData);
                renderer.renderData(renderedData);

            })
            .catch(function(err) {
                console.log("ERR: " + err);
            });

        },
        uploadData: function() {
            databaseIF.uploadData(renderedData);
        },
        addNote: function() {
            var key = "a";
            var noteText = "testiteksti";
            addNote(key, noteText);
        },
        getRenderedData: function() {
            return renderedData;
        }
    };
});
