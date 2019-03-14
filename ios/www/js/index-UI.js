// Create Carusel slide thing. Works on IOS and Android and BB 10
// Need to test on BB 7 and WP8


 jQuery.fn.doesExist = function(){
        return jQuery(this).length > 0;
 };
 
 function setOnline(){
	  $('#offRadarMsg1').hide();
	 $('#onRadarMsg1').show();
	 $('#offRadarMsg').hide();
	 
	 goOnline();
 }
 
 function setOffline(){
	 $('#onRadarMsg').hide();
	 $('#offRadarMsg1').show();
	 $('#offRadarMsg').show();
	 
	 goOffline();
 }
 
function RemovePeople(){
	$('#people').empty();
}
 
function SlideThing(id,slides){
	
				// Create if dont exist
				///if(!$('#'+id).doesExist())
					$('#people').append($('<div class="swipeview" id="'+id+'"></div>'));
				
				var	carousel,
                    el,
                    i,
                    page;
                
                var target = $('#'+id).get()[0];
                carousel = new SwipeView( target, {
                    numberOfPages: slides.length,
                    hastyPageFlip: true
                });
                
                // Load initial data
                for (i=0; i<3; i++) {
                    page = i==0 ? slides.length-1 : i-1;
                
                    el = document.createElement('span');
                    el.innerHTML = slides[page];
                    carousel.masterPages[i].appendChild(el)
                }
                
                carousel.onFlip(function () {
                    var el,
                        upcoming,
                        i;
                
                    for (i=0; i<3; i++) {
                        upcoming = carousel.masterPages[i].dataset.upcomingPageIndex;
                
                        if (upcoming != carousel.masterPages[i].dataset.pageIndex) {
                            el = carousel.masterPages[i].querySelector('span');
                            el.innerHTML = slides[upcoming];
                        }
                    }
                });
			}
			
			
			
	function addPerson(id,name,distnum,hoursago,vibe){
		
		var newPerson = 
		'<div id="'+id+'" class="person"><div class="contact-head">'+
					'<div class="profilePic"></div><div class="name">Anil Ramlochan</div><a href="tel:'+id+'"><div class="call"></div></a><a href="sms:'+id+'?body=test"><div class="sms"></div></a></div>'+
				'<div class="contact-body"><div class="dist"><div class ="dist-num">7</div><div class="dist-measurement"></div>'+
					'</div><div class="checkin"><div class="hoursago">0.5</div></div><div class="vibe"></div></div></div>';
			
		$("#people").append($(newPerson));
		$("#"+id +" .name").text(name);	
		$("#"+id +" .dist-num").text(distnum);	
		$("#"+id +" .hoursago").text(hoursago);
		
		
		var thing = $("#"+id +" .vibe");
		// Set Vibe here	
		if(vibe ==1 || vibe==-1)
		{
			thing.addClass("vbeers");
		}
		else if (vibe==2)
		{
			thing.addClass("vfishing");
			
		}
		else if (vibe==3)
		{
			thing.addClass("vbbq");
		}
		else if (vibe==4)
		{
			thing.addClass("vallNight");
		}
		else if (vibe==5)
		{
			thing.addClass("vBatandBall");
		}
		else if (vibe==6)
		{
			thing.addClass("vBeach");
		}
		else if (vibe==7)
		{
			thing.addClass("vCards");
		}
		else if (vibe==8)
		{
			thing.addClass("vCasino");
		}
		else if (vibe==9)
		{
			thing.addClass("vCook");
		}
		else if (vibe==10)
		{
			thing.addClass("vFete");
		}
		else if (vibe==11)
		{
			thing.addClass("vFood");
		}
		else if (vibe==12)
		{
			thing.addClass("vGame");
		}
		else if (vibe==13)
		{
			thing.addClass("vGirls");
		}
		else if (vibe==14)
		{
			thing.addClass("vMovies");
		}
		else if (vibe==15)
		{
			thing.addClass("vRiver");
		}
		else if (vibe==16)
		{
			thing.addClass("vRum");
		}
		else if (vibe==17)
		{
			thing.addClass("vShopping");
		}
		else if (vibe==18)
		{
			thing.addClass("vSweat");
		}
		
		
		
		setTimeout(function(){$(".name").fitToWidth();},100);
		setTimeout(function(){$(".hoursago").fitToWidth();},100);
		setTimeout(function(){$(".dist-num").fitToWidth();},100);
	}
	
	/*
1	Beers'in	NULL
2	Fishing	NULL
3	BBQ	NULL
4	All Night	NULL
5	Bat and Ball	NULL
6	Beach	NULL
7	Cards	NULL
8	Casino	NULL
9	Cook	NULL
10	Fete	NULL
11	Food	NULL
12	Game	NULL
13	Girls Lime	NULL
14	Movies	NULL
15	River	NULL
16	Rum	NULL
17	Shopping	NULL
18	Sweat	NULL
NULL	NULL	NULL
	*/
	
function setUIOffline(){
	$("#offRadarMsg").show();
	$("#people").hide();
	
}

function setUIOnline(){
	$("#offRadarMsg").hide();
	$("#people").show();
	
}


function selectStatus(stat){
	var per = "13%";
	
	if(stat == 1){per="58%";}
	else if(stat==2){per="100%";}
	
	
	$(".sliderbtn").width(per);
}

function OpenSelectVibes(){
	
}
	
	
			
			$.fn.fitToWidth=function(){
    $(this).wrapInner("<span style='display:inline;font:inherit;white-space:inherit;'></span>").each(function(){
        var $t=$(this);
        var a=$t.outerWidth(),
            $s=$t.children("span"),
            f=parseFloat($t.css("font-size"));
        while($t.children("span").outerWidth() > a) $t.css("font-size",--f);
        $t.html($s.html());
    });
}