import React, { useState, useRef, useEffect } from 'react';
import { SlOptionsVertical } from 'react-icons/sl';
import { EmployeeModel } from '../../../Models/EmployeeModel';
import { Link } from 'react-router-dom';
import NotificationModal from './NotificationModal';
import { useAppDispatch } from '../../../redux/PersistanceStorage';
import { deleteEmployee } from '../../../redux/EmployeeSlice';

interface EmployeeCardProps {
  employee: EmployeeModel;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  let [loading, setLoading] = useState<boolean>(false);


  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  };
  useEffect(() => {
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);


  let [isOpen, setIsOpen] = useState(false)

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }


  const delEmployee = async()=>{
    setLoading(true);
    close();
    await dispatch(deleteEmployee(employee.id!));
    setLoading(false);
  }




  return (
    <div className="bg-white dark:bg-slate-700 p-2 text-gray-700 dark:text-gray-200  rounded-lg shadow-lg h-80">
      <div className="relative flex justify-end">
        <button
          className=" hover:bg-slate-100 rounded-full p-2 dark:hover:bg-slate-600"
          onClick={() => {
            setShowDropdown(!showDropdown);
          }}
        >
          <SlOptionsVertical />
        </button>

        <div
          ref={dropdownRef}
          className={`absolute z-10 ${showDropdown ? '' : 'hidden'} top-[32px] bg-slate-100 divide-y divide-gray-300 rounded-lg shadow-md w-44 dark:bg-gray-600 `}
        >
          <ul className="py-2 text-sm " aria-labelledby="dropdownDefaultButton">
            <li>
              <Link
                to={`/admin/add_employee?type=edit&Id=${employee.id}`}
                className="block px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-500 dark:hover:text-white "
              >
                Edit
              </Link>
            </li>
            <li>
              <p className="block px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-500 text-red-500 dark:hover:text-red-900 cursor-pointer" onClick={open}>
                {loading?(
                      <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                      </svg>
                ):("Delete")}
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <img src={employee.profileImage} alt="Ruben Korsgaard" className="w-24 h-24 rounded-full" />
        <h2 className="text-xl font-semibold mt-4">{employee.employeeName}</h2>
        <p className=" mb-2 px-4 py-1.5 bg-gray-200 dark:bg-gray-500 rounded-full">{employee.designation}</p>
        <div className="text-center  ">
          <p>
            <span className="font-medium">Employee id:</span>
            {employee.id}
          </p>
          <p>
            <span className="font-medium">Phno : </span>
            {employee.phone}
          </p>
          <p>
            <span className="font-medium">Teaching course : </span>
            {employee.coursesTaught}
          </p>
        </div>
      </div>
      <NotificationModal isOpen={isOpen} onClose={close} heading='Employee' body='Do You want to delete Employee permanently !' type='delete'  ActionFunction={delEmployee}/>
    </div>
  );
};

export default EmployeeCard;
