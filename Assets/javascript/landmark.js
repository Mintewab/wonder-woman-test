var imgUrlList = [
    'http://designlike.com/wp-content/uploads/2011/12/Sagradafamilia00002482731-600x823.jpg',
    'https://cdn-images-1.medium.com/max/1600/0*89meqThuTSM7L0fL.jpg',
    'http://zee4u.files.wordpress.com/2011/03/petronis.jpg',
    'http://www.therichest.com/wp-content/uploads/5th.jpg',
    'https://oddstuffmagazine.com/wp-content/uploads/2012/04/1294.jpg',
    'https://s-media-cache-ak0.pinimg.com/736x/97/e6/6e/97e66e7cef48a4ebe73a113c31f373b5.jpg',
    'https://explorerspassage.com/wp-content/uploads/2016/11/Bridge.jpg',
    'http://www.bankableinsight.com/wp-content/uploads/2015/08/5389424262_af666a6f45_z.jpg',
    'https://3.bp.blogspot.com/-I-UYJWhrchA/Urs5pxZ1pZI/AAAAAAAAAvs/uKfQkJ7vyOM/s1600/bell-rock-in-sedona-306656hvvvvvv.jpg',
    'https://expatorama.files.wordpress.com/2015/04/img_4215-1.jpg',
    'http://www.visittnt.com/blog/wp-content/uploads/2016/06/o-TAJ-MAHAL-facebook.jpg',
    'http://www.vigoenfotos.com/paris/imagenes/paris/notre_dame/g_vigoenfotos_3404p.jpg',
    'https://www.casino.org/news/wp-content/uploads/2014/10/Tokyo-2020-Olympics-casino.jpg',
    'http://1.bp.blogspot.com/-fpl8BSpcznM/T_qcidqZwxI/AAAAAAAARmg/ZYx-PvO_vqk/s1600/Italy+2.jpg',
    'http://1.bp.blogspot.com/_I7rL3-gcB4Q/TJ266zh5bfI/AAAAAAAAAAw/6KNtm7ha9-M/s1600/76363-050-9741E61E.jpg',
    'http://designlike.com/wp-content/uploads/2011/12/Sagradafamilia00002482731-600x823.jpg',
    'https://cdn-images-1.medium.com/max/1600/0*89meqThuTSM7L0fL.jpg',
    'http://zee4u.files.wordpress.com/2011/03/petronis.jpg',
    'http://www.therichest.com/wp-content/uploads/5th.jpg',
    'https://oddstuffmagazine.com/wp-content/uploads/2012/04/1294.jpg',
    'https://s-media-cache-ak0.pinimg.com/736x/97/e6/6e/97e66e7cef48a4ebe73a113c31f373b5.jpg',
    'https://explorerspassage.com/wp-content/uploads/2016/11/Bridge.jpg',
    'http://www.bankableinsight.com/wp-content/uploads/2015/08/5389424262_af666a6f45_z.jpg',
    'https://3.bp.blogspot.com/-I-UYJWhrchA/Urs5pxZ1pZI/AAAAAAAAAvs/uKfQkJ7vyOM/s1600/bell-rock-in-sedona-306656hvvvvvv.jpg',
    'https://expatorama.files.wordpress.com/2015/04/img_4215-1.jpg',
    'http://www.visittnt.com/blog/wp-content/uploads/2016/06/o-TAJ-MAHAL-facebook.jpg',
    'http://www.vigoenfotos.com/paris/imagenes/paris/notre_dame/g_vigoenfotos_3404p.jpg',
    'https://www.casino.org/news/wp-content/uploads/2014/10/Tokyo-2020-Olympics-casino.jpg',
    'http://1.bp.blogspot.com/-fpl8BSpcznM/T_qcidqZwxI/AAAAAAAARmg/ZYx-PvO_vqk/s1600/Italy+2.jpg',
    'http://1.bp.blogspot.com/_I7rL3-gcB4Q/TJ266zh5bfI/AAAAAAAAAAw/6KNtm7ha9-M/s1600/76363-050-9741E61E.jpg',
];

var currentImgUrl;
var timeLeft = 10;
var runrun;
var urlIndex = 0;
var analyzedData;
var currentImageQuest;

// p5.js sound effect

let song;

function preload() {
    console.log("i am in preload");
    song = loadSound('audio1.mp3');
}

function setup() {
    setTimeout(function () {
        if (song.isPlaying()) {
            // .isPlaying() returns a boolean
            song.stop(); // .play() will resume from .pause() position
        } else {
            song.play();
        }
    }, 2000);
}


/** UI logic area **/
$(function () {
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

        $('#answer').html("This image was : " + currentImageQuest.answer);

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
        }, 5000)
    }
})


//handling click event for start game button
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
            if (data.description.captions.length > 0) {
                description = data.description.captions[0].text;
            }
            var landmarks = data.categories[0].detail.landmarks;
            console.log(landmarks);
            if (landmarks !== undefined && landmarks.length > 0) {
                landmark = landmarks[0].name;
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
