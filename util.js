import * as THREE from 'three';

export const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}


export const radToDeg = function (rad){
    return rad * (180 / Math.PI);

}

export const degreesToRadians = function(deg) {
    return deg * (Math.PI / 180);
}
