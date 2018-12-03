/* Cube Ripple */

let w = window.innerWidth;
let h = window.innerHeight;
let EnviroL = 10;
let EnviroU = 21;
let FertL = 10;
let FertU = 21;

let grid = 17;
let cyclic = true;
let process = 12;
let count = process;
let loop = 1;

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
scene.background = new THREE.Color(0xBEEEE5)

// Controls the view frustrum:
// https://en.wikipedia.org/wiki/Viewing_frustum
// 
// The parameters here are fov (field of view angle), aspect ratio, 
// distance of the near plane, and distance of the far plane
let camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 75;
camera.position.x += 15;

// let's add the renderer's domElement to the body at run-time
document.body.appendChild(renderer.domElement);

// LIGHTS
// global illumination using a low intensity white color
let ambient = new THREE.AmbientLight(0xFAAAAA);
scene.add(ambient);

let light = new THREE.PointLight(0xFAAAAA, 1, 100);
light.position.set(5
                   -5, 2, 50);
scene.add(light);

// var hemiLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
// scene.add(hemiLight);


////GG NO EDIT ^^^


/* CUBES - create them here */

let cubeGroup = new THREE.Group();
let cubes = [];

for (let x = 0; x < grid; x++) {
    for (let y = 0; y < grid; y++) {
        for (let z = 0; z < grid; z++) {
            let geometry = new THREE.BoxGeometry(1, 1, 1);
            let material = new THREE.MeshLambertMaterial({
                color: 0xEEEEEE
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
    if (Math.random() < .1375) {
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
    cubeGroup.rotation.z = Math.cos(t / 1500);




    if (count >= process) {


        for (let i = 0; i < cubes.length; i++) {
            let c = cubes[i];

            c.live = ProcessRule(c, i);

            if (c.live) {

                let v = Math.sin(t / 1000 + c.home.x) * 0.5 + 0.5;
                v *= 2;

                let x = c.home.x + c.move.x // * v;
                let y = c.home.y + c.move.y // * v;
                let z = c.home.z + c.move.z // * v;

                c.mesh.position.set(x, y, z);
                c.mesh.scale.set(1, 1, 1);
            } else {
                c.mesh.scale.set(0.001, 0.001, 0.001);
            }
        }
        //console.log(count);
        count = 0;
    }

    count++;


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

    if (cyclic) {

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
    } else {
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                for (let k = -1; k <= 1; k++) {

                    xCord = x + i;
                    yCord = y + j;
                    zCord = z + k;

                    if (xCord - 1 >= 0 && y - 1 >= 0 && z - 1 >= 0) {
                        let neighbourIndex = xCord + (yCord * grid) + (zCord * grid * grid);
                        if (cubes[neighbourIndex].live == true && neighbourIndex != index) {
                            liveNeighbours++;
                        }
                    }

                    if (yCord - 1 >= 0 && yCord + 1 <= grid && zCord - 1 >= 0 && zCord + 1 <= grid) {
                        let neighbourIndex = xCord + (yCord * grid) + (zCord * grid * grid);
                        if (cubes[neighbourIndex].live == true && neighbourIndex != index) {
                            liveNeighbours++;
                        }
                    }

                    if (xCord + 1 < grid && yCord + 1 < grid && zCord + 1 < grid) {
                        let neighbourIndex = xCord + (yCord * grid) + (zCord * grid * grid);
                        if (cubes[neighbourIndex].live == true && neighbourIndex != index) {
                            liveNeighbours++;
                        }
                    }
                }
            }
        }
    }



    //Process


    if (c.live) {
        if (liveNeighbours < EnviroL || liveNeighbours > EnviroU) {
            return false;
        } else return true;
    } else {
        if (liveNeighbours >= FertL && liveNeighbours <= FertU)
            return true;
        else return false;
    }
}
