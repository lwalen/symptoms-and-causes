var error = {"no cause": "Don't have anything on that cause"}

var params = function () {
	// This function is anonymous, is executed immediately and 
	// the return value is assigned to QueryString!
	var query_string = {};
	var query = window.location.search.substring(1).replace(/%20/g, ' ');
	console.log(query);
	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");
		if (pair[1] && pair[1].substr(pair[1].length - 1) === '/') {
			pair[1] = pair[1].substr(0, pair[1].length - 1);
		}

		// If first entry with this name
		if (typeof query_string[pair[0]] === "undefined") {
			query_string[pair[0]] = pair[1];
			// If second entry with this name
		} else if (typeof query_string[pair[0]] === "string") {
			var arr = [ query_string[pair[0]], pair[1] ];
			query_string[pair[0]] = arr;
			// If third or later entry with this name
		} else {
			query_string[pair[0]].push(pair[1]);
		}
	} 
	return query_string;
} ();

$.arrayIntersect = function(a, b)
{
    return $.grep(a, function(i)
    {
        return $.inArray(i, b) > -1;
    });
};

function printSymptoms(symptoms) {
	console.log(symptoms);
	var html = "";
	for (var i = 0; i < symptoms.length; i++) {
		html += "<p><a href='?symptoms=" + symptoms[i] + "'>" + symptoms[i] + "</a></p>";
	}
	return html;
}

$(function() {

	$.getJSON('/data.json', function(data) {
		if (params.symptoms) {
			var symptoms = params.symptoms.split(',');

			var causes = $.grep(data, function(element) {
				var intersection = $.arrayIntersect(element.symptoms, symptoms);
				return intersection.length > 0;
			});

			var causes_html = "";

			for (var i = 0; i < causes.length; i++) {
				causes_html += "<p><a href='?cause=" + causes[i].name + "'>" + causes[i].name + "</a> - " + causes[i].info + "</p>";
			}
			$('body').append(causes_html);
			

		} else if (params.cause) {
			var cause_name = params.cause;
			var cause = $.grep(data, function(element) {
				return element.name === cause_name;
			})[0];

			$('body').append("<h1>" + cause_name + "</h1>");
			if (!cause) {
				$('body').append("<div class='error'>" + error["no cause"] + "</div>");
			} else {
				var info = cause.info;
				var symptoms = cause.symptoms;

				$('body').append("<div class='info'>" + info + "</div>");
				$('body').append("<div class='symptoms'>" + printSymptoms(symptoms) + "</div>");
			}

		} else {
			var symptoms = $.map(data, function(val) {
				return val.symptoms;
			});

			symptoms = $.unique(symptoms);
			var symptoms_html = "";
			
			for (var i = 0; i < symptoms.length; i++) {
				symptoms_html += "<p><a href='?symptoms=" + symptoms[i] + "'>" + symptoms[i] + "</a></p>";
			}
			$('body').append(symptoms_html);
		}
	});
});
