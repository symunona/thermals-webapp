import { Show, createSignal } from "solid-js";
import { PointCloudLayerLas } from "../maps/deck-points-las";
import { Map } from "maplibre-gl";
import { MapboxOverlay } from "@deck.gl/mapbox";
import { About } from "../pages/About";
import maplibregl from 'maplibre-gl'

interface Region {
  name: string;
  size: number;
  points: number;
  conditions: any;
  date_generated: number;
  filename: string;
  zipped_size: number;

  overlay: any;
  bounds: {
    minLong: number;
    minLat: number;
    maxLong: number;
    maxLat: number;
  };
}

const staticRegionApi = "/out/regions/";
const EXTENSION = ".laz";

export function RegionSelector({ map }: { map: Map }) {
  const [regions, setRegions] = createSignal<Array<Region>>([]);
  const [currentRegion, setCurrentRegion] = createSignal<Region>(null);
  const [isSidebarVisible, setIsSidebarVisible] = createSignal<boolean>(
    localStorage.getItem("sidebar") === "hidden"
  );

  (async () => {
    const regionsFromApi = await (await fetch(staticRegionApi + "regions.json")).json();
    const available = (regionsFromApi as Array<Region>).filter(
      (r) => r.size > 0
    );

    setRegions(available);
  })();

  const loadRegion = async (region: Region) => {
    const source = staticRegionApi + region.filename + EXTENSION;

    if (currentRegion()) {
      /* @ts-ignore */
      map.removeControl(currentRegion().overlay);
      removeBoundingBox(currentRegion(), map);
      if (region === currentRegion()) {
        setCurrentRegion(null);
        return;
      }
    }

    // If current camera position is further than 10km
    // from the region, fly to, do not fly
    const centerOfMap = map.getCenter();
    const centerOfRegion = [(region.bounds.minLong + region.bounds.maxLong) / 2, (region.bounds.minLat + region.bounds.maxLat) / 2];
    const centerLatLng = new maplibregl.LngLat(centerOfRegion[0], centerOfRegion[1]);
    map.project(centerOfMap)
    if (map.getCenter().distanceTo(centerLatLng) > 20000)
    {
      flyTo(region)();
    }

    // The first time this loaded:
    region.overlay = new MapboxOverlay({
      layers: [PointCloudLayerLas(source)],
    });

    addBoundingBox(region, map);
    /* @ts-ignore */
    map.addControl(region.overlay);

    setCurrentRegion(region);
  };

  const flyTo = (region) => (event?) => {
    event?.stopPropagation();
    console.log("clicked", event);
    console.log("flying to:", region);
    map.fitBounds([
      [region.bounds.minLong, region.bounds.minLat],
      [region.bounds.maxLong, region.bounds.maxLat],
    ]);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible());
    localStorage.setItem("sidebar", isSidebarVisible() ? "hidden" : "visible");
  };

  const clickRegion = (region: Region) => async () => {
    await loadRegion(region)
    setIsSidebarVisible(false)
  }

  return (
    <div>
      <div class="hamburger" onClick={toggleSidebar}>
        ≡
      </div>
      <Show when={isSidebarVisible()}>
        <div class="sidebar">
          Regions
          {/* <pre>{JSON.stringify(regions(), null, 2)}</pre> */}
          {regions().map((region) => (
            <div
              class="menu-item"
              classList={{ loaded: currentRegion() === region }}
              onClick={clickRegion(region)}
            >
              <h2>
                {region.name} <button onClick={flyTo(region)}>📌</button>
              </h2>
              <div class="indent">
                <span>{Math.round(region.size)} MB (ZIP: {Math.round(region.zipped_size)}MB) </span>
                <span> {Math.round(region.points / 1000)} K pnts </span>
                <p>{new Date(region.date_generated * 1000).toISOString()}</p>
              </div>
            </div>
          ))}
          <About />
        </div>
      </Show>
    </div>
  );
}

function removeBoundingBox(region, map) {
  const id = "bbox-" + region.filename;
  map.removeLayer(id);
  map.removeSource(id);
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

  const id = "bbox-" + region.filename;
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
