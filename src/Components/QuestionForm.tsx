// import React, { useState } from 'react';
// import DeleteIcon from '@mui/icons-material/Delete';
// import uploadImage from '../hooks/UploadImage';
// import { Questions } from '../Models/ExamModel';

// interface QuestionFormProps {
//     index: number;
//     question:Questions;
//     updateQuestion: (index: number, updatedQuestion: any) => void;
//     deleteQuestion: (index: number) => void;
// }

// const QuestionForm: React.FC<QuestionFormProps> = ({ index, updateQuestion, deleteQuestion ,question}) => {
//     const [drafting,setDrafting] = useState<boolean>(false);
//     const [questionType, setQuestionType] = useState<string>('single Correct');
//     const [questionFormat, setQuestionFormat] = useState<string>('text');
//     const [questionText, setQuestionText] = useState<string>('');
//     const [questionImage, setQuestionImage] = useState<File | null>(null);
//     const [questionImagePreview, setQuestionImagePreview] = useState<string | null>(null);
//     const [options, setOptions] = useState<{ id: number; value: string; image?: File; imagePreview?: string }[]>([{ id: 0, value: '' }]);

//     const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         setQuestionType(event.target.value);
//     };

//     const handleFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
//         setQuestionFormat(event.target.value);
//         setQuestionText('');
//         setQuestionImage(null);
//         setQuestionImagePreview(null);
//     };

//     const handleAddOption = () => {
//         const newId = options.length;
//         const newOption = { id: newId, value: '' };
//         setOptions([...options, newOption]);
//     };

//     const handleOptionChange = (id: number, value: string) => {
//         const updatedOptions = options.map(option => (option.id === id ? { ...option, value } : option));
//         setOptions(updatedOptions);
//     };

//     const handleOptionImageChange = (id: number, image: File) => {
//         const updatedOptions = options.map(option => (option.id === id ? { ...option, image, imagePreview: URL.createObjectURL(image) } : option));
//         setOptions(updatedOptions);
//     };

//     const handleDeleteOption = (id: number) => {
//         const updatedOptions = options.filter(option => option.id !== id);
//         setOptions(updatedOptions);
//     };

//     const handleDeleteOptionImage = (id: number) => {
//         const updatedOptions = options.map(option => (option.id === id ? { ...option, image: undefined, imagePreview: undefined } : option));
//         setOptions(updatedOptions);
//     };

//     const handleQuestionImageChange = (image: File | null) => {
//         setQuestionImage(image);
//         setQuestionImagePreview(image ? URL.createObjectURL(image) : null);
//     };

//     const handleDeleteQuestionImage = () => {
//         setQuestionImage(null);
//         setQuestionImagePreview(null);
//     };

//     const handleCaptureData = async () => {
//         const questionObject = await generateQuestionObject();
//         updateQuestion(index, questionObject);
//         setDrafting(false);

//     };

//     const handleDeleteData = () => {
        
//         deleteQuestion(index);
//     };

//     const renderOptions = () => {
//         if (questionType === 'single Correct' || questionType === 'multi Correct') {
//             return (
//                 <div className="space-y-4">
//                     {options.map(option => (
//                         <div className="flex items-center" key={option.id}>
//                             {questionType === 'multi Correct' ? (
//                                 <input type="checkbox" name="options" className="mr-2" />
//                             ) : (
//                                 <input type="radio" name="options" className="mr-2" />
//                             )}
//                             <input
//                                 type="text"
//                                 placeholder={`Option ${option.id + 1}`}
//                                 className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
//                                 value={option.value}
//                                 onChange={(e) => handleOptionChange(option.id, e.target.value)}
//                             />
//                             <button className="ml-2 text-red-500" onClick={() => handleDeleteOption(option.id)}><DeleteIcon /></button>
//                         </div>
//                     ))}
//                     <button className="bg-green-500 px-4 py-1 rounded-md" onClick={handleAddOption}>
//                         Add Option
//                     </button>
//                 </div>
//             );
//         } else if (questionType === 'numerical' || questionType === 'short answer') {
//             return (
//                 <div className="space-y-4">
//                     <div className="flex items-center">
//                         <input type="text" placeholder="Enter your answer" className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500" />
//                     </div>
//                 </div>
//             );
//         } else if (questionType === 'single Correct question ans image' || questionType === 'multi Correct question ans image') {
//             return (
//                 <div className="space-y-4">
//                     {options.map(option => (
//                         <div className="flex items-center" key={option.id}>
//                             {questionType === 'multi Correct question ans image' ? (
//                                 <input type="checkbox" name={`options-${index}`} className="mr-2" />
//                             ) : (
//                                 <input type="radio" name={`options-${index}`} className="mr-2" />
//                             )}
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={(e) => handleOptionImageChange(option.id, e.target.files?.[0]!)}
//                                 className="ml-2"
//                             />
//                             {option.imagePreview && (
//                                 <div className="relative ml-4">
//                                     <img src={option.imagePreview} alt={`Option ${option.id + 1}`} className="w-20 h-20 object-cover" />
//                                     <button
//                                         className="absolute top-0 right-0 text-red-500 bg-white rounded-full p-1"
//                                         onClick={() => handleDeleteOptionImage(option.id)}
//                                     >
//                                         <DeleteIcon />
//                                     </button>
//                                 </div>
//                             )}
//                             <button className="ml-2 text-red-500" onClick={() => handleDeleteOption(option.id)}><DeleteIcon /></button>
//                         </div>
//                     ))}
//                     <button className="bg-green-500 px-4 py-1 rounded-md" onClick={handleAddOption}>
//                         Add Option
//                     </button>
//                 </div>
//             );
//         }
//     };

//     const generateQuestionObject = async () => {
//         setDrafting(true);
//         const answerKey = (document.getElementById(`ans_key${index}`) as HTMLInputElement)?.value.trim();
//         const points = (document.getElementById(`points${index}`) as HTMLInputElement)?.value.trim();

//         const correctAnswer = answerKey.split(",").map(item => {
//             if (questionType === "numerical") {
//                 return parseInt(item);
//             }
//             return parseInt(item.trim()) - 1;
//         });

//         let question = null;
//         if (questionFormat === 'text') {
//             question = questionText; 
//         } else if (questionFormat === 'image') {
//             question = questionImage ? await uploadImage(questionImage, `question-${index}`, "questions") : null;
//         }

//         const optionPromises = options.map(async option => {
//             if (questionType === 'single Correct question ans image' || questionType === 'multi Correct question ans image') {
//                 return {
//                     image: option.image ? await uploadImage(option.image, `option-${index}-${option.id}`, "options") : undefined
//                 };
//             } else {
//                 return { value: option.value };
//             }
//         });

//         const resolvedOptions = await Promise.all(optionPromises);

//         return {
//             questionType,
//             questionFormat,
//             question,
//             options: resolvedOptions,
//             correctAnswer,
//             points: parseInt(points)
//         };
//     };

//     return (
//         <div id='question-form' className="bg-white rounded-lg shadow p-6 w-full m-4 border-2">
//             <div className="flex flex-col justify-between items-center mb-4">
//                 <div className='w-full flex flex-row items-center'>
//                     <label htmlFor="Question-type" className="block mb-2 text-sm font-medium text-gray-900 ">Question Type : </label>
//                     <select value={questionFormat} onChange={handleFormatChange} className="ml-4 mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 p-2.5">
//                         <option value="text">Text</option>
//                         <option value="image">Image</option>
//                     </select>
//                 </div>
//                 <div className="w-full flex flex-row">
//                     {questionFormat === 'text' ? (
//                         <input
//                             type="text"
//                             id={`question${index}`}
//                             placeholder="Untitled Question"
//                             className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
//                             value={questionText}
//                             onChange={(e) => setQuestionText(e.target.value)}
//                         />
//                     ) : (
//                         <div className="flex items-center w-full">
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={(e) => handleQuestionImageChange(e.target.files?.[0] || null)}
//                                 className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
//                             />
//                             {questionImagePreview && (
//                                 <div className="relative ml-4">
//                                     <img src={questionImagePreview} alt="Question" className="w-20 h-20 object-cover" />
//                                     <button
//                                         className="absolute top-0 right-0 text-red-500 bg-white rounded-full p-1"
//                                         onClick={handleDeleteQuestionImage}
//                                     >
//                                         <DeleteIcon />
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     )}
//                     <select id="questionType" value={questionType} onChange={handleTypeChange} className="ml-4 max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
//                         <option value="single Correct">Single Correct</option>
//                         <option value="multi Correct">Multi Correct</option>
//                         <option value="numerical">Numerical</option>
//                         <option value="short answer">Short Answer</option>
//                         <option value="single Correct question ans image">Single Correct Question with Image</option>
//                         <option value="multi Correct question ans image">Multi Correct Question with Image</option>
//                     </select>
//                 </div>
//             </div>
//             {renderOptions()}
//             <div className="flex justify-between items-center mt-4">
//                 <div>
//                     <label htmlFor="ans_key" className="block mb-2 text-sm font-medium text-gray-900 ">Answer key</label>
//                     <input type="text" id={`ans_key${index}`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="option or ans" required />
//                 </div>

//                 <div>
//                     <label htmlFor="points" className="block mb-2 text-sm font-medium text-gray-900 ">Points</label>
//                     <input type="text" id={`points${index}`} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " placeholder="ex.1,2,.." required />
//                 </div>
//             </div>
//             <div className="flex justify-end mt-3 w-full">
//                 <button className="bg-red-400 px-4 py-1 rounded-md mr-3" onClick={handleDeleteData}>
//                     Delete
//                 </button>
//                 <button className="bg-slate-500 px-4 py-1 rounded-md" onClick={handleCaptureData} disabled={drafting} >
//                     {drafting?"Drafting...":"Draft it"}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default QuestionForm;


import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import uploadImage from '../hooks/UploadImage';
import { Questions } from '../Models/ExamModel';

interface QuestionFormProps {
    index: number;
    question: Questions;
    updateQuestion: (index: number, updatedQuestion: any) => void;
    deleteQuestion: (index: number) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ index, question, updateQuestion, deleteQuestion }) => {
    const [drafting, setDrafting] = useState<boolean>(false);
    const [questionType, setQuestionType] = useState<string>(question.questionType || 'single Correct');
    const [questionFormat, setQuestionFormat] = useState<string>(question.questionFormat || 'text');
    const [questionText, setQuestionText] = useState<string>(questionFormat === 'text' ? question.question : '');
    const [questionImage, setQuestionImage] = useState<File | null>(null);
    const [questionImagePreview, setQuestionImagePreview] = useState<string | null>(questionFormat === 'image' ? question.question : null);
    const [options, setOptions] = useState<{ id: number; value?: string; image?: File; imagePreview?: string }[]>([]);

    useEffect(() => {
        const initialOptions = question.options.map((option, id) => ({
            id,
            value: option.value || '',
            image: undefined,
            imagePreview: option.image || undefined
        }));
        setOptions(initialOptions);
    }, [question]);

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setQuestionType(event.target.value);
    };

    const handleFormatChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setQuestionFormat(event.target.value);
        setQuestionText('');
        setQuestionImage(null);
        setQuestionImagePreview(null);
    };

    const handleAddOption = () => {
        const newId = options.length;
        const newOption = { id: newId, value: '' };
        setOptions([...options, newOption]);
    };

    const handleOptionChange = (id: number, value: string) => {
        const updatedOptions = options.map(option => (option.id === id ? { ...option, value } : option));
        setOptions(updatedOptions);
    };

    const handleOptionImageChange = (id: number, image: File) => {
        const updatedOptions = options.map(option => (option.id === id ? { ...option, image, imagePreview: URL.createObjectURL(image) } : option));
        setOptions(updatedOptions);
    };

    const handleDeleteOption = (id: number) => {
        const updatedOptions = options.filter(option => option.id !== id);
        setOptions(updatedOptions);
    };

    const handleDeleteOptionImage = (id: number) => {
        const updatedOptions = options.map(option => (option.id === id ? { ...option, image: undefined, imagePreview: undefined } : option));
        setOptions(updatedOptions);
    };

    const handleQuestionImageChange = (image: File | null) => {
        setQuestionImage(image);
        setQuestionImagePreview(image ? URL.createObjectURL(image) : null);
    };

    const handleDeleteQuestionImage = () => {
        setQuestionImage(null);
        setQuestionImagePreview(null);
    };

    const handleCaptureData = async () => {
        const questionObject = await generateQuestionObject();
        updateQuestion(index, questionObject);
        setDrafting(false);
    };

    const handleDeleteData = () => {
        deleteQuestion(index);
    };

    const renderOptions = () => {
        if (questionType === 'single Correct' || questionType === 'multi Correct') {
            return (
                <div className="space-y-4">
                    {options.map(option => (
                        <div className="flex items-center" key={option.id}>
                            {questionType === 'multi Correct' ? (
                                <input type="checkbox" name="options" className="mr-2" />
                            ) : (
                                <input type="radio" name="options" className="mr-2" />
                            )}
                            <input
                                type="text"
                                placeholder={`Option ${option.id + 1}`}
                                className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-gray-200"
                                value={option.value}
                                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                            />
                            <button className="ml-2 text-red-500" onClick={() => handleDeleteOption(option.id)}><DeleteIcon /></button>
                        </div>
                    ))}
                    <button className="bg-green-500 px-4 py-1 rounded-md" onClick={handleAddOption}>
                        Add Option
                    </button>
                </div>
            );
        } else if (questionType === 'numerical' || questionType === 'short answer') {
            return (
                <div className="space-y-4">
                    <div className="flex items-center">
                        <input type="text" placeholder="Enter your answer" className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 dark:bg-slate-700 dark:text-gray-200" />
                    </div>
                </div>
            );
        } else if (questionType === 'single Correct question ans image' || questionType === 'multi Correct question ans image') {
            return (
                <div className="space-y-4">
                    {options.map(option => (
                        <div className="flex items-center" key={option.id}>
                            {questionType === 'multi Correct question ans image' ? (
                                <input type="checkbox" name={`options-${index}`} className="mr-2" />
                            ) : (
                                <input type="radio" name={`options-${index}`} className="mr-2" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleOptionImageChange(option.id, e.target.files?.[0]!)}
                                className="ml-2"
                            />
                            {option.imagePreview && (
                                <div className="relative ml-4">
                                    <img src={option.imagePreview} alt={`Option ${option.id + 1}`} className="w-20 h-20 object-cover" />
                                    <button
                                        className="absolute top-0 right-0 text-red-500 bg-white rounded-full p-1"
                                        onClick={() => handleDeleteOptionImage(option.id)}
                                    >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            )}
                            <button className="ml-2 text-red-500" onClick={() => handleDeleteOption(option.id)}><DeleteIcon /></button>
                        </div>
                    ))}
                    <button className="bg-green-500 px-4 py-1 rounded-md" onClick={handleAddOption}>
                        Add Option
                    </button>
                </div>
            );
        }
    };

    const generateQuestionObject = async () => {
        setDrafting(true);
        const answerKey = (document.getElementById(`ans_key${index}`) as HTMLInputElement)?.value.trim();
        const points = (document.getElementById(`points${index}`) as HTMLInputElement)?.value.trim();

        const correctAnswer = answerKey.split(",").map(item => {
            if (questionType === "numerical") {
                return parseInt(item);
            }
            return parseInt(item.trim()) - 1;
        });

        let questionContent = null;
        if (questionFormat === 'text') {
            questionContent = questionText; 
        } else if (questionFormat === 'image') {
            questionContent = questionImage ? await uploadImage(questionImage, `question-${index}`, "questions") : null;
        }

        const optionPromises = options.map(async option => {
            if (questionType === 'single Correct question ans image' || questionType === 'multi Correct question ans image') {
                return {
                    image: option.image ? await uploadImage(option.image, `option-${index}-${option.id}`, "options") : undefined
                };
            } else {
                return { value: option.value };
            }
        });

        const resolvedOptions = await Promise.all(optionPromises);

        return {
            questionType,
            questionFormat,
            question: questionContent,
            options: resolvedOptions,
            correctAnswer,
            points: parseInt(points)
        };
    };

    return (
        <div id='question-form' className="bg-white rounded-lg shadow p-6 w-full sm:m-4 border-2 dark:bg-slate-700 dark:border-slate-500 ">
            <div className="flex flex-col justify-between items-center mb-4">
                <div className='w-full flex flex-row items-center'>
                    <label htmlFor="Question-type" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300 ">Question Type : </label>
                    <select value={questionFormat} onChange={handleFormatChange} className="ml-4 mb-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-1/3 p-2.5 dark:bg-slate-600 dark:text-gray-200">
                        <option value="text">Text</option>
                        <option value="image">Image</option>
                    </select>
                </div>
                <div className="w-full flex flex-row max-sm:flex-col">
                    {questionFormat === 'text' ? (
                        <input
                            type="text"
                            id={`question${index}`}
                            placeholder="Untitled Question"
                            className="w-full border-b dark:bg-slate-700 dark:text-gray-200 border-gray-300 focus:outline-none focus:border-blue-500"
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                        />
                    ) : (
                        <div className="flex items-center w-full">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleQuestionImageChange(e.target.files?.[0] || null)}
                                className="w-full border-b border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                            {questionImagePreview && (
                                <div className="relative ml-4">
                                    <img src={questionImagePreview} alt="Question" className="w-20 h-20 object-cover" />
                                    <button
                                        className="absolute top-0 right-0 text-red-500 bg-white rounded-full p-1"
                                        onClick={handleDeleteQuestionImage}
                                    >
                                        <DeleteIcon />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                    <select id="questionType" value={questionType} onChange={handleTypeChange} className="sm:ml-4 max-sm:mt-3 max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-600 dark:text-gray-200">
                        <option value="single Correct">Single Correct</option>
                        <option value="multi Correct">Multi Correct</option>
                        <option value="numerical">Numerical</option>
                        <option value="short answer">Short Answer</option>
                        <option value="single Correct question ans image">Single Correct Question with Image</option>
                        <option value="multi Correct question ans image">Multi Correct Question with Image</option>
                    </select>
                </div>
            </div>
            {renderOptions()}
            <div className="flex justify-between items-center mt-4">
                <div>
                    <label htmlFor="ans_key" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Answer key</label>
                    <input type="text" id={`ans_key${index}`} defaultValue={question.correctAnswer.join(", ")} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-600 dark:text-gray-200" placeholder="option or ans" required />
                </div>

                <div>
                    <label htmlFor="points" className="block mb-2  text-sm font-medium text-gray-900 dark:text-gray-300">Points</label>
                    <input type="text" id={`points${index}`} defaultValue={question.points.toString()} className="bg-gray-50 border max-sm:ml-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-slate-600 dark:text-gray-200" placeholder="ex.1,2,.." required />
                </div>
            </div>
            <div className="flex justify-end mt-3 w-full">
                <button className="bg-red-400 px-4 py-1 rounded-md mr-3" onClick={handleDeleteData}>
                    Delete
                </button>
                <button className="bg-slate-500 px-4 py-1 rounded-md" onClick={handleCaptureData} disabled={drafting} >
                    {drafting ? "Drafting..." : "Draft it"}
                </button>
            </div>
        </div>
    );
};

export default QuestionForm;
