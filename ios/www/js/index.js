/*
This JS file should not contain any UI specific functions
 */
 
 window.localStorage.setItem("status", 0);
 
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


//"http://anil-pc/phonegapservice/";
//"http://linkmygps.com:808/";

var data;
var serviceUrl = "http://linkmygps.com:808/";
var inFront = true;
var online = true;
errCount = 0;
var theOptions = { maximumAge: 0, enableHighAccuracy: true, timeout: 15000, desiredAccuracy:10, maxWait:8000 };
var vibe = "0";
var getVar;
var animate = true;

///////////// Load and Setup
function loadLR(){
	
	$("#getPin").click(getPin);
	$("#setPin").click(setPin);
	
	document.addEventListener("pause", onBack, false);
    document.addEventListener("resume", onFront, false);
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);
	
	$(".off").bind('touchend',clickOff);
	$(".friends").bind('touchend',clickFriends);
	$(".public").on('touchend',clickPublic);
	
	$(".vibeBtn").on('touchstart',function(e){$("#vibeBtnBack").width("80%");});
	$(".vibeBtn").on('touchend',function(e){$("#vibeBtnBack").width("100%");vibeclicked(); });
	
	$(".profilebtn").on('touchstart',function(e){$("#profileBtnBack").width("80%");});
	$(".profilebtn").on('touchend',function(e){$("#profileBtnBack").width("100%");profileClicked();});
	
	$(".aboutBtn").on('touchstart',function(e){$("#aboutBtnBack").width("80%");});
	$(".aboutBtn").on('touchend',function(e){$("#aboutBtnBack").width("100%");aboutBtnClicked();});
	$("#aboutBox1").on('touchend',function(e){aboutClose();});
	
	$("#saveProfileBtnBack .saveBtn").on('touchstart',function(e){$("#saveProfileBtnBack").width("80%");});
	$("#saveProfileBtnBack .saveBtn").on('touchend',function(e){$("#saveProfileBtnBack").width("100%"); profileSaved();});
	
	$(".setBtn").on('touchend',function(e){$("#body").css({left:250});});
	
	$(".popInner div").on('touchend',function(e){
		vibeSelected(e.target.id.substring(1)); 
		 var $elemId = $(this).attr("id");
		 
		 $(".popInner div").removeClass("vibeSelected");
    	 $(this).addClass("vibeSelected");
		});
	
	$('#selVibe').bind('webkitAnimationEnd', function () {
                if($("#selVibe").css("opacity")=="0"){
					$("#selVibe").hide();
					$("#selVibe").removeClass("fade-out");
					$("#selVibe").addClass("fade-in"); 
				}
            });
	
	$('#editProfile').bind('webkitAnimationEnd', function () {
                if($("#editProfile").css("opacity")=="0"){
					$("#editProfile").hide();
					$("#editProfile").removeClass("fade-out");
					$("#editProfile").addClass("fade-in"); 
				}
            });
	
	$('#aboutBox1').bind('webkitAnimationEnd', function () {
                if($("#aboutBox1").css("opacity")=="0"){
					$("#aboutBox1").hide();
					$("#aboutBox1").removeClass("fade-out");
					$("#aboutBox1").addClass("fade-in"); 
				}
            });
			
			
			
	// Need to set last vibe at start up
	
	var _phnum = window.localStorage.getItem("phonenumber");
	var _reg = window.localStorage.getItem("registered");
	
	if(_reg != "true")
	{
		showRegistration();
		$("#phonenumber").val(_phnum);
	}
	else{
		
		runLR();
	}
}

function runLR(){
	var _onlineStat = window.localStorage.getItem("stat");
	
	if(_onlineStat == 1){
		setUIOffline();
	}
	else
	{
		force();
	}
	
}


///////////////////////////////////////// GPS and update Service ///////////////////////////////////
		
function runner() {
	//testContacts();
}

function run() {
    navigator.geolocation.getCurrentPosition(checkIn, fail, theOptions);
}

function doButtons() {
    if (inFront) {
        var friends = window.localStorage.getItem("lastButtons");
        getLastInfo();
		createButtons($.parseJSON(friends).Trackers);
        
    }
}

function force() {
	var _reg = window.localStorage.getItem("registered");
	
	
	if(_reg != "true")
	{
		showRegistration();
		$("#phonenumber").val(_phnum);
	}
	else{
		
		clearInterval(getVar);
		run();
		getVar = setInterval(run, 60000);
	}
	
}

function checkIn(position) {                          // Grab coordinates object from the Position object passed into success callback.
    var coords = position.coords;
    var date = new Date();
    var str = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

    //window.localStorage.setItem("lastPos", str + " " + coords.latitude + "," + coords.longitude);
	

    if (online) {
        var deviceId = "" + GetDeviceId();
		var heading = coords.heading;
		
		if(isNaN(heading) || heading == null){
			heading =0;
		}

	   $.ajax({
			type: "POST",
			url: serviceUrl + "Default.aspx/CheckIn",
			data: "{'phnum':'"+deviceId+"','lat':'"+coords.latitude+"','lon':'"+coords.longitude+"','heading':'"+heading+"', 'speed':'"+coords.speed+"','time':'"+coords.timestamp+"'}",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (json) {
				
				getLimers();
						
			}
		 });
    }
}

function getLimers()
{
	var deviceId = "" + GetDeviceId();
	$.ajax({
		type: "POST",
		url: serviceUrl + "Default.aspx/GetLimersAround",
		data: "{'distance':'"+2+"','id':'"+deviceId+"'}",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		success: function (json) {
			
			data=json;
			createCards($.parseJSON(json.d).Trackers);
		}
	 });
}

/// Online/Offline/Networking Management

function goNetworking(){
	setSettings(0,2,"");
}

function goOnline(){
	setSettings(0,2,"");
	//force();
}

function goOffline(){
	setSettings(0,1,"");
	//checkStatus();
}

function checkStatus(){
	var status = window.localStorage.getItem("stat");
	
	if(status == 2)
		force();
	else
		clearInterval(getVar);
}

function setSettings(vibe,stat,message){
	var phnum = window.localStorage.getItem("phonenumber");
	
	 $.ajax({
			type: "POST",
			url: serviceUrl + "Default.aspx/SetSettings",
			data: "{'vibe':'"+vibe+"','stat':'"+stat+"','message':'"+message+"','phonenumber':'"+_phnum+"'}",
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			success: function (json) {
				if(json.d==true){
					window.localStorage.setItem("vibe",vibe);
					window.localStorage.setItem("stat",stat);
					window.localStorage.setItem("message",message);
	
				}
				else
				{
					// not too sure we want to prompt everytime an update did not go through?
					navigator.notification.alert("There was an issue saving your data to the server. Please restart app and ensure there's an Internet connection",null,"LimeR","Ok");
				}
			}
	 });
	
	
}


/// Card/Person Management

function debugConsole(message){
	var date = new Date();
	var nmessage = ">>>"+ date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "---" +message;
	$("#debugConsole").append($("<label >"+nmessage+"</label><br/>"));
}

function createCards(trackers) {
	
    if (trackers.length != 0) {
        $("#people").empty();
        for (index = 0; index < trackers.length; index++) {
            var number = trackers[index].Id;
            var name = trackers[index].Name;
            var lastCheckIn = trackers[index].LastUpdate;
            var distance = Math.round(trackers[index].Distance);
			var message = trackers[index].Message;
			var vibe = trackers[index].Vibe;
			var hourspassed = trackers[index].HoursPassed;
			
			addPerson(number,name,distance,hourspassed,vibe);

        }
    }
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
   
    var currId = window.localStorage.getItem("phonenumber");
   
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
	checkStatus();
}

function fail(e) {
    displayError('Can\'t retrieve position.\nError: ' + e);
    //document.getElementById('points').setAttribute('value', 'Can\'t retrieve position.\nError: ' + e);
}

/// Manage app 

function onFront() {
    inFront = true;
    force();
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
	force();
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


////////////////////////////// Access Contacts/////////////////

function testContacts(){
	
 var doptions = new ContactFindOptions();
		doptions.filter = "4930775";
		doptions.multiple = true;
		var fields = ["name","photos","phoneNumbers"];
		navigator.contacts.find(fields, onSuccess, onError, doptions);
		
}

function onSuccess(contacts) {
	
		for (var i = 0; i < 3; i++) {
			alert("Display Name = " + contacts[i].name.givenName);
			//if (contacts[i].photos.length>0) {
//				alert(contacts[i].photos[0].value);
//				$("#people").append($("<img width='62' src='"+contacts[i].photos[0].value+"'></img>"));
//			}
			
			alert(contacts[i].phoneNumbers[0].value);
			
			
		}
}
			
function onError(contactError) {
	alert('onError!');
}


// Registration

function getPin(){
	var _phonenumber = $("#phonenumber").val();
	
	if(!isPhValid(_phonenumber))
	{
		navigator.notification.alert("Information Entered is Invalid",null,"LimeR","Ok");
	}
	else{
		 $.ajax({
					type: "POST",
					url: serviceUrl + "Default.aspx/RegisterUser",
					data: "{'phonenumber':'"+_phonenumber+"'}",
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					success: function (json) {
						if(json.d==true){
							navigator.notification.alert("PIN sent successfully! You should recieve it shortly. If not re-check phone number",
							null,"LimeR","Ok");
							// Save data 
							window.localStorage.setItem("phonenumber",_phonenumber);
							window.localStorage.setItem("registered","false");
						}
						else
						{
							navigator.notification.alert(
							"We're sorry, there seems to be some issue, please try again later. You can email us at limer@auratechtt.com",null,"LimeR","Ok");
							// Save data 
							window.localStorage.setItem("phonenumber",_phonenumber);
							window.localStorage.setItem("registered","false");
						}
					}
		 });
	}
}

function setPin(){
	var _fname = $("#fname").val();
	var _lname = $("#lname").val();
	var _phonenumber = $("#phonenumber").val();
	var _pass = $("#pin").val();
	
	if(_fname =="" || _lname=="" || !isPhValid(_phonenumber))
	{
		navigator.notification.alert("Information Entered is Invalid",null,"LimeR","Ok");
	}
	else{
		 $.ajax({
					type: "POST",
					url: serviceUrl + "Default.aspx/RegisterUser2",
					data: "{'fname':'"+_fname+"','lname':'"+_lname+"','phonenumber':'"+_phonenumber+"','passcode':'"+_pass+"'}",
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					success: function (json) {
						if(json.d==true){
							navigator.notification.alert("LimeR registered successfully!",
							null,"LimeR","Ok");
							
							// Save data 
							window.localStorage.setItem("phonenumber",_phonenumber);
							window.localStorage.setItem("registered","true");
							hideRegistration();
							loadLR();
							
						}
						else
						{
							navigator.notification.alert(
							"We're sorry, there seems to be some issue, please re-check your validation code or  please try again later. You can email us at limer@auratechtt.com",null,"LimeR","Ok");
							
							// Save data 
							window.localStorage.setItem("phonenumber",_phonenumber);
							window.localStorage.setItem("registered","false");
						}
					}
		 });
	}
}

function isPhValid(phnumber){
	return phnumber.replace(/ /g,'').length == 10 && $.isNumeric(phnumber);
}

function isRegistered(){
	var phonenumber = window.localStorage.getItem("phonenumber");
	var registered = window.localStorage.getItem("registered");
	
	var registered = phonenumber !=null && registered;
	return registered;
}

function showRegistration(){
	$("#Registration").show();
}

function hideRegistration(){
	$("#Registration").hide();
}

// Status Click Management



function clickOff(){
	selectStatus(0);
}


function clickFriends(){
	selectStatus(1);
}

function clickPublic(){
	selectStatus(2);
}

function vibeclicked(){
	$("#selVibe").show();
}

function vibeSelected(id){
	
	if(id != null || !isNaN(id) ){
		$("#selVibe").removeClass("fade-in");
		$("#selVibe").addClass("fade-out");
		
		window.localStorage.setItem("selectedVibe",id);
		setVibe();
	}
	
}

function setVibe(){
	
	var _phonenumber = window.localStorage.getItem("phonenumber");
	var _vibe = window.localStorage.getItem("selectedVibe");
	
		 $.ajax({
					type: "POST",
					url: serviceUrl + "Default.aspx/SetVibe",
					data: "{'vibe':'"+_vibe+"','phonenumber':'"+_phonenumber+"'}",
					contentType: "application/json; charset=utf-8",
					dataType: "json",
					success: function (json) {
						if(json.d==true){
						
							
						}
						else
						{
						}
					}
		 });
}

function profileClicked(){
	$("#editProfile").show();
}

function profileSaved(){
	$("#editProfile").removeClass("fade-in");
	$("#editProfile").addClass("fade-out");
}


function aboutBtnClicked(){
	$("#aboutBox1").show();
}

function aboutClose(){
	$("#aboutBox1").removeClass("fade-in");
	$("#aboutBox1").addClass("fade-out");
}


