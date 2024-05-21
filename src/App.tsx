import * as itowns from 'itowns';
// import * as debug from 'itowns/lib/Debug';
// import * as THREE from 'three';
import { Component, onMount } from 'solid-js';

// import frGeoData from './sources/fr-data-server.json';
// Import json config

// This gives only the French elevation map.
import elevationSource from '../node_modules/itowns/examples/layers/JSONLayers/IGN_MNT_HIGHRES.json';
import satelliteSource from '../node_modules/itowns/examples/layers/JSONLayers/Ortho.json';
import thermalCloudSource from './sources/thermal-cloud.json';
import * as debug from '../node_modules/itowns/dist/debug';


import * as GuiTools from '../node_modules/itowns/examples/js/GUI/GuiTools';

// const openTopoMapConfig = await (await fetch('./src/open-topo-map.json')).json()
// const thermalCloudConfig = await (await fetch('./src/thermal-cloud.json')).json()

// console.log(openTopoMapConfig)

// const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
// mapboxgl.accessToken = accessToken;

export const App: Component = () => {

  let viewerDiv: HTMLDivElement | null;
  onMount(() => {

    // Setup the viewgeo
    // const viewerDiv = document.getElementById('viewerDiv');
    // const positionOnGlobe = { longitude: 2.351323, latitude: 48.856712, altitude: 25000000 };
    const placement = {
      coord: new itowns.Coordinates('EPSG:4326', 3.695885, 43.397379, 0),
      range: 3000,
      tilt: 55,
      heading: 180
  }

    const view = new itowns.GlobeView(viewerDiv, placement);

    // Add an imagery layer (you can replace this with your own imagery layer)
    satelliteSource.source = new itowns.WMTSSource(satelliteSource.source);
    view.addLayer(new itowns.ColorLayer('Ortho', satelliteSource));

    elevationSource.source = new itowns.WMTSSource(elevationSource.source);
    const elevationLayer = new itowns.ElevationLayer(elevationSource.id, elevationSource);
    view.addLayer(elevationLayer);

    // Point cloud layer
    const $3dTilesLayerSetePC = new itowns.C3DTilesLayer('3d-tiles-cloud', {
      name: 'cloud',
      sseThreshold: 5,
      pntsMode: itowns.PNTS_MODE.CLASSIFICATION,
      pntsShape : itowns.PNTS_SHAPE.CIRCLE,
      source: new itowns.C3DTilesSource({
          // url: thermalCloudSource.source.url,
          url: 'https://raw.githubusercontent.com/iTowns/iTowns2-sample-data/master/pointclouds/pnts-sete-2021-0756_6256/tileset.json',
      }),
    }, view);

    function updatePointCloudSize({tileContent}) {
      tileContent.traverse(function (obj) {
          if (obj.isPoints) {
              obj.material.size = 2.0;
          }
      });
  }

    $3dTilesLayerSetePC.addEventListener(
        itowns.C3DTILES_LAYER_EVENTS.ON_TILE_CONTENT_LOADED,
        updatePointCloudSize,
    );

    itowns.View.prototype.addLayer.call(view, $3dTilesLayerSetePC);

    // // Add the 3d-tiles layer
    // const $3dTilesLayer = new itowns.GeometryLayer('3d-tiles-layer', new THREE.Group(), {
    //     update: itowns.FeatureProcessing.update,
    //     convert: itowns.Feature2Mesh.convert(),
    //     onTileCreated: itowns.$3dTilesDisplayer.createTile,
    //     source: new itowns.$3dTilesSource({
    //         url: 'http://your-3d-tiles-server.com/path/to/3d-tiles.json',
    //     }),
    // });

    // view.addLayer($3dTilesLayer);
  })

  return (
    <div ref={viewerDiv!} class="h-screen w-screen"></div>
  );
};
