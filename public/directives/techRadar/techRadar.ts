module TechRadar {
    'use strict'
    /**
      * Config
      */
    var moduleName = 'techRadar.techRadarChart';

    /**
      * Module
      */
    export var myModule;
    try {
        myModule = angular.module(moduleName);
    } catch (err) {
        // named module does not exist, so create one
        myModule = angular.module(moduleName, []);
    }

    declare var String;

    export interface ITechRadarChartScope extends ng.IScope {
        technologies: Technology[];
        /**
         * Start angle in degrees (0 degrees is North).
         * @type {number}
         */
        startangle? : number;
        /**
         * End angle in degrees (0 degrees is North).
         * @type {[type]}
         */
        endangle?   : number;
        radius?: number;
        innerradius?: number;
        padding?     : { top: number; right: number; bottom: number; left: number; };
        render(technologies: Technology[]): void;
    }

    export class RadarSection {
        title     : string;
        startAngle: number;
        endAngle  : number;
    }

    /**
      * Directive to create a sparkline chart.
      *
      * @seealso: http://odiseo.net/angularjs/proper-use-of-d3-js-with-angular-directives
      * @seealso: http://cmaurer.github.io/angularjs-nvd3-directives/sparkline.chart.html
      * @seealso: http://www.tnoda.com/blog/2013-12-19
      */
    myModule
        .directive('techRadarChart', ['$filter', 'busService',
        function ($filter: ng.IFilterService, bus: csComp.Services.MessageBusService): ng.IDirective {
            return {
                terminal: true,       // do not compile any other internal directives
                restrict: 'EA',       // E = elements, other options are A=attributes and C=classes
                transclude: true,
                scope: {
                    technologies: '=',  // = means that we use angular to evaluate the expression,
                    startangle  : '@',  // In degrees, 0 is north
                    endangle    : '@',
                    radius      : '@',  // the value is used as is
                    innerradius : '@',
                    margin      : '@'
                },
                controller: TechRadarCtrl,
                link: function (scope: ITechRadarChartScope, element, attrs) {
                    const rad2deg = 180 / Math.PI;
                    var padding          = scope.padding    || { top: 15, right: 5, bottom: 0, left: 10 };
                    var outerRadius      = scope.radius     || 100;
                    var innerRadius      = scope.innerradius|| 75;
                    var startAngle       = scope.startangle ? scope.startangle / rad2deg : -Math.PI/2;
                    var endAngle         = scope.endangle   ? scope.endangle   / rad2deg :  Math.PI/2;
                    var cursorTextHeight = 12;// + (showAxis ? 5 : 0); // leave room for the cursor text (timestamp | measurement)

                    var actualWidth  = 2 * outerRadius + padding.left + padding.right;
                    var actualHeight = 2 * outerRadius + padding.top  + padding.bottom;

                    var chart = d3.select(element[0])
                        .append('svg:svg')
                        .attr('width', actualWidth)
                        .attr('height', actualHeight)
                        .append("g")
                        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

                    scope.render = function(technologies: Technology[]) {
                        var color = d3.scale.category20c();

                        var categories  : string[] = [];
                        var categoriesInfo: {
                            [category: string] : {
                                count      : number;
                                startAngle : number;
                                endAngle   : number;
                            }
                        } = {};
                        var periods   : string[] = [];
                        var periodsInfo: {
                            [period: string] : {
                                count      : number;
                                innerRadius: number;
                                outerRadius: number;
                            }
                        } = {};

                        technologies.forEach((t) => {
                            if (categories.indexOf(t.category) < 0) {
                                categories.push(t.category);
                                categoriesInfo[t.category] = { count: 1, startAngle: 0, endAngle: 0, innerRadius: 0, outerRadius: 0 };
                            } else {
                                categoriesInfo[t.category].count++;
                            }
                            if (periods.indexOf(t.timePeriod) < 0) {
                                periods.push(t.timePeriod);
                                periodsInfo[t.timePeriod] = { count: 1, innerRadius: 0, outerRadius: 0 };
                            } else {
                                periodsInfo[t.timePeriod].count++;
                            }
                        });

                        console.log(categories);
                        console.log(periods);
                        console.log(periodsInfo);

                        // Draw the rings
                        var totalTech   = technologies.length;
                        var curRadius   = innerRadius;
                        var index       = 0;
                        var curCount    = 0;
                        periods.forEach((period) => {
                            curCount += periodsInfo[period].count;
                            var innerR = curRadius;
                            var outerR = curRadius = innerRadius + (outerRadius - innerRadius) * curCount / totalTech;

                            periodsInfo[period].innerRadius = innerR;
                            periodsInfo[period].outerRadius = outerR;

                            var arc = d3.svg.arc()
                                .innerRadius(innerR)
                                .outerRadius(outerR)
                                .startAngle(startAngle) //converting from degs to radians
                                .endAngle(endAngle) //just radians

                            chart.append("path")
                                .attr("d", arc)
                                .attr("fill", color(index++));

                            chart.append("text")
                                .attr("transform", function(d){ return "translate(" + (curRadius - 5) + ", -5)";})
                                .attr("dy", "1.2em")
                                .attr("text-anchor", "end")
                                .text(period);
                        });

                        // Draw the lines denoting the segments
                        var curAngle = startAngle;
                        var totAngle = endAngle - startAngle;

                        categories.forEach((category) => {
                            categoriesInfo[category].startAngle = curAngle;
                            if (curAngle > Math.PI || curAngle < 0) {
                                chart.append("text")
                                    .attr("transform",
                                        "translate(" + (Math.sin(curAngle) * (outerRadius-5)) + "," + (-Math.cos(curAngle)*(outerRadius-5) - 5) + ")" +
                                        "rotate(" + (90 + curAngle * rad2deg) + ")")
                                    .attr("text-anchor", "start")
                                    .attr("dy", Math.cos(curAngle) * 0.6 + "em")
                                    .text(category);
                            } else {
                                chart.append("text")
                                    .attr("transform",
                                        "translate(" + (Math.sin(curAngle)* (outerRadius-5) - 5) + "," + (-Math.cos(curAngle)*(outerRadius-5) + 3) + ")" +
                                        "rotate(" + (-90 + curAngle * rad2deg) + ")")
                                    .attr("dy", Math.cos(curAngle) * 0.4 + 1 + "em")   // dy = 1.2em when curAngle === 0, dy = 0.8em when curAngle === PI/2
                                    .attr("text-anchor", "end")
                                    .text(category);
                            }
                            var x0 =  + Math.sin(curAngle)*innerRadius,
                                y0 =  - Math.cos(curAngle)*innerRadius;
                            var x1 =  + Math.sin(curAngle)*outerRadius,
                                y1 =  - Math.cos(curAngle)*outerRadius;
                            chart.append('line')
                                .attr("x1", x0)
                                .attr("y1", y0)
                                .attr("x2", x1)
                                .attr("y2", y1)
                                .attr("stroke-width", 2)
                                .attr("stroke", "black");
                            curAngle += totAngle * categoriesInfo[category].count / totalTech;
                            categoriesInfo[category].endAngle = curAngle;
                            var x0 =  + Math.sin(curAngle)*innerRadius,
                                y0 =  - Math.cos(curAngle)*innerRadius;
                            var x2 =  + Math.sin(curAngle)*outerRadius,
                                y2 =  - Math.cos(curAngle)*outerRadius;
                            chart.append('line')
                                .attr("x1", x0)
                                .attr("y1", y0)
                                .attr("x2", x2)
                                .attr("y2", y2)
                                .attr("stroke-width", 2)
                                .attr("stroke", "black");
                        });

                        // Draw the items
                        // Define the data for the circles
                        var elem = chart.selectAll("g")
                            .data(technologies)

                        // Create and place the "blocks" containing the circle and the text
                        var elemEnter = elem.enter()
                            .append("g")
                            .attr('class', 'shortTitle')
                            .attr("transform", function(t: Technology){
                                    var categoryInfo = categoriesInfo[t.category];
                                    var periodInfo   = periodsInfo[t.timePeriod];
                                    var angle  = categoryInfo.startAngle + Math.max(0.3, t.relativeAngle || Math.random()) * (categoryInfo.endAngle - categoryInfo.startAngle);
                                    var radius = periodInfo.innerRadius + Math.max(0.1, Math.min(0.9, t.relativeRadius || Math.random())) * (periodInfo.outerRadius - periodInfo.innerRadius);
                                    var x =  Math.sin(angle) * radius;
                                    var y = -Math.cos(angle) * radius;
                                    return "translate(" + x + "," + y + ")";
                                })
                            .on("mouseover", function(t: Technology, i: number) {
                                bus.publish('technology', 'selected', t);
                            });

                        // Create the circle for each technology
                        var circle = elemEnter.append("circle")
                            .attr("r", 10)
                            .attr("stroke", "black")
                            .attr("fill", function(t: Technology) { return t.thumbnail.toLowerCase() === 'new' ? "red" : "black" });

                        // Create the index for each technology
                        elemEnter.append("text")
                            .attr("dx", function(t: Technology, i: number) { return i > 9 ? -7 : -4; })
                            .attr("dy", 5)
                            .text(function(t: Technology, i: number){return (i+1) });

                        // Create the short title for each technology
                        elemEnter.append("text")
                            .attr("dx", 14)
                            .attr("dy", 5)
                            .text(function(t: Technology, i: number){return t.shortTitle });


                        // chart.selectAll(".fa")
                        //     .data(technologies)
                        //     .enter().append("text")
                        //     .attr("transform", function(t: Technology){
                        //         var categoryInfo = categoriesInfo[t.category];
                        //         var periodInfo   = periodsInfo[t.timePeriod];
                        //         var angle  = categoryInfo.startAngle + Math.max(0.3, Math.random()) * (categoryInfo.endAngle - categoryInfo.startAngle);
                        //         var radius = periodInfo.innerRadius + Math.random() * (periodInfo.outerRadius - periodInfo.innerRadius);
                        //         t.x =  Math.sin(angle) * radius;
                        //         t.y = -Math.cos(angle) * radius;
                        //         return "translate(" + t.x + "," + t.y + ")";})
                        //     .attr('font-size', function(t: Technology) { return '1.5em'} )
                        //     .attr('font-family', 'FontAwesome')
                        //     .attr("text-anchor", "middle")
                        //     .text(function(d) { return '\uf111' });
                        // chart.selectAll(".shortTitle")
                        //     .data(technologies)
                        //     .enter().append("text")
                        //     .attr("transform", function(t: Technology){
                        //         return "translate(" + (t.x-5) + "," + (t.y-5) + ")";})
                        //     .attr('class', 'shortTitle')
                        //     .attr("text-anchor", "start")
                        //     .text(function(t: Technology, i: number) { return (i+1) + ' ' + t.shortTitle });
                    };

                    scope.$watch('technologies', function (newVal, oldVal) {
                        if (newVal !== oldVal) scope.render(scope.technologies);
                    });

                    if (scope.technologies) scope.render(scope.technologies);
                }
            }
        }])
}
