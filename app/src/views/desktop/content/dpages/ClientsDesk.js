define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");


    function ClientsDesk() {
        View.apply(this, arguments);
        _init.call(this);

        this.mapSurface = new Surface({
            size: [undefined, undefined],
            content: 'Clients Desk',
            classes: [],
            properties: {
                color: 'white',
                textAlign: 'center',
                backgroundColor: 'Indigo'
            }
        });
        this.mapSurface.pipe(this._eventOutput);
        this.rootNode.add(this.mapSurface);
    }

    function _init() {
        this.centerModifier = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerModifier);
    }

    ClientsDesk.prototype = Object.create(View.prototype);
    ClientsDesk.prototype.constructor = ClientsDesk;

    ClientsDesk.DEFAULT_OPTIONS = {};

    module.exports = ClientsDesk;
});
