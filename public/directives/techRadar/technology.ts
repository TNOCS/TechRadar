module TechRadar {

   export class Content{

     public isSelected  : boolean;
     public previewImage : string;

     constructor(
       public id          : number,
       public contentType : string,
       public content     : string

       ){

     }
   }

    export class Technology {

       public content       : Content[];

        constructor(
            public id : number,
            public priority : number,
            public category      : string,
            public thumbnail     : string,
            public timePeriod    : string,
            public relativeRadius: number,
            public shortTitle    : string,
            public title         : string,
            public subTitle      : string,
            public text          : string,
            public media         : string,
            public color         : string = 'white',
            public visible       : boolean = true,
            public focus         : boolean = false
            ) {
              this.content = [];
            }
    }
}
