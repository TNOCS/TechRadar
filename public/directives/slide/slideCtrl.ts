module Slide {
    import ISpreadsheetRow = csComp.Services.ISpreadsheetRow;
    import Technology      = TechRadar.Technology;

    export interface ISlideScope extends ng.IScope {
        vm: SlideCtrl;
    }

    /**
     * Controls how a slide is displayed.
     */
    export class SlideCtrl {
        private scope    : ISlideScope;
        public technology: Technology;

        public activeContent : TechRadar.Content;

        public title   : string;
        public subTitle: string;
        public text    : string;
        public media   : string;

        public page : number;

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

            busService.subscribe('page', (action : string) => {
                if (action === 'previous' && this.page>0) this.selectPage(this.page-1);
                if (action === 'next' && this.technology.content.length-1>this.page) this.selectPage(this.page+1);5
            });
        }

        public selectPage(id : number)
        {
          if (!this.technology.content) return;
          this.page = id;

          this.technology.content.forEach((c)=>
          {
            c.isSelected = c.id === id;
            if (c.isSelected) this.activeContent = c;
          });
          if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') { this.$scope.$apply(); }
        }

        private showSlide(technology: Technology) {

            if (!technology) {
                console.log("ERROR: Technology is empty");
                return;
            }
            this.technology = technology;
            if (this.technology.content.length>0)
            {
              this.selectPage(0);
            }
            if (!technology.title) {
                console.log('Missing title:');
                console.log(JSON.stringify(technology));
                return;
            }
            this.title      = technology.title;
            this.subTitle   = technology.subTitle;
            this.text       = technology.text;
            //this.media      = technology.media;
            if (this.$scope.$root.$$phase != '$apply' && this.$scope.$root.$$phase != '$digest') { this.$scope.$apply(); }
        }
    }
}
