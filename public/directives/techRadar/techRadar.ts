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
        .directive('techRadarChart', ['$filter',
        function ($filter): ng.IDirective {
            return {
                terminal: true,       // do not compile any other internal directives
                restrict: 'EA',       // E = elements, other options are A=attributes and C=classes
                transclude: true,
                scope: {
                    technologies: '=',  // = means that we use angular to evaluate the expression,
                    startangle  : '@',  // In degrees, 0 is north
                    endangle    : '@',
                    radius : '@',  // the value is used as is
                    margin      : '@'
                },
                controller: TechRadarCtrl,
                link: function (scope: ITechRadarChartScope, element, attrs) {
                    const rad2deg = 180 / Math.PI;
                    var padding          = scope.padding    || { top: 15, right: 5, bottom: 0, left: 10 };
                    var outerRadius      = scope.radius     || 100;
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

                        var categories    : string[] = [];
                        var categoryCounts: { [category: string] : number } = {};
                        var periods       : string[] = [];
                        var periodCounts  : { [period: string] : number } = {};

                        technologies.forEach((t) => {
                            if (categories.indexOf(t.category) < 0) {
                                categories.push(t.category);
                                categoryCounts[t.category] = 1;
                            } else {
                                categoryCounts[t.category]++;
                            }
                            if (periods.indexOf(t.timePeriod) < 0) {
                                periods.push(t.timePeriod);
                                periodCounts[t.timePeriod] = 1;
                            } else {
                                periodCounts[t.timePeriod]++;
                            }
                        });

                        console.log(categories);
                        console.log(periods);
                        console.log(periodCounts);

                        // Draw the rings
                        var totalTech   = technologies.length;
                        var curRadius   = 0;
                        var index       = 0;
                        var curCount    = 0;
                        periods.forEach((period) => {
                            curCount += periodCounts[period];
                            var innerR = curRadius;
                            var outerR = curRadius = outerRadius * curCount / totalTech;

                            var arc = d3.svg.arc()
                                .innerRadius(innerR)
                                .outerRadius(outerR)
                                .startAngle(startAngle) //converting from degs to radians
                                .endAngle(endAngle) //just radians

                            chart.append("path")
                                .attr("d", arc)
                                .attr("fill", color(index++));

                            chart.append("text")
                                .attr("transform", function(d){ return "translate(" + (curRadius - 10) + ", -5)";})
                                .attr("text-anchor", "end")
                                .text(period);
                        });

                        // Draw the lines denoting the segments
                        var curAngle = startAngle;
                        var totAngle = endAngle - startAngle;

                        categories.forEach((category) => {
                            if (curAngle < 0) {
                                chart.append("text")
                                    .attr("transform",
                                        "translate(" + (Math.sin(curAngle)* (outerRadius-5) + 5) + "," + (-Math.cos(curAngle)*(outerRadius-5) - 5) + ")" +
                                        "rotate(" + (90 + curAngle * rad2deg) + ")")
                                    .attr("text-anchor", "start")
                                    .text(category);
                            } else {
                                chart.append("text")
                                    .attr("transform",
                                        "translate(" + (Math.sin(curAngle)* (outerRadius-5) - 5) + "," + (-Math.cos(curAngle)*(outerRadius-5) + 5) + ")" +
                                        "rotate(" + (-90 + curAngle * rad2deg) + ")")
                                    .attr("dy", "1.2em")
                                    .attr("text-anchor", "end")
                                    .text(category);
                            }
                            var x1 =  + Math.sin(curAngle)*outerRadius;
                            var y1 =  - Math.cos(curAngle)*outerRadius;
                            curAngle += totAngle * categoryCounts[category] / totalTech;
                            var x2 =  + Math.sin(curAngle)*outerRadius;
                            var y2 =  - Math.cos(curAngle)*outerRadius;
                            chart.append('line')
                                .attr("x1", 0)
                                .attr("y1", 0)
                                .attr("x2", x1)
                                .attr("y2", y1)
                                .attr("stroke-width", 2)
                                .attr("stroke", "black");
                            chart.append('line')
                                .attr("x1", 0)
                                .attr("y1", 0)
                                .attr("x2", x2)
                                .attr("y2", y2)
                                .attr("stroke-width", 2)
                                .attr("stroke", "black");
                        });
                        // console.log('Technologies: ')
                        // console.log(scope.technologies);
                    };

                    scope.$watch('technologies', function (newVal, oldVal) {
                        if (newVal !== oldVal) scope.render(scope.technologies);
                    });

                    if (scope.technologies) scope.render(scope.technologies);
                }
            }
        }])
}
