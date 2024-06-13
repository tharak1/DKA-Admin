import React, { useState, useRef, useEffect } from 'react';
import { SlOptionsVertical } from 'react-icons/sl';
import { EmployeeModel } from '../Models/EmployeeModel';
import { Link } from 'react-router-dom';

interface EmployeeCardProps {
  employee: EmployeeModel;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="bg-white p-2 rounded-lg shadow-lg h-80">
      <div className="relative flex justify-end">
        <button
          className="text-gray-400 hover:bg-slate-100 rounded-full p-2"
          onClick={() => {
            setShowDropdown(!showDropdown);
          }}
        >
          <SlOptionsVertical />
        </button>

        <div
          ref={dropdownRef}
          className={`absolute z-10 ${showDropdown ? '' : 'hidden'} top-[32px] bg-slate-100 divide-y divide-gray-300 rounded-lg shadow-md w-44 dark:bg-gray-700`}
        >
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
            <li>
              <Link
                to={`/admin/add_employee?type=edit&Id=${employee.id}`}
                className="block px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                Edit
              </Link>
            </li>
            <li>
              <p className="block px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 text-red-500 dark:hover:text-red-500 cursor-pointer">
                Delete
              </p>
            </li>
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <img src={employee.profileImage} alt="Ruben Korsgaard" className="w-24 h-24 rounded-full" />
        <h2 className="text-xl font-semibold mt-4">{employee.employeeName}</h2>
        <p className="text-gray-800 mb-2 px-4 py-1.5 bg-gray-200 rounded-full">{employee.designation}</p>
        <div className="text-center text-gray-700">
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
    </div>
  );
};

export default EmployeeCard;
