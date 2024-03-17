import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["map"];

  mapTargetConnected() {
    if (document.getElementById('google-script') === null) {
      const googleApiKey = document.getElementById('google-api-key').innerHTML;
      const googleScript = document.createElement('script');
      googleScript.id = 'google-script';
      googleScript.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places&loading=async&callback=initMap`;
      const context = this;
      window.initMap = function(...args) {
        context.initIndexMap();
      }
      document.head.appendChild(googleScript);
    } else {
      this.initIndexMap();
    }
  }

  async initIndexMap() {
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const url = new URL(window.location.href);

    this.map = new Map(this.mapTarget, {
      center: new google.maps.LatLng(39.5, -98.35),
      zoom: 4,
      mapId: 'map-id'
    });

    fetch(`/pizza_deliveries.json${url.search}`)
      .then(response => response.json())
      .then(data => {
        data.data.forEach(pizzaDelivery => {
          let marker = new AdvancedMarkerElement({
            map: this.map,
            position: { lat: parseFloat(pizzaDelivery.latitude), lng: parseFloat(pizzaDelivery.longitude) }
          });
        })
      });
  }
}
