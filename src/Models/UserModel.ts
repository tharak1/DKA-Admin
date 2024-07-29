interface UserModel{
    id:string;
    name: string;
    fatherName: string;
    motherName: string;
    dob: string;
    gender: string;
    address: string;
    contactNo: string;
    schoolName: string;
    class: string;
    hearAbout: string;
    password: string;
    imageUrl:string;
    registeredCourses:MyCourseModal[];
    email:string;
    country:string;
    feedback?:string;
}

interface MyCourseModal{
    courseId: string;
    courseName:string;
    boughtDate:string;
    paymentId:string;
    status?:string;
    courseType: "offline" | "online";
    courseSession: string;
    branch: string;
    endDate:string;
    onlineExamExempt?:boolean;

}

interface GuardianModel{
    GuardianId:string;
    registeredID:string[];
}

interface FilteredCourse extends MyCourseModal {
    id: string;
    name: string;
}

export type {UserModel,GuardianModel,MyCourseModal,FilteredCourse}