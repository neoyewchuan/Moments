// ***************************************************
// script to attach the side panel to all jQM pages
// ***********************************************/
$(function ()   {
    $("[data-role=header]").toolbar().enhanceWithin();
    $("[data-role=panel]").panel().enhanceWithin();
});

$(document).on("pagecreate", function () {
    $("[data-role=panel]").one("panelbeforeopen", function () {
        let height = $.mobile.pageContainer.pagecontainer("getActivePage").outerHeight();
        $(".ui-panel-wrapper").css("height", height + 1);
    });
});


// Variable to hold all user objects
// retrieve via API
let allUsersRef;


// firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAfB4CpHi3m3u4G_tLm_q-aI2f91z4Yw2I",
    authDomain: "fir-testproject-b5043.firebaseapp.com",
    databaseURL: "https://fir-testproject-b5043.firebaseio.com",
    projectId: "fir-testproject-b5043",
    storageBucket: "fir-testproject-b5043.appspot.com",
    messagingSenderId: "762909598959",
    appId: "1:762909598959:web:f3d90e3928acbf99"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// listen on auth state changes
firebase.auth().onAuthStateChanged(function(user) {
    if (user)   {
        activateSignedIn(user);
        loadAllMoments();
        jumpToPage('#myposts', 'flow', loadUserMoments);
    }  else {
        activateSignedOut();
        defaultMoments();
    }
});



// Activate when user sign in
function activateSignedIn(signinUser) {
    let signoutBtn = document.getElementById('signoutbtn');
    let settingBtn = document.getElementById('settingbtn');
    let elements = '<a href="#newpost" data-role="button" class="ui-btn ui-btn-a ui-icon-plus ui-btn-icon-left ui-btn-newmoment">New Moment</a>';

    let topBarElement = document.getElementById("topBarAllPost");
    topBarElement.innerHTML = elements;
    topBarElement = document.getElementById("topBarMyPost");
    topBarElement.innerHTML = elements;
    if (signinUser.photoURL)  {
        document.getElementById('signinUserPix').src = signinUser.photoURL;
    } else {
        document.getElementById('signinUserPix').src = "./images/noprofilepix.png";
    }
    $('#sgSigninUserName').text( signinUser.displayName);
    alert('User Sign In');
    signoutBtn.style.display = "block";
    settingBtn.style.display = "block";

    $('.ui-btn.ui-btn-corner-all.ui-btn-login').hide();
    $('.ui-btn.ui-btn-corner-all.ui-btn-signup').hide();
    $('ui-btn.ui-btn-a.ui-icon-plus.ui-btn-icon-left.ui-btn-newmoment').show();
}


// Activate when user sign out
function activateSignedOut()    {
    let signoutBtn = document.getElementById('signoutbtn');
    let settingBtn = document.getElementById('settingbtn');
    let elements = '<a href="#login" data-role="button"  data-rel="dialog" data-dismissible="false" data-transition="slide" class="ui-btn ui-btn-corner-all ui-btn-login">LOGIN</a>' +
        '<a href="#signup" data-role="button" data-rel="dialog" data-transition="slide" class="ui-btn ui-btn-corner-all ui-btn-signup">SIGNUP</a>';

    let topBarElement = document.getElementById("topBarAllPost");
    topBarElement.innerHTML = elements;
    topBarElement = document.getElementById("topBarMyPost");
    topBarElement.innerHTML = elements;

    document.getElementById('signinUserPix').src = "./images/noprofilepix.png";
    $('#sgSigninUserName').text('Guest');
    signoutBtn.style.display = "none";
    settingBtn.style.display = "none";
    $('.ui-btn.ui-btn-corner-all.ui-btn-login').show();
    $('.ui-btn.ui-btn-corner-all.ui-btn-signup').show();
    $('ui-btn.ui-btn-a.ui-icon-plus.ui-btn-icon-left.ui-btn-newmoment').hide();
}


// Event handler for handline sign-in/sign-up & sign-out button
// display on/of based on the sign-in status
$(document).ready(function () {
    if (firebase && !firebase.auth().currentUser)  {
        document.getElementById('signoutbtn').style.display = "none";
        document.getElementById('settingbtn').style.display = "none";
        $('.ui-btn.ui-btn-corner-all.ui-btn-login').show();
        $('.ui-btn.ui-btn-corner-all.ui-btn-signup').show();
        $('ui-btn.ui-btn-a.ui-icon-plus.ui-btn-icon-left.ui-btn-newmoment').hide();
    } else {
        $('.ui-btn.ui-btn-corner-all.ui-btn-login').hide();
        $('.ui-btn.ui-btn-corner-all.ui-btn-signup').hide();
        $('ui-btn.ui-btn-a.ui-icon-plus.ui-btn-icon-left.ui-btn-newmoment').show();
    }
});

// Event handler for handling pageshow event for feedback dialog
// if user is signed-in, grab the display name & email to fill up the form
$('#feedback').on('pageshow', function() {
    let nowFbUser = firebase.auth().currentUser;
    if (nowFbUser)    {
        document.getElementById('fbname').value = nowFbUser.displayName;
        document.getElementById('fbemail').value = nowFbUser.email;
    } else {
        document.getElementById('fbname').value ="";
        document.getElementById('fbemail').value = "";
    }
});

// Event handler for handling pageshow event for setting dialog
// if user is signed-in, grab the display name, email and photoURL to fill up the form
// only signed-in user able to access the settings option to change
// displayName and photoURL
$('#settings').on('pageshow', function () {
    let nowFbUser = firebase.auth().currentUser;
    if (nowFbUser) {
        document.getElementById('sgDisplayNameX').value = nowFbUser.displayName;
        document.getElementById('sgEmailX').value = nowFbUser.email;
        //document.getElementById('sgProfilePixX').attr('src', nowFbUser.photoURL);
        $('#sgProfilePixX').attr('src', nowFbUser.photoURL);
    } else {
        document.getElementById('sgDisplayNameX').value = "";
        document.getElementById('sgEmailX').value = "";
    }
});

// Login
$("#usignin").click(function() {

    let lgemail = $('#fbUserEmail');
    let lgpass = $('#fbUserPass');

    firebase.auth().signInWithEmailAndPassword(lgemail.val(), lgpass.val()).catch((error) => {
        let errorCode = error.code;
        let errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
            alert('Invalid email/password.');
        } else {
            alert(errorMessage);
        }
    }).then ( (firebaseUser) => {
        clearForm('sign-in');
    });

});


// SIGN-OUT
$('#signoutbtn').click(function (e) {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        //toastShow("User signed out!");
        alert("User signed out!");
    }).catch(function(error) {
        // An error happened.
        alert(error);
    });
});


// NEW USER SIGN-UP
$("#usignup").click(function() {

    let email = $('#sgEmail');
    let pass = $('#sgPass');
    let displayname = $('#sgDisplayName');
    let selectedFile = document.getElementById('sgProfilePixBtn');
    //console.log(selectedFile.files[0]);
    firebase.auth().createUserWithEmailAndPassword(email.val(), pass.val()).then(function() {
        // upload the profile picture upon successful user sign up
        let user = firebase.auth().currentUser;
        let uploadFile = selectedFile.files[0];
        //console.log(user);
        let fileName = user.uid + "." + getJustFileExtension(uploadFile.name); //uploadFile.name;//.split(/(\\|\/)/g).pop();
        let storageService = firebase.storage();
        //var storage = firebase.app().storage("gs://fir-testproject-b5043.appspot.com/");
        let storageRef = storageService.ref();
        let metadata = {
            contentType: uploadFile.type,
        };
        storageRef.child(`avatar/${fileName}`).put(uploadFile, metadata).then( (snapshot) => {
            // update the display name and profile picture to user account
            storageRef.child(`avatar/${fileName}`).getDownloadURL().then(function(imageURL) {

                let userNow = firebase.auth().currentUser;
                userNow.updateProfile({
                    displayName: displayname.val(),
                    photoURL: imageURL
                }).then(function() {
                    // var displayName = userNow.displayName;
                    // var photoURL = userNow.photoURL;
                    document.getElementById('signinUserPix').src = userNow.photoURL;
                    $('#sgSigninUserName').text( userNow.displayName);
                    clearForm('sign-up');

                }, function(error) {

                });
            });

        }, function (error) {
            alert("User account created, however there is an issue uploading the profile pix!");
        });


    }).catch(function (error) {
        console.log('there was an error');
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode + ' - ' + errorMessage);
    });

});


// SETTINGS
// Allow User to change displayName & profile Pix
$("#usettings").click(function() {

    let nowUser = firebase.auth().currentUser;
    // first to check if the form is submitted by current user
    let email = $('#sgEmailX').val();
    if (email === nowUser.email)    {

        let newDisplayname = $('#sgDisplayNameX').val();
        let selectedFile = document.getElementById('sgProfilePixBtnX');
        let uploadFile = selectedFile.files[0];
                //console.log(user);
        let fileName = nowUser.uid + "." + getJustFileExtension(uploadFile.name); //uploadFile.name;//.split(/(\\|\/)/g).pop();
        let storageService = firebase.storage();
                //var storage = firebase.app().storage("gs://fir-testproject-b5043.appspot.com/");
        let storageRef = storageService.ref();
        let metadata = {
            contentType: uploadFile.type,
        };
        storageRef.child(`avatar/${fileName}`).put(uploadFile, metadata).then( (snapshot) => {
            // update the display name and profile picture to user account
            storageRef.child(`avatar/${fileName}`).getDownloadURL().then(function(imageURL) {

                let userNow = firebase.auth().currentUser;
                userNow.updateProfile({
                    displayName: newDisplayname,
                    photoURL: imageURL
                }).then(function() {
                    document.getElementById('signinUserPix').src = userNow.photoURL;
                    $('#sgSigninUserName').text( userNow.displayName);
                    clearForm('settings');

                }, function(error) {

                });
            });

        }, function (error) {
            console.log(error);
            alert("Error updating user profile.. \n"+error);
        });


    } else {
        alert("User not signed in!");
    }

});

// **********************************
// event handler for New Moments Posting
// *************************************
$("#npsubmit").click(function (e)   {
    // check if required fields are filled in
    // check if user is login
    // set reference to firestore
    // upload photo to firestore then obtain the downloadURL and update the post.
    //console.log("new moments posting");
    let np_title = $('#nptitle').val();
    let np_story = $('#npstory').val();
    let np_filter = $('#npimgfilter').val();
    let np_photo = document.getElementById('takepicture');
    if ((np_title) && (np_story) && np_photo.files[0])   {
        let signinUser = firebase.auth().currentUser;
        //console.log(np_title + ' ' + np_story + ' ' + np_photo.files[0]);
        if (signinUser) {
            // upload the photo first, create the post after
            let uploadFile = np_photo.files[0];
            //console.log(user);
            let date = new Date();
            let timestamp = date.getTime().toString();
            let fileName = signinUser.uid + "_" + timestamp + "." + getJustFileExtension(uploadFile.name); //uploadFile.name;//.split(/(\\|\/)/g).pop();
            let storageService = firebase.storage();
            let storageRef = storageService.ref();
            let metadata = {
                contentType: uploadFile.type,
            };

            storageRef.child(`moments/${fileName}`).put(uploadFile, metadata).then( (snapshot) => {
                storageRef.child(`moments/${fileName}`).getDownloadURL().then(function (imageURL) {

                    let usid = signinUser.uid;
                    let usdn = signinUser.displayName;
                    let mail = signinUser.email;
                    let databaseService = firebase.database();
                    let databaseRef = databaseService.ref().child('moments');

                    let postData = {
                        pname: usdn,
                        pmail: mail,
                        title: np_title,
                        story: np_story,
                        photo: imageURL,
                        imgfi: np_filter,
                        ptime: date.toLocaleString()
                    };

                    let postkey = databaseRef.child(usid).push().key;

                    let updates = {};
                    updates ['/' + usid + '/' + postkey] = postData;

                    const re = databaseRef.update(updates).then(function() {
                        alert("Moment successful posted!");
                        clearForm('new-post');
                        loadAllMoments();
                        jumpToPage('#myposts', 'flow', loadUserMoments);
                    });
                });
            });
        }
    } else {
        alert("Not all required fields were entered!");
    }
});


// *******************************************
// Event handler for input image for NEW POST
// *******************************************
$("#takepicture").change(function(){
    readURL(this);
});

function readURL(input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();


        reader.onload = function (e) {
            let image = new Image();
            image.src = e.target.result;

            image.onload = function()   {
                let imgHeight = this.height;
                let imgWidth  = this.width;
                //let imgSetWidth = imgWidth;
                //let imgSetHeight = imgHeight;

                let imgSetWidth = document.body.clientWidth-32;    //(document).width();
                let imgSetHeight = ((imgSetWidth / imgWidth) * imgHeight)|0 ;

                $('#showpicture').attr('width', String(imgSetWidth));
                $('#showpicture').attr('height', String(imgSetHeight));
                $('#showpicture').attr('src', this.src);
            };

        };

        reader.readAsDataURL(input.files[0]);
    }
}

/**********************************************************
/* load all moments (posts) pertain to current login user
***********************************************************/
function loadUserMoments() {

    console.log("loadUserMoments()");

    const firebaseUser = firebase.auth().currentUser;

    let ref = firebase.database().ref('moments' + '/' + firebaseUser.uid);

    let storyBoard = [];
    ref.once("value", function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            let item0 = childSnapshot.val().pname;
            let item1 = childSnapshot.val().title;
            let item2 = childSnapshot.val().story;
            let item3 = childSnapshot.val().photo;
            let item4 = childSnapshot.val().imgfi;
            let item5 = childSnapshot.val().ptime;
            let item6 = childSnapshot.val().likes;
            let item8 = firebaseUser.uid;
            let item9 = childSnapshot.key;

            let storyData = {
                pusid: item0,
                title: item1,
                story: item2,
                photo: item3,
                imgfi: item4,
                ptime: item5,
                likes: item6,
                puser: item8,
                posid: item9
            };

            storyBoard.push(storyData);
        });
        // sort by post id
        storyBoard.sort(compareValues('posid', 'desc'));
        let cardElement = document.getElementById("user-moments");
        let cardString = `<div class="ui-grid-a"><h3 class="ui-block-a" style="padding-left: 5px"><em>MY TIMELINE</em></h3>` +
            `<div data-role="button" class="ui-btn ui-btn-corner-all ui-btn-icon-notext ui-icon-refresh ui-block-d" ` +
            `style="float:right" onclick='loadUserMoments()'></div></div>`;

        for (let i=0; i < storyBoard.length; i++)   {
            cardString += `<div class="ui-body ui-body-a ui-corner-all">` +
                                `<h3>`+storyBoard[i].title+`</h3>` +
                                `<h6><em>Posted by `+storyBoard[i].pusid+` on `+storyBoard[i].ptime+`</em></h6>` +
                                `<img src="`+storyBoard[i].photo+`" width="100%" style="filter:`+storyBoard[i].imgfi+`">` +
                                `<p>`+storyBoard[i].story+`</p>` +
                                `<div class="container">` +
                                        `<div data-role="button" class="`+userHasLikeIcon(firebaseUser.uid,storyBoard[i].likes)+`" ` +
                                            `onclick='toggleLike("` + storyBoard[i].puser + `","`+ storyBoard[i].posid + `")' data-value="`+storyBoard[i].puser+`" ` +
                                                `id="like-btn-mm-`+storyBoard[i].puser + storyBoard[i].posid+`">` +
                                        `</div>` +
                                        `<span id="badge-like-mm-`+storyBoard[i].posid+`" class="likes-badge ui-btn-inline" rel="tooltip" ` +
                                            `title="" onmouseover='likesBy("`+storyBoard[i].puser+`", "`+storyBoard[i].posid+`")'>`+
                                            countLikes(storyBoard[i].likes) +
                                        `</span>` +
                                `</div>` +
                            `</div><br><br>`;

        }

        cardElement.innerHTML = cardString;
    }, function (error) {
        console.log("Error: " + error.code);
    });
}


// ******************************************
// Function to jump to specific given page
// ******************************************
function jumpToPage(_page, _transition, _callback)   {
    $.mobile.navigate( _page) ;
    if (typeof _callback === 'function') {
        //console.log('calling callback...');
        _callback();
    }
}



/**********************************************************
 /* load all member's moments (posts) from the firestore
 ***********************************************************/
function loadAllMoments() {
    // URL to retrieve all users in Firebase
    // Using cloud function to retrieve all users in database
    // https://us-central1-fir-testproject-b5043.cloudfunctions.net/api
    //console.log("loadAllMoments()");
    const firebaseUser = firebase.auth().currentUser;
    let dbRef = firebase.database().ref('moments');
    let userRef = getJSON("https://us-central1-fir-testproject-b5043.cloudfunctions.net/api" ,
        function(err, data)  {
            if (err != null)    {
                console.log("Something went wrong... " + err);
                return null;
            } else {
                // get users successful
                allUsersRef = Array.from(data);
                /*
                allUserRef.forEach( (user1) => {
                   console.log(user1.email);
                }); */
                return data;

            }

        });
    let storyBoard = [];

    dbRef.once('value').then(function(snapshot) {
        let valKey = snapshot.key;
        snapshot.forEach(function (snapshot1)   {
            let userKey = snapshot1.key;
            snapshot1.forEach(function (snapshot2) {
                let item0 = snapshot2.val().pname;
                let item1 = snapshot2.val().title;
                let item2 = snapshot2.val().story;
                let item3 = snapshot2.val().photo;
                let item4 = snapshot2.val().imgfi;
                let item5 = snapshot2.val().ptime;
                let item6 = snapshot2.val().likes;
                let item8 = userKey;
                let item9 = snapshot2.key;
                //console.log(item9);
                let storyData = {
                    pusid: item0,
                    title: item1,
                    story: item2,
                    photo: item3,
                    imgfi: item4,
                    ptime: item5,
                    likes: item6,
                    puser: item8,
                    posid: item9
                };

                storyBoard.push(storyData);

            });
        });

        storyBoard.sort(compareValues('posid', 'desc'));

        let cardElement = document.getElementById("all-moments");
        let cardString = `<div class="ui-grid-a">` +
                            `<h3 class="ui-block-a" style="padding-left: 5px"><em>MOMENTS TIMELINE</em></h3>` +
                            `<div data-role="button" class="ui-btn ui-btn-corner-all ui-btn-icon-notext ui-icon-refresh ui-block-d" ` +
                                    `style="float:right" onclick='loadAllMoments()'>` +
                            `</div>` +
                        `</div>`;

        for (let i=0; i < storyBoard.length; i++)   {
            cardString += `<div class="ui-body ui-body-a ui-corner-all">` +
                                `<h3>`+storyBoard[i].title+`</h3>` +
                                `<h6><em>Posted by `+storyBoard[i].pusid+` on `+storyBoard[i].ptime+`</em></h6>` +
                                `<img src="`+storyBoard[i].photo+`" width="100%" style="filter:`+storyBoard[i].imgfi+`">` +
                                `<p>`+storyBoard[i].story+`</p>` +
                                `<div class="container">` +
                                    `<div data-role="button" class="`+userHasLikeIcon(firebaseUser.uid,storyBoard[i].likes)+`" ` +
                                        `onclick='toggleLike("` + storyBoard[i].puser + `","`+ storyBoard[i].posid + `")' data-value="`+storyBoard[i].puser+`" ` +
                                            `id="like-btn-am-`+storyBoard[i].puser + storyBoard[i].posid+`">` +
                                    `</div>` +
                                    `<span id="badge-like-am-`+storyBoard[i].posid+`" class="likes-badge ui-btn-inline" rel="tooltip" ` +
                                            `title="" onmouseover='likesBy("`+storyBoard[i].puser+`", "`+storyBoard[i].posid+`")'>`+
                                            countLikes(storyBoard[i].likes) +
                                    `</span>` +
                                `</div>` +
                        `</div><br><br>`;

        }
        cardElement.innerHTML = cardString;

    }, function (error) {
        console.log("Error: " + error.code);
    });
}


// **********************************************
// load the default page when user not signed in
// **********************************************
function defaultMoments()   {

    let cardElement1 = document.getElementById("all-moments");
    let cardElement2 = document.getElementById("user-moments");
    let cardString = `<br><div class="ui-body ui-body-a ui-corner-all">` +
                            `<h3>Today\'s Special Moments are Tomorrow\'s Memories..</h3>` +
                            `<h6><em>Posted by admin on unknown date/time</em></h6>` +
                            `<img src="./images/moments.jpg" width="100%">` +
                            `<p>Some moments are nice, some are nicer, some are even worth sharing!</p>` +
                            `<div class="container">`+
                                `<button data-role="button" class="ui-btn ui-btn-icon-notext ui-block-a ui-btn-corner-all ui-icon-like-yes"></button>` +
                                `<span class="likes-badge2">3</span>` +
                            `</div>`+
                        `</div>` ;

    // set the default load page for both All Moments & My Moments page
    cardElement1.innerHTML = cardString;
    cardElement2.innerHTML = cardString;

}



// *******************************************
// Function to sort the POST in asc or desc
// based on the given field
// *******************************************
function compareValues(key, order='asc') {
    return function(a, b) {
        if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
        }

        const varA = (typeof a[key] === 'string') ?
            a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string') ?
            b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (order == 'desc') ? (comparison * -1) : comparison
        );
    };
}

// Callback for GoogleMap in About Page
function initMap() {
    // The location of SP
    let sp = {lat: 1.310660, lng: 103.777512};
    // The map, centered at Uluru
    let map = new google.maps.Map(
        document.getElementById('map'), {zoom: 14, center: sp});
    // The marker, positioned at Uluru
    let marker = new google.maps.Marker({position: sp, map: map});

    google.maps.event.addListener( marker, 'click', (
        function( marker) {
            return function() {
                var infowindow = new google.maps.InfoWindow();
                infowindow.setContent( "Moments Inc. @ SP" );
                infowindow.open( map, marker );
            }
        }
    )( marker) );

}





// ********************************
// Get the file extension of input image
// *********************************
function getJustFileExtension(path) {
    let filename = path.split('\\').pop().split('/').pop();
    let lastIndex = filename.lastIndexOf(".");
    if (lastIndex < 1) return "";
    return filename.substr(lastIndex + 1);
}

function getJustFileName(path) {
    let filename = path.split('\\').pop().split('/').pop();
    return fileName;
}


// ***************************************
// Event handler for Submit Feedback
// Signed in user >> feedback submit and store in clu=oud storage
// Guest >> trigger default email client to send feedback
// ***********************************
$("#submitfeedback").click(function (e) {
    let date = new Date();
    let name = $("#fbname").val();
    let email = $("#fbemail").val();
    let feedback = $("#fbfeedback").val();
    if (name === '' || email === '' || feedback === '') {
        e.preventDefault();
        alert("Please Fill Required Fields");
    } else {
        let signinUser = firebase.auth().currentUser;
        if (signinUser) {

            let databaseService = firebase.database();
            let databaseRef = databaseService.ref().child('feedback');

            let postData = {
                fbname: name,
                fbmail: email,
                fbtext: feedback,
                fbtime: date.toLocaleString()
            };

            let postkey = databaseRef.push().key;

            let updates = {};
            updates ['/' + postkey] = postData;

            const re = databaseRef.update(updates).then(function() {
                alert("Thank you for your feedback!\nWe'll review and get in touch to you shortly..");

            });

        } else {
            let subject = 'Feedback';
            let emailBody = feedback;
            document.location = "mailto:"+email+"?subject="+subject+"&body="+emailBody;
        }
        // go back to previous page before feedback
        clearForm('feedback')
        window.history.back();
    }

});


// ******************************************
// Image input handler for New Post
// If apps ran on mobile device will trigger phone camera
// otherwise, user need to choose a picture from local file system
// ****************************************************************
$("capture").click(function()   {
    //document.write("<video id=\"video\" width=\"640\" height=\"480\" autoplay></video>")
    let video = document.getElementById('npvideo');

// Get access to the camera!
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Not adding `{ audio: true }` since we only want video now
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            //video.src = window.URL.createObjectURL(stream);
            video.srcObject = stream;
            video.play();
        });
    }
});

$("snapphoto").click(function()   {
    let canvas = document.getElementById('npcanvas');
    let context = canvas.getContext('2d');
    let video = document.getElementById('npvideo');

// Trigger photo take
    document.getElementById("snap").addEventListener("click", function() {
        context.drawImage(video, 0, 0, 640, 480);
    });
});

// ********************************************
// Image Filter handler for NEW POST
let imageFilter = document.getElementById("npimgfilter");
let showPicture = document.getElementById('showpicture');
imageFilter.addEventListener("change", function() {
    showPicture.style.filter = imageFilter.value;
});


// *******************************************
// file input handler for profile picture in User Sign-up
// ********************************************************
$("#sgProfilePix").click(function(e) {
    $("#sgProfilePixBtn").click()
});

function fasterPreview( uploader ) {
    if ( uploader.files && uploader.files[0] ){
        $('#sgProfilePix').attr('src',
            window.URL.createObjectURL(uploader.files[0]) );
    }
}

$("#sgProfilePixBtn").change(function(){
    fasterPreview( this );
});


// *******************************************
// file input handler for profile picture in User Settings
// ********************************************************
$("#sgProfilePixX").click(function (e) {
    $("#sgProfilePixBtnX").click()
});

function fasterPreviewX(uploader) {
    if (uploader.files && uploader.files[0]) {
        $('#sgProfilePixX').attr('src',
            window.URL.createObjectURL(uploader.files[0]));
    }
}

$("#sgProfilePixBtnX").change(function () {
    fasterPreviewX(this);
});


// *****************************************************
// Get allUser object from firebase using cloud function
// *****************************************************
let getJSON = function(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.mode = "no-cors";
    xhr.onload = function() {
        let status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};


// ***********************************************
// To Clear the form after successful sign-in,
// sign-up, new-post, feedback etc
// *****************************************************
function clearForm(theFormId)  {
    switch (theFormId)  {
        case 'sing-in' :
            $('#fbUserEmail').val("");
            $('#fbUserPass').val("");
            break;
        case 'sign-up' :
            $('#sgEmail').val("");
            $('#sgPass').val("");
            $('#sgDisplayName').val("");
            //$('#sgProfilePixBtn').text("");
            $('#sgProfilePix').attr('src', "./images/noprofilepix.png");
            break;
        case 'settings':
            $('#sgEmailX').val("");
            $('#sgPassX').val("");
            $('#sgDisplayNameX').val("");
            //$('#sgProfilePixBtn').text("");
            $('#sgProfilePixX').attr('src', "./images/noprofilepix.png");
            break;
        case 'new-post' :
            $('#nptitle').val("");
            $('#npstory').val("");
            $('#takepicture').val("");
            $('#showpicture').attr('src','')
            break;
        case 'feedback' :
            $('#fbname').val("");
            $('#fbemail').val("");
            $('#fbfeedback').val("");
    }
}


// ******************
// TOGGLE LIKES
// ******************
function toggleLike(postUsrKey, postIdKey)   {
    let nowUser = firebase.auth().currentUser;

    //console.log(postUsrKey + ' / ' + postIdKey);
    let databaseService = firebase.database();
    //let databaseRef = databaseService.ref().child('moments');
    let databaseRef     = databaseService.ref(`moments/`+postUsrKey+`/`+postIdKey);
    //databaseRef.child(postUsrKey+`/`+postIdKey+`/likes`).once('value', function(snapshot)   {
    databaseRef.once('value', function(snapshot)   {
        let addLikes = true;
        let likeList = [];
        //console.log(snapshot.val().likes);
        if (typeof snapshot.val().likes==='undefined' || snapshot.val().likes===null)    {
            likeList[0] = nowUser.uid;
        } else {
            likeList = snapshot.val().likes.split(',');

            for (let i = 0; i < likeList.length; i++)  {
                if (likeList[i].replace(",","") === nowUser.uid) {
                    likeList.splice(i, 1);
                    addLikes = false;
                    break;
                }
            }
            if (addLikes)   {
                likeList.push(nowUser.uid);
            }


        }

        databaseRef.update({
            "likes" : likeList.join(",")

        });
        // need to find out what is the active page
        let pageId = ($.mobile.activePage.attr("id") === "myposts") ? "mm" : "am";
        let element = document.getElementById("like-btn-"+pageId+"-"+postUsrKey+postIdKey);

        if (addLikes) {
            element.classList.remove("ui-icon-like-no");
            element.classList.add("ui-icon-like-yes");
        } else {
            element.classList.remove("ui-icon-like-yes");
            element.classList.add("ui-icon-like-no");
        }
        $('#badge-like-'+pageId+'-'+postIdKey).html(countLikes(likeList.join(",")));
            //databaseRef.set()
    });
}


/* *********************************************
 To find out moments is being like by which user
 ******************************************** */
function likesBy(postUsrKey, postIdKey)   {
    let nowUser = firebase.auth().currentUser;
    let likes = "";

    let databaseService = firebase.database();

    let databaseRef     = databaseService.ref(`moments/`+postUsrKey+`/`+postIdKey);

    databaseRef.once('value', function(snapshot)   {

        let likeList = [];

        if (typeof snapshot.val().likes!='undefined' && snapshot.val().likes!=null)    {
            likeList = snapshot.val().likes.split(',');
            for (let i = 0; i < likeList.length; i++)  {
                allUsersRef.forEach((user1) => {
                    if (likeList[i].replace(",","") === user1.uid)  {
                        likes += ((likes === "") ? "" : ", ") + (user1.uid===nowUser.uid? "You" : user1.displayName);
                    }
                });
            }

        }

        let pageId = ($.mobile.activePage.attr("id") === "myposts") ? "mm" : "am";
        $('#badge-like-'+pageId+'-'+postIdKey).attr('title', (likes==="" ? '' : 'likes by ' + likes));

    });


}

// **************************************
// Count the number of likes for the post
// ***************************************
function countLikes(userLikes)   {
    let numLikes = 0;
    let likeList = [];
    if (typeof userLikes==='undefined' || userLikes===null || userLikes==='')    {
        //console.log("no likes");
        numLikes = 0;
    } else {
        likeList = userLikes.split(',').filter(Boolean);
        numLikes = Object.keys(likeList).length;
        //console.log("has "+numLikes+" likes");
    }
    return numLikes;

}

// **************************************************
// Check if current logged in user has like the post
// *************************************************
function userHasLikeIcon(thisUser, usersLike) {
    let like_icon = 'ui-btn ui-btn-icon-notext ui-block-a ui-btn-like ui-icon-like-no';

    if (typeof usersLike!='undefined' && usersLike!=null) {
        if (usersLike.includes(thisUser))    {
            like_icon = 'ui-btn ui-btn-icon-notext ui-block-a ui-btn-like ui-icon-like-yes';
        }
    }
    return like_icon;
}


function getQueryUser(userID)   {
    allUserRef.forEach( (user1) =>  {
       if (user1.uid === userID)    {
           return user1;
       }
    });
    return false;
}
