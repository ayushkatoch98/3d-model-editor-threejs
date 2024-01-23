import { radToDeg, degToRad } from "three/src/math/MathUtils"
import { SELECTED_OBJECT } from "./SelectedObject";
const TEMPLATE = {
    transform:  {
        x : "number",
        y : "number",
        z : "number",
        methods: {
            generateHTML: (obj) => {
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
    rotation : {
        x: "number",
        y: "number",
        z: "number",
        methods: {
            generateHTML: (obj) => {
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
                        <input class="d-material m-1 p-1" type="text" value="${color}"/>

                    </div>
                    </div>
                `
                 
                return output;
            }
        }
    },
    light_color: {
        color: "string",
        methods: {
            
            generateHTML: (obj) => {

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
                       <input class="d-light m-1 p-1" type="text" value="${color}"/>

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
        for (const key in TEMPLATE){

            if (selectedItem.type == "Object3D" || selectedItem.type == "TransformControlsPlane" || selectedItem.type == "Line"){
                console.log("selected item is Object3D", selectedItem);
                break;
            }
            if (selectedItem?.isDirectionalLight && key == "material_color"){
                continue;
            }

            if (selectedItem?.isAmbientLight && (key == "transform" || key == "rotation" || key == "material_color")){
                continue;
            }

            if (selectedItem.type == "Mesh" && (key == "light_color" || key == "light_intensity")){
                continue
            }

            if (selectedItem.isCamera && (key == "material_color" || key == "light_color" || key == "light_intensity")){
                continue;
            }

            console.log("running props for ", selectedItem);

            html += TEMPLATE[key].methods.generateHTML(selectedItem);

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
