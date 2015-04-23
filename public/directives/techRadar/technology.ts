module TechRadar {
    export class Technology {
        constructor(
            public id : number,
            public priority : number,
            public category      : string,
            public thumbnail     : string,
            public timePeriod    : string,
            public relativeRadius: number,
            public relativeAngle : number,
            public shortTitle    : string,
            public title         : string,
            public subTitle      : string,
            public text          : string,
            public media         : string) {}
    }
}
