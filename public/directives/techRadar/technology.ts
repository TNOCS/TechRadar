module TechRadar {
    export class Technology {
        constructor(
            public category    : string,
            public thumbnail   : string,
            public timePeriod  : string,
            public relativeTime: number,
            public shortTitle  : string,
            public title       : string,
            public subTitle    : string,
            public text        : string,
            public media       : string) {}
    }

    // export interface ITechnologies extends Array<Technology> {
    //
    // }

}
