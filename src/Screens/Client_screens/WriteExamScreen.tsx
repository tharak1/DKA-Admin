import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Timer from '../../Components/Timer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import QuestionDisplay from '../../Components/QuestionDisplay';
import Modal from '../../Components/Modal';
import { QuestionPaper, Questions } from '../../Models/ExamModel';
import { useSelector } from 'react-redux';
import { GetTempQP } from '../../redux/QuestionPaperSlice';
import QuestionPaperDisplay from '../../Components/QuestionPaperDisplay';

const WriteExamScreen: React.FC = () => {
  const tempQP = useSelector(GetTempQP);
  const location = useLocation();
  const navigate = useNavigate();
  const [finalObj, setFinalObj] = useState<QuestionPaper | null>(null);
  const [notVisited, setNotVisited] = useState<number>(0);
  const [notAnswered, setNotAnswered] = useState<number>(0);
  const [processedQuestions, setProcessedQuestions] = useState<Questions[]>([]);
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [answered, setAnswered] = useState<number>(0);
  const [modal, setModal] = useState<boolean>(false);

  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);


  
      const id = queryParams.get('id');
      const foundObj = tempQP.find((obj: QuestionPaper) => obj.id === id);
      if (foundObj) {
        setFinalObj(foundObj);
      } else {
        console.error('Question paper not found');
        setLoading(false);
      }
      setLoading(false);
  }, [location.search, tempQP]);

  useEffect(() => {
    if (finalObj) {
      preProcessing();
    }
  }, [finalObj]);

  const preProcessing = () => {
    const newQuestions: Questions[] = finalObj!.questions.map((question: Questions) => ({
      ...question,
      visited: false,
      answered: false,
      optionsSelected: [],
    }));

    if (newQuestions.length > 0) {
      newQuestions[0].visited = true;
    }

    setProcessedQuestions(newQuestions);
    setNotVisited(newQuestions.length - 1);
    setNotAnswered(newQuestions.length);
    setLoading(false);
  };

  const handleNextQuestion = () => {
    if (questionIndex < processedQuestions.length - 1) {
      updateVisitStatus(questionIndex + 1);
      setQuestionIndex(questionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (questionIndex > 0) {
      updateVisitStatus(questionIndex - 1);
      setQuestionIndex(questionIndex - 1);
    }
  };

  const handleOntapSideBar = (index: number) => {
    updateVisitStatus(index);
    setQuestionIndex(index);
  };

  const handleSaveAndNextQuestion = () => {
    const isAnswered = (processedQuestions![questionIndex]!.optionsSelected!.length)>0 ?true:false;

    const updatedQuestions = [...processedQuestions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      visited: true,
      answered: isAnswered,
      optionsSelected: isAnswered ? processedQuestions[questionIndex].optionsSelected : [],
    };

    setProcessedQuestions(updatedQuestions);
    setAnswered(answered<processedQuestions.length?answered + (isAnswered ? 1 : 0):answered);
    setNotAnswered(answered<processedQuestions.length?notAnswered - (isAnswered ? 1 : 0):notAnswered );
    handleNextQuestion();
  };

  const updateVisitStatus = (index: number) => {
    if (!processedQuestions[index].visited) {
      const updatedQuestions = [...processedQuestions];
      updatedQuestions[index].visited = true;
      setProcessedQuestions(updatedQuestions);
      setNotVisited(notVisited - 1);
    }
  };

const handleTimerFinish = () => {
  navigate('/admin/results', { state: { answers: processedQuestions } });

}

  return (
    <>
      {loading ? (
                <div className="w-full h-full flex justify-center items-center mx-auto p-6 rounded shadow-md lg:px-24">
                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
              </div>
      ) : (
        <div className="grid grid-cols-4 grid-rows-8 h-screen">
          {/* Navbar */}
          <div className="col-span-4 row-span-1 bg-slate-50 shadow-md shadow-slate-200 z-10 flex items-center justify-between p-4 x-10">
            <h1>{finalObj?.course}</h1>
            <div className="flex justify-around items-center">
              <h1 className="m-5">Duration: {finalObj?.duration} min</h1>
              <div className="mr-5">
                <Timer duration={parseInt(finalObj?.duration || '0') * 60}  onTimerFinish={handleTimerFinish}/>
              </div>
              <div className="flex flex-col">
                <h1>Sai Tharak Reddy</h1>
                <p>id: 5200859</p>
              </div>
            </div>
          </div>
          {/* Navbar */}


          {
            finalObj?.examType==='upload question Paper' ?(
              <>
              <div className="p-8 w-full col-span-4 row-start-2 row-span-6 overflow-auto bg-white">
                <QuestionPaperDisplay QuestionPapers={finalObj.questionsImages!}/>
              </div>
              <div className="bg-slate-50 col-span-4 row-span-1 row-start-8 flex justify-center items-center w-full">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={()=>{navigate('/admin/upload-answers-screen')}}>
                  Submit
                </button>
              </div>

              </>
            ):(
              <>
                    {/* Question Display */}
                    <div className="p-8 w-full col-span-3 row-start-2 row-span-6 overflow-auto bg-white">
                      {processedQuestions.length > 0 && (
                        <QuestionDisplay question={processedQuestions[questionIndex]} questionIndex={questionIndex} key={questionIndex} />
                      )}
                    </div>
                    {/* Question Display */}

                    {/* Bottom Navigation */}
                    <div className="col-span-3 row-span-1 row-start-8 bg-slate-100 flex justify-between p-6 items-center">
                      <div>
                        <button
                          onClick={handlePrevQuestion}
                          className="bg-slate-50 hover:bg-indigo-500 text-black font-bold py-2 px-4 rounded-l-lg border-t-2 border-b-2 border-l-2 border-indigo-500"
                        >
                          <ArrowBackIcon /> Prev
                        </button>
                        <button
                          onClick={handleNextQuestion}
                          className="bg-slate-50 hover:bg-indigo-500 text-black font-bold py-2 px-4 rounded-r-lg border-t-2 border-b-2 border-r-2 border-indigo-500"
                        >
                          Next <ArrowForwardIcon />
                        </button>
                      </div>
                      <div className="flex justify-center">
                        <button
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          onClick={handleSaveAndNextQuestion}
                        >
                          Save & Next
                        </button>
                      </div>
                    </div>
                    {/* Bottom Navigation */}

                    {/* Side Navigation */}
                    <div className="col-span-1 row-span-6 bg-slate-50 row-start-2 row-end-8 overflow-auto p-6">
                      <label className="block mb-4 text-sm font-medium text-gray-900">Questions Status</label>
                      <div className="grid grid-cols-2 grid-rows-2 gap-y-4">
                        <div>
                          <div className="flex justify-center items-center h-7 w-7 bg-gray-200 rounded-md">{notVisited}</div>
                          <p>Not visited</p>
                        </div>
                        <div>
                          <div className="flex justify-center items-center h-7 w-7 rounded-md bg-red-400">{notAnswered}</div>
                          <p>Not Answered</p>
                        </div>
                        <div>
                          <div className="flex justify-center items-center h-7 w-7 rounded-md bg-green-400">{answered}</div>
                          <p>Answered</p>
                        </div>
                      </div>
                      <label className="block mt-6 mb-4 text-sm font-medium text-gray-900">Choose A Question</label>
                      <div className="grid grid-cols-7 grid-rows-auto">
                        {processedQuestions.map((_question, index) => (
                          <div
                            key={index}
                            className={`flex justify-center items-center h-8 w-8 ${_question.answered ? "bg-green-300": _question.visited ? "bg-red-400" : "bg-gray-200"} rounded-md cursor-pointer`}
                            onClick={() => {
                              handleOntapSideBar(index);
                            }}
                          >
                            {index + 1}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Side Navigation */}

                    {/* Submit Button */}
                    <div className="bg-slate-50 col-span-1 row-span-1 row-start-8 flex justify-center items-center w-full">
                      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={openModal}>
                        Submit
                      </button>
                    </div>
                    {/* Submit Button */}
              </>
            )
          }

          <Modal isOpen={modal} onClose={closeModal} totalQuestions={processedQuestions.length} answeredQuestions={answered} answers={processedQuestions}/>
        </div>
      )}
    </>
  );
};

export default WriteExamScreen;
