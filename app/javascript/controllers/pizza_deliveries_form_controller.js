import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "map",
    "latitude",
    "longitude"
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
    })

    this.marker = new AdvancedMarkerElement({
      map: this.map
    })
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
}
