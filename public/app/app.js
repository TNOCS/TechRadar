var App;
(function (App) {
    'use strict';
    var AppCtrl = (function () {
        function AppCtrl($scope) {
            this.$scope = $scope;
            $scope.vm = this;
        }
        AppCtrl.$inject = [
            '$scope'
        ];
        return AppCtrl;
    })();
    App.AppCtrl = AppCtrl;
    angular.module('TechRadar', [
        'ui.bootstrap',
        'techRadar.infoslide'
    ])
        .controller('appCtrl', AppCtrl);
})(App || (App = {}));
