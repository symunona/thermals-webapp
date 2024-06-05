import { PointCloudLayer, ScatterplotLayer } from "deck.gl";
import { LASLoader } from "@loaders.gl/las";
import { Popup } from "maplibre-gl";


export function PointCloudLayerLas() {
  return new PointCloudLayer({
    // data: "/annecy-1.las",
    // data: "/visp-1.las",
    // data: "/visp-middle-thermals.las",
    // data: "/tenerife.las",
    data: "/2411976.las",
    loaders: [LASLoader],
    opacity: 0.3,

    getColor: d => {
        console.warn(d);
        debugger;
        return d.color
    },
    // getNormal: d => d.normal,
    // getPosition: d => d.position,
    pointSize: 10,
    sizeUnits: "meters",
  });
}

