let vis_panel_margin = {top: 20, right: 20, bottom: 40, left: 50};
let vis_plot_w = 620 - vis_panel_margin.left - vis_panel_margin.right;
let vis_plot_h = (570 - vis_panel_margin.top - vis_panel_margin.bottom);
let dot_size = 7

const vis_color_3class = ["#fffacf", "#e69191", "#b55353", "#a780d9", "#fffbcf", "#e69291", "#663d9c", "#a781d9", "#fffccf"]
const vis_color_5highlow = ["#1984c5", "#a7d5ed", "#e2e2e2", "#e1a692", "#c23728"]

function color_filter_inequity(x, y){
    if (y-x < -0.35){
      return vis_color_3class[2]
    } else if (y-x < -0.22){
      return vis_color_3class[1]
    } else if (y-x < 0.22){
      return vis_color_3class[0]
    } else if (y-x <= 0.35){
      return vis_color_3class[3]
    } else if (y-x > 0.35){
      return vis_color_3class[6]
    }
  }

  function color_filter_inequality(x, y){
    if (y < 0.33){
      return vis_color_5highlow[0]
    } else if (y < 0.44){
      return vis_color_5highlow[1]
    } else if (y < 0.55){
      return vis_color_5highlow[2]
    } else if (y < 0.66){
      return vis_color_5highlow[3]
    } else if (y >= 0.66 ){
      return vis_color_5highlow[4]
    }
  }


//First draw function
function draw0(){
    d3.select("#plotSvgInequity").remove();
    d3.select("#plotSvgInequality").remove();
}

//Second draw function
//Draw the figure describing ODMTS

function draw3() {

    d3.select("#plotSvgInequality").remove();
    d3.select("#textSvgInequality").remove();

    Promise.all([
        d3.dsv(",", "data/demo_data.csv", function (d) {
        return d3.autoType(d)})
    ])
        .then(function(data) {
            plot(data[0])
        })

    function plot(data){

        const x_demand = d3.scaleLinear()
            .domain([0,1])
            .range([0,vis_plot_w]);

        const y_access = d3.scaleLinear()
            .domain([0, 1])
            .range([vis_plot_h, 0]);

        const plot = d3.selectAll('#vis').append("svg")
            .attr('id', 'plotSvgInequity')
            .attr('width', vis_plot_w + vis_panel_margin.left + vis_panel_margin.right)
            .attr('height', vis_plot_h + vis_panel_margin.top + vis_panel_margin.bottom)
            .append("g")
            .attr('id', 'plotSvgG')
            .attr("transform", "translate(" + vis_panel_margin.left + "," + vis_panel_margin.top + ")");

        // ADD AXIS
        plot.append("g")
        .attr("transform", "translate(0," + vis_plot_h + ")")
        .call(d3.axisBottom(x_demand).tickValues([0, 0.25, 0.5, 0.75, 1]).tickFormat(d=> d*100+"%"))
        .style("color", "white")
        .attr('font-weight', '100');

        plot.append("g")
        .call(d3.axisLeft(y_access).tickValues([0, 0.25, 0.5, 0.75, 1]).tickFormat(d=> d*100+"%"))
        .style("color", "white")
        .attr('font-weight', '100');

        plot.append('text')
        .attr("transform", "translate(" + vis_plot_w/2 + " ," + (vis_plot_h + 35) + ")")
        .text('Transit Demand')
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .attr('font-weight', '300')
        .attr('font-size', '13px');

        plot.append("g")
        .append('text')
        .attr("transform", "rotate(-90)")
        .attr("x", -vis_plot_h/2)
        .attr("y", -36)
        .text("Transit Accessibility")
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .attr('font-weight', '300')
        .attr('font-size', '13px');

        // ADD DOTS -- Before
        plot.append("g")
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function(d) {return x_demand(d.demand); })
            .attr("cy", function(d) {return y_access(d.inequity_case1); })
            .attr("r", dot_size)
            .style("fill", function(d){
                return color_filter_inequity(d.demand, d.inequity_case1)
            });

        plot.append("text")
            .style("fill", "white")
            .attr("x", 165)
            .attr("y", 20)
            .text("Inequity Index:");

        plot.append("text")
            .style("fill", "white")
            .attr("x", 342)
            .attr("y", 20)
            .text("%");


        function firstAnimate() {

            d3.select("#textSvgInequity_last").remove();
            d3.select("#textSvgInequity_first").remove();

            plot.selectAll("circle")
                .transition()
                .delay(900)
                .duration(900)
                .attr("cy", function(d) {return y_access(d.inequity_case2); })
                .style("fill", function(d){
                    return color_filter_inequity(d.demand, d.inequity_case2)
                })
                .on('end', secondAnimate)

            plot.append("text")
                .attr('id', 'textSvgInequity_first')
                .attr("text-anchor", "middle")
                .style("fill", "white")
                .style("font-size", "26px")
                .attr("x", 320)
                .attr("y", 20)
                .text(20);

            text.transition()
                .tween("text", function() {
                var selection = d3.select("#textSvgInequity_first");    // selection of node being transitioned
                var start = d3.select("#textSvgInequity_first").text(); // start value prior to transition
                var end = 80;                     // specified end value
                var interpolator = d3.interpolateNumber(start,end); // d3 interpolator

                return function(t) { selection.text(Math.round(interpolator(t))); };  // return value
        
                })
                    .delay(900)
                    .duration(900);
        }

        function secondAnimate() {

            d3.select("#textSvgInequity_first").remove();
            d3.select("#textSvgInequity_last").remove();

            plot.selectAll("circle")
                .transition()
                .delay(900)
                .duration(900)
                .attr("cy", function(d) {return y_access(d.inequity_case1); })
                .style("fill", function(d){
                    return color_filter_inequity(d.demand, d.inequity_case1)
                })
                .on('end', firstAnimate)

            plot.append("text")
                .attr('id', 'textSvgInequity_last')
                .attr("text-anchor", "middle")
                .style("fill", "white")
                .style("font-size", "26px")
                .attr("x", 320)
                .attr("y", 20)
                .text(80);

            text.transition()
                .tween("text", function() {
                var selection = d3.select("#textSvgInequity_last");    // selection of node being transitioned
                var start = d3.select("#textSvgInequity_last").text(); // start value prior to transition
                var end = 20;                     // specified end value
                var interpolator = d3.interpolateNumber(start,end); // d3 interpolator

                return function(t) { selection.text(Math.round(interpolator(t))); };  // return value
        
                })
                .delay(900)
                .duration(900);
            
        }

        firstAnimate();

    }

    let svg = d3.selectAll('#vis').append("svg")

    let text = svg.append("text")
        .attr('id', 'textSvgInequity')
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .attr("x", 2500)
        .attr("y", 50)
        .text(0);
};

function draw4() {

    d3.select("#plotSvgInequity").remove();
    d3.select("#textSvgInequity").remove();

    Promise.all([
        d3.dsv(",", "data/demo_data.csv", function (d) {
        return d3.autoType(d)})
    ])
        .then(function(data) {
        plot(data[0])
        })

    function plot(data){

        const x_demand = d3.scaleLinear()
        .domain([0,1])
        .range([0,vis_plot_w]);

        const y_access = d3.scaleLinear()
        .domain([0, 1])
        .range([vis_plot_h, 0]);

        const plot = d3.selectAll('#vis').append("svg")
        .attr('id', 'plotSvgInequality')
        .attr('width', vis_plot_w + vis_panel_margin.left + vis_panel_margin.right)
        .attr('height', vis_plot_h + vis_panel_margin.top + vis_panel_margin.bottom)
        .append("g")
        .attr('id', 'plotSvgG')
        .attr("transform", "translate(" + vis_panel_margin.left + "," + vis_panel_margin.top + ")");

        // ADD AXIS
        plot.append("g")
        .attr("transform", "translate(0," + vis_plot_h + ")")
        .call(d3.axisBottom(x_demand).tickValues([0, 0.25, 0.5, 0.75, 1]).tickFormat(d=> d*100+"%"))
        .style("color", "white")
        .attr('font-weight', '100');

        plot.append("g")
        .call(d3.axisLeft(y_access).tickValues([0, 0.25, 0.5, 0.75, 1]).tickFormat(d=> d*100+"%"))
        .style("color", "white")
        .attr('font-weight', '100');

        plot.append('text')
        .attr("transform", "translate(" + vis_plot_w/2 + " ," + (vis_plot_h + 35) + ")")
        .text('Transit Demand')
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .attr('font-weight', '300')
        .attr('font-size', '13px');

        plot.append("g")
        .append('text')
        .attr("transform", "rotate(-90)")
        .attr("x", -vis_plot_h/2)
        .attr("y", -36)
        .text("Transit Accessibility")
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .attr('font-weight', '300')
        .attr('font-size', '13px');

        // ADD DOTS -- Before
        plot.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {return x_demand(d.demand); })
        .attr("cy", function(d) {return y_access(d.inequality_case1); })
        .attr("r", dot_size)
        .style("fill", function(d){
            return color_filter_inequality(d.demand, d.inequality_case1)
        });

        plot.append("text")
            .style("fill", "white")
            .attr("x", 165)
            .attr("y", 20)
            .text("Inequality Index:");

        plot.append("text")
            .style("fill", "white")
            .attr("x", 358)
            .attr("y", 20)
            .text("%");

        function firstAnimate() {

            d3.select("#textSvgInequality_first").remove();
            d3.select("#textSvgInequality_last").remove();

            plot.selectAll("circle")
                .transition()
                .delay(900)
                .duration(900)
                .attr("cy", function(d) {return y_access(d.inequality_case2); })
                .style("fill", function(d){
                    return color_filter_inequality(d.demand, d.inequality_case2)
                })
                .on('end', secondAnimate)

            plot.append("text")
                .attr('id', 'textSvgInequality_first')
                .attr("text-anchor", "middle")
                .style("fill", "white")
                .style("font-size", "26px")
                .attr("x", 335)
                .attr("y", 20)
                .text(20);

            text.transition()
                .tween("text", function() {
                var selection = d3.select("#textSvgInequality_first");    // selection of node being transitioned
                var start = d3.select("#textSvgInequality_first").text(); // start value prior to transition
                var end = 80;                     // specified end value
                var interpolator = d3.interpolateNumber(start,end); // d3 interpolator

                return function(t) { selection.text(Math.round(interpolator(t))); };  // return value
        
                })
                    .delay(900)
                    .duration(900);        
        }

        function secondAnimate() {

            d3.select("#textSvgInequality_first").remove();
            d3.select("#textSvgInequality_last").remove();
        
            plot.selectAll("circle")
                .transition()
                .delay(900)
                .duration(900)
                .attr("cy", function(d) {return y_access(d.inequality_case1); })
                .style("fill", function(d){
                    return color_filter_inequality(d.demand, d.inequality_case1)
                })
                .on('end', firstAnimate)

            plot.append("text")
                .attr('id', 'textSvgInequality_last')
                .attr("text-anchor", "middle")
                .style("fill", "white")
                .style("font-size", "26px")
                .attr("x", 335)
                .attr("y", 20)
                .text(80);

            text.transition()
                .tween("text", function() {
                var selection = d3.select("#textSvgInequality_last");    // selection of node being transitioned
                var start = d3.select("#textSvgInequality_last").text(); // start value prior to transition
                var end = 20;                     // specified end value
                var interpolator = d3.interpolateNumber(start,end); // d3 interpolator

                return function(t) { selection.text(Math.round(interpolator(t))); };  // return value
        
                })  .delay(900)
                    .duration(900);
        }

        firstAnimate();

    }

    let svg = d3.selectAll('#vis').append("svg")

    let text = svg.append("text")
        .attr('id', 'textSvgInequality')
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .attr("x", 2500)
        .attr("y", 50)
        .text(1);

    text.transition()
        .tween("text", function() {
            var selection = d3.select(this);    // selection of node being transitioned
            var start = d3.select(this).text(); // start value prior to transition
            var end = 1000;                     // specified end value
            var interpolator = d3.interpolateNumber(start,end); // d3 interpolator

            return function(t) { selection.text(Math.round(interpolator(t))); };  // return value
     
    })
    .duration(900);
};

//Array of all the graph functions
//Will be called from the scroller functionality
let activationFunctions = [
    draw0,
    draw0,
    draw0,
    draw0,
    draw3, 
    draw4,
    draw0
]

//All the scrolling function
//Will draw a new graph based on the index provided by the scroll
let scroll = scroller()
    .container(d3.select('#graphic'))
scroll()

let lastIndex, activeIndex = 0

scroll.on('active', function(index){
    d3.selectAll('.step')
        .transition().duration(700)
        .style('opacity', function (d, i) {return i === index ? 1 : 1;});
    
    activeIndex = index
    let sign = (activeIndex - lastIndex) < 0 ? -1 : 1; 
    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    console.log(lastIndex)
    console.log(activeIndex)
    console.log(scrolledSections)
    scrolledSections.forEach(i => {
        activationFunctions[i]();
    })
    lastIndex = activeIndex;

})

scroll.on('progress', function(index, progress){
    if (index == 2 & progress > 0.7){

    }
})