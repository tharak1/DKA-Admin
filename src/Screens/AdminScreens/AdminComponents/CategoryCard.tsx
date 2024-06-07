import React from 'react';
import CategoryModel from '../../../Models/CategoryModel';
import { useAppDispatch } from '../../../redux/PersistanceStorage';
import { deleteCategory } from '../../../redux/CategorySlice';
import Modal from '../AdminComponents/Modal'

interface CategoryCardProps{
  CategorryData:CategoryModel
}

const CategoryCard: React.FC<CategoryCardProps> = ({CategorryData}) => {



  const dispatch = useAppDispatch();

  const categoryDelete = async() =>{
    console.log(CategorryData.id);
    
    await dispatch(deleteCategory(CategorryData.id!));
  }



  return (
    <div className="card h-[370px] relative bg-white dark:bg-slate-700 dark:text-white rounded-md p-4 flex flex-col justify-center items-start">
      <div>
        <h2 className="text-lg font-bold">{CategorryData.name}</h2>
        <p className="text-sm">Date Created : {CategorryData.date}</p>
        <button className="absolute top-[0.875rem] right-[0.5rem] text-neutral-500 p-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v16l7-5 7 5V3H5z" />
          </svg>
        </button>
      </div>

      <div className="h-1/2 w-full flex justify-center mt-4 rounded-md ">
        <img src={CategorryData.image} loading="lazy" alt="" className="rounded-md w-full object-cover"/>
      </div>

      <div className="flex justify-between items-center gap-4 p-4">
        <button className="ml-auto self-center font-semibold bg-red-500 hover:bg-red-400 text-white py-2 px-4 rounded-md" aria-label="Delete" onClick={categoryDelete}>
          Delete
        </button>
        <Modal type='update' categoryData={CategorryData} />
      </div>
    </div>
  );
};

export default CategoryCard;
