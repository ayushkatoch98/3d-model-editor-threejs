import * as THREE from 'three';



class Models {

    static setMaterialColor(obj, color){
        obj.material.color.set(color)
    }

    static getMaterialColor(obj){
        return obj.material.color;
    }

    static createCube(color){
        
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color : color});
        
        return new THREE.Mesh(geometry, material);
    }

}