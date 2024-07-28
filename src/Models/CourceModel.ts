

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
    coursePerformance?:string[];
    ageLimit:string;
    courseCountry:string;
    coursesSold?:number;
}

export type {CourseModel };