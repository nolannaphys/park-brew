// parks variables
var parkResults = $("#park-results");
var brewResults = $("#brewery-results");
var parkFavs = $('#park-favorites');
var brewFavs = $('#brewery-favorites');
var parkArray = [];
var breweryArray = [];

// click event for search button 
$("#searchButton").on("click", function (event) {
    event.preventDefault();
    //open modal
    if ($('#cityInput').val() === '' || $('#stateInput').val() === '') {
        $('#input-modal').addClass('is-active');
        return;
    }

    $('#park-results ul').html('');
    $('#brewery-results ul').html('');

    //fetch data
    parkResults.attr('style', 'visibility:visible');
    brewResults.attr('style', 'visibility:visible');
    var cityValue = $('#cityInput').val();
    var stateValue = $('#stateInput').val();
    park(stateValue, cityValue);
    brewery(cityValue);

    // How to clear search results after second click???
    // parkResults.innerHTML = '';
    // brewResults.innerHTML = '';
})

//close alert modal for empty city or state
$('.modal-close').on('click', function () {
    $('.modal').removeClass('is-active')
});

//clear out input fields on click 
$('#cityInput').on('click', function () {
    $('#cityInput').val('');
});

$('#stateInput').on('click', function () {
    $('#stateInput').val('');
});

// fetch for parks API data to append to webpage
// `https://developer.nps.gov/api/v1/parks?stateCode=${stateValue}&limit=5&q=${cityValue}&api_key=nsqq7nIIHbeaGT4DasDU3QLDbqazbcJTW8zA7SWb`
function park(stateValue, cityValue) {
    fetch(`https://developer.nps.gov/api/v1/parks?stateCode=${stateValue}&q=${cityValue}&api_key=nsqq7nIIHbeaGT4DasDU3QLDbqazbcJTW8zA7SWb`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // console.log(data.data[0].fullName);
            // console.log(data.data[0].addresses[0].line1)

            var prUl = $('#park-results ul');

            //display try the closest metropolitan city??????? 
            if (data.data.length === 0) {
                var prliEl = $('<li>');
                prliEl.text('No results found');
                prUl.append(prliEl);
            } else {
                var listParks = [...data.data];
                var outParks = [];
                for (var i = 0; i < 5 && listParks.length > 0; i++) {
                    var random = Math.floor(Math.random(listParks) * listParks.length);
                    outParks.push(listParks[random])
                    listParks.splice(random, 1); // 2nd parameter means remove one item only
                }
                for (var i = 0; i < outParks.length; i++) {
                    var prliEl = $('<li>');
                    var praEl = $('<a>');
                    var prbtnEl = $('<button>');
                    var priEl = $('<i>');
                    praEl.text(outParks[i].fullName);
                    praEl.attr('href', outParks[i].url);
                    praEl.attr('target', '_blank');
                    // prbtnEl.text('Save');
                    prbtnEl.addClass('park-save')
                    priEl.addClass('fas fa-save'); //save icon not showing up??????
                    prUl.append(prliEl);
                    prliEl.append(praEl);
                    prliEl.append(prbtnEl);
                    prbtnEl.append(priEl);

                    //click event for park save buttons
                    prbtnEl.on('click', function (event) {
                        event.preventDefault;
                        var parks = {
                            name: this.previousElementSibling.textContent,
                            url: this.previousElementSibling.href
                        };
                        parkArray.push(parks);
                        localStorage.setItem('local-parkArray', JSON.stringify(parkArray));
                        renderParks();
                    })
                    //pop or shift the random index out of the data.data array 
                }
            }






        })
}

//get park information out of local storage 
function getParks() {
    var storedParks = JSON.parse(localStorage.getItem('local-parkArray'));
    if (storedParks !== null) {
        parkArray = storedParks;
    } else {
        return;
    }
    renderParks();
}
getParks();

//render saved parks into #park-favorites section of webpage 
function renderParks() {
    var pfUl = $('#park-favorites ul');
    pfUl.html('');
    for (var i = 0; i < parkArray.length; i++) {
        var park = parkArray[i];
        var pfliEl = $('<li>');
        var pfaEl = $('<a>');
        pfaEl.text(park.name);
        pfaEl.attr('href', park.url);
        pfaEl.attr('target', '_blank');
        pfUl.append(pfliEl);
        pfliEl.append(pfaEl);
    }

}

// get values from brewery API once the city is entered and button is clicked
function brewery(cityValue) {
    fetch(`https://api.openbrewerydb.org/v1/breweries?by_city=${cityValue}&per_page=5`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            var brUl = $('#brewery-results ul')

            if (data.length === 0) {
                var brliEl = $('<li>');
                brliEl.text('No results found');
                brUl.append(brliEl);
            } else {
                var listBreweries = [...data];
                var outBreweries = [];
                for (var i = 0; i < 5 && listBreweries.length > 0; i++) {
                    var randomBreweries = Math.floor(Math.random(listBreweries) * listBreweries.length);
                    outBreweries.push(listBreweries[randomBreweries]);
                    listBreweries.splice(randomBreweries, 1);
                }
                for (var i = 0; i < outBreweries.length; i++) {
                    // console.log(data[i]);
                    var brliEl = $('<li>');
                    var braEl = $('<a>');
                    var brbtnEl = $('<button>');
                    var briEl = $('<i>');
                    braEl.text(outBreweries[i].name);
                    braEl.attr('href', outBreweries[i].website_url);
                    braEl.attr('target', '_blank');
                    // brbtnEl.text('');
                    brbtnEl.addClass('brewery-save');
                    briEl.addClass('fas fa-save');
                    brUl.append(brliEl);
                    brliEl.append(braEl);
                    brliEl.append(brbtnEl);
                    brbtnEl.append(briEl);

                    brbtnEl.on('click', function (event) {
                        event.preventDefault;
                        var breweries = {
                            name: this.previousElementSibling.textContent,
                            url: this.previousElementSibling.href
                        };
                        breweryArray.push(breweries);
                        localStorage.setItem('local-breweryArray', JSON.stringify(breweryArray));
                        renderBreweries();
                    })
                }
            }
        })
}

//get brewery information out of localstorage
function getBreweries() {
    var storedBreweries = JSON.parse(localStorage.getItem('local-breweryArray'));
    if (storedBreweries !== null) {
        breweryArray = storedBreweries;
    } else {
        return;
    }
    renderBreweries();
}
getBreweries();

// render saved breweries into #brewery-favorites section of webpage
function renderBreweries() {
    var bfUl = $('#brewery-favorites ul');
    bfUl.html('');
    for (var i = 0; i < breweryArray.length; i++) {
        var brewery = breweryArray[i];
        var bfliEl = $('<li>');
        var bfaEl = $('<a>');
        bfaEl.text(brewery.name);
        bfaEl.attr('href', brewery.url);
        bfaEl.attr('target', '_blank');
        bfUl.append(bfliEl);
        bfliEl.append(bfaEl);
    }
}
