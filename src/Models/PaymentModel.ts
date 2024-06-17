interface Payment {
    paymentId: string;
    studentId: string;
    studentName: string;
    courseId: string;
    courseName: string;
    courseImageUrl: string;
    courseAmount: number;
    courseType: string;
    courseSession: string;
    branch: string;
    parentName: string;
    parentPhoneNo: string;
    email: string;
    date: string;
    status:string;
    endDate:string;

  }

  export default Payment;