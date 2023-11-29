
// Sample_Data_Structures

// this is a badly formed JSON file where strings, which should be quoted, are not. Unlike JSON it accepts comments using // or # at any position in the line (including after data)
// There can be empty lines and the content of one line can be spread in multiple consecutive lines if required
jsn = `{
  name: exampleName,
  group: exampleGroup,
  model_data: {
    VECTORs: [
      { ID: up1,  DEF: [ .5, 1, -11 ]  },
      { ID: v1,  DEF: [ 1, 0, 0 ]  },
      { ID: v2,  DEF: [ 0, 1, 0 ]  },
      { ID: up7,  DEF: <[ 1, 0, 0 ] + 3*cross(v1, v2)>  },
      { ID: up2,  DEF: [ 15, -1, 11 ]  },
      { ID: up4,  DEF: [ p1, 1, dia ]  },
      { ID: down,  DEF: [ p1, 1, dia ]  },
      { ID: up5,  DEF: < up1 + up4 >  },
      { ID: up6,  DEF: < 3*up1/4 -.3* up4/-.5 >  },  // [-106.785, 1.35, -6.33]

      { ID: v37,  DEF: <up1> }
    ],
    SEGMENTs: [
      { ID: suida,  DEF: [{START:  [ 2, 1, <dia -3*Length/-.3> ], END:  [ 18, 3, -6 ]}], render_params: {arrow_color: "purple", thickness : 1, arrow_at_start_point : true, arrow_at_end : true, label_at_start_point: "START_purple", label_at_midpoint: "MIDDLE_Purple", label_at_end_point: "L" }      },

     { ID: up,  DEF: [{START:  [ 2, dia, 1 ], END:  nose}  , {START:  [ 21, 1, -21 ], END:  [ -8, 1, 56 ]}      ] , render_params: {arrow_color: "red", arrow_length: 3, arrow_angle: 45, thickness : 0.6, arrow_at_start_point : false, arrow_at_end : false, label_at_start_point: "START_POINT", label_at_midpoint: "MIDDLE_POINT", label_at_end_point: "expressions", alpha: .5 }     },
      { ID: "up1", DEF: [{START: <3*center>, END: <nose/7> }], render_params: {arrow_color: "blue", arrow_length: 3, arrow_angle: 45, thickness : 0.5, arrow_at_start_point : false, arrow_at_end : false, label_at_start_point: "START_POINT", label_at_midpoint: "MIDDLE_POINT", label_at_end_point: "sss", alpha: .5 }},
      { ID: tuda,  DEF: [{START:  <up2 + 4*normalize(cross([ 38, 1, 5.6 ], up2))>, END:  [ 38, 1, 5.6 ]}], render_params: {arrow_color: "green", arrow_length: 3, arrow_angle: 15, thickness : 0, arrow_at_start_point : false, arrow_at_end : false, label_at_start_point: "START_POINT", label_at_midpoint: "MIDDLE_POINT", label_at_end_point: "sss", alpha: .5 }      },
      
      { ID: up2,  DEF: [{START:  [ 5, 1, -11 ], END:  [ 18, 1, -20.56 ]}], render_params: {arrow_color: "pink"}      },
      { ID: up3,  DEF: [{START:  [ 3, 4, 21 ], END:  [ -8, 3, 0.56 ]}]      },
      { ID: up4,  DEF: [{START:  [ 12, 1, -5 ], END: [ 1, -3, 11.56 ]}] , render_params: {arrow_color: "yellow", thickness: .3}    },
      { ID: "down", DEF: [{START: [8, 7, 9], END: [15, 13, 12.1]}] }
    ],
    COORDs: [
      {ID: fus, DEF: [R,1,nose,center] },    // CORD1R
      {ID: cyl, DEF: [C,[0,0,0],2,nose]  },    // Cylindrical
      {ID: spher, DEF: [S,[0,0,0],2,30] }    // Spherical
    ],
    NODEs: [
      {ID: 1, DEF: [ 10.12, 0.34, 0.56 ] },
      { ID: 2, DEF: [ 1.12, 3, 5.6 ] },
      { ID: 30, DEF: [ 0.12, 34, 6 ] },
      {ID: 8, DEF: [ 12, 4, 7 , fus] },
      { ID: 5, DEF: [ 11, 11, 10.56 ] },
      { ID: 60, DEF: [ -141, 5, 12.56 ] },
      { ID: 7, DEF: [ 114, .9, 26 ] },
      {ID: 4, DEF: [ 5, 2, 3 ] },
      { ID: 9, DEF: [ 2, 11, 1 ] },
      { ID: 10, DEF: <[ 8, 0, 0.56 , wing ]> },
      { ID: center, DEF: [ dia, 13, 0.56 ] },
      { ID: nose, DEF: [ 0, -2, 0 ] }
    ],
    SHELLs: [
      { ID: 1, NODE_IDs: [1, 2, 30, 4], color: 0.1 },
      { ID: 2, NODE_IDs: [5, 60, 7, 8], color: 0.9 },
      { ID: 3, NODE_IDs: [2, 4, 60, 8], color: 0.5 },
      { ID: 4, NODE_IDs: [30, 5, 7, 9], color: 0.8 },
      { ID: 5, NODE_IDs: [1, 4, 7, 10], color: 1 }
    ],
    BALLs: [        
      { ID: 112, NODE_IDs: [<center + dia*up5/4>], R: 3, render_params: {color: yellow ,  alpha : 1}  },
      { ID: 112, NODE_IDs: [<center - dia*up5/2>], R: 2, render_params: {color: blue ,  alpha : 1}  },
      { ID: 12, NODE_IDs: [<dia*[1,2,K1]>], R: 2, render_params: {color: blue ,  alpha : 1}  },
      {ID: 22, NODE_IDs: [ <center-.3*down>, <nose-.23*up2> ], R: 5 , 
        render_params: {color: green,  alpha : .6} },
      {ID: 122, NODE_IDs: [ <center +  down>,  <nose- down>], R: 1,  render_params: {color: purple,  alpha : transparency}  },
      { ID: 1, NODE_IDs: [10, 2, 30, 4], R: dia, 
        render_params: {color: [0.3, 0.4, 0.6, 0.1],  alpha : 0.5}    }, 
      {ID: 2, NODE_IDs: [10, center, 7], R: 2, render_params: {color: red,  alpha : 0.8} },
      {ID: 2, NODE_IDs: [10, 2, 30, [18, 13, 13]], R: 2, render_params: {color: [0.7, 0.3, 0.1],  alpha : 0.7} }

    ],
    VARIABLEs: [
      { ID: dia, VALUE: 3.2},
      { ID: transparency, VALUE:.8},
      { ID: K1, VALUE:-.8},
      { ID: K2, VALUE:<  -.8/dia>},
      { ID: Length, VALUE: 9},
      { ID: alpha, VALUE: <3* dia - A2 >},  // -173.6
      { ID: A1, VALUE: <dia -3*Length/-.3>}, // 93.2
      { ID: A2, VALUE: <A1 -3*Length/-.3>},  // 183.2
      { ID: p1, VALUE: <alpha - 5>   }
      
    ]

  }
}`


// Format the "easy" input file so that it can be parsed as a JSON file
// Replace ever instance of an expression between < > with an object {"EXPRESSION": <expression>} which will be parsed later depending on wether this is a vector or scalar expression
function convert_MyJSON_to_proper_JSON(str) {
  // New first pass: Remove comments starting with # or //
  str = str.split('\n').map(line => {
    let hashIndex = line.indexOf('#')
    let doubleSlashIndex = line.indexOf('//')

    if (hashIndex !== -1) {
      line = line.substring(0, hashIndex)
    }
    if (doubleSlashIndex !== -1) {
      line = line.substring(0, doubleSlashIndex)
    }

    return line.trim();
  }).filter(line => line).join('\n')

  // Original first pass (now second): Wrap specified characters in spaces
  const charactersToWrap = "{}[]:,"
  for (let char of charactersToWrap) {
      str = str.split(char).join(' ' + char + ' ')
  }

  // Original second pass (now third): Replace " ." with " 0."
  str = str.replace(/ \./g, " 0.")

  // Original third pass (now fourth): Temporarily replace <...> sections
  const placeholders = []
  str = str.replace(/<[^>]+>/g, function(match) {
      placeholders.push(match)
      return "\0"
  })

  // Original fourth pass (now fifth): Wrap non-numeric substrings in quotes
  str = str.replace(/([^\s{}[\]:,]+)(?=[\s{}[\]:,])/g, function(match) {
      if (!/^(-?\d+\.?\d*|-?\.\d+)$/.test(match)) {
          return '"' + match + '"'
      }
      return match
  });

  // Restore the <...> sections
  str = str.replace(/\0/g, function() {
      return placeholders.shift()
  })

  // Original fifth pass (now sixth): Replace "< with {"EXPRESSION": "< and >" with >"}
  str = str.replace(/"<\s*/g, '{"EXPRESSION": "<')
  str = str.replace(/\s*>"/g, '>"}')

  // Original sixth pass (now seventh): Replace any group of more than a single " with a single "
  str = str.replace(/"{2,}/g, '"')

  // Replace "-." with "-0."
  str = str.replace(/-\./g, '-0.')

  // Remove blank spaces
  str = str.replace(/ /g, '')

  return JSON.parse(str)
  //return str
}



