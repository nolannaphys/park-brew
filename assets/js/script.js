// parks variables
var apiKey = 'nsqq7nIIHbeaGT4DasDU3QLDbqazbcJTW8zA7SWb'
var parkResults = document.querySelector("#park-results")
//var parkResults = $('#park-results')
var brewResults = document.querySelector("#brewery-results")

// JS for Brewery API
$("#searchButton").on("click", function (event) {
    var cityValue = $("#cityInput").val();
    brewery(cityValue)

    var stateValue = $('#stateInput').val();
    park(stateValue, cityValue)
})


// fetch for parks API data 
function park(stateValue, cityValue) {
    fetch (`https://developer.nps.gov/api/v1/parks?stateCode=${stateValue}&limit=5&q=${cityValue}&api_key=nsqq7nIIHbeaGT4DasDU3QLDbqazbcJTW8zA7SWb`)
    .then (function (response) {
        return response.json();
    })
    .then (function (data) {
        console.log(data);
        console.log(data.data[0].fullName);
        console.log(data.data[0].addresses[0].line1)

        parkResults.textContent = data.data[0].fullName
        // parkResults.textContent = data.data[0].addresses[0].line1 + ' ' + data.data[0].addresses[0].city
        // parkResults.textContent = data.data[0].url
    })
}

// get values from brewery API once the city is entered and button is clicked
function brewery(cityValue) {
    fetch(`https://api.openbrewerydb.org/v1/breweries?by_city=${cityValue}&per_page=5`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)

            brewResults.textContent = data[0].name;
            brewResults.textContent = data[0].address_1 + ' ' + data[0].city
            brewResults.textContent = data[0].website_url
        })
}

// this will define the results container to connect with html

