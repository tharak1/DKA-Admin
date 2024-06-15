import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingScreen from '../../Components/LoadingScreen';
import { Questions } from '../../Models/ExamModel';

interface ResultsScreenProps {
    answers: Questions[];
}

const ResultsScreen: React.FC = () => {
    const location = useLocation();
    const { answers } = location.state as ResultsScreenProps;

    const [totalMarks, setTotalMarks] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

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
        return <LoadingScreen />;
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
                        <h3 className="text-lg font-semibold mb-2">{question.question}</h3>
                        <div>
                            {question.options.map((option, idx) => (
                                <div key={idx} className="flex items-center mb-1">
                                    <input
                                        type="checkbox"
                                        checked={question.optionsSelected?.includes(idx)}
                                        readOnly
                                        className="mr-2"
                                    />
                                    <label className="text-gray-700">{option.value}</label>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Correct Answer(s): {question.correctAnswer.map(ans => question.options[ans]).join(', ')}
                            </p>
                        </div>
                        <div className="mt-2">
                            <p className={`text-sm ${JSON.stringify(question.optionsSelected?.sort()) === JSON.stringify(question.correctAnswer.sort()) ? 'text-green-500' : 'text-red-500'}`}>
                                {JSON.stringify(question.optionsSelected?.sort()) === JSON.stringify(question.correctAnswer.sort()) ? 'Correct' : 'Incorrect'}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResultsScreen;
