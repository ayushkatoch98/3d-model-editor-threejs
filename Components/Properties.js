import { radToDeg, degToRad } from "three/src/math/MathUtils"
import { SELECTED_OBJECT } from "./SelectedObject";
import { ObjectManager } from "./ObjectManager";
const TEMPLATE = {
    transform:  {
        x : "number",
        y : "number",
        z : "number",
        methods: {
            generateHTML: (obj) => {

                if (obj?.isAmbientLight) return null;

                let output = `\
                <div class="properties-main p-2 ">
                    <h3> Transform </h3>    
                    <div class="flex flex-row items-center">
                        X <input id='d-position-1' class="d-position w-16 m-1 p-1" type="number" value="${obj.position.x}"/>
                        Y <input id='d-position-2' class="d-position w-16 m-1 p-1" type="number" value="${obj.position.y}"/>
                        Z <input id='d-position-3' class="d-position w-16 m-1 p-1" type="number" value="${obj.position.z}"/>
                    </div>
                    </div>
                `
                 
                return output;
            },

            setPosition : (newPos) => {
                $("#d-position-1").val();
                
            }
        }
    },
    scale:  {
        x : "number",
        y : "number",
        z : "number",
        methods: {
            generateHTML: (obj) => {

                if (obj?.isCamera || obj?.isLight) return null;
                let output = `\
                <div class="properties-main p-2 ">
                    <h3> Scale </h3>    
                    <div class="flex flex-row items-center">
                        X <input id='d-scale-1' class="d-scale w-16 m-1 p-1" type="number" value="${obj.scale.x}"/>
                        Y <input id='d-scale-2' class="d-scale w-16 m-1 p-1" type="number" value="${obj.scale.y}"/>
                        Z <input id='d-scale-3' class="d-scale w-16 m-1 p-1" type="number" value="${obj.scale.z}"/>
                    </div>
                    </div>
                `
                 
                return output;
            },

            setPosition : (newPos) => {
                $("#d-position-1").val();
                
            }
        }
    },
    rotation : {
        x: "number",
        y: "number",
        z: "number",
        methods: {
            generateHTML: (obj) => {

                if (obj?.isAmbientLight) return null;

                let output = `\
                <div class="properties-main p-2 ">
                    <h3> Rotation </h3>    
                    <div class="flex flex-row  items-center">
                    X <input class="d-rotation w-16 m-1 p-1" type="number" value="${radToDeg(obj.rotation.x)}"/>
                    Y <input class="d-rotation w-16 m-1 p-1" type="number" value="${radToDeg(obj.rotation.y)}"/>
                    Z <input class="d-rotation w-16 m-1 p-1" type="number" value="${radToDeg(obj.rotation.z)}"/>
                    </div>
                    </div>
                `
                return output;
            }
        }
    },
    material_color : {
        color : "string",
        methods: {
            generateHTML: (obj) => {

                if (obj?.isLight || obj?.isCamera) return null;

                let color; 
                if (obj.type == "Mesh"){
                    color = "#" + obj.material.color.getHexString();
                }
                else{
                    color = "#" + obj.color.getHexString();
                }

                let output = `\
                <div class="properties-main p-2 ">
                <h3> Material Color </h3>    
                    <div class="flex flex-row  items-center">
                        <input class="d-material m-1 p-1" type="color" value="${color}"/>

                    </div>
                    </div>
                `
                 
                return output;
            }
        }
    },

    texture: {
        texture: "image",
        methods: {
            generateHTML : function(obj){

                if (obj?.isLight || obj?.isCamera) return null;


                const extractedTexture = obj.material.map;

                // Convert the texture to a data URL
                let imageURL = extractedTexture?.image?.src

                if (!imageURL){
                    imageURL = "https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg"
                }


                let html = `\
                <div class="properties-main p-2 ">
                <h3> Texture </h3>    
                    <div class="flex flex-col items-center">
                        <input id='texture-image-upload' class="d-texture hidden m-1 p-1" type="file" multiple='false' accept='.png,.jpg,.jpeg'/>
                        <label class="w-full h-auto" for="texture-image-upload">
                            <img class='d-texture-image w-full h-auto' src='${imageURL}'/>
                        </label>
                    </div>
                </div>
                `

                return html;
            }
        }
    },
    light_color: {
        color: "string",
        methods: {


            generateHTML: (obj) => {

                if (!obj?.isLight) return null;

                let color; 
                if (obj.type == "Mesh"){
                    color = "#" + obj.material.color.getHexString();
                }
                else{
                    color = "#" + obj.color.getHexString();
                }

                let output = `\
                <div class="properties-main p-2 ">
                <h3> Light Color </h3>    
                    <div class="flex flex-row items-center">
                       <input class="d-light m-1 p-1" type="color" value="${color}"/>

                    </div>
                    </div>
                `
                return output;
            }
        }
    },

    light_intensity: {
        color: "number",
        methods: {
            
            generateHTML: (obj) => {
                
                if (!obj?.isLight) return null;
                
                let output = `\
                <div class="properties-main p-2 ">
                <h3> Light Intensity </h3>    
                    <div class="flex flex-row items-center">
                       <input class="d-intensity m-1 p-1" type="number" value="${obj.intensity}"/>

                    </div>
                    </div>
                `
                return output;
            }
        }
    }
}


export class PropertiesWindow{

    constructor(rightNav){
        this.propertyWindow = rightNav;
    }

    updateForm(selectedItem){

        if (selectedItem == null){
            $(this.propertyWindow).empty().append("<h3 class='text-center'>Properties</h3>");
            
            return;
        }

        let html = "<h3 class='text-center'>Properties</h3>"
        console.log("running props for ", selectedItem);
        for (const key in TEMPLATE){

            if (selectedItem.type == "Object3D" || selectedItem.type == "TransformControlsPlane" || selectedItem.type == "Line"){
                console.log("selected item is Object3D", selectedItem);
                break;
            }
  
        
            const temp = TEMPLATE[key].methods.generateHTML(selectedItem);
            if (temp != null) html += temp;

        }

        $(this.propertyWindow).empty().append(html);



    }

}

$(document).on('input', '.d-position', function(){
    console.log("running");
    console.log("OKAY", $($(".d-position")[0]).val())
    const x = $($(".d-position")[0]).val();
    const y = $($(".d-position")[1]).val();
    const z = $($(".d-position")[2]).val();
    SELECTED_OBJECT.obj.position.set(x,y,z);
})


$(document).on('input', '.d-scale', function(){
    console.log("running");
    console.log("OKAY", $($(".d-scale")[0]).val())
    const x = $($(".d-scale")[0]).val();
    const y = $($(".d-scale")[1]).val();
    const z = $($(".d-scale")[2]).val();
    SELECTED_OBJECT.obj.scale.set(x,y,z);
})



$(document).on('input', '.d-rotation', function(){
    console.log("running");
    console.log("OKAY", $($(".d-rotation")[0]).val())
    const x = degToRad(parseFloat($($(".d-rotation")[0]).val()));
    const y = degToRad(parseFloat($($(".d-rotation")[1]).val()));
    const z = degToRad(parseFloat($($(".d-rotation")[2]).val()));

    SELECTED_OBJECT.obj.rotation.x = x;
    SELECTED_OBJECT.obj.rotation.y = y;
    SELECTED_OBJECT.obj.rotation.z = z;
})


$(document).on("change" , ".d-texture", function(){
    var fileInput = this;

    if (fileInput.files.length > 0) {
        var selectedFile = fileInput.files[0];
        var reader = new FileReader();

        reader.onload = async function (e) {
            var fileURL = e.target.result;
            
            ObjectManager.applyTexture(fileURL, SELECTED_OBJECT.obj)
            
        };

        // Read the file as a data URL
        reader.readAsDataURL(selectedFile);
    }
})

$(document).on('input', '.d-material', function(){
    const col = $($(".d-material")[0]).val();
    
    SELECTED_OBJECT.obj.material.color.set(col);
})

$(document).on('input', '.d-light', function(){
    const col = $($(".d-light")[0]).val();
    
    SELECTED_OBJECT.obj.color.set(col);
})


$(document).on('input', '.d-intensity', function(){
    const val = $($(".d-intensity")[0]).val();
    SELECTED_OBJECT.obj.intensity = val;
})
