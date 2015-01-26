define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    var contactDesk = require('text!dviews/jade/contact/contact-desk.html');

    function ContactUsDesk() {
        View.apply(this, arguments);
        this.contentHeight = window.innerWidth / 2;

        this.centerModifier = new Modifier({
            size: [undefined, window.innerHeight],
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.surface = new Surface({
            content: contactDesk,
            classes: [],
            properties: {
                paddingTop: window.sv.sizing.headerHeight * 1.2 + 'px',
                paddingLeft: '25px',
                paddingRight: '25px',
                color: window.sv.scheme.textDark,
                textAlign: 'center',
                backgroundColor: window.sv.scheme.aboutDesk
            }
        });

        this.surface.pipe(this._eventOutput);
        this.rootNode = this.add(this.centerModifier);
        this.rootNode.add(this.surface);
    }

    ContactUsDesk.prototype = Object.create(View.prototype);
    ContactUsDesk.prototype.constructor = ContactUsDesk;

    ContactUsDesk.DEFAULT_OPTIONS = {};

    module.exports = ContactUsDesk;
});
