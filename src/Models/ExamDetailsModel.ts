interface CreateQuestionPaperPerformance {
    correctAnswers: number;
    incorrectAnswers: number;
    marksObtained: number;
    studentId: string;
    studentName: string;
    unanswered: number;
  }
  
  interface UploadQuestionPaperPerformance {
    evaluated: boolean;
    marksObtained: number;
    studentId: string;
    studentName: string;
    uploadedPagesUrl: string[];
  }
  
  type StudentPerformance = CreateQuestionPaperPerformance | UploadQuestionPaperPerformance;
   
  interface ExamDetails {
    id:string;
    course: string;
    startDate: string;  
    startTime: string;  
    endDate: string;    
    endTime: string;    
    duration: number;
    totalMarks: number;
    examType: string;
    noOfQuestions: number;
    students: StudentPerformance[];
  }


  interface regStuByCourse{
    courseName:string,
    students:string[]
  }
  