module csComp.Services {
    declare var Tabletop;

    export  interface ISpreadsheetRow {
        [header: string]: string
    }

    export class SpreadsheetService {
        /**
         * Load a worksheet.
         */
         public loadSheet(url: string, callback: (sheet: ISpreadsheetRow[]) => void) {
            console.log('Initializing tabletop');
            Tabletop.init({
                key         : url,
                callback    : callback,
                simpleSheet : true
            });
        }

    }

}
