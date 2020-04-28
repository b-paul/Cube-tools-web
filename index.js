"use strict"
var coMoves = [];
var eoMoves = [];
var UDSliceMoves = [];
var UDepMoves = [];
var cpMoves = [];

class coordCube {
    constructor() {
        this.co = 0;
        this.eo = 0;
        this.UDSlice = 0;
        this.UDep = 0;
        this.cp = 0;
    }

    function randomState() {
        do {
            this.UDSlice = Math.floor(Math.random() * );
            this.UDep = Math.floor(Math.random() * );
            this.cp = Math.floor(Math.random() * );
        } while (this.hasParity());
        this.co = Math.floor(Math.random() * 2187);
        this.eo = Math.floor(Math.random() * 2048);
    }

    function hasParity() {
        // do later

        return 1;
    }
}

function initMoves() {
}
