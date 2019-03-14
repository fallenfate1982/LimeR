/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

///////////////////////////////////////// GPS and update Service ///////////////////////////////////
var inFront = true;
var online = true;
errCount = 0;
var theOptions = { maximumAge: 0, enableHighAccuracy: true, timeout: 15000, desiredAccuracy:10, maxWait:8000 };
var vibe = "0";
var getVar;
var animate = true;



function runner() {
    document.addEventListener("pause", onBack, false);
    document.addEventListener("resume", onFront, false);
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);
    $("#selVibe").change(onVibeChange);
    displayError("Welcome to Lime Radar Beta -1","Very Early Beta!");
    SetDeviceId();// To be replaced with SMS Wizard thingy
    
}

function run() {
    
    navigator.geolocation.getAccurateCurrentPosition(win, fail, theOptions);
}

function doButtons() {
    if (inFront) {
        var friends = window.localStorage.getItem("lastButtons");
        createButtons($.parseJSON(friends).Trackers);
        getLastInfo();
    }
}

function force() {
    navigator.geolocation.getAccurateCurrentPosition(win, fail, theOptions);
}


function win(position) {                          // Grab coordinates object from the Position object passed into success callback.
    var coords = position.coords;
    var date = new Date();
    var str = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    window.localStorage.setItem("lastPos", str + " " + coords.latitude + "," + coords.longitude);

    if (online) {
        var deviceId = "" + GetDeviceId();
        //"http://zord.auratechtt.com:8099/default.aspx"
        // http://fallenfate-pc:22736/default.aspx
        $.get(
            "http://zord.auratechtt.com:8099/default.aspx",
           {
               id: deviceId,
               lat: coords.latitude,
               lon: coords.longitude,
               alt: coords.altitude,
               accu: coords.altitudeAccuracy,
               head: coords.heading,
               speed: coords.speed,
               time: coords.timestamp
           },
           function (data) {
               var json_parsed = $.parseJSON(data);
               window.localStorage.setItem("lastButtons", data);

               if (json_parsed.Trackers) {
                   window.localStorage.setItem("lastPosSucc", str + " " + coords.latitude + "," + coords.longitude);
                   doButtons();
               }
           }
       );
    }

}

function createButtons(trackers) {
    if (trackers.length != 0) {
        $("#contTrackers").empty();
        for (index = 0; index < trackers.length; index++) {
            var number = trackers[index].Id;
            var name = trackers[index].Name;
            var lastCheckIn = trackers[index].LastUpdate;
            var distance = Math.round(trackers[index].Distance);

            var str = " <span class = 'limerName'> " + name + "</span><br/><span>" + number + "</number><br/>  Distance: <span class='limerDistance'>" + distance + "km</span><br/>Last Check in: <span class ='limerLastDate'>" + lastCheckIn + "</span><br/>";


           
            var callButton = $('<a class="callbutton ui-btn-right ui-btn ui-shadow ui-btn-corner-all ui-btn-icon-left ui-btn-up-a" id = "' + number + '"> <span style="font-size:12px;" class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">Call</span><span class="ui-icon ui-icon-gear ui-icon-shadow">&nbsp;</span></span></a>').attr("href", "tel:" + number);
            var innerbutton = $('<span>' + str + '</span>').append(callButton);
            var button = $("<div class=\"ui-bar ui-bar-e\"></div>").append(innerbutton);

            $("#contTrackers").append(button);
        }
    }

    //       navigator.notification.alert(
    //    'You are the winner!',  // message
    //    alertDismissed,         // callback
    //    'Game Over',            // title
    //    'Done'                  // buttonName
    //);

    //       navigator.notification.beep(2);
    //       navigator.notification.vibrate(2500);
}

function displayError(message,details) {
    errCount +=1;
    var newDiv = "<div id=\"err" + errCount + "\" class=\"ui-bar errorbox\">" +
			"<h3 style=\"display:inline-block; width:92%; margin-top:5px;\">"+message+"</h3><div style=\"display:inline-block; width:8%; margin-top:0px; text-align:right;\"><a href=\"#\" onclick=\"closethis('err"+errCount+"'); return false;\" data-role=\"button\" data-icon=\"delete\" data-inline=\"true\" data-iconpos=\"notext\" data-corners=\"true\" data-shadow=\"true\" data-iconshadow=\"true\" data-wrapperels=\"span\" data-theme=\"e\" title=\"Dismiss\" class=\"ui-btn ui-shadow ui-btn-corner-all ui-btn-inline ui-btn-icon-notext ui-btn-up-e\">" +
                "<span class=\"ui-btn-inner ui-btn-corner-all\"><span class=\"ui-btn-text\">Dismiss</span><span class=\"ui-icon ui-icon-delete ui-icon-shadow\">&nbsp;</span></span>" +
            "</a></div><p style=\"font-size:85%; margin:-.3em 0 1em;\">"+details+"</p>" +
      "</div>";

    $("#errors").append(newDiv);
}

///////////////////////////////////UI Changers//////////////////////



/////////// Helper Methods////////////////////////////////////
function showAbout() {
	if(animate)
    	$("#aboutBox").show("fast").fadeIn("fast");
	else
		$("#aboutBox").show();
		
		
}

function hideAbout() {
	if(animate)
    	$("#aboutBox").hide("fast").fadeOut("fast");
	else 
		$("#aboutBox").hide();
}

function showDebug() {
	if(animate) $("#debugInfo").slideToggle();
	else $("#debugInfo").show();

}

function showSettings() {
    if(animate) $("#settings").slideToggle();
	else $("#settings").hide();
}
function closethis(errId) {
    $("#" + errId).hide();
}
function SetDeviceId() {
    var currId = window.localStorage.getItem("deviceId");

    if (currId == null) {
        currId = prompt("Enter full phone number eg 18683387036", "");
    }

    if (currId != null) {
        window.localStorage.setItem("deviceId", currId);
    }
    $("#lblDeviceId").text(currId);
}

function ChangeDeviceID() {
    var currId = window.localStorage.getItem("deviceId");

    currId = prompt("Enter full phone number eg 18683387036", currId);

    if (currId != null) {
        window.localStorage.setItem("deviceId", currId);
    }
    $("#lblDeviceId").text(currId);
}

function ChangeDistance() {
    var currDst = window.localStorage.getItem("Distance");

    currDst = prompt("Enter Proxmity in Km", currDst);

    if (currDst != null) {
        window.localStorage.setItem("Distance", currDst);
    }
}

function GetDeviceId() {
   
    var currId = window.localStorage.getItem("deviceId");
   
    return currId;
}

function getLastInfo() {

    if (inFront) {
        var lastPos = window.localStorage.getItem("lastPos");
        var lastSucc = window.localStorage.getItem("lastPosSucc");

        $("#lblLasPos").text("Last Position Tried:" + lastPos);
        $("#lblLasSucc").text("Last Position Success:" + lastSucc);
    }
}


function alertDismissed() {
    // do something
}

////////////////////////////////////Events///////////////////////////////////////////////


function onVibeChange() {
    var number = $("#selVibe").val();
   
    if (number != 0) {
        run();
        getVar = setInterval(run, 60000);
    } else {
        clearInterval(getVar);
        //set server to 0 as well so that its offline
        // if you have not checked in for more than 3 hours on server, set to 0
        // need to also set indicator for ppl with older check in times
    }
}

function fail(e) {
    displayError('Can\'t retrieve position.\nError: ' + e);
    //document.getElementById('points').setAttribute('value', 'Can\'t retrieve position.\nError: ' + e);
}

function onFront() {
    inFront = true;
    doButtons();
}

function onBack() {
    inFront = false;
}

function onOffline() {
    online = false;
    $("#lblStatus").text("Offline");
}

function onOnline() {
    online = true;
    $("#lblStatus").text("Online - ");
}


///////////////// Catch back key on BB///////////////////////////////////////
blackberry.system.event.onHardwareKey(blackberry.system.event.KEY_BACK, function () {
    //keep your code here
    //alert("back key pressed");
    //For example..
    //if you want to navigate to particular page(say previous.html) on back button,you can use
    //window.location.replace("previous.html");
    //you can also use
    //history.back(); // To navigate to previous page as per page navigation.     
    blackberry.app.requestBackground();
    return false;
});



