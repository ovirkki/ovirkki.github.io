function readFile() {
    $("#randoms .dataBox").text("Text from code");
}

function parseData(data) {
    console.log("All data: " + JSON.stringify(data));
    if(data === undefined) {
    	console.log("Empty data");
    	return;
    } 
    completeData = data;
    var randoms = data.randoms;
    var blocks = data.blocks;
    displayData(data);

	$("#randoms .dataBox").text(JSON.stringify(randoms));
}

function getFile() {
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
}