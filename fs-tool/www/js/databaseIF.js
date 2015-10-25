define(["gapiClient"], function() {

    var CLIENT_ID = '709524761846-8htbrhrd9gvt6dkb1m1j13n1hha68b61.apps.googleusercontent.com';

    var SCOPES = ['https://www.googleapis.com/auth/drive'];

    function gDriveAuthorize() {
        gapi.auth.authorize(
            {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
            handleAuthResult);
        return false;
    }

    function handleAuthResult(authResult) {
        if (authResult && !authResult.error) {
            console.log("Auth success");
        } else {
            console.log("Auth fail");
        }
    }


    return {
        downloadFile: function() {
            console.log("Auth starting");
            gDriveAuthorize();
        }
    };
});