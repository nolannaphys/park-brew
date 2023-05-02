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
$('.modal-close').on('click', function() {
    $('.modal').removeClass('is-active')
});

//clear out input fields on click 
$('#cityInput').on('click', function() {
    $('#cityInput').val('');
});

$('#stateInput').on('click', function() {
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

            // var i = 0; i < data.data.length; i++
            for (var i = 0; i < 5; i++) {
                var random = Math.floor(Math.random(data.data)*data.data.length); //its repeating values from the array
                console.log(random);
                var prliEl = $('<li>');
                var praEl = $('<a>');
                var prbtnEl = $('<button>');
                var priEl = $('<i>');
                praEl.text(data.data[random].fullName);
                praEl.attr('href', data.data[random].url);
                praEl.attr('target', '_blank'); 
                prbtnEl.text('Save');
                prbtnEl.addClass('park-save')
                priEl.addClass('fas', 'fa-save'); //save icon not showing up??????
                prUl.append(prliEl);
                prliEl.append(praEl);
                prliEl.append(prbtnEl);
                prbtnEl.append(priEl);

                //display try the closest metropolitan city??????? 
                if (!data.data) {
                    // $('#empty-data-modal').addClass('is-active'); //is modal better option?????
                    var prpEl = $('<p>');
                    prpEl.text('Please try to broaden your search to the closest metropolitan area.');
                    $('#park-results').append(prpEl);
                }

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
            // console.log(data)

            //brewResults.textContent = data[0].name;
            //brewResults.textContent = data[0].address_1 + ' ' + data[0].city
            //brewResults.textContent = data[0].website_url

            var brUl = $('#brewery-results ul')

            for (var i = 0; i < data.length; i++) {
                // console.log(data[i]);
                var brliEl = $('<li>');
                var braEl = $('<a>');
                var brbtnEl = $('<button>');
                var briEl = $('<i>');
                braEl.text(data[i].name);
                braEl.attr('href', data[i].website_url);
                braEl.attr('target', '_blank');
                brbtnEl.text('Save');
                brbtnEl.addClass('brewery-save', 'fas', 'fa-save');
                brUl.append(brliEl);
                brliEl.append(braEl)
                brliEl.append(brbtnEl);
                braEl.append(briEl);


                //add model for empty data set !!!!


                 //click event for brewery save buttons
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
        })
}

//get brewery information out of localstorage
function getBreweries() {
    var storedBreweries = JSON.parse(localStorage.getItem('local-breweryArray'));
    if (storedBreweries !== null) {
        breweryArray = storedBreweries;
    } else{
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
