import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "map",
    "latitude",
    "longitude",
    "searchField"
  ];

  mapTargetConnected() {
    if (document.getElementById("google-script") === null) {
      const googleApiKey = this.data.get("google-api-key");
      const googleScript = document.createElement("script");
      googleScript.id = "google-script";
      googleScript.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places&loading=async&callback=initMap`;
      const context = this;
      window.initMap = function(...args) {
        context.initFormMap();
      }

      document.head.appendChild(googleScript);
    } else {
      this.initFormMap();
    }
  }

  async initFormMap() {
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    this.map = new google.maps.Map(this.mapTarget, {
      center: new google.maps.LatLng(this.data.get("latitude") || 39.5, this.data.get("longitude") || -98.35),
      zoom: 4,
      mapId: "map-id",
    });

    this.autocomplete = new google.maps.places.Autocomplete(this.searchFieldTarget)
    this.autocomplete.bindTo("bounds", this.map)
    this.autocomplete.setFields(["address_components", "geometry", "icon", "name"])
    this.autocomplete.addListener("place_changed", this.placeChanged.bind(this))

    this.marker = new AdvancedMarkerElement({
      map: this.map
    });

    if (this.data.get("latitude") && this.data.get("longitude")) {
      this.marker.position = {
        lat: Number(this.data.get("latitude")),
        lng: Number(this.data.get("longitude"))
      };
    }

    let context = this;
    google.maps.event.addListener(this.map, "click", function(event) {
      context.marker.position = {
        lat: Number(event.latLng.lat()),
        lng: Number(event.latLng.lng())
      };

      context.latitudeTarget.value = event.latLng.lat();
      context.longitudeTarget.value = event.latLng.lng();
    })
  }

   placeChanged() {
    let place = this.autocomplete.getPlace();

    if (!place.geometry) {
      return;
    }

    if (place.geometry.viewport) {
      this.map.fitBounds(place.geometry.viewport);
    } else {
      this.map.setCenter(place.geometry.location);
      this.map.setZoom(this.data.get("latitude") == null ? 4 : 17);
    }

    this.marker.position = place.geometry.location;

    this.latitudeTarget.value = place.geometry.location.lat();
    this.longitudeTarget.value = place.geometry.location.lng();
  }

  keydown(event) {
    if (event.key == "Enter") {
      event.preventDefault();
    }
  }
}
