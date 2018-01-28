/**
 * Class to draw text with align and multiline in gd image
 * @see https://github.com/stil/gd-text/blob/b395fef9009bd37e6df137afacf0d25237c1bd61/src/Box.php#L267
 * @constructor
 */
var GdText = function(img, container) {
    var TEXT_ALIGN_X_LEFT = 'left',
        TEXT_ALIGN_X_CENTER = 'center',
        TEXT_ALIGN_X_RIGHT = 'right',
        TEXT_ALIGN_Y_TOP = 'top',
        TEXT_ALIGN_Y_CENTER = 'center',
        TEXT_ALIGN_Y_BOTTOM = 'bottom'
    self = {
        TEXT_ALIGN_X_LEFT: TEXT_ALIGN_X_LEFT,
        TEXT_ALIGN_X_CENTER: TEXT_ALIGN_X_CENTER,
        TEXT_ALIGN_X_RIGHT: TEXT_ALIGN_X_RIGHT,
        TEXT_ALIGN_Y_TOP: TEXT_ALIGN_Y_TOP,
        TEXT_ALIGN_Y_CENTER: TEXT_ALIGN_Y_CENTER,
        TEXT_ALIGN_Y_BOTTOM: TEXT_ALIGN_Y_BOTTOM,
        lastLine: 0,
        lineHeight: 1.1,
        img: img,
        container: container
    };

    /**
     * Wrap text in lines
     * @param text
     * @param font
     * @param size
     * @param container
     * @returns {Array}
     */
    var wrapTextWithOverflow = function(text, font, size) {
        var lines = [],
            // Split text explicitly into lines by \n, \r\n and \r
            explicitLines = text.split(/\n|\r\n?/);

        explicitLines.forEach(function(line) {
            // Check every line if it needs to be wrapped
            var words = line.split(' ');

            line = words[0];
            for (var i = 1; i < words.length; i++) {
                box = calculateBox(line + ' ' + words[i], font, size);
                var boxWidth = box[1].x;
                var containerWidth = (container.width - (container.padding.left + container.padding.right));

                if (boxWidth >= containerWidth) {
                    lines.push(line);
                    line = words[i];
                } else {
                    line = line + ' ' + words[i];
                }
            }

            lines.push(line);
        });

        return lines;
    }

    /**
     * Calculate textbox space points, in order: top-left, top-right, lower-right, lower-left
     * @param text
     * @param font
     * @param size
     * @returns {[*,*,*,*]}
     */
    var calculateBox = function(text, font, size) {
        // stringFTBBox return dimension in counter-clockwise ([xll, yll, xlr, ylr, xur, yur, xul, yul])
        var box = img.stringFTBBox(0x000000, font, size, 0, 0, 0, text);

        return [
            {x: box[6], y: box[7]},
            {x: box[4], y: box[5]},
            {x: box[2], y: box[3]},
            {x: box[0], y: box[1]}
        ];
    }

    var drawText = function(color, font, size, alignX, alignY, text) {
        var lines = [text];
        if (container.wrapText) {
            lines = wrapTextWithOverflow(text, font, size);
        }

        var lineHeightPx = self.lineHeight * size,
            textHeight = (lines.length * lineHeightPx),
            containerWidth = (container.width - (container.padding.left + container.padding.right)),
            containerHeight = (container.height - (container.padding.top + container.padding.bottom));
        // 0 is TEXT_ALIGN_Y_TOP
        var yAlignPosition = 0;
        if (alignY === TEXT_ALIGN_Y_CENTER) {
            yAlignPosition = (containerHeight / 2) - (textHeight / 2);
        } else if (alignY === TEXT_ALIGN_Y_BOTTOM) {
            yAlignPosition = containerHeight - textHeight;
        }

        var box = [],
            boxWidth = 0,
            n = 0,
            xAlignPosition = 0,
            baseline = 0.2;

        lines.forEach(function(line) {
            box = calculateBox(line, font, size);
            boxWidth = box[1].x;

            xAlignPosition = 0;
            if (alignX === TEXT_ALIGN_X_CENTER) {
                xAlignPosition = ((containerWidth - boxWidth) / 2);
            } else if (alignX === TEXT_ALIGN_X_RIGHT) {
                xAlignPosition = (containerWidth - boxWidth);
            }

            var yShift = lineHeightPx * (1 - baseline),
                // current line X and Y position
                xMOD = parseInt(container.padding.left + xAlignPosition, 10),
                yMOD = parseInt(container.padding.top + yAlignPosition + yShift + (n * lineHeightPx), 10);

            // if (line && this->backgroundColor) {
            //     // Marks whole textbox area with given background-color
            //     backgroundHeight = size;
            //     this->drawFilledRectangle(
            //         new Rectangle(
            //             xMOD,
            //             this->box->getY() + yAlignPosition + (n * lineHeightPx) + (lineHeightPx - backgroundHeight) + (1 - this->lineHeight) * 13 * (1 / 50 * size),
            //             box->getWidth(),
            //             backgroundHeight
            //         ),
            //         this->backgroundColor
            //     );
            // }

            // if (this->textShadow !== false) {
            //     this->drawInternal(
            //         new Point(
            //             xMOD + this->textShadow['offset']->getX(),
            //             yMOD + this->textShadow['offset']->getY()
            //         ),
            //         this->textShadow['color'],
            //         line
            //     );
            // }

            // this->strokeText(xMOD, yMOD, line);

            // this->drawInternal(
            //     new Point(
            //         xMOD,
            //         yMOD
            //     ),
            //     this->fontColor,
            //     line
            // );

            img.stringFT(color, font, size, 0, xMOD, yMOD, line);

            n++;
            self.lastLine = parseInt(yMOD, 10);
        });
    }

    self.wrapTextWithOverflow = wrapTextWithOverflow;
    self.calculateBox = calculateBox;
    self.drawText = drawText;

    return self;
};

module.exports = GdText;