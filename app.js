/* Game of Life 3D */

window.onload = function () {

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
    let renderer;
    let myCanvas = document.getElementById('myCanvas');
    let afterimagePass;
    let ambient;
    let light;
    
    let params = {
        Enable_Post_Proccessing: false,
        fullGlitch: false,
        blockColour: 0xBEEEE5,
        AmbientlightColour: 0xFAAAAA,
        PointLightColour: 0xFAAAAA,
        backgroundColour: 0xBEEEE5,
        DieHigh: EnviroU,
        DieLow: EnviroL,
        BornHigh: FertU,
        BornLow: FertL,
        rule: 0,
        rules: [[10, 21, 10, 21],[4,5,5,5],[5,7,6,6],[4,5,2,6],[5,6,5,5],[2,3,3,3]]
    };
    
    let defaults =
        {
            def_Block: params.blockColour,
            def_Ambient: params.AmbientlightColour,
            def_Point: params.PointLightColour,
            def_Back: params.backgroundColour,
            def_DieLow: EnviroL,
            def_DieHigh: EnviroU,
            def_BirthLow: FertL,
            def_BirthHigh: FertU
        }



    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    // three.js object setup
    // We'll define here as globals that we can reference elsewhere

    // Our main renderer. three.js provides a few different renderers,
    // but we'll use the WebGL one here.
    // We use the renderer to render the scene together with a camera object.
    renderer = new THREE.WebGLRenderer({
        canvas: myCanvas,
        antialias: true
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Our Scene object holds our scene graph with everything we want to render
    // e.g., meshes, lights, cameras, etc.
    let scene = new THREE.Scene();
    scene.background = new THREE.Color(params.backgroundColour)

    // Controls the view frustrum:
    // https://en.wikipedia.org/wiki/Viewing_frustum
    // 
    // The parameters here are fov (field of view angle), aspect ratio, 
    // distance of the near plane, and distance of the far plane
    let camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
    camera.position.z = 65;
    camera.position.x += 0;

    // let's add the renderer's domElement to the body at run-time
    document.body.appendChild(renderer.domElement);

    // LIGHTS
    // global illumination using a low intensity white color
    ambient = new THREE.AmbientLight(params.AmbientlightColour);
    scene.add(ambient);

    light = new THREE.PointLight(params.PointLightColour, 1, 70);
    light.position.set(5 -
        5, 2, 50);
    scene.add(light);


    ////GG NO EDIT ^^^


    /* CUBES - create them here */

    let cubeGroup = new THREE.Group();
    let cubes = [];

    for (let x = 0; x < grid; x++) {
        for (let y = 0; y < grid; y++) {
            for (let z = 0; z < grid; z++) {
                let geometry = new THREE.BoxGeometry(1, 1, 1);
                let material = new THREE.MeshLambertMaterial({
                    color: params.blockColour
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


    let composer = new THREE.EffectComposer(renderer);

    composer.addPass(new THREE.RenderPass(scene, camera));


    afterimagePass = new THREE.AfterimagePass();

    composer.addPass(afterimagePass);

    let glitchPass = new THREE.GlitchPass();
    glitchPass.renderToScreen = true;
    composer.addPass(glitchPass);


    for (let i = 0; i < cubes.length; i++) {
        if (Math.random() < .1375) {
            cubes[i].live = false;
        }
    }
    

    CreateGUI();

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
        
        console.log(params.DieHigh);
       

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
        
        glitchPass.goWild = params.fullGlitch;

        if (params.Enable_Post_Proccessing) {
            composer.render(renderer);
        }
        else{
            renderer.render(scene, camera);
        }
        
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
            if (liveNeighbours < params.DieLow || liveNeighbours > params.DieHigh) {
                return false;
            } else return true;
        } else {
            if (liveNeighbours >= params.BornLow && liveNeighbours <= params.BornHigh)
                return true;
            else return false;
        }
    }
    
    function Update()
    {
        light.color.setHex(params.PointLightColour);
    }
    
    function UpdateAsRule()
    {
                
        params.BornLow = params.rules[params.rule][0];
        params.BornHigh = params.rules[params.rule][1];
        params.DieLow = params.rules[params.rule][2];
        params.DieHigh = params.rules[params.rule][3];
        
    }


    function CreateGUI() {
        let gui = new dat.GUI({
            name: "Controls",
            width: 400
        });
        gui.domElement.id = "gui";
        gui.add(afterimagePass.uniforms["damp"], 'value', 0, 1).step(0.001).name("Afterimage Scale");
        gui.add(params, 'Enable_Post_Proccessing').name("Post Processing");
        gui.add(params, 'fullGlitch').name("Glitch Me Sideways");
        gui.addColor(params, 'PointLightColour').name("Lights").onChange(Update);
        gui.add(params, 'rule', {Basic: 0, Standard: 1, StandardAlt: 2, Problematic: 3, GoodSoup: 4, Original: 5}).name("Change Ruleset").onChange(UpdateAsRule);
        gui.add(params, 'DieLow', 0, 17).step(1).name("Death Lower Limit");
        gui.add(params, 'DieHigh', 0, 17).step(1).name("Death Upper Limit");
        gui.add(params, 'BornLow', 0, 17).step(1).name("Birth Lower Limit");
        gui.add(params, 'BornHigh', 0, 17).step(1).name("Birth Lower Limit");
        
    }

}
