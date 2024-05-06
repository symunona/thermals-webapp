import mapboxgl from 'mapbox-gl';
import { onMount, type Component } from 'solid-js';
const otm = await (await fetch('./src/otm.json')).json()

console.log(otm)

const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
mapboxgl.accessToken = accessToken;

export const App: Component = () => {

  let mapRef: HTMLDivElement | null;
  onMount(() => {
    let savedPosition = JSON.parse(localStorage.getItem('mapPosition'));
    if (!savedPosition) {
      savedPosition = {
        lat: 6.223897393888677,
        lng: 45.8357537733191,
        pitch: 0,
        bearing: 0,
        zoom: 12
      }
      // mapInstance.jumpTo(savedPosition);
    }

    const mapInstance = new mapboxgl.Map({
      container: mapRef,
      zoom: 14,
      center: [savedPosition.lat, savedPosition.lng],
      pitch: savedPosition.pitch,
      bearing: savedPosition.bearing,
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: {
        'version': 8,
        'sources': {
          'raster-tiles': {
            'type': 'raster',
            'tiles': ["https://tile.opentopomap.org/{z}/{x}/{y}.png"],
            'tileSize': 256,
            'attribution':
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }
        },
        'layers': [
          {
            'id': 'simple-tiles',
            'type': 'raster',
            'source': 'raster-tiles',
            'minzoom': 0,
            'maxzoom': 22
          }
        ]
      },

      // style: 'mapbox://styles/mapbox/satellite-streets-v12'
    });
    mapInstance.on('style.load', () => {
      mapInstance.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
      });
      // add the DEM source as a terrain layer with exaggerated height
      mapInstance.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.0 });
      mapInstance.addSource('opentopomap', {
        "type": 'raster',
        "tiles": [
          "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
        ],
        "minzoom": 0,
        "maxzoom": 12
      });
    });

    mapInstance.on('moveend', () => {
      // Lol, these are swapped!
      const { lng, lat } = mapInstance.getCenter();
      const zoom = mapInstance.getZoom();
      const bearing = mapInstance.getBearing();
      const pitch = mapInstance.getPitch();

      localStorage.setItem('mapPosition', JSON.stringify({ lng: lat, lat: lng, zoom, pitch, bearing }));
    });

  })

  return (
    <div ref={mapRef!} class="h-screen w-screen"></div>

  );
};
