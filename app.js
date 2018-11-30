/* Cube Ripple */

let w = window.innerWidth;
let h = window.innerHeight;
let con1 = 0;
let con2 = 30;
let con3 = 4;

let grid = 6;


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

for (let x = 0; x < grid; x++) {
    for (let y = 0; y < grid; y++) {
        for (let z = 0; z < grid; z++) {
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
    if (Math.random() < -.375) {
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

    let count = 0;

    for (let i = 0; i < cubes.length; i++) {
        let c = cubes[i];

        if (c.live) {
            count++;
        }

        c.live = ProcessRule(c, i);


        if (c.live) {

            let v = Math.sin(t / 1000 + c.home.x) * 0.5 + 0.5;
            v *= 2;

            let x = c.home.x + c.move.x // * v;
            let y = c.home.y + c.move.y // * v;
            let z = c.home.z + c.move.z // * v;

            c.mesh.position.set(x, y, z);
        }
    }

    console.log(count);
    count = 0;


    renderer.render(scene, camera);

    requestAnimationFrame(draw);
}

requestAnimationFrame(draw);


function ProcessRule(c, i) {
    let liveNeighbours = 0;
    let index = i;

    //TODO : Calc Neighbours

    //index = xCord + (yCord * maxX) + (zCord * maxX *maxY)
    //Inverse : 
    //xCord = i % maxX
    //yCord = (i / maxX) % maxY
    //zCord = i / (maxX * maxY)

    //Processing neighbours 
    //Process index as (x,y,z)
    //process:
    // (x-1,y, z), (x+1, y, z), (x, y, z-1), (x, y,z+1), 
    // (x-1, y, z-1), (x-1, y, z+1), (x+1, y, z-1), (x+1, y, z+1) 

    // (x-1,y+1, z), (x+1, y+1, z), (x, y+1, z-1), (x, y+1,z+1), 
    // (x-1, y+1, z-1), (x-1, y+1, z+1), (x+1, y+1, z-1), (x+1, y+1, z+1) 

    // (x-1,y-1, z), (x+1, y-1, z), (x, y-1, z-1), (x, y-1,z+1), 
    // (x-1, y-1, z-1), (x-1, y-1, z+1), (x+1, y-1, z-1), (x+1, y-1, z+1)

    //(x, y-1, z), (x, y+1, z)





    //Get Index Coords
    let x, y, z;
    x = c.home.x;
    y = c.home.y;
    z = c.home.z;

    let xCord, yCord, zCord;

    //Loop through all 26 neighbours
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            for (let k = -1; k <= 1; k++) {

                xCord = x + i;
                yCord = y + j;
                zCord = z + k;

                if (xCord == grid) {
                    xCord = 0;
                } else if (xCord == -1) {
                    xCord = grid - 1;
                }

                if (yCord == grid) {
                    yCord = 0;
                } else if (yCord == -1) {
                    yCord = grid - 1;
                }

                if (zCord == grid) {
                    zCord = 0;
                } else if (zCord == -1) {
                    zCord = grid - 1;
                }

                let neighbourIndex = xCord + (yCord * grid) + (zCord * grid * grid);
                if (cubes[neighbourIndex].live == true && neighbourIndex != index) {
                    liveNeighbours++;
                }
            }
        }
    }

    //console.log(liveNeighbours);
    //if(c.live){console.log("er");}

    //Process

    if (c.live) {
        if (liveNeighbours < 0 || liveNeighbours > 30) {
            return false;
        }
    } else {
        if (liveNeighbours == con3)
            return true;
    }
    
    return true;
}
