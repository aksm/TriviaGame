$(document).ready(function() {
	var apicall = "http://jservice.io/api/random?count=26";
	var parsedData = "";
	var question = "";

	$.getJSON(apicall, function(data){

    	parsedData = JSON.parse(JSON.stringify(data));
    	// console.log(parsedData);
    	
		question = parsedData[0].question;
	// console.log(question);
    $("#question").html("<h2>"+question+"</h2>");

    });
	// for(i=0;i<parsedData.length;i++) {
	// 	if(parsedData[i].invalid_count == !null) {
			
	// 	}
	// }
});