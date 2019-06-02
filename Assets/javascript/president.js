var imgUrlList = [
    'https://tse2.mm.bing.net/th?id=OIP.STWdg623tfIdcwNSfaMvbAHaE8&pid=Api&P=0&w=259&h=174',
    'https://i.dailymail.co.uk/i/pix/2017/05/14/15/404D44A500000578-4504038-New_French_President_Emmanuel_Macron_delivers_a_speech_during_hi-a-76_1494770439904.jpg',
    'https://www.wpclipart.com/American_History/presidents/additional_images/John_F_Kennedy_35th_US_president.png',
    'https://www.thoughtco.com/thmb/MNziwzvxYvGUrvQJX5oJs9j2_6U=/768x0/filters:no_upscale():max_bytes(150000):strip_icc()/695550-56a9b75f3df78cf772a9e124.jpg',
    'https://millercenter.org/sites/default/files/styles/teaser_thumb_med_2x/public/sp-harrytruman-533x300.jpg?itok=Op2y-Ms-',
    'https://upload.wikimedia.org/wikipedia/commons/1/1f/James_Abram_Garfield%2C_photo_portrait_seated.jpg',
    'https://i.kinja-img.com/gawker-media/image/upload/s--JgruyRsh--/c_scale,f_auto,fl_progressive,q_80,w_800/hglkiimxydfigd1ph6pu.jpg',
    'https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cg_face%2Cq_auto:good%2Cw_300/MTE5NTU2MzE2MzMxMjc5ODgz/richard-nixon-9424076-1-402.jpg',
    'https://images.gr-assets.com/authors/1206830616p5/219075.jpg',
    'https://static.politico.com/dims4/default/e63d2d1/2147483647/resize/1160x%3E/quality/90/?url=http%3A%2F%2Fs3-origin-images.politico.com%2Fnews%2F111013_theodore_roosevelt_ap_605.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Dwight_D._Eisenhower%2C_official_Presidential_portrait.jpg/220px-Dwight_D._Eisenhower%2C_official_Presidential_portrait.jpg'

];

var currentImgUrl;
var timeLeft = 10;
var runrun;
var urlIndex = 0;
var analyzedData;
var currentImageQuest;

// p5.js sound effect
let song;

function setup() {
    song = loadSound('../music/music2.mp3');
    setTimeout(function () {
        song.play();
    }, 2000);
}


/** UI logic area **/
$(function () {
    console.log("president");
    $("#play").click(gameLoad);

    function gameLoad() {
        // hiding the button
        $("#play").hide();

        // getting the current img url from the list
        currentImgUrl = imgUrlList[urlIndex];

        // displaying the current img
        document.querySelector("#currentImg").src = currentImgUrl;

        // sending a POST request to the API
        playCurrentImg(currentImgUrl);

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

        $('#answer').html("This President was : " + currentImageQuest.answer);

        setTimeout(function () {
            if (urlIndex < imgUrlList.length) {
                urlIndex++;
                currentImgUrl = imgUrlList[urlIndex];
                // displaying the current img
                document.querySelector("#currentImg").src = currentImgUrl;

                $('#answer').empty();
                playCurrentImg(currentImgUrl);
                timeLeft = 10;
                runrun = setInterval(function () {
                    loseTime();
                }, 1000);
            }
        }, 3000)
    }
})


function playCurrentImg(currentImgUrl) {
    //retrieving the image url from the list 
    console.log('currentImgUrl : ' + currentImgUrl);

    //sending a request to the api for the current image
    processRemoteImage(currentImgUrl);

    // waiting 3 seconds for the api call to finish
    setTimeout(function () {
        currentImageQuest = new GameQuestionAnswer(currentImgUrl, analyzedData.landmark);
    }, 3000);
}


/** Business logic area **/

// constructor function ResponseModel
function ResponseModel(landmark, description) {
    this.landmark = landmark;
    this.description = description;
}

// constructor function for GameQuestionAnswer
function GameQuestionAnswer(questionImgUrl, answer, options) {
    this.questionImgUrl = questionImgUrl;
    this.answer = answer;
    this.options = options;
}
// making an api call to microsoft computer vision API 
function processRemoteImage(imgUrl) {
    var subscriptionKey = subKey.key;
    console.log("subscriptionKey : " + subscriptionKey);
    //console.log("imgUrl : " + imgUrl);
    var landmark;
    var description;

    var uriBase =
        "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/analyze";

    // Request parameters.
    var params = {
        "visualFeatures": "Categories,Description,Color",
        "details": "",
        "language": "en",
    };

    // Make the REST API call.
    $.ajax({
        url: uriBase + "?" + $.param(params),

        // Request headers.
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/json");
            xhrObj.setRequestHeader(
                "Ocp-Apim-Subscription-Key", subscriptionKey);
        },

        type: "POST",

        // Request body.
        data: '{"url": ' + '"' + imgUrl + '"}',
    })
        .done(function (data) {
            console.log(data);
            if (data.description.captions.length > 0) {
                description = data.description.captions[0].text;
            }
            var landmarks = data.categories[0].detail.celebrities[0];
            console.log(landmarks);
            if (landmarks !== undefined) {
                landmark = landmarks.name;
                console.log(landmark);
            }

            //creating an instance of ResponseModel
            analyzedData = new ResponseModel(landmark, description);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " :
                errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" :
                jQuery.parseJSON(jqXHR.responseText).message;
            alert(errorString);
        });
}

