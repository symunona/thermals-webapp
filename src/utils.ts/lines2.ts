// import * as THREE from "three";

import maplibregl from 'maplibre-gl';
import { BufferGeometry, Camera, DirectionalLight, Float32BufferAttribute, Line, LineBasicMaterial, Matrix4, Mesh, MeshBasicMaterial, Scene, SphereGeometry, Vector3, WebGLRenderer } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { c } from 'vite/dist/node/types.d-aGj9QkWt';

    // parameters to ensure the model is georeferenced correctly on the map
    const modelOrigin = [8.36577, 46.88103] //[148.9819, -35.39847];
    const modelAltitude = 0;
    const modelRotate = [Math.PI / 2, 0, 0];

    const modelAsMercatorCoordinate = maplibregl.MercatorCoordinate.fromLngLat(
        /* @ts-ignore */
        modelOrigin,
        modelAltitude
    );

    // transformation parameters to position, rotate and scale the 3D model onto the map
    const modelTransform = {
        translateX: modelAsMercatorCoordinate.x,
        translateY: modelAsMercatorCoordinate.y,
        translateZ: modelAsMercatorCoordinate.z,
        rotateX: modelRotate[0],
        rotateY: modelRotate[1],
        rotateZ: modelRotate[2],
        /* Since our 3D model is in real world meters, a scale transform needs to be
        * applied since the CustomLayerInterface expects units in MercatorCoordinates.
        */
        scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()
    };

function geographicToCartesian(lat, lon, elev) {
    // Earth's radius in meters
    const R = 6371000;

    // Convert latitude and longitude to radians
    const latRad = lat * Math.PI / 180;
    const lonRad = lon * Math.PI / 180;

    // Convert geographic coordinates to Cartesian coordinates
    const x = (R + elev) * Math.cos(latRad) * Math.cos(lonRad);
    const y = (R + elev) * Math.cos(latRad) * Math.sin(lonRad);
    const z = (R + elev) * Math.sin(latRad);

    return { x, y, z };
}

// Convert your list of points to three.js-compatible format
function convertPointsToThreeJS(points) {
    const vertices = [];
    // Convert each point to Cartesian coordinates
    const ref = geographicToCartesian(points[0][2], points[0][3], points[0][4]);
    points.forEach(point => {
        const { x, y, z } = geographicToCartesian(point[2], point[3], point[4]);
        // const {x, y} = maplibregl.MercatorCoordinate.fromLngLat({lat: point[2], lng: point[3]});
        // vertices.push(x, y, 10);
        vertices.push(-(x - ref.x), (y - ref.y), point[4] / 2);
    });
    // maplibregl.MercatorCoordinate.fromLngLat(points[0], 0);5
    return vertices;
}


export async function createFlightPaths(){
    const response = await fetch('/flight.json')
    const flight = await response.json()

    // console.log('flight', flight)

    const vertices = convertPointsToThreeJS(flight);
    console.log(vertices)
    const geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    const material = new LineBasicMaterial({ color: 0xff0000, linewidth: 10});
    const line = new Line(geometry, material);
    return line
    // scene.add(line); // Add the line to your scene


    // fetch('/flight.json')
    //     .then(response => {
    //         // Check if the response is successful (status code 200)
    //         if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //         }
    //         // Parse the JSON data
    //         return response.json();
    //     })
    //     .then(data => {
    //         // Handle the JSON data
    //         console.log(data);
    //         // Do something with the data
    //     })
    //     .catch(error => {
    //         // Handle errors
    //         console.error('There was a problem with the fetch operation:', error);
    //     });
}

export function createLineLayer(line){
    const customLayer = {
        id: '3d-model',
        // type: maplibregl 'custom',
        type: 'custom',
        renderingMode: '3d',
        onAdd (map, gl) {
            this.camera = new Camera();
            this.scene = new Scene();

            // create two three.js lights to illuminate the model
            const directionalLight = new DirectionalLight(0xffffff);
            directionalLight.position.set(0, -70, 100).normalize();
            this.scene.add(directionalLight);

            const directionalLight2 = new DirectionalLight(0xffffff);
            directionalLight2.position.set(0, 70, 100).normalize();
            this.scene.add(directionalLight2);

            // use the three.js GLTF loader to add the 3D model to the three.js scene
            /* @ts-ignore */
            const loader = new GLTFLoader();
            // loader.load(
            //     'https://maplibre.org/maplibre-gl-js/docs/assets/34M_17/34M_17.gltf',
            //     (gltf) => {
            //         this.scene.add(gltf.scene);
            //     }
            // );
            this.map = map;

            // use the MapLibre GL JS map canvas for three.js
            this.renderer = new WebGLRenderer({
                canvas: map.getCanvas(),
                context: gl,
                antialias: true
            });

            // const points = [];
            // points.push(new Vector3(-3, 0, 0));
            // points.push(new Vector3(1, 0, 0));
            // points.push(new Vector3(2, 1, 0));
            // points.push(new Vector3(1, 0, 1));

            // const geometry = new BufferGeometry().setFromPoints(points);

            // // Define the material of the line
            // const material = new LineBasicMaterial({ color: 0x0000ff });

            // const line = new Line(geometry, material);
            this.scene.add(line);

            const center = geographicToCartesian(0, 0, 0);

            const sphereRadius = 10000000; // Example radius in meters (1,000 km)

            // Create the sphere geometry
            const geometry = new SphereGeometry(sphereRadius, 32, 32);

            // Create a material for the sphere (e.g., a basic material with a color)
            const material = new MeshBasicMaterial({ color: 0xff0000 });

            // Create the sphere mesh using the geometry and material
            const sphere = new Mesh(geometry, material);

            // Set the position of the sphere using the Cartesian coordinates
            sphere.position.set(0, 0, 0);
            // line.position.set(0, 0, 0);

            // Add the sphere to the scene
            this.scene.add(sphere);

            this.renderer.autoClear = false;
            console.warn('adding 3d model')
        },
        render (gl, matrix) {
            // gl.useProgram(this.program);
            // gl.uniformMatrix4fv(
            //     gl.getUniformLocation(this.program, 'u_matrix'),
            //     false,
            //     matrix
            // );
            // gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
            // gl.enableVertexAttribArray(this.aPos);
            // gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
            // gl.enable(gl.BLEND);
            // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            // gl.drawArrays(gl.TRIANGLE_STRIP, 0, 3);

            const rotationX = new Matrix4().makeRotationAxis(
                new Vector3(1, 0, 0),
                modelTransform.rotateX
            );
            const rotationY = new Matrix4().makeRotationAxis(
                new Vector3(0, 1, 0),
                modelTransform.rotateY
            );
            const rotationZ = new Matrix4().makeRotationAxis(
                new Vector3(0, 0, 1),
                modelTransform.rotateZ
            );

            const m = new Matrix4().fromArray(matrix);
            const l = new Matrix4()
                .makeTranslation(
                    modelTransform.translateX,
                    modelTransform.translateY,
                    modelTransform.translateZ
                )
                .scale(
                    new Vector3(
                        modelTransform.scale,
                        -modelTransform.scale,
                        modelTransform.scale
                    )
                )
                // .multiply(rotationX)
                // .multiply(rotationY)
                // .multiply(rotationZ);




            this.camera.projectionMatrix = m.multiply(l);
            this.renderer.resetState();
            this.renderer.render(this.scene, this.camera);
            this.map.triggerRepaint();
        }
    };
    return customLayer
}