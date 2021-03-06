/*globals define*/
define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");
    var GridLayout = require("famous/views/GridLayout");
    var Transitionable = require('famous/transitions/Transitionable');
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Slider = require('famous/widgets/Slider');
    var VideoSurface = require('famous/surfaces/VideoSurface');
    var RenderNode = require('famous/core/RenderNode');
    /*App Require*/
    var HomeContentDesk = require('dviews/content/home/HomeContentDesk');
    var MapsDesk = require('dviews/content/home/MapsDesk');

    var Saturday = require('views/raphaelImg/saturday');
    var NewLight = require('views/raphaelImg/newLight');
    var Yp = require('views/raphaelImg/yp');

    MapIconsPanel.prototype = Object.create(View.prototype);
    MapIconsPanel.prototype.constructor = MapIconsPanel;

    MapIconsPanel.DEFAULT_OPTIONS = {
        fillDark: '#393939',
        satPaperWidth: '100px',
        satPaperHeight: '50px',
        iconsPanelSize: [300, 310],
        iconsGridSize: [100, 40],
        mapPanelProps: {
            border: '1px',
            fontSize: '18px',
            color: window.sv.scheme.sectionText,
            padding: '20px 15px',
            borderStyle: 'solid',
            fontWeight: 'bold',
            borderColor: '#999999',
            boxShadow: window.sv.scheme.boxShadow,
            backgroundColor: window.sv.scheme.aboutDesk
        },
        mapIconProps: {
            cursor: 'pointer'
        }
    };

    function MapIconsPanel() {

        View.apply(this, arguments);
        this.iconElements = [];
        _init.call(this);
        _mapIcons.call(this);
        _logoSaturday.call(this);
        _logoNewLight.call(this);
        _logoYp.call(this);
        _svetDistribution.call(this);
    }

    function _init() {
        this.iconPanelTrans = new Transitionable(0);
        this.centerModifier = new Modifier({
            size: this.options.iconsPanelSize,
            opacity: function () {
                return this.iconPanelTrans.get();
            }.bind(this),
            transform: Transform.translate(0, 0, 0)
        });
        this.rootNode = this.add(this.centerModifier);
    }

    function _svetDistribution() {
        this.distPointsMod = new Modifier({
            size: [270, 50],
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(15, 200, 0)
        });
        this.distPointsSurf = new Surface({
            content: '<hr/><p><span>*</span><img src="img/google-map/svet-distribution-xs.png"> Svet Media Distribution Points</p>' +
            '<p><span>*</span><img src="img/google-map/yp-business-xs.png"> Svet Yellow Pages Clients</p>',
            properties: {
                fontSize: '12px',
                cursor: 'pointer'
            }
        });
        this.distPointsSurf.pipe(this._eventOutput);
        this.rootNode.add(this.distPointsMod).add(this.distPointsSurf);
    }


    function _mapIcons() {
        /*Map Icons Panel*/
        this.mapIconsBg = new Surface({
            content: '<h>' +
            '<i class="fa fa-info-circle"></i>' +
            '&nbsp Our Products and Services</h><hr/>',
            properties: this.options.mapPanelProps
        });
        /*Grid Layout for Map Icons*/
        this.iconPanelTrans = new Transitionable(0);
        this.rootNode.add(this.mapIconsBg);
    }

    MapIconsPanel.prototype.animateUp = function () {
        this.iconPanelTrans.halt();
        this.iconPanelTrans.set(1, {duration: 1000, curve: "easeOutBounce"});
    }


    MapIconsPanel.prototype.animateDown = function () {
        this.iconPanelTrans.halt();
        this.iconPanelTrans.set(0, {duration: 1000, curve: "easeOutBounce"});
    }


    /** =Map Svet Icons
     */

    function _logoSaturday() {
        this.saturday = new Saturday();

        this.logoSvgMod = new Modifier({
            size: [150, 50],
            transform: Transform.translate(25, 80, 0)
        });
        this.saturday.pipe(this._eventOutput);
        this.saturday.on('click', function () {
            this._eventOutput.emit('show:svetPoints');
        }.bind(this));
        this.rootNode.add(this.logoSvgMod).add(this.saturday);
    }


    function _logoNewLight() {
        this.newSvetMod = new Modifier({
            size: [150, 50],
            transform: Transform.translate(25, 120, 0)
        });
        this.newLight = new NewLight();
        this.newLight.pipe(this._eventOutput);
        this.newLight.on('click', function () {
            this._eventOutput.emit('show:svetPoints');
        }.bind(this));
        this.rootNode.add(this.newSvetMod).add(this.newLight);
    }


    function _logoYp() {
        this.yp = new Yp();
        this.ypMod = new Modifier({
            size: [150, 50],
            transform: Transform.translate(25, 170, 0)
        });
        this.yp.pipe(this._eventOutput);
        this.yp.on('click', function () {
            this._eventOutput.emit('show:ypCompanies');
        }.bind(this));

        this.rootNode.add(this.ypMod).add(this.yp);

    }


    module.exports = MapIconsPanel;
});
