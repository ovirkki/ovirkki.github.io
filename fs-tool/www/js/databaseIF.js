define(["gapiClient", "app/renderer", "bluebird", "underscore"], function(gapiClient, renderer, Promise, _) {

    var CLIENT_ID = '709524761846-8htbrhrd9gvt6dkb1m1j13n1hha68b61.apps.googleusercontent.com';
    var SCOPES = ['https://www.googleapis.com/auth/drive'];
    var DATAFILENAME = "fsDataFile.json";
    var FILE_ID = "0B3jVRf_xGpuyTF9KeXBJWEtCSDg";

    var downloadedData;

    function gDriveAuthorize() {
        return Promise.try(function() {
            return gapi.auth.authorize({
                client_id: CLIENT_ID, scope: SCOPES, immediate: true
            });
        })
        .then(function(authResult) {
            if (!authResult || authResult.error) {
                return gapi.auth.authorize({
                    client_id: CLIENT_ID, scope: SCOPES, immediate: false
                })
                .then(function(authResult) {
                    if (!authResult || authResult.error) {
                        return Promise.reject("Auth failed! " + authResult? authResult.error : "unknown reason");
                    }
                });
            }
        })
        .catch(function(error) {
            console.log("auth failed, error cause: " + error);
            throw error;
        });
    }

    function handleAuthResult(authResult) {
        if (authResult && !authResult.error) {
            console.log("Auth success");
            downloadData();
        } else {
            console.log("Auth fail");
        }
    }

    function getFileId(fileList) {
        var fileData = _.find(fileList, function(file) {
            console.log("filename: " + file.title);
            return file.title === DATAFILENAME;
        });
        console.log("file found: " + fileData.title + ", id: " + fileData.id);
        return fileData.id;
    }

    function downloadData() {

        return Promise.try(function() {
            return gapi.client.load('drive', 'v2');
        })
        .then(function() {
            var request = gapi.client.request({
                'path': '/drive/v2/files/' + FILE_ID,
                'method': 'GET',
                'params': {'alt': 'media'},
            });
            return new Promise(function(resolve) {
                request.execute(function(data) {
                    console.log("data1: " + JSON.stringify(data));
                    //downloadedData = data;
                    resolve(data);
                });
            });
        });
    }

    function handleData(resp) {
        console.log("resp: " + JSON.stringify(resp));
        //var fileList = resp.items;
        //var fileId = getFileId(resp.items);
    }

    return {
        downloadFile: function() {
            console.log("Auth starting");
            gDriveAuthorize()
            .then(function() {
                return downloadData();
            })
            .then(function(fsData) {
                renderer.renderData(fsData);
            });
        }
    };
});
