const BASE_URL = "https://sv443.net/jokeapi/v2/joke"

function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
var selectedCategory = "Any"

var christmasBtnElem = document.getElementById("btn-christmas")
var spookyBtnElem = document.getElementById("btn-spooky")
var punBtnElem = document.getElementById("btn-pun")
var darkBtnElem = document.getElementById("btn-dark")
var programmingBtnElem = document.getElementById("btn-programming")
var miscellaneousBtnElem = document.getElementById("btn-miscellaneous")
var anyBtnElem = document.getElementById("btn-any")

var buttonElems = [christmasBtnElem,
                    spookyBtnElem,
                    punBtnElem,
                    darkBtnElem,
                    programmingBtnElem,
                    miscellaneousBtnElem,
                    anyBtnElem
                ]

function removeActiveFromButons(){
    buttonElems.forEach(elem => {
        elem.classList.remove('active')
    });
}

//choose category and update buttons state
function updateCategory(category){
    selectedCategory = category
    removeActiveFromButons()
    if(category == "Christmas"){
        christmasBtnElem.classList.add('active')
    }
    else if(category == "Spooky"){
        spookyBtnElem.classList.add('active')
    }
    else if(category == "Pun"){
        punBtnElem.classList.add('active')
    }
    else if(category == "Dark"){
        darkBtnElem.classList.add('active')
    }
    else if(category == "Programming"){
        programmingBtnElem.classList.add('active')
    }
    else if(category == "Miscellaneous"){
        miscellaneousBtnElem.classList.add('active')
    }
    else {
        anyBtnElem.classList.add('active')
    }
}



function getURLForCategory(category){
    url = `${BASE_URL}/${category}?amount=10`;
    return url;
}


function createCategoryElement(category){
    var div = document.createElement("div");
    div.className = "joke-category"
    div.innerText = category
    return div
}

function createTypeElement(type){
    var div = document.createElement("div");
    div.className = "joke-type"
    div.innerText = type
    return div
}

function createFlagsElement(flags){
    var ul = document.createElement("ul");
    ul.className = "jokes-flags"
    for(var key in flags){
        if(flags[key]){
            var li = document.createElement("li")
            li.innerText = key
            ul.appendChild(li)
        }
    }
    return ul
}

function createJokeTextElement(text){
    var div = document.createElement("div");
    div.className = "joke-text"
    div.innerText = text
    return div
}

function createJokeTwoPartElement(setup, delivery){
    var div = document.createElement("div");
    div.classList.add("joke-text")
    div.classList.add("tooltip")
    div.innerText = setup

    var span = document.createElement("span");
    span.innerText = delivery
    span.className = "tooltiptext"
    div.appendChild(span)
    return div
}


function createButtonReportElement(i){
    var button = document.createElement("button");
    button.className = "btn-joke-report"
    button.innerText = "Report"
    button.addEventListener('click', function(i) {
        handleReportJoke(i)
    }.bind(null, i));
    
    return button
}

function handleReportJoke(i){
    var nodes = document.getElementsByClassName('joke-container');
    $(nodes[i].childNodes[5]).show(500)
}

function handleConfirmReport(i){
    var nodes = document.getElementsByClassName('joke-container');
    nodes[i].classList.add("reported")
    $(nodes[i].childNodes[4]).hide(1000)
    $(nodes[i].childNodes[5]).hide(1000)
}

function handleCancelReport(i){
    var nodes = document.getElementsByClassName('joke-container');
    $(nodes[i].childNodes[5]).hide(1000)
}


function createDialogButtonsElement(i){
    var div = document.createElement("div");
    div.className = "dialog-report"
    div.innerText = "Are you sure you want to report this joke?"
    var confElem = document.createElement("button");
    var cancelElem = document.createElement("button");
    confElem.innerText = "Confirm"
    cancelElem.innerText = "Cancel"
    confElem.classList.add("btn-joke-report");confElem.classList.add("btn-dialog")
    cancelElem.classList.add("btn-joke-report");cancelElem.classList.add("btn-dialog")
    confElem.addEventListener('click', function(i) {
        handleConfirmReport(i)
    }.bind(null, i));
    cancelElem.addEventListener('click', function(i) {
        handleCancelReport(i)
    }.bind(null, i));

    div.appendChild(confElem)
    div.appendChild(cancelElem)

    return div
    
}

function createJokeContainerElem(joke, i){
    var jokeContainerDiv = document.createElement("div");
    jokeContainerDiv.className = "joke-container"

    var category = joke.category
    var categoryDivElem = createCategoryElement(category)
    jokeContainerDiv.appendChild(categoryDivElem)

    var type = joke.type
    var typeDivElem = createTypeElement(type)
    jokeContainerDiv.appendChild(typeDivElem)

    if(type == "single"){
        var text = joke.joke
        var jokeTextDivElem = createJokeTextElement(text)
        jokeContainerDiv.appendChild(jokeTextDivElem)
    }
    else{
        var setup = joke.setup
        var delivery = joke.delivery
        var jokeTwoPartElement = createJokeTwoPartElement(setup, delivery)
        jokeContainerDiv.appendChild(jokeTwoPartElement)
    }
    var flags = joke.flags
    var flagsElem = createFlagsElement(flags)
    jokeContainerDiv.appendChild(flagsElem)

    var buttonElem = createButtonReportElement(i)
    jokeContainerDiv.appendChild(buttonElem)
    
    var dialogButtonsElem = createDialogButtonsElement(i)
    jokeContainerDiv.appendChild(dialogButtonsElem)
    return jokeContainerDiv

}


function populatePageWithJokes(jokes){
    firstHalf = jokes.splice(0,(jokes.length+1)/2)
    secondtHalf = jokes.splice(0,jokes.length)
    var index = 0
    firstHalf.forEach(joke => {
        var column1Elem = document.getElementById("column1");
        var jokeContainerElem = createJokeContainerElem(joke, index)
        index += 1;
        column1Elem.appendChild(jokeContainerElem)
    });
    secondtHalf.forEach(joke => {
        var column2Elem = document.getElementById("column2");
        var jokeContainerElem = createJokeContainerElem(joke, index)
        index += 1
        column2Elem.appendChild(jokeContainerElem)
    });
}   

function getJokesForCategory(){

    $.ajax({
        url: getURLForCategory(selectedCategory),
        type: 'GET',

        contentType: "application/json",
        dataType: 'json',

        success: function(data){
            $("#loading-box").hide();
            var jokes = data.jokes
            console.log(data.amount)
            populatePageWithJokes(jokes)
        },
        error: function(xhr,textStatus,errorThrown){
            console.log(errorThrown);
            console.log(textStatus);
            console.log(xhr);
            removeJokes();
            $("#loading-box").hide();
            $("#error-box").show();
        },

    }) 
}


function loadJokes(){
    removeJokes()
    $("#loading-box").show();
    sleep(2000).then(() => {
        getJokesForCategory();
    })
}

function removeJokes(){
    var column1Elem = document.getElementById("column1");
    var column2Elem = document.getElementById("column2");
    column1Elem.innerHTML = ""
    column2Elem.innerHTML = ""
}