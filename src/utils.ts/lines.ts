import * as THREE from "three";
import maplibregl from 'maplibre-gl';

export function addLine(map: maplibregl.Map) {
    const mat4 = new THREE.Matrix4();
    const center = [-73.9897, 40.7141]; // nyc
    const merc = maplibregl.MercatorCoordinate.fromLngLat(center, 0);
    const scale = merc.meterInMercatorCoordinateUnits();
    const worldTransform = new THREE.Matrix4()
        .makeTranslation(merc.x, merc.y, merc.z)
        .scale(new THREE.Vector3(scale, -scale, scale));


    let material;

    // configuration of the custom layer for a 3D model per the CustomLayerInterface
    var customLayer = {
        id: "3d-model",
        type: "custom",
        renderingMode: "3d",
        onAdd: function (map, gl) {
            this.camera = new THREE.Camera();
            this.scene = new THREE.Scene();
            this.map = map;
            this.renderer = new THREE.WebGLRenderer({
                canvas: map.getCanvas(),
                context: gl,
                antialias: true
            });
            this.renderer.autoClear = false;
            console.warn('adding line')

            // create two line segments
            const geometry = new THREE.LineSegmentsGeometry().setPositions([
                20,
                -300,
                0,
                20,
                300,
                0,
                20,
                300,
                0,
                1000,
                -300,
                20,
            ]);
            const { width, height } = map.getCanvas();

            material = new THREE.LineMaterial({
                worldUnits: true,
                depthTest: false,
                linewidth: 30,
                resolution: new THREE.Vector2(width, height),
                color: 0xff0000
            });
            const lineMesh = new THREE.Line2(geometry, material);
            this.scene.add(lineMesh);
        },
        render: function (gl, matrix) {
            this.camera.projectionMatrix.multiplyMatrices(
                mat4.fromArray(map.transform.mercatorMatrix),
                worldTransform
            );
            this.renderer.resetState();

            this.renderer.render(this.scene, this.camera);
            this.map.triggerRepaint();
        }
    };

    return {material, customLayer}

    // map.on("style.load", function () {
    //     map.addLayer(customLayer);
    // });

    // map.on("resize", () => {
    //     const { width, height } = map.getCanvas();
    //     material.resolution.set(width, height);
    // });
}