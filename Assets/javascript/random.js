var randomResponseResult;

var currentRandomQuestion;
var currentRandomIncorrect;
var currentRandomCorrect;
var currentCategory;
var randomIndex = 0;
var timeLeft = 10;



$(function () {
    $.ajax({
        method: 'GET',
        url: 'https://opentdb.com/api.php?amount=10',
    }).then(function (response) {
        console.log(response);
        randomResponseResult = response.results;
        console.log(randomResponseResult);
    })
    console.log("hi");

    $("#play").click(gameLoad);
})



$("#play").click(gameLoad);

$("#nextQ").on('click', function() {
    console.log("next is clicked")
    if(randomIndex < randomResponseResult.length){
        randomIndex++;
        gameLoad();
    }
});

function gameLoad() {
    // hiding the button
    $("#play").hide();

    currentCategory = randomResponseResult[randomIndex].category;
    console.log("currentCategory: " + currentCategory);

    currentRandomQuestion = randomResponseResult[randomIndex].question;
    console.log("currentRandomQuestion: " + currentRandomQuestion);

    currentRandomCorrect = randomResponseResult[randomIndex].correct_answer;
    console.log("currentRandomCorrect: " + currentRandomCorrect);

    currentRandomIncorrect = randomResponseResult[randomIndex].incorrect_answers;
    console.log("currentRandomIncorrect: " + currentRandomIncorrect);
    currentRandomIncorrect.push(currentRandomCorrect);

    $("#question").text(currentRandomQuestion);
    $("#category").text(currentCategory);

    for(var i = 0; i<currentRandomIncorrect.length; i++) {
        var liValue = currentRandomIncorrect[i];
        $("#options").append('<li class="optionList"><h2>' + liValue + '</h2></li>');
    }  

    runrun = setInterval(function () {
        loseTime();
    }, 1000);
}
function loseTime() {
    console.log("in loseTime");
    timeLeft--;
    $("#displayTimeLeft").text(timeLeft);
    if (timeLeft < 1) { gameOver(); }
}

function gameOver() {
    clearInterval(runrun);
    $("#answer").text(currentRandomCorrect);
}