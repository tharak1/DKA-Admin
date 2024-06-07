interface PerformanceModel{
    type:string;
    value?:string;
}

interface CourseModel{
    id?:string;
    category?:string;
    courseName?:string;
    description?:string;
    online?:boolean;
    offline?:boolean;
    sessions?:string[];
    price?:string;
    image?:string;
    showActions?:boolean;
    coursePerformance?:PerformanceModel[]
}

export type {CourseModel,PerformanceModel};