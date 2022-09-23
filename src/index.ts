import *  as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

class Camera {
    camera: THREE.PerspectiveCamera;
    cubeCamera : THREE.CubeCamera;

    initCamera = (x: number, y: number, z: number) => {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = z;
        this.camera.position.x = x;
        this.camera.position.y = y;
        // this.camera.lookAt(0, 0, 20);
        return this.camera;
    };

    initCubeCamera = () => {
        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128, {
            format: THREE.RGBFormat,
            generateMipmaps: true,
            minFilter: THREE.LinearMipmapLinearFilter,
            encoding: THREE.sRGBEncoding
        });      
        this.cubeCamera = new THREE.CubeCamera( 1, 10000, cubeRenderTarget );
        return this.cubeCamera;
    }
}

class Objects {
    private fontLoader = new THREE.FontLoader();

    renderSphere = (x: number, y: number, z: number, texture: THREE.Texture) => {
        let material = new THREE.MeshStandardMaterial({map: texture});
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 512, 512), material)
        sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv
        sphere.position.y = y
        sphere.position.x = x
        sphere.position.z = z
        return sphere;
    }

    renderSphereWithBumpMap = (x: number, y: number, z: number, texture: THREE.Texture, bumpMap: THREE.Texture) => {
        const shpereProps = {
            map: texture,
            bumpMap: bumpMap
        };
        const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 512, 512), new THREE.MeshStandardMaterial(shpereProps))
        sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv
        sphere.position.y = y;
        sphere.position.x = x;
        sphere.position.z = z;
        return sphere;
    }

    renderPlane = (x: number, y: number, texture: THREE.Texture) => {
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, map: texture }))
        plane.position.y = y;
        plane.position.x = x;
        return plane;
    }

    renderPlaneWithBumpMap = (x: number, y: number, texture: THREE.Texture, bumpMap: THREE.Texture) => {
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.MeshStandardMaterial({side: THREE.DoubleSide, map: texture, bumpMap: bumpMap }))
        plane.position.y = y;
        plane.position.x = x;
        return plane;
    }

    renderFloor = (color: number) => {
        const plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 1), new THREE.MeshPhongMaterial({side: THREE.DoubleSide, color: color}));
        plane.rotation.x = - Math.PI / 2;
        return plane;
    }

    render3DText = (text: string, size: number, x: number, y: number, z: number, scene: THREE.Scene) => {
        this.fontLoader.load('./fonts/font.json', (font) => {
            const geometry = new THREE.TextGeometry(text, {
                font: font,
                size: size,
                height: 0.1
            });
            const materials = [
                new THREE.MeshPhongMaterial({ color: 0xff6600 }), 
                new THREE.MeshPhongMaterial({ color: 0x0000ff }) 
            ];
            const textMesh = new THREE.Mesh(geometry, materials);
            textMesh.castShadow = true;
            textMesh.position.y += x;
            textMesh.position.x += y;
            textMesh.rotation.y += z;
            scene.add(textMesh);
        });    
    }
}

class Light {
    directionalLight: THREE.DirectionalLight;
    pointLight: THREE.PointLight;
    ambientLight: THREE.AmbientLight;

    initDirectionalLight = (x: number, y: number, z: number) => {
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.directionalLight.position.x += x;
        this.directionalLight.position.y += y;
        this.directionalLight.position.z += z;
        return this.directionalLight;
    }

    initPointLight = () => {
        this.pointLight = new THREE.PointLight(0xff6666, 1, 100);
        this.pointLight.castShadow = true;
        this.pointLight.shadow.mapSize.width = 4096;
        this.pointLight.shadow.mapSize.height = 4096;
        return this.pointLight;
    }

    initAmbientLight = () => {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        return this.ambientLight;
    }
}

const animate = () => {
    const now = Date.now() / 1000;
    pointLight.position.y = 15;
    pointLight.position.x = Math.cos(now) * 20;
    pointLight.position.z = Math.sin(now) * 20;
    controls.update();
    cubeCamera.update( renderer, scene );
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}


const switchTextures = (material: {texture: string, bumpMap: string}) => {
    
    baseTexture = textureLoader.load(material.texture);
    baseNormalMap = textureLoader.load(material.bumpMap);

    sphere1.material.map = baseTexture
    sphere1.material.needsUpdate = true;

    sphere2.material.map = baseTexture
    sphere2.material.bumpMap = baseNormalMap
    sphere2.material.needsUpdate = true;

    plane1.material.map = baseTexture
    plane1.material.needsUpdate = true;

    plane2.material.map = baseTexture
    plane2.material.bumpMap = baseNormalMap
    plane2.material.needsUpdate = true;
    
}

const hide = () => document.getElementById("controlsWrapper").style.display = "none";

// ************************************************************

// Managers
const objectsCreator = new Objects;
const cameraManager = new Camera;
const lightManager = new Light;
const textureLoader = new THREE.TextureLoader();

// Textures

const brick = {
    texture: "./textures/Brick_Wall_017_basecolor.jpg",
    bumpMap: "./textures/Brick_Wall_017_normal.jpg"
};

const metal = {
    texture: "./textures/Metal_Tiles_003_basecolor.jpg",
    bumpMap: "./textures/Metal_Tiles_003_normal.jpg"
};

const lava = {
    texture: "./textures/Metal_Tiles_003_basecolor.jpg",
    bumpMap: "./textures/Metal_Tiles_003_normal.jpg"
};

const grass = {
    texture: "./textures/Metal_Tiles_003_basecolor.jpg",
    bumpMap: "./textures/Metal_Tiles_003_normal.jpg"
};


let baseTexture = textureLoader.load(metal.texture);
let baseNormalMap = textureLoader.load(metal.bumpMap);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0099ff);

// Cameras
const camera = cameraManager.initCamera(0, 6, 15);
const cubeCamera = cameraManager.initCubeCamera();

// Lights
const pointLight = lightManager.initPointLight();
const ambientLight = lightManager.initAmbientLight();
scene.add(pointLight)
scene.add(ambientLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();

// Window resize
export function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

// Objects render
// ====================
// Floor
const floor = objectsCreator.renderFloor(0x0a7d15);
scene.add(floor);

// Shpere 1 - without bump map
const sphere1 = objectsCreator.renderSphere(3, 2, 0, baseTexture);
sphere1.add(cubeCamera)
scene.add(sphere1)

// Sphere 2- with bump map
const sphere2 = objectsCreator.renderSphereWithBumpMap(6, 2, 0, baseTexture, baseNormalMap);
sphere2.add(cubeCamera)
scene.add(sphere2)

// Plane 1 - without bump map
const plane1 = objectsCreator.renderPlane(-6, 2, baseTexture);
scene.add(plane1);

// Plane 2 - with bump map
const plane2 = objectsCreator.renderPlaneWithBumpMap(-3, 2, baseTexture, baseNormalMap);
scene.add(plane2);

//3D text
objectsCreator.render3DText('No\nbump',   0.4,    4.2,   -6.8,   0, scene);
objectsCreator.render3DText("With\nbump",     0.4,    4.2,   -3.8,   0, scene);
objectsCreator.render3DText("No\nbump",     0.4,    4.2,   2,    0, scene);
objectsCreator.render3DText("With\nbump",   0.4,    4.2,   5,    0, scene);


// Helper
//scene.add(new THREE.CameraHelper(camera));


document.getElementById("switchToBrickButton").addEventListener("click", () => {switchTextures(brick)} );
document.getElementById("switchToMetalButton").addEventListener("click", () => {switchTextures(metal)} );
document.getElementById("switchToLavaButton").addEventListener("click", () => {switchTextures(lava)} );
document.getElementById("switchToGrassButton").addEventListener("click", () => {switchTextures(grass)} );
document.getElementById("hideButton").addEventListener("click", hide);

renderer.domElement.style.cssText = "position: absolute; z-index: -1;";
document.body.appendChild(renderer.domElement);

animate();

