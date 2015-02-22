define(function (require, exports, module) {
    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Transform = require('famous/core/Transform');
    var Modifier = require("famous/core/Modifier");

    newLight.prototype = Object.create(View.prototype);
    newLight.prototype.constructor = newLight;
    newLight.DEFAULT_OPTIONS = {};

    function newLight() {
        this.blue = '#046DC9'
        this.border = '1px solid #E5E5E5',
            View.apply(this, arguments);
        _init.call(this);
    }

    function _init() {
        this.centerModifier = new Modifier({
            size: [138, 30],
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 5, 0)
        });
        this.surface = new Surface({
            content: _newLightSvg.call(this),
            properties: {
                backgroundColor: this.blue,
                boxShadow: window.sv.scheme.boxShadow,
                border: this.border,
                cursor: 'pointer'
            }
        });
        this.surface.pipe(this._eventOutput);

        this.rootNode = this.add(this.centerModifier);
        this.rootNode.add(this.surface);
    }

    function _newLightSvg() {

        var divNewLight = document.createElement('div');
        divNewLight.style.height = '30px';
        var paper = Raphael(divNewLight, '138', '30');

        var objects = paper.set();
        var path_a = paper.path("M16.54,33.383h-2.913v-5.25H8.288v5.25H5.384V20.492h2.903v5.143h5.339v-5.143h2.913V33.383z").attr({
            fill: '#FCFAFC',
            parent: 'objects',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_a');
        var path_b = paper.path("M24.936,33.608c-1.845,0-3.349-0.601-4.512-1.803c-1.162-1.201-1.744-2.769-1.744-4.697 c0-2.037,0.59-3.686,1.77-4.945c1.182-1.258,2.745-1.887,4.694-1.887c1.84,0,3.327,0.603,4.462,1.807 c1.136,1.205,1.704,2.793,1.704,4.766c0,2.024-0.589,3.657-1.767,4.899C28.365,32.985,26.831,33.608,24.936,33.608z M25.063,22.775 c-1.02,0-1.829,0.382-2.429,1.146c-0.6,0.765-0.898,1.775-0.898,3.036c0,1.275,0.299,2.285,0.898,3.027s1.385,1.114,2.357,1.114 c1,0,1.794-0.361,2.381-1.082c0.588-0.722,0.882-1.726,0.882-3.007c0-1.336-0.285-2.377-0.854-3.121 C26.831,23.146,26.051,22.775,25.063,22.775z").attr({
            fill: '#FCFAFC',
            parent: 'objects',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_b');
        var path_c = paper.path("M33.449,33.383V20.492h4.693c1.438,0,2.543,0.264,3.316,0.792c0.774,0.526,1.16,1.271,1.16,2.228 c0,0.696-0.236,1.304-0.705,1.826c-0.472,0.52-1.072,0.882-1.804,1.087v0.037c0.917,0.113,1.65,0.451,2.199,1.015 c0.548,0.563,0.822,1.249,0.822,2.057c0,1.183-0.422,2.119-1.268,2.812c-0.845,0.691-1.999,1.038-3.461,1.038H33.449z M36.353,22.632v3.055h1.277c0.598,0,1.069-0.144,1.416-0.436c0.344-0.289,0.516-0.69,0.516-1.198c0-0.949-0.707-1.421-2.121-1.421 H36.353z M36.353,27.845v3.397h1.572c0.672,0,1.198-0.154,1.578-0.464c0.381-0.313,0.571-0.74,0.571-1.277 c0-0.517-0.187-0.922-0.562-1.213c-0.375-0.295-0.899-0.443-1.569-0.443H36.353z").attr({
            fill: '#FCFAFC',
            parent: 'objects',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_c');
        var path_d = paper.path("M45.252,33.383V20.492h2.904v4.828h1.897c3.11,0,4.666,1.265,4.666,3.792c0,1.352-0.42,2.398-1.259,3.147 c-0.839,0.75-2.022,1.124-3.55,1.124H45.252z M48.156,27.515v3.656h1.313c1.462,0,2.193-0.62,2.193-1.861 c0-1.197-0.714-1.795-2.14-1.795H48.156z M58.835,33.383H55.95V20.492h2.885V33.383z").attr({
            fill: '#FCFAFC',
            parent: 'objects',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_d');
        var path_e = paper.path("M105.339,33.384V20.495h4.691c1.438,0,2.543,0.264,3.317,0.79c0.772,0.528,1.158,1.271,1.158,2.229 c0,0.696-0.235,1.305-0.705,1.826c-0.471,0.521-1.069,0.883-1.803,1.087v0.036c0.917,0.114,1.65,0.454,2.197,1.016 c0.55,0.563,0.823,1.25,0.823,2.058c0,1.182-0.421,2.119-1.268,2.811c-0.844,0.691-1.999,1.037-3.461,1.037H105.339z M108.24,22.633v3.057h1.275c0.6,0,1.073-0.144,1.417-0.437c0.346-0.291,0.519-0.69,0.519-1.2c0-0.948-0.707-1.42-2.121-1.42 H108.24z M108.24,27.847v3.398h1.573c0.672,0,1.197-0.155,1.578-0.465c0.381-0.313,0.57-0.739,0.57-1.278 c0-0.516-0.187-0.921-0.562-1.214c-0.374-0.294-0.896-0.441-1.566-0.441H108.24z").attr({
            fill: '#FCFAFC',
            parent: 'objects',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_e');
        var path_f = paper.path("M124.872,33.384h-7.731V20.495h7.434v2.364h-4.531v2.868h4.217v2.356h-4.217v2.946h4.829V33.384z").attr({
            fill: '#FCFAFC',
            parent: 'objects',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_f');
        var path_g = paper.path("M135.991,22.858h-3.678v10.525h-2.911V22.858h-3.657v-2.364h10.246V22.858z").attr({
            fill: '#FCFAFC',
            parent: 'objects',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_g');
        var path_h = paper.path("M65.001,18.461c0.714,0.562,1.607,0.845,2.679,0.845c1.055,0,1.938-0.283,2.652-0.845 c0.713-0.564,1.124-1.322,1.232-2.274h-2.068c-0.036,0.454-0.224,0.832-0.566,1.132c-0.341,0.3-0.745,0.45-1.212,0.45 c-0.474,0-0.885-0.148-1.232-0.445c-0.348-0.297-0.537-0.674-0.566-1.136h-2.067C63.905,17.14,64.289,17.897,65.001,18.461z").attr({
            fill: '#FFFFFF',
            parent: 'objects',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_h');
        var path_i = paper.path("M97.749,33.45c0.567,0.14,1.169,0.229,1.833,0.229c1.518,0,2.744-0.231,3.688-0.688v-2.676 c-0.944,0.555-1.979,0.832-3.112,0.832c-1.186,0-2.131-0.371-2.832-1.118c-0.7-0.746-1.052-1.748-1.052-3.004 c0-1.313,0.371-2.352,1.114-3.12c0.743-0.769,1.72-1.152,2.932-1.152c1.103,0,2.086,0.26,2.95,0.78v-2.82 c-0.864-0.319-1.926-0.48-3.186-0.48c-0.649,0-1.25,0.086-1.822,0.222l-27.806-0.006l-5.115,7.914 c-0.414,0.634-0.636,0.989-0.665,1.06H64.64c0.049-0.3,0.074-0.896,0.074-1.785v-7.188h-2.743v12.999h2.922l5.322-8.167 c0.306-0.472,0.522-0.831,0.646-1.079h0.055c-0.063,0.58-0.089,1.283-0.089,2.105v7.141L97.749,33.45z").attr({
            fill: '#FFFFFF',
            parent: 'objects',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_i');
        objects.attr({'id': 'objects', 'name': 'objects'});
        var red_lines = paper.set();
        var path_j = paper.path("M74.167,32.442v1h23.588c-0.831-0.189-1.556-0.523-2.178-1H74.167z").attr({
            fill: '#BF2033',
            parent: 'red_lines',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_j');
        var path_k = paper.path("M74.167,31.442h20.416c-0.24-0.31-0.438-0.644-0.606-1h-19.81V31.442z").attr({
            fill: '#BF2033',
            parent: 'red_lines',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_k');
        var path_l = paper.path("M74.167,28.442v1h19.447c-0.078-0.319-0.146-0.651-0.186-1H74.167z").attr({
            fill: '#BF2033',
            parent: 'red_lines',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_l');
        var path_m = paper.path("M93.419,26.442h-9.654v1h9.589c0-0.029-0.004-0.054-0.004-0.083C93.35,27.04,93.392,26.745,93.419,26.442z").attr({
            fill: '#BF2033',
            parent: 'red_lines',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_m');
        var path_n = paper.path("M93.832,24.442H83.765v1h9.801C93.642,25.1,93.715,24.757,93.832,24.442z").attr({
            fill: '#BF2033',
            parent: 'red_lines',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_n');
        var path_o = paper.path("M95.022,22.442H83.765v1h10.543C94.512,23.086,94.754,22.755,95.022,22.442z").attr({
            fill: '#BF2033',
            parent: 'red_lines',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_o');
        var path_p = paper.path("M96.083,21.442c0.6-0.445,1.279-0.749,2.017-0.949v-0.051H83.765v1H96.083z").attr({
            fill: '#BF2033',
            parent: 'red_lines',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'path_p');
        red_lines.attr({'id': 'red_lines', 'name': 'red_lines'});
        var banner = paper.set();
        banner.attr({'id': 'banner', 'name': 'banner'});
        var layer5 = paper.set();
        var rect8796 = paper.rect(74.167, 20.442, 10.004, 7).attr({
            id: 'rect8796',
            x: '74.167',
            y: '20.442',
            fill: '#213065',
            groupmode: 'layer',
            label: 'field',
            parent: 'banner',
            'stroke-width': '0',
            'stroke-opacity': '1'
        }).data('id', 'rect8796');
        layer5.attr({
            'id': 'layer5',
            'inkscape:groupmode': 'layer',
            'inkscape:label': 'field',
            'parent': 'banner',
            'name': 'layer5'
        });
        var rsrGroups = [objects, red_lines, banner, layer5];
        objects.push(path_a, path_b, path_c, path_d, path_e, path_f, path_g, path_h, path_i);
        red_lines.push(path_j, path_k, path_l, path_m, path_n, path_o, path_p);
        banner.push();
        layer5.push(rect8796);

        paper.renderfix()
        var group = paper.set();
        var step = 3.5;
        for (var i = 0; i < rsrGroups.length; i++) {
            var arr = rsrGroups[i];
            for (var j = 0; j < arr.length; j++) {
                var path = arr[j];
                var transPath = j * step;
                path.transform('...s0.95,0.95, 0,0, t1,-12')
                //path.transform('t' + transPath + ',-7');
                //console.log(path.translate());
            }
        }
        return divNewLight;
    }

    module.exports = newLight;
});
