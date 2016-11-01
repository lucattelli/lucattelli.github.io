function generate() {
	
	$("#name").html($("#input_name").val());
	$("#job").html($("#input_job").val());

	var telephones = "";
	if ($("#input_telephone_type1").val() != "") {
		telephones = $("#input_telephone_type1").val() + ": " + $("#input_telephone1").val() + " ";
	}

	if ($("#input_telephone_type2").val() != "") {
		telephones = telephones + $("#input_telephone_type2").val() + ": " + $("#input_telephone2").val();
	}

	$("#telephone").html(telephones);
	$("#email").html("E: <a href='" + $("#input_email").val() + "'>" + $("#input_email").val() + "</a> - <a href='http://www.cyrius.it/''>www.cyrius.it</a>");

	$("#form").fadeOut("slow", function() {
		$("#wrapper").fadeIn("slow");
		$("#reset").fadeIn("slow");
	});
	
}

function downloadURI(uri, name) {
	var link = document.createElement("a");
	link.download = name;
	link.href = uri;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	delete link;
}

function asimage() {
	html2canvas($("#sign"), {
	    onrendered: function(canvas) {
	        var img = canvas.toDataURL();
	        downloadURI(img, "sign.png");
	    }
	});
}