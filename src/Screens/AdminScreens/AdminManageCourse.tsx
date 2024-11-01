import React, { useState } from 'react';
// import Navbar from './AdminComponents/Navbar';
import AddIcon from '@mui/icons-material/Add';
// import CourseCard from './AdminComponents/CourseCard';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { GetCourses } from '../../redux/CourcesSlice';
import { CourseModel } from '../../Models/CourceModel';
import { Categories } from '../../redux/CategorySlice';
import CategoryModel from '../../Models/CategoryModel';
import CourseCard from './AdminComponents/CourseCard';
import Navbar from './AdminComponents/Navbar';

const AdminManageCourse: React.FC = () => {
  const navigate = useNavigate();
  const categories = useSelector(Categories);
  const courses = useSelector(GetCourses);

  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleAddButtonClick = () => {
    navigate("/admin/add_courses");
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  }

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  }

  const filteredCourses = courses.filter((course: CourseModel) => {
    return (
      (selectedCategory === '' || course.category === selectedCategory) &&
      (searchInput === '' || course.courseName!.toLowerCase().includes(searchInput.toLowerCase()))
    );
  });


  // const isOpen = useSelector((state: RootState) => state.drawer.isOpen);


  return (
   
    <div className='grid grid-cols-1 grid-rows-10  gap-y-4 items-start sm:p-6 h-screen overflow-auto'>
      <div className="col-span-1 row-span-1 mb-5">
        <Navbar name='Manage Courses' />
      </div>

      <div className='col-span-1 max-sm:row-span-2 mb-5 flex flex-row max-sm:flex-col max-sm:p-3'>
        <button className="px-3 bg-violet-600 py-2 text-center rounded-lg text-white font-bold p-2 mr-3 max-sm:mr-0 max-sm:mb-8" onClick={handleAddButtonClick}>
          <AddIcon /> Add Course
        </button>
        <form className="col-span-1 ">
          <div className="flex">
            <label htmlFor="search-category" className="sr-only">Select Category</label>
            <select
              id="search-category"
              className=" inline-flex items-center py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-2 focus:outline-none"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All categories</option>
              {categories.map((obj: CategoryModel) => (
                <option value={obj.name} key={obj.id}>{obj.name}</option>
              ))}
            </select>
            
            <div className={`relative w-96`}>
              <input
                type="search"
                id="search-dropdown"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-r-lg border border-gray-300 placeholder-gray-400 focus:placeholder-gray-600"
                placeholder="Search courses..."
                value={searchInput}
                onChange={handleSearchInputChange}
                required
              />
              <button
                type="submit"
                className="absolute top-0 right-0 bottom-0 p-3 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                <span className="sr-only">Search</span>
              </button>
            </div>
            
          </div>
        </form>
      </div>

      <div className='col-span-1 row-span-8 w-full h-full overflow-auto'>
      {filteredCourses.map((obj: CourseModel) => (
        <div className='col-span-1 w-full' key={obj.id}>
          <CourseCard courseDetails={obj} showActions={true} />
        </div>
      ))}
      </div>
    </div>
    
  );
}

export default AdminManageCourse;
