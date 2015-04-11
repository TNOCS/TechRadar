module Slide {
    import ISpreadsheetRow = csComp.Services.ISpreadsheetRow;
    import Technology      = TechRadar.Technology;

    export interface ISlideScope extends ng.IScope {
        vm: SlideCtrl;
    }

    export class SlideCtrl {
        private scope     : ISlideScope;
        private technology: Technology;

        public title   : string;
        public subTitle: string;
        public text    : string;
        public media   : string;

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

            busService.subscribe('technology', (title, technology: Technology) => {
                if (title !== 'selected') return;
                this.showSlide(technology);
            });
        }

        private showSlide(technology: Technology) {
            this.technology = technology;
            this.title      = technology.title;
            this.subTitle   = technology.subTitle;
            this.text       = technology.text;
            this.media      = technology.media;
            if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') { this.$scope.$apply(); }
        }
    }
}
