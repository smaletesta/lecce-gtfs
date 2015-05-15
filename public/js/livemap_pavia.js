$(document).ready(function(){

function get_random_color() 
{
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) 
    {
       color += letters[Math.round(Math.random() * 15)];
    }
return color;
}



   L.Icon.Label = L.Icon.extend({
	createIcon: function () {
		return this._createLabel(L.Icon.prototype.createIcon.call(this));
	},
	createShadow: function () {
		if (!this.options.shadowUrl) {
			return null;
		}
		var shadow = L.Icon.prototype.createShadow.call(this);
		//need to reposition the shadow
		if (shadow) {
			shadow.style.marginLeft = (-this.options.wrapperAnchor.x) + 'px';
			shadow.style.marginTop = (-this.options.wrapperAnchor.y) + 'px';
		}
		return shadow;
	},



	_createLabel: function (img) {
		if (!this._labelTextIsSet()) {
			return img;
		}

		var wrapper = document.createElement('div'),
			label = document.createElement('span');

		// set up wrapper anchor
		wrapper.style.marginLeft = (-this.options.wrapperAnchor.x) + 'px';
		wrapper.style.marginTop = (-this.options.wrapperAnchor.y) + 'px';

		wrapper.className = 'leaflet-marker-icon-wrapper leaflet-zoom-animated';

		// set up label
		label.className = 'leaflet-marker-iconlabel ' + this.options.labelClassName;

		label.innerHTML = this.options.labelText;

		label.style.marginLeft = this.options.labelAnchor.x + 'px';
		label.style.marginTop = this.options.labelAnchor.y + 'px';

		if (this._labelHidden) {
			label.style.display = 'none';
			// Ensure that the pointer cursor shows
			img.style.cursor = 'pointer';
		}

		//reset icons margins (as super makes them -ve)
		img.style.marginLeft = this.options.iconAnchor.x + 'px';
		img.style.marginTop = this.options.iconAnchor.y + 'px';

		wrapper.appendChild(img);
		wrapper.appendChild(label);

		return wrapper;
	},

	_labelTextIsSet: function () {
		return typeof this.options.labelText !== 'undefined' && this.options.labelText !== null;
	}
});
L.Icon.Default.imagePath='images';
L.Icon.Label.Default = L.Icon.Label.extend({
	options: {
		//This is the top left position of the label within the wrapper. By default it will display at the right
		//middle position of the default icon. x = width of icon + padding
		//If the icon height is greater than the label height you will need to set the y value.
		//y = (icon height - label height) / 2

		labelAnchor: new L.Point(0, 40),

       
		//This is the position of the wrapper div. Use this to position icon + label relative to the Lat/Lng.
		//By default the point of the default icon is anchor
		wrapperAnchor: new L.Point(10, 41),

		//This is now the top left position of the icon within the wrapper.
		//If the label height is greater than the icon you will need to set the y value.
		//y = (label height - icon height) / 2
		iconAnchor: new L.Point(0, 20),

		//label's text component, if this is null the element will not be created
		labelText: null,

		/* From L.Icon.Default */
		iconUrl: L.Icon.Default.imagePath + '/bus_20x20.png',
		iconSize: new L.Point(20, 20),
		popupAnchor: new L.Point(0, -20),

		shadowUrl: null,
		shadowSize: new L.Point(41, 41)
	}
});




	var cloudmadeUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
	var cloudmadeAttribution = '<a href="http://www.ulmapi.de">UlmApi.de</a>, Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; MapQuest, Adapted by @Piersoft from GTFS by @SimoneCortesi';
	var cloudmade = new 	L.TileLayer(
		cloudmadeUrl, {
		maxZoom : 18,
		attribution : cloudmadeAttribution
	});

	var map = new L.Map('map', {
		center : new L.LatLng(45.1901,9.1647),
		zoom : 13,
		layers : [ cloudmade ],
		zoomControl : true
	});
	

	var StationIcon = L.Icon.extend({options:{
	    iconUrl: 'images/busstop.png',
	    shadowUrl: null,
	    shadowSize: new L.Point(0,0),
	    iconSize: new L.Point(22, 29),
	    iconAnchor: new L.Point(10, 14),
	    popupAnchor: new L.Point(0,-11)
	}});



	var BusIcon = L.Icon.extend({options:{
	    iconUrl: 'images/bus_20x20.png',
	    shadowUrl: null,
	    shadowSize: new L.Point(0,0),
	    iconSize: new L.Point(20, 20),
	    iconAnchor: new L.Point(10, 10),
	    popupAnchor: new L.Point(0,-10)
	}});
	
	var TramIcon = L.Icon.extend({options:{
	    iconUrl: 'images/tram_20x20.png',
	    shadowUrl: null,
	    shadowSize: new L.Point(0,0),
	    iconSize: new L.Point(20, 20),
	    iconAnchor: new L.Point(10,10),
	    popupAnchor: new L.Point(0,-10)
	}});
	
	var hIcon = new StationIcon();
	var bIcon = new BusIcon();
	var tIcon = new TramIcon();
	
	
	var nulls = function(i) {
		return (i < 10) ? i = '0' + i : i;
	};

	var getOffset = function(d) {
		/* summertime for italy, 2011 */
		if ((d.getUTCMonth() == 3 && d.getUTCDate() >= 27) ||
			(d.getUTCMonth() == 10 && d.getUTCDate() <= 30) || 
			(d.getUTCMonth() > 3 && d.getUTCMonth() < 10))
		    return 2;
		else 
		    return 1;
	}

	window.setInterval(function() {		
		var d = new Date();
		var offset = getOffset(d);

		var hrs = nulls((d.getUTCHours() + offset) % 24);
		var mins = nulls(d.getUTCMinutes());
		var secs = nulls(d.getUTCSeconds());

		$("#clock").html(hrs + ':' + mins + ':' + secs);
	}, 1000);


	/* is it a service free period= */
	var d = new Date();
	var offset = getOffset(d);
	if (
		(((d.getUTCHours() + offset) % 24) >= 23 && d.getUTCMinutes() > 30) || 
		(((d.getUTCHours() + offset) % 24)) < 6){
		$("#warning").show();
	}	
	
	var stopsLayer;
	var shapeLayers = {};
	var trips = {};
	
	$.ajax({
	  url: '/data/trips',
		  success: function(data) {
		  	trips = data;		  
		}

	});
	
	$.ajax({
	  url: '/data/stops',
		  success: function(data) {

			  L.geoJson(data, {
					pointToLayer: function(f, latlng) { return new L.Marker(latlng, {icon : L.divIcon({ className : 'circle',
                                         iconSize : [ 5, 5 ]}) }).bindPopup('<b>'+f.properties.stop_name+'</b><br>'); }
			  }).addTo(map);  
		  }
	});	

	$.ajax({
	  url: '/data/shapes',
		  success: function(data) {
		  var myStyle = {};
		  
		  	for(var i in data){
myStyle = {
    "color": get_random_color() ,
    "weight": 5,
    "opacity": 0.65
};
			  	if (data.hasOwnProperty(i)) {

			  		L.geoJson(data[i], {
					
style: myStyle
				  }).addTo(map); 
			  	}
		  	}
		}

	});
	

	
	var socket = io.connect('/');

	var knownTrips = {};

	
	var delayedMoveMarker = function(delay, trip, lat, lon){
		var marker = knownTrips[trip];
		setTimeout(function(){
			if(lat === 0 && lon === 0){
				map.removeLayer(marker);
				delete knownTrips[trip];
			}
			else{
				marker.setLatLng(new L.LatLng(lat, lon));
			}
		},delay);
	};


	/* event simulator, throws an event every 10 secs. */
	socket.on('event', function (data) {
		for(var trip in data){
			if(data.hasOwnProperty(trip)){
				var newMarker = false;
				if(!knownTrips[trip]){
					var popup;


var markerIcon = bIcon;
			
		if(trips && trips[trip]){
						popup = "<b>Bus: "+trips[trip].route_short_name+"</b><br>"+trips[trip].route_long_name;
						//bus or tram?
						markerIcon = (trips[trip].route_type == "0" ? tIcon : bIcon);
					}
					else{
						console.dir(trips);
					}

knownTrips[trip] = new L.Marker(new L.LatLng(data[trip][0][1], data[trip][0][0]), {icon : new L.Icon.Label.Default({ labelText:trips[trip].route_short_name })});
//knownTrips[trip] = new L.Marker(new L.LatLng(data[trip][0][1], data[trip][0][0]), {icon : markerIcon});
					knownTrips[trip].bindPopup(popup || trip);
					newMarker = true;
				}	
				for(var i = 0;i<data[trip].length;i++){
					delayedMoveMarker(1000*i, trip, data[trip][i][1], data[trip][i][0]);
				}
				if(newMarker){
					map.addLayer(knownTrips[trip]);	
				}				
			}
		}
	});
	
	if (window.location.hash === '#fullscreen') {
		removeTopbar();
	}
});


function removeTopbar() {
  document.querySelector('div.topbar').remove();
}