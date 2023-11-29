const myMath = {

    vec_scale: function (vec, scale) {
        return [scale, vec[1]*scale, vec[2]*scale, vec[3]*scale   ]
    },

    vec_normalize: function (vec) {
        const norm = (vec[1]**2 + vec[2]**2 + vec[3]**2)**.5
        return  [0, vec[1]/norm, vec[2]/norm , vec[3]/norm]
    },

    makevector_from_points: function ( pini, pfinal ) {  // points as arrays, starting at index 1
        return [0, (pfinal[1]-pini[1]), (pfinal[2]-pini[2]),  (pfinal[3]-pini[3])]
    },

    vector_product: function (A, B) {
        return [0,
            (A[2]*B[3] - A[3]*B[2]),
            (A[3]*B[1] - A[1]*B[3]),
            (A[1]*B[2] - A[2]*B[1])
        ]
    }, 

    add_vectors: function ( A, B ) {
        return [0,
            A[1] + B[1],
            A[2] + B[2],
            A[3] + B[3]
        ]
    },

    CORDR_transform: function (A, U, V, W, P) {  // A: origin, U, V, W: CORDR unit vectors, P: point to be transformed
        let R = [0,
                    P[1] * U[1] +  P[2] * V[1] +  P[3] * W[1] , 
                    P[1] * U[2] +  P[2] * V[2] +  P[3] * W[2] , 
                    P[1] * U[3] +  P[2] * V[3] +  P[3] * W[3]  
                ]
        return this.add_vectors(A, R)  // translated point 
    }
}

function grad_col_rgb_normalised( level , min = 0, max = 1, reverse = false, palette = "red_blue") {  // assign a color to a value for rendering with scale
    let i = (level-min)/(max-min)
    if (reverse) {i = (1-i)}

    let redl, greenl, bluel, col_scale
    if (i > 1 ) { i = 1}
    if (i < 0 ) { i = 0}

    if (palette.toLowerCase() === "red_blue") {
        col_scale = [
            {v: 0 ,  r: 1, g: 0, b: 0},      // pure red
            {v: 0.2 ,  r: 1, g: .9, b: 0},
            {v: 0.25 ,  r: 1, g: 1, b: 0},   // pure yellow
            {v: 0.35 ,  r: .9, g: 1, b: 0},
            {v: 0.5 ,  r: 0, g: .9, b: 0},    // pure green
            {v: 0.75 ,  r: 0, g: 1, b: 1},   // pure cyan
            {v: 1 ,  r: 0, g: 0, b: .8}       // pure blue
        ]
    } else if (palette.toLowerCase() === "polar") {
        col_scale = [
            {v: 0 ,  r: 1, g: 0, b: 1},      // magenta
            {v: 0.2 ,  r: 1, g: 0, b: 0},      // pure red
            {v: 0.4 ,  r: 0, g: .9, b: 0},    // pure green
            {v: 0.6 ,  r: 0, g: 1, b: 1},   // pure cyan
            {v: 0.8 ,  r: 0, g: 0, b: .8},       // pure blue
            {v: 1 ,  r: 1, g: 1, b: 1}       // white
        ]
    }
    for (let n = 0 ; n < col_scale.length-1 ; n++) 
            {
                if ((col_scale[n].v  <= i)  &&  (col_scale[n+1].v >= i))     { 
                const delta = (i - col_scale[n].v  ) / (  col_scale[n + 1].v - col_scale[n].v  )
                redl = (col_scale[n+1].r - col_scale[n].r) * delta + col_scale[n].r
                greenl = (col_scale[n+1].g - col_scale[n].g) * delta + col_scale[n].g
                bluel = (col_scale[n+1].b - col_scale[n].b) * delta + col_scale[n].b
                }    
            }
    // output normalised to 1
    this.r = redl ;     this.g = greenl ;     this.b = bluel
}

function rgbToHex(r, g, b) {
    function componentToHex(c) {
        var hex = c.toString(16)
        return hex.length == 1 ? "0" + hex : hex;
    }
    let maxval = Math.max(r,g,b)
    r = Math.floor((r/maxval) * 255)
    g = Math.floor((g/maxval) * 255)
    b = Math.floor((b/maxval) * 255)
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}