/// <reference path='../lib/babylon.d.ts' />


// PARSE THE GEOMETRIC DATA OBJECT AND INSTANTIATE ALL THE BALLS
function Create_BALLs_from_Nodes(geometric_data_object, scale_mesh_by = 1) { geometric_data_object.model_data.BALLs.forEach(ball => {create_mesh_for_BALL(geometric_data_object, ball.ID, ball.NODE_IDs, ball.R, scale_mesh_by, ball.render_params)  })  }


function create_mesh_for_BALL(geometric_data_object, ID, NODE_IDs, R, scale_mesh_by = 1,    
                                {color= "black", 
                                alpha = .5 } = {}// end of optional parameters (render parameters)
                            ) {  // end of inputs

    // Position the sphere based on the nodes referred to by the array of NODE_IDs
    NODE_IDs.forEach(indx => { // Each "BALL" can have various instances given by the definition of node ids, coordinates or vector-scalar expressions

        ball_radius = get_Scalar_Value_from_Variables(R, geometric_data_object) // The radius is a pure scalar, although it may be defined by a scalar expression
        var sphere = BABYLON.MeshBuilder.CreateSphere("BALL_" + ID, { diameter: ball_radius * 2 * scale_mesh_by }, scene)

        sphere.material = new BABYLON.StandardMaterial("BALL_material_" + ID, scene)
        sphere.material.diffuseColor = getColor_from_scalar_rgb_rgbalpha_or_name(color)

        ball_alpha = get_Scalar_Value_from_Variables(alpha, geometric_data_object)
        sphere.material.alpha = alpha !== undefined ? ball_alpha : 1

        // Get coordinates of center of the sphere
        center_coords = getVectorCoordinates_from_Definition(indx, geometric_data_object)  // Send the "indx", which may be a scalar-vector expression to the parser to get back the center point coordinates
        sphere.position = new BABYLON.Vector3(center_coords[0], center_coords[1], center_coords[2])
    
    }) // end for each indx

}


