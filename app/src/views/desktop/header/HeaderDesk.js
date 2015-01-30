define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Modifier = require("famous/core/Modifier");
    var StateModifier = require('famous/modifiers/StateModifier');
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var RenderNode = require('famous/core/RenderNode');
    var Transform = require('famous/core/Transform');
    var Transitionable = require('famous/transitions/Transitionable');

    var LogoDesk = require('dviews/header/LogoDesk');
    var NavDesk = require('dviews/header/NavDesk');

    function HeaderDesk() {
        this.flexTransitionable = new Transitionable(30);
        this.opacityTransitionable = new Transitionable(0);
        this.widthTransitionable = new Transitionable(window.sv.sizing.headerHeight);

        View.apply(this, arguments);
        _headerBackground.call(this);
        _flex.call(this);
    }

    HeaderDesk.prototype = Object.create(View.prototype);
    HeaderDesk.prototype.constructor = HeaderDesk;

    HeaderDesk.DEFAULT_OPTIONS = {
        smallHeight: window.sv.sizing.headerHeight / 2.8,
        flexOpts: {
            ratios: [1, 1, 2, 1, 1],
            direction: 0
        },
        backgroundOpts: {
            backgroundColor: 'black',
            opacity: 0.7,
            duration: 3000,
            curve: 'easeInOut'
        }
    };
    function _headerBackground() {
        this.backgroundMod = new Modifier({
            size: function () {
                return [undefined, this.widthTransitionable.get()]
            }.bind(this),
            opacity: function () {
                return this.opacityTransitionable.get();
            }.bind(this)
        });
        this.backgroundSurf = new Surface({
            size: [undefined, undefined],
            properties: this.options.backgroundOpts
        });
        this.rootNode = this.add(this.backgroundMod);
        this.rootNode.add(this.backgroundSurf);
        this.opacityTransitionable.set(this.options.backgroundOpts.opacity, {
            duration: this.options.backgroundOpts.duration,
            curve: this.options.backgroundOpts.curve
        });
    }

    function _flex() {
        var flexOptions = {
            ratios: this.options.flexOpts.ratios,
            direction: this.options.flexOpts.direction
        }
        this.logoDesk = new LogoDesk();
        this.layout = new FlexibleLayout(flexOptions);
        var menuItems = ['Home', 'About Us', 'Logo', 'Radio', 'Contact Us'];
        this.contents = [];
        this.surfaces = [];
        for (var i = 0; i < menuItems.length; i++) {
            if (menuItems[i] === 'Logo') {
                this.contents.push(this.logoDesk);
                continue;
            }


            this.renderNode = new RenderNode();

            var mod = new Modifier({
                align: [0.5, 0],
                origin: [0.5, 0],
                size: [undefined, true],
                transform: Transform.translate(0, 40, 0)
            });
            var surf = new Surface({
                size: [undefined, undefined],
                content: menuItems[i],
                properties: {
                    color: 'white',
                    cursor: 'pointer',
                    textAlign: 'center',
                    fontSize: '1.2em'
                }
            });
            this.surfaces.push(surf);

            this.renderNode.add(mod).add(surf);
            this.contents.push(this.renderNode);
        }

        this.surfaces.forEach(function (surf, index) {
            surf.on('click', function () {
                this._eventOutput.emit('navigateTo', {index: index});
            }.bind(this));
        }.bind(this))
        this.layout.sequenceFrom(this.contents);
        this.flexMod = new Modifier({
            transform: function () {
                return Transform.translate(0, this.flexTransitionable.get(), 0);
            }.bind(this)
        });
        this.rootNode.add(this.flexMod).add(this.layout);
    }

    HeaderDesk.prototype.increaseHeader = function () {
        this.currentHeaderHeight = this.widthTransitionable.get();

        if (this.currentHeaderHeight < window.sv.sizing.headerHeight) {
            this.flexTransitionable.halt();
            this.flexTransitionable.set(30, {duration: 500});
            this.widthTransitionable.halt();
            this.widthTransitionable.set(window.sv.sizing.headerHeight, {duration: 500, curve: "linear"});
            this.logoDesk.increaseLogo();
        }
    }

    HeaderDesk.prototype.decreaseHeader = function () {
        this.currentHeaderHeight = this.widthTransitionable.get();

        if (this.currentHeaderHeight > this.options.smallHeight) {
            this.flexTransitionable.halt();
            this.flexTransitionable.set(-25, {duration: 500});

            this.widthTransitionable.halt();
            this.widthTransitionable.set(this.options.smallHeight, {duration: 500, curve: "linear"}, function () {
                this._eventOutput.emit('header:decreased');
            }.bind(this));
            this.logoDesk.decreaseLogo();
        }
    }

    module.exports = HeaderDesk;
});
