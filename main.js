import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const canvas = document.querySelector( '#c' );
const  scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
    alpha: true,
});
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

//Add background Texture
const loader = new THREE.TextureLoader();
const bgTexture = loader.load('images/panorama.jpg', 
    () => {
        bgTexture.mapping = THREE.EquirectangularReflectionMapping;
        bgTexture.colorSpace = THREE.SRGBColorSpace;
        scene.background = bgTexture;
    }
);

//Add cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshPhongMaterial( { color: 0x44aa88 } );
const cube = new THREE.Mesh( geometry, material );

scene.add(cube);

camera.position.z = 3;


//Camera controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();

// Adding light to the cube
const color = 0xFFFFFF;
const intensity = 3;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

function animate(time) {
    cube.rotation.x = time / 2000;
    cube.rotation.y = time / 1000;
    // Set the repeat and offset properties of the background texture
    // to keep the image's aspect correct.
    // Note the image may not have loaded yet.
    const canvasAspect = canvas.clientWidth / canvas.clientHeight;
    const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
    const aspect = imageAspect / canvasAspect;
    
    bgTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0;
    bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1;
    
    bgTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2;
    bgTexture.repeat.y = aspect > 1 ? 1 : aspect;
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate)
