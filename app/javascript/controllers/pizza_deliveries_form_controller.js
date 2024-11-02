import { Controller } from "@hotwired/stimulus"
import { Loader } from '@googlemaps/js-api-loader';
import maplibregl from 'maplibre-gl';

export default class extends Controller {
  static targets = [
    "map",
    "latitude",
    "longitude",
    "searchField"
  ];

  mapTargetConnected() {
    const googleApiKey = this.data.get("google-api-key");

    const loader = new Loader({
      apiKey: googleApiKey,
      libraries: ['places']
    });

    loader.load().then((google) => {
      this.initMap();
      this.initAutocomplete(google);
    });
  }

  initMap() {
    const initLat = this.data.get('latitude') || 39.5;
    const initLng = this.data.get('longitude') || -93.35;

    this.map = new maplibregl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json',
      center: [initLng, initLat],
      zoom: 3,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap Contributors',
            maxzoom: 19
          },
        },
        glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
        layers: [
          {
            id: 'osm',
            type: 'raster',
            source: 'osm'
          },
        ],
      },
    });

    let context = this;

    if (this.data.get('latitude') && this.data.get('longitude')) {
      this.marker = new maplibregl.Marker()
        .setLngLat([initLng, initLat])
        .addTo(this.map);
      this.map.setCenter([initLng, initLat]);
      this.map.setZoom(12);
    }

    this.map.on('click', (e) => {
      const { lngLat } = e;

      context.latitudeTarget.value = lngLat.lat;
      context.longitudeTarget.value = lngLat.lng;

      if (!this.marker) {
        this.marker = new maplibregl.Marker()
          .setLngLat([lngLat.lng, lngLat.lat])
          .addTo(this.map);
      } else {
        this.marker.setLngLat([lngLat.lng, lngLat.lat]);
      }
    });
  }

  initAutocomplete() {
    this.autocomplete = new google.maps.places.Autocomplete(this.searchFieldTarget)
    this.autocomplete.setFields(["address_components", "geometry", "icon", "name"])
    this.autocomplete.addListener("place_changed", this.placeChanged.bind(this))
  }

  placeChanged() {
    let place = this.autocomplete.getPlace();

    if (!place.geometry) {
      return;
    }

    const location = place.geometry.location;
    const lat = location.lat();
    const lng = location.lng();

    this.map.setCenter([lng, lat]);
    this.map.setZoom(lat == null ? 3 : 12);

    if (!this.marker) {
      this.marker = new maplibregl.Marker()
        .setLngLat([lng, lat])
        .addTo(this.map);
    } else {
      this.marker.setLngLat([lng, lat]);
    }

    this.latitudeTarget.value = lat;
    this.longitudeTarget.value = lng;
  }

  keydown(event) {
    if (event.key == "Enter") {
      event.preventDefault();
    }
  }
}
