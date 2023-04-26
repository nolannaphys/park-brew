// API key for National Parks Database
var apiKey = 'nsqq7nIIHbeaGT4DasDU3QLDbqazbcJTW8zA7SWb'
var cityValue = $('#cityInput')

// this will define the results container to connect with html
var resultsContainer = document.querySelector("#brewery-results")
// JS for Brewery API
$("#citySearchButton").on("click", function (event) {
    var cityValue = $("#cityInput").val()
    resultsContainer.textContent = cityValue
    brewery(cityValue)
})
// get values from brewery API once the city is entered and button is clicked
function brewery(cityValue) {
    fetch(`https://api.openbrewerydb.org/v1/breweries?by_city=${cityValue}&per_page=3`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)

        })
}

