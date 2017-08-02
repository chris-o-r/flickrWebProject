///////////////////////////////////////////
//                                       //
//                                       //
//       Chris O'Riordan                 //
//          R00137629                    //
//                                       //
//                                       //
///////////////////////////////////////////
//The map object
var map;
var incrementer = 0;
//The image array
var imageArr = [];
//The current picture the user is veiwing 
var currentPic = 0;

function showMap() {
    var name = "Cork, Ireland";
    var lat = 51.9010550;
    var long = -8.4818984;
    //Returns the location as a String name, lattitiuse Longitude
    map = L.map('map', {
        center: [lat, long],
        zoom: 15
    });
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
}

function getLocation() {
    //Changing the buttons state 
    document.getElementById("findImageButton").type = "image";
    document.getElementById("findImageButton").setAttribute("src", "loadingIcon.gif")
    var lat;
    var long;
    //Getting the location from the user
    var loc = document.getElementById("location").value;
    //Checking if it is not null
    if (loc != null) {
        //The public key for mapquest
        var KEY = "hIHoXRX03QXTDokVB47pveJoYK6pmc40";
        //Constructing the requset
        var request = "http://www.mapquestapi.com/geocoding/v1/address?key=" + KEY + "&location=" + loc;
        x = new XMLHttpRequest();
        //Sending the request
        x.open("GET", request);
        x.onreadystatechange = handleServerInput;
        x.send(null);

        function handleServerInput() {
            if (x.readyState == 4 && x.status == 200) {
                data = eval("(" + x.responseText + ")");
                lat = data.results[0].locations[0].latLng.lat;
                long = data.results[0].locations[0].latLng.lng;
                var marker = L.marker([lat, long]).addTo(map);
                map.panTo(new L.LatLng(lat, long));
                findImages(lat, long);
            }
        }
    }
}

function findImages(lat, long) {
    var key = "47e7627c6dc5c732ea0c239235e2ae71"
    var tags = document.getElementById("tags").value;

    if (tags != null) {
        var request = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + key + "&tags=" + tags + "&lat=" + lat + "&lon=" + long + "&radius=4&format=json&nojsoncallback=1";
        //Sending the request
        x = new XMLHttpRequest();
        x.open("GET", request);
        x.onreadystatechange = handleInput;
        x.send(null);

        function handleInput() {
            if (x.readyState == 4 && x.status == 200) {
                // Emptying the array
                imageArr = [];

                //Setting current image to 0
                currentPic = 0;
                dataString = x.responseText;
                dataObject = eval("(" + dataString + ")");
                for (i = 0; i < dataObject.photos.photo.length; i++) {
                    var farm = dataObject.photos.photo[i].farm;
                    var serverID = dataObject.photos.photo[i].server;
                    var photoID = dataObject.photos.photo[i].id;
                    var secret = dataObject.photos.photo[i].secret;
                    var photoURL = "https://farm" + farm + ".staticflickr.com/" + serverID + "/" + photoID + "_" + secret + "_m.jpg";
                    imageArr[i] = photoURL;
                }
                addImagesToDiv()
                //Setting the button back to normal
                document.getElementById("findImageButton").setAttribute("type", "button");
            }
        }
    }
}

function addImagesToDiv(imgNum) {
    var numImg = imageArr.length;
    var imgBox = document.getElementById("imageCarosuel");
    //Clearing the carosuel
    while (imgBox.firstChild != null) {
        imgBox.removeChild(imgBox.firstChild);
    }
    for (i = 0; i < numImg; i++) {
        //Creating the image
        var image = document.createElement("img");
        var id = "carosuelImage" + i;
        image.id = id;
        image.src = imageArr[i];
        image.setAttribute("class", "carosuelImage");
        imgBox.appendChild(image);
    }
}

function setMainImage() {
    var imageContainer = document.getElementById("imageBox");
    var child = imageContainer.firstChild;
    imageContainer.removeChild(child);
    var mainImg = new Image();
    var link = imageArr[currentPic];
    mainImg.src = link;
    imageContainer.appendChild(mainImg);
    var offsetTop = mainImg.offsetTop;
    var offsetLeft = mainImg.offsetLeft;
    mainImg.style.marginLeft = offsetLeft + "px";
    mainImg.style.marginTop = offsetTop + "px";
}

function moveCarosuelRight() {
    currentPic++;
    setMainImage();
}

function moveCarosuelLeft() {
    if (currentPic > 0) {
        currentPic--;
        setMainImage();
    } else {
        window.alert("Carosuel at furthest postion");
    }
}

function animateCarosuel() {
    var innerBox = document.getElementById("imageCarosuel");
    var outerBox = document.getElementById("imageCarosuelContainer");
    if (innerBox.childNodes.length > 0) {
        var innerLeftOffset = innerBox.childNodes[currentPic].offsetLeft;
        var halfOuterW = outerBox.offsetWidth / 2;
        var halfImageW = innerBox.childNodes[currentPic].offsetWidth / 2;
        var outerLeftOffset = halfOuterW - halfImageW;
        var leftPos = outerLeftOffset - innerLeftOffset;
        leftPos = Math.round(leftPos);

        if (incrementer == leftPos) {
            incrementer = leftPos;
        } else if (incrementer < leftPos) {
            incrementer++;
        } else if (incrementer > leftPos) {
            incrementer--;
        }
        innerBox.style.left = incrementer + "px";
        //  innerBox.childNodes[currentPic].style.opacity = "0";
    }
}

function buttonStuff() {
    getLocation();
}

setInterval(animateCarosuel, 1);
window.onload = showMap;000