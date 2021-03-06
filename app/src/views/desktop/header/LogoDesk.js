define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var Transitionable = require('famous/transitions/Transitionable');
    /*App Require*/
    var ArrowUp = require('dviews/common/ArrowUp');

    LogoDesk.prototype = Object.create(View.prototype);
    LogoDesk.prototype.constructor = LogoDesk;

    LogoDesk.DEFAULT_OPTIONS = {
        paperWidth: window.sv.sizing.logoWidth,
        paperHeight: window.sv.sizing.headerHeight * .9
    };

    function LogoDesk() {
        this.fullPosition = window.sv.sizing.headerHeight * .09;
        this.shortPosition = -window.sv.sizing.headerHeight * 0.36;
        this.shiftTransitionable = new Transitionable(this.fullPosition);
        this.opacityTransitionable = new Transitionable(1);

        this.red = new Transitionable(255);
        this.green = new Transitionable(255);
        this.blue = new Transitionable(255);

        View.apply(this, arguments);
        _init.call(this);
        _svetSvg.call(this);
        //_rmgText.call(this);
        _logoSvg.call(this);
        _upArrow.call(this);
    }


    function _init() {
        this.centerModifier = new Modifier({
            size: [window.sv.sizing.logoWidth, window.sv.sizing.headerHeight * .8],
            align: [0.5, 0],
            origin: [0.5, 0]
        });
        this.rootNode = this.add(this.centerModifier);
    }

    function _logoSvg() {
        var logoDiv = document.createElement('div');
        logoDiv.style.height = this.options.paperHeight + 'px';
        var logoPaper = Raphael(logoDiv, 260, this.options.paperHeight);
        var path = drawpath(logoPaper, "M80,80 L20,80 L130,10 L240,80 L180,80", 260, {
            fill: 'none',
            stroke: window.sv.scheme.logoColor,
            'text-align': 'center',
            'stroke-width': 11,
            'fill-opacity': 0
        });
        var text = logoPaper.text(129, 56, 'RUSSIAN MEDIA GROUP');
        text.attr({
            stroke: 'none',
            fill: window.sv.scheme.textWhite,
            'font-size': 22,
            'text-align': 'center',
            'line-height': '5em',
            'font-family': "Myriad Pro"
        });

        var shift = window.innerWidth > 1160 ? 0 : (window.innerWidth - 1160) / 5;
        this.svgLine = new Transitionable(shift);
        this.logoSvgMod = new Modifier({
            opacity: function () {
                return this.opacityTransitionable.get();
            }.bind(this),
            transform: function () {
                shift = window.innerWidth > 1160 ? 84 : 10;
                this.svgLine.halt();
                this.svgLine.set(shift, {duration: 50});
                return Transform.translate(this.svgLine.get() - 34, -70, 0);
            }.bind(this)
        });
        this.logoSvgSurf = new Surface({
            content: logoDiv,
            properties: {
                textAlign: 'center'
            }
        });
        this.logoSvgSurf.pipe(this._eventOutput);
        this.rootNode.add(this.logoSvgMod).add(this.logoSvgSurf);
    }

    function _svetSvg() {
        var shiftUpArrow = sv.sizing.headerHeightSm - 65;

        var shift = window.innerWidth > 1160 ? 0 : (window.innerWidth - 1160) / 5;
        var divSvet = document.createElement('div');
        divSvet.style.height = '30px';
        divSvet.style.width = '73px';


        this.svetSvgTrans = new Transitionable(-55);
        this.svetInitialVert = this.svetSvgTrans.get() - shiftUpArrow;
        var paper = Raphael(divSvet, 80, 32);
        var textSvet = paper.text(35, 10, 'SVET');
        textSvet.attr({
            stroke: 'none',
            fill: window.sv.scheme.textWhite,
            'font-size': 32,
            'font-weight': 'bold',
            'font-family': "Myriad Pro"
        }).transform(' t5,8');
        this.svetSvgMod = new Modifier({
            size: [73, 32],
            align: [0.5, 0.6],
            origin: [0.5, 0.6],
            transform: function () {
                shift = window.innerWidth > 1160 ? 84 : 10;
                this.svgLine.halt();
                this.svgLine.set(shift, {duration: 50});
                return Transform.translate(this.svgLine.get() - 38, this.svetInitialVert, 0);
            }.bind(this)
        });

        this.svetSvgSurf = new Surface({
            properties: {
                'zIndex': '5'
            },
            content: divSvet
        });
        this.rootNode.add(this.svetSvgMod).add(this.svetSvgSurf);
    }

    function _upArrow() {
        this.arrowUp = new ArrowUp();
        var shiftUpArrow = sv.sizing.headerHeightSm - 65;
        var shift = window.innerWidth > 1160 ? 0 : (window.innerWidth - 1160) / 5;

        var initialAngle = 0;
        this.arrowUpAngle = new Transitionable(initialAngle);
        this.arrowUpOpacity = new Transitionable(0);


        this.arrowUpMod = new Modifier({
            size: [45, 33],
            align: [0.5, 0],
            origin: [0.5, 0],
            opacity: function () {
                return this.arrowUpOpacity.get();
            }.bind(this),

            transform: function () {
                shift = window.innerWidth > 1160 ? 84 : 10;
                this.svgLine.halt();
                this.svgLine.set(shift, {duration: 50});
                return Transform.translate(this.svgLine.get() - 55, this.svetSvgTrans.get() + shiftUpArrow + 33, 0);
            }.bind(this)
        });

        this.arrowUp.on('mousedown', function () {
            this._eventOutput.emit('scroll:up');

        }.bind(this));

        this.rootNode.add(this.arrowUpMod).add(this.arrowUp);
        this.arrowUpAngle.set(0, {duration: 1000});
        this.rootNode.add(this.arrowUpMod).add(this.arrowUp);
    }

    LogoDesk.prototype.increaseLogo = function () {
        var currentPosition = this.shiftTransitionable.get();
        if (currentPosition !== this.fullPosition) {

            this.arrowUpOpacity.halt();
            this.arrowUpOpacity.set(0, {duration: 1000});
            this.shiftTransitionable.halt();
            this.opacityTransitionable.halt();
            this.svetSvgTrans.halt();
            this.svetSvgTrans.set(this.svetInitialVert, {duration: 500});
            this.shiftTransitionable.set(this.fullPosition + 50, {duration: 500, curve: "linear"});
            this.opacityTransitionable.set(1, {duration: 500, curve: "linear"});
            this.changeColorHigh.call(this);
        }
    }

    LogoDesk.prototype.decreaseLogo = function () {
        var currentPosition = this.shiftTransitionable.get();
        if (currentPosition !== this.shortPosition) {

            this.arrowUpOpacity.halt();
            this.arrowUpOpacity.set(1, {duration: 2000});
            this.shiftTransitionable.halt();
            this.opacityTransitionable.halt();

            this.svetSvgTrans.halt();
            this.svetSvgTrans.set(-70, {duration: 500});

            this.shiftTransitionable.set(this.shortPosition, {duration: 500, curve: "linear"});
            this.opacityTransitionable.set(0, {duration: 500, curve: "linear"});

            this.changeColorShort.call(this);
        }
    }

    LogoDesk.prototype.changeColorHigh = function () {
        this.red.halt();
        this.green.halt();
        this.blue.halt();

        this.red.set(255, {duration: 500, curve: "linear"});
        this.green.set(255, {duration: 500, curve: "linear"});
        this.blue.set(255, {duration: 500, curve: "linear"});

    }

    LogoDesk.prototype.changeColorShort = function () {
        this.red.halt();
        this.green.halt();
        this.blue.halt();

        this.red.set(250, {duration: 500, curve: "linear"});
        this.green.set(250, {duration: 500, curve: "linear"});
        this.blue.set(210, {duration: 500, curve: "linear"});
    }

    function drawpath(canvas, pathstr, duration, attr, callback) {
        var guide_path = canvas.path(pathstr).attr({stroke: "none", fill: "none"});
        var path = canvas.path(guide_path.getSubpath(0, 1)).attr(attr);
        var total_length = guide_path.getTotalLength(guide_path);
        var last_point = guide_path.getPointAtLength(0);
        var start_time = new Date().getTime();
        var interval_length = 50;
        var result = path;
        var interval_id = setInterval(function () {
            var elapsed_time = new Date().getTime() - start_time;
            var this_length = elapsed_time / duration * total_length;
            var subpathstr = guide_path.getSubpath(0, this_length);
            attr.path = subpathstr;
            path.animate(attr, interval_length);
            if (elapsed_time >= duration) {
                clearInterval(interval_id);
                if (callback != undefined) callback();
                guide_path.remove();
            }
        }, interval_length);
        return result;
    }

    module.exports = LogoDesk;
});
