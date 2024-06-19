import { createSignal } from "solid-js";
import { PointCloudLayerLas } from "../maps/deck-points-las";
import { Map } from "maplibre-gl";
import { MapboxOverlay } from "@deck.gl/mapbox";

interface Region {
  name: string;
  size: number;
  points: number;
  conditions: any;
  date_generated: number;
  filename: string;
  loaded?: boolean;
  bounds: {
    minLong: number;
    minLat: number;
    maxLong: number;
    maxLat: number;
  };
}

const regionAPI = "http://thermal.localhost/api/";
const staticRegionApi = "/out/regions/";
const EXTENSION = ".laz";

export function RegionSelector({ map }: { map: Map }) {
  const [regions, setRegions] = createSignal<Array<Region>>([]);
  (async () => {
    const regionsFromApi = await (await fetch(regionAPI + "regions")).json();
    const available = (regionsFromApi as Array<Region>).filter(
      (r) => r.size > 0
    );
    setRegions(available);
  })();

  const loadRegion = (region: Region) => async () => {
    const source = staticRegionApi + region.filename + EXTENSION;
    flyTo(region)()

    if (region.loaded){return}
    region.loaded = true
    addBoundingBox(region, map);


    // console.log(source, region);
    const layer = PointCloudLayerLas(source);
    const overlay = new MapboxOverlay({
      layers: [layer],
    });
    map.addControl(overlay);
  };

  const flyTo = (region) => (event?) => {
    event?.stopPropagation();
    console.log('clicked', event)
    console.log("flying to:", region);
    map.fitBounds([
        [region.bounds.minLong, region.bounds.minLat],
        [region.bounds.maxLong, region.bounds.maxLat],
      ]);
  };

  return (
    <div class="region-selector">
      Generated Regions
      {/* <pre>{JSON.stringify(regions(), null, 2)}</pre> */}
      {regions().map((region) => (
        <div class="region" onClick={loadRegion(region)}>
          <h2>{region.name} <button onClick={flyTo(region)}>📌</button></h2>
          <div class="indent">
            <span>{Math.round(region.size)} MB</span>
            <span> {Math.round(region.points / 1000)} K pnts </span>
            <p>{new Date(region.date_generated * 1000).toISOString()}</p>
            
          </div>
        </div>
      ))}
    </div>
  );
}

function addBoundingBox(region, map) {
  // Define the coordinates of your bounding box
  const bbox = [
    [region.bounds.minLong, region.bounds.minLat],
    [region.bounds.minLong, region.bounds.maxLat],
    [region.bounds.maxLong, region.bounds.maxLat],
    [region.bounds.maxLong, region.bounds.minLat],
    [region.bounds.minLong, region.bounds.minLat],
  ];

  const id = 'bbox-' + region.filename
  // Add a new source from our GeoJSON data
  map.addSource(id, {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [bbox],
      },
    },
  });

  // Add a new layer to visualize the bbox
  map.addLayer({
    id: id,
    type: "line",
    source: id,
    layout: {},
    paint: {
      "line-color": "#ff0000", // change line color
      "line-width": 2, // change line width
    },
  });
}
