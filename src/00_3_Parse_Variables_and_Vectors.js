
//===================================================================================================================
// Given the data_model and the DEFINITION of a vector (Vector or node id, literal vector expression [1,2,3], or scalar-vector expression), it evaluates all dependencies to return an array of 3 coordinates
function getVectorCoordinates_from_Definition(DEF, geometric_data_object) {
    
    var vectors = geometric_data_object.model_data.VECTORs
    var nodes = geometric_data_object.model_data.NODEs
    var variables = geometric_data_object.model_data.VARIABLEs

    // Start here! Find the requested vector and evaluate its DEF
    returned_vector_coordinates = _evaluate_vector_definition_by_ID_vec_or_expression(DEF)
    console.log(" Definition ", DEF, " returned value ", returned_vector_coordinates )
    return returned_vector_coordinates  // This is the final result returned

    //_________________________________________________________________________________________________________
    // Recursive function to evaluate expressions with scalar and vector values, including vector operations
    function __evaluate_ScalarVector_expression(expr) {
   
        // Handle VECTOR CROSS PRODUCT
        // Find recursively all instances, included nested, of cross(X) and evaluate X. Return the original expression with the results of the cross products replacing the cross() pattern
        expr = expr.includes('cross(') ?   __evaluate_cross_product(expr) : expr 

     // Replace vector and variable references in the remaining expression with their numerical values in an array format
     vector_numerical_expr = expr.replace(/([a-zA-Z0-9_]+)/g, (match) => {
        const vector = _find_Vector_or_node_by_Id(match)
        if (vector) {
            const vecValue = _evaluate_vector_definition_by_ID_vec_or_expression(vector.DEF);
            return `[${vecValue.join(',')}]`
        }
        const variable = _find_scalar_Variable_by_Id(match);
        if (variable) {
            return variable.VALUE;
        }
        return match
    })

        // Evaluate the resulting arithmetic expression with pure numbers
        // Caution: eval() can be unsafe, consider using a safer evaluation method
        try {
            return evaluate_Vector_Numerical_Expression(__replaceNormalize(vector_numerical_expr)) // evaluate normalize functions before final evaluation
        } catch (e) {
            console.error('Error evaluating expression:', expr, e);
            return null;
        }
    } // end of function __evaluate_ScalarVector_expression
    //______________________________________________________________________

        // SECOND LEVEL HELPER FUNCTIONS

                        // Helper function to normalize a numerical vector in a string and replace the value in the string with the pattern:
                        // replaceNormalize('[15,-1,11]+4*normalize([16.6,-334,-53])-normalize([1,2,3])*9'))     ->   '[15,-1,11]+4*[-0.04481641468682506, 0.9017278617710583, 0.14308855291576675]-[0.16666666666666666, 0.3333333333333333, 0.5]*9'
                        function __replaceNormalize(str) {
                            if (!str.includes('normalize(')) {return str}  // if there is no normalize statement return the original string
                            const regex = /normalize\(\[([^\]]+)\]\)/g;
                            // Function to normalize an array of numbers
                            function normalizeArray(arr) {
                                const sum = arr.reduce((acc, val) => acc + val, 0);
                                return arr.map(val => val / sum);
                            }
                            return str.replace(regex, (match, arrayString) => {
                                // Convert the captured group into an array of numbers
                                const numbers = arrayString.split(',').map(Number);
                                // Normalize the array
                                const normalizedArray = normalizeArray(numbers);
                                // Return the normalized array in string format
                                return `[${normalizedArray.join(', ')}]`;
                            })
                        }

                        // Helper function to evaluate the cross product from a cross() pattern
                        function __evaluate_cross_product(str) {
                            // Regular expression to match the innermost "cross(X)" pattern
                            const regex = /cross\(([^()]+)\)/;

                            // Recursive function to process the string
                            function ___process(s) {
                                const match = s.match(regex);
                                // Base case: if no match is found, return the string
                                if (!match) {
                                    return s
                                }

                                // Extract the matched group, which is the content inside "cross(X)"
                                const innerContent = match[1]

                                // Calculate the cross product of the inner content
                                const cross_product_vectors = split_two_Arguments(innerContent)  // separate text into an array of the two arguments

                                v1 = __evaluate_ScalarVector_expression(cross_product_vectors[0])  // convert "[1,2,3]"  into [1,2,3]
                                v2 = __evaluate_ScalarVector_expression(cross_product_vectors[1])
                                const vec1 = Array.isArray(v1)?  v1 :  _evaluate_vector_definition_by_ID_vec_or_expression(_find_Vector_or_node_by_Id(v1).DEF) // parse scalar and vector values
                                const vec2 = Array.isArray(v2)?  v2 :  _evaluate_vector_definition_by_ID_vec_or_expression(_find_Vector_or_node_by_Id(v2).DEF)

                                cross_product_result = vector_cross_product_0_index(vec1, vec2) // perform numerical cross product

                                // Replace the matched "cross(X)" with the length of X
                                const replaced = s.replace(regex, "[" + cross_product_result + "]"); // convert the array to a string and replace cross() pattern in expression

                                // Recursively process the rest of the string
                                return ___process(replaced);
                            }

                            return ___process(str)
                        }

                            // Helper function to find a vector by ID
                            // nodes will be treated as vectors in this function to allow for node translations (and even abuses of notation, treating nodes as vectors) with the same expressions as for pure vectors
                            // IF A NODE HAS THE SAME ID AS A VECTOR, THE VECTOR WILL BE SELECTED FIRST: -> AVOID DUPLICATING NAMES BETWEEN NODES AND VECTORS
                            function _find_Vector_or_node_by_Id(id) {if (vectors.find(v => v.ID === id) != undefined) {return (vectors.find(v => v.ID === id)) } else { return (nodes.find(v => v.ID === id))   }   }

                            // Helper function to find a variable by ID
                            function _find_scalar_Variable_by_Id(id) {return variables.find(v => v.ID === id)}


                            // Helper function to evaluate a vector definition
                            function _evaluate_vector_definition_by_ID_vec_or_expression(def) {
                                if (Array.isArray(def)) {  // The definition is an array of coordinates, parse the scalar components from the variables and return the result as a numerical vector
                                    return def.map(element => get_Scalar_Value_from_Variables(element, geometric_data_object))
                                } else if (typeof def.EXPRESSION === 'string' && def.EXPRESSION.startsWith('<') && def.EXPRESSION.endsWith('>')) {
                                    evaluated_expression = __evaluate_ScalarVector_expression(def.EXPRESSION.slice(1, -1))
                                    return evaluated_expression
                                }
                                //return "Error in vector definition"
                                //return _evaluate_vector_definition_by_ID_vec_or_expression(_find_Vector_or_node_by_Id(def).DEF)
                                return geometric_data_object.model_data.NODEs.find(n => n.ID == def).DEF  // OJO!!!!! porqué????
                            } // end of _evaluate_vector_definition_by_ID_vec_or_expression

}  // end of getVectorCoordinates_from_Definition
//===================================================================================================================


//********************************************************** */
// Takes a string with a vector expression where the vectors are given by their coordinates,
// already evaluated to numbers, and evaluates the complete expression element-wise, returning the final vector
// Example    evaluate_Vector_Numerical_Expression('[0.5,1,-11]+[-184.6,1,0.2]')    ->   [-184.1, 2, -10.8]
function evaluate_Vector_Numerical_Expression(expr) {
    // Extract vectors and replace them with placeholders A, B, C...
    const vectors = []
    const placeholderExpr = expr.replace(/\[(.*?)\]/g, (_, vector) => {
        vectors.push(vector.split(',').map(Number))
        return 'vec' + (vectors.length - 1);
    })
    // Create separate expressions for each coordinate
    const coordinateExprs = vectors[0].map((_, i) =>
        placeholderExpr.replace(/vec(\d+)/g, (_, index) => vectors[index][i])
    )
    // Evaluate each coordinate expression
    const result = coordinateExprs.map(coordExpr => eval(coordExpr.replace(/--/g, '+')))   // the replace -- for + is to fix situations like '-2--1'

    return result
}
//********************************************************** */



//****************************************************************** */
// Given the ID of a variable in the object VARIABLES, it returns directly its numerical value if it's a basic definition,
// or evaluates recursively the expressions to resolve the value from the dependencies
function get_Scalar_Value_from_Variables(variableId, geometric_data_object) {

//console.log("variable being parsed " , variableId)

    // Extract VARIABLES array from geometric_data_object
    const variablesArray = geometric_data_object.model_data.VARIABLEs

    // Create a map of variables for quick access.
    const variablesMap = new Map()
    variablesArray.forEach(variable => {
        variablesMap.set(variable.ID, variable.VALUE)
    })

    // Resolve the value of the requested variable.
    return resolveValue(variableId, variablesMap)


        //************************************************************************** */
        function string_is_a_valid_expression(text) { return ((typeof text === 'string' && text.startsWith('<') && text.endsWith('>'))  ? true : false )  } // verify if a string has the right format for an expression

        function parse_valid_expression(text) {
                // Check if the value is an expression enclosed in < >
                if (string_is_a_valid_expression(text)) {
                    //console.log("Parsing expression ", text)
                    // Extract the expression and replace variables with their values.
                    const expression = text.slice(1, -1).replace(/\b(\w+)\b/g, (match) => {
                        return_expression = resolveValue(match, variablesMap)
                        //console.log("match, expression being resolved " , match, return_expression)
                        return      return_expression
                    })
                    // Evaluate the expression safely.
                    try {
                        return eval(expression)
                    } catch (error) {
                        console.error('Error evaluating expression:', expression, error)
                        return undefined
                    }
                }}

            // Function to parse the value of the variable
            function resolveValue(id, variablesMap) {

            if (isNumeric(id)) {return parseFloat(id)}  // If the value of the variable is purely numeric, return it parsed as a float

            if (variablesMap.has(id)) {
                const value = variablesMap.get(id)

                //console.log("variable being resolved " , variableId, " with value ", value)
                if (isNumeric(value)) {return parseFloat(value)}  // If the value of the variable is purely numeric, return it parsed as a float

                return parse_valid_expression(value.EXPRESSION)

            } else {

                if (string_is_a_valid_expression(id)) { return parse_valid_expression(id)}
                if (string_is_a_valid_expression(id.EXPRESSION)) {return parse_valid_expression(id.EXPRESSION)}
                console.error('Scalar variable not found:', id)
                return undefined

            }  // the id corresponds to a valid expression
            }  // end of resolveValue
  }  // end of get_Scalar_Value_from_Variables
//****************************************************************** */


function split_two_Arguments(str) {
    // It iterates through the string while keeping track of the number of open brackets.
    // When it encounters a comma and the bracket count is zero (meaning the comma is not inside any brackets), it records the index of this comma.
    // The string is then split at this index into two parts.
    // Each part is trimmed to remove any leading or trailing whitespace.
    // The function returns an array containing these two parts.
    // This approach will work as long as the input string has matching brackets and a single comma outside of any brackets, separating the two arguments.
    let bracketCount = 0
    let splitIndex = -1
    for (let i = 0; i < str.length; i++) {
        if (str[i] === '[' || str[i] === '(') {
            bracketCount++;
        } else if (str[i] === ']' || str[i] === ')') {
            bracketCount--;
        } else if (str[i] === ',' && bracketCount === 0) {
            splitIndex = i;
            break;
        }
    }
    if (splitIndex === -1) {
        // No valid split point found
        return null;
    }
    // Split the string into two parts and trim any whitespace
    const part1 = str.substring(0, splitIndex).trim();
    const part2 = str.substring(splitIndex + 1).trim();
    return [part1, part2];
}