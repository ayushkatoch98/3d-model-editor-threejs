import * as THREE from 'three'


export class SELECTED_OBJECT{
    static somethingSelected = false;
    static original_color = "";
    static id = "";
    static obj = null;
    static outlinePass;
    static transformControl;

    static setTransformControl(transformControl){
        this.transformControl = transformControl;
    }

    static set(obj){
        
        this.somethingSelected = true;
        this.obj = obj;
        this.id = obj.id;

        if (this.obj.isLight){

            this.original_color = this.obj.color.getHexString()
            this.transformControl.attach(this.obj)
            
        }
        else if (this.obj.type == "Mesh"){
            this.original_color = "#" + this.obj.material.color.getHexString();
            // this.obj.material.color.set("#00ff00");
            this.obj.material.wireframe = false;
            this.transformControl.attach(this.obj)
        }
        else {
            // main cam
            console.log("SELECTED MAIN CAMERA")
            
        }
        
    }

    static reset(){
        
        this.somethingSelected = false;
        if (this.obj != null) {
            if (this.obj.type == "Mesh"){
                // this.obj.material.color.set(this.original_color);
                this.obj.material.wireframe = false;
            }

            this.transformControl.detach();
            // this.transformControl.dispose();
        }
        
        this.obj = null;

        // console.log("deselected" , this);
    }
}