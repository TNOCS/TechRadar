module csComp.Services {
    declare var Tabletop;

    export class SheetService {
        private public_spreadsheet_url = 'https://docs.google.com/spreadsheets/d/1Q21QWlx3GqKjaLLwaq5fJb0eFwXouDMjk_cdideCHMk/pubhtml?gid=1695252245&single=true';

        constructor() {
            this.loadSheet(this.public_spreadsheet_url);
        }

        //private loadSheet(url: string, callback: (data: Object) => {}) {
        /**
         * Load a worksheet.
         */
        private loadSheet(url: string) {
            console.log('Initializing tabletop');
            Tabletop.init({
                key         : url,
                callback    : (data: Object) => this.showInfo(data),
                simpleSheet : true
            });
        }

        /**
         * show info that is obtained from the Google sheet.
         */
        private showInfo(data: Object) {
            //alert(data);
            var table = JSON.stringify(data);
            // this.table = table;
            // if (this.$scope.$$phase != '$apply' && this.$scope.$$phase != '$digest') { this.$scope.$apply(); }

            console.log(table);
        }

    }

}
