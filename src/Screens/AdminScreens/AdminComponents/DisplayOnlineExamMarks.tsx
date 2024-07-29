import React from 'react';
import { useNavigate } from 'react-router-dom';

type StudentPerformance = CreateQuestionPaperPerformance | UploadQuestionPaperPerformance;

interface DisplayOnlineExamMarksProps {
  stuMarks: StudentPerformance;
  QpId:string;
  noOfQuestions:number;
  course:string;
}

const DisplayOnlineExamMarks: React.FC<DisplayOnlineExamMarksProps> = ({ stuMarks,QpId,noOfQuestions,course }) => {
  console.log(noOfQuestions);
  
  const isCreateQuestionPaperPerformance = (
    stuMarks: StudentPerformance
  ): stuMarks is CreateQuestionPaperPerformance => {
    return (stuMarks as CreateQuestionPaperPerformance).correctAnswers !== undefined;
  };
  const navigate = useNavigate();

  return (
    <div className="w-full border-b-2 grid grid-cols-6 p-2">
      <div className="flex flex-col items-start col-span-2">
        <h2>Name: {stuMarks.studentName}</h2>
        <h2>ID: {stuMarks.studentId}</h2>
      </div>
      {isCreateQuestionPaperPerformance(stuMarks) ? (
        <>
          <div className="flex flex-col items-center col-span-1 justify-center">
            <p className='text-green-500 text-xl font-bold'>{stuMarks.correctAnswers}</p>
          </div>
          <div className="flex flex-col items-center justify-center col-span-1">
            <p className='text-red-500 text-xl font-bold'>{stuMarks.incorrectAnswers}</p>
          </div>
          <div className="flex flex-col items-center justify-center col-span-1">
            <p className='text-gray-500 text-xl font-bold'>{stuMarks.unanswered}</p>
          </div>
          <div className="flex flex-col items-center justify-center col-span-1">
            <p className='text-xl font-bold'>{stuMarks.marksObtained}</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center col-span-1">
            <p className={`px-4 py-1 bg-opacity-50 text-black rounded-md ${stuMarks.evaluated ?"bg-green-400 ":"bg bg-red-400"} `}>{stuMarks.evaluated ? 'Yes' : 'No'}</p>
          </div>
          <div className="flex flex-col items-center justify-center col-span-1">
            <p className='text-green-500 text-xl font-bold'>{stuMarks.marksObtained}</p>
          </div>
          <div className="flex flex-col items-center justify-center col-span-1">
            <p className='text-green-500 text-xl font-bold'>{stuMarks.uploadedPagesUrl.length}</p>
          </div>
          <div className="flex flex-col items-center justify-center max-sm:justify-end max-sm:items-start col-span-1">
            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 max-sm:px-2 py-2.5 max-sm:py-2 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" 
            onClick={()=>{navigate('/admin/online_exam_evaluation', { state: { stuSubmission:stuMarks ,QpId:QpId,noOfQuestions:noOfQuestions,course} });}}
            >{stuMarks.evaluated ? 'Re Evaluate' : 'Evaluate'}</button>
          </div>
        </>
      )}
    </div>
  );
};

export default DisplayOnlineExamMarks;
