import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class Camera {
  camera: THREE.PerspectiveCamera;
  cubeCamera: THREE.CubeCamera;

  initCamera = (x: number, y: number, z: number) => {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
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
      encoding: THREE.sRGBEncoding,
    });
    this.cubeCamera = new THREE.CubeCamera(1, 10000, cubeRenderTarget);
    return this.cubeCamera;
  };
}

class Objects {
  private fontLoader = new THREE.FontLoader();

  renderSphere = (x: number, y: number, z: number, texture: THREE.Texture) => {
    let material = new THREE.MeshStandardMaterial({ map: texture });
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 512, 512),
      material
    );
    sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv;
    sphere.position.y = y;
    sphere.position.x = x;
    sphere.position.z = z;
    return sphere;
  };

  renderSphereWithBumpMap = (
    x: number,
    y: number,
    z: number,
    texture: THREE.Texture,
    normalMap: THREE.Texture
  ) => {
    const shpereProps = {
      map: texture,
      normalMap: normalMap,
    };
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 512, 512),
      new THREE.MeshStandardMaterial(shpereProps)
    );
    sphere.geometry.attributes.uv2 = sphere.geometry.attributes.uv;
    sphere.position.y = y;
    sphere.position.x = x;
    sphere.position.z = z;
    return sphere;
  };

  renderPlane = (x: number, y: number, texture: THREE.Texture) => {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, map: texture })
    );
    plane.position.y = y;
    plane.position.x = x;
    plane.rotation.x = -0.2;
    return plane;
  };

  renderPlaneWithBumpMap = (
    x: number,
    y: number,
    texture: THREE.Texture,
    normalMap: THREE.Texture
  ) => {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(5, 5),
      new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        map: texture,
        normalMap: normalMap,
      })
    );
    plane.position.y = y;
    plane.position.x = x;
    plane.rotation.x = -0.2;
    return plane;
  };

  renderFloor = (texture: THREE.Texture, normalMap: THREE.Texture) => {
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30, 1),
      new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        map: texture,
        normalMap: normalMap,
      })
    );
    plane.rotation.x = -Math.PI / 2;
    return plane;
  };

  render3DText = (
    text: string,
    size: number,
    x: number,
    y: number,
    z: number,
    scene: THREE.Scene
  ) => {
    this.fontLoader.load("./fonts/font.json", (font) => {
      const geometry = new THREE.TextGeometry(text, {
        font: font,
        size: size,
        height: 0.1,
      });
      const materials = [
        new THREE.MeshPhongMaterial({ color: 0xff6600 }),
        new THREE.MeshPhongMaterial({ color: 0x0000ff }),
      ];
      const textMesh = new THREE.Mesh(geometry, materials);
      textMesh.castShadow = true;
      textMesh.position.y += x;
      textMesh.position.x += y;
      textMesh.rotation.y += z;
      scene.add(textMesh);
    });
  };
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
  };

  initPointLight = () => {
    this.pointLight = new THREE.PointLight(0xff6666, 1.5, 100);
    this.pointLight.castShadow = true;
    this.pointLight.shadow.mapSize.width = 4096;
    this.pointLight.shadow.mapSize.height = 4096;
    return this.pointLight;
  };

  initAmbientLight = () => {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    return this.ambientLight;
  };
}

const animate = () => {
  const now = Date.now() / speed;
  pointLight.position.y = 10;
  pointLight.position.x = Math.cos(now) * 15;
  pointLight.position.z = Math.sin(now) * 15;
  controls.update();
  cubeCamera.update(renderer, scene);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

const switchTextures = (material: { texture: string; normalMap: string }) => {
  baseTexture = textureLoader.load(material.texture);
  baseNormalMap = textureLoader.load(material.normalMap);

  sphere1.material.map = baseTexture;
  sphere1.material.needsUpdate = true;

  sphere2.material.map = baseTexture;
  sphere2.material.normalMap = baseNormalMap;
  sphere2.material.needsUpdate = true;

  plane1.material.map = baseTexture;
  plane1.material.needsUpdate = true;

  plane2.material.map = baseTexture;
  plane2.material.normalMap = baseNormalMap;
  plane2.material.needsUpdate = true;
};

const hideControls = () => {
  if (areControlsHidden) {
    document.getElementById("controlsInfo").style.display = "flex";
    document.getElementById("hideParagraph").innerHTML = "Zamknij";
    areControlsHidden = false;
  } else {
    document.getElementById("controlsInfo").style.display = "none";
    document.getElementById("hideParagraph").innerHTML = "Pokaż";
    areControlsHidden = true;
  }
};

const hideOptions = () => {
  if (areOptionsHidden) {
    document.getElementById("optionsWrapper").style.display = "block";
    document.getElementById("hideOptionsParagraph").innerHTML = "Zamknij";
    areOptionsHidden = false;
  } else {
    document.getElementById("optionsWrapper").style.display = "none";
    document.getElementById("hideOptionsParagraph").innerHTML = "Pokaż";
    areOptionsHidden = true;
  }
};

const controlLightSpeed = (increse: boolean) => {
  if (increse) {
    speed -= 100;
  } else {
    speed += 100;
  }
};

// ************************************************************

// Managers
const objectsCreator = new Objects();
const cameraManager = new Camera();
const lightManager = new Light();
const textureLoader = new THREE.TextureLoader();

// Textures
let areControlsHidden = false;
let areOptionsHidden = false;

const brickPath = {
  texture: "./textures/Brick_Wall_017_basecolor.jpg",
  normalMap: "./textures/Brick_Wall_017_normal.jpg",
};

const metalPath = {
  texture: "./textures/Metal_Tiles_003_basecolor.jpg",
  normalMap: "./textures/Metal_Tiles_003_normal.jpg",
};

const leatherPath = {
  texture: "./textures/Leather_Padded_001_basecolor.jpg",
  normalMap: "./textures/Leather_Padded_001_normal.jpg",
};

const woodPath = {
  texture: "./textures/Wood_Ceiling_Coffers_002_basecolor.jpg",
  normalMap: "./textures/Wood_Ceiling_Coffers_002_normal.jpg",
};

const stonePath = {
  texture: "./textures/Pebbles_027_BaseColor.jpg",
  normalMap: "./textures/Pebbles_027_Normal.jpg",
};

const floorPath = {
  texture: "./textures/Stylized_Stone_Floor_005_basecolor.jpg",
  normalMap: "./textures/Stylized_Stone_Floor_005_normal.jpg",
};

let baseTexture = textureLoader.load(stonePath.texture);
let baseNormalMap = textureLoader.load(stonePath.normalMap);

let floorTexture = textureLoader.load(floorPath.texture);
let floorNormalMap = textureLoader.load(floorPath.normalMap);

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
scene.add(pointLight);
scene.add(ambientLight);
let speed = 1000;

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
window.addEventListener("resize", onWindowResize);

// Objects render
// ====================
// Floor
const floor = objectsCreator.renderFloor(floorTexture, floorNormalMap);
scene.add(floor);

// Shpere 1 - without bump map
const sphere1 = objectsCreator.renderSphere(3, 3, 0, baseTexture);
sphere1.add(cubeCamera);
scene.add(sphere1);

// Sphere 2- with bump map
const sphere2 = objectsCreator.renderSphereWithBumpMap(
  9,
  3,
  0,
  baseTexture,
  baseNormalMap
);
sphere2.add(cubeCamera);
scene.add(sphere2);

// Planes
const plane1 = objectsCreator.renderPlane(-10, 3, baseTexture);
scene.add(plane1);

const plane2 = objectsCreator.renderPlaneWithBumpMap(
  -4,
  3,
  baseTexture,
  baseNormalMap
);
scene.add(plane2);

//3D text
objectsCreator.render3DText("No\nnormalMap", 0.6, 7.5, -12.2, 0, scene);
objectsCreator.render3DText("With\nnormalMap", 0.6, 7.5, -6.2, 0, scene);
objectsCreator.render3DText("No\nnormalMap", 0.6, 7.5, 1.2, 0, scene);
objectsCreator.render3DText("With\nnormalMap", 0.6, 7.5, 6.2, 0, scene);

// Helper
const pointLightHelper = new THREE.PointLightHelper(pointLight, 2);
scene.add(pointLightHelper);

document.getElementById("switchToBrickButton").addEventListener("click", () => {
  switchTextures(brickPath);
});
document.getElementById("switchToMetalButton").addEventListener("click", () => {
  switchTextures(metalPath);
});
document.getElementById("switchToWoodButton").addEventListener("click", () => {
  switchTextures(woodPath);
});
document.getElementById("switchToStoneButton").addEventListener("click", () => {
  switchTextures(stonePath);
});
document
  .getElementById("switchToLeatherButton")
  .addEventListener("click", () => {
    switchTextures(leatherPath);
  });

document.getElementById("speedUpButton").addEventListener("click", () => {
  controlLightSpeed(true);
});
document.getElementById("speedDownButton").addEventListener("click", () => {
  controlLightSpeed(false);
});

document.getElementById("hideButton").addEventListener("click", hideControls);
document
  .getElementById("hideOptionsParagraph")
  .addEventListener("click", hideOptions);

renderer.domElement.style.cssText = "position: absolute; z-index: -1;";
document.body.appendChild(renderer.domElement);

animate();
