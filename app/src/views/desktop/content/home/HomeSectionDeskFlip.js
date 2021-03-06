define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var RenderNode = require('famous/core/RenderNode');

    var Flipper = require('famous/views/Flipper');

    function HomePart() {
        View.apply(this, arguments);
        this.flipperFrontSide = true;

        this.on('click', function () {
            if (this.flipperFrontSide) {
                this._eventOutput.emit('parts:info', {icon: this.options.icon});
            } else {

                this._eventOutput.emit('parts:info', {icon: 'hideAll'});
            }
            this.flipper.flip();
            this.flipperFrontSide = !this.flipperFrontSide;
        })
        _initTransform.call(this);
        _contentParts.call(this);
        _sectionIcon.call(this);
    }

    HomePart.prototype = Object.create(View.prototype);
    HomePart.prototype.constructor = HomePart;

    HomePart.DEFAULT_OPTIONS = {
        center: [0.5, 0, 5],
        content: null,
        spring: null,
        icon: null,
        period: 0,
        dampingRatio: 0,
        sign: 0,
        width: window.innerWidth,
        sectionWidth: window.innerWidth / 2,
        sectionIconWidth: (window.innerWidth / 2) * .4,
        sectionImgWidth: (window.innerWidth / 2) * .26,
        sectionPop: {
            paddingTop: window.innerWidth / 4.15 + 'px',
            color: window.sv.scheme.textWhite,
            backgroundColor: window.sv.scheme.sectionColor,
            cursor: 'pointer',
            textAlign: 'center'
        }
    };

    function _contentParts() {
        this.mapSurface = new Surface({
            content: this.options.content,
            properties: this.options.sectionPop
        });
        this.mapSurface.pipe(this._eventOutput);
        this.renderNode.add(this.mapSurface);
    }

    function _sectionIcon() {
        this.sectionIconMod = new StateModifier({
            size: [this.options.sectionIconWidth, this.options.sectionIconWidth],
            align: [0.5, 0.1],
            origin: [0.5, 0]
        });

        this.sectionIconSurface = new Surface({
            size: [undefined, undefined],
            content: "<img style='width:" + (this.options.sectionImgWidth) + "px; height: " + (this.options.sectionImgWidth) + "px' class='home-icon-img' src='img/home-page/icons-color/" + this.options.icon + ".png'/>",
            properties: {
                cursor: 'pointer',
                textAlign: 'center',
                borderRadius: this.options.sectionIconWidth / 2 + 'px',
                backgroundColor: window.sv.scheme.homeIconColor
            }
        });
        this.sectionIconSurface.pipe(this._eventOutput);
        this.renderNode.add(this.sectionIconMod).add(this.sectionIconSurface);
    }

    function _initTransform() {
        this.spring = {
            method: 'spring',
            period: this.options.period,
            dampingRatio: this.options.dampingRatio
        }
        this.centerModifier = new StateModifier({
            align: this.options.center,
            origin: this.options.center
        });

        this.rootNode = this.add(this.centerModifier);

        this.renderNode = new RenderNode();
        this.flipper = new Flipper();
        this.flipInfo = new Surface({
            size: [undefined, undefined],
            content: this.options.flipInfo,
            classes: [],
            properties: {
                cursor: 'pointer',
                padding: '5px',
                color: window.sv.scheme.textDark,
                textAlign: 'center',
                backgroundColor: window.sv.scheme.textWhite
            }
        });
        this.flipInfo.pipe(this._eventOutput);
        this.flipper.setFront(this.renderNode);
        this.flipper.setBack(this.flipInfo);

        this.rootNode.add(this.flipper);
    }

    module.exports = HomePart;
});
