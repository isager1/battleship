/*jslint browser this */
/*global _, player */

(function (global) {
    "use strict";

    var computer = _.assign({}, player, {
        grid: [],
        gameOver: 0,
        role: 1,
        tries: [],
        nextTries: [],
        fleet: [],
        activeShip: 0,
        game: null,
        play: function () {
            var self = this;
            setTimeout(function () {
                if (self.defineAttak() && self.dificult === 1) {

                } else {
                    self.shot();     
                }
                self.game.fire(this, self.nextTries[0], self.nextTries[1], function (hasSucced) {
                    self.tries[self.nextTries[0]][self.nextTries[1]] = hasSucced;
                });
            }, 2000);
        },
        isShipOk: function (callback) {
            var i = 0;
            var j;
            while(i < 4) {
                this.randomOrientation();
                var x = this.randomPos();
                var y = this.randomPos();
                if ((this.orientation == 'Horizontale' 
                    && this.verifShipPosition(y, x) 
                    && this.setActiveShipPosition(y, x)) 
                    || (this.orientation == 'Verticale' 
                    && this.verifShipPositionRight(y, x) 
                    && this.setActiveShipPositionRight(y, x))) {
                        var ship = this.fleet[this.activeShip];
                        this.activateNextShip();
                        i++;
                    }
            }
       

            setTimeout(function () {
                callback();
            }, 500);
        },
        randomOrientation: function() {
            var rand = Math.random() * 10;
            if(rand > 4) {
                this.orientation = 'Horizontale';
            } else {
                this.orientation = 'Verticale';
            }
        },
        
        defineAttak: function() {
            var i = 0;
            var j = 0;
            for(var x=0; x<10; x++) {
                for(var y=0;y<10;y++) {
                    if(this.tries[x][y] === true) {
                        return true;
                    } 
                }
            }
            return false;
        }
    });

    global.computer = computer;

}(this));