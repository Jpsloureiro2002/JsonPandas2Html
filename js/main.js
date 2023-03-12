var path = "";
var code = "";

function bodyload() {
	code="";
	$('#code').val(code);
	var fileNames = [];
	$.ajax({
		url: 'json/',
		success: function(data) {
			$(data).find('a').attr('href', function (i, fileName) {
				if(fileName.endsWith('.json')) {
					fileNames.push(fileName.split('/').pop());
				}
			});
			var select = $('#table_content');
			$.each(fileNames, function(i, fileName) {
				select.append($('<option></option>').val(fileName).html(fileName));
			});
		}
	});
}

function change(){
	var selectedValue = $('#table_content').val();
	path = "json/"+selectedValue;
	jQuery.get(path, function(data) {
		var jsonString = data;
		console.log(jsonString);
		$('#code').val(jsonString);
	  }, "text");
	$.getJSON(path, function(data) {
		// Fill the options of the select with the tables available in the JSON file
		$('#tables').empty();
		$.each(data, function(tableName, tableData) {
			
			$('#tables').append($('<option>', { value: tableName, text: tableName }));
		});

		// When the button is clicked, create the table based on the selected tables
		$('#submit').click(function() {
			// Get the selected tables
			var selectedTables = $('#tables').val();

			// Create the table based on the selected tables
			var tableHTML = createTable(data, selectedTables);

			// Insert the table in the page
			$('#table-container').html(tableHTML);
		});
	});
}

$(document).ready(function() {
	$.getJSON(path, function(data) {
		// Fill the options of the select with the tables available in the JSON file
		$.each(data, function(tableName, tableData) {
			$('#tables').append($('<option>', { value: tableName, text: tableName }));
		});

		// When the button is clicked, create the table based on the selected tables
		$('#submit').click(function() {
			// Get the selected tables
			var selectedTables = $('#tables').val();

			// Create the table based on the selected tables
			var tableHTML = createTable(data, selectedTables);

			// Insert the table in the page
			$('#table-container').html(tableHTML);
		});
	});
});


function createTable(data, selectedTables) {
	var tableHTML = '';

	$.each(data, function(tableName, tableData) {
		// Check if the table is selected
		if ($.inArray(tableName, selectedTables) !== -1) {
			// Create the table
			tableHTML += '<label class="text-muted"> Table: ' + tableName + '</label><hr><table class="table table-striped table-hover table-responsive">';
			tableHTML += '<tr>';

			// Create the header based on the fields of the table
			$.each(tableData, function(fieldName, fieldData) {
				tableHTML += '<th>' + fieldName + '</th>';
			});

			tableHTML += '</tr>';

			// Fill the data of the table
			if ($.isArray(tableData[Object.keys(tableData)[0]])) {
				for (var i = 0; i < tableData[Object.keys(tableData)[0]].length; i++) {
					tableHTML += '<tr>';

					$.each(tableData, function(fieldName, fieldData) {
						tableHTML += '<td>' + fieldData[i] + '</td>';
					});

					tableHTML += '</tr>';
				}
			}

			tableHTML += '</table>';
		}
	});

	return tableHTML;
}
