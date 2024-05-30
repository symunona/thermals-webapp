import { PointCloudLayer, ScatterplotLayer } from "deck.gl";
import { LASLoader } from "@loaders.gl/las";
import { Popup } from "maplibre-gl";


export function PointCloudLayerTest() {
  return new PointCloudLayer({
    // data: "/annecy-1.las",
    // data: "/visp-1.las",
    data: "/visp-middle.las",
    loaders: [LASLoader],
    getColor: d => {
        console.warn(d);
        debugger;
        return d.color
    },
    // getNormal: d => d.normal,
    // getPosition: d => d.position,
    pointSize: 1,
  });
}


const colorPalette = [
    [255, 102, 51],
    [255, 179, 153],
    [255, 51, 255],
    [255, 255, 153],
    [0, 179, 230],
    [230, 179, 51],
    [51, 102, 230],
    [153, 153, 102],
    [153, 255, 153],
    [179, 77, 77],
    [128, 179, 0],
    [128, 153, 0],
    [230, 179, 179],
    [102, 128, 179],
    [102, 153, 26],
    [255, 153, 230],
    [204, 255, 26],
    [255, 26, 102],
    [230, 51, 26],
    [51, 255, 204],
    [102, 153, 77],
];

const limit = 50
const parisSights = `https://data.iledefrance.fr/api/explore/v2.1/catalog/datasets/principaux-sites-touristiques-en-ile-de-france0/records?limit=${limit}`;


export async function ExampleLayer(mapInstance){

    const response = await fetch(parisSights);
    const responseJSON = await response.json();

    const layer = new ScatterplotLayer({
        id: 'scatterplot-layer',
        data: responseJSON.results,
        pickable: true,
        opacity: 0.7,
        stroked: true,
        filled: true,
        radiusMinPixels: 14,
        radiusMaxPixels: 100,
        lineWidthMinPixels: 5,
        // Using appropriate fields for coordinates from the dataset
        getPosition: (d) => [d.geo_point_2d.lon, d.geo_point_2d.lat],
        /* @ts-ignore */
        getFillColor: (d) => {
            // Filtering by postal code
            if ('insee' in d && d.insee.startsWith('75')) {
                // Districts in Paris
                return colorPalette[parseInt(d.insee.substring(3))];
            } else {
                // Out of Paris
                return colorPalette[20];
            }
        },
        getLineColor: (d) => [14, 16, 255],
        onClick: (info) => {
            const {coordinate, object} = info;
            const description = `<p>${object.nom_carto || 'Unknown'}</p>`;

            new Popup()
            /* @ts-ignore */
                .setLngLat(coordinate)
                .setHTML(description)
                .addTo(mapInstance);
        },
    });
    return layer
}