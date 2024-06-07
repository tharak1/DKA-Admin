import React from 'react'
import Navbar from './AdminComponents/Navbar'
import AddIcon from '@mui/icons-material/Add';
import CourseCard from '../../Components/CourseCard';
import { useNavigate } from 'react-router-dom';
import SeacrhBar from '../../Components/SeacrhBar';
import { useSelector } from 'react-redux';
import { GetCourses } from '../../redux/CourcesSlice';
import { CourseModel } from '../../Models/CourceModel';


const AdminManageCourse:React.FC = () => {
  const navigate = useNavigate();
  const courses = useSelector(GetCourses);


  // const dispatch = useAppDispatch();

  // useEffect(()=>{
  //   dispatch(fetchCourses());
  // },[]);

  const handleAddButtonClick = () => {
    navigate("/admin/add_courses");
  }
  return ( 
    <div className='gird grid-cols-1 gap-y-4 bg-slate-100 dark:bg-slate-900 p-6 h-full overflow-auto'>
        <div className="col-span-1 mb-5">
            <Navbar name='Manage Courses'/>
        </div>

        <div className='col-span-1 mb-5 flex flex-row'>
            <button className="px-5 py-0.5 rounded-md border-2 bg-cyan-500 hover:bg-cyan-400 text-white border-cyan-600 mr-4" onClick={handleAddButtonClick}><AddIcon/> Add Course</button>
            <SeacrhBar/>
        </div>

        
          {
            courses.map((obj:CourseModel)=>(
              <div className='col-span-1 w-full'>
              <CourseCard courseDetails={obj} showActions ={true} key={obj.id}/>
              </div>
            ))
          }
        
        
        {/* <CourseCard showActions ={true}/>
        <CourseCard showActions ={true}/>
        <CourseCard showActions ={true}/>
        <CourseCard showActions ={true}/>
        <CourseCard showActions ={true}/> */}

    </div>
  )
}

export default AdminManageCourse
