/* Cube Ripple */

let w = window.innerWidth;
let h = window.innerHeight;
let con1 = 5;
let con2 = 9;
let con3 = 4;



function rand(min, max) {
    return min + Math.random() * (max - min);
}

// three.js object setup
// We'll define here as globals that we can reference elsewhere

// Our main renderer. three.js provides a few different renderers,
// but we'll use the WebGL one here.
// We use the renderer to render the scene together with a camera object.
let renderer = new THREE.WebGLRenderer();

// Our Scene object holds our scene graph with everything we want to render
// e.g., meshes, lights, cameras, etc.
let scene = new THREE.Scene();
scene.background = new THREE.Color(0x000066)

// Controls the view frustrum:
// https://en.wikipedia.org/wiki/Viewing_frustum
// 
// The parameters here are fov (field of view angle), aspect ratio, 
// distance of the near plane, and distance of the far plane
let camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 45;

// let's add the renderer's domElement to the body at run-time
document.body.appendChild(renderer.domElement);

// LIGHTS
// global illumination using a low intensity white color
let ambient = new THREE.AmbientLight(0x606060);
scene.add(ambient);

let light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(1, 2, 50);
scene.add(light);

// var hemiLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
// scene.add(hemiLight);


////GG NO EDIT ^^^


/* CUBES - create them here */

let cubeGroup = new THREE.Group();
let cubes = [];
let nextGen = [];

for (let x = -5; x < 5; x++) {
    for (let y = -5; y < 5; y++) {
        for (let z = -5; z < 5; z++) {
            let geometry = new THREE.BoxGeometry(1, 1, 1);
            let material = new THREE.MeshLambertMaterial({
                color: 0x0066ff
            });
            let cube = new THREE.Mesh(geometry, material);
            cube.position.set(x, y, z);
            cubeGroup.add(cube);
            cubes.push({
                mesh: cube,
                home: new THREE.Vector3(x, y, z),
                move: new THREE.Vector3(x, y, z).multiplyScalar(1 / 2),
                live: true
            })
        }
    }
}

// Add our mesh to the scene
scene.add(cubeGroup);
nextGen = cubes;


for (let i = 0; i < cubes.length; i++) {
    if (Math.random() < .375) {
        cubes[i].live = false;
    }
}



/* UTILITY CODE */

/* use to update global w and h and reset canvas width/height */
function updateCanvasSize() {
    w = window.innerWidth;
    h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
}
updateCanvasSize();
window.addEventListener('resize', updateCanvasSize);

/* MAIN DRAWING CODE */


function draw(t) {

    cubeGroup.rotation.x = Math.sin(t / 2000);
    cubeGroup.rotation.y = Math.sin(t / 3000);



    for (let i = 0; i < cubes.length; i++) {
        let c = cubes[i];
        c.live = ProcessRule(c);

        if (c.live) {

            let v = Math.sin(t / 1000 + c.home.x) * 0.5 + 0.5;
            v *= 2;

            let x = c.home.x + c.move.x // * v;
            let y = c.home.y + c.move.y // * v;
            let z = c.home.z + c.move.z // * v;

            c.mesh.position.set(x, y, z);
        }
    }
    // cube.scale.set(v,v,v)

    renderer.render(scene, camera);

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);


function ProcessRule(cell) {
    let liveNeighbours = 0;
    let index = c.home;

    //TODO : Calc Neighbours


    //Process

    if (c.live) {
        if (liveNeighbours < con1 || liveNeighbours > con2) {
            c.live = false;
        }
    } else {
        if (liveNeighbours == con3)
            c.live = true;
    }



}
