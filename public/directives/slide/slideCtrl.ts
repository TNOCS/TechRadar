module Slide {
    import ISpreadsheetRow = csComp.Services.ISpreadsheetRow;

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
            '$scope',
            'busService'
        ];

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(
            private $scope     : ISlideScope,
            private busService : csComp.Services.MessageBusService
            ) {
            $scope.vm = this;

            this.table = 'Hello';

            busService.subscribe('spreadsheet', (title, spreadsheet) => {
                if (title !== 'newSheet') return;
                this.showSheet(spreadsheet);
            });
        }

        private showSheet(spreadsheet: ISpreadsheetRow[]) {
            this.table = JSON.stringify(spreadsheet);

            if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') { this.$scope.$apply(); }
        }
    }
}
