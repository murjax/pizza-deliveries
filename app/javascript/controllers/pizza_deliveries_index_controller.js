import { Controller } from "@hotwired/stimulus"
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import maplibregl from 'maplibre-gl';

export default class extends Controller {
  static targets = ["map", "table"];

  mapTargetConnected() {
    this.initMap();
  }

  initMap() {
    const map = new maplibregl.Map({
      container: 'map',
      style: 'https://demotiles.maplibre.org/style.json',
      center: [-98.35, 39.5],
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

    const geoData = this.buildGeoData();

    map.on('load', () => {
      this.addGeoData(map, geoData);
      this.addClusters(map);
      this.addClusterCount(map);
      this.addPoints(map)
    });
  }

  buildGeoData() {
    const rows = this.tableTarget.querySelector('tbody').children;
    const geoData = [];

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

      const popupContent = `
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

      geoData.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude]
        },
        properties: {
          popupContent
        }
      });
    }

    return geoData;
  }

  addGeoData(map, geoData) {
    map.addSource('delivery-data', {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: geoData
      },
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    });
  }

  addClusters(map) {
    map.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'delivery-data',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',
          100,
          '#f1f075',
          750,
          '#f28cb1'
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,
          100,
          30,
          750,
          40
        ]
      }
    });

    map.on('click', 'clusters', async (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['clusters']
      });
      const clusterId = features[0].properties.cluster_id;
      const zoom = await map.getSource('delivery-data').getClusterExpansionZoom(clusterId);
      map.easeTo({
        center: features[0].geometry.coordinates,
        zoom
      });
    });

    map.on('mouseenter', 'clusters', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'clusters', () => {
      map.getCanvas().style.cursor = '';
    });
  }

  addClusterCount(map) {
    map.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'delivery-data',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['Open Sans Bold'],
        'text-size': 12
      }
    });
  }

  addPoints(map) {
    map.addLayer({
      id: 'unclustered-point',
      type: 'circle',
      source: 'delivery-data',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': '#11b4da',
        'circle-radius': 5,
        'circle-stroke-width': 1,
        'circle-stroke-color': '#fff'
      }
    });

    map.on('click', 'unclustered-point', (e) => {
      const feature = e.features[0];
      const coordinates = feature.geometry.coordinates.slice();
      const popupContent = feature.properties.popupContent;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(popupContent)
        .addTo(map);
    });

    map.on('mouseenter', 'unclustered-point', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'unclustered-point', () => {
      map.getCanvas().style.cursor = '';
    });
  }
}
