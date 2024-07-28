import React from 'react'
import Navbar from './AdminComponents/Navbar'
import Modal from './AdminComponents/AddCategoryModal';
import { useSelector } from 'react-redux';
import { Categories } from '../../redux/CategorySlice';
import CategoryModel from '../../Models/CategoryModel';
import CategoryCard from './AdminComponents/CategoryCard';

const AdminManageCategory:React.FC = () => {

  const categories = useSelector(Categories) as CategoryModel[];
  return (
    <div className="sm:p-6 sm:h-screen overflow-auto w-full items-start">
        <div className='w-full'>
            <Navbar name='Manage Categories'/>
        </div>
        <div className='mt-2 max-sm:mt-20 max-sm:p-3 flex items-start'>
          <Modal type='create'/>
        </div>

        <div className=' w-full grid sm:grid-cols-3 max-sm:grid-cols-1 gap-3 sm:mt-4 max-sm:p-3'>
          {
            categories.map((obj:CategoryModel)=>(              
              <CategoryCard CategorryData={obj} key={obj.id}/>
            ))
          }
        </div>
    </div>
  )
}

export default AdminManageCategory
