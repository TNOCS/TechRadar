module Slide {
    declare var Tabletop;

    export interface ISlideScope extends ng.IScope {
        vm: SlideCtrl;
    }

    export class SlideCtrl {
        private scope: ISlideScope;
        private public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1Q21QWlx3GqKjaLLwaq5fJb0eFwXouDMjk_cdideCHMk/pubhtml?gid=1695252245&single=true';

        public table: any;

        // $inject annotation.
        // It provides $injector with information about dependencies to be injected into constructor
        // it is better to have it close to the constructor, because the parameters must match in count and type.
        // See http://docs.angularjs.org/guide/di
        public static $inject = [
            '$scope'
        ];

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(
            private $scope: ISlideScope
            ) {
            $scope.vm = this;

            this.init();
            this.table = 'Hello';
        }

        private init() {
            console.log('Initializing tabletop');
            Tabletop.init({
                key: this.public_spreadsheet_url,
                callback: (data: Object) => this.showInfo(data),
                simpleSheet: true
            });
        }

        /**
         * show info that is obtained from the Google sheet.
         */
        private showInfo(data: Object) {
            //alert(data);
            var table = JSON.stringify(data);
            this.table = table;
            if (this.$scope.$$phase != '$apply' && this.$scope.$$phase != '$digest') { this.$scope.$apply(); }

            console.log(table);
        }
    }
}
