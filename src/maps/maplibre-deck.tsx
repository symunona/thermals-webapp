
import { Component, createEffect, createSignal, onCleanup, onMount } from 'solid-js';
import { loadLastPosition, savePosition } from '../utils.ts/remember-position';
import { createFlightPaths, createLineLayer } from '../utils.ts/lines2';
// import styles of maplibre-gl
import 'maplibre-gl/dist/maplibre-gl.css';
import {MapboxOverlay} from '@deck.gl/mapbox';
import { Map } from 'maplibre-gl';
import { PointCloudLayerLas } from './deck-points-las';
import { deck3dTilesLayer } from './deck-3d-vector-tiles';

const MAP_TILER_TOKEN = import.meta.env.VITE_MAP_TILER_ACCESS_TOKEN

const mapStyle = {
    version: 8,
    sources: {
        osm: {
            type: 'raster',
            // tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tiles: ["https://tile.opentopomap.org/{z}/{x}/{y}.png"],
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


export const MapLibreDeck: Component = () => {

    const mapContainer = <div class="h-screen w-screen" /> as HTMLDivElement;

    let mapInstance: Map;


    const [map, setMap] = createSignal<Map>();

    onMount(() => {
        const lastPosition = loadLastPosition()
        // console.log(mapContainer)

        mapInstance = new Map({
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

        mapInstance.once('load', async () => {
            console.log('e!')
            mapInstance.resize();
            setMap(mapInstance)
        })


        mapInstance.resize();

        mapInstance.on("style.load", async () => {
            console.log('style loaded')
            const layer = await deck3dTilesLayer()
            const overlay = new MapboxOverlay({
                layers: [layer],
            });

            console.log(layer)

            /* @ts-ignore */
            mapInstance.addControl(overlay);
        });
        mapInstance.on("styledata", async () => {
            console.log('styledata x')
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
