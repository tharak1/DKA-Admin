interface EmployeeModel {
    id?:string;
    uid?:string;
    isAdmin:boolean;
    employeeName: string;
    phone: string;
    email: string;
    address: string;
    qualifications: string;
    designation: string;
    coursesTaught: string[];
    profileImage: string;
    password: string;
    confirmPassword: string;
}

interface cred{
    email:string;
    password:string;
}

export type {EmployeeModel,cred};