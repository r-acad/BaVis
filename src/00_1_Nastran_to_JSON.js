


//SETUP GLOBAL OBJECT TO STORE NASTRAN MODEL
const nastran_model = {}

// https://50linesofco.de/post/2019-07-05-reading-local-files-with-javascript
document.getElementById('fileInput').addEventListener('change', 
    function selectedFileChanged() {
        if (this.files.length === 0) {
            console.log('No file selected.');
            return;}
        //else    
        const reader = new FileReader();
        reader.onload = function fileReadCompleted() {// when the reader is done, the content is in reader.result.
            let mytext = reader.result
            //console.log(mytext.split('\n'))
            build_nastran_model(mytext.split('\n'))
            //read_nast("/assets/wbox.bdf")
        };
        reader.readAsText(this.files[0]);
    }
  )





  

function read_nast(filen) {
       console.log("myp5 ok? "  + myp5)
       myp5.loadStrings(filen, fileLoaded)
    }
    function fileLoaded(data) {
       // console.log(data)
        build_nastran_model(data)

    }

function build_nastran_model (text_bdf) {
    read_Nastran_cards_and_build_model_object(text_bdf)
    console.log(nastran_model)


        // nastran_model.GRIDs is a Map which is converted to an array. This is mapped into objects for the NODEs data structure as required. The .slice(1) is to remove the first element which is not used in the pure NASTRAN functions (to maintain base-1 indexing in that code for simplicity)
        nodes = Array.from(nastran_model.GRIDs).map(el => ({"ID": el[1].ID, "X": el[1].X.slice(1)}) )

        // similar process for the shells
        shells = Array.from(nastran_model.CSHELLs).map(el => ({"ID": el[1].ID, "NODE_IDs": el[1].G.slice(1), "color": nastran_model.PSHELLs.get(el[1].PID).T}) )

        // see example "mesh_by_Nodes_data_example" in src\99_Examples_of_Data_structures.js for the complete data structure 
        meshData = {
            "name": "exampleName",
            "group": "exampleGroup",
            "geometric_data_object": {
            "NODEs": nodes,
            "SHELLs": shells
            }
        }

  Create_Mesh_from_Nodes(meshData)

    //draw_nastran_model()
}

function draw_nastran_model(){
//var materialf = new THREE.MeshPhongMaterial( { color : 0xffffff  , vertexColors: THREE.FaceColors, side: THREE.DoubleSide } );
//var materialf = new THREE.MeshBasicMaterial( { color : 0xffffff  ,  side: THREE.DoubleSide } );


var materialf = new THREE.MeshStandardMaterial( { 
    color : 0xffffff  , 
    vertexColors: THREE.FaceColors, 
    side: THREE.DoubleSide ,
    metalness: 1,
    roughness: .7
} );


var geometry = new THREE.Geometry();

    let vn = 0  // number of vertices
    nastran_model.CSHELLs.forEach(elm => {     
        let thick = nastran_model.PSHELLs.get(elm.PID).T
        let color = new grad_col_rgb_oldbutok(thick, 1, 13, true) 
        nodelist = (elm.TYPE === "CQUAD4") ? [1, 2, 3, 4, 1, 3] : [1, 2, 3]

        for (const n of nodelist) {
            let grid = nastran_model.GRIDs.get(elm.G[n])
            let x = grid.X[1]    
            let y = grid.X[2]
            let z = grid.X[3]
            geometry.vertices.push( new THREE.Vector3( x, y, z) );
            vn++
        }   
        var face = new THREE.Face3( vn-3, vn-2, vn-1 ) //, normal , color, materialIndex );

        for (let c = 0 ; c< 3 ; c++) {face.vertexColors[c] = color}
        geometry.faces.push( face ); 

        if (elm.TYPE === "CQUAD4") { 
            var face = new THREE.Face3( vn-6, vn-5, vn-4 )  
            for (let c = 0 ; c< 3 ; c++) {face.vertexColors[c] = color}
            geometry.faces.push( face ); 
        }           
    }); 


//the face normals and vertex normals can be calculated automatically if not supplied above
geometry.computeFaceNormals();
geometry.computeVertexNormals();

scene.add( new THREE.Mesh( geometry, materialf ) );
} // END FUNCTION DRAW NASTRAN MODEL


let CARDS2DATA = {

    GRID: function (processed_cards_array){
    let MAP = new Map
    let scale = 1/1000
    processed_cards_array.forEach((arr_line) =>{
            let CARD = "GRID"
            let ID = parse_nastran_number(arr_line[2])   
            let CP = parse_nastran_number(arr_line[3])
            let X = []
            X[1] = parse_nastran_number(arr_line[4])*scale
            X[2] = parse_nastran_number(arr_line[5])*scale
            X[3] = parse_nastran_number(arr_line[6])*scale 
            let CD = parse_nastran_number(arr_line[7])
            let PS = parse_nastran_number(arr_line[8])
            let SEID = parse_nastran_number(arr_line[9])
            MAP.set(ID, {CARD, ID, CP, X, CD, PS, SEID})        
    }) // next foreachnumber(    
    return MAP
    }, // end method GRID

    ELM2D: function (processed_cards_array) {   
        let MAP = new Map
        processed_cards_array.forEach((arr_line) =>{
            let CARD = arr_line[1].trim()
            let ID = parse_nastran_number(arr_line[2])   
            let PID = parse_nastran_number(arr_line[3])
            let G = [];
            G[1] = parse_nastran_number(arr_line[4])
            G[2] = parse_nastran_number(arr_line[5])
            G[3] = parse_nastran_number(arr_line[6])
            let field_shift = 0 // by defalt the card is assumed to be a TRIA
            let TYPE = "CTRIA3"
            if (["CQUAD4", "CQUADR"].includes(CARD)) {
                    TYPE = "CQUAD4" 
                    G[4] = parse_nastran_number(arr_line[7])
                    field_shift = 1
            }
            let THETA_MCID_field = arr_line[7+field_shift]
                let THETA = (THETA_MCID_field.includes("."))? parse_nastran_number(THETA_MCID_field) : undefined
                let MCID = (THETA_MCID_field.includes("."))? undefined : parse_nastran_number(THETA_MCID_field) 
            let ZOFFS = parse_nastran_number(arr_line[8+field_shift])
            MAP.set(ID, {CARD, TYPE, ID, PID, G, THETA, MCID, ZOFFS})  
        })
        return MAP
    }, // end method CSHELLs

    PROP2D: function (processed_cards_array) { //OJO A LA ÑAPA CON PCOMPS!!

        let MAP = new Map
        processed_cards_array.forEach((arr_line) =>{
            let CARD =          arr_line[1].trim()
            let PID =           parse_nastran_number(arr_line[2]) 

            if (CARD === "PSHELL") {
            let MID1 =          parse_nastran_number(arr_line[3]) 
            let T =             parse_nastran_number(arr_line[4])
            let MID2 =          parse_nastran_number(arr_line[5]) 
            let INERTIA_RATIO = parse_nastran_number(arr_line[6])
            let MID3 =          parse_nastran_number(arr_line[7]) 
            let TST =           parse_nastran_number(arr_line[8])
            let NSM =           parse_nastran_number(arr_line[9])
            let Z1 =            parse_nastran_number(arr_line[12])
            let Z2 =            parse_nastran_number(arr_line[13])
            let MID4 =          parse_nastran_number(arr_line[14])
            MAP.set(PID, {CARD, PID, MID1, T, MID2, INERTIA_RATIO, MID3, TST, NSM, Z1, Z2, MID4})
            }

            if (CARD === "PCOMP") {
                let Z0 =            parse_nastran_number(arr_line[3]) 
                let T =             Math.abs(Z0)*2  /// OJO A LA ÑAPA, T SE SUPONE EL DOBLE DE Z0, HAY QUE CONSTRUIR EL LAMINADO!!!!
                let NSM =           parse_nastran_number(arr_line[4])
                let SB =            parse_nastran_number(arr_line[5]) 
                let FT =            (arr_line[6]).trim()
                let TREF =          parse_nastran_number(arr_line[7]) 
                let GE =            parse_nastran_number(arr_line[8])
                let LAM =           (arr_line[9]).trim()

                let Laminate_array = arr_line.slice(11)  // OJO!!! falta leer plies

                MAP.set(PID, {CARD, PID, Z0, T, NSM, SB, FT, TREF, GE, LAM, Laminate_array})
                }
          })
        return MAP
    }    // end of PROP2D parser

} // end object CARDS2DATA

function read_Nastran_cards_and_build_model_object(bdf_lines) {

    const processed_cards_object = {}
    // Remove blank lines and comments from .bdf
    const filt_lines = bdf_lines
    .filter(line => !(line.trim().startsWith("$") || (line.trim().length < 2)))
    .filter(line => {  // remove text after an inline nastran comment
        if (line.includes("$")) {
            return line.substring(0, line.indexOf("$"))
        } else {return line}
    })

    // Find indexes of start and end of BULK section
    const begin_bulk = filt_lines.findIndex(line => line.includes("BEGIN BULK"));
    const enddata = filt_lines.findIndex(line => line.includes("ENDDATA"));
    const card_lines = []  // Initialise an array to hold the card names found
    let line_array = []  // instantiate the array where to store the card fields

    for (let i = begin_bulk + 1 ; i < enddata ; i++) { // Go one by one through all lines of the bulk section   
        let card = get_nastran_card_name(filt_lines[i])  // name of card found   
        line_array = get_nastran_fields_from_line (filt_lines[i])   // get an array of fields from the current line

        if (card) { // if this is a valid nastran card (not a continuation or blank)         
            if (!card_lines.includes(card)) {  // Is this card not in the array of unique cards yet?
                card_lines.push(card)  // If not, then add the card name to the array
                Object.defineProperty(processed_cards_object, card, { value: [] });  // create a new key on the processed cards object
            }

            let lineadd = 1
            while (is_nastran_continuation (filt_lines[i+lineadd]) ) {
                line_array.push(get_nastran_fields_from_line (filt_lines[i+lineadd]))
                lineadd++
               
            }  // end while
            i += lineadd-1
            processed_cards_object[card].push(line_array.flat(2))  // add the line to the array corresponding to the card
        }
    } // next i, line of the bdf
    
  // BUILD MODEL OBJECT FROM MAPS OF TYPES OF CARDS (BY DIMENSION)
//*************************************************** */
  function append_supported_card_arrays (elm_class, supported_cards_of_type) {
    let acc_Map = new Map  // create accumulator map
    supported_cards_of_type.forEach(card_type =>  { // iterate on all cards supported of the element class
        if (card_type in processed_cards_object) {  // if card supported
            let curr_Map = CARDS2DATA[elm_class](processed_cards_object[card_type])  // create map
            curr_Map.forEach((value, key) =>  acc_Map.set(key, value)  ) // assign keys and values to acc map
        }
    })
    return acc_Map  // return accumulator map merging all the maps of the supported cards
  }
  //************************************************** */
  // ADD MAPS TO MODEL OBJECT
  nastran_model.GRIDs = CARDS2DATA.GRID( processed_cards_object.GRID) // for GRIDs, return the map directly
  nastran_model.CSHELLs = append_supported_card_arrays("ELM2D", ["CTRIA3", "CTRIAR", "CQUAD4", "CQUADR"]) // append maps
  nastran_model.PSHELLs = append_supported_card_arrays("PROP2D", ["PSHELL", "PCOMP"]) // append maps

} // end function read_Nastran_cards_and_build_model_object(bdf_lines) 


//****************************************************** */
// AUXILIARY NASTRAN FUNCTIONS
//****************************************************** */
function parse_nastran_number (field) {  // parse NASTRAN float formats and return a JS float or an integer
    if (!field) {return undefined}  // if the requested field does not exist in the nastran card

    if (field.includes(".")) {
        field = field.trim()
        if (field.startsWith("-")) {
            return (-1 * parseFloat(field.substring(1).replace("+", "e+").replace("-", "e-").replace("ee", "e")))  
        } else {
            return (parseFloat(field.replace("+", "e+").replace("-", "e-").replace("ee", "e")))    
        }
    } else {
        return parseInt(field)
    }
}

function get_nastran_card_name (line) {  // get the NASTRAN card name from a line, if it exists
    if (!is_nastran_continuation(line)) {        
        if (line.includes(",")) {
            return line.split(",")[0]
        } else {
            let field1 = line.substring(0,7).toUpperCase().replace("*", "").trim()
            return field1
        }             
    } else {return false}
}

function get_nastran_fields_from_line (line){  
    // return an array containing the content of the NASTRAN line fields, in short, long and comma separated format
    let array_of_fields = []
    if (line.includes(",")) {
        return ["," ,...line.split(",")]
    } else {
        let nfields = (line.includes("*"))? { fields: 6,  field_width: 16} : { fields: 10, field_width: 8}
        for (let i = 1 ; i <= nfields.fields ; i++) {
            array_of_fields.push(get_nastran_field(line, i, nfields.field_width))
        }
    return [nfields.field_width,...array_of_fields]  // the first element gives the card format (8 or 16)
    }   
}

function get_nastran_field(line, field, flength) { // flength can be 8 or 16 cols, field 1 is always 8 characters long
    if (field == 1) {
        return line.substring( 0 , 7 )
    } else {
    let fstart = 8 + (field - 2 ) * flength
    return line.substring(fstart,fstart+flength )
    }
}

function is_nastran_continuation (line) {  // check whether a .bdf line is a continuation line
     ret = (line.startsWith(" ") || line.startsWith("+") || line.startsWith(",") || line.startsWith("*")) ? true : false 
    return ret
}

function grad_col_rgb_oldbutok( level , min = 0, max = 1, reverse = false) {
    // original visual basic function
    let i = (level-min)/(max-min)
    if (reverse) {i = (1-i)}

    if (i > 1 ) { i = 1} 
    if (i < 0 ) { i = 0} 

    let sig = 0.09
    let d = 1 / 5
    let l_bc2 = 255 * Math.exp(-1 * ((i - 0.8 * d) ** 2) / (2 * sig ** 2))
    let l_bc3 = 255 * Math.exp(-1 * ((i - 1.3 * d) ** 2) / (3.4 * sig ** 2))
    let l_gc3 = l_bc3
    let l_gc4 = 255 * Math.exp(-1 * ((i - 2.2 * d) ** 2) / (3 * sig ** 2))
    let l_gc5 = 255 * Math.exp(-1 * ((i - 3.7 * d) ** 2) / (4.3 * sig ** 2))
    let l_rc5 = l_gc5
    let l_rc7 = 255 * Math.exp(-1 * ((i - 5 * d) ** 2) / (4.4 * sig ** 2))
    let l_rc =  l_rc5 +  l_rc7
    let l_bc = l_bc2 + l_bc3 
    let l_gc = l_gc3 + l_gc4 + l_gc5 
    
    this.r = l_bc/255
    this.g = l_gc /255
    this.b = l_rc /255
    }   

