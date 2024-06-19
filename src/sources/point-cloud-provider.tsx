import { createSignal } from "solid-js";
import { PointCloudLayerLas } from "../maps/deck-points-las";
import { Map } from 'maplibre-gl';

interface Region {
  name: string;
  size: number;
  points: number;
  conditions: any;
  date_generated: number;
  filename: string;
}

const regionAPI = "http://thermal.localhost/api/";
const staticRegionApi = "http://thermal.localhost/out/regions/"
const EXTENSION = '.las'

export function RegionSelector({mapInstance: Map}) {
  const [regions, setRegions] = createSignal<Array<Region>>([]);
  (async () => {
    const regionsFromApi = await (await fetch(regionAPI + "regions")).json();
    const available = (regionsFromApi as Array<Region>).filter(r=>r.size > 0)
    console.log(regionsFromApi);
    setRegions(available)
  })();

  const loadRegion = (region: Region) => async () => {
    const source = staticRegionApi + region.filename + EXTENSION
    console.log(source, region);
    const layer = PointCloudLayerLas(source)
    mapInstance.addLayer(layer)

  }

  return (
    <div class="region-selector">
      Generated Regions
      {/* <pre>{JSON.stringify(regions(), null, 2)}</pre> */}
      {regions().map((region) => (
        <div class="region" onClick={loadRegion(region)}>
            <h2>{region.name}</h2>
            <div class="indent">
                <p>{Math.round(region.size)} MB</p>
                <p>{Math.round(region.points/1000)} K pnts </p>
                <p>{new Date(region.date_generated * 1000).toISOString()}</p>
            </div>
        </div>
      ))}
    </div>
  );
}
