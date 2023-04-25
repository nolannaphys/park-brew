// API key for National Parks Database
var apiKey='nsqq7nIIHbeaGT4DasDU3QLDbqazbcJTW8zA7SWb'
var searchValue=$('#searchInput')

// JS for Brewery API
$("#searchButton").on("click",function(event){
    var searchValue=$("#searchInput").val()
    console.log (searchValue)
    // geoCode(searchValue)
})
function brewery(searchValue){
    fetch('https://api.openbrewerydb.org/v1/breweries?by_city=${searchValue}&per_page=3')
}