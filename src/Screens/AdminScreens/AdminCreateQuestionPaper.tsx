import React, { useEffect, useState } from 'react';
import QuestionForm from '../../Components/QuestionForm';
import SideBarForAdmin from '../../Components/SideBarForAdminExams';
import { ImagePreview, QuestionPaper } from '../../Models/ExamModel';
import { useLocation } from 'react-router-dom';
import LoadingScreen from '../../Components/LoadingScreen';
import { useAppDispatch } from '../../redux/PersistanceStorage';
import { GetTempQP, replaceTempQuestionPaperById } from '../../redux/QuestionPaperSlice';
import { deleteObject, ref } from 'firebase/storage';
import { databaseStorage } from '../../firebase_config';
import { useSelector } from 'react-redux';
import uploadImage from '../../hooks/UploadImage';


const baseUrl = "https://firebasestorage.googleapis.com/v0/b/divya-kala-academy.appspot.com/o/";

const CreateQuestionPaper: React.FC = () => {












  const [questionPaper, setQuestionPaper] = useState<QuestionPaper>({
    id:'',
    course: '',
    for: '',
    examType:'',
    date: '',
    time: '00:00',
    duration: '',
    totalMarks: 0,
    questions: [],
    noOfQuestions:0,
    questionsImages:[],
    uploadedPdfURL:''
  });
  const tempQP = useSelector(GetTempQP);

  const dispatch = useAppDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);


  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const type = queryParams.get('type');

    if (type === 'new' || type == 'edit') {
      try {
        const id = queryParams.get('id');
        setQuestionPaper(tempQP.find((obj:QuestionPaper)=>obj.id === id));
        
        
      } catch (error) {
        console.error('Error parsing questionPaperString:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [location.search, dispatch]);






  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map(file => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise<ImagePreview>((resolve) => {
        reader.onload = () => resolve({ file, preview: reader.result as string });
      });
    });
  
    Promise.all(newPreviews).then(newPreviews => {
      setSelectedFiles(prevFiles => [...prevFiles, ...files]);
      // setQuestionPaper(prevqp =>({...prevqp,questionsImages:[...prevqp.questionsImages! ,...newPreviews ]}))
      setImagePreviews(prevFiles => [...prevFiles, ...newPreviews]);
    });
  };
  

  const handleRemoveImage = (index: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const deleteUploadedImages = async(index: number)=>{
    setDeleting(true);
    const filePath = decodeURIComponent(questionPaper.questionsImages![index].preview!.split(baseUrl)[1].split("?")[0]);
    const desertRef = ref(databaseStorage, filePath);

    await deleteObject(desertRef);

    setQuestionPaper(prevqp => ({
      ...prevqp,
      questionsImages: prevqp.questionsImages!.filter((_, i) => i !== index),
    }));
    setDeleting(false);

  }

  // const handleUploadImages = async() => {
  //   setUploading(true);
  
  //   const uploadPromises = questionPaper.questionsImages!.map(async (img: ImagePreview, index) => {
  //     img.preview = await uploadImage(img.file, `qp${index}`, 'questionpaper');
  //     return img;
  //   });
  
  //   await Promise.all(uploadPromises);

  //   setUploading(false);

  // };

  const handleUploadImages = async () => {
    setUploading(true);
  
    const updatedImages = await Promise.all(imagePreviews.map(async (img: ImagePreview, index) => {
      const newPreview = await uploadImage(img.file!, `qp${index}`, 'questionpaper');
      return { ...img, preview: newPreview }; // Create a new object with the updated preview
    }));
  
    setQuestionPaper(prevqp => ({
      ...prevqp,
      questionsImages: [...prevqp.questionsImages!,...updatedImages],
    }));
  
    setImagePreviews([]);
    setSelectedFiles([]);
    setUploading(false);
  };
  

  const addQuestionForm = () => {
    setQuestionPaper(prevQuestionPaper => ({
      ...prevQuestionPaper,

      questions: [
        ...prevQuestionPaper.questions,
        {
          questionType: '',
          questionFormat:'',
          question: '',
          options: [],
          correctAnswer: [],
          points: 0
        }
      ]
    }));
  };

  const printQuestions = () => {
    console.log(questionPaper.questions);
  };

  useEffect(() => {
    if (questionPaper.examType !== "upload question Paper" && questionPaper.examType !== "" ) {
      
      const points = questionPaper.questions.reduce((sum, question) => sum + question.points, 0);
      setQuestionPaper(prev => ({ ...prev, totalMarks: points ,noOfQuestions : prev.questions.length}));
    }
  }, [questionPaper.examType, questionPaper.questions]);
  
  useEffect(() => {
    if (questionPaper.id && questionPaper.examType !== "upload question Paper") {
      dispatch(replaceTempQuestionPaperById({ id: questionPaper.id, newQuestionPaper: questionPaper }));
    }
  }, [questionPaper.examType, questionPaper]);




  return (
    <div className="grid grid-cols-4 grid-rows-8 h-screen bg-slate-100 ">
      {loading ? (
        
        <LoadingScreen />
      ) : (
        <>

          {
            questionPaper.examType==="upload question Paper"?(

            <div className=" col-span-3 col-start-1 grid grid-cols-2 grid-rows-6 h-full  w-full p-10 row-span-7">
              <div className='row-start-1 row-span-1'>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden" 
                  id="imageInput"
                />
                <label htmlFor="imageInput" className="bg-sky-600 px-4 py-1 rounded-md ml-4 mt-2 cursor-pointer">
                  Select Images
                </label>
                <button
                  className="bg-sky-600 px-4 py-1 rounded-md ml-4 mt-2"
                  onClick={handleUploadImages}
                  disabled={ selectedFiles.length === 0 }
                >
                  { uploading ? "Uploading..." : "Upload" }
                </button>
              </div>


              {selectedFiles.length > 0 && (
                <p>Selected {selectedFiles.length} file(s)</p>
              )}

              <div className="mt-4 col-span-1 col-start-1 row-start-2 row-span-6 overflow-auto">
                {imagePreviews && imagePreviews.length === 0 ? (
                  <h2>No images selected</h2>
                ) : (
                  imagePreviews.map((image, index) => (
                    <div key={index} className="flex items-center mb-4">
                      <img src={image.preview} alt={`preview-${index}`} className="w-20 h-20 object-cover mr-2" />
                      <button
                        className="bg-red-500 px-2 py-1 rounded-md text-white"
                        onClick={() => handleRemoveImage(index)}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}

              </div>

              <div className="mt-4 col-span-1 col-start-2 row-start-2 row-span-7  overflow-auto">

              {
                <p className='mb-3' >Uploaded {questionPaper.questionsImages!.length} file(s)</p>
              }

                {questionPaper.questionsImages && questionPaper.questionsImages.length === 0 ? (
                  <h2>No images Uploaded</h2>
                ) : (
                  questionPaper.questionsImages!.map((image, index) => (
                    <div key={index} className="flex items-center mb-4">
                      <img src={image.preview} alt={`preview-${index}`} className="w-40 h-40 object-cover mr-2 rounded-md" />
                      <button
                        className={`bg-red-500 px-2 py-1 rounded-md text-white ${deleting ? 'disabled-button bg-red-400 cursor-not-allowed' : ''}`}
                        onClick={() => deleteUploadedImages(index)}
                        disabled = {deleting}
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>


            </div>
            )
            
            :(


          






          <div className="col-span-3 w-full pl-9 pr-9 pt-4 pb-4 row-span-8 overflow-auto">
            {questionPaper.questions.map((_question, index) => (
              <div key={index} className="mb-4">
                <QuestionForm
                question={_question}
                  index={index}
                  updateQuestion={(index, updatedQuestion) => {
                    const newQuestions = [...questionPaper.questions];
                    newQuestions[index] = updatedQuestion;
                    setQuestionPaper(prev => ({ ...prev, questions: newQuestions }));

                  }}
                  deleteQuestion={async(index) => {
                    const newQuestions = [...questionPaper.questions];
                          if(newQuestions[index].questionFormat === 'image'){
                              const filePath = decodeURIComponent(newQuestions[index].question.split(baseUrl)[1].split("?")[0]);
                              const desertRef = ref(databaseStorage, filePath);

                              
                              await deleteObject(desertRef);
                          }
                          if(newQuestions[index].questionType ==='multi Correct question ans image' || newQuestions[index].questionType === 'single Correct question ans image'){
                            newQuestions[index].options.map(async(optobj)=>{
                                  const filePath = decodeURIComponent(optobj.image!.split(baseUrl)[1].split("?")[0]);
                                  const desertRef = ref(databaseStorage, filePath);
          
                                  await deleteObject(desertRef);
                              })
                          }
                    newQuestions.splice(index, 1);
                    setQuestionPaper(prev => ({ ...prev, questions: newQuestions }));

                    
                  }}
                />
              </div>
            ))}

            <button onClick={addQuestionForm} className="bg-sky-600 px-4 py-1 rounded-md ml-4 mt-2">
              Add question
            </button>
            <button onClick={printQuestions} className="bg-slate-500 px-4 py-1 rounded-md ml-4 mt-2">
              Print questions
            </button>
          </div>
          )}
          <div className="col-span-1 overflow-auto row-start-1 col-start-4 row-span-8">
            <SideBarForAdmin questionPaper={questionPaper} setQuestionPaper={setQuestionPaper} />
          </div>
        </>
      )}
    </div>
  );
};

export default CreateQuestionPaper;



