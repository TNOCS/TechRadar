var TechRadar;
(function (TechRadar) {
    'use strict';
    var moduleName = 'techRadar.techRadarChart';
    TechRadar.myModule;
    try {
        TechRadar.myModule = angular.module(moduleName);
    }
    catch (err) {
        TechRadar.myModule = angular.module(moduleName, []);
    }
    TechRadar.myModule
        .directive('techRadarChart', ['$filter', 'busService',
        function ($filter, bus) {
            return {
                terminal: true,
                restrict: 'EA',
                transclude: true,
                scope: {
                    technologies: '=',
                    startangle: '@',
                    endangle: '@',
                    radius: '@',
                    innerradius: '@',
                    margin: '@'
                },
                link: function (scope, element, attrs) {
                    var rad2deg = 180 / Math.PI;
                    var padding = scope.padding || { top: 15, right: 25, bottom: 15, left: 15 };
                    var outerRadius = scope.radius || 100;
                    var innerRadius = scope.innerradius || 75;
                    var startAngle = scope.startangle ? scope.startangle / rad2deg : -Math.PI / 2;
                    var endAngle = scope.endangle ? scope.endangle / rad2deg : Math.PI / 2;
                    var cursorTextHeight = 12;
                    var actualWidth = 2 * outerRadius + padding.left + padding.right;
                    var actualHeight = 2 * outerRadius + padding.top + padding.bottom;
                    d3.selection.prototype.moveToFront = function () {
                        return this.each(function () {
                            this.parentNode.appendChild(this);
                        });
                    };
                    scope.render = function (technologies, renderOptions) {
                        d3.select(element[0]).selectAll("*").remove();
                        var chart = d3.select(element[0])
                            .append('svg:svg')
                            .attr('width', actualWidth)
                            .attr('height', actualHeight)
                            .append("g")
                            .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");
                        var categories = [];
                        var categoriesInfo = {};
                        var allPeriods = [];
                        var periods = [];
                        var periodsInfo = {};
                        var filteredTechnologies = [];
                        if (renderOptions && (renderOptions.time || renderOptions.category)) {
                            technologies.forEach(function (t) {
                                if ((renderOptions.time && t.timePeriod === renderOptions.time) ||
                                    (renderOptions.category && t.category === renderOptions.category))
                                    filteredTechnologies.push(t);
                            });
                        }
                        else {
                            filteredTechnologies = technologies;
                        }
                        var color = d3.scale.category20c();
                        var index = 0;
                        technologies.forEach(function (t) {
                            if (allPeriods.indexOf(t.timePeriod) >= 0)
                                return;
                            allPeriods.push(t.timePeriod);
                            color(index++);
                        });
                        filteredTechnologies.forEach(function (t) {
                            if (categories.indexOf(t.category) < 0) {
                                categories.push(t.category);
                                categoriesInfo[t.category] = { count: 1, startAngle: 0, endAngle: 0, innerRadius: 0, outerRadius: 0 };
                            }
                            else {
                                categoriesInfo[t.category].count++;
                            }
                            if (periods.indexOf(t.timePeriod) < 0) {
                                periods.push(t.timePeriod);
                                periodsInfo[t.timePeriod] = { count: 1, innerRadius: 0, outerRadius: 0 };
                            }
                            else {
                                periodsInfo[t.timePeriod].count++;
                            }
                        });
                        var totalTech = filteredTechnologies.length;
                        var curRadius = innerRadius;
                        var curCount = 0;
                        periods.forEach(function (period) {
                            curCount += periodsInfo[period].count;
                            var innerR = curRadius;
                            var outerR = curRadius = Math.sqrt(innerRadius * innerRadius + (outerRadius * outerRadius - innerRadius * innerRadius) * curCount / totalTech);
                            periodsInfo[period].innerRadius = innerR;
                            periodsInfo[period].outerRadius = outerR;
                            var arc = d3.svg.arc()
                                .innerRadius(innerR)
                                .outerRadius(outerR)
                                .startAngle(startAngle)
                                .endAngle(endAngle);
                            chart.append("path")
                                .attr("d", arc)
                                .attr("fill", color(allPeriods.indexOf(period)));
                            chart.append("text")
                                .attr("transform", function (d) { return "translate(" + (curRadius - 5) + ", -5)"; })
                                .attr("dy", "1.2em")
                                .attr("text-anchor", "end")
                                .attr("class", "period")
                                .text(period)
                                .on("click", function (t, i) {
                                scope.render(technologies, { time: period });
                            });
                        });
                        var curAngle = startAngle;
                        var totAngle = endAngle - startAngle;
                        categories.forEach(function (category) {
                            categoriesInfo[category].startAngle = curAngle;
                            var textEl;
                            if (curAngle > Math.PI || curAngle < 0) {
                                textEl = chart.append("text")
                                    .attr("transform", "translate(" + (Math.sin(curAngle) * (outerRadius - 5)) + "," + (-Math.cos(curAngle) * (outerRadius - 5) - 3) + ")" +
                                    "rotate(" + (90 + curAngle * rad2deg) + ")")
                                    .attr("text-anchor", "start")
                                    .attr("dy", -5)
                                    .attr("class", "category")
                                    .text(category);
                            }
                            else {
                                textEl = chart.append("text")
                                    .attr("transform", "translate(" + (Math.sin(curAngle) * (outerRadius - 5) - 5) + "," + (-Math.cos(curAngle) * (outerRadius - 5) + 3) + ")" +
                                    "rotate(" + (-90 + curAngle * rad2deg) + ")")
                                    .attr("dy", Math.cos(curAngle) * 0.4 + 1 + "em")
                                    .attr("text-anchor", "end")
                                    .attr("class", "category")
                                    .text(category);
                            }
                            textEl
                                .on("mouseover", function (t, i) {
                                var sel = d3.select(this);
                                sel.moveToFront();
                            })
                                .on("click", function (t, i) {
                                scope.render(technologies, { category: category });
                            });
                            var x0 = +Math.sin(curAngle) * innerRadius, y0 = -Math.cos(curAngle) * innerRadius;
                            var x1 = +Math.sin(curAngle) * outerRadius, y1 = -Math.cos(curAngle) * outerRadius;
                            chart.append('line')
                                .attr("x1", x0)
                                .attr("y1", y0)
                                .attr("x2", x1)
                                .attr("y2", y1)
                                .attr("stroke-width", 2)
                                .attr("stroke", "black");
                            curAngle += totAngle * categoriesInfo[category].count / totalTech;
                            categoriesInfo[category].endAngle = curAngle;
                            var x0 = +Math.sin(curAngle) * innerRadius, y0 = -Math.cos(curAngle) * innerRadius;
                            var x2 = +Math.sin(curAngle) * outerRadius, y2 = -Math.cos(curAngle) * outerRadius;
                            chart.append('line')
                                .attr("x1", x0)
                                .attr("y1", y0)
                                .attr("x2", x2)
                                .attr("y2", y2)
                                .attr("stroke-width", 2)
                                .attr("stroke", "black");
                        });
                        var elem = chart.selectAll("g")
                            .data(filteredTechnologies);
                        var items = elem
                            .enter()
                            .append("g")
                            .attr('class', 'shortTitle');
                        items.transition()
                            .delay(function (d, i) { return i * 10; })
                            .duration(1500)
                            .attr("transform", function (t) {
                            var categoryInfo = categoriesInfo[t.category];
                            var periodInfo = periodsInfo[t.timePeriod];
                            var angle = categoryInfo.startAngle + Math.max(0.1, t.relativeAngle || Math.random()) * (categoryInfo.endAngle - categoryInfo.startAngle);
                            var radius = periodInfo.innerRadius + Math.max(0.1, Math.min(0.9, t.relativeRadius || Math.random())) * (periodInfo.outerRadius - periodInfo.innerRadius);
                            var x = Math.sin(angle) * radius;
                            var y = -Math.cos(angle) * radius;
                            return "translate(" + x + "," + y + ")";
                        });
                        items.on("mouseover", function (t, i) {
                            var sel = d3.select(this);
                            sel.moveToFront();
                            bus.publish('technology', 'selected', t);
                        });
                        items.append("text")
                            .attr("font-family", "FontAwesome")
                            .attr("font-size", function (t) { return FontAwesomeUtils.FontAwesomeConverter.convertToSize(t.thumbnail); })
                            .attr("fill", "black")
                            .attr("text-anchor", "end")
                            .attr("class", function (t) { return t.thumbnail.toLowerCase() || "thumbnail"; })
                            .text(function (t) { return FontAwesomeUtils.FontAwesomeConverter.convertToCharacter(t.thumbnail); });
                        items.append("text")
                            .attr("dx", 5)
                            .attr("font-size", function (t) { return FontAwesomeUtils.FontAwesomeConverter.convertToSize(t.thumbnail); })
                            .text(function (t, i) { return t.shortTitle; });
                        if (renderOptions && (renderOptions.time || renderOptions.category)) {
                            chart.append("text")
                                .attr("x", 0)
                                .attr("y", 0)
                                .attr("alignment-baseline", "central")
                                .attr("text-anchor", "middle")
                                .attr("class", "backarrow")
                                .attr("font-family", "FontAwesome")
                                .text(FontAwesomeUtils.FontAwesomeConverter.convertToCharacter("fa-arrow-circle-o-left"))
                                .on("click", function (t, i) {
                                scope.render(technologies);
                            });
                        }
                    };
                    scope.$watch('technologies', function (newVal, oldVal) {
                        if (newVal !== oldVal)
                            scope.render(scope.technologies);
                    });
                    if (scope.technologies)
                        scope.render(scope.technologies);
                }
            };
        }]);
})(TechRadar || (TechRadar = {}));
