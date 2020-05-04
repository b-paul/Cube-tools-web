"use strict"
var coMoves = [];
var eoMoves = [];
var UDSlicep1Moves = [];
var UDSlicep2Moves = [];
var UDepMoves = [];
var cpMoves = [];

function fact(a) {
    var res = a;

    for (var i = 2; i < a; i++) {
        res *= i;
    }

    return res;
}

class coordCube {
    constructor() {
        this.co = 0;
        this.eo = 0;
        this.cp = 0;
        this.ep = 0;
    }

    randomState() {
        do {
            this.cp = Math.floor(Math.random() * 2048);
            this.ep = Math.floor(Math.random() * 479001600);
        } while ((this.getParity(this.UDSlice, 4) ^ this.getParity(this.ep, 12)) == 0);
        this.co = Math.floor(Math.random() * 2187);
        this.eo = Math.floor(Math.random() * 2048);
    }

    getParity(index, n) {
        var p = 0;
        for (var i = n-2; i >= 0; i--) {
            p = p + index % (4-i);
            index = Math.floor(index / (4-i));
        }
        p &= 1;

        return p;
    }
    // No make move because it would take way too long (1000x)
    // to generate ep moves
}

function fromCubieCO(co) {
    var result = 0;
    for (var i = 0; i < 7; i++) {
        result += co[i] * Math.pow(3,i);
    }
    return result;
}

function fromCubieEO(eo) {
    var result = 0;
    for (var i = 0; i < 11; i++) {
        result += eo[i] << i;
    }
    return result;
}

function fromCubieCP(cp) {
    var result = 0;
    for (var i = 7; i > 0; i--) {
        var s = 0;
        for (var j = i-1; j >= 0; j--) {
            if (cp[j] > cp[i]) s++;
        }
        result = (result+s)*i;
    }
    return result;
}

function fromCubieEP(ep) {
    var result = 0;
    for (var i = 11; i > 0; i--) {
        var s = 0;
        for (var j = i-1; j >= 0; j--) {
            if (ep[j] > ep[i]) s++;
        }
        result = (result+s)*i;
    }
    return result;
}

function toCubieCO(co) {
    var result = [];
    var sum = 0;
    for (var i = 0; i < 7; i++) {
        result[i] = co % 3;
        sum += result[i];
        co = Math.floor(co/3);
    }
    // get co[7] for cp
    result[7] = sum % 3;
    return result;
}

function toCubieEO(eo) {
    var result = [];
    var sum = 0;
    for (var i = 0; i < 11; i++) {
        result[i] = eo & 1;
        sum += result[i];
        eo >>= 1;
    }

    result[11] = sum & 1;
    return result;
}

function toCubieCP(cp) {
    var result = [0,0,0,0,0,0,0,0];
    var order = [];
    var used = [];
    for (var i = 0; i < 8; i++) {
        used[i] = false;
        order[i] = cp % (i+1);
        cp /= (i+1);
        cp >>= 0;
    }
    for (var i = 7; i >= 0; i--) {
        var j = 7;
        while (used[j]) j--;
        while (order[i] > 0) {
            order[i]--;
            do {
                j--;
            } while (used[j]);
        }
        result[i] = j;
        used[j] = true;
    }
    return result;
}

function toCubieEP(ep) {
    var result = [0,0,0,0,0,0,0,0,0,0,0,0];
    var order = [];
    var used = [];
    for (var i = 0; i < 12; i++) {
        used[i] = false;
        order[i] = ep % (i+1);
        ep /= (i+1);
        ep >>= 0;
    }
    for (var i = 11; i >= 0; i--) {
        var j = 11;
        while (used[j]) j--;
        while (order[i] > 0) {
            order[i]--;
            do {
                j--;
            } while (used[j]);
        }
        result[i] = j;
        used[j] = true;
    }
    return result;
}

function initMoves() {
    initCO();
    initEO();
    initCP();
}

function initCO() {
    var coMvs = [
        [2,0,0,1,1,0,0],
        [0,1,2,0,0,2,1],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [1,2,0,0,2,1,0],
        [0,0,1,2,0,0,2],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [2,0,0,1,1,0,0],
        [0,1,2,0,0,2,1],
        [0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0],
        [1,2,0,0,2,1,0],
        [0,0,1,2,0,0,2],
    ];
    var cpMvs = [
        [4,1,2,0,7,5,6],
        [0,2,6,3,4,1,5],
        [3,0,1,2,4,5,6],
        [0,1,2,3,7,4,5],
        [1,5,2,3,0,4,6],
        [0,1,3,7,4,5,2],
        [7,1,2,4,3,5,6],
        [0,6,5,3,4,2,1],
        [2,3,0,1,4,5,6],
        [0,1,2,3,6,7,4],
        [5,4,2,3,1,0,6],
        [0,1,7,6,4,5,3],
        [3,1,2,7,0,5,6],
        [0,5,1,3,4,6,2],
        [1,2,3,0,4,5,6],
        [0,1,2,3,7,4,5],
        [4,0,2,3,5,1,6],
        [0,1,6,2,4,5,7],
    ];
    for (var i = 0; i < 18; i++) {
        var cos = [];
        for (var j = 0; j < 2187; j++) {
            var co = toCubieCO(j);
            var tCo = co;
            for (var k = 0; k < 7; k++) {
                co[k] = tCo[cpMvs[i][k]];
            }
            for (var k = 0; k < 7; k++) {
                co[k] += coMvs[i][k];
                co[k] %= 3;
            }
            cos.push(fromCubieCO(co));
        }
        coMoves.push(cos);
    }
}

function initEO() {
    var eoMvs = [
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [1,0,0,0,1,0,0,0,1,1,0],
        [0,0,1,0,0,0,1,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0],
        [1,0,0,0,1,0,0,0,1,1,0],
        [0,0,1,0,0,0,1,0,0,0,1],
    ];
    var epMvs = [
        [0,1,2,8,4,5,6,10,7,9,3],
        [0,11,2,3,4,9,6,7,8,1,10],
        [3,0,1,2,4,5,6,7,8,9,10],
        [0,1,2,3,7,4,5,6,8,9,10],
        [9,1,2,3,8,5,6,7,0,4,10],
        [0,1,10,3,4,5,11,7,8,9,6],
        [0,1,2,7,4,5,6,3,10,9,8],
        [0,5,2,3,4,1,6,7,8,11,10],
        [2,3,0,1,4,5,6,7,8,9,10],
        [0,1,2,3,6,7,4,5,8,9,10],
        [4,1,2,3,0,5,6,7,9,8,10],
        [0,1,6,3,4,5,2,7,8,9,11],
        [0,1,2,10,4,5,6,8,3,9,7],
        [0,9,2,3,4,11,6,7,8,5,10],
        [1,2,3,0,4,5,6,7,8,9,10],
        [0,1,2,3,7,4,5,6,8,9,10],
        [8,1,2,3,9,5,6,7,4,0,10],
        [0,1,11,3,4,5,10,7,8,9,2],
    ];
    for (var i = 0; i < 18; i++) {
        var eos = [];
        for (var j = 0; j < 2048; j++) {
            var eo = toCubieEO(j);
            var tEo = eo;
            for (var k = 0; k < 11; k++) {
                eo[k] = tEo[epMvs[i][k]];
            }
            for (var k = 0; k < 11; k++) {
                eo[k] += eoMvs[i][k];
                eo[k] &= 1;
            }
            eos.push(fromCubieEO(eo));
        }
        eoMoves.push(eos);
    }
}

function initCP() {
    var cpMvs = [
        [4,1,2,0,7,5,6],
        [0,2,6,3,4,1,5],
        [3,0,1,2,4,5,6],
        [0,1,2,3,7,4,5],
        [1,5,2,3,0,4,6],
        [0,1,3,7,4,5,2],
        [7,1,2,4,3,5,6],
        [0,6,5,3,4,2,1],
        [2,3,0,1,4,5,6],
        [0,1,2,3,6,7,4],
        [5,4,2,3,1,0,6],
        [0,1,7,6,4,5,3],
        [3,1,2,7,0,5,6],
        [0,5,1,3,4,6,2],
        [1,2,3,0,4,5,6],
        [0,1,2,3,7,4,5],
        [4,0,2,3,5,1,6],
        [0,1,6,2,4,5,7],
    ];
    for (var i = 0; i < 18; i++) {
        var cps = [];
        for (var j = 0; j < 40320; j++) {
            var cp = toCubieCP(j);
            var tCp = cp;
            for (var k = 0; k < 7; k++) {
                cp[k] = tCp[cpMvs[i][k]];
            }
            cps.push(fromCubieCP(cp));
        }
        cpMoves.push(cps);
    }
}

initMoves();
console.log(cpMoves);

var a = 21021;
console.log(toCubieCP(a));
console.log(fromCubieCP([4,1,2,0,7,5,6,3]));
console.log([4,1,2,0,7,5,6,3]);

var cube = new coordCube();

cube.randomState();
