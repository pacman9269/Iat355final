////set up global variables to store the data
var latestRates, weeklyRates, yearlyRates, currenciesName = [];
var yearlyLoaded, weeklyLoaded, latestLoaded = false;

//the array of currenies
var currencies = [
    "ARS",
    "AUD",
    "BRL",
    "CAD",
    "CNY",
    "EUR",
    "GBP",
    "HKD",
    "INR",
   
    "MXN",
    "RUB",
    "SAR",
    "TRY",
    "TWD",
    "USD",
    "ZAR"
];

//figure out the current day
var d = new Date();
var year = d.getFullYear();
var month = d.getMonth()+1;
var day = d.getDate();

//fetch currency names
function fetchCurrenyNames(){
    //use jQuery.ajax tp get the latest exchange rates, with JSONP:
    $.ajax({
        url: 'http://openexchangerates.org/api/currencies.json?app_id=f4247a9091844ea1ba84668b8d15ccd4',
        dataType: 'jsonp',
        success: function (json) {
                currenciesName = json;
                log(json);
        }
    });
}
//fetch latest data
function fetchLatest(currencies){
    //empty out the array
    latestRates = [];

    if(month < 10){ month = "0"+d.getMonth();}
    if(day < 10){ day = "0"+d.getDate();}
    var date = year+'-'+month+'-'+day;
    
    //use jQuery.ajax tp get the latest exchange rates, with JSONP:
    $.ajax({
        url: 'http://openexchangerates.org/api/latest.json?app_id=f4247a9091844ea1ba84668b8d15ccd4',
        dataType: 'jsonp',
        success: function (json) {
            //rates are in 'json.rates'
            //base currency (USD) is 'json.base'
            //UNIX timestamp when rates were collected is in 'json.timestamp'

            var dataset = json.rates;
            var base = json.base;
            
            //only extract those on the currencies list
            for(var i=0; i<currencies.length; i++){
                //create a new currency object
                var currency = {
                    "name": currencies[i],
                    "rate": dataset[currencies[i]],
                    "date": date
                }
                latestRates.push(currency);
            }
        }
    });
}

//fetch past 15 years data
function fetch15years(currency){
    //get the dates
    var days = [];
    //figure out the current day
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth()+1;
    var day = d.getDate();
    
    //generate dates for past week
    for(var i=0; i<15; i++){
        var newyear = year - i;
        if(month < 10){ month = "0"+d.getMonth();}
        if(day < 10){ day = "0"+d.getDate();}
        var date = newyear+'-'+month+'-'+day;
        days.push(date);
    }
    
    yearlyRates = [];
    //for every year, search for currency
    for(var i=0; i<days.length; i++){
        //use jQuery.ajax tp get the latest exchange rates, with JSONP:
        $.ajax({
            url: 'http://openexchangerates.org/api/historical/'+days[i]+'.json?app_id=f4247a9091844ea1ba84668b8d15ccd4',
            dataType: 'jsonp',
            success: function (json) {
                //rates are in 'json.rates'
                //base currency (USD) is 'json.base'
                //UNIX timestamp when rates were collected is in 'json.timestamp'

                var dataset = json.rates;
                var base = json.base;

                //only extract those on the currencies list
                for(var i=0; i<currencies.length; i++){
                    //create a new currency object
                    var currency = {
                        "name": currencies[i],
                        "rate": dataset[currencies[i]],
                        "date": days[i]
                    }
                    yearlyRates.push(currency);
                }
            }
        });
    }
}

//fetch last 7 days' data
function fetch7days(currencies){
    //get the dates
    var days = [];
    //figure out the current day
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth()+1;
    var day = d.getDate();
    
    //generate dates for past week
    for(var i=0; i<7; i++){
        var newday = day - i;
        if(month < 10){ month = "0"+d.getMonth();}
        if(newday < 10){ newday = "0"+newday;}
        var date = year+'-'+month+'-'+newday;
        days.push(date);
    }
    
    weeklyRates = [];
    
    //for every day, search for currency
    for(var i=0; i<days.length; i++){
        //use jQuery.ajax tp get the latest exchange rates, with JSONP:
        $.ajax({
            url: 'http://openexchangerates.org/api/historical/'+days[i]+'.json?app_id=f4247a9091844ea1ba84668b8d15ccd4',
            dataType: 'jsonp',
            success: function (json) {
                //rates are in 'json.rates'
                //base currency (USD) is 'json.base'
                //UNIX timestamp when rates were collected is in 'json.timestamp'

                var dataset = json.rates;
                
                //only extract those on the currencies list
                for(var i=0; i<currencies.length; i++){
                    //create a new currency object
                    var currency = {
                        "name": currencies[i],
                        "rate": dataset[currencies[i]],
                        "date": days[i]
                    }
                    weeklyRates.push(currency);
                }
            }
        });
    }
}

//function parseToArray(json){
//    var arr = [];
//    
//    for(var obj in json){
//        var currency = {
//            "name": obj,
//            "rate": json[obj]
//        };
//        arr.push(currency);
//    }
//    
//    return arr;
//}

//function as tools5
function log(s){
    console.log(s);
}

//fetch data at start
window.onload = function(){
    //methods to fetch data
    fetchCurrenyNames();
    fetch15years(currencies);
    fetch7days(currencies);
    fetchLatest(currencies);
}

$(document).ajaxComplete(function() {
    //check on the completeness of the data
    if(latestRates.length < currencies.length){
        $("#latest").text("loading latest rates: " + Math.round(latestRates.length / currencies.length * 100) + "%");
    }else{
        $("#latest").text("latest rates loaded");
        latestLoaded = true;
        //log(latestRates);
    }
    if(weeklyRates.length < (currencies.length*7)){
        $("#weekly").text("weekly rates - " + Math.round(weeklyRates.length / (currencies.length*7) * 100) + "%");
    }else{
        $("#weekly").text("weekly rates loaded");
        weeklyLoaded = true;
        //log(weeklyRates);
    }
    if(yearlyRates.length < (currencies.length*15)){
        $("#yearly").text("yearly rates - " + Math.round(yearlyRates.length / (currencies.length*15) * 100) + "%");
    }else{
        $("#yearly").text("yearly rates loaded");
        yearlyLoaded = true;
        //log(yearlyRates);
    }
    //check if all loaded
    if(yearlyLoaded && weeklyLoaded && latestLoaded){
        log("all loaded");
        $("#latest").text("LOADED!");
        $("#yearly").text("LOADED!");
        $("#weekly").text("LOADED!");
        $("#loader").fadeOut(2000);
        $("#content").fadeIn(2000);
        allCurreniesGraph(latestRates);
        parallel(yearlyRates);
    }
});