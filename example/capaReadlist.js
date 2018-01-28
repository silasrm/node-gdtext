var gd = require('node-gd');
var GdText = require('./gdtext');

/**
 * @param params
 * @returns {{}}
 * @constructor
 */
var CapaReadlist = function(params) {
    var defaultOptions = {
            width: 700,
            height: 700,
            wrapText: true,
            padding: {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            },
            title: 'Lorem ipsum',
            titleColor: [215, 62, 93], // Cerise Red rgb(215, 62, 93)
            titleSize: 70,
            author: 'Mussum',
            authorColor: [107, 0, 90], // Pompador rgb(107, 0, 90)
            authorSize: 25,
            by: 'por',
            byColor: [107, 0, 90], // Pompador rgb(107, 0, 90)
            bySize: 20,
            backgroundColor: [45, 0, 101], // Paua rgb(45, 0, 101)
            titleMargimBottom: 60,
            titleFontPath: '',
            byFontPath: '',
            authorFontPath: ''
        },
        generalOptions = {},
        self = {};

    generalOptions = Object.assign({}, defaultOptions, params);

    /**
     * @param text
     * @returns {*}
     */
    var getAuthor = function(text) {
        var words = text.split(' '),
            finalName = words[0];

        for (var i = 1; i < words.length; i++) {
            if ((finalName + words[i]).length > 15) {
                break;
            }

            finalName = finalName + ' ' + words[i];
        }

        return finalName;
    };

    /**
     * Generate image
     * @param destination
     * @param optionsAlt
     */
    var generate = function (destination, optionsAlt) {
        var options = Object.assign({}, {}, generalOptions);

        if (optionsAlt != undefined && typeof optionsAlt === 'object') {
            options = Object.assign({}, generalOptions, optionsAlt);
        }

        var img = gd.createTrueColorSync(options.width, options.height),
            gdText = new GdText(img, options),
            backgroundColor = img.colorAllocate(
                options.backgroundColor[0],
                options.backgroundColor[1],
                options.backgroundColor[2]
            ),
            titleColor = img.colorAllocate(
                options.titleColor[0],
                options.titleColor[1],
                options.titleColor[2]
            ),
            authorColor = img.colorAllocate(
                options.authorColor[0],
                options.authorColor[1],
                options.authorColor[2]
            );

        img.fill(0, 0, backgroundColor);

        // Render string in image
        gdText.drawText(
            titleColor, options.titleFontPath, options.titleSize, gdText.TEXT_ALIGN_X_CENTER,
            gdText.TEXT_ALIGN_Y_CENTER, options.title
        );
        // Draw after title
        img.stringFT(
            authorColor, options.byFontPath, options.bySize, 0, 350,
            (gdText.lastLine + options.titleMargimBottom), options.by
        );
        img.stringFT(
            authorColor, options.authorFontPath, options.authorSize, 0, 390,
            (gdText.lastLine + options.titleMargimBottom), getAuthor(options.author)
        );

        // Write image buffer to disk
        img.savePng(destination, 9, function(err) {
            if(err) {
                throw err;
            }
        });

        // Destroy image to clean memory
        img.destroy();
    };

    self.options = generalOptions;
    self.generate = generate;

    return self;
};


module.exports = CapaReadlist;