/**
 * LightningChartJS example that showcases different XY Markers.
 */
// Import LightningChartJS
const lcjs = require('@arction/lcjs')

// Extract required parts from LightningChartJS.
const {
    lightningChart,
    AutoCursorModes,
    ColorRGBA,
    UIVisibilityModes,
    MarkerBuilders,
    UIBackgrounds,
    UIDirections,
    UIOrigins,
    DataPatterns,
    UIElementBuilders,
    UIDraggingModes
} = lcjs

// Import data-generator from 'xydata'-library.
const {
    createProgressiveTraceGenerator
} = require('@arction/xydata')

const chartTitle = 'Markers'

// Create a XY Chart.
const chart = lightningChart().ChartXY()
    .setTitle(chartTitle)
    // Disable AutoCursor just for focusing on Markers.
    .setAutoCursorMode(AutoCursorModes.disabled)
    // Preventing ResultTable from getting cut at the edge
    .setPadding({
        right: 50
    })

// Add a progressive line series.
const series = chart.addLineSeries({ dataPattern: DataPatterns.horizontalProgressive })

// Generate random progressive points using 'xydata'-library.
createProgressiveTraceGenerator()
    .setNumberOfPoints(100)
    .generate()
    .toPromise()
    .then(data => {
        const axisYAvg = (data[0].y + data[data.length - 1].y) / 2;
        series.add(data)
        // ----- ChartMarker -----

        // Add a ChartMarker to the chart.
        const chartMarker = chart.addChartMarkerXY()
            .setPosition({ x: 60, y: axisYAvg })

        // Style ChartMarker.
        chartMarker
            .setResultTableVisibility(UIVisibilityModes.always)
            .setResultTable((table) => table
                .setContent([
                    ['ChartMarker']
                ])
            )
            .setGridStrokeXVisibility(UIVisibilityModes.whenDragged)
            .setGridStrokeYVisibility(UIVisibilityModes.whenDragged)
            .setTickMarkerXVisibility(UIVisibilityModes.whenDragged)
            .setTickMarkerYVisibility(UIVisibilityModes.whenDragged)
    })

// ----- SeriesMarker -----

// Create a builder for SeriesMarker to allow for full modification of its structure.
const SeriesMarkerBuilder = MarkerBuilders.XY
    .setPointMarker(UIBackgrounds.Circle)
    .setResultTableBackground(UIBackgrounds.Pointer)
    .addStyler(marker => marker
        .setPointMarker(point => point
            .setSize({ x: 5, y: 5 })
        )
        .setResultTable(table => table
            .setOrigin(UIOrigins.CenterBottom)
            .setMargin({ bottom: 0 })
            .setBackground(arrow => arrow
                .setFillStyle(fill => fill.setColor(ColorRGBA(0, 0, 0, 200)))
                .setDirection(UIDirections.Down)
                .setPointerAngle(80)
                .setPointerLength(20)
            )
        )
        .setGridStrokeXCut(true)
        .setAutoFitStrategy(undefined)
    )

// Add a SeriesMarker to the series.
const seriesMarker = series.addMarker(SeriesMarkerBuilder)
    .setPosition({ x: 50, y: 0 })

// Currently the only way to affect the text of Markers ResultTables,
// is to completely override the series parser for it.
series.setResultTableFormatter((tableBuilder, series, x, y) => tableBuilder
    .addRow('SeriesMarker')
    .addRow('X', x.toFixed(1))
    .addRow('Y', y.toFixed(1))
)
// ... However, this will also apply to AutoCursor.

// Add download button to save chart frame
chart.addUIElement(UIElementBuilders.ButtonBox.setBackground(UIBackgrounds.Rectangle))
    .setPosition({ x: 99, y: 99 })
    .setOrigin(UIOrigins.RightTop)
    .setText('Download PNG Image')
    .setPadding({ top: 5, right: 20, bottom: 5, left: 20 })
    .setButtonOffSize(0)
    .setButtonOnSize(0)
    .setDraggingMode(UIDraggingModes.notDraggable)
    .onMouseClick((event) => {
        chart.saveToFile(chartTitle + ' - Screenshot')
    })
