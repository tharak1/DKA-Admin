import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Questions } from '../../Models/ExamModel';

interface ResultsScreenProps {
    answers: Questions[];
}

const ResultsScreen: React.FC = () => {
    const location = useLocation();
    const { answers } = location.state as ResultsScreenProps;

    const [totalMarks, setTotalMarks] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    const Homeonclick = () => {
        // window.location.replace("http://localhost:5174/admin/manage_questionPaper");
        window.location.replace("https://dka-admin.vercel.app/manage_questionPaper");
    }

    useEffect(() => {
        calculateMarks();
    }, [answers]);

    const calculateMarks = () => {
        setLoading(true);
        let marks = 0;
        answers.forEach(question => {
            if (
                question.answered &&
                question.optionsSelected &&
                JSON.stringify(question.optionsSelected.sort()) === JSON.stringify(question.correctAnswer.sort())
            ) {
                marks += question.points;
            }
        });
        setTotalMarks(marks);
        setLoading(false);
    };

    if (loading) {
        return         <div className="w-full h-full flex justify-center items-center mx-auto p-6 rounded shadow-md lg:px-24">
        <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
      </div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Results</h1>
            <div className="mb-4">
                <h2 className="text-xl">Total Marks: {totalMarks}</h2>
            </div>
            <div>
                {answers.map((question, index) => (
                    <div key={index} className="mb-6">
                        {
                            answers[index].questionFormat === 'image'?(
                                <img src={question.question} alt="question" className="mb-2" />
                            ):(
                                <h3 className="text-lg font-semibold mb-2">{question.question}</h3>
                            )
                        }
                        <div>
                            {question.options.map((option, idx) => (
                                <div key={idx} className="flex items-center mb-1">
                                    <input
                                        type="checkbox"
                                        checked={question.optionsSelected?.includes(idx)}
                                        readOnly
                                        className="mr-2"
                                    />
                                    {
                                        answers[index].questionType.includes("image")?(
                                            <img src={option.image} alt="" />
                                        ):(
                                            <label className="text-gray-700">{option.value}</label>
                                        )
                                    }
                                </div>
                            ))}
                        </div>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Correct Answer(s): {question.correctAnswer.map(ans => answers[index].questionType==="numerical"?ans:ans+1).join(', ')}
                            </p>
                        </div>
                        <div className="mt-2">
                            {
                                answers[index].optionsSelected?.length === 0 ?(
                                    <p>Unanswered</p>
                                ):(
                                    <p className={`text-sm ${JSON.stringify(question.optionsSelected?.sort()) === JSON.stringify(question.correctAnswer.sort()) ? 'text-green-500' : 'text-red-500'}`}>
                                        {JSON.stringify(question.optionsSelected?.sort()) === JSON.stringify(question.correctAnswer.sort()) ? 'Correct' : 'Incorrect'}
                                    </p>
                                )
                            }
                        </div>
                    </div>
                ))}
            </div>
            <div className='w-full flex justify-center items-center'>
                
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={Homeonclick}>Home</button>

            </div>
        </div>
    );
};

export default ResultsScreen;
