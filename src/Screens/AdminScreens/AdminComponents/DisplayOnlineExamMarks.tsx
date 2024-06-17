import React from 'react'

interface DisplayOnlineExamMarksProps{
    stuMarks:CreateQuestionPaperPerformance;
}

const DisplayOnlineExamMarks:React.FC<DisplayOnlineExamMarksProps> = ({stuMarks}) => {
  return (
    <div className='w-full border-b-2'>
      <div className='flex flex-col items-start'>
        <h2>Name : {stuMarks.studentName}</h2>
        <h2>ID : {stuMarks.studentId}</h2>
      </div>
      <div>
        <p>Answered correctly: {stuMarks.correctAnswers}</p>
      </div>
      <div>
        <p>Answered Incorrectly: {stuMarks.incorrectAnswers}</p>
      </div>
      <div>
        <p>Not Answered: {stuMarks.unanswered}</p>
      </div>
      <div>
        <p>Marks: {stuMarks.marksObtained}</p>
      </div>
    </div>
  )
}

export default DisplayOnlineExamMarks
