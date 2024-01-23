import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { PerspectiveCamera, AmbientLight, CubeTextureLoader, Euler, Mesh, MeshBasicMaterial, PlaneGeometry, DirectionalLight, Raycaster } from 'three';
// import { OutlinePass } from 'three-outlinepass';
import { ObjectManager } from './Components/ObjectManager.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constant.js';
import { PropertiesWindow } from './Components/Properties.js';
import { degToRad } from 'three/src/math/MathUtils.js';
import { SELECTED_OBJECT } from './Components/SelectedObject.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'


const MODEL_FILENAME = "./assets/lamp.glb"
const CANVAS_PARENT_ID = "#canvasParent";

// Basic initialization for event handling, scene setup, lights etc
const SCENE = new THREE.Scene();
const raycaster = new Raycaster();
const HIERARCHY_WINDOW = $("#leftNav");
const mouse = new THREE.Vector2();
const PROPERTY_WINDOW = $("#rightNav");
const RENDERER = new THREE.WebGLRenderer();
const PROPERTIES_WINDOW = new PropertiesWindow(PROPERTY_WINDOW);

ObjectManager.setScene(SCENE);

SCENE.background = new THREE.Color("#bbbbbb");
RENDERER.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
document.querySelector(CANVAS_PARENT_ID).appendChild(RENDERER.domElement);
document.querySelector(CANVAS_PARENT_ID).addEventListener('click', onMouseClick, false);


const camera = ObjectManager.createObject(ObjectManager.OBJECT_TYPES.CAMERA, "mainCamera", SCENE);

const transformControls = new TransformControls(camera, RENDERER.domElement);
SCENE.add(transformControls);

// Create OrbitControls
const controls = new OrbitControls(camera, RENDERER.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;


SELECTED_OBJECT.setTransformControl(transformControls);
ObjectManager.setNav(HIERARCHY_WINDOW);


// creating objects
const light = ObjectManager.createObject(ObjectManager.OBJECT_TYPES.AMBIENT_LIGHT, "ambientLight", SCENE);
const directionalLight = ObjectManager.createObject(ObjectManager.OBJECT_TYPES.DIRECTION_LIGHT, "directionalLight", SCENE);
const cube = ObjectManager.createObject(ObjectManager.OBJECT_TYPES.CUBE, "cube", SCENE);
const circle = ObjectManager.createObject(ObjectManager.OBJECT_TYPES.SPHERE, "sphere", SCENE);
// const plane = await ObjectManager.createObject(ObjectManager.OBJECT_TYPES.PLANE, "plane", SCENE);
// const customModel = await ObjectManager.createObject(ObjectManager.OBJECT_TYPES.LOAD_MODEL, null, SCENE, MODEL_FILENAME) // will always return a list
// console.log("customModel", customModel) 




// mouse click 
function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
    mouse.x = ((event.clientX - RENDERER.domElement.getBoundingClientRect().left) / CANVAS_WIDTH) * 2 - 1;
    mouse.y = - ((event.clientY - RENDERER.domElement.getBoundingClientRect().top) / CANVAS_HEIGHT) * 2 + 1;


    raycaster.setFromCamera(mouse, camera);

    // Check for intersections
    const intersects = raycaster.intersectObjects(Object.values(ObjectManager.objs));

    if (intersects.length > 0) {

        if (SELECTED_OBJECT.somethingSelected) {
            SELECTED_OBJECT.reset();
        }
        const selectedObject = intersects[0].object;

        SELECTED_OBJECT.set(intersects[0].object);

        PROPERTIES_WINDOW.updateForm(selectedObject);
    }
    else {
        if (SELECTED_OBJECT.somethingSelected) SELECTED_OBJECT.reset();

        PROPERTIES_WINDOW.updateForm(null);
    }
}



// Handle mouse click
$("body").on("click", ".sceneObjects", function () {

    const id = $(this).data("id");
    console.log("Clicked on object with id ", id);
    SELECTED_OBJECT.reset()

    const obj = ObjectManager.objs[id];

    SELECTED_OBJECT.set(obj)


    PROPERTIES_WINDOW.updateForm(SELECTED_OBJECT.obj);

})



document.addEventListener('keydown', function (event) {
    // Check if the pressed key is W, S, A, or D
    let dir = new THREE.Vector3(0, 0, 0);
    if (event.key === 'w') {
        dir = new THREE.Vector3(0, 0, -1);
    }
    else if (event.key === 's') {
        dir = new THREE.Vector3(0, 0, 1);
    }
    else if (event.key === 'a') {
        dir = new THREE.Vector3(-1, 0, 0);
    }
    else if (event.key === 'd') {
        dir = new THREE.Vector3(1, 0, 0);
    }

    camera.translateOnAxis(dir.applyQuaternion(camera.quaternion), 0.1);

});



// Animation loop
const animate = () => {
    requestAnimationFrame(animate);
    controls.update()
    RENDERER.render(SCENE, camera);
};

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
    camera.updateProjectionMatrix();
    RENDERER.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
});


transformControls.addEventListener('dragging-changed', function (event) {

    controls.enabled = !event.value;

});


animate();


