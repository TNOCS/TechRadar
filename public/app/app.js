var App;
(function (App) {
    'use strict';
    var AppCtrl = (function () {
        function AppCtrl($scope, busService, sheetService) {
            this.$scope = $scope;
            this.busService = busService;
            this.sheetService = sheetService;
            $scope.vm = this;
        }
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
        .service('sheetService', csComp.Services.SheetService)
        .service('busService', csComp.Services.MessageBusService)
        .controller('appCtrl', AppCtrl);
})(App || (App = {}));
