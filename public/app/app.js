var App;
(function (App) {
    'use strict';
    var Technology = TechRadar.Technology;
    var AppCtrl = (function () {
        function AppCtrl($scope, busService, spreadsheetService) {
            var _this = this;
            this.$scope = $scope;
            this.busService = busService;
            this.spreadsheetService = spreadsheetService;
            this.public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1Q21QWlx3GqKjaLLwaq5fJb0eFwXouDMjk_cdideCHMk/pubhtml?gid=1695252245&single=true';
            $scope.vm = this;
            spreadsheetService.loadSheet(this.public_spreadsheet_url, function (spreadsheet) {
                //this.showInfo(spreadsheet);
                //busService.publish('spreadsheet', 'newSheet', spreadsheet);
                _this.technologies = [];
                spreadsheet.forEach(function (row) {
                    console.log(row.Category);
                    console.log(row.Title);
                    var deltaTimeString = row.DeltaTime;
                    var deltaCatString = row.DeltaCategory;
                    var deltaTime = 0, deltaCategory = 0;
                    if (typeof deltaTimeString === 'string') {
                        deltaTime = +deltaTimeString.replace(',', '.');
                    }
                    else {
                        deltaTime = deltaTimeString;
                    }
                    if (typeof deltaCatString === 'string') {
                        deltaCategory = +deltaCatString.replace(',', '.');
                    }
                    else {
                        deltaCategory = deltaCatString;
                    }
                    var technology = new Technology(row.Category, row.Thumbnail, row.TimeCategory, deltaTime, deltaCategory, row.ShortTitle, row.Title, row.SubTitle, row.Text, row.Media);
                    _this.technologies.push(technology);
                });
                if (_this.$scope.$root.$$phase != '$apply' && _this.$scope.$root.$$phase != '$digest') {
                    _this.$scope.$apply();
                }
            });
        }
        AppCtrl.prototype.showInfo = function (spreadsheet) {
            var index = 1;
            spreadsheet.forEach(function (row) {
                console.log('Row ' + index++);
                for (var header in row) {
                    if (!row.hasOwnProperty(header))
                        continue;
                    console.log(header + ': ' + row[header]);
                }
            });
        };
        AppCtrl.$inject = [
            '$scope',
            'busService',
            'sheetService'
        ];
        return AppCtrl;
    })();
    App.AppCtrl = AppCtrl;
    angular.module('TechRadar', [
        'ui.bootstrap',
        'techRadar.infoslide',
        'techRadar.techRadarChart'
    ])
        .service('sheetService', csComp.Services.SpreadsheetService)
        .service('busService', csComp.Services.MessageBusService)
        .controller('appCtrl', AppCtrl);
})(App || (App = {}));
