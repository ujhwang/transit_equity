// Create the map with token !토큰이 달라지면 폴리곤 및 다른 정보가 사라짐
mapboxgl.accessToken = 'pk.eyJ1IjoidWh3YW5nMyIsImEiOiJja3d0bGh4cG8wemxtMm5xcTJ1anc4ajlxIn0.GPUcPfwoUXy6pItqRUvifw';

// Equity Map
const mapBefEqu = new mapboxgl.Map({
    container: 'mapBefEqu', // container ID // style URL //dark-v10 // style URL //dark-v10
    style: 'mapbox://styles/uhwang3/cl65mb11m001q15lcdpvr8efm',
    center: [-84.53132, 33.822556], // starting position [lng, lat]
    zoom: 9, // starting zoom
    minZoom: 3
});

const mapAftEqu = new mapboxgl.Map({
    container: 'mapAftEqu', // container ID // style URL //dark-v10 // style URL //dark-v10
    style: 'mapbox://styles/uhwang3/cl65mb11m001q15lcdpvr8efm',
    center: [-84.53132, 33.822556], // starting position [lng, lat]
    zoom: 9, // starting zoom
    minZoom: 3,
});

const svg = d3.selectAll('#legend-wrapper')
.append("svg")
.attr('id', 'legend')
.attr("width", "100%")
.attr("height", "100%")
.style("z-index", 1);

divHeight = document.getElementById('legend-wrapper').clientHeight;
margin = {left: 45, bottom: 80};
rect_width = 35;
legend_w = rect_width * 3;
legend_x = margin.left + legend_w/2; //the center for rotation
legend_y = divHeight - margin.bottom - legend_w/2; //the center for rotation

// create bivariate color scheme
legend = svg.selectAll("#legend")
.data(color_3class)
.enter()
.append("g")
.attr("id", "lab");


legend.append("rect")
.attr("x", function(d, i) {
    return rect_width*(i%3) + margin.left;
})
.attr("y", function(d, i) {
    return legend_y - rect_width*(i-(i%3))/3;
})
.attr("width", rect_width - 1.5)
.attr("height", rect_width - 1.5)
.style("fill", function(d){return d});

arrowPoints = [[0, 0], [0, 10], [10, 5]];
line_length = 125
line_start = [margin.left-15, divHeight-margin.bottom-15]; //the numbers are tested to be bottom of legend.
line_end = [margin.left-15, divHeight-margin.bottom-15-line_length];

legend.append('defs')
.append('marker')
.attr('id', 'arrow')
.attr('viewBox', [0, 0, 10, 10])
.attr('refX', 5)
.attr('refY', 5)
.attr('markerWidth', 10)
.attr('markerHeight', 10)
.attr('orient', 'auto')
.append('path')
.attr('d', d3.line()(arrowPoints))
.attr('stroke', 'white')
.attr('fill', 'white');

svg.append('text')
.attr('x', line_start[0])
.attr('y', line_start[1])
.attr('transform', 'translate(-15, -55) rotate(270,' + line_start[0] + ',' + line_start[1] + ')')
.attr('fill', 'white')
.attr('font-size', '14px')
.style("text-anchor", "middle")
.text('Accessibility');

const legend_x_text = svg.append('text')
.attr('x', line_start[0]+65)
.attr('y', line_start[1]+35)
.style("text-anchor", "middle")
.attr('fill', 'white')
.attr('font-size', '14px')
.text('Transit demand');

const legend_x_text_sub = svg.append('text')
.attr('x', line_start[0]+65)
.attr('y', line_start[1]+55)
.style("text-anchor", "middle")
.attr('fill', 'white')
.attr('font-size', '14px')
.text('(pop. without vehicles)');


svg.append('text')
.attr('x', line_start[0]+line_length+10)
.attr('y', line_start[1]+13)
.attr('fill', 'white')
.attr('font-size', '13px')
.attr('font-weight', '300')
.text('High');

svg.append('text')
.attr('x', line_start[0]-28)
.attr('y', line_start[1]+4)
.attr('fill', 'white')
.attr('font-size', '13px')
.attr('font-weight', '300')
.text('Low')
.attr('transform', 'translate(0, 10) rotate(-45,' + line_start[0] + ',' + line_start[1] + ')');

svg.append('text')
.attr('x', line_end[0]-10)
.attr('y', line_end[1]-3)
.attr('fill', 'white')
.attr('font-weight', '300')
.attr('font-size', '13px')
.text('High')

svg.append('path')
.attr('d', d3.line()([line_start, line_end]))
.attr('stroke', 'white')
.attr('marker-end', 'url(#arrow)')
.attr('fill', 'white')
.attr('transform', 'translate(0, 10) rotate(0,' + line_start[0] + ',' + line_start[1] + ')');

svg.append('path')
.attr('d', d3.line()([line_start, line_end]))
.attr('stroke', 'white')
.attr('marker-end', 'url(#arrow)')
.attr('fill', 'white')
.attr('transform', 'translate(0, 10) rotate(90,' + line_start[0] + ',' + line_start[1] + ')');

const legendRowColumn = [
    {'id':'demLow', 'x':line_start[0]+12+(rect_width+1.5)*(1/2+0), 'y':line_start[1]+10, 'color':color_3class[0]},
    {'id':'demMid', 'x':line_start[0]+12+(rect_width+1.5)*(1/2+1), 'y':line_start[1]+10, 'color':color_3class[1]},
    {'id':'demHigh', 'x':line_start[0]+12+(rect_width+1.5)*(1/2+2), 'y':line_start[1]+10, 'color':color_3class[2]},
    {'id':'accLow', 'x':line_start[0], 'y':line_start[1]-(rect_width+1.5)*(1/2+0), 'color':color_3class[0]},
    {'id':'accMid', 'x':line_start[0], 'y':line_start[1]-(rect_width+1.5)*(1/2+1), 'color':color_3class[3]},
    {'id':'accHigh', 'x':line_start[0], 'y':line_start[1]-(rect_width+1.5)*(1/2+2), 'color':color_3class[6]}
]

const legendRowColumnVal = {
'demLow':['A1','B1','C1'], 'demMid':['A2','B2','C2'], 'demHigh':['A3','B3','C3'],
'accLow':['A1','A2','A3'], 'accMid':['B1','B2','B3'], 'accHigh':['C1','C2','C3']
};

legendDotClicked = 0

dotsLegendRowColumn = svg.selectAll('#legend')
    .data(legendRowColumn)
    .enter()
    .append("circle")
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y)
    .attr("r", 7)
    .style("fill", (d) => d.color)
    .style('stroke', 'white')
    .style('stroke-width', '1.5')
    .on('click', function() {
        d3.select(this)
        .attr("r", 11)
        .style("stroke", 'black')
        .style('stroke-width', '4');
    })
    .on('mouseover', function() {
        if (legendDotClicked == 0) {
        d3.select(this)
            .attr("r", 11)
            .style("stroke", 'black')
            .style('stroke-width', '4')
        }
    })
    .on('mouseout', function() {
        if (legendDotClicked == 0) {
        d3.select(this)
            .attr("r", 7)
            .style('stroke', 'white')
            .style('stroke-width', '1.5');
        }
    })  

dotsLegendRowColumn
.on('click', function(d) {
    let selectedDotId = d.id
    let label_biv = legendRowColumnVal[selectedDotId]

    rect_cho
    .style("fill", (d) => {
        if (!label_biv.includes(Object.keys(color_3class_14)[color_3class.indexOf(d)])) {
        return color_3class_darker[color_3class.indexOf(d)]
        } else {
        return color_3class[color_3class.indexOf(d)]
        }
    });

    mapBefEqu.setPaintProperty(
    'bef_over',
    'fill-color', [
        'match',
        ['concat',
            ['get', supplyEqu_label],
            ['get', demandEqu_label],
        ],
            label_biv[0], color_3class_14[label_biv[0]],
            label_biv[1], color_3class_14[label_biv[1]],
            label_biv[2], color_3class_14[label_biv[2]],
            'black'
    ]
    );
    mapAftEqu.setPaintProperty(
    'aft_over',
    'fill-color', [
        'match', 
        ['concat',
            ['get', supplyEqu_label],
            ['get', demandEqu_label],
        ],
            label_biv[0], color_3class_14[label_biv[0]],
            label_biv[1], color_3class_14[label_biv[1]],
            label_biv[2], color_3class_14[label_biv[2]],
            'black'
    ]
    );
    legendDotClicked = 1;
}
);

// print the specified color due to the clicked label
for (let i = 1; i < 4; i++) {
legend['_groups']['0'][i-1]['__data__'] = 'A'+i;
}
for (let i = 1; i < 4; i++) {
legend['_groups']['0'][i+2]['__data__'] = 'B'+i;
}
for (let i = 1; i < 4; i++) {
legend['_groups']['0'][i+5]['__data__'] = 'C'+i;
}
rect_cho = legend.selectAll('rect')
rect_elements = rect_cho.nodes();

legendRectClicked = 0

rect_cho
.on('mouseover', function() {
    if (legendRectClicked == 0) {
    d3.select(this)
        .style('stroke', 'black')
        .style('stroke-width', '3px')
        .style('stroke-linecap', 'round')
        .style('opacity', 1);
    }
})
.on('mouseout', function() {
    if (legendRectClicked == 0) {
    d3.select(this)
        .style('stroke', 'none');
    }
});

legend.on('click', function(d) {
label_biv = d

rect_cho
    .style("fill", (d) => {
    if (Object.keys(color_3class_14)[color_3class.indexOf(d)] != label_biv) {
        return color_3class_darker[color_3class.indexOf(d)]
    } else {
        return color_3class[color_3class.indexOf(d)]
    }
});

mapBefEqu.setPaintProperty(
    'bef_over',
    'fill-color', [
    'match', 
        ['concat',
        ['get', supplyEqu_label],
        ['get', demandEqu_label],
        ],
        label_biv, color_3class_14[label_biv],
        'black'
    ]
)
mapAftEqu.setPaintProperty(
    'aft_over',
    'fill-color', [
    'match', 
        ['concat',
        ['get', supplyEqu_label],
        ['get', demandEqu_label],
        ],   
        label_biv, color_3class_14[label_biv],
        'black'
    ]
)
legendRectClicked = 1
});

// set the slider value for absolute measure
let sliderEqu_abs = document.getElementById("myRangeEqu_abs");
let sliderValueEqu_abs = document.getElementById("sliderValueEqu_abs");
sliderValueEqu_abs.innerHTML = sliderEqu_abs.value; // Display the default slider value
let sliderEqu_filter_abs = sliderEqu_abs.value;

// set the slider value for relative measure
let sliderEqu_rel = document.getElementById("myRangeEqu_rel");
let sliderValueEqu_rel = document.getElementById("sliderValueEqu_rel");
sliderValueEqu_rel.innerHTML = sliderEqu_rel.value; // Display the default slider value
let sliderEqu_filter_rel = sliderEqu_rel.value;

let clicked = 0
let demandUnit = 'num'
let xAxisNameLegend = 'pop. without vehicles'
let prefix = 'Number of '
let xAxisNameScatter = 'Population without Vehicles'

// default (Absolute measure) - only the slider_abs shown
document.getElementsByClassName("sliderEquContentRelative")[0].style.visibility = "hidden";

// show the absolute slider while hiding the relative one - by clicking the radio button
function getSliderEqu_abs(){
    document.getElementsByClassName("sliderEquContentAbsolute")[0].style.visibility = "visible";
    document.getElementsByClassName("sliderEquContentAbsolute")[0].style.zIndex = "1";
    document.getElementsByClassName("sliderEquContentRelative")[0].style.visibility = "hidden";
    document.getElementById("myRangeEqu_abs").value = 45;
    timeEqu_filter = 45;
    sliderValueEqu_abs.innerHTML = 45;
}
// show the relative slider while hiding the absolute one - by clicking the radio button
function getSliderEqu_rel(){
    document.getElementsByClassName("sliderEquContentAbsolute")[0].style.visibility = "hidden";
    document.getElementsByClassName("sliderEquContentRelative")[0].style.visibility = "visible";
    document.getElementsByClassName("sliderEquContentRelative")[0].style.zIndex = "1";
    document.getElementById("myRangeEqu_rel").value = 2;
    // reset the value and slidervalue
    timeEqu_filter = 2;
    sliderValueEqu_rel.innerHTML = 2;
}

// variabel for the highlghting function
let hoveredStateId = null;

let measEqu_filter = 'abs';
let demandEqu_filter = 'dep';
let timeEqu_filter = '45';
let unitEqu_filter = 'act';
let tripEqu_filter = 'com';
let supplyEqu_label = 'abs_com_45';
let demandEqu_label = 'dep_act';
let label_biv = ""
let color_cho = ""

let accessEqu_field = 'abs.com.mor.45min'
let demandEqu_field = 'dep'

let panel_width = 350;
let panel_margin = {top: 20, right: 20, bottom: 40, left: 50};
let plot_w = panel_width - panel_margin.left - panel_margin.right;
let plot_h = (window.innerHeight*0.8*0.32 - panel_margin.top - panel_margin.bottom);
let summary_h = 100;

// load the data and generate the maps
Promise.all([
    d3.dsv(",", "data/access_equity_06-20-2022.csv", function (d) {
      return d3.autoType(d)}),
    d3.dsv(",", "data/gap_gini_summary_06_20_2022.csv", function (d) {
      return d3.autoType(d)})
])
    .then(function(data) {
      ready(data[0], data[1])
      console.log(data[0], data[1])
      setTimeout(100)
    })

    function ready(access_equity_csv, gap_gini_csv) {

        // display gap & gini value
        function valueDisplay(accessEqu_field, demandEqu_field) {

            gapValueBefore.innerHTML = gap_gini_csv.filter((d)=>{return d['access.field'] == accessEqu_field + '.before' && d['demand.type']== demandEqu_field})
                .map((d)=>{return d.gap})[0].toFixed(2);

            gapValueAfter.innerHTML = gap_gini_csv.filter((d)=>{return d['access.field'] == accessEqu_field + '.after' && d['demand.type']== demandEqu_field})
                .map((d)=>{return d.gap})[0].toFixed(2);

            giniBeforeLow.innerHTML = gap_gini_csv.filter((d)=>{return d['access.field'] == accessEqu_field + '.before' && d['demand.type']== demandEqu_field})
                .map((d)=>{return d['gini.low']})[0];

            giniAfterLow.innerHTML = gap_gini_csv.filter((d)=>{return d['access.field'] == accessEqu_field + '.after' && d['demand.type']== demandEqu_field})
                .map((d)=>{return d['gini.low']})[0];

            giniBeforeMid.innerHTML = gap_gini_csv.filter((d)=>{return d['access.field'] == accessEqu_field + '.before' && d['demand.type']== demandEqu_field})
                .map((d)=>{return d['gini.mid']})[0];

            giniAfterMid.innerHTML = gap_gini_csv.filter((d)=>{return d['access.field'] == accessEqu_field + '.after' && d['demand.type']== demandEqu_field})
                .map((d)=>{return d['gini.mid']})[0];

            giniBeforeHigh.innerHTML = gap_gini_csv.filter((d)=>{return d['access.field'] == accessEqu_field + '.before' && d['demand.type']== demandEqu_field})
                .map((d)=>{return d['gini.high']})[0];

            giniAfterHigh.innerHTML = gap_gini_csv.filter((d)=>{return d['access.field'] == accessEqu_field + '.after' && d['demand.type']== demandEqu_field})
                .map((d)=>{return d['gini.high']})[0];

            gapValueBefore2.innerHTML = gapValueBefore.innerHTML
            gapValueAfter2.innerHTML = gapValueAfter.innerHTML
            giniBeforeLow2.innerHTML = giniBeforeLow.innerHTML
            giniAfterLow2.innerHTML = giniAfterLow.innerHTML
            giniBeforeMid2.innerHTML = giniBeforeMid.innerHTML
            giniAfterMid2.innerHTML = giniAfterMid.innerHTML
            giniBeforeHigh2.innerHTML = giniBeforeHigh.innerHTML
            giniAfterHigh2.innerHTML = giniAfterHigh.innerHTML
        }

        valueDisplay(accessEqu_field, demandEqu_field)

        function valueUpdate() {
          let accessEqu_field = measEqu_filter + '.com.mor.' + timeEqu_filter;
          if (measEqu_filter == 'abs') {
            accessEqu_field = accessEqu_field + 'min'
          };
          let demandEqu_field = demandEqu_filter
          if (unitEqu_filter == 'pct') {
            demandEqu_field = demandEqu_field + '.pct'
          }
          valueDisplay(accessEqu_field, demandEqu_field)
        };

        /////////// scatter plot ////////////
        const scatterColor = ['#ffffff','#707070']

        const scatterPlot = d3.selectAll('#scatterPlot').append("svg")
          .attr('id', 'scatterPlotSvg')
          .attr('width', plot_w + panel_margin.left + panel_margin.right)
          .attr('height', plot_h + panel_margin.top + panel_margin.bottom)
          .append("g")
          .attr('id', 'scatterPlotSvgG')
          .attr("transform", "translate(" + panel_margin.left + "," + panel_margin.top + ")");
        
        // Data for scatter plot
        function drawScatterPlot(accessEqu_field, demandEqu_field) {

            let val_acc_before = access_equity_csv.map (function(d) {return d[accessEqu_field + '.before']})
            let val_acc_after = access_equity_csv.map (function(d) {return d[accessEqu_field + '.after']})
            let val_demand = access_equity_csv.map (function(d) {return d[demandEqu_field]})
  
            let scatter_data = val_demand.map((e, i) => ({
              demand: e,
              access_before: val_acc_before[i],
              access_after: val_acc_after[i]
            }))

            x_demand = d3.scaleLinear()
            .domain([0,d3.max(scatter_data, function(d){return d.demand})])
            .range([0,plot_w]);

            y_access = d3.scaleLinear()
                .domain([0, 1])
                .range([plot_h, 0]);

            // ADD AXIS
            scatterPlot.append("g")
                .attr('id', 'scatterRedraw')
                .attr("transform", "translate(0," + plot_h + ")")
                .call(d3.axisBottom(x_demand).ticks(5))
                .style("color", "white")
                .attr('font-weight', '100');

            scatterPlot.append("g")
                .attr('id', 'scatterRedraw')
                .call(d3.axisLeft(y_access).tickValues([0, 0.25, 0.5, 0.75, 1]).tickFormat(d=> d*100+"%"))
                .style("color", "white")
                .attr('font-weight', '100');

            scatterPlot.append("g")
                .attr('id', 'scatterRedraw')
                .append('text')
                .attr("transform", "translate(" + plot_w/2 + " ," + (plot_h + 35) + ")")
                .text(prefix + xAxisNameScatter)
                .attr("text-anchor", "middle")
                .style("fill", "white")
                .attr('font-weight', '300')
                .attr('font-size', '13px');

            scatterPlot.append("g")
                .attr('id', 'scatterRedraw')
                .append('text')
                .attr("transform", "rotate(-90)")
                .attr("x", -plot_h/2)
                .attr("y", -36)
                .text("Transit Accessibility")
                .attr("text-anchor", "middle")
                .style("fill", "white")
                .attr('font-weight', '300')
                .attr('font-size', '13px');

            // ADD DOTS -- Before
            scatterPlot.append("g")
                .attr('id', 'scatterRedraw')
                .selectAll("rect")
                .data(scatter_data)
                .enter()
                .append("rect")
                .attr("x", function(d) {return x_demand(d.demand); })
                .attr("y", function(d) {return y_access(d.access_before); })
                .attr("height", 1.5)
                .attr("width", 1.5)
                .style("fill", scatterColor[1]);

            // ADD DOTS -- After
            scatterPlot.append("g")
                .attr('id', 'scatterRedraw')
                .selectAll("rect")
                .data(scatter_data)
                .enter()
                .append("rect")
                .attr("x", function(d) {return x_demand(d.demand); })
                .attr("y", function(d) {return y_access(d.access_after); })
                .attr("height", 1.5)
                .attr("width", 1.5)
                .style("fill", scatterColor[0]);

            // add legend
            scatterPlotLegend = scatterPlot.append("g")
                .attr("id", "plotLegend");

            scatterPlotLegend.append("circle")
                .attr('id', 'scatterRedraw')
                .attr("cx", plot_w*8/10)
                .attr("cy", plot_h/10)
                .attr('r', 4)
                .attr("fill", scatterColor[0])

            scatterPlotLegend.append("circle")
                .attr('id', 'scatterRedraw')
                .attr("cx", plot_w*8/10)
                .attr("cy", plot_h*2/10)
                .attr('r', 4)
                .attr("fill", scatterColor[1])

            scatterPlotLegend.append("text")
                .attr('id', 'scatterRedraw')
                .attr("x", plot_w*8/10 + 10)
                .attr("y", plot_h/10 + 4)
                .attr("fill", "white")
                .attr("font-size", "12px")
                .attr("font-weight", "200")
                .attr("text-anchor", "left")
                .text("ODMTS");

            scatterPlotLegend.append("text")
                .attr('id', 'scatterRedraw')
                .attr("x", plot_w*8/10 + 10)
                .attr("y", plot_h*2/10 + 4)
                .attr("fill", "white")
                .attr("font-size", "12px")
                .attr("font-weight", "200")
                .attr("text-anchor", "left")
                .text("Current");
        }

        drawScatterPlot(accessEqu_field, demandEqu_field)

        function redrawScatterPlot() {
            let accessEqu_field = measEqu_filter + '.com.mor.' + timeEqu_filter;
            if (measEqu_filter == 'abs') {
                accessEqu_field = accessEqu_field + 'min'
            };
            let demandEqu_field = demandEqu_filter
            if (unitEqu_filter == 'pct') {
                demandEqu_field = demandEqu_field + '.pct'
            }
            d3.selectAll('#scatterRedraw').remove()
            drawScatterPlot(accessEqu_field, demandEqu_field)
        };

        // functions for manipulating data for lorenz curve
        function MultiplyArrays(a, b) {
            c = [];
            for (i = 0; i < Math.max(a.length, b.length); i++) {
                c.push((a[i] || 0) * (b[i] || 0));
            }
            return c;
        };
    
        function LorenzData(val_acc) {
            let val_acc_unique = {};
            val_acc.forEach(element => {val_acc_unique[element] = (val_acc_unique[element] || 0) + 1;});
    
            let val = [];
            Object.keys(val_acc_unique).forEach(str => {val.push(Number(str))});
            let freq = Object.values(val_acc_unique);
            let freq_cum = freq.map((sum => value => sum += value)(0));
    
            let val_freq = MultiplyArrays(val, freq);
            let val_freq_cum = val_freq.map((sum => value => sum += value)(0));
    
            let freq_cum_pct = freq_cum.map(x => Math.round(x / freq_cum[freq_cum.length - 1] * 10000)/10000);
            let val_freq_cum_pct = val_freq_cum.map(x => Math.round(x / val_freq_cum[val_freq_cum.length - 1] * 10000)/10000);
    
            let lorenz_data = freq_cum_pct.map((e, i) => ({
                x: e,
                y: val_freq_cum_pct[i]
            }));
            return lorenz_data;
        };

        /////////// lorenz curve ////////////
        let lorenzColor = color_3class.slice(0, 3)

        let lorenzCurve = d3.selectAll('#lorenzCurve').append("svg")
        // .style("top", intro_h + toggle_h*3 + plot_h + panel_margin.top + 15 + 35 + 'px')
            .attr('id', 'lorenzCurveSvg')
            .attr('width', plot_w + panel_margin.left + panel_margin.right)
            .attr('height', plot_h + panel_margin.top + panel_margin.bottom)
            .append("g")
            .attr("transform", "translate(" + panel_margin.left + "," + panel_margin.top + ")");

        x_lorenz = d3.scaleLinear()
            .domain([0,1])
            .range([0,plot_w]);

        y_lorenz = d3.scaleLinear()
            .domain([0, 1])
            .range([plot_h, 0]);

        // data for lorenz curve
        function drawLorenz(accessEqu_field, demandEqu_field) {
            let val_acc_before_low = access_equity_csv.filter((d) => {return(d[demandEqu_field + '_pctl'] <= 0.33)})
            .map ((d) => {return d[accessEqu_field + '.before']}).sort();
            let val_acc_before_mid = access_equity_csv.filter((d) => {return(d[demandEqu_field + '_pctl'] > 0.33 && d[demandEqu_field + '_pctl'] <= 0.67)})
            .map ((d) => {return d[accessEqu_field + '.before']}).sort();
            let val_acc_before_high = access_equity_csv.filter((d) => {return(d[demandEqu_field + '_pctl'] > 0.67)})
            .map ((d) => {return d[accessEqu_field + '.before']}).sort();
            let val_acc_after_low = access_equity_csv.filter((d) => {return(d[demandEqu_field + '_pctl'] <= 0.33)})
            .map ((d) => {return d[accessEqu_field + '.after']}).sort();
            let val_acc_after_mid = access_equity_csv.filter((d) => {return(d[demandEqu_field + '_pctl'] > 0.33 && d[demandEqu_field + '_pctl'] <= 0.67)})
            .map ((d) => {return d[accessEqu_field + '.after']}).sort();
            let val_acc_after_high = access_equity_csv.filter((d) => {return(d[demandEqu_field + '_pctl'] > 0.67)})
            .map ((d) => {return d[accessEqu_field + '.after']}).sort();

            let lorenz_before_low = LorenzData(val_acc_before_low);
            let lorenz_before_mid = LorenzData(val_acc_before_mid);
            let lorenz_before_high = LorenzData(val_acc_before_high);
            let lorenz_after_low = LorenzData(val_acc_after_low);
            let lorenz_after_mid = LorenzData(val_acc_after_mid);
            let lorenz_after_high = LorenzData(val_acc_after_high);

            // ADD AXIS
            lorenzCurve.append("g")
                .attr('id', 'lorenzRedraw')
                .attr("transform", "translate(0," + plot_h + ")")
                .call(d3.axisBottom(x_lorenz).tickValues([0, 0.25, 0.5, 0.75, 1]).tickFormat(d=> d*100+"%"))
                .style("color", "white")
                .attr('font-weight', '100');

            lorenzCurve.append("g")
                .attr('id', 'lorenzRedraw')
                .call(d3.axisLeft(y_lorenz).tickValues([0, 0.25, 0.5, 0.75, 1]).tickFormat(d=> d*100+"%"))
                .style("color", "white")
                .attr('font-weight', '100');

            lorenzCurve.append("g")
                .attr('id', 'lorenzRedraw')
                .append('text')
                .attr("transform", "translate(" + plot_w/2 + " ," + (plot_h + 35) + ")")
                .text("Cumulative Rank of Accessibility")
                .attr("text-anchor", "middle")
                .style("fill", "white")
                .attr('font-weight', '300')
                .attr('font-size', '13px');

            lorenzCurve.append("g")
                .attr('id', 'lorenzRedraw')
                .append('text')
                .attr("transform", "rotate(-90)")
                .attr("x", -plot_h/2)
                .attr("y", -36)
                .text("Cumulative Accessibility")
                .attr("text-anchor", "middle")
                .style("fill", "white")
                .attr('font-weight', '300')
                .attr('font-size', '13px');

            // add line of equality
            lorenzCurve.append("path")
                .attr('id', 'lorenzRedraw')
                .datum([{'x':0, 'y':0}, {'x': 1, 'y':1}])
                .attr("fill", "none")
                .attr("stroke", "grey")
                .attr("stroke-width", 1)
                .style("stroke-dasharray", ("1.5, 1.5"))
                .attr('d', d3.line()
                    .x(function(d) {return x_lorenz(d.x)})
                    .y(function(d) {return y_lorenz(d.y)}));

            // ADD lorenz curves
            lorenzCurve.append("path")
                .attr('id', 'lorenzRedraw')
                .datum(lorenz_before_low)
                .attr("fill", "none")
                .attr("stroke", lorenzColor[0])
                .attr("stroke-width", 1)
                .style("stroke-dasharray", ("4, 4"))
                .attr('d', d3.line()
                    .x(function(d) {return x_lorenz(d.x)})
                    .y(function(d) {return y_lorenz(d.y)}));

            lorenzCurve.append("path")
                .attr('id', 'lorenzRedraw')
                .datum(lorenz_before_mid)
                .attr("fill", "none")
                .attr("stroke", lorenzColor[1])
                .attr("stroke-width", 1.5)
                .style("stroke-dasharray", ("4, 4"))
                .attr('d', d3.line()
                    .x(function(d) {return x_lorenz(d.x)})
                    .y(function(d) {return y_lorenz(d.y)}));

            lorenzCurve.append("path")
                .attr('id', 'lorenzRedraw')
                .datum(lorenz_before_high)
                .attr("fill", "none")
                .attr("stroke", lorenzColor[2])
                .attr("stroke-width", 2)
                .style("stroke-dasharray", ("4, 4"))
                .attr('d', d3.line()
                    .x(function(d) {return x_lorenz(d.x)})
                    .y(function(d) {return y_lorenz(d.y)}));

            lorenzCurve.append("path")
                .attr('id', 'lorenzRedraw')
                .datum(lorenz_after_low)
                .attr("fill", "none")
                .attr("stroke", lorenzColor[0])
                .attr("stroke-width", 1)
                .attr('d', d3.line()
                    .x(function(d) {return x_lorenz(d.x)})
                    .y(function(d) {return y_lorenz(d.y)}));

            lorenzCurve.append("path")
                .attr('id', 'lorenzRedraw')
                .datum(lorenz_after_mid)
                .attr("fill", "none")
                .attr("stroke", lorenzColor[1])
                .attr("stroke-width", 1.5)
                .attr('d', d3.line()
                    .x(function(d) {return x_lorenz(d.x)})
                    .y(function(d) {return y_lorenz(d.y)}));

            lorenzCurve.append("path")
                .attr('id', 'lorenzRedraw')
                .datum(lorenz_after_high)
                .attr("fill", "none")
                .attr("stroke", lorenzColor[2])
                .attr("stroke-width", 2)
                .attr('d', d3.line()
                    .x(function(d) {return x_lorenz(d.x)})
                    .y(function(d) {return y_lorenz(d.y)}));

            // add legend
            lorenzCurveLegend = lorenzCurve.append("g")
                .attr("id", "plotLegend");

            lorenzCurveLegend.append("path")
                .attr('id', 'lorenzRedraw')
                .datum([{'x':0.05, 'y':1}, {'x': 0.2, 'y':1}])
                .attr("fill", "none")
                .attr("stroke", lorenzColor[0])
                .attr("stroke-width", 1*1.5)
                .attr('d', d3.line()
                    .x(function(d) {return x_lorenz(d.x)})
                    .y(function(d) {return y_lorenz(d.y)}));

            lorenzCurveLegend.append("path")
                .attr('id', 'lorenzRedraw')
                .datum([{'x':0.05, 'y':0.90}, {'x': 0.2, 'y':0.90}])
                .attr("fill", "none")
                .attr("stroke", lorenzColor[1])
                .attr("stroke-width", 1.5*1.5)
                .attr('d', d3.line()
                    .x(function(d) {return x_lorenz(d.x)})
                    .y(function(d) {return y_lorenz(d.y)}));

            lorenzCurve.append("path")
                .attr('id', 'lorenzRedraw')
                .datum([{'x':0.05, 'y':0.8}, {'x': 0.2, 'y':0.8}])
                .attr("fill", "none")
                .attr("stroke", lorenzColor[2])
                .attr("stroke-width", 2*1.5)
                .attr('d', d3.line()
                    .x(function(d) {return x_lorenz(d.x)})
                    .y(function(d) {return y_lorenz(d.y)}));

            lorenzCurve.append("path")
                .attr('id', 'lorenzRedraw')
                .datum([{'x':0.05, 'y':0.7}, {'x': 0.12, 'y':0.7}])
                .attr("fill", "none")
                .attr("stroke", '#bfbfbf')
                .attr("stroke-width", 1.5)
                .attr('d', d3.line()
                    .x(function(d) {return x_lorenz(d.x)})
                    .y(function(d) {return y_lorenz(d.y)}));

            lorenzCurve.append("path")
                .attr('id', 'lorenzRedraw')
                .datum([{'x':0.12, 'y':0.7}, {'x': 0.2, 'y':0.7}])
                .attr("fill", "none")
                .attr("stroke", '#bfbfbf')
                .attr("stroke-width", 1.5)
                .style("stroke-dasharray", ("3, 2"))
                .attr('d', d3.line()
                    .x(function(d) {return x_lorenz(d.x)})
                    .y(function(d) {return y_lorenz(d.y)}));

            lorenzCurve.append("path")
                .attr('id', 'lorenzRedraw')
                .datum([{'x':0.115, 'y':0.66}, {'x': 0.125, 'y':0.74}])
                .attr("fill", "none")
                .attr("stroke", '#bfbfbf')
                .attr("stroke-width", 1.5)
                .attr('d', d3.line()
                    .x(function(d) {return x_lorenz(d.x)})
                    .y(function(d) {return y_lorenz(d.y)}));

            lorenzCurveLegend.append("text")
                .attr('id', 'lorenzRedraw')
                .attr("x", x_lorenz(0.2+0.03))
                .attr("y", y_lorenz(1-0.02))
                .attr("fill", "white")
                .attr("font-size", "12px")
                .attr("font-weight", "200")
                .attr("text-anchor", "left")
                .text("Low-demand NBHDs");

            lorenzCurveLegend.append("text")
                .attr('id', 'lorenzRedraw')
                .attr("x", x_lorenz(0.2+0.03))
                .attr("y", y_lorenz(0.90-0.02))
                .attr("fill", "white")
                .attr("font-size", "12px")
                .attr("font-weight", "200")
                .attr("text-anchor", "left")
                .text("Mid-demand NBHDs");

            lorenzCurveLegend.append("text")
                .attr('id', 'lorenzRedraw')
                .attr("x", x_lorenz(0.2+0.03))
                .attr("y", y_lorenz(0.8-0.02))
                .attr("fill", "white")
                .attr("font-size", "12px")
                .attr("font-weight", "200")
                .attr("text-anchor", "left")
                .text("High-demand NBHDs");

            lorenzCurveLegend.append("text")
                .attr('id', 'lorenzRedraw')
                .attr("x", x_lorenz(0.2+0.03))
                .attr("y", y_lorenz(0.7-0.02))
                .attr("fill", "white")
                .attr("font-size", "12px")
                .attr("font-weight", "200")
                .attr("text-anchor", "left")
                .text("ODMTS / Current");

            let angle = Math.atan(plot_h/plot_w)*180/Math.PI

            lorenzCurveLegend.append("text")
                .attr('id', 'lorenzRedraw')
                .attr('transform', 'translate('+ x_lorenz(0.25) + ',' + y_lorenz(0.25+0.03) + ')rotate(-' + angle + ')')
                .attr("fill", "white")
                .attr("font-size", "12px")
                .attr("font-weight", "200")
                .attr("text-anchor", "left")
                .attr("color", 'white')
                .text("Line of Equality");
        }

        drawLorenz(accessEqu_field, demandEqu_field)

        function redrawLorenz() {
            let accessEqu_field = measEqu_filter + '.com.mor.' + timeEqu_filter;
            if (measEqu_filter == 'abs') {
            accessEqu_field = accessEqu_field + 'min'
            };
            let demandEqu_field = demandEqu_filter
            if (unitEqu_filter == 'pct') {
            demandEqu_field = demandEqu_field + '.pct'
            }
            d3.selectAll('#lorenzRedraw').remove()
            drawLorenz(accessEqu_field, demandEqu_field)
        }

        // generate the map!!! Before
        mapBefEqu.on('load', () => {

            // Add a custom vector tileset source
            mapBefEqu.addSource('before_0629', {type: 'vector', url: "mapbox://lsj97.before_0629"});
    
            mapBefEqu.addLayer(
                {
                'id': 'bef_base',
                'type': 'fill',
                'source': 'before_0629',
                'source-layer': 'before_0629',
                'paint': {
                    'fill-color': [
                    'match', 
                        ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                        ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                    ],
                    'fill-opacity': 0.7,
                    'fill-outline-color': 'rgba(0,0,0,0.1)'
                }
                },
            );

            
            mapBefEqu.addLayer(
                {
                'id': 'bef_over',
                'type': 'fill',
                'source': 'before_0629',
                'source-layer': 'before_0629',
                'paint': {
                    'fill-color': [
                    'match', 
                        ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                        ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                    ],
                    'fill-opacity': 0.7,
                    'fill-outline-color': 'rgba(0,0,0,0.1)'
                }
                },
            );

            mapBefEqu.addLayer(
                {
                'id': 'bef_hover',
                'type': 'fill',
                'source': 'before_0629',
                'source-layer': 'before_0629',
                'paint': {
                    'fill-outline-color': '#000000',
                    'fill-color': '#000000',
                    'fill-opacity': [
                    'case',
                        ['boolean', 
                        ['feature-state', 'hover'], false
                        ],
                        0.5,
                        0
                    ]
                },
                },
            );

            // demand type
            document.getElementById('demandEqu').addEventListener('change', (event_demandEqu) => {
                const demandEqu_target = event_demandEqu.target.value;

                demandEqu_filter = demandEqu_target;

                supplyEqu_label = measEqu_filter + '_' + tripEqu_filter + '_' + timeEqu_filter;
                demandEqu_label = demandEqu_filter + '_' + unitEqu_filter;

                redrawScatterPlot();
                redrawLorenz();
                valueUpdate();

                mapBefEqu.setPaintProperty(
                'bef_base',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
                mapBefEqu.setPaintProperty(
                'bef_over',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
            });

            // measure type
            document.getElementById('filtersEqu_meas').addEventListener('change', (event_measEqu) => {
                const measEqu_target = event_measEqu.target.value;

                measEqu_filter = measEqu_target;

                supplyEqu_label = measEqu_filter + '_' + tripEqu_filter + '_' + timeEqu_filter;
                demandEqu_label = demandEqu_filter + '_' + unitEqu_filter;

                redrawScatterPlot();
                redrawLorenz();
                valueUpdate();

                mapBefEqu.setPaintProperty(
                'bef_base',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
                mapBefEqu.setPaintProperty(
                'bef_over',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
            });

            //  unit type
            document.getElementById('unitEqu').addEventListener('change', (event_unitEqu) => {
                const unitEqu_target = event_unitEqu.target.value;

                unitEqu_filter = unitEqu_target;

                supplyEqu_label = measEqu_filter + '_' + tripEqu_filter + '_' + timeEqu_filter;
                demandEqu_label = demandEqu_filter + '_' + unitEqu_filter;

                redrawScatterPlot();
                redrawLorenz();
                valueUpdate();

                mapBefEqu.setPaintProperty(
                'bef_base',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
                mapBefEqu.setPaintProperty(
                'bef_over',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
            });

            // trip type
            document.getElementById('tripEqu').addEventListener('change', (event_tripEqu) => {
                const tripEqu_target = event_tripEqu.target.value;

                tripEqu_filter = tripEqu_target;

                supplyEqu_label = measEqu_filter + '_' + tripEqu_filter + '_' + timeEqu_filter;
                demandEqu_label = demandEqu_filter + '_' + unitEqu_filter;

                mapBefEqu.setPaintProperty(
                'bef_base',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                    ],
                );
                mapBefEqu.setPaintProperty(
                'bef_over',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
            });

            // slider
            sliderEqu_abs.addEventListener('input', (absEqu) => {
                sliderValueEqu_abs.innerHTML = absEqu.target.value;
                sliderEqu_filter_abs = absEqu.target.value;
                timeEqu_filter = sliderEqu_filter_abs;

                supplyEqu_label = measEqu_filter + '_' + tripEqu_filter + '_' + timeEqu_filter;
                demandEqu_label = demandEqu_filter + '_' + unitEqu_filter;

                redrawScatterPlot();
                redrawLorenz();
                valueUpdate();

                mapBefEqu.setPaintProperty(
                'bef_base',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
                mapBefEqu.setPaintProperty(
                'bef_over',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
            });

            sliderEqu_rel.addEventListener('input', (relEqu) => {
                sliderValueEqu_rel.innerHTML = relEqu.target.value;
                sliderEqu_filter_rel = relEqu.target.value;
                timeEqu_filter = sliderEqu_filter_rel;

                supplyEqu_label = measEqu_filter + '_' + tripEqu_filter + '_' + timeEqu_filter;
                demandEqu_label = demandEqu_filter + '_' + unitEqu_filter;

                redrawScatterPlot();
                redrawLorenz();
                valueUpdate();

                mapBefEqu.setPaintProperty(
                'bef_base',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
                mapBefEqu.setPaintProperty(
                'bef_over',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
            });

            d3.select('body').on('click', function(){
                if ((clicked % 2) === 1) {
                mapBefEqu.setPaintProperty(
                    'bef_over',
                    'fill-color', [
                    'match', 
                        ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                        ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                    ],
                );
                mapAftEqu.setPaintProperty(
                    'aft_over',
                    'fill-color', [
                    'match', 
                        ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                        ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                    ],
                );

                rect_cho
                    .style('stroke', 'none');
                rect_cho
                    .style("fill", (d) => d);

                dotsLegendRowColumn
                    .attr('r', 7)
                    .style('stroke', 'white')
                    .style('stroke-width', '1.5');

                legendRectClicked = 0;
                legendDotClicked = 0;
                };
                clicked = clicked + 1;
            });

            // highlighting group
            mapBefEqu.on('mousemove', 'bef_hover', (e) => {

                let geo_id =  e.features[0].properties['geo.id']

                if (e.features.length > 0) {
                if (hoveredStateId !== null) {
                    mapBefEqu.setFeatureState(
                    {
                    source: 'before_0629',
                    sourceLayer: 'before_0629',
                    id: hoveredStateId
                    },
                    {
                    hover: false
                    }
                    );
                }
                hoveredStateId = e.features[0].id;
                mapBefEqu.setFeatureState(
                    {
                    source: 'before_0629',
                    sourceLayer: 'before_0629',
                    id: hoveredStateId
                    },
                    {
                    hover: true
                    }
                );
                };
            });

            mapBefEqu.on('mouseleave', 'bef_hover', () => {
                if (hoveredStateId !== null) {
                mapBefEqu.setFeatureState(
                    {
                    source: 'before_0629',
                    sourceLayer: 'before_0629',
                    id: hoveredStateId
                    },
                    {
                    hover: false
                    }
                );
                }
                hoveredStateId = null;
            });

            mapBefEqu.on('click', 'bef_base', (es) => {
                color_cho = es.features['0']['properties'][supplyEqu_label] + es.features['0']['properties'][demandEqu_label]

                if ((clicked % 2) === 0) {
                mapBefEqu.setPaintProperty(
                    'bef_over',
                    'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        color_cho, color_3class_14[color_cho],
                        'black'
                    ]
                )
                mapAftEqu.setPaintProperty(
                    'aft_over',
                    'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        color_cho, color_3class_14[color_cho],
                        'black'
                    ]
                )
                }

                rect_cho
                .style("fill", (d) => {
                    if (Object.keys(color_3class_14)[color_3class.indexOf(d)] != color_cho) {
                    return color_3class_darker[color_3class.indexOf(d)]
                    } else {
                    return color_3class[color_3class.indexOf(d)]
                    }
                })

            });
        }) //map.on.load ends here

        // map aft starts here
        mapAftEqu.on('load', () => {
            // Add a custom vector tileset source
            mapAftEqu.addSource('after_0629', {type: 'vector', url: "mapbox://lsj97.after_0629"});
    
            mapAftEqu.addLayer(
                {
                'id': 'aft_base',
                'type': 'fill',
                'source': 'after_0629',
                'source-layer': 'after_0629',
                'paint': {
                    'fill-color': [
                    'match', 
                        ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                        ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                    ],
                    'fill-opacity': 0.7,
                    'fill-outline-color': 'rgba(0,0,0,0.1)'
                }
                },
            );
            mapAftEqu.addLayer(
                {
                'id': 'aft_over',
                'type': 'fill',
                'source': 'after_0629',
                'source-layer': 'after_0629',
                'paint': {
                    'fill-color': [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                    ],
                    'fill-opacity': 0.7,
                    'fill-outline-color': 'rgba(0,0,0,0.1)'
                }
                },
            );
            mapAftEqu.addLayer(
                {
                'id': 'aft_hover',
                'type': 'fill',
                'source': 'after_0629',
                'source-layer': 'after_0629',
                'paint': {
                    'fill-outline-color': '#000000',
                    'fill-color': '#000000',
                    'fill-opacity': [
                    'case',
                        ['boolean',
                        ['feature-state', 'hover'], false
                        ],
                        0.5,
                        0
                    ]
                },
                },
            );
    
            document.getElementById('demandEqu').addEventListener('change', (event_demandEqu) => {
                const demandEqu_target = event_demandEqu.target.value;
    
                demandEqu_filter = demandEqu_target;
                supplyEqu_label = measEqu_filter + '_' + tripEqu_filter + '_' + timeEqu_filter;
                demandEqu_label = demandEqu_filter + '_' + unitEqu_filter;
    
                redrawScatterPlot();
                redrawLorenz();
                valueUpdate();
    
                mapAftEqu.setPaintProperty(
                'aft_base',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                )
                mapAftEqu.setPaintProperty(
                'aft_over',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
            });
    
            // measure type
            document.getElementById('filtersEqu_meas').addEventListener('change', (event_measEqu) => {
                const measEqu_target = event_measEqu.target.value;
    
                measEqu_filter = measEqu_target;
                supplyEqu_label = measEqu_filter + '_' + tripEqu_filter + '_' + timeEqu_filter;
                demandEqu_label = demandEqu_filter + '_' + unitEqu_filter;
    
                redrawScatterPlot();
                redrawLorenz();
                valueUpdate();
    
                mapAftEqu.setPaintProperty(
                'aft_base',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
                mapAftEqu.setPaintProperty(
                'aft_over',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
            });
    
            // unit type
            document.getElementById('unitEqu').addEventListener('change', (event_unitEqu) => {
                const unitEqu_target = event_unitEqu.target.value;
    
                unitEqu_filter = unitEqu_target;
                supplyEqu_label = measEqu_filter + '_' + tripEqu_filter + '_' + timeEqu_filter;
                demandEqu_label = demandEqu_filter + '_' + unitEqu_filter;
    
                redrawScatterPlot();
                redrawLorenz();
                valueUpdate();
    
                mapAftEqu.setPaintProperty(
                'aft_base',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
                mapAftEqu.setPaintProperty(
                'aft_over',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
            });
    
                //   trip type
            document.getElementById('tripEqu').addEventListener('change', (event_tripEqu) => {
                const tripEqu_target = event_tripEqu.target.value;
    
                tripEqu_filter = tripEqu_target;
                supplyEqu_label = measEqu_filter + '_' + tripEqu_filter + '_' + timeEqu_filter;
                demandEqu_label = demandEqu_filter + '_' + unitEqu_filter;
    
                mapAftEqu.setPaintProperty(
                'aft_base',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
                mapAftEqu.setPaintProperty(
                'aft_over',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                    ],
                );
            });
    
            // slider
            sliderEqu_abs.addEventListener('input', (absEqu) => {
                sliderValueEqu_abs.innerHTML = absEqu.target.value;
                sliderEqu_filter_abs = absEqu.target.value;
                timeEqu_filter = sliderEqu_filter_abs;
    
                supplyEqu_label = measEqu_filter + '_' + tripEqu_filter + '_' + timeEqu_filter;
                demandEqu_label = demandEqu_filter + '_' + unitEqu_filter;
    
                redrawScatterPlot();
                redrawLorenz();
                valueUpdate();
    
                mapAftEqu.setPaintProperty(
                'aft_base',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
                mapAftEqu.setPaintProperty(
                'aft_over',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
            });
    
            sliderEqu_rel.addEventListener('input', (relEqu) => {
                sliderValueEqu_rel.innerHTML = relEqu.target.value;
                sliderEqu_filter_rel = relEqu.target.value;
                timeEqu_filter = sliderEqu_filter_rel;
    
                supplyEqu_label = measEqu_filter + '_' + tripEqu_filter + '_' + timeEqu_filter;
                demandEqu_label = demandEqu_filter + '_' + unitEqu_filter;
    
                redrawScatterPlot();
                redrawLorenz();
                valueUpdate();
    
                mapAftEqu.setPaintProperty(
                'aft_base',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
                mapAftEqu.setPaintProperty(
                'aft_over',
                'fill-color', [
                    'match', 
                    ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                    ],   
                        'A1', color_3class_14['A1'],
                        'A2', color_3class_14['A2'],
                        'A3', color_3class_14['A3'],
                        'B1', color_3class_14['B1'],
                        'B2', color_3class_14['B2'],
                        'B3', color_3class_14['B3'],
                        'C1', color_3class_14['C1'],
                        'C2', color_3class_14['C2'],
                        'C3', color_3class_14['C3'],
                        'black'
                ],
                );
            });
    
            //highlighting
            mapAftEqu.on('mousemove', 'aft_hover', (e) => {
                let geo_id =  e.features[0].properties['geo.id']
    
                if (e.features.length > 0) {
                if (hoveredStateId !== null) {
                    mapAftEqu.setFeatureState(
                    {
                        source: 'after_0629',
                        sourceLayer: 'after_0629',
                        id: hoveredStateId
                    },
                    {
                        hover: false
                    }
                    );
                }
                hoveredStateId = e.features[0].id;
                mapAftEqu.setFeatureState(
                    {
                    source: 'after_0629',
                    sourceLayer: 'after_0629',
                    id: hoveredStateId
                    },
                    {
                    hover: true
                    }
                );
                };
            });
    
            mapAftEqu.on('mouseleave', 'aft_hover', () => {
                if (hoveredStateId !== null) {
                mapAftEqu.setFeatureState(
                    {
                    source: 'after_0629',
                    sourceLayer: 'after_0629',
                    id: hoveredStateId
                    },
                    {
                    hover: false
                    }
                );
                };
                hoveredStateId = null;
            });
    
            mapAftEqu.on('click', 'aft_base', (er) => {
    
                color_cho = er.features['0']['properties'][supplyEqu_label] + er.features['0']['properties'][demandEqu_label]
    
                if ((clicked % 2) === 0) {
                mapBefEqu.setPaintProperty(
                    'bef_over',
                    'fill-color', [
                    'match', 
                        ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                        ],   
                        color_cho, color_3class_14[color_cho],
                        'black'
                    ]
                )
                mapAftEqu.setPaintProperty(
                    'aft_over',
                    'fill-color', [
                    'match', 
                        ['concat',
                        ['get', supplyEqu_label],
                        ['get', demandEqu_label],
                        ],   
                        color_cho, color_3class_14[color_cho],
                        'black'
                    ]
                )
                };
                rect_cho
                .style("fill", (d) => {
                    if (Object.keys(color_3class_14)[color_3class.indexOf(d)] != color_cho) {
                    return color_3class_darker[color_3class.indexOf(d)]
                    } else {
                    return color_3class[color_3class.indexOf(d)]
                    }
                })
            })
        });

        // add additional maps (atlanta boundary & main road)
        mapBefEqu.on('load', () => {
            mapBefEqu.addSource('atl_boundary',  {type: 'vector', url: "mapbox://uhwang3.atl_boundary" });

            mapBefEqu.addSource('main_road_3counties',  {type: 'vector', url: "mapbox://uhwang3.cl0q27y7p3mcw20qgismthmry-4a3tz" });

            mapBefEqu.addLayer(
            {
                'id': 'main_road_3counties',
                'type': 'line',
                'source': 'main_road_3counties',
                'source-layer': 'main_road_3counties',
                'paint': {
                'line-color': 'rgba(40,40,40,0.7)',
                'line-width': 1.2
                }
            },
            );

            mapBefEqu.addLayer(
            {
                'id': 'atl_boundary',
                'type': 'line',
                'source': 'atl_boundary',
                'source-layer': 'atl_boundary',
                'paint': {
                'line-color': 'rgba(255,255,255,1)',
                'line-width': 1.4
                }
            },
            );
        });

        mapAftEqu.on('load', () => {
            mapAftEqu.addSource('atl_boundary',  {type: 'vector', url: "mapbox://uhwang3.atl_boundary" });

            mapAftEqu.addSource('main_road_3counties',  {type: 'vector', url: "mapbox://uhwang3.cl0q27y7p3mcw20qgismthmry-4a3tz" });

            mapAftEqu.addLayer(
            {
                'id': 'main_road_3counties',
                'type': 'line',
                'source': 'main_road_3counties',
                'source-layer': 'main_road_3counties',
                'paint': {
                'line-color': 'rgba(40,40,40,0.7)',
                'line-width': 1.2
                }
            },
            );

            mapAftEqu.addLayer(
            {
                'id': 'atl_boundary',
                'type': 'line',
                'source': 'atl_boundary',
                'source-layer': 'atl_boundary',
                'paint': {
                'line-color': 'rgba(255,255,255,1)',
                'line-width': 1.4
                }
            },
            );
        });
    
        mapAftEqu.addControl(
            new MapboxGeocoder({
            accessToken: mapboxgl.accessToken,
            mapboxgl: mapboxgl,
            }),
            'bottom-right'
        );

    };

    mapBefEqu.scrollZoom.disable();
    mapBefEqu.scrollZoom.setWheelZoomRate(0.02); // Default 1/450
    
    mapBefEqu.on("wheel", event => {
      if (event.originalEvent.ctrlKey) { // Check if CTRL key is pressed
        event.originalEvent.preventDefault(); // Prevent chrome/firefox default behavior
        if (!mapBefEqu.scrollZoom._enabled) mapBefEqu.scrollZoom.enable(); // Enable zoom only if it's disabled
      } else {
        if (mapBefEqu.scrollZoom._enabled) mapBefEqu.scrollZoom.disable(); // Disable zoom only if it's enabled
      }
    });
    
    mapAftEqu.scrollZoom.disable();
    mapAftEqu.scrollZoom.setWheelZoomRate(0.02); // Default 1/450
    
    mapAftEqu.on("wheel", event => {
      if (event.originalEvent.ctrlKey) { // Check if CTRL key is pressed
        event.originalEvent.preventDefault(); // Prevent chrome/firefox default behavior
        if (!mapAftEqu.scrollZoom._enabled) mapAftEqu.scrollZoom.enable(); // Enable zoom only if it's disabled
      } else {
        if (mapAftEqu.scrollZoom._enabled) mapAftEqu.scrollZoom.disable(); // Disable zoom only if it's enabled
      }
    });

    mapAftEqu.addControl(new mapboxgl.NavigationControl(), 'top-right');

// moving the map simultaneously 
function coordinateEqu() {

    disable = false;

    mapBefEqu.on('move', function() {
    if (!disable) {
        center = mapBefEqu.getCenter();
        zoom = mapBefEqu.getZoom();
        pitch = mapBefEqu.getPitch();
        bearing = mapBefEqu.getBearing();

        disable = true;
        mapAftEqu.setCenter(center);
        mapAftEqu.setZoom(zoom);
        mapAftEqu.setPitch(pitch);
        mapAftEqu.setBearing(bearing);
        disable = false;
    };
    });

    mapAftEqu.on('move', function() {
    if (!disable) {
        center = mapAftEqu.getCenter();
        zoom = mapAftEqu.getZoom();
        pitch = mapAftEqu.getPitch();
        bearing = mapAftEqu.getBearing();

        disable = true;
        mapBefEqu.setCenter(center);
        mapBefEqu.setZoom(zoom);
        mapBefEqu.setPitch(pitch);
        mapBefEqu.setBearing(bearing);
        disable = false;
    };
    });
};

coordinateEqu();

function xAxisLegendChange(xAxisNameLegend, demandUnit) {
    if (demandUnit=='pct') {unit = '% of '} else {unit = ''}
    legend_x_text_sub
        .text('(' + unit + xAxisNameLegend + ')');
};

function xAxisScatterChange(xAxisNameScatter, demandUnit) {
    if (demandUnit=='pct') {prefix = 'Proportion of '} else {prefix = 'Number of '};
};

function changeFunc() {
    var selectBox = document.getElementById("demandEqu");
    var selectedValue = selectBox.options[selectBox.selectedIndex].value;

    if (selectedValue=="min") {xAxisNameLegend = 'Minority pop.', xAxisNameScatter = 'Minority Population'};
    if (selectedValue=="pov") {xAxisNameLegend = 'Low-income pop.', xAxisNameScatter = 'Low-income Population'};
    if (selectedValue=="emp") {xAxisNameLegend = 'Unemployed pop.', xAxisNameScatter = 'Unemployed Population'};
    if (selectedValue=="eld") {xAxisNameLegend = 'Elderly pop.', xAxisNameScatter = 'Elderly (70-) Population'};
    if (selectedValue=="dis") {xAxisNameLegend = 'Disabled pop.', xAxisNameScatter = 'Disabled Population'};
    if (selectedValue=="chi") {xAxisNameLegend = 'Children', xAxisNameScatter = 'Children below 14'};
    if (selectedValue=="dep") {xAxisNameLegend = 'pop. without vehicles', xAxisNameScatter = 'Population without Vehicles'};

    xAxisLegendChange(xAxisNameLegend, demandUnit)
    xAxisScatterChange(xAxisNameScatter, demandUnit)
   };

function unit_num() {
    demandUnit = 'num'
    xAxisLegendChange(xAxisNameLegend, demandUnit)
    xAxisScatterChange(xAxisNameScatter, demandUnit)
};

function unit_pct() {
    demandUnit = 'pct'
    xAxisLegendChange(xAxisNameLegend, demandUnit)
    xAxisScatterChange(xAxisNameScatter, demandUnit)
};
