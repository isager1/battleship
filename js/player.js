/*jslint browser this */
/*global _, shipFactory, player, utils */

(function (global) {
    "use strict";

    var ship = {dom: {parentNode: {removeChild: function () {}}}};

    var player = {
        grid: [],
        tries: [],
        role: 0,
        fleet: [],
        nextTries: [],
        gameOver: 0,
        game: null,
        activeShip: 0,
        orientation: 'Horizontale',
        init: function () {
            // créé la flotte
            this.fleet.push(shipFactory.build(shipFactory.TYPE_BATTLESHIP));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_DESTROYER));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SUBMARINE));
            this.fleet.push(shipFactory.build(shipFactory.TYPE_SMALL_SHIP));
            // créé les grilles
            this.grid = utils.createGrid(10, 10);
            this.tries = utils.createGrid(10, 10);
        },
        play: function (col, line) {
            // appel la fonction fire du game, et lui passe une calback pour récupérer le résultat du tir
            this.game.fire(this, col, line, _.bind(function (hasSucced) {
                this.tries[line][col] = hasSucced;
            }, this));
        },
        // quand il est attaqué le joueur doit dire si il a un bateaux ou non à l'emplacement choisi par l'adversaire
        receiveAttack: function (col, line, callback) {
            var succeed = false;

            if (this.grid[line][col] !== 0) {
                succeed = true;
                this.grid[line][col] = 0;
            }
            callback.call(undefined, succeed);
        },

        shot: function() {
            var e = true;
            while(e) {
                var x = this.randomPos();
                var y = this.randomPos();
                if(this.tries[x][y] === 0) {
                    this.nextTries = [x, y];
                    this.nextTries[0] = x;
                    this.nextTries[1] = y;
                    e = false;
                }
            }
        },
      
        randomPos: function() {
            return Math.floor(Math.random() * 10);
        },
    
        setActiveShipPosition: function (x, y) {
            var ship = this.fleet[this.activeShip];
            var i = 0;
            while (i < ship.getLife()) {
                if(ship.getId() === 4) {
                    this.grid[y][x - 1 + i] = ship.getId();
                } else {
                    this.grid[y][x - 2 + i] = ship.getId();
                }
                i += 1;
            }
            return true;
        },
        setActiveShipPositionRight: function (x, y) {
            var ship = this.fleet[this.activeShip];
            var i = 0;
            while (i < ship.getLife()) {
                if(ship.getId() > 2) {
                    this.grid[y-1+i][x] = ship.getId();
                } else {
                    this.grid[y-2+i][x] = ship.getId();
                }
                i += 1;
            }
            return true;
        },
        verifShipPosition: function(x, y) {
            var ship = this.fleet[this.activeShip];
            var i = 0;
            while (i < ship.getLife()) {
                if(ship.getId() === 4) {
                    if(this.grid[y][x-1+i] !== 0) {return false;}
                } else {
                    if(this.grid[y][x-2+i] !== 0) {return false;}
                }
                i += 1;
            }
            return true;
        },
        verifShipPositionRight: function(x, y) {
            var ship = this.fleet[this.activeShip];
            var i = 0;
            while (i < ship.getLife()) {
                if(ship.getId() > 2) {
                    if((y-1+i < 0) || (y-1+i > 9) || this.grid[y-1+i][x] !== 0) {return false;}
                } else {
                    if((y-2+i < 0) || (y-2+i > 9) || this.grid[y-2+i][x] !== 0) {return false;}
                }
                i += 1;
            }

            return true;
        },
        clearPreview: function () {
            this.fleet.forEach(function (ship) {
                if (ship.dom.parentNode) {
                    ship.dom.parentNode.removeChild(ship.dom);
                }
            });
        },
        resetShipPlacement: function () {
            this.clearPreview();

            this.activeShip = 0;
            this.grid = utils.createGrid(10, 10);
        },
        activateNextShip: function () {
            if (this.activeShip < this.fleet.length - 1) {
                this.activeShip += 1;
                return true;
            } else {
                return false;
            }
        },
        renderTries: function (grid) {
            this.tries.forEach(function (row, rid) {
                row.forEach(function (val, col) {
                    var node = grid.querySelector('.row:nth-child(' + (rid + 1) + ') .cell:nth-child(' + (col + 1) + ')');

                    if (val === true) {
                        node.style.backgroundColor = '#e60019';
                    } else if (val === false) {
                        node.style.backgroundColor = '#aeaeae';
                    }
                });
            });
        },

         isShipOk: function(callback) {
            this.callback = callback();
        },
        renderShips: function (grid) {
        },
        setGame: function(obj) {
           this.game = obj;
        },
    };

    global.player = player;

}(this));