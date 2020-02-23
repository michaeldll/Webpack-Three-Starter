import * as THREE from 'three'
import RAF from '../utils/raf'

export default class TestCube {
    constructor(params) {
        this.bind()

        this.width = params.width
        this.height = params.height
        this.depth = params.depth
        this.testCube

        this.init()
    }

    init() {
        const geometry = new THREE.BoxGeometry(
            this.width,
            this.height,
            this.depth
        )
        const material = new THREE.MeshBasicMaterial({ color: '#fff' })

        this.testCube = new THREE.Mesh(geometry, material)
    }

    update() {
        if (typeof this.testCube === 'undefined') return

        this.testCube.rotation.x += 0.01
        this.testCube.rotation.y += 0.01
    }

    bind() {
        this.update = this.update.bind(this)
        RAF.subscribe('cubeUpdate', this.update)
    }
}
