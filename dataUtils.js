var dataFileAddress = "dataFile.json";
var githubCredentials = {
    username: "ovirkki",
    passwd: "itsar11"
};

var shaOfPreviousGet;

var completeData;

function startAuth() {
    window.addEventListener('message', function (event) {
        console.log("DATA: " + event.data);
        var code = event.data;
        /*$('#code').val(code);
        // Step 5
        $.get('token.php?code=' + code, function (access_token) {
            // Step 7
            $('#access_token').val(access_token);
            $.getJSON('https://api.github.com/user?access_token=' + access_token, function (user) {
                $('#username').val(user.login);
            });
        });*/
    });

    window.open("https://github.com/login/oauth/authorize?scope=repo&client_id=85403ef9459db043e755");
}

function readFile() {
    authJS();
    //getFile()
    /*$.ajax({
        url: dataFileAddress,
        dataType: "json",
        success: handleData
    });*/
}

function writeFile() {
    auth(pushFile);
}

function handleData(data) {
    console.log("All data: " + JSON.stringify(data));
    if(data === undefined) {
    	console.log("Empty data");
    	return;
    }
    completeData = data;

    renderData(data);
}

function getFirstFreeNoteId(notesObject) {
    var idList = Object.keys(notesObject);
    return idList.length + 1;
}

function addNote(key, noteText) {
    console.log("Add note for " + key + ": " + noteText);
    if(completeData[key] === undefined) {
        completeData[key] = {};
    }
    if(completeData[key].notes === undefined) {
        completeData[key].notes = {};
    }
    var noteId = getFirstFreeNoteId(completeData[key].notes);
    completeData[key].notes[noteId] = {
        freeText: noteText
    };
}

function renderNotes(notes) {
    var noteListElement = $("<ul></ul>").addClass("notelist");
    var notesAsHtmlElementList = Object.keys(notes).map(function(noteId) {
        var noteText = notes[noteId].freeText;
        if(noteText === undefined) {
            return "Text not found";
        }
        var removeButton = $("<button>remove</button>").addClass("noteButton");
        return $("<li>" + noteText + "</li>").append(removeButton);
    });
    return noteListElement.append(notesAsHtmlElementList);
}

function renderOnePicture(key, noteData) {
    var addButton = $("<button>add</button>").addClass("noteButton addButton").attr("id", "add-" + key);
    var pictureElement = $("<li></li>").addClass("pictureItem").attr("id", "picture-" + key).html(key.toUpperCase());
    //pictureElement.append(addButton);

    pictureElement.append(renderNotes(noteData));
    return pictureElement;
}

function isValidData(data) {
    console.log("is valid: " + JSON.stringify(data));
    return data !== undefined &&
        data.notes !== undefined &&
        Object.keys(data.notes).length >= 1;
}

function addNoteHandler() {
    $modal.show();
    $overlay.show();
    //to be removed-->
    addNote("6", "ei liikaa vertikaalia");
    $modal.hide();
    $overlay.hide();
    renderData(completeData);
}

function renderData(data) {
    $(".dataBox").empty();
    $(".dataBox").append("<ul class=\"pictureList\"></ul>");
    Object.keys(data).filter(function(key) {
        return isValidData(data[key]);
    })
    .forEach(function(key) {
        console.log("foreach for key: " + key);
        $(".pictureList").append(renderOnePicture(key, data[key].notes));
    });
}


function getNoteAddModalElements() {
    $overlay = $('<div id="overlay"></div>');
    $modal = $('<div id="modal"></div>');
    $content = $('<div id="content"></div>');
    $close = $('<a id="close" href="#">close</a>');

    $modal.hide();
    $overlay.hide();
    $modal.append($content, $close);
    return [$overlay, $modal];
}

function closeModal(event) {
    event.preventDefault();
    $modal.hide();
    $overlay.hide();
    $content.empty();
}

function authJS() {
    var url = "https://github.com/login/oauth/authorize?scope=repo&client_id=85403ef9459db043e755";
    var request = new XMLHttpRequest();
    var params = "action=something";
    request.open('POST', url, true);
    request.onreadystatechange = function() {if (request.readyState==4) alert("It worked!");};
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    //request.setRequestHeader("Content-length", params.length);
    //request.setRequestHeader("Connection", "close");
    request.send();
}

function auth() {
    console.log("start auth");
    var tok = githubCredentials.username + ':' + githubCredentials.passwd;
    var hash = btoa(tok);
    var authString = "Basic " + hash;
    var data = {
        "clientId": "85403ef9459db043e755",
        "scopes": ["repo", "user"]
    };
    $.ajax
      ({
        type: "GET",
        //url: "https://github.com/login/oauth/authorizations",
        url: "https://github.com/login/oauth/authorize?scope=repo&client_id=85403ef9459db043e755",
        contentType: 'application/x-www-form-urlencoded',
        //dataType: 'jsonp',
        //async: false,
        //data: data,
        xhrFields: {
           mozSystem: false
        },
        beforeSend: function (xhr){
            //xhr.setRequestHeader('Authorization', authString);
        },
        success: function (){
            console.log("github auth success");
            //callback();
        },
        error: function() {
            console.log("github auth fail");
        }
    });
}

function getToken() {

}

function auth2(callback) {
    var tok = githubCredentials.username + ':' + githubCredentials.passwd;
    var hash = btoa(tok);
    var authString = "Basic " + hash;
    $.ajax
      ({
        type: "GET",
        url: "https://api.github.com",
        dataType: 'json',
        async: false,
        data: '{}',
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', authString);
        },
        success: function (){
            console.log("github auth success");
            callback();
        },
        failure: function() {
            console.log("github auth fail");
        }
    });
}

function pushFile() {
    var data = {
        test: "data"
    };
    var url = "https://api.github.com/repos/ovirkki/ovirkki.github.io/contents/dataFile.json";
    var codedContent = btoa(JSON.stringify(data));
    var pushData = {
        "path": "dataFile.json",
        "message": "Data file update",
        /*"committer": {
            "name": "Otto Virkki",
            "email": "otto.virkki@gmail.com"
        },*/
        "content": codedContent,
        "sha": shaOfPreviousGet
    };
    $.ajax
      ({
        type: "PUT",
        contentType: "application/json",
        url: url,
        dataType: 'json',
        //async: false,
        data: pushData,
        success: function(data) {
            console.log("github put success");
        },
        error: function(xhr) {
            console.log("github put fail");
            console.log(xhr.responseText);
        }
    });
}

function getFile() {
    console.log("start getting");
    var url = "https://api.github.com/repos/ovirkki/ovirkki.github.io/contents/dataFile.json";
    $.ajax
      ({
        type: "GET",
        url: url,
        dataType: 'json',
        async: false,
        success: function(data) {
            console.log("github get success");
            console.log(JSON.stringify(data));
            shaOfPreviousGet = data.sha;

            var decodedData = atob(data.content);
            console.log(JSON.stringify(decodedData));
        },
        error: function() {
            console.log("github get fail");
        }
    });
}

//-----------------------------------------------------
/*function getFile() {
	$.ajax({
    	url: "https://api.github.com/users/ovirkki",
    	//type: "POST",
    	//type: "GET",
    	dataType: "application/json; charset=utf-8",
    	username: "ovirkki", // Most SAP web services require credentials
    	//password: "itsar11",
    	//processData: false,
    	contentType: "application/json",
    	success: function () {
        	alert("success");
     	},
     	error: function (xhr, ajaxOptions, thrownError) { //Add these parameters to display the required response
     		console.log(JSON.stringify(xhr));
        	alert(xhr.status);
        	alert(xhr.responseText);
     	}
 	});
}*/
