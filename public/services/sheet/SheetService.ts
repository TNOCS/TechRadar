module csComp.Services {
    declare var Tabletop;

    export  interface ISpreadsheetRow {
        Category:      string;
        Relevance:      number;
        Thumbnail:     string;
        TimeCategory:  string;
        DeltaTime:     string | number;
        ShortTitle:    string;
        Title:         string;
        Text:          string;
        Subtitle:      string;
        ContentType:   string;
        Content:       string;
    }

    /**
     * An service wrapper around the Tabletop javascript library.
     * See: https://github.com/jsoma/tabletop
     */
    export class SpreadsheetService {
        public technologies: TechRadar.Technology[];

        /** Load the technologies */
        public loadTechnologies(url: string, callback: () => void) {
            this.loadSheet(url, (spreadsheet: ISpreadsheetRow[]) => {
                this.technologies = [];
                var id = 1;
                var page = 0;
                var technology;
                spreadsheet.forEach((row) => {
                    // check if it's part of previous
                    if (row.Category !== '') {

                        //console.log(row.Category); 
                        //console.log(row.Title);
                        var deltaTimeString = row.DeltaTime;
                        var priority = parseInt(row.Relevance.toString(), 10);
                        var color;
                        switch (priority) {
                            case 1: color = '#F39092'; break;
                            case 2: color = '#F5DC8F'; break;
                            case 3: color = '#9EBACB'; break;
                            case 4: color = '#DFE0DC'; break;
                            default: color = 'white'; break;
                        }
                        var deltaTime = 0;
                        if (typeof deltaTimeString === 'string') {
                            deltaTime = +deltaTimeString.replace(',', '.');
                        } else {
                            deltaTime = deltaTimeString;
                        }
                        page = 0;
                        technology = new TechRadar.Technology(
                            id++,
                            priority,
                            row.Category,
                            row.Thumbnail,
                            row.TimeCategory,
                            deltaTime,
                            row.ShortTitle,
                            row.Title,
                            row.Subtitle,
                            row.Text,
                            color);
                        this.technologies.push(technology);
                    }

                    if (row.ContentType === '') row.ContentType = 'markdown';
                    if (row.Content !== '') {
                        var c = new TechRadar.Content(page++, row.ContentType, row.Content, row.Subtitle);
                        if (c.contentType.toLowerCase() === 'youtube') {
                            c.videoUrl = c.content.indexOf('http') > 0
                                ? c.content
                                : 'http://www.youtube.com/embed/' + c.content + '?rel=0&autoplay=1';
                            //console.log(c.videoUrl);
                        };
                        technology.content.push(c);
                    }
                });
                callback();
            });
        }

        /**
         * Load a worksheet.
         */
         private loadSheet(url: string, callback: (sheet: ISpreadsheetRow[]) => void) {
            console.log('Initializing tabletop');
            Tabletop.init({
                key         : url,
                callback    : callback,
                simpleSheet : true
            });
        }

    }

}
