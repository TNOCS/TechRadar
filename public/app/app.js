var App;
(function (App) {
    'use strict';
    var AppCtrl = (function () {
        function AppCtrl($scope, busService, spreadsheetService) {
            var _this = this;
            this.$scope = $scope;
            this.busService = busService;
            this.spreadsheetService = spreadsheetService;
            this.public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1Q21QWlx3GqKjaLLwaq5fJb0eFwXouDMjk_cdideCHMk/pubhtml?gid=1695252245&single=true';
            $scope.vm = this;
            spreadsheetService.loadSheet(this.public_spreadsheet_url, function (spreadsheet) {
                _this.showInfo(spreadsheet);
                busService.publish('spreadsheet', 'newSheet', spreadsheet);
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
        'techRadar.infoslide'
    ])
        .service('sheetService', csComp.Services.SpreadsheetService)
        .service('busService', csComp.Services.MessageBusService)
        .controller('appCtrl', AppCtrl);
})(App || (App = {}));
