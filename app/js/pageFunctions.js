$(document).ready(function(){
	//when the search form is submitted' the event wont be trigered
	//insted, the search function will run
	$("#searchForm").submit(function(e){
		e.preventDefault();
		search();
	});
	$('[data-toggle="tooltip"]').tooltip();
});
//clears all the data that was searched
function clearSearch(){
	$("#tableContent").html("Enter a new search");
	$("#GraphContent").html("Enter a new search");
}
//search fnuction is incharge of getting the stocks info from Yahoo
function search(){
	var searchInputData = [];
	searchInputData = setInputForSQLretrieval($("#searchInput").val());
	var yahooURL = createURL(searchInputData);
	var english = /^[A-Za-z0-9\,\ ]*$/;
	if(!english.test(searchInputData)){
		alert("This input accepts only English,spaces and commas");
	}
	else{
		$("#searchForm h5").css('display', 'inline-block');
		$.ajax({
			url: yahooURL,
			dataType: "json",
			success: function(ajaxResult){
				$("#searchForm h5").hide();
				var queryCount= ajaxResult.query.count;
				var stockResult = ajaxResult.query.results.quote;
				if(queryCount === 1){
					if(stockResult.Name == null){
						$("#tableContent").html("No stock was found in the given \
							symbol ("+stockResult.symbol+")");
						$("#GraphContent").html("No stock was found in the given \
							symbol ("+stockResult.symbol+")");
					}// if
					else{
						var table = tableHeaders();
						addTableRows(stockResult,table,queryCount);
						createChart(stockResult,queryCount);
					}//else
				}//if ajaxResult.query.count == 1
				else{
					if (checkNotallNull(stockResult,queryCount)) {
						var table = tableHeaders();
							addTableRows(stockResult,table,queryCount);
							createChart(stockResult,queryCount);
					}
					else{
						alert("shitshith");
					}
				}//else
			},//success
			error: function(e){
				$("#searchForm h5").hide();
				alert(e);
			}//error
		});
	}//else
}
function tableHeaders(){
	return "<table class='table table-striped'><tr><th>Symbol</th><th>Name</th><th>Previous close</th>\
	<th>Year low</th><th>Year high</th><th>Change from year low</th><th>Change from year high</th></tr>";
}
function addTableRows(stockData,tableStr,queryCount){
	if (queryCount === 1) {
		tableStr += "<tr><td>"+stockData.symbol+"</td><td>"+stockData.Name+"</td>\
		<td>"+stockData.PreviousClose+"$</td><td>"+stockData.YearLow+"$</td><td>\
		"+stockData.YearHigh+"$</td><td";
		if (stockData.ChangeFromYearLow > 0) {
			tableStr += " style='color:green'";
		}
		else if(stockData.ChangeFromYearLow < 0){
			tableStr += " style='color:red'";
		}
		tableStr += ">"+stockData.ChangeFromYearLow+"$</td><td";
		if (stockData.ChangeFromYearHigh > 0) {
			tableStr += " style='color:green'";
		}
		else if(stockData.ChangeFromYearHigh < 0){
			tableStr += " style='color:red'";
		}
		tableStr += ">"+stockData.ChangeFromYearHigh+"$</td></tr></table>";
	}//if
	else{
		var notfoundStr = "<br><div>No stock was found in the given symbol (";
		var notfoundArr = [];
		for (var i = 0; i < queryCount; i++) {
			if (stockData[i].Name == null) {
				notfoundArr.push(stockData[i].symbol);
			}//if
			else{
				tableStr += "<tr><td>"+stockData[i].symbol+"</td><td>"+stockData[i].Name+"</td>\
				<td>"+stockData[i].PreviousClose+"$</td><td>"+stockData[i].YearLow+"$</td><td>\
				"+stockData[i].YearHigh+"$</td><td";
				if (stockData[i].ChangeFromYearLow > 0) {
					tableStr += " style='color:green'";
				}//if
				else if(stockData.ChangeFromYearLow < 0){
					tableStr += " style='color:red'";
				}//elseif
				tableStr += ">"+stockData[i].ChangeFromYearLow+"$</td><td";
				if (stockData[i].ChangeFromYearHigh > 0) {
					tableStr += " style='color:green'";
				}//if
				else if(stockData[i].ChangeFromYearHigh < 0){
					tableStr += " style='color:red'";
				}//elseif
				tableStr += ">"+stockData[i].ChangeFromYearHigh+"$</td></tr>";
			}//else
		}//for
		tableStr += "</table>";
		if (notfoundArr.length > 0) {
			for (x in notfoundArr){
				notfoundStr += notfoundArr[x];
			}
			notfoundStr += ")</div>";
			tableStr += notfoundStr;
		}
	}//else
	$("#tableContent").html(tableStr);
}
function createChart(stockData,queryCount){
	var fromLowP;var fromHighP;var columnChart = {};
	columnChart.chart = {renderTo:'GraphContent',type:'column'};
	columnChart.title = {text:"Difference in Percentage of YearLow and YearHigh"};
	columnChart.xAxis = {categories: ['YearHighDiff', 'YearLowDiff']};
	columnChart.yAxis = {title:{text:"Percentage (%)"}};
	columnChart.series = [];
	if(queryCount === 1){
		if (stockData.YearLow == null){
			$("#GraphContent").html("No Values To display");
		}
		else{
			columnChart.series[0] = {};
			columnChart.series[0].name = stockData.Name;
			fromLowP = (stockData.ChangeFromYearLow)*100/stockData.YearLow;
			fromHighP = (stockData.ChangeFromYearHigh)*100/stockData.YearHigh;
			columnChart.series[0].data = [fromHighP,fromLowP];
		}
	}
	else
	{
		var chartCounter = 0;
			for (var i = 0;i < queryCount; i++) {
				if (stockData[i].YearLow != null){
					columnChart.series[chartCounter] = {};
					columnChart.series[chartCounter].name = stockData[i].Name;
					fromLowP = (stockData[i].ChangeFromYearLow)*100/stockData[i].YearLow;
					fromHighP = (stockData[i].ChangeFromYearHigh)*100/stockData[i].YearHigh;
					columnChart.series[chartCounter].data = [fromHighP,fromLowP];
					chartCounter++;
					if (columnChart.series.length == 6 ){
						break;
					}
				}//if
			}//for
	}//else
	return chart1 = new Highcharts.Chart(columnChart);
}
function checkNotallNull(stockData,queryCount){
	for (var i = 0; i < queryCount; i++) {
		if (stockData[i].Name != null) {
			return true;
		}
	}
	return false;
}
function setInputForSQLretrieval(inputVal){
	var temp = inputVal.replace(/\ /g,"");
	temp = temp.toUpperCase();
	return temp.split(",");
}
function createURL(stockArry){
	var yahooURL = "https://query.yahooapis.com/v1/public/yql?q=select%20symbol%2CName%2CPreviousClose\
	%2CYearLow%2CYearHigh%2CChangeFromYearLow%2CChangeFromYearHigh%20from%20yahoo.finance\
	.quotes%20where%20symbol%20in%20(%22";
	for (var i = 0; i < stockArry.length-1 ; i++) {
		yahooURL += stockArry[i] + "%22%2C%22";
	}
	yahooURL += stockArry.pop();
	yahooURL += "%22)%0A%09%09&format=json&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.\
	env&callback=";
	return yahooURL;
}
