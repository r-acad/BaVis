/// <reference path='../lib/babylon.d.ts' />

function Create_Geometries() {

// define generic functions for plotting surfaces
function f_surf1 (x,z) { return (x * x + z * z)}
function f_surf2 (x,z) { return ((x  + z ) * -100)}


recipe1 = {"color3" : [.4, 1, .6] , "alpha" : .5, "wireframe" : false}
recipe2 = {"color3" : [1, .8, .6] , "alpha" : .5, "wireframe" : true}


        // // Add objects to the scene
        //create_ground(200, light, shadowGenerator) 

        //surface_smooth((x,z) => (x * x + z * z), scene, shadowGenerator, recipe1)


        //surface_smooth(f_surf2, scene, shadowGenerator, recipe2)
    

        // //plot_REST_points(scene)  // show points received from the server as spheres

        // create_points(scene)  // generate random points and connect them with random lines

         //load_STL_file('./assets/models/az1-3.stl')



    // Load the STL file
    BABYLON.SceneLoader.ImportMesh("", "./assets/models/", "c6dd.obj", scene, function (meshes) {
        // Scale the model
        meshes.forEach(function (mesh) {
            mesh.scaling = new BABYLON.Vector3(1, 1, 1); // Scale by a factor of 2 in all directions
        });
    });


    var complete_model_data_object_from_file = convert_MyJSON_to_proper_JSON(jsn)


         Create_BALLs_from_Nodes(complete_model_data_object_from_file)


        //Create_Mesh_from_Nodes()


        //pp =  evaluateExpression(complete_model_data_object_from_file, "<A1 -3*Length/-0.3>" )
        //console.log(pp)

        add_segments_to_scene(complete_model_data_object_from_file)

        
        
// // Attempt to do reflections based on https://playground.babylonjs.com/#KA93U#243   
/**********     
var probe = new BABYLON.ReflectionProbe("main", 512, scene);


var generateSatelliteMaterial = function (root, color, others) {
            var material = new BABYLON.StandardMaterial("satelliteMat" + root.name, scene);
            material.diffuseColor = color;
            
            var probe = new BABYLON.ReflectionProbe("satelliteProbe" + root.name, 512, scene);
            for (var index = 0; index < others.length; index++) {
                probe.renderList.push(others[index]);			
            }
            
            material.reflectionTexture = probe.cubeTexture;
            
            material.reflectionFresnelParameters = new BABYLON.FresnelParameters();
            material.reflectionFresnelParameters.bias = 0.02;
            
            root.material = material;
            probe.attachToMesh(root);
        }


for (i in scene.meshes) {
    probe.renderList.push(scene.meshes[i])

scene.meshes[i].diffuseColor = new BABYLON.Color3(1, 0.5, 0.5);	
        scene.meshes[i].reflectionTexture = probe.cubeTexture;
        scene.meshes[i].reflectionFresnelParameters = new BABYLON.FresnelParameters();
        scene.meshes[i].reflectionFresnelParameters.bias = 0.02;

    generateSatelliteMaterial(scene.meshes[i],BABYLON.Color3.White(.1),scene.meshes[i])

}
*************/


}