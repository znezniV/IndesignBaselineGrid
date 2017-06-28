
//  © Michael Schoenenberger, June 2017

// Default Values (A4 Portrait)
var portrait = false,
    pageHeight = 297,
    pageWidth = 210,
    orientation,
    upperPadding = 15,
    innerPadding = 10,
    outterPadding = 10,
    numberOfRows = 6,
    numberOfCollums = 4,
    rowsGutterWidthInLines = 1,              // Amount of base line grid lines
    customColumnGutterWidth = 5,
    fontSize = 9,
    baseLineGridHeight = fontSize * 1.2,
    fontMsize = 2.286;

var spaltenAbstand,
    _height = 0,
    x = -1,
    zeilenHoehe,
    xDef,
    rasterEnde,
    baseStart;

var rasterEndeChoices = ["1","2","3","4","5"],
    defNumber,
    gutterWidthDifferent,
    customSize,
    format;

var aFormats = [841, 594, 420, 297, 210, 148, 105, 74, 52, 37, 26],
    bFormats = [1000, 707, 500, 353, 250, 176, 125, 88, 62, 44, 31],
    cFormats = [917, 648, 458, 324, 229, 162, 114, 81, 57, 40, 28],
    allFormats = [];

for (var i = 0; i < 11; i++) {
    allFormats.push(aFormats[i]);
    allFormats.push(bFormats[i]);
    allFormats.push(cFormats[i]);
}

//configure dialogs
var startDialog = app.dialogs.add({
    name: "Create A Baseline Grid, Rows and Columns",
    canCancel: true
});

var endDialog = app.dialogs.add({
    name: "Create A Baseline Grid, Rows and Columns",
    canCancel: true
});

var min_width_left = 200;
var min_width_right = 160;

function defineStartDialog(){
    with(startDialog) {
            //Add a dialog column.
            with(dialogColumns.add()) {
                //Create a border panel.
                with(borderPanels.add()) {
                        with(dialogColumns.add()) {
                            staticTexts.add({ staticLabel: "Page Size:", minWidth: min_width_left });
                            staticTexts.add({ staticLabel: "Page Orientation", minWidth: min_width_left });
                        }
                        with(dialogColumns.add()) {
                            //Create a number entry field. Note that this field uses editValue
                            //rather than editText (as a textEditBox would).
                            format = dropdowns.add({                    stringList: ["A0", "B0", "C0", "A1", "B1", "C1", "A2", "B2", "C2", "A3", "B3", "C3", "A4", "B4", "C4", "A5", "B5", "C5", "A6", "B6", "C6", "A7", "B7", "C7", "A8", "B8", "C8", "A9", "B9", "C9", "A10", "B10", "C10"],
                                                                        selectedIndex: 12,
                                                                        minWidth: min_width_right });

                            orientation = dropdowns.add({               stringList: ["Portrait", "Landscape"],
                                                                        selectedIndex: 0,
                                                                        minWidth: min_width_right });
                        }
                    }
                customSize = enablingGroups.add({staticLabel: "Custom Page Size", checkedState: false});
                with (customSize) {
                        with (dialogColumns.add()) {
                            staticTexts.add({ staticLabel: "Page Height:", minWidth: min_width_left });
                            staticTexts.add({ staticLabel: "Page Width:", minWidth: min_width_left });
                        }
                        with (dialogColumns.add()) {
                            pageHeight     = measurementEditboxes.add({    editValue: pageHeight * 2.83465,
                                                                        editUnits:MeasurementUnits.millimeters,
                                                                        minWidth: min_width_right});

                            pageWidth      = measurementEditboxes.add({    editValue: pageWidth * 2.83465,
                                                                        editUnits:MeasurementUnits.millimeters,
                                                                        minWidth: min_width_right});
                        }
                    }
                    //Create another border panel.
                with(borderPanels.add()) {
                        with(dialogColumns.add()) {
                            staticTexts.add({ staticLabel: "Upper Margin:", minWidth: min_width_left });
                            staticTexts.add({ staticLabel: "Left Margin:", minWidth: min_width_left });
                            staticTexts.add({ staticLabel: "Right Margin:", minWidth: min_width_left});
                        }
                        with(dialogColumns.add()) {
                            //Create a number entry field. Note that this field uses editValue
                            //rather than editText (as a textEditBox would).
                            upperPadding    = measurementEditboxes.add({    editValue: upperPadding * 2.83465,
                                                                            editUnits:MeasurementUnits.millimeters,
                                                                            minWidth: min_width_right});

                            innerPadding     = measurementEditboxes.add({    editValue: innerPadding * 2.83465,
                                                                            editUnits:MeasurementUnits.millimeters,
                                                                            minWidth: min_width_right});

                            outterPadding    = measurementEditboxes.add({    editValue: outterPadding * 2.83465,
                                                                            editUnits:MeasurementUnits.millimeters,
                                                                            minWidth: min_width_right});
                        }
                    }
                    //Create another border panel.
                with(borderPanels.add()) {
                        with(dialogColumns.add()) {
                            staticTexts.add({ staticLabel: "Rows:", minWidth: min_width_left });
                            staticTexts.add({ staticLabel: "Columns:", minWidth: min_width_left });
                            staticTexts.add({ staticLabel: "Textlines in the column gutter:", minWidth: min_width_left });
                        }
                        with(dialogColumns.add()) {
                            //Create a number entry field. Note that this field uses editValue
                            //rather than editText (as a textEditBox would).
                            numberOfRows                         = integerEditboxes.add({    editValue: numberOfRows,
                                                                                        largeNudge: 50,
                                                                                        smallNudge: numberOfRows,
                                                                                        minimumValue: 0,
                                                                                        maximumValue: 200,
                                                                                        minWidth: min_width_right});

                            numberOfCollums                         = integerEditboxes.add({    editValue: numberOfCollums,
                                                                                        largeNudge: 50,
                                                                                        smallNudge: numberOfCollums,
                                                                                        minimumValue: 0,
                                                                                        maximumValue: 200,
                                                                                        minWidth: min_width_right});

                            rowsGutterWidthInLines     = integerEditboxes.add({    editValue: rowsGutterWidthInLines,
                                                                                        largeNudge: 50,
                                                                                        smallNudge: rowsGutterWidthInLines,
                                                                                        minimumValue: 0,
                                                                                        maximumValue: 100,
                                                                                        minWidth: min_width_right});
                        }
                    }
                gutterWidthDifferent = enablingGroups.add({staticLabel: "Different Gutter Width", checkedState: false});
                with (gutterWidthDifferent) {
                        with (dialogColumns.add()) {
                            staticTexts.add( {staticLabel: "Row Gutter Width:", minWidth: min_width_left} );
                        }
                        with (dialogColumns.add()) {
                            customColumnGutterWidth = measurementEditboxes.add({  editValue: customColumnGutterWidth * 2.83465,
                                                                        editUnits:MeasurementUnits.millimeters,
                                                                        minWidth: min_width_right});
                        }
                    }
                    //Create another border panel.
                with(borderPanels.add()) {
                        with(dialogColumns.add()) {
                            staticTexts.add({ staticLabel: "Font Size:", minWidth: min_width_left });
                            staticTexts.add({ staticLabel: "Leading:", minWidth: min_width_left });
                            staticTexts.add({ staticLabel: "Height of the letter M:", minWidth: min_width_left});
                        }
                        with(dialogColumns.add()) {
                            //Create a number entry field. Note that this field uses editValue
                            //rather than editText (as a textEditBox would).
                            fontSize    = measurementEditboxes.add({    editValue: fontSize,
                                                                        editUnits:MeasurementUnits.points,
                                                                        minWidth: min_width_right});
                            baseLineGridHeight = measurementEditboxes.add({    editValue: baseLineGridHeight,
                                                                        editUnits:MeasurementUnits.points,
                                                                        minWidth: min_width_right});
                            fontMsize = measurementEditboxes.add({    editValue: fontMsize * 2.83465,
                                                                        editUnits:MeasurementUnits.millimeters,
                                                                        minWidth: min_width_right});
                        }
                    }
            }
        }
}

function defineEndDialog(){
    with(endDialog) {
        //Add a dialog column.
            with(dialogColumns.add()) {
                //Create a border panel.
                with(borderPanels.add()) {
                        with(dialogColumns.add()) {
                            staticTexts.add({ staticLabel: "Select Bottom Margin", minWidth: min_width_left });
                        }
                        with(dialogColumns.add()) {
                            //Create a number entry field. Note that this field uses editValue
                            //rather than editText (as a textEditBox would).
                            defNumber = radiobuttonGroups.add();
                            with(defNumber) {

                                radiobuttonControls.add({staticLabel: rasterEndeChoices[0].toFixed(2) + " mm", checkedState: true, minWidth: min_width_right});

                                for (var i = 1; i < rasterEndeChoices.length; i++) {
                                    radiobuttonControls.add({staticLabel: rasterEndeChoices[i].toFixed(2) + " mm", checkedState: false, minWidth: min_width_right});
                                }
                            }
                        }
                    }
                }
    }
}

function redefineVars(){

    customSize = customSize.checkedState;

    if (customSize){

        pageHeight = pageHeight.editValue * 0.352778;
        pageWidth = pageWidth.editValue * 0.352778;

    } else {

        pageWidth = allFormats[format.selectedIndex];
        pageHeight = Math.round(Math.sqrt(2) * pageWidth);

        if (orientation.selectedIndex == 0)  {
            portrait = true;
        }

        if (portrait) {
            if (pageHeight < pageWidth) {
                var a = pageHeight;
                pageHeight = pageWidth;
                pageWidth = a;
            }
        } else {
            if (pageHeight > pageWidth) {
                var a = pageHeight;
                pageHeight = pageWidth;
                pageWidth = a;
            }
        }
    }

    pageHeight = Math.floor(pageHeight);
    pageWidth = Math.floor(pageWidth);

    upperPadding = upperPadding.editValue * 0.352778;
    innerPadding = innerPadding.editValue * 0.352778;
    outterPadding = outterPadding.editValue * 0.352778;

    numberOfRows = numberOfRows.editValue;
    numberOfCollums = numberOfCollums.editValue;
    rowsGutterWidthInLines = rowsGutterWidthInLines.editValue;

    gutterWidthDifferent = gutterWidthDifferent.checkedState;
    customColumnGutterWidth = customColumnGutterWidth.editValue * 0.352778;

    fontSize = fontSize.editValue;
    baseLineGridHeight = baseLineGridHeight.editValue * 0.352778;
    fontMsize = fontMsize.editValue * 0.352778;
}


function calcStuff(){
    spaltenAbstand = (baseLineGridHeight - fontMsize) + (rowsGutterWidthInLines * baseLineGridHeight);
    if (!gutterWidthDifferent) {
        customColumnGutterWidth = spaltenAbstand;
    }

    //find maximal rows:

    while ((pageHeight - upperPadding) > _height) {
        x += 1;
        zeilenHoehe = fontMsize + (x * baseLineGridHeight);
        _height = (numberOfRows * zeilenHoehe) + ((numberOfRows - 1) * spaltenAbstand);
    }

    xDef = x - 1;

    zeilenHoehe = (fontMsize + (xDef * baseLineGridHeight));
    _height = (numberOfRows * zeilenHoehe) + ((numberOfRows - 1) * spaltenAbstand);

    rasterEnde = ((pageHeight - _height) - upperPadding);
    baseStart = (upperPadding - (baseLineGridHeight - fontMsize));

    rasterEndeChoices[0] = rasterEnde;
}

function calcAlternatives(i){
    x = xDef - i;
    zeilenHoehe = (fontMsize + (x * baseLineGridHeight));
    _height = (numberOfRows * zeilenHoehe) + ((numberOfRows - 1) * spaltenAbstand);
    rasterEnde = ((pageHeight - _height) - upperPadding);
    baseStart = (upperPadding - (baseLineGridHeight - fontMsize));
    return rasterEnde;
}

function setValues(i){
    xDef -= i;
    zeilenHoehe = (fontMsize + (xDef * baseLineGridHeight));
    _height = (numberOfRows * zeilenHoehe) + ((numberOfRows - 1) * spaltenAbstand);
    rasterEnde = ((pageHeight - _height) - upperPadding);
    baseStart = (upperPadding - (baseLineGridHeight - fontMsize));
}

function createPage(){
    //Create PAGE
    //Create a new document.
    var myDocument = app.documents.add();
    with(myDocument.documentPreferences) {
        pageHeight = pageHeight + "mm";
        pageWidth = pageWidth + "mm";
        if (portrait) {
            pageOrientation = PageOrientation.portrait;
        } else {
            pageOrientation = PageOrientation.landscape;
        }
        pagesPerDocument = 4;
    }

    //Get a reference to the first master spread.
    var myMasterSpread = myDocument.masterSpreads.item(0);

    with(myMasterSpread.pages.item(0).marginPreferences) {
        columnCount = 1;
        //columnGutter can be a number or a measurement string.
        //columnGutter = "1p";
        bottom = rasterEnde + "mm"
        left = innerPadding + "mm"
        right = outterPadding + "mm"
        top = upperPadding + "mm"
    }

    with(myMasterSpread.pages.item(1).marginPreferences) {
        columnCount = 1;
        //columnGutter can be a number or a measurement string.
        //columnGutter = "1p";
        bottom = rasterEnde + "mm"
        left = innerPadding + "mm"
        right = outterPadding + "mm"
        top = upperPadding + "mm"
    }

    with(myMasterSpread) {
        //Parameters (all optional): row count, column count, row gutter,
        //column gutter,guide color, fit margins, remove existing, layer.
        //Note that the createGuides method does not take an RGB array
        //for the guide color parameter.
        createGuides(numberOfRows, numberOfCollums, spaltenAbstand + "mm", customColumnGutterWidth + "mm", UIColors.pink, true, true, myDocument.layers.item(0));
    }

    //add baseline grid:
    var myGridPreferences = myDocument.gridPreferences;
    myGridPreferences.baselineDivision = baseLineGridHeight + "mm";
    myGridPreferences.baselineStart = baseStart + "mm";
    myGridPreferences.baselineGridShown = true;

    with(myDocument.textDefaults) {
        alignToBaseline = true;
        pointSize = fontSize;
        leading = baseLineGridHeight;
    }
}

defineStartDialog();
    //Display the dialog box.
if (startDialog.show() == true) {

    redefineVars();
    calcStuff();

    for (var i = 0; i < rasterEndeChoices.length; i++) {
        rasterEndeChoices[i] = calcAlternatives(i);
    }

    defineEndDialog();

    if (endDialog.show() == true) {

        setValues(defNumber.selectedButton);

        endDialog.destroy();
        startDialog.destroy();

        createPage();
    } else {
        endDialog.destroy();
        startDialog.destroy();
    }

} else {
    startDialog.destroy()
}
