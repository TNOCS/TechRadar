module App {
    import ISpreadsheetRow = csComp.Services.ISpreadsheetRow;
    import Technology      = TechRadar.Technology;

    export interface IHomeScope extends ng.IScope {
        vm: HomeCtrl;        
    }

    export class HomeCtrl {
       private technologies: Technology[] = [];

        public options: TechRadar.RenderOptions;

        public filter: Function;
        private slider: any;
        private activeFocus: number;
        private isSliderInitialised = false;

        static $inject = [
            '$scope',
            '$timeout',
            'busService',
            'sheetService'
        ];

        // dependencies are injected via AngularJS $injector
        // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
        constructor(
            private $scope             : IHomeScope,
            private $timeout           : ng.ITimeoutService,
            private busService         : csComp.Services.MessageBusService,
            private spreadsheetService : csComp.Services.SpreadsheetService
            ) {
            $scope.vm = this;
            
            this.options = { prio : { 1 : true, 2: true, 3:false} };
            busService.subscribe('technology', (action: string, t: Technology) => {
                switch (action) {
                    case 'selected':
                        this.setFocus(t);
                        break;
                }
            });

            busService.subscribe('technologies', (title: string) => {
                if (title !== 'loaded') return;
                this.reload();
            });

            this.reload();
        }
        
        /** reload new technologies */
        private reload() {
            this.technologies = this.spreadsheetService.technologies;
            if (!this.technologies || this.technologies.length === 0) return;
            this.$timeout(() => {
                this.initSlider();
                this.setFocus(this.technologies[0]);
            }, 0);
        }

        public setFocus(t: Technology) {
            if (!this.isSliderInitialised) return;
            this.technologies.forEach((ts) => ts.focus = false);
            t.focus = true;
            var est = $('#tech-' + t.id);
            var list = $('#tslist');

            this.slider.gotoSlide(t.id);
            this.activeFocus = t.id;
        }

        private initSlider() {
            if (this.$scope.$root.$$phase !== '$apply' && this.$scope.$root.$$phase !== '$digest') {
                this.isSliderInitialised = true;
                this.$scope.$apply();
                this.slider = <any>$('.ts');
                this.slider.itemslide({ disable_autowidth: true });
                this.busService.publish('technology', 'selected', this.technologies[0]);
                $('body').keydown((event) => {
                    var selected: Technology;
                    switch ((<any>event.originalEvent).keyIdentifier) {
                        case 'Home':
                            this.activeFocus = 0;
                            while (this.activeFocus < this.technologies.length) {
                                selected = this.technologies[this.activeFocus];
                                if (selected.visible) break;
                                this.activeFocus++;
                            }
                            this.busService.publish('technology', 'selected', selected);
                            break;
                        case 'End':
                            this.activeFocus = this.technologies.length - 1;
                            while (this.activeFocus > 1) {
                                selected = this.technologies[this.activeFocus];
                                if (selected.visible) break;
                                this.activeFocus--;
                            }
                            this.busService.publish('technology', 'selected', selected);
                            break;
                        case 'Left':
                            while (this.activeFocus > 1) {
                                selected = this.technologies[this.activeFocus - 2];
                                if (selected.visible) break;
                                this.activeFocus--;
                            }
                            this.busService.publish('technology', 'selected', selected);
                            break;
                        case 'Right':
                            while (this.activeFocus < this.technologies.length) {
                                selected = this.technologies[this.activeFocus];
                                if (selected.visible) break;
                                this.activeFocus++;
                            }
                            this.busService.publish('technology', 'selected', selected);
                            break;
                        case 'Up':
                            this.busService.publish('page', 'previous', '');
                            break;
                        case 'Down':
                            this.busService.publish('page', 'next', '');
                            break;
                    }

                    if (event.which === 13) {
                        event.preventDefault();
                    }
                });
            }
        }

        private focus(t: Technology) {
            this.busService.publish('technology', 'selected', t);
            this.setFocus(t);
        }

        /**
         * Show info that is obtained from the Google sheet.
         */
        private showInfo(spreadsheet: ISpreadsheetRow[]) {
            var index = 1;
            spreadsheet.forEach((row) => {
                //console.log('Row ' + index++);
                for (var header in row) {
                    if (!row.hasOwnProperty(header)) continue;
                    //console.log(header + ': ' + row[header]);
                }
            });
        }

    }
}