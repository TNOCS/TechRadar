module TechRadar {
    import ISpreadsheetRow = csComp.Services.ISpreadsheetRow;

    export interface ITechRadarScope extends ng.IScope {
        vm: TechRadarCtrl;
    }

    export class TechRadarCtrl {
        private scope: ITechRadarScope;
        private technologies: Technology[];

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
            private $scope     : ITechRadarScope,
            private busService : csComp.Services.MessageBusService
            ) {
            $scope.vm = this;

            busService.subscribe('spreadsheet', (title, spreadsheet) => {
                if (title !== 'newSheet') return;
                this.parseSheet(spreadsheet);
            });
        }

        private parseSheet(spreadsheet: ISpreadsheetRow[]) {
            if (!spreadsheet) return;
            this.technologies = [];
            spreadsheet.forEach((row) => {
                // console.log(row.Category);
                // console.log(row.Title);

                var deltaTimeString = row.DeltaTime;
                var deltaCatString  = row.DeltaCategory;
                var deltaTime     = 0,
                    deltaCategory = 0;
                if (typeof deltaTimeString === 'string') {
                    deltaTime = +deltaTimeString.replace(',', '.');
                } else {
                    deltaTime = deltaTimeString;
                }
                if (typeof deltaCatString === 'string') {
                    deltaCategory = +deltaCatString.replace(',', '.');
                } else {
                    deltaCategory = deltaCatString;
                }
                var technology = new Technology(row.Category, row.Thumbnail, row.TimeCategory, deltaTime, deltaCategory, row.ShortTitle, row.Title, row.SubTitle, row.Text, row.Media);
                this.technologies.push(technology);
            });
            if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') { this.$scope.$apply(); }
        }
    }
}
