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
    <div className="p-6 h-screen overflow-auto w-full items-start">
        <div className='w-full'>
            <Navbar name='Manage Categories'/>
        </div>
        <div className='mt-4 flex items-start'>
          <Modal type='create'/>
        </div>

        <div className='grid-span-3 w-full grid grid-cols-3 gap-3 mt-4'>
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
