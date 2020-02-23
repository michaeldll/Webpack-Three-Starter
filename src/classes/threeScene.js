import * as THREE from 'three'

import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import TestCube from './testCube'
import config from '../config'

import RAF from '../utils/raf'

class ThreeScene {
    constructor() {
        this.bind()
        this.camera
        this.scene
        this.renderer
        this.controls

        this.composer
        this.bloomPass
        this.init()
    }

    init() {
        this.renderer = new THREE.WebGLRenderer(config.renderer)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.debug.checkShaderErrors = true
        document.body.appendChild(this.renderer.domElement)

        this.scene = new THREE.Scene()
        this.scene.background = new THREE.Color(config.scene.backgroundColor)

        this.camera = new THREE.PerspectiveCamera(
            config.camera.fov,
            window.innerWidth / window.innerHeight,
            config.camera.near,
            config.camera.far
        )
        this.camera.position.set(
            config.camera.position.x,
            config.camera.position.y,
            config.camera.position.z
        )

        this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        this.controls.enabled = config.controls.enabled
        this.controls.maxDistance = config.controls.maxDistance
        this.controls.minDistance = config.controls.minDistance

        this.composer = new EffectComposer(this.renderer)
        this.composer.addPass(new RenderPass(this.scene, this.camera))

        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            config.bloom.strength,
            config.bloom.radius,
            config.bloom.threshold
        )

        this.composer.addPass(this.bloomPass)

        const testCube = new TestCube({
            width: 1,
            height: 1,
            depth: 1,
            camera: this.camera,
            scene: this.scene,
        })
        this.scene.add(testCube.testCube)

        const light = new THREE.AmbientLight()
        const pointLight = new THREE.PointLight()
        pointLight.position.set(10, 10, 0)
        this.scene.add(light, pointLight)

        this.myGUI()
    }

    myGUI() {
        const gui = new GUI()

        const bloomFolder = gui.addFolder('Bloom')

        bloomFolder.add(config.bloom, 'threshold', 0.0, 1.0).onChange(value => {
            this.bloomPass.threshold = Number(value)
        })
        bloomFolder.add(config.bloom, 'strength', 0.0, 3.0).onChange(value => {
            this.bloomPass.strength = Number(value)
        })
        bloomFolder
            .add(config.bloom, 'radius', 0.0, 1.0)
            .step(0.01)
            .onChange(value => {
                this.bloomPass.radius = Number(value)
            })

        bloomFolder.open()
    }

    update() {
        this.composer.render()
    }

    resizeCanvas() {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
    }

    bind() {
        this.resizeCanvas = this.resizeCanvas.bind(this)
        this.update = this.update.bind(this)

        window.addEventListener('resize', this.resizeCanvas)
        RAF.subscribe('threeSceneUpdate', this.update)
    }
}

export { ThreeScene as default }
