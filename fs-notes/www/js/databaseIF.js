define(["bluebird"], function(Promise) {

    var CLIENT_ID = '709524761846-8htbrhrd9gvt6dkb1m1j13n1hha68b61.apps.googleusercontent.com';
    var SCOPES = ['https://www.googleapis.com/auth/drive'];
    var DATAFILENAME = "fsDataFile.json";
    var FILE_ID = "0B3jVRf_xGpuyTF9KeXBJWEtCSDg";


    function updateStatus(text) {
        $("#statustext").text(text);
    }

    function gDriveAuthorize() {
        updateStatus("Authorizing to database");
        return Promise.try(function() {
            return gapi.auth.authorize({
                client_id: CLIENT_ID, scope: SCOPES, immediate: true
            });
        })
        .catch(function() {
            updateStatus("Log in needed");
            return gapi.auth.authorize({
                client_id: CLIENT_ID, scope: SCOPES, immediate: false
            });
        })
        .then(function() {
            updateStatus("Authorization successful");
        })
        .catch(function(error) {
            updateStatus("Authorization failed");
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
        updateStatus("Downloading data");
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
        updateStatus("Uploading data");
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

    return {
        downloadData: function() {
            $("#loadStatus").popup("open", {
                transition: "fade"
            });
            return gDriveAuthorize()
            .then(function() {
                return downloadDataFromGDrive();
            })
            .tap(function() {
                updateStatus("Download completed successfully.");
                setTimeout(function() {
                    $("#loadStatus").popup("close");
                }, 700);
            })
            .catch(function(err) {
                updateStatus("Download failed");
                console.log(err);
            });
        },
        uploadData: function(data) {
            $("#loadStatus").popup("open", {
                transition: "fade"
            });
            return gDriveAuthorize()
            .then(function() {
                console.log("here");
                return uploadDataToGDrive(data);
            })
            .tap(function() {
                updateStatus("Upload completed successfully.");
                setTimeout(function() {
                    $("#loadStatus").popup("close");
                }, 700);
            })
            .catch(function(err) {
                updateStatus("Upload failed");
                console.log(err);
            });
        }
    };
});
