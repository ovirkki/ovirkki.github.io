define(["bluebird", "underscore", "app/renderer"], function(Promise, _, renderer) {

    var CLIENT_ID = '709524761846-8htbrhrd9gvt6dkb1m1j13n1hha68b61.apps.googleusercontent.com';
    var SCOPES = ['https://www.googleapis.com/auth/drive'];
    var DATAFILENAME = "fsDataFile.json";
    var FILE_ID = "0B3jVRf_xGpuyTF9KeXBJWEtCSDg";

    function gDriveAuthorize() {
        renderer.updateStatusBar("Authorizing to database");
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
            } else {
                renderer.updateStatusBar("Authorization successful");
            }
        })
        .catch(function(error) {
            renderer.updateStatusBar("Authorization failed");
            console.log("auth failed, error cause: " + error);
            throw error;
        });
    }

    function getFileId(fileList) {
        var fileData = _.find(fileList, function(file) {
            console.log("filename: " + file.title);
            return file.title === DATAFILENAME;
        });
        console.log("file found: " + fileData.title + ", id: " + fileData.id);
        return fileData.id;
    }

    function gapiRequestPromise(request) {
        return new Promise(function(resolve) {
            request.execute(function(data) {
                resolve(data);
            });
        });
    }

    function downloadDataFromGDrive() {
        renderer.updateStatusBar("Downloading data");
        return gapi.client.load('drive', 'v2')
        .then(function() {
            var request = gapi.client.request({
                'path': '/drive/v2/files/' + FILE_ID,
                'method': 'GET',
                'params': {'alt': 'media'},
            });
            return gapiRequestPromise(request);
        });
    }

    function uploadDataToGDrive(data) {
        console.log("upload to google drive: " + JSON.stringify(data));
        renderer.updateStatusBar("Uploading data");
        return gapi.client.load("drive", "v2")
        .then(function() {
            var base64Data = btoa(JSON.stringify(data));
            var request = gapi.client.request({
                'path': '/upload/drive/v2/files/' + FILE_ID,
                'method': 'PUT',
                'params': {'uploadType': 'media'},
                'headers': {
                    "Content-Encoding": "base64"
                },
                'body': base64Data
            });
            return gapiRequestPromise(request);
        });
    }

    function handleData(resp) {
        console.log("resp: " + JSON.stringify(resp));
        //var fileList = resp.items;
        //var fileId = getFileId(resp.items);
    }

    return {
        downloadData: function() {
            return gDriveAuthorize()
            .then(function() {
                return downloadDataFromGDrive();
            })
            .tap(function() {
                renderer.updateStatusBar("Download completed successfully.");
            })
            .catch(function(error) {
                renderer.updateStatusBar("Download failed.");
                console.log("download fail: " + error);
            });;
        },
        uploadData: function(data) {
            return gDriveAuthorize()
            .then(function() {
                console.log("here");
                return uploadDataToGDrive(data);
            })
            .tap(function() {
                renderer.updateStatusBar("Upload completed successfully.");
            })
            .catch(function(error) {
                renderer.updateStatusBar("Upload failed.");
                console.log("upload fail: " + error);
            });
        }
    };
});
