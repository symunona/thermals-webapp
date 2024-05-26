import maplibregl from 'maplibre-gl';
import { Component, createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import { loadLastPosition, savePosition } from '../utils.ts/remember-position';
import { createFlightPaths, createLineLayer } from '../utils.ts/lines2';
// import styles of maplibre-gl
import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_TILER_TOKEN = import.meta.env.VITE_MAP_TILER_ACCESS_TOKEN

const mapStyle = {
    version: 8,
    sources: {
        osm: {
            type: 'raster',
            tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            // tiles: ["https://tile.opentopomap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap Contributors',
            maxzoom: 19
        },
        // Use a different source for terrain and hillshade layers, to improve render quality
        terrainSource: {
            type: 'raster-dem',
            url: `https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=${MAP_TILER_TOKEN}`,
            tileSize: 256
        },
    },
    layers: [
        {
            id: 'osm',
            type: 'raster',
            source: 'osm'
        }
    ],
    terrain: {
        source: 'terrainSource',
        exaggeration: 1
    }
}


export const MapLibre: Component = () => {

    const mapContainer = <div class="h-screen w-screen" /> as HTMLDivElement;

    let mapInstance: maplibregl.Map;


    const [map, setMap] = createSignal<maplibregl.Map>();

    onMount(() => {
        const lastPosition = loadLastPosition()
        // console.log(mapContainer)

        mapInstance = new maplibregl.Map({
            container: mapContainer, // container id
            center: lastPosition.center || [148.9819, -35.39847], // [8.584442138671875,46.53188239351701], // starting position [lng, lat]
            zoom: lastPosition.zoom || 18, // starting zoom
            /* @ts-ignore */
            style: mapStyle,
            pitch: lastPosition.pitch || 0,
            maxPitch: 85,
            minPitch: 0,/* @ts-ignore */
            antialias: true
        });

        // console.error('nlah', mapInstance, mapContainer)
        /* @ts-ignore */
        //     mapInstance.addLayer(customLayer);

        mapInstance.once('load', () => {
            console.log('e!')
            mapInstance.resize();
            setMap(mapInstance)

        })

        // createEffect(() => {
        //     const m = map();
        //     if (!m) return;

        //     map().on("style.load", () => {
        //         console.log('style loaded', customLayer)
        //         /* @ts-ignore */
        //         map().addLayer(customLayer);
        //     })

        //     // for (const [key, handler] of Object.entries(events)) {
        //     //   if (!key.startsWith("on")) continue;

        //     //   const name = key.slice(2).toLowerCase();
        //     //   m.on(name as never, handler as never);
        //     //   onCleanup(() => m.off(name as never, handler));
        //     // }
        //   });

        mapInstance.resize();
        // mapInstance.on("resize", () => {
        //     const { width, height } = mapInstance.getCanvas();
        //     material.resolution.set(width, height);
        // });


        mapInstance.on("style.load", async () => {
            console.log('style loaded')
            // mapInstance.addLayer(customLayer);
            model = true

            try {
                const line = await createFlightPaths()
                const lineLayer = createLineLayer(line)
                /* @ts-ignore */
                await mapInstance.addLayer(lineLayer);
            } catch (e) {
                console.error(e)
            }
            console.log('added')
        });
        let model;
        mapInstance.on("styledata", async () => {
            console.log('style loaded x')

            // mapInstance.addLayer(customLayer);
        });

        mapInstance.on('click', function (e) {
            // e.lngLat is the object containing the clicked coordinates
            const coordinates = e.lngLat;
            console.log('You clicked at ' + coordinates.lng + ', ' + coordinates.lat);
        });


        mapInstance.on('moveend', () => savePosition(mapInstance));
    })
    onCleanup(() => {
        mapInstance.remove();
    });

    return (
        <div class="h-screen w-screen">
            {/* <div ref={mapContainer} ></div> */}
            {mapContainer}
        </div>
    );
}
