/**
@fileoverview The js functions for the stocks viewer
 */

/**
 * @type {Highcharts.Chart} The chart we renders the data to
 */
var chart;

/**
 * Hiding the alert message
 * @function
 */
function hideMsg() {
	$("#msgContainer").hide();
}

/**
 * Clears all the data that was searched
 * 
 */
function clearSearch(){
	hideMsg();
	$("#searchMsg").html("");
	$("#tableContent").html("Enter a new search");
	$("#GraphContent").html("Enter a new search");
}

/**
 * Shows and alert message for the user if a message is provided
 * @param  {string} message - the message to display to the user
 * @function
 */
function showErrorMessage(message) {
	if (message) {
		$("#msgDisplayer").html(message);
		$("#msgContainer").css('display', 'inline-block');
	}
}

/**
 * Upper case and splitt non empty words
 * @param {string} inputVal - the inputVal
 * @return the array of words
 */
function setInputForSQLretrieval(inputVal){
	var temp = inputVal.replace(/\ /g, "");
	temp = temp.toUpperCase();
	return temp.split(",");
}

/**
 * Creates the URL to Yahoo's API from the user's input
 * @param  {Array} stockArry - the stocks to look for
 * @return {String} yahooURL - the URL to the Yahoo's API
 * @function
 */
function createURL(stockArry){
	var yahooURL = "https://query.yahooapis.com/v1/public/yql?q=select%20symbol%2CName%2CPreviousClose\
	%2CYearLow%2CYearHigh%2CChangeFromYearLow%2CChangeFromYearHigh%20from%20yahoo.finance\
	.quotes%20where%20symbol%20in%20(%22";

	for (var stockIndex = 0; stockIndex < stockArry.length - 1 ; stockIndex++) {
		yahooURL += stockArry[stockIndex] + "%22%2C%22";
	}

	yahooURL += stockArry.pop();
	yahooURL += "%22)%0A%09%09&format=json&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.\
	env&callback=";
	return yahooURL;
}

/**
 * Returns the table's headers
 * @function
 */
function createTableHeaders(){
	return "<table id='stockTable' class='table table-striped'><tr><th>Symbol</th><th>Name</th><th>Previous close</th>\
	<th>Year low</th><th>Year high</th><th>Change from year low</th><th>Change from year high</th></tr>";
}

/**
 * Creates a chart out of the given stocks
 * @param  {Array} stockData - the array of stocks
 * @return {Highcharts.Chart} - the new chart to display
 * @function
 */
function createChart(stockData, appendStocks){
	var MAX_ALLOWED_STOCKS = 6;
	var fromLowP;
	var fromHighP;
	var columnChart;

	// Only set the columnChart if we are creating a new chart
	if (!appendStocks || (appendStocks && !chart)) {
		columnChart = {};
		columnChart.chart = {
			renderTo:'GraphContent',
			type:'column'
		};
		columnChart.title = {
			text: "Difference in Percentage of YearLow and YearHigh"
		};
		columnChart.xAxis = {
			categories: [
				'YearHighDiff',
				'YearLowDiff'
			]
		};
		columnChart.yAxis = {
			title: {
				text: "Percentage (%)"
			}
		};
	}

	var series = [];
	var chartCurrentLength;
	var chartCounter = 0;

	// If we're creating a new chart than the current length of stocks in it is zero
	if (!appendStocks || !chart || !chart.series) {
		chartCurrentLength = 0;
	} else {
		chartCurrentLength = chart.series.length;
	}

	// Perform any action only if the current amount of series doesn't pass the allowed max
	if (chartCurrentLength < MAX_ALLOWED_STOCKS) {
		// Goes over all the stocks to create data for the graph
		for (var stockIndex = 0; stockIndex < stockData.length; stockIndex++) {
			var currentStock = stockData[stockIndex];

			// In some cases (like APPELL PETE CORP for example) we do not have all the data to show in the graph
			if (currentStock.YearLow != null){
				series[chartCounter] = {};
				series[chartCounter].name = currentStock.Name;
				fromLowP = (currentStock.ChangeFromYearLow) * 100 / currentStock.YearLow;
				fromHighP = (currentStock.ChangeFromYearHigh) * 100 / currentStock.YearHigh;
				series[chartCounter].data = [fromHighP, fromLowP];
				chartCounter++;

				// We only allowed some ammout of stocks to be shown in the graph
				if (chartCurrentLength + series.length === MAX_ALLOWED_STOCKS){
					break;
				}
			}
		}

		if (appendStocks && chart) {
			$.each(series, function (itemNo, item) {
        chart.addSeries(item, false);
  		});
      chart.redraw();
		} else if (series.length > 0){
			columnChart.series = series;
			chart = new Highcharts.Chart(columnChart);
		}
		  else{
		  	$("#GraphContent").html("No Data to display");
		  }
	}
}

/**
 * Creates the table's data and not found stocks data
 * @param  {Array} stockData - the array of stocks
 * @return {Object} object.notfoundStr - the string for the not found stocks section
 * @return {Object} object.tableStr - the string of the table data
 * @function
 */
function createTableData(stockData) {
	var tableStr = "";
	var notfoundStr = "<br><div>No stock was found in the given symbol (";
	var notfoundArr = [];

	// Goes over all the stocks and adds them into the table
	for (var stockIndex = 0; stockIndex < stockData.length; stockIndex++) {
		var currentStock = stockData[stockIndex];

		// Checks if a given stock name wasn't found in order to display it to the user
		if (!currentStock.Name) {
			notfoundArr.push(currentStock.symbol);
		} else {
			var NO_DATA_TEXT = "No Data";
			var previousCloseText = currentStock.PreviousClose ? currentStock.PreviousClose + "$" : NO_DATA_TEXT;
			var yearLowText = currentStock.YearLow ? currentStock.YearLow + "$" : NO_DATA_TEXT;
			var yearHighText = currentStock.YearHigh ? currentStock.YearHigh + "$" : NO_DATA_TEXT;
			var changeFromYearLowText = currentStock.ChangeFromYearLow ? currentStock.ChangeFromYearLow + "$" : NO_DATA_TEXT;
			var changeFromYearHighText = currentStock.ChangeFromYearHigh ? currentStock.ChangeFromYearHigh + "$" : NO_DATA_TEXT;

			tableStr += "<tr><td>" + currentStock.symbol + "</td><td>" + currentStock.Name + "</td>\
			<td>" + previousCloseText + "</td><td>" + yearLowText + "</td><td>\
			" + yearHighText + "</td><td";

			if (currentStock.ChangeFromYearLow > 0) {
				tableStr += " style='color:green'";
			} else if (stockData.ChangeFromYearLow < 0) {
				tableStr += " style='color:red'";
			}

			tableStr += ">" + changeFromYearLowText + "</td><td";
			if (currentStock.ChangeFromYearHigh > 0) {
				tableStr += " style='color:green'";
			} else if (currentStock.ChangeFromYearHigh < 0) {
				tableStr += " style='color:red'";
			}

			tableStr += ">" + changeFromYearHighText + "</td></tr>";
		}
	}

	// Checks if we didn't find some stocks, and adds it to the div containing that information to the user
	if (notfoundArr.length > 0) {
		for (var notFoundIndex = 0; notFoundIndex < notfoundArr.length - 1 ; notFoundIndex++){
			notfoundStr += notfoundArr[notFoundIndex] + ", ";
		}

		notfoundStr += notfoundArr[notfoundArr.length - 1] + ")</div>";
	} else {
		notfoundStr = "";
	}

	return {
		notfoundStr: notfoundStr,
		tableStr: tableStr
	};
}

/**
 * Add the given rows to the table
 * @param {Array} stockData - the array of Yahoo's stocks objects
 * @param {[type]} tableStr - the table html string to add the data to
 * @function
 */
function addTableRows(stockData, tableStr){
	var data = createTableData(stockData);

	tableStr += data.tableStr;
	tableStr += "</table>";
	tableStr += data.notfoundStr;

	$("#tableContent").html(tableStr);
}

/**
 * Appends the new stocks to the table instead of replacing it
 * @param  {Array} stockData - the fetched stocks
 * @function
 */
function appendRows(stockData){
	var tableStr = "";
	var data = createTableData(stockData);

	tableStr += data.tableStr;

	$("#stockTable").append(tableStr);
	$("#searchMsg").html(data.notfoundStr);	
}

/**
 * Incharge of getting the stocks info from Yahoo
 * @param  {boolean} addRows - if we should append the results to the table or replace all its content
 * @function
 */
function search(addRows){
	hideMsg();
	var userInput = $("#searchInput").val();

	// If there is no text - do not search. We do it even that we've set the search button to disabled when
	// there is no text - in order to be 100% bullet proff for future changes in the HTML
	if (userInput) {
		var searchInputData = [];
		searchInputData = setInputForSQLretrieval(userInput);
		var yahooURL = createURL(searchInputData);
		var english = /^[A-Za-z0-9\,\ ]*$/;

		// Checks if the text is not in English
		if(!english.test(searchInputData)){
			showErrorMessage("This input accepts only English, spaces and commas");
		} else{
			$("#searchDiv h5").css('display', 'inline-block');
			$.ajax({
				url: yahooURL,
				dataType: "json",
				success: function(ajaxResult){
					$("#searchDiv h5").hide();
					$("#searchInput").val("");
					var stockResult;

					if (ajaxResult.query.results) {
						stockResult = ajaxResult.query.results.quote;
					}

					// In case there aren't any results - stop the operation
					if (!stockResult) {
						showErrorMessage("No results were found. Might be an error with the servers..");
						return;
					}

					// The Yahoo API when returning 1 result, returns it as an object and not Array,
					// in order to write a more generic code we take that object and turns it into an
					// array with itself as the first object
					if (!(stockResult instanceof Array)) {
						stockResult = [stockResult];
					}

					if (!addRows) {
						var table = createTableHeaders();
						addTableRows(stockResult, table);
					}
					else{
						appendRows(stockResult);
					}

					createChart(stockResult, addRows);
				},
				error: function(request, status, error){
					$("#searchDiv h5").hide();
					var defaultError = "<strong>Error -</strong>Some thing went wrong..";
					var message;
					if (error) {
						message = error.message || defaultError;
					} else {
						message = defaultError;
					}

					showErrorMessage(message);
				}
			});
		}
	}
}

/**
 * The function adds a new stock to the list of existing stocks instead of clearing everything
 * lie the search option does
 * @function
 */
function addToTable(){
	hideMsg();

	// Checks if a table already exists or not
	if (document.getElementById("stockTable")){
		var existingStocks = {};
		var tempStr = "";
		var tableRows = document.getElementById("stockTable").rows;

		// Creating a hash of all the existing stocks to search for copies in the user's search
		// so we won't search twce the same stock
		for (var existingStockIndex = 1; existingStockIndex < tableRows.length; existingStockIndex++) {
			existingStocks[tableRows[existingStockIndex].cells[0].innerText] = true;
		}

		var searchInputData = setInputForSQLretrieval($("#searchInput").val());
		for (var searchStocks = 0; searchStocks < searchInputData.length; searchStocks++) {
			if (!existingStocks[searchInputData[searchStocks]]) {
				tempStr += searchInputData[searchStocks] + ",";
			}
		}

		// Sets the input search box with the stoks to look for
		// (We look also for the existing stocks in order to refresh them)
		$("#searchInput").val(tempStr.slice(0, tempStr.length - 1));
		search(true);
	} else {
		search(false);
	}
}
