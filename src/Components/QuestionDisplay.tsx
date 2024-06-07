import React, { useState, useEffect } from 'react';
import { Questions } from '../Models/ExamModel';

// interface Question {
//   questionType: string;
//   question: string;
//   options: string[];
//   correctAnswer: number[];
//   points: number;
//   visited?: boolean;
//   answered?: boolean;
//   optionsSelected?: number[];
// }

interface QuestionDisplayProps {
  questionIndex: number;
  question: Questions;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ questionIndex, question }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    if (question.optionsSelected && question.optionsSelected.length > 0) {
      setSelectedOption(question.optionsSelected[0]);
      question.visited = true;
    }
  }, [question]);

  const handleOptionChange = (index: number) => {
    setSelectedOption(index);

    question.answered = true;
  };

  return (
    <div >
      <div className="flex flex-col">
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-semibold mr-3">{`Question ${questionIndex + 1}`}</h2>
          <span className="bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full">
            {question.questionType}
          </span>
        </div>
        <span className="w-full border-t-2 mb-2"></span>
      </div>
      <div>

        {
          question.questionFormat === 'image'?(
            <>
            <img src={question.question} alt="question" className='mb-2'/>
            <h2 className='mb-3'>Select the correct option below</h2>
            </>
          ):(
            <p className="text-lg mb-4">{question.question}</p>
          )
        }

        <form className="space-y-3">
          {question.options.map((option, index) => (
            <div key={`option${questionIndex}${index}`}>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={`Question ${questionIndex + 1}`}
                  id={`option${questionIndex}${index}`}
                  value={question.questionType==='multi Correct question ans image' || question.questionType ==='single Correct question ans image'? option.image:option.value}
                  className="form-radio h-4 w-4 text-blue-600"
                  checked={selectedOption === index}
                  onChange={() => handleOptionChange(index)}
                />
                {
                  question.questionType==='multi Correct question ans image' || question.questionType ==='single Correct question ans image'?(
                    <img src={option.image} alt="" />
                  ):(
                    <span>{option.value}</span>
                  )
                }
              </label>
            </div>
          ))}
        </form>
      </div>
    </div>
  );
};

export default QuestionDisplay;
