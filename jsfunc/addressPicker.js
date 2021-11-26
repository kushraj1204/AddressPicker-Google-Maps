class addressPicker {
    constructor(props) {
        this.mapid = props.mapid;
        this.addressid = props.addressid;
        this.latid = props.latid;
        this.lngid = props.lngid;
        this.infoWindow = new google.maps.InfoWindow;
        this.allowMarkerDrag = props.allowMarkerDrag;
        this.geocoder = new google.maps.Geocoder;
        this.pos = {
            lat: props.lat,
            lng: props.lng
        };
        this.map = new google.maps.Map(
            document.getElementById(this.mapid), {
                zoom: 16,
                center: this.pos
            });
        this.marker = new google.maps.Marker({
            position: this.pos,
            map: this.map,
            draggable: true
        });
        this.autocomplete = new google.maps.places.Autocomplete(document.getElementById(this.addressid));
        this.places = new google.maps.places.PlacesService(this.map);
        this.initMap();
    }


    initMap() {
        let latlng = new google.maps.LatLng(this.pos.lat, this.pos.lng);
        this.map.setCenter(latlng);
        this.autocomplete.addListener('place_changed', (e) => this.onPlaceChanged(e));
        this.marker.addListener('dragend', (e) => this.handleEvent(e));
    }

    handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(this.map);
    }

    handleEvent(event) {
        this.geocodeLatLng(event.latLng.lat(), event.latLng.lng());
    }

    onPlaceChanged(event) {
        var place = this.autocomplete.getPlace();
        if (place.geometry) {
            this.map.panTo(place.geometry.location);
            let latlng = new google.maps.LatLng(this.map.getCenter().lat(), this.map.getCenter().lng());
            this.marker.setPosition(latlng);
            document.getElementById(this.latid).value = (this.map.getCenter().lat()).toFixed(8);
            document.getElementById(this.lngid).value = this.map.getCenter().lng().toFixed(8);
            this.map.setZoom(14);
        } else {
            document.getElementById('autocomplete').placeholder = 'Enter a city';
        }
    }

    geocodeLatLng(lat, lng) {
        var latlng = {lat: lat, lng: lng};
        this.geocoder.geocode({'location': latlng}, (results, status) => {
            if (status === 'OK') {
                if (results[0]) {
                    document.getElementById(this.latid).value = lat.toFixed(8);
                    document.getElementById(this.lngid).value = lng.toFixed(8);
                    document.getElementById(this.addressid).value = results[0].formatted_address;
                } else {
                    window.alert('Error parsing Address');
                }
            } else {
                window.alert('Geocoder failed due to: ' + status);
            }
        });
    }
}
