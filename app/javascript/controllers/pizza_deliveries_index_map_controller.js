import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["map"];

  mapTargetConnected() {
    if (document.getElementById("google-script") === null) {
      const googleApiKey = this.data.get("google-api-key");
      const googleScript = document.createElement("script");
      googleScript.id = "google-script";
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
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const url = new URL(window.location.href);
    const infoWindow = new InfoWindow();

    this.map = new Map(this.mapTarget, {
      center: new google.maps.LatLng(39.5, -98.35),
      zoom: 4,
      mapId: "map-id"
    });

    fetch(`/pizza_deliveries.json${url.search}`)
      .then(response => response.json())
      .then(data => {
        data.data.forEach(pizzaDelivery => {
          let marker = new AdvancedMarkerElement({
            map: this.map,
            position: { lat: parseFloat(pizzaDelivery.latitude), lng: parseFloat(pizzaDelivery.longitude) }
          });

          const markerContent = `
            <div class="flex flex-col items-center">
              <p class="uppercase font-bold text-gray-800">Location</p>
              <p>${pizzaDelivery.formatted_location}</p>
              <p class="uppercase font-bold text-gray-800">Submitted At</p>
              <p>
                ${pizzaDelivery.formatted_created_at}
              </p>

              <p class="uppercase font-bold text-gray-800">Pizza</p>
              <p>
                ${pizzaDelivery.pizza_description}
              </p>

              <a href="/pizza_deliveries/${pizzaDelivery.id}" class="block mt-2 font-sans text-sm antialiased font-medium leading-normal text-blue-400">
                View
              </a>
            </div>
          `;

          marker.addListener("click", ({ domEvent, latLng }) => {
            const { target } = domEvent;

            infoWindow.close();
            infoWindow.setContent(markerContent);
            infoWindow.open(marker.map, marker);
          });
        })
      });
  }
}
