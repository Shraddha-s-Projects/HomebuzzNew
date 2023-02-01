"use strict";
var $ = jQuery.noConflict();
var imagestemplate = null;
var googlemapsidlehandlerto = null;
var gmappop = true;

var mapStyles = [{ "featureType": "road", "elementType": "labels", "stylers": [{ "visibility": "simplified" }, { "lightness": 20 }] }
    , { "featureType": "administrative.land_parcel", "elementType": "all", "stylers": [{ "visibility": "on" }] }
    , { "featureType": "landscape.man_made", "elementType": "all", "stylers": [{ "visibility": "on" }] }
    , { "featureType": "transit", "elementType": "all", "stylers": [{ "saturation": -100 }, { "visibility": "on" }, { "lightness": 10 }] }
    , { "featureType": "road.local", "elementType": "all", "stylers": [{ "visibility": "on" }] }
    , { "featureType": "road.local", "elementType": "all", "stylers": [{ "visibility": "on" }] }
    , { "featureType": "road.highway", "elementType": "labels", "stylers": [{ "visibility": "simplified" }] }
    , { "featureType": "poi", "elementType": "labels", "stylers": [{ "visibility": "on" }] }
    , { "featureType": "road.arterial", "elementType": "labels", "stylers": [{ "visibility": "on" }, { "lightness": 50 }] }
    , { "featureType": "water", "elementType": "all", "stylers": [{ "hue": "#a1cdfc" }, { "saturation": 30 }, { "lightness": 49 }] }
    , { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "hue": "#f49935" }] }
    , { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "hue": "#fad959" }] }
    , { "featureType": 'road.highway', "elementType": 'all', "stylers": [{ hue: '#dddbd7' }, { "saturation": -92 }, { "lightness": 60 }, { "visibility": 'on' }] }
    , { "featureType": 'landscape.natural', "elementType": 'all', "stylers": [{ hue: '#c8c6c3' }, { "saturation": -71 }, { "lightness": -18 }, { "visibility": 'on' }] }
    , { "featureType": 'poi', "elementType": 'all', "stylers": [{ hue: '#d9d5cd' }, { "saturation": -70 }, { "lightness": 20 }, { "visibility": 'off' }] }];

// Set map height to 100% ----------------------------------------------------------------------------------------------


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Homepage map - Google
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var jsonMapPath;
var vbmap = {
    gmap: null,
    newMarkers: [],
    newMarkersIdx: [],
    markerClicked: 0,
    activeMarker: false,
    lastClicked: false,
    markerCluster: [],
    getmapdatato: null,
    visibleArray: [],
    json: null,
    createHomepageGoogleMap: function (_latitude, _longitude) {
        // $.get("/scripts/3dparty/viewbid/_infobox.js", function () {
        gmappop = true;
        gMap(_latitude, _longitude);
        //   });
        function gMap(_latitude, _longitude, zoom) {
            console.log('gMap');
            // if (zoom == null) { zoom = 15; }

            if (zoom == null) {
                if (vbmap.gmap) {
                    zoom = vbmap.gmap.zoom;
                } else if (Lockr.get('zoom')) {
                    zoom = Lockr.get('zoom');
                } else {
                    zoom = 19;
                }
            }


            var mapCenter = new google.maps.LatLng(_latitude, _longitude);
            var mapOptions = {
                zoom: zoom,
                minZoom: 15, maxZoom: 20,
                center: mapCenter,
                disableDefaultUI: true,
                scrollwheel: false,
                fullscreenControl: false,
                //fullscreenControlOptions: {
                //    //    style: google.maps.fullscreenControlStyle.LARGE,
                //    position: google.maps.ControlPosition.RIGHT_BOTTOM
                //},
                //styles: mapStyles,
                //mapTypeControlOptions: {
                //    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                //    position: google.maps.ControlPosition.BOTTOM_CENTER
                //},
                gestureHandling: 'greedy', //'cooperative',
                panControl: false,
                zoomControl: false//,
                //zoomControlOptions: {
                //    style: google.maps.ZoomControlStyle.LARGE,
                //    position: google.maps.ControlPosition.RIGHT_BOTTOM
                //}
            };
            var mapElement = document.getElementById('map');
            vbmap.gmap = new google.maps.Map(mapElement, mapOptions);

            if (vbmap.gmap.customcontrols != true) {
                var mapcontrolDiv = $("#map-controls");
                mapcontrolDiv.index = 1;
                try {
                    myinitZoomControl(vbmap.gmap);
                    myinitFullscreenControl(vbmap.gmap);
                    myinitMapTypeControl(vbmap.gmap);
                } catch (e) {

                }
                vbmap.gmap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(mapcontrolDiv[0]);


                var mapcontrolscale = $("<div class='scale'><span class='title'></span><span class='bar' ><span class='left'>0</span><span  class='center'>15</span><span class='right'>30</span></span></div>");
                mapcontrolscale.index = 1;
                vbmap.gmap.controls[google.maps.ControlPosition.BOTTOM_LEFT].clear();
                vbmap.gmap.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(mapcontrolscale[0]);

                vbmap.gmap.customcontrols = true;

                var googlemapsidlehandlerto;
                console.log('google.maps.event.addListener idle');

                google.maps.event.addListener(vbmap.gmap, 'idle', function () {
                    console.log('google.maps idle');
                    clearTimeout(googlemapsidlehandlerto);
                    googlemapsidlehandlerto = setTimeout(vbmap.googlemapsidlehandler, 300);
                    return;
                });
            }
            console.log('map-controls');
            // mapcontrolDiv.show();

            //  $("#map-control-div").off('click').on('click', '.map-control-ui', function () { alert($(this).html()); });


            //vbmap = map;
            vbmap.gmap.zoom = zoom;
            vbmap.json = null;

            setTimeout(function () {
                console.log('load map');
                gmappop = true;
                vbmap.populate();
            }, 1500);



            //if (json) {
            //    loadjson(json);
            //}

            // Close infobox property tile after click on map --------------------------------------------------------------------------------

            google.maps.event.addListener(vbmap.gmap, 'click', function (e) {
                console.log('google.maps.event.addListener click map');
                $("#location").blur();

                // debugger;
                //if (vbmap.activeMarker != false && vbmap.lastClicked != false) {
                //    if (vbmap.markerClicked == 1) {
                //        console.log('google.maps.event.addListener click vbmap.markerClicked=1 ');
                //        vbmap.activeMarker.infobox.open(vbmap.gmap);
                //        // event.preventDefault();
                //        vbmap.activeMarker.infobox.setOptions({ boxClass: 'fade-in-marker' });
                //        vbmap.activeMarker.content.className = 'marker-active marker-loaded';
                //        //vbmap.markerClicked = 0;
                //        //    return;
                //    } else {
                //        console.log('google.maps.event.addListener click vbmap.markerClicked=0 ');
                //        vbmap.markerClicked = 0;
                //        vbmap.activeMarker.infobox.setOptions({ boxClass: 'fade-out-marker' });
                //        vbmap.activeMarker.content.className = 'marker-loaded';
                //        setTimeout(function () {
                //            vbmap.activeMarker.infobox.close();
                //        }, 350);
                //    }
                //    // vbmap.markerClicked = 0;
                //}
                //if (vbmap.activeMarker != false) {
                //    console.log('google.maps.event.addListener click set vbmap.markerClicked ');
                //    google.maps.event.addListener(vbmap.activeMarker, 'click', function () {
                //        vbmap.markerClicked = 1;
                //        //  event.preventDefault();
                //        //  return;
                //    });
                //}


                //reverse lookup
                //  if (vbmap.markerClicked==0 ){
                console.log(event);
                if ($(event.srcElement).closest('.infobox').length == 0 && 1 == 0) { //prompt to save new address

                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ 'location': e.latLng }, function (results, status) {
                        if (status === 'OK') {
                            if (results[0]) {
                                //map.setZoom(11);
                                //var marker = new google.maps.Marker({
                                //    position: latlng,
                                //    map: map
                                //});
                                //infowindow.setContent(results[0].formatted_address);
                                //infowindow.open(map, marker);
                                //      console.log(JSON.stringify(results[0]));
                                // if (results[0].types[0] == 'street_address' || results[0].types[0] == 'subpremise') {
                                var place = results[0];
                                place.geometry.lat = place.geometry.location.lat();
                                place.geometry.lng = place.geometry.location.lng();
                                lastplace = place;
                                toastr.success(place.formatted_address + "<br/><br/><a class='nt-block nt-pull-right' style='font-size:0.8em; font-weight:normal;' onclick='vbmap.placesave();return false;'>Save</a><br/>", { timeOut: 3000 });
                                // }


                            } else {
                                toastr.error('No results found', { timeOut: 3000 });
                            }
                        } else {
                            toastr.error('Geocoder failed due to: ' + status, { timeOut: 10000 });
                        }


                    });

                }
                //     }

                //return true;
                //vbmap.markerClicked = 0;
            });


            // Dynamic loading markers and data from JSON ----------------------------------------------------------------------
            console.log('google.maps.event.addListener zoom_changed');
            vbmap.gmap.addListener('zoom_changed', function () {
                gmappop = true;
                //vbmap.populate();
                // console.log('google.maps zoom_changed');
                //if (vbmap.getmapdatato) {
                //    clearTimeout(vbmap.getmapdatato);
                //}
                //vbmap.getmapdatato = setTimeout(vbmap.getmapdata, 300);
                //console.log(vbmap.gmap.zoom);
            });

            console.log('google.maps.event.addListener center_changed');
            vbmap.gmap.addListener('center_changed', function () {
                gmappop = true;
                //vbmap.populate();
                //  console.log('google.maps center_changed');
                //if (vbmap.getmapdatato) {
                //    clearTimeout(vbmap.getmapdatato);
                //}
                //vbmap.getmapdatato = setTimeout(vbmap.getmapdata, 300);
            });



            //redrawMap('google', map);

            // Geolocation of user -----------------------------------------------------------------------------------------
            $('.geolocation').on("click", function () {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(success);
                } else {
                    toastr.error("Your location cannot be determined!", { timeOut: 5000 });
                    console.log('Geo Location is not supported');
                }
            });


            // Autocomplete address ----------------------------------------------------------------------------------------

            vbmap.addressfinder($('#location'), vbmap.gmap);


        }
    },

    getmapdata: function () {

        if (gmappop == true) {
            console.log('gmap populate');
            gmappop = false;
        } else {
            return;
        }

        if (vbmap.gmap) {
            Lockr.set('latitude', vbmap.gmap.getCenter().lat());
            Lockr.set('longitude', vbmap.gmap.getCenter().lng());
            Lockr.set('zoom', vbmap.gmap.zoom);
        }

        Lockr.set('location', $("#location").val());

        var path = '/map/viewbid/?swlat=' + vbmap.gmap.getBounds().getSouthWest().lat() + '&nelat=' + vbmap.gmap.getBounds().getNorthEast().lat() + '&swlng=' + vbmap.gmap.getBounds().getSouthWest().lng() + '&nelng=' + vbmap.gmap.getBounds().getNorthEast().lng();
        console.log('get map data');
        console.log(vbmap.gmap.getBounds());



        if (jsonMapPath != path) {
            jsonMapPath = path;

            $.getJSON(jsonMapPath)
                .done(function (njson) {
                    console.log('load locations from server');
                    console.log(njson);
                    //gMap(vbmap.gmap.getCenter().lat(), vbmap.gmap.getCenter().lng(), njson, zoom);
                    vbmap.loadjson(njson);

                    //plugininit();

                    clearTimeout(googlemapsidlehandlerto);
                    googlemapsidlehandlerto = setTimeout(vbmap.googlemapsidlehandler, 50);

                    //vbmap.googlemapsidlehandler();
                })
                .fail(function (jqxhr, textStatus, error) {
                    console.log(error);
                });
        } else {
            clearTimeout(googlemapsidlehandlerto);
            googlemapsidlehandlerto = setTimeout(vbmap.googlemapsidlehandler, 50);
            //vbmap.googlemapsidlehandler();
        }
    }

    ,

    populate: function (delay) {
        if (delay == null) {
            delay = 200;
        }
        clearTimeout(vbmap.getmapdatato);
        vbmap.getmapdatato = setTimeout(vbmap.getmapdata, delay);
        //  getmapdata();

    },
    repaintmarkers: function () {
        $.each(vbmap.newMarkers, function (k) {
            $(vbmap.newMarkers[k].content).addClass('marker-loaded');
        });
    },

    success: function (position) {

        console.log('success');
        var locationCenter = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        vbmap.setCenter(locationCenter);
        //map.setZoom(vbmap.zoom);

        var markerContent = document.createElement('DIV');
        markerContent.innerHTML =
            '<div class="map-marker">' +
            '<div class="icon">' +
            '</div>' +
            '</div>';

        // Create marker on the map and draw interest circles ------------------------------------------------------------------------------------

        var marker = new RichMarker({
            position: locationCenter,
            map: vbmap,
            draggable: false,
            content: markerContent,
            flat: true
        });

        marker.content.className = '';

        $(marker.content).addClass('marker-loaded');

        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            "latLng": locationCenter
        }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var lat = results[0].geometry.location.lat(),
                    lng = results[0].geometry.location.lng(),
                    placeName = results[0].address_components[0].long_name,
                    latlng = new google.maps.LatLng(lat, lng);

                $("#location").val(results[0].formatted_address);

                console.log(results[0].formatted_address);

                //alert(results[0].formatted_address);
            }
        });

    }
    ,

    processvisible: function () {
        console.log('reset vbmap.visibleArray');
        console.log(vbmap.gmap.getBounds());

        vbmap.adjustia(); //clear;


        vbmap.visibleArray = [];
        // console.log(vbmap.json.data);
        for (var i = 0; i < vbmap.newMarkers.length; i++) {
            if (vbmap.gmap.getBounds().contains(vbmap.newMarkers[i].getPosition())) {
                vbmap.visibleArray.push(vbmap.newMarkers[i]);
                var k = vbmap.visibleArray.length - 1
                //setTimeout(function () {
                //    vbmap.newMarkers[i].setMap(vbmap);
                //    vbmap.newMarkers[i].content.className += 'bounce-animation marker-loaded';
                //    vbmap.newMarkers[i].content.className += 'marker-loaded';
                //    vbmap.markerCluster.repaint();
                //}, 1000 + ( i * 30 ));
                //  $.each(vbmap.visibleArray, function (k) {
                //    setTimeout(function () {
                //    if (vbmap.gmap.getBounds().contains(vbmap.visibleArray[k].getPosition())) {
                //  if (!vbmap.visibleArray[k].content.className) {
                vbmap.visibleArray[k].setMap(vbmap.gmap);

                if (vbmap.visibleArray[k].interest === undefined) {

                    var maxviewers = 28;
                    var opacity = vbmap.visibleArray[k].views / maxviewers;
                    if (opacity > 0.5) {
                        opacity = 0.5;
                    }
                    var pos = vbmap.visibleArray[k].getPosition();

                    var interest = new google.maps.Circle({
                        strokeColor: '#1E90FF',
                        strokeOpacity: opacity / 2,
                        strokeWeight: 1,
                        fillColor: '#1E90FF',
                        fillOpacity: opacity,
                        map: null,
                        center: pos,
                        radius: 5 //Math.sqrt(vbmap.newMarkers[i].views) * 4
                    });

                    var interest2 = new google.maps.Circle({
                        strokeColor: '#1E90FF',
                        strokeOpacity: opacity / 6,
                        strokeWeight: 1,
                        fillColor: '#1E90FF',
                        fillOpacity: opacity / 3,
                        map: null,
                        center: pos,
                        radius: 10
                    });

                    var interest3 = new google.maps.Circle({
                        strokeColor: '#1E90FF',
                        strokeOpacity: opacity / 8,
                        strokeWeight: 1,
                        fillColor: '#1E90FF',
                        fillOpacity: opacity / 4,
                        map: null,
                        center: pos,
                        radius: 50
                    });

                    var interest4 = new google.maps.Circle({
                        strokeColor: '#1E90FF',
                        strokeOpacity: opacity / 10,
                        strokeWeight: 1,
                        fillColor: '#1E90FF',
                        fillOpacity: opacity / 5,
                        map: null,
                        center: pos,
                        radius: 100
                    });

                    var interest5 = new google.maps.Circle({
                        strokeColor: '#1E90FF',
                        strokeOpacity: opacity / 12,
                        strokeWeight: 1,
                        fillColor: '#1E90FF',
                        fillOpacity: opacity / 6,
                        map: null,
                        center: pos,
                        radius: 100
                    });

                    var interest6 = new google.maps.Circle({
                        strokeColor: '#1E90FF',
                        strokeOpacity: opacity / 24,
                        strokeWeight: 1,
                        fillColor: '#1E90FF',
                        fillOpacity: opacity / 12,
                        map: null,
                        center: pos,
                        radius: 200
                    });

                    var ia = [interest, interest2, interest3, interest4, interest5, interest6];

                    vbmap.visibleArray[k].interest = ia;
                }

                $(vbmap.visibleArray[k].content).addClass('bounce-animation marker-loaded');

                vbmap.visibleArray[k].content.className += 'bounce-animation marker-loaded';

                //     }
                //     }
                //     }, 200 + (k * 30));
                //    });
            } else {
                vbmap.newMarkers[i].content.className = '';
                vbmap.newMarkers[i].setMap(null);
            }
        }

        setTimeout(function () { vbmap.adjustia(1); }, 500);

    }
    ,

    googlemapsidlehandler: function () {
        //debugger;
        //  if (vbmap.json) {
        if (gmappop != true) {

            //vbmap.zoom = vbmap.getZoom();
            //console.log('zoom set');
            //console.log(vbmap.zoom);


            vbmap.processvisible();

            //try {
            //    vbmap.markerCluster.repaint();
            //} catch (e) {

            //}


            var visibleItemsArray = [];
            console.log(vbmap.gmap.getBounds());
            $.each(vbmap.json.data, function (a) {
                if (vbmap.gmap.getBounds().contains(new google.maps.LatLng(vbmap.json.data[a].latitude, vbmap.json.data[a].longitude))) {
                    //  if (visibleItemsArray.length < 10) {
                    var category = vbmap.json.data[a].category;
                    vbmap.pushItemsToArray(vbmap.json.data, a, category, visibleItemsArray);

                    //  }
                }
            });



            // Create list of items in Results sidebar ---------------------------------------------------------------------

            $('.items-list .results').html(visibleItemsArray);
            var msg;
            if (visibleItemsArray.length == 1) {
                msg = '1 Home in area for sale and viewed';
            } else {
                msg = visibleItemsArray.length + ' Homes in area for sale and viewed';
            }
            $(".results-counter span").html(msg);
            //if (place != null) {
            //    Lockr.set('vicinity', place.vicinity);
            //    $(".results-address span").html(place.vicinity);
            //}
            //$(".results-address span").html('');

            // Check if images are cached, so will not be loaded again

            $.each(vbmap.json.data, function (a) {
                if (vbmap.gmap.getBounds().contains(new google.maps.LatLng(vbmap.json.data[a].latitude, vbmap.json.data[a].longitude))) {
                    vbmap.is_cached(vbmap.json.data[a].gallery[0], a);
                }
            });

            // Call Rating function----------------------------------------------------------------------------------------

            //rating('.results .item');

            var $singleItem = $('.results li'); //$('.results .item');
            $singleItem.hover(
                function () {

                    var locid = $(this).attr('data-locid');
                    //debugger;
                    $.ajax({ url: '/viewbid/view/' + locid, dataType: 'json' })

                    var idx = vbmap.newMarkersIdx.indexOf(Number(locid));
                    vbmap.newMarkers[idx].content.className = 'marker-active marker-loaded';
                },
                function () {

                    var locid = $(this).attr('data-locid');
                    var idx = vbmap.newMarkersIdx.indexOf(Number(locid));
                    vbmap.newMarkers[idx].content.className = 'marker-loaded';
                    //vbmap.newMarkers[$(this).attr('id') - 1].content.className = 'marker-loaded';
                }
            );


            //redrawMap('google', map);
            //vbmap.json = null; //done processing data into arrays
            plugininit();
            $('[data-toggle="tooltip"]:not(.ttbound)').tooltip().addClass('ttbound');


            try {
                vbmap.markerCluster.repaint();
            } catch (e) {

            }

        } else {
            console.log('vbmap.populate');
            vbmap.populate();
        }


        vbmap.repaintmarkers();
    }


    ,

    is_cached: function (src, a) {
        var image = new Image();
        var loadedImage = $('.results li #' + vbmap.json.data[a].id + ' .image');
        image.src = src;
        if (image.complete) {
            $(".results").each(function () {
                loadedImage.removeClass('loading');
                loadedImage.addClass('loaded');
            });
        }
        else {
            $(".results").each(function () {
                $('.results li #' + vbmap.json.data[a].id + ' .image').addClass('loading');
            });
            $(image).load(function () {
                loadedImage.removeClass('loading');
                loadedImage.addClass('loaded');
            });
        }
    }

    ,

    loadjson: function (data) {
        vbmap.json = data;
        //  debugger

        var j = vbmap.newMarkers.length - 1;

        for (var i = 0; i < vbmap.json.data.length; i++) {

            // debugger;
            if (vbmap.newMarkersIdx.indexOf(vbmap.json.data[i].id) == -1) {
                // Google map marker content -----------------------------------------------------------------------------------


                var color;
                if (vbmap.json.data[i].color) {
                    color = vbmap.json.data[i].color;
                } else {
                    color = '';
                }

                var markerContent = document.createElement('DIV');
                //debugger;

                var featured = '';
                if (vbmap.json.data[i].featured == 1) {
                    featured = 'featured '
                }

                markerContent.innerHTML =
                    '<div class="map-marker ' + featured + vbmap.json.data[i].color + '">' +
                    '<div class="icon ' + vbmap.json.data[i].type_icon + '">' +
                    '<i>' + vbmap.json.data[i].views + '</i>' +
                    //    '<img src="' + json.data[i].type_icon + '">' +
                    '</div>' +
                    '</div>';


                // Create marker on the map ------------------------------------------------------------------------------------

                var marker = new RichMarker({
                    position: new google.maps.LatLng(vbmap.json.data[i].latitude, vbmap.json.data[i].longitude),
                    map: vbmap.gmap,
                    //id: json.data[i].id,
                    draggable: false,
                    content: markerContent,
                    //animation: google.maps.Animation.DROP,
                    flat: true
                });

                marker.id = vbmap.json.data[i].id;
                marker.owner = vbmap.json.data[i].owner;
                marker.bids = vbmap.json.data[i].bids;
                marker.views = vbmap.json.data[i].views;

                j++;

                vbmap.newMarkers.push(marker);

                // Create infobox for marker -----------------------------------------------------------------------------------

                var infoboxContent = document.createElement("div");
                var infoboxOptions = {
                    content: infoboxContent,
                    disableAutoPan: false,
                    pixelOffset: new google.maps.Size(-18, -42),
                    zIndex: null,
                    alignBottom: true,
                    boxClass: "infobox",
                    pane: "floatPane",
                    enableEventPropagation: true,
                    closeBoxMargin: "0px 0px -30px 0px",
                    closeBoxURL: "/owner/img/close.png",
                    infoBoxClearance: new google.maps.Size(1, 1)
                };

                // Infobox HTML element ----------------------------------------------------------------------------------------

                var category = vbmap.json.data[i].category;
                infoboxContent.innerHTML = vbmap.drawInfobox(category, infoboxContent, vbmap.json.data, i);

                // Create new markers ------------------------------------------------------------------------------------------
                vbmap.newMarkers[j].infobox = new InfoBox(infoboxOptions);
                //  debugger
                // Show infobox after click ------------------------------------------------------------------------------------


                //      google.maps.event.addListener(marker, 'click', (function (marker, j) {
                google.maps.event.addListener(vbmap.newMarkers[j], 'click', function () {
                    //       alert('test');
                    console.log('marker click');
                    console.log(j);
                    console.log(this);
                    event.preventDefault(); //neotek
                    event.stopImmediatePropagation(); //neotek
                    event.stopPropagation(); //neotek

                    vbmap.lastClicked = this;

                    $.ajax({ url: '/viewbid/view/' + vbmap.lastClicked.id, dataType: 'json' })

                    //           return function () {
                    //google.maps.event.addListener(vbmap.gmap, 'click', function () {
                    //    vbmap.lastClicked = vbmap.newMarkers[j];
                    //    event.preventDefault();

                    //    console.log('vbmap.lastClicked ' + j);
                    //});
                    if (vbmap.activeMarker != vbmap.lastClicked) {

                        vbmap.activeMarker = vbmap.lastClicked;

                        //for (var h = 0; h < vbmap.newMarkers.length; h++) {
                        //    vbmap.newMarkers[h].content.className = 'marker-loaded';
                        //    vbmap.newMarkers[h].infobox.close();

                        //    console.log('close ' + h);
                        //}
                        vbmap.lastClicked.infobox.open(vbmap.gmap, vbmap.lastClicked);
                        vbmap.lastClicked.infobox.setOptions({ boxClass: 'fade-in-marker' });
                        // vbmap.lastClicked.content.className = 'marker-active marker-loaded';
                        vbmap.markerClicked = 1;

                        console.log('vbmap.markerClicked ' + j);
                    }
                    setTimeout(function () {
                        $('[data-toggle="tooltip"]:not(.ttbound)').tooltip().addClass('ttbound');
                        plugininit();
                    }, 50);

                    //        }
                });
                //    })(marker, j));



                // Fade infobox after close is clicked -------------------------------------------------------------------------

                //   google.maps.event.addListener(vbmap.newMarkers[j].infobox, 'closeclick', (function (marker, j) {
                google.maps.event.addListener(vbmap.newMarkers[j].infobox, 'closeclick', function () {
                    //   return function () {
                    var infobox = this;
                    console.log(this);
                    vbmap.activeMarker = null;
                    vbmap.lastClicked = null;

                    event.preventDefault(); //neotek
                    event.stopImmediatePropagation(); //neotek
                    event.stopPropagation(); //neotek

                    //infobox.content_.className = 'marker-loaded';
                    //  vbmap.newMarkers[j].content.className = 'marker-loaded';

                    infobox.setOptions({ boxClass: 'fade-out-marker' });
                    //  }
                });
                //  })(marker, j));


                google.maps.event.addDomListener(vbmap.newMarkers[j].infobox.content_, 'click', function () { //(e) {


                    //console.log(event.srcElement);
                    var bubble = true;
                    if ($(event.srcElement).hasClass('ui-numeric')) {
                        $(event.srcElement).focus();
                        bubble = false;
                    }
                    //if ($(event.srcElement).hasClass('togglesize')) {
                    //    $(this).parent().toggleClass('collapsed');
                    //    bubble = false;
                    //}
                    //if ($(event.srcElement).hasClass('onclickclaim')) {
                    //    loc.claim();
                    //    bubble = false;
                    //}
                    //if ($(event.srcElement).hasClass('onclickextend')) {
                    //    loc.extendclaim();
                    //    bubble = false;
                    //}
                    //if ($(event.srcElement).hasClass('onsubmitbid')) {
                    //    loc.bid();
                    //    bubble = false;
                    //}
                    //if ($(event.srcElement).hasClass('onclickoffer')) {
                    //    loc.offer();
                    //    bubble = false;
                    //}
                    //if ($(event.srcElement).hasClass('nobubble')) {
                    //    bubble = false;
                    //}


                    //if (bubble == false) {
                    //    event.preventDefault();
                    //    event.stopImmediatePropagation();
                    //    event.stopPropagation();
                    //}
                });

            }
        }

        // Create marker clusterer DO NOT USE - DONT WANT CLUSTERING -----------------------------------------------------------------------------------------

        var clusterStyles = [{
            //url: 'assets/img/cluster.png',
            height: 34,
            width: 34
        }];

        vbmap.markerCluster = new MarkerClusterer(vbmap.gmap, vbmap.newMarkers, { styles: clusterStyles, maxZoom: 19 });

        //not required
        //vbmap.markerCluster.onClick = function (clickedClusterIcon, sameLatitude, sameLongitude) {
        //    return multiChoice(sameLatitude, sameLongitude, json);
        //};


        //marker index
        vbmap.newMarkersIdx = vbmap.newMarkers.map(function (e) { return e.id; });

        //vbmap.adjustia( 0);

        //  vbmap.adjustia( 1); //vbmap.gmap.getZoom() - 10);
        //vbmap.adjustia( 1);

    }

    ,


    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    place: null,

    lastplace: null,

    loadplaces: function (place) {

        console.log('geo place');
        console.log(place);
        var vicinity = place.vicinity

        //var zoom = 18;//oiginal 14 high number is closer wen you search for an address
        if (place.types[0] == 'street_address' || place.types[0] == 'subpremise') {
            Lockr.set('zoom', 20);
            vbmap.gmap.setZoom(20);
            vbmap.gmap.setCenter(place.geometry.location);
            vicinity = place.name + ', ' + place.vicinity
            $('#location').val(place.formatted_address);
        }
        else if (place.types[0] == 'route') {
            Lockr.set('zoom', 17);
            vbmap.gmap.setZoom(17);
            vbmap.gmap.setCenter(place.geometry.location);
            vicinity = place.name + ', ' + place.vicinity
        }
        else if (place.geometry.viewport) {
            Lockr.set('zoom', 15);
            vbmap.gmap.setZoom(15);
            vbmap.gmap.setCenter(place.geometry.location);
            //map.fitBounds(place.geometry.viewport);
        } else {
            vbmap.gmap.setZoom(vbmap.zoom);
            vbmap.gmap.setCenter(place.geometry.location);
        }

        //marker.setPosition(place.geometry.location);
        //marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        if (place) {
            Lockr.set('latitude', place.geometry.location.lat());
            Lockr.set('longitude', place.geometry.location.lng());
            Lockr.set('location', place.formatted_address);
            Lockr.set('vicinity', vicinity);
        }

        $(".results-address span").html(Lockr.get('vicinity'));


    }
    ,
    placesave: function (place) {
        if (place == null) {
            place = lastplace;
        }
        var params = "address_full=" + place.formatted_address;
        params += "&address_type=" + place.types[0];
        if (place.geometry.lat) {
            params += "&address_lat=" + place.geometry.lat;
            params += "&address_long=" + place.geometry.lng;
        } else {
            params += "&address_lat=" + place.geometry.location.lat();
            params += "&address_long=" + place.geometry.location.lng();
        }
        for (var i = 0; i < place.address_components.length; i++) {
            if (place.address_components[i].types[0] == 'administrative_area_level_1') {//This is where States for australia get put. this is okay because most other things dont seem to get a different short name, eg auckland has the shortname auckland.
                params += "&address_" + place.address_components[i].types[0].replace(/\_/g, '') + "=" + place.address_components[i].short_name;
            } else {
                params += "&address_" + place.address_components[i].types[0].replace(/\_/g, '') + "=" + place.address_components[i].long_name;
                if (place.address_components[i].types[0] == 'country') {
                    params += "&address_countrycode=" + place.address_components[i].short_name;
                }
            }
        }

        lastplace = null;

        console.log('save geo place');
        console.log(place);
        $.ajax({
            url: '/map/save', data: params, complete: function () {

                loc._track({
                    hitType: 'event',
                    eventCategory: 'viewbid',
                    eventAction: 'save',
                    eventLabel: ''
                });

                console.log('Location Saved');

                if (vbmap.gmap === undefined || vbmap.gmap == null) {
                    console.log(place);
                    Lockr.set('latitude', place.geometry.location.lat());
                    Lockr.set('longitude', place.geometry.location.lng());
                    Lockr.set('zoom', 20);
                    Lockr.set('location', place.formatted_address);
                    Lockr.set('vicinity', place.name + ', ' + place.vicinity);
                    location.href = "/";
                } else {
                    $target = $("#page-top");
                    if ($(window).width() > 768) {
                        $('html, body').stop().animate({
                            'scrollTop': $target.offset().top - $('.navigation').height()
                        }, 2000)
                    } else {
                        $('html, body').stop().animate({
                            'scrollTop': $target.offset().top
                        }, 2000)
                    }
                    vbmap.loadplaces(place);
                }
            }
        });
    }
    ,
    addressfinder: function ($obj, map) {
        // Autocomplete address ----------------------------------------------------------------------------------------

        var input = $obj[0];


        var autocomplete = new google.maps.places.Autocomplete(input, { types: ["geocode"] });

        //$('.location').each(function (i, input) {
        //    var autocomplete = new google.maps.places.Autocomplete(input, {
        //        types: ["geocode"]
        //    });
        autocomplete.setComponentRestrictions({ 'country': ['nz'] });
        if (map) autocomplete.bindTo('bounds', map);

        google.maps.event.addListener(autocomplete, 'place_changed', function () {

            place = autocomplete.getPlace();
            if (!place.geometry) {
                return;
            }

            if (place.types[0] == 'street_address' || place.types[0] == 'subpremise') {
                vbmap.placesave(place);

            } else {
                console.log(place.types[0]);
                if (map && map !== undefined) {
                    vbmap.loadplaces(place);
                } else {



                    Lockr.set('latitude', place.geometry.location.lat());
                    Lockr.set('longitude', place.geometry.location.lng());
                    if (place.types[0] == 'route') {
                        Lockr.set('zoom', 17);
                    } else {
                        Lockr.set('zoom', 15);
                    }
                    Lockr.set('location', place.formatted_address);
                    Lockr.set('vicinity', place.name + ', ' + place.vicinity);
                    location.href = "/content/111";

                    //$obj.addClass("invalid").focus();
                    //toastr.error("Please enter a full address", { timeOut: 10000 });
                }
            }
        });


    }
    // Push items to array and create <li> element in Results sidebar ------------------------------------------------------

    //import "/scripts/3dparty/viewbid/_infobox.js";

    ,

    cloneInfobox: function (category, json, a, infobox) {
        var $clone;
        if (infobox) {
            $clone = $('.locationtemplate').clone();
        } else {
            $clone = $('.locationtemplate > div').clone();
        }

        $clone.find('.loc').attr("data-locid", json[a].id);
        $clone.find('.isnumeric').removeClass("isnumeric");
        $clone.find('.dttip').attr("data-toggle", "tooltip");

        vbmap.updateInfobox($clone, json[a])

        var bgimgurl = "url(" + json[a].gallery[0] + ")";
        //   $clone.find('.backgroundimage').prop("id", json.data[a].id);
        $clone.find('.backgroundimage').css({ "background-image": bgimgurl });
        //$clone.find('.daysremaining').text(json.data[a].daysremaining);
        //$clone.find('.bids').text(json.data[a].bids);
        //if (json.data[a].bids > 0) {
        //    $clone.find('.bids').show();
        //}
        $clone.find('.views').text("Viewers " + json[a].views);
        $clone.find('.street').text(json[a].title);
        $clone.find('.suburb').text(json[a].location);

        //if (json.data[a].owner == 1) {
        //    $clone.find('.ownerwrapper').show();
        //} else {
        //    $clone.find('.bidform').show();
        //}

        //if (json.data[a].daysremaining = 0) {
        //    $clone.find('.claimwrapper').show();
        //} else {
        //    $clone.find('.ownerwrapper').show();
        //    $clone.find('.bidform').show();
        //}

        //if (json.data[a].bid.length > 0) {
        //    var $bid = $clone.find('.bidtemplate').clone();
        //    $clone.find('.bidtemplate').hide();
        //    $bid.removeClass('bidtemplate');
        //    $clone.find('.topbids').show();

        //    for (var i = 0; i < json.data[a].bid.length; i++) {
        //        var newbid = $bid.clone();
        //        newbid.prop('data-bidderid', json.data[a].bid[i].id);
        //        newbid.text(json.data[a].bid[i].amount);
        //        $clone.find('.bidlist').append(newbid);

        //    }
        //}
        return $clone;
    }
    ,
    updateInfobox: function ($l, data) {

        $l.find('.bids').text(data.bids);
        //  if (data.bids > 0) {
        $l.find('.bids').show();
        //  }

        $l.find('.status > div').addClass(data.status);

        $l.find('.views').text('Viewers ' + data.views);
        //$l.find('.street').text(data.title);
        //$l.find('.suburb').text(data.location);

        if (data.owner == 1) {

            $l.find('.bids').text('Bids ' + data.bids);
            $l.find('.bids').addClass('ontopbids');
            //  $l.find('.bidform').hide();
            $l.find('.ownerwrapper').addClass('onclickextend');
            $l.find('.ownerwrapper .ownericon').addClass('isowner');
            $l.find('.item_specific_hover').addClass('onclickdetails');
        } else {
            //  $l.find('.bidform').show();
            $l.find('.bids').addClass('onsubmitbid');
            $l.find('.bids').text('Bid');
        }

        if (data.favourite == 1) {
            $l.find('.like').addClass('colour-red');
            $l.find('.like i').html('H');
        } else {
            $l.find('.like').removeClass('colour-red');
            $l.find('.like i').html('h');
        }

        $l.find('.imagecount').html(data.imagecount);

        if (data.price == '') {
            $l.find('.eprice').hide();
        } else {
            $l.find('.eprice').show();
            $l.find('.eprice .amount').html(data.price);
        }

        if (data.daysremaining ? data.daysremaining : 0 > 0) {
            $l.find('.daysremaining').text(data.daysremaining);
            $l.find('.daytt').attr('title', (data.owner == 1 ? 'Yours for the next' : 'Owner accepting bids next') + ' ' + (data.daysremaining) + ' days');
            $l.find('.ownerwrapper').show();
            $l.find('.claimwrapper').hide();
        } else {
            $l.find('.claimwrapper').show();
        }

        console.log('setitemspecific');
        vbmap.setitemspecific($l, data.item_specific, 'year');
        vbmap.setitemspecific($l, data.item_specific, 'bathrooms');
        vbmap.setitemspecific($l, data.item_specific, 'bedrooms');
        vbmap.setitemspecific($l, data.item_specific, 'garages');
        vbmap.setitemspecific($l, data.item_specific, 'carports');
        vbmap.setitemspecific($l, data.item_specific, 'area');

        if (data.bid.length > 0 && data.owner == 1) {
            var $bid = $l.find('.bidtemplate').clone();
            $l.find('.bidtemplate').hide();
            $bid.removeClass('bidtemplate');
            // $l.find('.topbids').show();

            for (var i = 0; i < data.bid.length; i++) {
                var newbid = $bid.clone();
                newbid.prop('data-bidderid', data.bid[i].id);
                newbid.text(data.bid[i].amount);
                $l.find('.bidlist').append(newbid);

            }
        }

    }
    ,

    setitemspecific: function ($loc, data, fieldname) {
        // console.log(fieldname + ' ' + data[fieldname]);
        if (data[fieldname]) {
            $loc.find(".item_specific ." + fieldname).html(data[fieldname]);
            $loc.find(".item_specific_hover").remove();
            $loc.find(".item_specific ." + fieldname).css('display', 'inline-block');
        } else {
            $loc.find(".item_specific ." + fieldname).hide();
        }
    },


    setitemspecificvalue: function ($loc, body, fieldname) {
        var val = $loc.find(".item_specific ." + fieldname).text();
        if (val == undefined) {
            val = '';
        }
        body = body.replace('{' + fieldname + '}', val);
        return body;
    },



    drawInfobox: function (category, infoboxContent, json, a) {

        var $clone = vbmap.cloneInfobox(category, json, a, true);
        var color = '';
        if (json[a].color) {
            color = json[a].color;
        }

        $clone.find('.infobox').addClass(color);
        // $clone.find('.loc').addClass("infobox").addClass(color);

        return $clone.html();
    }
    ,

    pushItemsToArray: function (json, a, category, visibleItemsArray) {
        var $clone = vbmap.cloneInfobox(category, json, a);
        $clone.find('.loc').prop("id", json[a].id)
        visibleItemsArray.push('<li data-locid="' + json[a].id + '">' + $clone.html() + '</li>');
    },

    addItemsToList: function (json, a, category, myArray) {
        var $clone = vbmap.cloneInfobox(category, json, a);
        $clone.find('.loc').prop("id", json[a].id)
        myArray.push('<div class="col-md-4 col-sm-6 nt-margin-bottom-10 nt-padding-left-10 nt-padding-right-0" data-locid="' + json[a].id + '">' + $clone.html() + '</div>');
    }

    ,
    adjustia: function (fillOpacity) {
        var maxviewers = 2;
        for (var i = 0; i < vbmap.visibleArray.length; i++) {
            if (vbmap.visibleArray[i].views > maxviewers) {
                maxviewers = vbmap.visibleArray[i].views;
            }
        }

        if (maxviewers % 2 == 1) {
            maxviewers++;
        }

        $('.scale .right').html(maxviewers);
        $('.scale .center').html(maxviewers / 2);


        for (var i = 0; i < vbmap.visibleArray.length; i++) {
            var views = 0
            try {
                views = vbmap.visibleArray[i].views;
                var opacity = views / maxviewers;

                vbmap.visibleArray[i].interest[0].fillOpacity = opacity;
                vbmap.visibleArray[i].interest[1].fillOpacity = opacity / (2 * fillOpacity);
                vbmap.visibleArray[i].interest[2].fillOpacity = opacity / (3 * fillOpacity * 2);
                vbmap.visibleArray[i].interest[3].fillOpacity = opacity / (4 * fillOpacity * 2);
                vbmap.visibleArray[i].interest[4].fillOpacity = opacity / (6 * fillOpacity * 2);
                vbmap.visibleArray[i].interest[5].fillOpacity = opacity / (12 * fillOpacity * 2);

                for (var j = 0; j < vbmap.visibleArray[i].interest.length; j++) {
                    vbmap.visibleArray[i].interest[j].setMap(null);
                    //console.log('remove ' + i + ' interest level ' + j);
                }

                if (fillOpacity > -1) {
                    var l = Math.floor((20 - vbmap.gmap.getZoom()) / 2);
                    var k = l + 3;
                    vbmap.visibleArray[i].interest[0].setMap(vbmap.gmap);

                    //   setTimeout(function () {
                    for (var j = l; j < k; j++) {
                        try {
                            vbmap.visibleArray[i].interest[j].setMap(vbmap.gmap);

                            //console.log('repaint ' + i + ' interest level ' + j);
                        } catch (e) {
                            console.log(i);
                            console.log(j);
                            console.log(k);
                            console.log(l);
                            console.log(e);
                        }
                    }
                    //  }, 200)

                }
            } catch (e) {
                console.log(i);
                console.log(e);
            }

        }

        console.log('adjustia done');
    }


};


function getmylocations() {
    $.getJSON('/viewbid/my/')
        .done(function (njson) {

            var PropArray = [];
            $.each(njson.owned, function (a) {
                var category = njson.owned[a].category;
                vbmap.addItemsToList(njson.owned, a, category, PropArray);

            });
            if (PropArray.length != 0) {
                $('#owned .row').html(PropArray);
            }

            PropArray = [];
            $.each(njson.bids, function (a) {
                var category = njson.bids[a].category;
                vbmap.addItemsToList(njson.bids, a, category, PropArray);

            });
            if (PropArray.length != 0) {
                $('#bids .row').html(PropArray);
            }

            PropArray = [];
            $.each(njson.favourites, function (a) {
                var category = njson.favourites[a].category;
                vbmap.addItemsToList(njson.favourites, a, category, PropArray);

            });
            if (PropArray.length != 0) {
                $('#favourites .row').html(PropArray);
            }

            PropArray = [];
            $.each(njson.recent, function (a) {
                var category = njson.recent[a].category;
                vbmap.addItemsToList(njson.recent, a, category, PropArray);

            });
            if (PropArray.length != 0) {
                $('#recent .row').html(PropArray);
            }

            plugininit();

        })
        .fail(function (jqxhr, textStatus, error) {
            console.log(error);
        });
}

function getlocations(mapProvider, map) {
    $.getJSON(jsonMapPath)
        .done(function (njson) {

            var visibleItemsArray = [];
            $.each(njson.data, function (a) {
                var category = njson.data[a].category;
                vbmap.pushItemsToArray(njson.data, a, category, visibleItemsArray);

            });

            $('.items-list .results').html(visibleItemsArray);
            plugininit();

        })
        .fail(function (jqxhr, textStatus, error) {
            console.log(error);
        });
}


function myinitZoomControl(map) {
    document.querySelector('.zoom-control-in').onclick = function () {
        map.setZoom(map.getZoom() + 1);
    };
    document.querySelector('.zoom-control-out').onclick = function () {
        map.setZoom(map.getZoom() - 1);
    };

}

function myinitMapTypeControl(map) {
    var mapTypeControlDiv = document.querySelector('.maptype-control');
    document.querySelector('.maptype-control').onclick = function () {
        console.log(mapTypeControlDiv.classList.contains('maptype-control-is-satellite'));
        if (mapTypeControlDiv.classList.contains('maptype-control-is-satellite') == true) {
            mapTypeControlDiv.classList.add('maptype-control-is-map');
            mapTypeControlDiv.classList.remove('maptype-control-is-satellite');
            map.setMapTypeId('roadmap');
        } else {
            mapTypeControlDiv.classList.remove('maptype-control-is-map');
            mapTypeControlDiv.classList.add('maptype-control-is-satellite');
            map.setMapTypeId('hybrid');
        }

    };

}

function myinitFullscreenControl(map) {
    var elementToSendFullscreen = map.getDiv().firstChild;
    var fullscreenControl = document.querySelector('.fullscreen-control');

    fullscreenControl.onclick = function () {
        if (isFullscreen(elementToSendFullscreen)) {
            exitFullscreen();
        } else {
            requestFullscreen(elementToSendFullscreen);
        }
    };

    document.onwebkitfullscreenchange =
        document.onmsfullscreenchange =
        document.onmozfullscreenchange =
        document.onfullscreenchange = function () {
            if (isFullscreen(elementToSendFullscreen)) {
                fullscreenControl.classList.add('is-fullscreen');
            } else {
                fullscreenControl.classList.remove('is-fullscreen');
            }
        };


    gmappop = true;
    vbmap.populate(500);
}

function isFullscreen(element) {
    return (document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement) == element;
}
function requestFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullScreen) {
        element.webkitRequestFullScreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullScreen) {
        element.msRequestFullScreen();
    }
}
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msCancelFullScreen) {
        document.msCancelFullScreen();
    }
}


function initmaphandler(mapProvider, map) {
    $('.map .toggle-navigation').click(function () {
        $('.map-canvas').toggleClass('results-collapsed');


        $('.map-canvas .map').one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function () {


            gmappop = true;
            //vbmap.populate();

            //if (mapProvider == 'osm') {
            //    map.invalidateSize();
            //}
            //else if (mapProvider == 'google') {
            //    google.maps.event.trigger(map, 'resize');
            //}
        });
    });


    getmylocations();

    $('body').on('click', '.topbids .togglesize', function () { $(this).parent().toggleClass('collapsed'); });
    // $('body').on('click', '.topbids .togglesize', function () { $(this).parent().find('.list').toggleClass('collapsed'); });
    $('body').on('click', '.onclicklike', loc.like);
    $('body').on('click', '.onclickstats', loc.stats);
    $('body').on('click', '.onclickimages', loc.images);
    $('body').on('click', '.onclickdetails', loc.details);
    $('body').on('click', '.onclickclaim', loc.claim);
    $('body').on('click', '.onclickextend', loc.extendclaim);
    //  $('body').on('click', 'button.onsubmitbid ', loc.bid);
    $('body').on('click', '.onsubmitbid ', loc.bid);
    $('body').on('click', '.ontopbids ', loc.bids);
    $('body').on('click', '.onclickoffer', loc.offer);
    var focusedElement;
    $('body').on('focus', '.location input', function () {
        if (focusedElement == $(this)) return; //already focused, return so user can now place cursor at specific point in input.
        focusedElement = $(this);
        setTimeout(function () { focusedElement.select(); }, 50); //select all text in any field on focus for easy re-entry. Delay sightly to allow focus to "stick" before selecting.
    });


    // addressfinder($('.addressfinder'), map);


    var swiper = new Swiper('not.swiper-container', {
        effect: 'flip',
        flipEffect: {
            rotate: 0,
            slideShadows: true,
        },
        loop: true,
        speed: 1000,
        grabCursor: true,
        pagination: {
            el: null //'.swiper-pagination',
        },
        //navigation: {
        //    nextEl: '.accept',
        //    prevEl: '.decline',
        //},
    });
    var $swipertemplate = $('.swipertemplate ').clone();
    $swipertemplate.show();
    $swipertemplate.removeClass('swipertemplate ');
    loc.swipertemplate = $swipertemplate.html()

}

var authenticated = false;

var loc = {
    to: null,
    $current: null,
    _confirm: function ($loc, message, callback) {
        if ($loc.hasClass('swipperloaded') == false) {
            console.log(loc.swipertemplate);
            var se = $loc.wrap(loc.swipertemplate).closest('.swiper-container')[0];
            $loc.addClass('swipperloaded');
            var s = new Swiper(se, {
                effect: 'flip',
                flipEffect: {
                    rotate: 0,
                    slideShadows: true,
                },
                loop: true,
                speed: 1000,
                grabCursor: false,
                pagination: {
                    el: null
                }
                , keyboard: { enabled: false }
                , mousewheel: false
                , simulateTouch: false
                , allowTouchMove: false
            });
        }

        var $swiper = $loc.closest('.swiper-container');

        var swiper = $swiper[0].swiper;
        $('.propertybackground .message .body', $swiper).html(message.body);
        if (message.className != undefined) {
            $('.propertybackground .nt-pad', $swiper).removeClass('nt-padding-10');
            $('.propertybackground .nt-pad', $swiper).addClass(message.className);
        } else {
            $('.propertybackground .nt-pad', $swiper).addClass('nt-padding-10');
        }

        loc.$current = $swiper;
        var locid = $loc.attr('data-locid');

        $('.tnumeric', $swiper).addClass("ui-numeric");
        $('.tnumeric', $swiper).addClass("loc");
        $('.tnumeric', $swiper).attr('data-locid', locid);
        $('.tnumeric', $swiper).off('change').on('change', loc._pset);

        plugininit();
        $('.decline', $swiper).off('click').on('click', function () {
            $($swiper).off('click');
            //clearTimeout(loc.to); 
            swiper.slidePrev();
            event.stopPropagation();
        });
        if (message.title == 'none') {
            $('.propertybackground .message .title', $swiper).hide();
        } else {
            $('.propertybackground .message .title', $swiper).show();
        }
        $('.propertybackground .message .title', $swiper).html(message.title);
        if (message.accepttext == null) {
            message.accepttext = 'Accept';
        }
        if (message.declinetext == null) {
            message.declinetext = 'Decline';
        }
        if (message.accepttext == 'none') {
            $('.accept', $swiper).hide();
        } else {
            $('.accept', $swiper).show();
        }
        $('.accept', $swiper).html(message.accepttext);
        if (message.accepttext == 'X') {
            $('.accept', $swiper).removeClass('min-width');
        } else {
            $('.accept', $swiper).addClass('min-width');
        }


        if (message.declinetext == 'none') {
            $('.decline', $swiper).hide();
        } else {
            $('.decline', $swiper).show();
        }
        $('.decline', $swiper).html(message.declinetext);
        $('.accept', $swiper).off('click').on('click', function () {
            if (callback($swiper)) {
                swiper.slideNext();
            }
            $($swiper).off('click');
            event.stopPropagation();
        });

        swiper.slideNext();

        //$swiper.data.swiper=swiper;
    },
    _isauthenticated: function ($loc) {
        if ($('body').hasClass('verified') == false) {

            // loc.to=setTimeout(loc._signin, 3000);
            loc._confirm($loc, { title: 'Sign in or Register', body: 'You must sign in or register to continue.', accepttext: 'Continue', declinetext: 'Back' }, function () {
                //clearTimeout(loc.to);
                loc._signin();
                //return true;
                return true;
            });

            return false;
        }
        return true
    },
    _signin: function () {
        event.stopPropagation();
        location.href = "/login";
    },
    _update: function (data) {
        console.log(data);
        console.log('loc ' + data.id);

        $('div[data-locid=' + data.id + ']').each(function (i, e) {

            var $loc = $(this);
            console.log($loc);
            vbmap.updateInfobox($loc, data);

        });

        if (data.message) {
            toastr.success(data.message + '<br/><br/><span class="nt-block nt-pull-right" style="font-size:0.8em; font-weight:normal;">Click to Close</span><br/>', null, { timeOut: 0 });
        }
    },
    claim: function () {
        event.stopPropagation();
        var $loc = $(this).first().closest('.loc');
        var locid = $loc.attr('data-locid');
        var propertyname = $loc.find('.wrapper h3').html();
        if (loc._isauthenticated($loc) == true) {
            loc._confirm($loc, {
                title: 'Claim Property'
                , body: $("#claimconfirm").html().replace('{property}', propertyname)
                //'You are about to claim ' + propertyname + '. By clicking accept you confirm that you are the owner of this property and agree to the <a href="/terms" class="dialoglink">terms</a> and <a href="/privacy" class="dialoglink">privacy policy</a>.'
            }, function () {
                $.ajax({ url: '/viewbid/claim/' + locid, dataType: 'json' }).done(function (data) {
                    loc._update(data);
                    loc._track({
                        hitType: 'event',
                        eventCategory: 'viewbid',
                        eventAction: 'claim',
                        eventLabel: ''
                    });
                });
                return true;
            });
        }
        // alert('claim ' + locid);
        return false;
    },
    _pset: function () {
        var $loc = $(this).first().closest('.loc');
        var locid = $loc.attr('data-locid');
        $.ajax({ url: '/viewbid/pset/' + $(this).attr('data-locid'), data: { value: $(this).val(), ptid: $(this).attr('ptid') }, dataType: 'json' }).done(function (data) {
            loc._update(data);
        });

    },

    stats: function () {
        event.stopPropagation();
        var $loc = $(this).first().closest('.loc');
        //loc.$current = $loc;
        var locid = $loc.attr('data-locid');
        var propertyname = $loc.find('.wrapper h3').html();
        if (loc._isauthenticated($loc) == true) {
            loc._confirm($loc, {
                title: 'none'
                , className: 'stats'
                , accepttext: 'X'
                , declinetext: 'none'
                , body: $(".statstemplate").html()
            }, function () {

                return true;
            });
            loc._track({
                hitType: 'event',
                eventCategory: 'viewbid',
                eventAction: 'stats',
                eventLabel: ''
            });

            $.ajax({ url: '/viewbid/stats/' + locid, success: mystats })

            //   loc._plotchart();
            //$.ajax({ url: '/scripts/plugins/jchart/index.html?' + locid }).done(function (data) {

            //});



        }
        // alert('claim ' + locid);
        return false;
    },

    images: function () {
        event.stopPropagation();

        if (imagestemplate == null) {
            imagestemplate = $(".imagestemplate").html();
            $(".imagestemplate").remove();
        }

        var $loc = $(this).first().closest('.loc');
        var locid = $loc.attr('data-locid');
        var propertyname = $loc.find('.wrapper h3').html();
        if (loc._isauthenticated($loc) == true) {
            //loc._confirm($loc, {
            //    title: 'none'
            //        , className: ''
            //        , accepttext: 'X'
            //        , declinetext: 'none'
            //    , body: $(".imagestemplate").html()
            //}, function () {

            //    return true;
            //});


            $.ajax({ url: '/viewbid/images/' + locid, success: myimages })



            loc._track({
                hitType: 'event',
                eventCategory: 'viewbid',
                eventAction: 'images',
                eventLabel: ''
            });


            //myimages('images loaded');
            //$.ajax({ url: '/viewbid/images/' + locid, success: myimages });
        }
        return false;
    },
    extendclaim: function () {
        event.stopPropagation();
        var $loc = $(this).first().closest('.loc');
        var locid = $loc.attr('data-locid');
        var propertyname = $loc.find('.wrapper h3').html();
        if (loc._isauthenticated($loc) == true) {
            loc._confirm($loc, {
                title: 'Extend Claim'
                , body: $("#extendconfirm").html().replace('{property}', propertyname)
                //'You confirm you would like to continue to receive bids for the next 30 days.'
                , accepttext: 'Confirm'
            }, function () {
                $.ajax({ url: '/viewbid/extend/' + locid, dataType: 'json' }).done(function (data) {
                    loc._update(data);
                    loc._track({
                        hitType: 'event',
                        eventCategory: 'viewbid',
                        eventAction: 'extend',
                        eventLabel: ''
                    });
                });
                return true;
            });
        }
        // alert('claim ' + locid);
        return false;
    },
    bid: function () {
        event.stopPropagation();
        console.log('bid');
        var $loc = $(this).first().closest('.loc');
        var locid = $loc.attr('data-locid');
        console.log(locid);
        var propertyname = $loc.find('.wrapper h3').html();
        if (loc._isauthenticated($loc) == true) {
            //$loc.find('input').removeClass('invalid');
            //var bid = $loc.find('input').val();
            //if (bid == '') {
            //    $loc.find('input').addClass('invalid').focus();
            //    return false;
            //}
            //bid = accounting.formatMoney(bid, '$', 0);
            var bid = '<input name="value" data-format="{format:\'##,###,##0\'}" data-maxvalue="99999999" data-smallincrement="10000" autocomplete="off" data-showcurrency="false"  data-increment="50000" data-largeincrement="100000"  type="text" pattern="[0-9]*" inputmode="numeric" data-toggle="tooltip" data-placement="top" title="Enter your bid" class="nt-margin-bottom-10 form-control ui-numeric bid" placeholder="Place bid"  ></input>'

            var body = $("#bidconfirm").html();
            body = body.replace('{bid}', bid);
            body = body.replace('{property}', propertyname);
            loc._confirm($loc, {
                title: 'Place Bid'
                , body: body
                //'You confirm you wish to place a bid of ' + bid + '.' + '<br/>By clicking accept you agree that you are over 18 years of age and you have read agree to the <a href="/terms" class="dialoglink">terms</a> & <a href="/privacy" class="dialoglink">privacy policy</a>.'
            }, function () {
                var bid = $loc.find('input').val();
                $.ajax({ url: '/viewbid/bid/' + locid, data: 'value=' + bid, dataType: 'json' }).done(function (data) {
                    loc._update(data);
                    loc._track({
                        hitType: 'event',
                        eventCategory: 'viewbid',
                        eventAction: 'bid',
                        eventLabel: ''
                    });
                });
                return true;
            });
        }
        return false;
    },
    bids: function () {
        event.stopPropagation();
        console.log('bids');
        var $loc = $(this).first().closest('.loc');
        var locid = $loc.attr('data-locid');
        console.log(locid);
        var propertyname = $loc.find('.wrapper h3').html();
        if (loc._isauthenticated($loc) == true) {
            //$loc.find('input').removeClass('invalid');
            //var bid = $loc.find('input').val();
            //if (bid == '') {
            //    $loc.find('input').addClass('invalid').focus();
            //    return false;
            //}
            //bid = accounting.formatMoney(bid, '$', 0);
            var body = $("#bidconfirm").html();

            var bid = '';//'<input name="value" data-format="{format:\'##,###,##0\'}" data-maxvalue="99999999" data-smallincrement="10000" autocomplete="off" data-showcurrency="false"  data-increment="50000" data-largeincrement="100000"  type="text" pattern="[0-9]*" inputmode="numeric" data-toggle="tooltip" data-placement="top" title="Enter your bid" class="form-control ui-numeric bid" placeholder="Place bid"  ></input>'

            body = body.replace('{bid}', bid);
            body = body.replace('{property}', propertyname);
            loc._confirm($loc, {
                title: 'Place Bid'
                , body: body
                //'You confirm you wish to place a bid of ' + bid + '.' + '<br/>By clicking accept you agree that you are over 18 years of age and you have read agree to the <a href="/terms" class="dialoglink">terms</a> & <a href="/privacy" class="dialoglink">privacy policy</a>.'
            }, function () {
                var bid = $loc.find('input').val();
                $.ajax({ url: '/viewbid/bid/' + locid, data: 'value=' + bid, dataType: 'json' }).done(function (data) {
                    loc._update(data);
                    loc._track({
                        hitType: 'event',
                        eventCategory: 'viewbid',
                        eventAction: 'bid',
                        eventLabel: ''
                    });
                });
                return true;
            });
        }
        return false;
    },
    like: function () {
        event.stopPropagation();
        var $loc = $(this).first().closest('.loc');
        var locid = $loc.attr('data-locid');
        var propertyname = $loc.find('.wrapper h3').html();
        if (loc._isauthenticated($loc) == true) {
            var action = 'like';
            if ($('i', this).html() == 'H') {
                action = 'unlike';
            }
            $.ajax({ url: '/viewbid/' + action + '/' + locid, dataType: 'json' }).done(function (data) {
                loc._update(data);
                loc._track({
                    hitType: 'event',
                    eventCategory: 'viewbid',
                    eventAction: 'like',
                    eventLabel: ''
                });
            });
            return true;
        }
        return false;
    },
    _plotchart: function () {
        $.ajax({ url: '/viewbid/stats/', success: mystats })
    },
    details: function () {
        event.stopPropagation();
        var $loc = $(this).first().closest('.loc');
        var locid = $loc.attr('data-locid');
        var propertyname = $loc.find('.wrapper h3').html();
        if (loc._isauthenticated($loc) == true) {
            $loc.find('input').removeClass('invalid');
            var body = $(".detailedit").html();
            body = body.replace('{property}', propertyname);
            body = vbmap.setitemspecificvalue($loc, body, 'year');
            body = vbmap.setitemspecificvalue($loc, body, 'bathrooms');
            body = vbmap.setitemspecificvalue($loc, body, 'bedrooms');
            body = vbmap.setitemspecificvalue($loc, body, 'garages');
            body = vbmap.setitemspecificvalue($loc, body, 'carports');
            body = vbmap.setitemspecificvalue($loc, body, 'area');

            loc._confirm($loc, {
                title: 'none'
                , accepttext: 'OK'
                , declinetext: 'none'
                , body: body
            }, function () {
                loc._track({
                    hitType: 'event',
                    eventCategory: 'viewbid',
                    eventAction: 'details',
                    eventLabel: ''
                });
                return true;
            });
        }
        return false;
    },
    offer: function () {
        event.stopPropagation();
        var $loc = $(this).first().closest('.loc');
        var locid = $loc.attr('data-locid');
        if (loc._isauthenticated($loc) == true) {
            var bidderid = $(this).attr('data-bidderid');

            loc._confirm($loc, {
                title: 'Discuss bid', accepttext: 'Send', declinetext: 'Back'
                , body: $("#offerconfirm").html() +
                    // 'I would like the bidder to contact me ' + 
                    '<form><input name="name" class="iownername form-control" autocomplete="off" placeholder="Your name" value="" error="You must enter your name" /> ' +
                    '<input autocomplete="off" name="contact" class="iownercontact form-control" placeholder="Phone, email, IM" error="You must provide a contact" value="" /></form>'
            }, function ($cont) {

                var ownername = '', ownercontact = ''
                    , $ownername = $("input.iownername", $cont).last(), $ownercontact = $("input.iownercontact", $cont).last();
                // var $cont = $loc.closest('.swiper-container');
                $ownername.removeClass('invalid');
                $ownercontact.removeClass('invalid');
                ownername = $ownername.val();
                ownercontact = $ownercontact.val();

                if (ownername == '' || ownername === undefined) { $ownername.addClass('invalid').focus(); return false; }
                if (ownercontact == '' || ownercontact === undefined) { $ownercontact.addClass('invalid').focus(); return false; }


                $.ajax({ url: '/viewbid/offer/' + locid, data: { bidderid: bidderid, name: ownername, contact: ownercontact }, dataType: 'json' }).done(function (data) {
                    loc._update(data);
                    loc._track({
                        hitType: 'event',
                        eventCategory: 'viewbid',
                        eventAction: 'offer',
                        eventLabel: ''
                    });
                });
                return true;
            });
        }
        return false;
    },
    _track: function (event) {
        try {
            ga('send', event);
            console.log(event);
        } catch (e) {
            console.log(e);
        }

    }

};


function myimages(data) {

    $('.allimages').remove();
    // $('body').append(imagestemplate);
    $('body').append(data);

    $('#grid-gallery').addClass("grid-gallery jgallery gslideshow");
    $('#grid-gallery .tempdz').addClass("dropzone");
    $('.allimages').off("click").on("click", ".closegallery, .grid li", function () { $('.allimages').remove(); });
    plugininit();

}



function mystats(data) {

    console.log(data);

    google.charts.load('current', { 'packages': ['corechart'] });

    //google.charts.setOnLoadCallback(drawChart1);
    //google.charts.setOnLoadCallback(drawChart2);
    //google.charts.setOnLoadCallback(drawChart3);
    //google.charts.setOnLoadCallback(drawChart4);
    //google.charts.setOnLoadCallback(drawChart5);
    //google.charts.setOnLoadCallback(drawChart6);
    google.charts.setOnLoadCallback(drawCharts);

    function drawCharts() {
        drawChart1();
        drawChart2();
        drawChart3();
        drawChart4();
        drawChart5();
        drawChart6();

        $('.loader', loc.$current).hide();
        $('.loaded', loc.$current).show();

    }

    var options = data.options;



    //function drawChart1() {

    //    // Create the data table.
    //    var d = new google.visualization.DataTable();
    //    d.addColumn('string', 'Topping');
    //    d.addColumn('number', 'Slices');
    //    d.addRows(data.charts[1].data);

    //    // Set chart options
    //    var o = JSON.parse(JSON.stringify(options));
    // //   o.title = 'Homes in your area';
    //    o.colors = ['#e0440e', '#e6693e', '#ec8f6e', '#f3b49f', '#f6c7b6'];

    //    // Instantiate and draw our chart, passing in some options.
    //    var chart = new google.visualization.PieChart($('.chart_div2', loc.$current)[1]);
    //    chart.draw(d, o);
    //}
    function drawChart1() {

        // Create the data table.
        var d = new google.visualization.DataTable();
        d.addColumn('string', 'Area');
        d.addColumn('number', 'Views');
        d.addRows(data.charts[2].data);

        // Set chart options
        var o = JSON.parse(JSON.stringify(options));
        o.title = '';
        o.height = 50;
        o.chartArea = { left: 10, top: 35, width: '90%', height: '50%' };
        o.hAxis = {};
        o.vAxis = { baseline: 'none', gridlines: { count: 0 } };

        // $('.chart3 .title').html('Views on your home').show();
        $('.dailycurrent .count').html(data.charts[2].total);

        var chart = new google.visualization.AreaChart($('.dailycurrent .img', loc.$current)[1]);
        chart.draw(d, o);
    }
    function drawChart2() {

        // Create the data table.
        var d = new google.visualization.DataTable();
        d.addColumn('string', 'Area');
        d.addColumn('number', 'Views');
        d.addRows(data.charts[3].data);

        // Set chart options
        var o = JSON.parse(JSON.stringify(options));
        o.title = '';
        o.height = 50;
        o.chartArea = { left: 10, top: 35, width: '90%', height: '50%' };
        o.hAxis = {};
        o.vAxis = { baseline: 'none', gridlines: { count: 0 } };

        // $('.chart3 .title').html('Views on your home').show();
        $('.weeklycurrent .count').html(data.charts[3].total);

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.AreaChart($('.weeklycurrent .img', loc.$current)[1]);
        chart.draw(d, o);
    }

    function drawChart3() {
        var d = new google.visualization.DataTable();
        d.addColumn('string', 'Area');
        d.addColumn('number', 'Views');
        d.addRows(data.charts[4].data);

        var o = JSON.parse(JSON.stringify(options));
        o.title = '';
        o.height = 50;
        o.chartArea = { left: 10, top: 35, width: '90%', height: '50%' };
        o.hAxis = {};
        o.vAxis = { baseline: 'none', gridlines: { count: 0 } };


        $('.dailyarea .count').html(data.charts[4].total);

        var chart = new google.visualization.AreaChart($('.dailyarea .img', loc.$current)[1]);
        chart.draw(d, o);

        //var chart = new google.visualization.AreaChart($('.chart_div7', loc.$current)[1]);
        //chart.draw(d, o);
    }

    function drawChart4() {
        var d = new google.visualization.DataTable();
        d.addColumn('string', 'Area');
        d.addColumn('number', 'Views');
        d.addRows(data.charts[5].data);

        var o = JSON.parse(JSON.stringify(options));
        o.title = '';
        o.height = 50;
        o.chartArea = { left: 10, top: 35, width: '90%', height: '50%' };
        o.hAxis = {};
        o.vAxis = { baseline: 'none', gridlines: { count: 0 } };


        $('.weeklyarea .count').html(data.charts[5].total);

        var chart = new google.visualization.AreaChart($('.weeklyarea .img', loc.$current)[1]);
        chart.draw(d, o);

        //var chart = new google.visualization.AreaChart($('.chart_div7', loc.$current)[1]);
        //chart.draw(d, o);
    }
    //function drawChart4() {

    //    // Create the d table.
    //    var d = new google.visualization.DataTable();
    //    d.addColumn('string', 'Action');
    //    d.addColumn('number', 'Count');
    //    d.addRows(data.charts[4].data);

    //    // Set chart options
    //    var o = JSON.parse(JSON.stringify(options));
    //    o.title = 'Action in your area';
    //    o.pieHole = 0.3;
    //    o.colors = ['#e0440e', '#56C300', '#005695', '#F58300'];

    //    // Instantiate and draw our chart, passing in some options.
    //    var chart = new google.visualization.PieChart($('.chart_div4', loc.$current)[1]);
    //    chart.draw(d, o);
    //}

    function drawChart5() {
        var d = new google.visualization.DataTable();
        d.addColumn('string', 'Action');
        d.addColumn('number', 'Count');
        d.addRows(data.charts[0].data);
        var o = JSON.parse(JSON.stringify(options));
        o.pieHole = 0.7;
        //o.colors = ['#e0440e', '#56C300', '#005695', '#F58300'];
        o.colors = ['#F58300', '#56C300', '#e0440e', '#005695'];
        var chart = new google.visualization.PieChart($('.areapie .img', loc.$current)[1]);
        chart.draw(d, o);
    }


    function drawChart6() {

        // Create the data table.
        var d = new google.visualization.DataTable();
        d.addColumn('string', 'Topping');
        d.addColumn('number', 'Slices');
        d.addRows(data.charts[1].data);

        // Set chart options
        var o = JSON.parse(JSON.stringify(options));
        // o.title = '';
        o.colors = ['#F58300', '#56C300', '#e0440e', '#005695'];

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.PieChart($('.allpie .img', loc.$current)[1]);
        chart.draw(d, o);
    }

}