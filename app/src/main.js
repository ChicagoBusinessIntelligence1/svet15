define(['require', 'famous/core/Engine', 'views/cell/AppViewCell', 'views/desktop/AppViewDesk'], function (require, Engine, AppViewCell, AppViewDesk) {
    var MOBILEWIDTH = 490;

    var Transform = require('famous/core/Transform');

    var mainContext = Engine.createContext();
    mainContext.setPerspective(1000);

    var initialDevice = window.responsive();
    var appView = initialDevice === 'cell' ? new AppViewCell() : new AppViewDesk();

    mainContext.on('resize', function () {
        var newDevice = window.responsive();
        if (newDevice !== initialDevice) {
            window.location.reload();
        }
    });
    mainContext.add(appView);
});

window.responsive = function responsive() {
    var MOBILEWIDTH = 1490;
    var device;
    switch (true) {
        case window.innerWidth <= MOBILEWIDTH:
            device = 'cell';
            break;
        case window.innerWidth > MOBILEWIDTH:
            device = 'desktop';
            break;
    }
    return device;
}

window.sv = {
    options: {
        lightScheme: {
            svYellow: {
                headerColor: '#A65005',
                navColor: '#A65005',
                footerColor: '#FFDE9C'
            }
        },
        darkScheme: {
            svYellow: {
                textYellow: '#FFEC9D',
                textShadow: '1px 1px #BD8D46',
                headerColor: '#000000',
                navColor: '#0B0B0B',
                sectionColor: '#F0650E',
                footerColor: '#000000'
            }
        }
    }

}
window.sv.scheme = window.sv.options.darkScheme.svYellow;
