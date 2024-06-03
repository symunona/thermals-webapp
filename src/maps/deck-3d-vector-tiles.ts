import { Tile3DLayer } from "deck.gl";
import {Tiles3DLoader} from '@loaders.gl/3d-tiles';
import {Tileset3D} from '@loaders.gl/tiles';
import {CesiumIonLoader} from '@loaders.gl/3d-tiles';

export function deck3dTilesLayer(){

    const tile3DLayer = new Tile3DLayer({
        id: 'tile-3d-layer',
        data: 'http://dev.localhost/ai/thermal-scraper/out/tiles/ept.json',
        /* @ts-ignore */
        loader: CesiumIonLoader,
        onTilesetLoad: (tileset) => {
            // Center the view on the tileset
            const {cartographicCenter} = tileset;
            console.log(tileset)
            // map.jumpTo({
            //     center: [cartographicCenter[0], cartographicCenter[1]],
            //     zoom: 18
            // });
        },
        pointSize: 1.0, // Adjust point size if necessary
        getPointColor: [255, 255, 255] // Default color
    });
    return tile3DLayer
}