data = [{
    "State": "AL",
        "Under 5 Years": "310504",
        "5 to 13 Years": "552339",
        "14 to 17 Years": "259034",
        "18 to 24 Years": "450818",
        "25 to 44 Years": "1231572",
        "45 to 64 Years": "1215966",
        "65 Years and Over": "641667"
}, {
    "State": "AK",
        "Under 5 Years": "52083",
        "5 to 13 Years": "85640",
        "14 to 17 Years": "42153",
        "18 to 24 Years": "74257",
        "25 to 44 Years": "198724",
        "45 to 64 Years": "183159",
        "65 Years and Over": "50277"
}, {
    "State": "AZ",
        "Under 5 Years": "515910",
        "5 to 13 Years": "828669",
        "14 to 17 Years": "362642",
        "18 to 24 Years": "601943",
        "25 to 44 Years": "1804762",
        "45 to 64 Years": "1523681",
        "65 Years and Over": "862573"
}, {
    "State": "AR",
        "Under 5 Years": "202070",
        "5 to 13 Years": "343207",
        "14 to 17 Years": "157204",
        "18 to 24 Years": "264160",
        "25 to 44 Years": "754420",
        "45 to 64 Years": "727124",
        "65 Years and Over": "407205"
}]

var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
},
width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

var y = d3.scale.linear().rangeRound([height, 0]);

var color = d3.scale.ordinal().range(["#ce99f2", "#6c3b8c", "#cfacf2", "#6b486b", "#54734c", "#a5a68d", "#ff8c00"]);

var xAxis = d3.svg.axis().scale(x).orient("bottom");

var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(d3.format(".2s"));

var svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

color.domain(d3.keys(data[0]).filter(function (key) {
    return key !== "State";
}));

data.forEach(function (d) {
    var y0 = 0;
    d.ages = color.domain().map(function (name) {
        return {
            name: name,
            y0: y0,
            y1: y0 += +d[name]
        };
    });
    d.total = d.ages[d.ages.length - 1].y1;
});

//

x.domain(data.map(function (d) {
    return d.State;
}));
y.domain([0, d3.max(data, function (d) {
    return d.total;
})]);

svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")").call(xAxis);

svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Population");

var state = svg.selectAll(".state").data(data).enter().append("g").attr("class", "g").attr("transform", function (d) {
    return "translate(" + x(d.State) + ",0)";
}).attr("id", function (d) {

    return d.State;
}).attr("class", "stack");

state.selectAll("rect").data(function (d) {
    return d.ages;
}).enter().append("rect").attr("width", x.rangeBand()).attr("y", function (d) {
    return y(d.y1);
}).attr("height", function (d) {
    return y(d.y0) - y(d.y1);
}).style("fill", function (d) {
    return color(d.name);
});

var legend = svg.selectAll(".legend").data(color.domain().slice().reverse()).enter().append("g").attr("class", "legend").attr("transform", function (d, i) {
    return "translate(0," + i * 20 + ")";
});

legend.append("rect").attr("x", width - 18).attr("width", 18).attr("height", 18).style("fill", color);

legend.append("text").attr("x", width - 24).attr("y", 9).attr("dy", ".35em").style("text-anchor", "end").text(function (d) {
    return d;
});

d3.select("#test").on("click", change);

function change() {


    var x0 = x.domain(data.sort(this.id == "test" ? function (a, b) {
        return b.total - a.total;
    } : function (a, b) {
        return d3.ascending(a.State, b.State);
    }).map(function (d) {
        return d.State;
    })).copy();
    svg.selectAll(".stack").sort(function (a, b) {
        return x0(a.State) - x0(b.State);
    });

    var transition = svg.transition().duration(750),
        delay = function (d, i) {
            return i * 50;
        };
    //translate the stack post sorting.
    transition.selectAll(".stack").delay(delay).attr("transform", function (d) {

        return "translate(" + x0(d.State) + ",0)";
    });
    //x axis is sorted
    transition.select(".x.axis").call(xAxis).selectAll("g").delay(delay);
}