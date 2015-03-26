
// Used by printError
var error_messages = {
	"no cause":  "Sorry, I don't have anything on that cause.",
	"no causes": "Sorry, no causes matched those symptoms."
}

// Utility method for getting url parameters
var params = function () {
	// This function is anonymous, is executed immediately and 
	// the return value is assigned to params!
	var query_string = {};
	var query = window.location.search.substring(1);

	// I don't want to bother with this URL decoding stuff
	query = query.replace(/%20/g, ' ');

	var vars = query.split("&");
	for (var i=0;i<vars.length;i++) {
		var pair = vars[i].split("=");

		// Chrome puts a / after the params if theres no page like index.html
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

// Utility method for intersecting arrays
$.arrayIntersect = function(a, b)
{
	return $.grep(a, function(i) {
		return $.inArray(i, b) > -1;
	});
};

// Turn a list of symptoms into links to symptoms
function printSymptoms(symptoms) {
	var html = "<ul>";
	for (var i = 0; i < symptoms.length; i++) {
		html += "<li><a href='?symptoms=" + symptoms[i] + "'>" + symptoms[i] + "</a></li>";
	}
	return html + "</ul>";
}

// Turn a list of causes into links to causes
function printCauses(causes) {
	var html = "<ul>";
	for (var i = 0; i < causes.length; i++) {
		html += "<li><a href='?cause=" + causes[i].name + "'>" + causes[i].name + "</a> - " + causes[i].info + "</li>";
	}
	return html + "</ul>";
}

// Returns an array of causes that have at least one of the specified symptoms
function getRelatedCauses(causes, symptoms) {
	var related_causes = []

	// Collect all the causes with at least one match
	for (var i = 0; i < causes.length; i++) {
		var intersection = $.arrayIntersect(causes[i].symptoms, symptoms);
		if (intersection.length > 0) {
			causes[i].matches = intersection.length;
			related_causes.push(causes[i]);
		}
	}

	// Sort the causes by how many matches they have, descending
	return related_causes.sort(function(a, b) {
		if (a.matches < b.matches) return 1;
		if (a.matches > b.matches) return -1;
		return 0;
	});
}

// Turn a cause object into HTML using its info and symptoms
function printCause(cause) {
	var info = cause.info;
	var symptoms = cause.symptoms;

	var html = "<div class='info'>" + info + "</div>";
	html += "<div class='symptoms'><p>Symptoms:</p>";
	html += printSymptoms(symptoms) + "</div>";

	return html;
}

// Given an error type, create HTML with the applicable message
function printError(error) {
	return "<div class='error'>" + error_messages["no cause"] + "</div>";
}

// Extract a cause from date given a cause name
function getCause(cause_name, data) {
	return $.grep(data, function(element) {
		return element.name === cause_name;
	})[0];
}

$(function() {
	$.getJSON('data.json', function(data) {

		// List of causes given symptoms
		if (params.symptoms) {
			var symptoms = params.symptoms.split(',');
			var causes = getRelatedCauses(data, symptoms);

			if (causes.length > 0) {
				$('body').append("<h1>Matching Causes</h1>" + printCauses(causes));
			} else {
				$('body').append(printError("no causes"));
			}

		// Cause page
		} else if (params.cause) {
			var cause_name = params.cause;
			var cause = getCause(cause_name, data);

			$('body').append("<h1>" + cause_name + "</h1>");

			if (cause) {
				$('body').append(printCause(cause));
			} else {
				$('body').append(printError("no cause"));
			}

		// Main page
		} else {
			var symptoms = $.map(data, function(val) {
				return val.symptoms;
			});

			symptoms = $.unique(symptoms);
			$('body').append("<h1>All Symptoms</h1>" + printSymptoms(symptoms));
		}
	});
});
