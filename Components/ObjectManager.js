import * as THREE from 'three';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constant.js'
import { PerspectiveCamera, TextureLoader, SpotLight, AmbientLight, Euler, BoxGeometry, Mesh, MeshPhongMaterial, PlaneGeometry, DirectionalLight, Raycaster } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { SELECTED_OBJECT } from './SelectedObject.js';


export class ObjectManager {
    static objs = {}
    static loader = new GLTFLoader();

    static OBJECT_TYPES = {
        DIRECTION_LIGHT: 0,
        AMBIENT_LIGHT: 1,
        PLANE: 2,
        CUBE: 3,
        CAMERA: 4,
        LOAD_MODEL: 5,
        CUBE: 6,
        SPHERE: 7,
        SPOT_LIGHT: 8,
    }
    static scene;
    static nav;
    static setScene(scene) {
        this.scene = scene;
    }
    static setNav(nav) {
        this.nav = nav;
        console.log("leftNav", nav);
    }

    static applyTexture(filename, obj){
        const texture = new TextureLoader().load(filename);
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        
        const material = new MeshPhongMaterial({map: texture});
        obj.material = material;
    }

    static createObject(objectType, name, scene) {
        let newObj = null;
        switch (objectType) {
            case this.OBJECT_TYPES.CAMERA: {
                newObj = new PerspectiveCamera(75, CANVAS_WIDTH / CANVAS_HEIGHT, 0.1, 1000);
                newObj.position.z = 5;
                break;
            }
            case this.OBJECT_TYPES.AMBIENT_LIGHT: {
                newObj = new THREE.AmbientLight("#ffffff", 1)
                newObj.name = "ambient-light";
                break;
            }
            case this.OBJECT_TYPES.DIRECTION_LIGHT: {
                newObj = new DirectionalLight("#ffffff", 1);
                newObj.position.x = 2;
                newObj.castShadow = true;
                newObj.name = "directional-light"
                newObj.shadowMapVisible = true;
                //Set up shadow properties for the light
                newObj.shadow.mapSize.width = 512; // default
                newObj.shadow.mapSize.height = 512; // default
                newObj.shadow.camera.near = 0.5; // default
                newObj.shadow.camera.far = 500; // default
                break;
            }

            case this.OBJECT_TYPES.PLANE: {
                // Create a plane geometry
                const planeGeometry = new PlaneGeometry(5, 5);

                const planeMaterial = new MeshPhongMaterial({ color: "#ffffff", side: THREE.DoubleSide });


                // Create a mesh using the geometry and material
                newObj = new Mesh(planeGeometry, planeMaterial);
                newObj.rotation.x = -Math.PI / 2; // -90 degrees in radians
                // newObj.castShadow = true;
                newObj.receiveShadow = true;
                break;
            }

            case this.OBJECT_TYPES.CUBE: {

                let geometry = new BoxGeometry();
                let material = new MeshPhongMaterial({ color: "#ffffff" });
                newObj = new Mesh(geometry, material);
                break;

            }

            case this.OBJECT_TYPES.SPHERE: {
                let geometry = new THREE.SphereGeometry();
                let material = new MeshPhongMaterial({ color: "#ffffff" });
                newObj = new Mesh(geometry, material);
                break;
            }

            case this.OBJECT_TYPES.SPOT_LIGHT:{ 
                newObj = new SpotLight("#ffffff" , 1);
                newObj.position.set(2, 2, 2);
                break;
            }

            default: {
                console.error("Object of type ",  type , "doesnt exists" );
                break;
            }
        }


        if (newObj == null) {
            throw new Error("Object of Type", objectType, "doesnt exists");
        }

        if (objectType != this.OBJECT_TYPES.LOAD_MODEL) {
            newObj.name = name;
            scene.add(newObj);
            this.addNewObject(newObj);
        }

        return newObj;
    }

    static async importCustomModel(scene, fileName = null) {
        let newObj = null;
        newObj = await this.loadCustomModel(fileName, scene);



        return newObj;
    }

    static async loadCustomModel(fileName, scene) {
        const gltf = await this.loader.loadAsync(fileName)
        // this.loader.load(fileName, 
        console.log("WOW",)
        console.log("file", gltf);
        gltf.scene.scale.set(1, 1, 1); // Adjust the scale as needed

        const modelScene = gltf.scene;

        // SCENE.add(gltf.scene);
        const newObjects = []
        let i = 0;
        if (modelScene != undefined) {

            for (const item of modelScene.children) {
                if (item.name == null || item.name == "") {
                    item.name = "random-name";
                }
                scene.add(item)
                this.addNewObject(item);
                newObjects.push(item);
                i++;
            }

            console.log("Total objects loaded", i);
        }

        console.log("Object Manager", this.objs);
        return newObjects;
        // animate()



    }
    static updateNav() {

        let html = "<h3 class='text-center p-1 m-1 w-full'>Hierarchy</h3>"
        for (const key in this.objs) {

            html += "<div class=' text-left w-full hover:bg-gray-600 bg-gray-100 p-1 w-full m-1 sceneObjects' data-id = '" + this.objs[key].id + "'> " + this.objs[key].name + "  </div>"

        }

        $(this.nav).empty().append(html)


    }

    static addNewObject(object) {
        console.log("Added new Object", object.name)
        this.objs[object.id] = object;
        this.updateNav();
    }




}

function capitalizeWords(str) {
    let words = str.split(' ');
    let capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
    let result = capitalizedWords.join(' ');

    return result;
}

$(document).ready(function () {
    let html = "";

    for (const key in ObjectManager.OBJECT_TYPES) {
        
        if (key == "LOAD_MODEL") continue;
        html += ` 
            <li class="py-2  hover:bg-gray-200">
                <a class="w-full addNewObject " data-type="${key}" id="addPlane"> ${capitalizeWords(key.replace("_", " ").toLowerCase())} </a>
            </li>
        `;

    }

    html += `<li class="py-2  hover:bg-gray-200">
                <input type="file" class="hidden" multiple="false" accept=".glb" id="importModel"
                    value="Import Model" placeholder="Import Model" />
                <label class="w-max" for="importModel">Import</label>
            </li>`

    $("#objectList").empty().append(html);
})


$("body").on("click", ".addNewObject", function () {
    const type = $(this).data("type");
    ObjectManager.createObject(ObjectManager.OBJECT_TYPES[type.toUpperCase()], type, ObjectManager.scene);
})

$("body").on('change', "#importModel", async function () {
    var fileInput = this;

    if (fileInput.files.length > 0) {
        var selectedFile = fileInput.files[0];
        var reader = new FileReader();

        reader.onload = async function (e) {
            var fileURL = e.target.result;
            console.log('File URL:', fileURL);
            await ObjectManager.importCustomModel(ObjectManager.scene, fileURL);
            // You can use the fileURL as needed, e.g., display an image:
            // var img = $('<img>').attr('src', fileURL);
            // $('body').append(img);
        };

        // Read the file as a data URL
        reader.readAsDataURL(selectedFile);
    }
});

