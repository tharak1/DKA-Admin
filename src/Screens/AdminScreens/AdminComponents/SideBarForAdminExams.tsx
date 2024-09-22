import * as React from 'react';
// import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { QuestionPaper } from '../../../Models/ExamModel';
import { RootState, useAppDispatch } from '../../../redux/PersistanceStorage';
import { GetCourses } from '../../../redux/CourcesSlice';
import { replaceTempQuestionPaperById, uploadQuestionPaper } from '../../../redux/QuestionPaperSlice';
import { CourseModel } from '../../../Models/CourceModel';
import SelectStudentsModal from './SelectStudentsModal';
import NotificationModal from './NotificationModal';


interface SideBarForAdminProps{
    questionPaper: QuestionPaper;
    setQuestionPaper: React.Dispatch<React.SetStateAction<QuestionPaper>>;
}

const SideBarForAdmin: React.FC<SideBarForAdminProps> = ({questionPaper, setQuestionPaper}) => {
    const navigate = useNavigate();
    // console.log(questionPaper);
    const dispatch = useAppDispatch();
    const courses = useSelector(GetCourses);
    const [dtafting,setDrafting] = React.useState<boolean>(false)
    const loading = useSelector((state: RootState) => state.questionPaper.status === 'loading');





    const draftPaper = () =>{
        setDrafting(true);
            dispatch(replaceTempQuestionPaperById({ id: questionPaper.id!, newQuestionPaper: questionPaper }));
            setDrafting(false);
    }

    const uploadPaper = async () => {
        await dispatch(uploadQuestionPaper(questionPaper));
        openSubmit();
    };
    

    let [isOpenSubmit, setIsOpenSubmit] = React.useState(false)

    function openSubmit() {
      setIsOpenSubmit(true)
    }
  
    function closeSubmit() {
      setIsOpenSubmit(false)
      navigate('/admin/manage_questionPaper');
    }






  return (
    <div className="w-full h-screen max-sm:h-full overflow-auto sm:p-5 max-sm:pt-12 ">
        <div className="flex flex-col max-sm:items-center">
        <label htmlFor="courseType" className="max-w-xs block mb-2 text-sm font-medium text-gray-900 ">Select a course</label>
            <select id="courseType" value={questionPaper.course} onChange={(event)=>{setQuestionPaper({...questionPaper,course: event.target.value})}} className="max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
            <option value="">-- Select course --</option>
                {
                    courses.map((obj:CourseModel)=>(
                        <option value={obj.courseName} key={obj.id}>{obj.courseName}</option>
                    ))
                }
            </select>

            <label htmlFor="publishType" className="max-w-xs block mb-2 text-sm font-medium text-gray-900 ">Select publish for</label>
            <select id="publishType" value={questionPaper.for} onChange={(event)=>{setQuestionPaper({...questionPaper,for: event.target.value})}} className="max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ">
            <option value="">-- Select course --</option>
                <option value="All Students">All Students</option>
                <option value="Online Students">Online Students</option>
                <option value="Offline Students">Offline Students</option>
                <option value="Select Students">Select Students</option>
            </select>


            

            <label htmlFor="minutes" className="max-w-xs block mb-2 text-sm font-medium text-gray-900">Enter number of minutes</label>
            <input
                id="minutes"
                type="number"
                value={questionPaper.duration}
                onChange={(event)=>{setQuestionPaper({...questionPaper,duration : event.target.value})}}
                className="max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

            <label htmlFor="noOfQuestions" className="max-w-xs block mb-2 text-sm font-medium text-gray-900">Enter number of Questions</label>
            <input
                id="minutes"
                type="number"
                value={questionPaper.noOfQuestions?.toString()}
                onChange={(event)=>{setQuestionPaper({...questionPaper,noOfQuestions : parseInt(event.target.value)})}}
                className="max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

   

                    <label className="max-w-xs block mt-2 mb-2 text-sm font-medium text-gray-900">Start Date: </label>
                    <input
                    type="date"
                    value={questionPaper.startDate}
                    onChange={(event)=>{setQuestionPaper({...questionPaper,startDate : event.target.value})}}
                    className="max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />

                
                    <label className="max-w-xs block mt-2 mb-2 text-sm font-medium text-gray-900">Strat Time: </label>
                    <input
                    type="time"
                    value={questionPaper.startTime}
                    onChange={(event)=>{setQuestionPaper({...questionPaper,startTime : event.target.value})}}
                    className="max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />

                    <label className="max-w-xs block mt-2 mb-2 text-sm font-medium text-gray-900">End Date: </label>
                    <input
                    type="date"
                    value={questionPaper.endDate}
                    onChange={(event)=>{setQuestionPaper({...questionPaper,endDate : event.target.value})}}
                    className="max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />

                
                    <label className="max-w-xs block mt-2 mb-2 text-sm font-medium text-gray-900">End Time: </label>
                    <input
                    type="time"
                    value={questionPaper.endTime}
                    onChange={(event)=>{setQuestionPaper({...questionPaper,endTime : event.target.value})}}
                    className="max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />

                    <label htmlFor="totalMarks" className="max-w-xs block mt-2 mb-2 text-sm font-medium text-gray-900">Enter Toatal Marks</label>
                    <input
                        id="minutes"
                        type="number"
                        value={questionPaper.totalMarks.toString()}
                        onChange={(event)=>{setQuestionPaper({...questionPaper,totalMarks : parseInt(event.target.value)})}}
                        className="max-w-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    />
               
          

            {/* <h2 className="max-w-xs block mt-2 mb-2 text-sm font-medium text-gray-900">{`Total Marks : ${questionPaper.totalMarks}`}</h2> */}

        {
            questionPaper.for === "Select Students" &&(
                <SelectStudentsModal questionPaper={questionPaper} setQuestionPaper={setQuestionPaper}/>
            )
        }
        <button  className="bg-slate-500 px-4 py-1 rounded-md ml-4 mt-4" onClick={draftPaper}>
          {dtafting ?"Drafting...":"Draft Paper"}
        </button>
        <button  className="bg-blue-500 px-4 py-1 rounded-md ml-4 mt-4" onClick={uploadPaper}>
           {loading?"Uploading...":"Upload Paper"}
        </button>

        <button  className="bg-green-500 px-4 py-1 rounded-md ml-4 mt-4" onClick={()=>{navigate(`/admin/writeExam?id=${questionPaper.id}`)}}>
           Write Demo exam
        </button>
        </div>
        <NotificationModal isOpen={isOpenSubmit} onClose={closeSubmit} heading={'Paper Uploaded'} body={"Paper has been uploaded successfully."} type='none'/>

    </div>
  )
}

export default SideBarForAdmin
