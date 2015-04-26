module TechRadar {

   export class Content{

     constructor(
       contentType : string,
       data        : string){

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
            public relativeAngle: number,
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
