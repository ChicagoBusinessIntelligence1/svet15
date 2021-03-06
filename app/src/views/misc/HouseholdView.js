define(function (require, exports, module) {
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var View = require('famous/core/View');
    var FlexibleLayout = require('famous/views/FlexibleLayout');
    var Timer = require('famous/utilities/Timer');
    var EventHandler = require('famous/core/EventHandler');

    var Transitionable = require('famous/transitions/Transitionable');


    function HouseholdView(genericSync) {
        var that = this;
        View.apply(this, arguments);

        this.eventInput = new EventHandler();
        this.eventOutput = new EventHandler();
        EventHandler.setInputHandler(this, this.eventInput);
        EventHandler.setOutputHandler(this, this.eventOutput);

        var flex = new FlexibleLayout({
            ratios: [2, 10]
        });
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var widthScale = 0.82;
        var svgScale = 0.1;
        this.contentWidth = widthScale * windowWidth;
        this.svgWidth = Math.floor(svgScale * windowWidth);
        var svgHousehold = _creageHouseholdSvg(this.svgWidth);

        var transWidth = new Transitionable([this.contentWidth, 100]);
        window.onresize = function () {
            windowWidth = window.innerWidth;
        }


        this.householdModifier = new Modifier({
            size: transWidth.get(),
            transform: Transform.translate(0, 0, 10),
            origin: [0.5, 0],
            align: [0.5, 0]
        });
        this.svgHousehold = new Surface({
            size: [undefined, undefined],
            content: svgHousehold,
            properties: {
                fontSize: '11px',
                zIndex: 10
            }
        });

        this.textHousehold = new Surface({
            size: [undefined, undefined],
            content: '<h2> Household and Income</h2><ul>' +
            '<li>64% are married with an average of 1.6 children per family. </li>' +
            '<li> 57% are homeowners (compared to 41% for all US foreign born). </li>' +
            '<li> Average Annual Household Income is $87,500. </li>' +
            '<li> 27.4% have an income of $100,000 or higher. </li>' +
            '</ul>',
            properties: {
                zIndex: 10
            }
        });

        var householdContent = [];
        householdContent.push(this.svgHousehold);
        householdContent.push(this.textHousehold);
        flex.sequenceFrom(householdContent);

        this.bgColor = new Surface({
            size: [undefined, undefined],
            properties: {
                backgroundColor: '#FFFAE2'
            }

        });
        this.svgHousehold.pipe(genericSync);
        this.add(this.bgColor);
        this.add(this.householdModifier).add(flex);
    }


    HouseholdView.prototype = Object.create(View.prototype);
    HouseholdView.prototype.constructor = HouseholdView;


    HouseholdView.DEFAULT_OPTIONS = {};


    module.exports = HouseholdView;
});
