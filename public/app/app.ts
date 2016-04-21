module App {
    'use strict';

    import Technology      = TechRadar.Technology;

    export interface IAppScope extends ng.IScope {
        vm: AppCtrl;
    }

    export class AppCtrl {
        //private public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1Q21QWlx3GqKjaLLwaq5fJb0eFwXouDMjk_cdideCHMk/pubhtml?gid=1695252245&single=true';
        private public_spreadsheet_url = "https://docs.google.com/spreadsheets/d/1XAlka6VcJ99f8A2jUlLVqvg-juUdHdf0iGuSMYTtJvM/pubhtml";

        // It provides $injector with information about dependencies to be injected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        static $inject = [
            '$scope',
            'busService',
            'sheetService'
        ]; 

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(
            private $scope             : IAppScope,
            private busService         : csComp.Services.MessageBusService,
            private spreadsheetService : csComp.Services.SpreadsheetService
            ) {
            $scope.vm = this;

            spreadsheetService.loadTechnologies(this.public_spreadsheet_url, () => busService.publish('technologies', 'loaded'));
        }
    }

    // Start the application
    angular.module('TechRadar', [
            'ngRoute',
            'ui.bootstrap',
            'techRadar.infoslide',
            'techRadar.techRadarChart',
            'techRadar.youtube',
            'wiz.markdown'
        ])
        .filter('priorityFilter', function() {
            return function(technologies: Technology[], priorityLevel: number) {
                var filteredItems = [];
                if (typeof technologies === 'undefined') return filteredItems;
                technologies.forEach((t) => {
                    if (t.priority <= priorityLevel) filteredItems.push(t);
                });
                return filteredItems;
            };
        })
        .config(function($routeProvider, $locationProvider) {
            $routeProvider
                .when('/home', {
                    templateUrl: 'partials/home.tpl.html',
                    activetab: 'home',
                    controller: HomeCtrl
                })
                .when('/about', {
                    templateUrl: 'partials/about.tpl.html',
                    activetab: 'about'
                    //, controller: 'aboutCtrl'
                })
                .when('/contact', {
                    templateUrl: 'partials/contact.tpl.html',
                    activetab: 'contact'
                })
                .otherwise({
                    redirectTo: '/home'
                });
          
        })        
        .service('sheetService', csComp.Services.SpreadsheetService)
        .service('busService', csComp.Services.MessageBusService)
        .controller('appCtrl', AppCtrl)
        .controller('homeCtrl', HomeCtrl)
        .config(function($sceDelegateProvider) {$sceDelegateProvider.resourceUrlWhitelist([
   // Allow same origin resource loads.
   'self',
   // Allow loading from our assets domain.  Notice the difference between * and **.
   'http://www.youtube.com/**'
 ]);
});
}
