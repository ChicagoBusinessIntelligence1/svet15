define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Transitionable = require('famous/transitions/Transitionable');
    var GenericSync = require("famous/inputs/GenericSync");
    var MouseSync = require('famous/inputs/MouseSync');
    var ScrollSync = require("famous/inputs/ScrollSync");
    var RenderNode = require('famous/core/RenderNode');
    var Easing = require('famous/transitions/Easing');

    var Timer = require('famous/utilities/Timer');


    function ScrollDesk() {
        this.shift = window.innerHeight;
        this.initScrollPos = 0;
        this.maxScrollPos = 8 / (window.innerHeight / this.shift);
        this.dir;
        this.containerTrans = new Transitionable(this.initScrollPos);


        View.apply(this, arguments);
        _init.call(this);

        _content.call(this);
        _handleScroll.call(this);
    }

    function _restrict(pos) {
        pos = pos > 0 ? 0 : pos;
        pos = pos < -this.shift * 7 ? -this.shift * 7 : pos;

        return pos;
    }

    function _handleScroll() {
        this.syncEnabled = true;
        this.sync.on('start', function (data) {
            this.syncEnabled = true;
            this.utilFunc = Timer.every(function () {
                console.log();
            }.bind(this), 1);
        }.bind(this));
        this.normCoef = 2;
        this.sync.on('update', function (data) {

            var velocityNorm = this.normCoef*Math.log(Math.abs(data.velocity));
            velocityNorm = velocityNorm > 1 ? velocityNorm : 1;
            var pos = this.containerTrans.get();
            pos += Math.floor(data.delta / 3.2) * velocityNorm;

            pos = _restrict.call(this, pos);
            this.containerTrans.halt();

            if (this.syncEnabled) {
                this.containerTrans.set(pos, {duration: 80});
            }

        }.bind(this));

        this.sync.on('end', function (data) {
            console.log('end');
            Timer.clear(this.utilFunc);
            if (data.delta > 0) {
                this.dir = -1;
            } else {
                this.dir = 1;

            }
            var pos = this.containerTrans.get();


            var endState = pos + data.delta;
            endState = _restrict.call(this, endState);

            var duration = Math.abs(pos - endState) * 10;
            if (this.syncEnabled) {

                this.containerTrans.set(endState, {
                    duration: duration, curve: 'linear'
                });
            }

        }.bind(this));

    }

    function _content() {
        this.surfaces = [];

        GenericSync.register({scroll: ScrollSync});
        this.sync = new GenericSync({
            scroll: {
                direction: 1,
                rails: true,
                scale: 1,
                stallTime: 150
            }
        });

        this.container = new ContainerSurface({
            size: [undefined, window.innerHeight],
            properties: {
                overflow: 'hidden'

            }
        });
        //this.rootNode.add(this.container);
        this.renderNode = new RenderNode();

        for (var i = 0; i < 8; i++) {
            this.modSurf = new Modifier({
                transform: Transform.translate(0, i * this.shift, 0)
            });
            this.surf = new Surface({
                size: [undefined, this.shift],
                properties: {
                    backgroundColor: "hsl(" + (i * 360 / 8) + ", 100%, 50%)",
                    color: "#404040",
                    lineHeight: '200px',
                    textAlign: 'center'
                }
            });
            this.surfaces.push(this.surf);
            this.surf.pipe(this.sync);
            this.surf.on('click', function () {
                this.containerTrans.halt();
                this.syncEnabled = false;
            }.bind(this))
            this.renderNode.add(this.modSurf).add(this.surf);
        }
        this.rootNode.add(this.renderNode);


    }

    function _init() {

        this.centerModifier = new Modifier({
            size: [undefined, window.innerHeight],
            transform: function () {
                return Transform.translate(0, this.containerTrans.get(), 0);
            }.bind(this)
        });
        this.rootNode = this.add(this.centerModifier);
    }

    ScrollDesk.prototype = Object.create(View.prototype);
    ScrollDesk.prototype.constructor = ScrollDesk;

    ScrollDesk.DEFAULT_OPTIONS = {};

    ScrollDesk.prototype.reflow = function () {
        this.renderNode.render();
    };
    module.exports = ScrollDesk;
});
