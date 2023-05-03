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
    parkResults.attr('style', 'display:block');
    brewResults.attr('style', 'display:block');
    var cityValue = $('#cityInput').val();
    var stateValue = $('#stateInput').val();
    park(stateValue, cityValue);
    brewery(cityValue);
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
function park(stateValue, cityValue) {
    fetch(`https://developer.nps.gov/api/v1/parks?stateCode=${stateValue}&q=${cityValue}&api_key=nsqq7nIIHbeaGT4DasDU3QLDbqazbcJTW8zA7SWb`)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var prUl = $('#park-results ul');
            if (data.data.length === 0) {
                var prliEl = $('<li>');
                prliEl.text('No results found');
                prUl.append(prliEl);
            } else {
                var listParks = [...data.data];
                var outParks = [];
                for (var i = 0; i < 5 && listParks.length > 0; i++) {
                    var randomParks = Math.floor(Math.random(listParks) * listParks.length);
                    outParks.push(listParks[randomParks]);
                    listParks.splice(randomParks, 1); // 2nd parameter means remove one item only
                }
                for (var i = 0; i < outParks.length; i++) {
                    var prliEl = $('<li>');
                    var praEl = $('<a>');
                    var prbtnEl = $('<button>');
                    var priEl = $('<i>');
                    praEl.text(outParks[i].fullName);
                    praEl.attr('href', outParks[i].url);
                    praEl.attr('target', '_blank');
                    prbtnEl.addClass('park-save')
                    priEl.addClass('fas fa-save');
                    prUl.append(prliEl);
                    prliEl.append(praEl);
                    prliEl.append(prbtnEl);
                    prbtnEl.append(priEl);

                    //change link color
                    praEl.on('click', visited);

                    //click event for park save buttons
                    prbtnEl.on('click', function (event) {
                        event.preventDefault;
                        var parks = {
                            name: $(this).prev('a').text(), 
                            url: $(this).prev('a').attr('href')
                        };
                        parkArray.push(parks);
                        localStorage.setItem('local-parkArray', JSON.stringify(parkArray));
                        renderParks();
                    })
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
    parkFavs.attr('style', 'display:block');
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
        //change link color
        pfaEl.on('click', visited);
    }

}

// get values from brewery API once the city is entered and button is clicked
function brewery(cityValue) {
    fetch(`https://api.openbrewerydb.org/v1/breweries?by_city=${cityValue}`)
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
                    var brliEl = $('<li>');
                    var braEl = $('<a>');
                    var brbtnEl = $('<button>');
                    var briEl = $('<i>');
                    braEl.text(outBreweries[i].name);
                    braEl.attr('href', outBreweries[i].website_url);
                    braEl.attr('target', '_blank');
                    brbtnEl.addClass('brewery-save');
                    briEl.addClass('fas fa-save');
                    brUl.append(brliEl);
                    brliEl.append(braEl);
                    brliEl.append(brbtnEl);
                    brbtnEl.append(briEl);

                    //click event to change link color
                    braEl.on('click', visited);

                    //save button event
                    brbtnEl.on('click', function (event) {
                        event.preventDefault;
                        var breweries = {
                            name: $(this).prev('a').text(), 
                            url: $(this).prev('a').attr('href')
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
    brewFavs.attr('style', 'display:block');
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
        //click event to change link color
        bfaEl.on('click', visited);
    }
}

//change text color of link when clicked
function visited() {
    $(this).addClass('visited');
}