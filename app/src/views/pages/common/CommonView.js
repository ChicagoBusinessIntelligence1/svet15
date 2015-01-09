define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var StateModifier = require('famous/modifiers/StateModifier');
    var Transitionable = require('famous/transitions/Transitionable');
    var SpringTransition = require('famous/transitions/SpringTransition');

    Transitionable.registerMethod('spring', SpringTransition);


    function SlideView() {
        View.apply(this, arguments);
        this.rootModifier = new StateModifier({
            align: this.options.align,
            origin: this.options.origin,
            size: this.options.size
        });

        this.mainNode = this.add(this.rootModifier);

        _createBackground.call(this);
        _createViewContent.call(this);
    }

    SlideView.prototype = Object.create(View.prototype);
    SlideView.prototype.constructor = SlideView;

    SlideView.DEFAULT_OPTIONS = {
        angle: -0.5,
        align: [0.5, 0],
        origin: [0.5, 0],
        bg: '#ffffff',
        boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.5)',
        filmBorder: 15,
        photoBorder: 3,
        width: window.innerWidth,
        height: window.innerHeight
    };

    function _createBackground() {
        this.background = new Surface({
            properties: {
                backgroundColor: this.options.bg,
                boxShadow: this.options.boxShadow,
                cursor: 'pointer'
            }
        });

        this.background.pipe(this._eventOutput);
        this.mainNode.add(this.background);

        this.background.on('click', function () {
            this._eventOutput.emit('click');
        }.bind(this));
    }


    function _createViewContent() {

        this.contentModifier = new StateModifier({
            align: this.options.align,
            origin: this.options.origin,
            size: [this.options.width * .9, this.options.height * .9],
            transform: Transform.translate(0, this.options.filmBorder + this.options.photoBorder, 0.1)
        });

        this.viewContent = new Surface({
            content: this.options.content,
            properties: {
                zIndex: 2,
                pointerEvents: 'none'
            }
        });
        this.mainNode.add(this.contentModifier).add(this.viewContent);
    }

    SlideView.prototype.fadeIn = function () {
        this.contentModifier.setOpacity(1, {duration: 1500, curve: 'easeIn'});
        this.shake();
    };

    SlideView.prototype.shake = function () {
        this.rootModifier.halt();

        this.rootModifier.setTransform(
            Transform.rotateX(this.options.angle),
            {duration: 200, curve: 'easeOut'}
        );

        this.rootModifier.setTransform(
            Transform.identity,
            {method: 'spring', period: 600, dampingRatio: 0.15}
        );
    };

    module.exports = SlideView;
});
