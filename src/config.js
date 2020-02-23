export default {
    renderer: {
        antialias: true,
    },
    scene: {
        backgroundColor: 0xffaaaa,
    },
    camera: {
        fov: 75,
        near: 0.1,
        far: 1000,
        position: {
            x: 0,
            y: 0,
            z: 5,
        },
    },
    controls: {
        enabled: true,
        maxDistance: 1500,
        minDistance: 0,
    },
    bloom: {
        strength: 0.7,
        radius: 0.21,
        threshold: 0.8,
    },
}
