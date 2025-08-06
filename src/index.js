/*
 * LightningChartJS example that showcases different XY Markers.
 */
// Import LightningChartJS
const lcjs = require('@lightningchart/lcjs')

// Import xydata
const xydata = require('@lightningchart/xydata')

// Extract required parts from LightningChartJS.
const {
    lightningChart,
    UIVisibilityModes,
    MarkerBuilders,
    UIBackgrounds,
    UIDirections,
    UIOrigins,
    UIElementBuilders,
    UIDraggingModes,
    Themes,
} = lcjs

// Import data-generator from 'xydata'-library.
const { createProgressiveTraceGenerator } = xydata

const chartTitle = 'Markers'

// Create a XY Chart.
const chart = lightningChart({
            resourcesBaseUrl: new URL(document.head.baseURI).origin + new URL(document.head.baseURI).pathname + 'resources/',
        })
    .ChartXY({
        legend: { visible: false },
        theme: Themes[new URLSearchParams(window.location.search).get('theme') || 'darkGold'] || undefined,
    })
    .setTitle(chartTitle)
    // Disable AutoCursor just for focusing on Markers.
    .setCursorMode(undefined)
    // Preventing ResultTable from getting cut at the edge
    .setPadding({
        right: 50,
    })

// Add a line series.
const series = chart.addLineSeries()

// Generate random points using 'xydata'-library.
createProgressiveTraceGenerator()
    .setNumberOfPoints(100)
    .generate()
    .toPromise()
    .then((data) => {
        const axisYAvg = (data[0].y + data[data.length - 1].y) / 2
        series.appendJSON(data)
        // ----- ChartMarker -----

        // Add a ChartMarker to the chart.
        const chartMarker = chart.addChartMarkerXY().setPosition({ x: 60, y: axisYAvg })

        // Style ChartMarker.
        chartMarker
            .setResultTableVisibility(UIVisibilityModes.always)
            .setResultTable((table) => table.setContent([['ChartMarker']]))
            .setGridStrokeXVisibility(UIVisibilityModes.whenDragged)
            .setGridStrokeYVisibility(UIVisibilityModes.whenDragged)
            .setTickMarkerXVisibility(UIVisibilityModes.whenDragged)
            .setTickMarkerYVisibility(UIVisibilityModes.whenDragged)
    })

// ----- SeriesMarker -----

// Create a builder for SeriesMarker to allow for full modification of its structure.
const SeriesMarkerBuilder = MarkerBuilders.SeriesMarkerXY.setResultTableBackground(UIBackgrounds.Pointer).addStyler((marker) =>
    marker
        .setResultTable((table) =>
            table
                .setOrigin(UIOrigins.CenterBottom)
                .setMargin({ bottom: 0 })
                .setBackground((arrow) => arrow.setDirection(UIDirections.Down).setPointerAngle(80).setPointerLength(20)),
        )
        .setGridStrokeXCut(true)
        .setAutoFit(false),
)

// Add a SeriesMarker to the series.
const seriesMarker = series.addMarker(SeriesMarkerBuilder).setPosition({ x: 50, y: 0 })

// Add download button to save chart frame
chart
    .addUIElement(UIElementBuilders.ButtonBox)
    .setPosition({ x: 99, y: 99 })
    .setOrigin(UIOrigins.RightTop)
    .setText('Download PNG Image')
    .setPadding({ top: 5, right: 20, bottom: 5, left: 20 })
    .setButtonSize(0)
    .setDraggingMode(UIDraggingModes.notDraggable)
    .addEventListener('click', (event) => {
        chart.saveToFile(chartTitle + ' - Screenshot')
    })
