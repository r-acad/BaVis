/// <reference path='./lib/babylon.d.ts' />

function load_STL_file(path_and_filename) {

                // STL file to be loaded
                var stlFile = path_and_filename

                BABYLON.SceneLoader.ImportMesh("", "", stlFile, scene, function (newMeshes) {
                    camera.target = newMeshes[0]
                });

            }