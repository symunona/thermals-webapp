function initMap(mapRef) {
    let savedPosition = JSON.parse(localStorage.getItem('mapPosition'));
    if (!savedPosition) {
        savedPosition = {
            lat: 6.223897393888677,
            lng: 45.8357537733191,
            pitch: 0,
            bearing: 0,
            zoom: 12
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
        });

        // Add new custom geoJSON tile server
        mapInstance.on('load', () => {

            // Add a new vector tile source with ID 'mapillary'.
            mapInstance.addSource('custom-thermal-point-cloud', {
                'type': 'vector',
                'tiles': [
                    'http://localhost:7777/tiles/{z}/{x}/{y}'
                ],
                'minzoom': 6,
                'maxzoom': 14
            });
            mapInstance.addLayer(
                {
                    'id': 'custom-thermal-point-cloud', // Layer ID
                    'type': 'circle',
                    'source': 'custom-thermal-point-cloud', // ID of the tile source created above
                    // Source has several layers. We visualize the one with name 'sequence'.
                    'source-layer': 'sequence',
                    'layout': {
                        // 'line-cap': 'round',
                        // 'line-join': 'round'
                    },
                    'paint': {
                        // 'line-opacity': 0.6,
                        // 'line-color': 'rgb(53, 175, 109)',
                        // 'line-width': 2
                        'circle-radius': 10,
                        'circle-color': '#007cbf',
                    }
                },
                // 'road-label-simple' // Arrange our new layer beneath labels and above roads
            )
            console.log('loaded')
            // Capture tile data for debug
            mapInstance.on('sourcedata', (e) => {
                // list the tile data raw geojson
                console.log(e)
                if (e.sourceId === 'custom-thermal-point-cloud') {
                    console.log(e.sourceDataType);
                    console.log(e.isSourceLoaded)
                }
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
    }
}