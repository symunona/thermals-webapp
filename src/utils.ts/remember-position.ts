export function loadLastPosition() {
    return JSON.parse(localStorage.getItem('lastPosition') || '{}');
}

export function savePosition(mapInstance: maplibregl.Map) {
    const { lng, lat } = mapInstance.getCenter();
    const zoom = mapInstance.getZoom();
    const bearing = mapInstance.getBearing();
    const pitch = mapInstance.getPitch();
    const toSave = JSON.stringify({ center: [lng, lat], zoom, pitch, bearing })
    // console.log('saving', toSave)
    localStorage.setItem('lastPosition', toSave);
    // console.log('saved', toSave)
}