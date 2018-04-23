$(window).on("load", function (e) {
	initialize();
});

var _mcController = null;

$(document).ready(function() {

	_mcController = mcController();

	var siteid      = $('#tx_staddressmap_addresslist_pageid').html();
	var ajaxtypenum = $('#tx_staddressmap_addresslist_ajaxtypenum').html();

	$('.tx_staddressmap_select').change(function(){
		var tablefield = this.id.split('_');

		$.get('index.php?id='+siteid+'&type='+ajaxtypenum+'&ts='+Date.parse(new Date()) + new Date().getMilliseconds(),{
			cid:  $('#tx_staddressmap_cid').val(),
			hmac: $('#tx_staddressmap_cidhmac').val(),
			t: 	  tablefield[3],
			v: 	  $('#'+this.id).val()
		},
		function(data){
			$('#tx_staddressmap_addresslist_'+$('#tx_staddressmap_cid').val()).html(data);
			show_marker(0);
		});


		$('.tx_staddressmap_select').not(this).each(
			function(index,element) {
				element.selectedIndex = 0;
			}
		);

		$('.tx_staddressmap_input').val('');

	});

	$('.tx_staddressmap_input').keypress(function(e){
		if(e.which == 13){
			var tablefield = this.id.split('_');

			$.get('index.php?id='+siteid+'&type='+ajaxtypenum+'&ts='+Date.parse(new Date()) + new Date().getMilliseconds(),{
				cid: 	$('#tx_staddressmap_cid').val(),
				hmac: 	$('#tx_staddressmap_cidhmac').val(),
				t: 		tablefield[3],
				v: 		$('#'+this.id).val()
			},
			function(data){
				$('#tx_staddressmap_addresslist_'+$('#tx_staddressmap_cid').val()).html(data);
				show_marker(0);
			});


			$('.tx_staddressmap_select').not(this).each(
				function(index,element) {
					element.selectedIndex = 0;
				}
			);

			$('.tx_staddressmap_select').each(
				function(index,element) {
					element.selectedIndex = 0;
				}
			);
		}
	});

	$('.tx_staddressmap_input').focus(function() {
		$('.tx_staddressmap_input').not(this).val('');
		$('.tx_staddressmap_select').each(
			function(index,element) {
				element.selectedIndex = 0;
			}
		);
	})

	if($('#tx_staddressmap_seeatstart').val() == 1) {
		$.get('index.php?id='+siteid+'&type='+ajaxtypenum+'&ts='+Date.parse(new Date()) + new Date().getMilliseconds(),{
			cid: 	$('#tx_staddressmap_cid').val(),
			hmac: 	$('#tx_staddressmap_cidhmac').val(),
			t: 		'1',
			v: 		$('#'+this.id).val(),
			all:	1
		},
		function(data){
			$('#tx_staddressmap_addresslist_'+$('#tx_staddressmap_cid').val()).html(data);
			// setTimeout(function(){ show_marker(0); },10);
			show_marker(0);
		});
	}

	if($('.tx_staddressmap_submit').length > 0) {
		$('.tx_staddressmap_submit').click(function() {
			tablefield = $('.tx_staddressmap_input[value!=""]').attr('id').split('_');
			$.get('index.php?id='+siteid+'&type='+ajaxtypenum+'&ts='+Date.parse(new Date()) + new Date().getMilliseconds(),{
				cid: 	$('#tx_staddressmap_cid').val(),
				hmac: 	$('#tx_staddressmap_cidhmac').val(),
				t: 		tablefield[3],
				v: 		$('.tx_staddressmap_input[value!=""]').val()
			},
			function(data){
				$('#tx_staddressmap_addresslist_'+$('#tx_staddressmap_cid').val()).html(data);
				show_marker(0);
			});

			$('.tx_staddressmap_select').not(this).each(
				function(index,element) {
					element.selectedIndex = 0;
				}
			);

			$('.tx_staddressmap_select').each(
				function(index,element) {
					element.selectedIndex = 0;
				}
			);
		});
	}
});

function mcController() {
	var self = {
		ref : null,
		options : {
			gridSize : 60,
			maxZoom : 10,
			styles : [
				{ url: '../fileadmin/templates/_net/img/marker.png', height: 50,width: 50, textColor: '#ffffff' },
				{ url: '../fileadmin/templates/_net/img/marker.png', height: 50,width: 50, textColor: '#ffffff' },
				{ url: '../fileadmin/templates/_net/img/marker.png', height: 50,width: 50, textColor: '#ffffff' }
			]
		},
		init : function() {
		},
		setMarker : function(_marker, _map) {
			if(!_noclusterer) {
				self.ref = new MarkerClusterer(_map, _marker, self.options);
			}
		}
	};
	self.init();
	return {
		setMarker : self.setMarker
	}
}

function is_array(value) {
	if (typeof value === 'object' && value && value instanceof Array) {
		return true;
	}
	return false;
}

function str_replace(s, r, c) {
	if (is_array(s)) {
		for(i=0; i < s.length; i++) {
			c = c.split(s[i]).join(r[i]);
		}
	}
	else {
		c = c.split(s).join(r);
	}
	return c;
}

var infowindow;
(function(){
	google.maps.Map.prototype.markers = new Array();

	google.maps.Map.prototype.addMarker = function(marker){
		this.markers[this.markers.length] = marker;
	};

	google.maps.Map.prototype.getMarkers = function(){
		return this.markers
	};

	google.maps.Map.prototype.clearMarkers = function(){
		if (infowindow) {
			infowindow.close();
		}

		for (var i = 0; i < this.markers.length; i++) {
			this.markers[i].setMap(null);
		}
	};
})();

function createMarker(name, latlng){
	name = str_replace(new Array("|-|","-|-","tx_addressmap_replace"), new Array("'",'"','<a'), name);
	var marker = new google.maps.Marker({
		position: latlng,
		map: map,
		icon: icon
	});
	
	
	google.maps.event.addListener(marker, "click", function(){
		if (infowindow)
			infowindow.close();
		infowindow = new google.maps.InfoWindow({
			content: $( '#'+name ).html()
		});
		infowindow.open(map, marker);
	});
	return marker;
}

function show_marker(id){
	if(id=='-1') {
		return;
	}
	map.clearMarkers();
	if(circle != null) circle.setMap(null);
	if(circledata) circle = new google.maps.Circle(circledata);

	var _markers = [];
	var $addresslist_items = $('.tx_staddressmap_addresslist_item');

	if(marker.length > 0) {
		map.setCenter(new google.maps.LatLng(centerpoints[id].lat, centerpoints[id].lng));
		map.setZoom(detailzoom[id]);
		for (var i = 0; i < marker[id].length; i++) {
			var latlng = new google.maps.LatLng(marker[id][i].lat, marker[id][i].lng);
			_markers.push(createMarker($addresslist_items.eq(i).html(), latlng));
			if( _noclusterer ) map.addMarker(createMarker(marker[id][i].name, latlng));
			while (map.getBounds().contains(latlng) == false) map.setZoom(--detailzoom[id]);
		}
		_mcController.setMarker(_markers, map);
	}
}



