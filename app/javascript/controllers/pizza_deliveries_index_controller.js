import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["map", "table"];

  mapTargetConnected() {
    if (document.getElementById("google-script") === null) {
      const markerClustererScript = document.createElement("script");
      markerClustererScript.src = "https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js";
      document.head.appendChild(markerClustererScript);

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

    const rows = this.tableTarget.querySelector('tbody').children;
    const markers = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const id = row.getAttribute('data-id');
      const latitude = row.getAttribute('data-latitude');
      const longitude = row.getAttribute('data-longitude');
      const location = row.children[0].querySelector('p').innerHTML;

      const pizzaType = row.children[1].querySelector('p').innerHTML;
      const pizzaSize = row.children[2].querySelector('p').innerHTML;
      const pizzaCrust = row.children[3].querySelector('p').innerHTML;
      const pizzaDescription = `${pizzaSize} ${pizzaType} ${pizzaCrust}`;

      const submittedAt = row.children[4].querySelector('p').innerHTML;

      let marker = new AdvancedMarkerElement({
        map: this.map,
        position: { lat: parseFloat(latitude), lng: parseFloat(longitude) }
      });

      const markerContent = `
        <div class="flex flex-col items-center">
          <p class="uppercase font-bold text-gray-800">Location</p>
          <p>${location}</p>
          <p class="uppercase font-bold text-gray-800">Submitted At</p>
          <p>
            ${submittedAt}
          </p>

          <p class="uppercase font-bold text-gray-800">Pizza</p>
          <p>
            ${pizzaDescription}
          </p>

          <a href="/pizza_deliveries/${id}" class="block mt-2 font-sans text-sm antialiased font-medium leading-normal text-blue-400">
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

      markers.push(marker);
    }

    new markerClusterer.MarkerClusterer({ map: this.map, markers });
  }
}
