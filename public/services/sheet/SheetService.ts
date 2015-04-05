module csComp.Services {
    declare var Tabletop;

    export  interface ISpreadsheetRow {
        Category:                 string,
        Thumbnail:                string,
        TimeCategory:             string,
        RelativeTimeLocation:     string,
        RelativeCategoryLocation: string,
        ShortTitle:               string,
        Title:                    string,
        Text:                     string,
        SubTitle:                 string,
        Media:                    string,
        Description:              string
        //[header:                string]: string
    }

    /**
     * An service wrapper around the Tabletop javascript library.
     * See: https://github.com/jsoma/tabletop
     */
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
