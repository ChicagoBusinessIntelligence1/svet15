define(['require', 'famous/core/Engine', 'views/cell/AppViewCell', 'views/desktop/AppViewDesk'], function (require, Engine, AppViewCell, AppViewDesk) {
    var Transform = require('famous/core/Transform');
    var mainContext = Engine.createContext();
    mainContext.setPerspective(500);

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
    var MOBILEWIDTH = 490; var device;
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
    sizing: {
        headerHeightCell: 0.08 * window.innerHeight,
        footerSize: 0 * window.innerHeight,
        headerHeight: 140,
        headerWidth: 1280,
        headerSmallHeight: Math.ceil(140 / 2.8),
        headerHeightShift: Math.ceil(140 - 140 / 2.8),

        contentWidth: 1200,
        contentHeight: window.innerHeight,
        logoContainerWidth: 340,
        navContainerWidth: 500
    },
    options: {
        darkScheme: {
            textYellow: '#fafad2',
            textWhite: '#fffaf0',
            textDark: '#393939',
            textShadow: '1px 1px #BD8D46',
            headerColor: '#000000',
            navColor: '#0B0B0B',
            homeIconColor: '#faebd7',
            logoColor: 'red',
            sectionColor: '#FF7F50',
            sectionFlipColor: '#F2CA80',
            footerColor: '#000000',
            aboutDesk: '#FFFAF0', radioDesk: '#FFFBE3',
            contactDesk: '#FFFAF0'
        }
    }
}

window.sv.scheme = window.sv.options.darkScheme;
