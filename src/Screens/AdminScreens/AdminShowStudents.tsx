import React, { useEffect, useState } from 'react';
import Navbar from './AdminComponents/Navbar';
import { UserModel } from '../../Models/UserModel';
import { collection, getDocs} from 'firebase/firestore';
import { db } from '../../firebase_config';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import countryList from 'react-select-country-list';

const AdminShowStudents: React.FC = () => {
  const [searchKey, setSearchKey] = useState<string>('');
  const [student, setStudent] = useState<UserModel[]>([]);
  const [filteredStudent, setFilteredStudent] = useState<UserModel[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const options = countryList().getData();
  const [searchCountry, setSearchCountry] = useState<string>('');

  const navigate = useNavigate();

  // const findStudent = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     let studentsQuery;
  //     const idPattern = /^DKA\d{5}$/;

  //     if (searchCountry) {
  //       // If a country is selected, include it in the query
  //       studentsQuery = query(
  //         collection(db, 'students'),
  //         where('country', '==', searchCountry)
  //       );
  //     } else if (idPattern.test(searchKey)) {
  //       // Search by ID if searchKey matches the ID pattern
  //       studentsQuery = query(
  //         collection(db, 'students'),
  //         where('id', '==', searchKey)
  //       );
  //     } else {
  //       // Search by name for non-ID pattern searchKey
  //       studentsQuery = query(
  //         collection(db, 'students'),
  //         where('name', '>=', searchKey),
  //         where('name', '<=', searchKey + '\uf8ff')
  //       );
  //     }

      // const querySnapshot = await getDocs(studentsQuery);

      // const studentsList: UserModel[] = [];
      // querySnapshot.forEach((doc) => {
      //   studentsList.push(doc.data() as UserModel);
      // });

      // setStudent(studentsList);
  //   } catch (error) {
  //     console.error('Error fetching student data:', error);
  //     setStudent([]);
  //   }

  //   setLoading(false);
  // };

  useEffect(()=>{
    getAllStudents();
  },[]);

  const getAllStudents = async () => {
    setLoading(true);
  
    try {
      const querySnapshot = await getDocs(collection(db, 'students'));
  
      const studentsList: UserModel[] = [];
  
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Type checking for UserModel properties
        if (isValidUserModel(data)) {
          studentsList.push(data as UserModel);
        }
      });
  
      setStudent(studentsList);
    } catch (error) {
      console.error("Error fetching students: ", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Helper function to validate UserModel
  const isValidUserModel = (data: any): data is UserModel => {
    return (
      typeof data.id === 'string' &&
      typeof data.name === 'string' &&
      typeof data.fatherName === 'string' &&
      typeof data.motherName === 'string' &&
      typeof data.dob === 'string' &&
      typeof data.gender === 'string' &&
      typeof data.address === 'string' &&
      typeof data.contactNo === 'string' &&
      typeof data.schoolName === 'string' &&
      typeof data.class === 'string' &&
      typeof data.hearAbout === 'string' &&
      typeof data.password === 'string' &&
      typeof data.imageUrl === 'string' &&
      Array.isArray(data.registeredCourses) && // Additional check for registeredCourses
      typeof data.email === 'string' &&
      typeof data.country === 'string' &&
      (typeof data.feedback === 'undefined' || typeof data.feedback === 'string')
    );
  };

  useEffect(() => {
  
    let x = student.filter(student => 
      (student.id.toLowerCase().includes(searchKey.toLowerCase()) ||  
      student.name.toLowerCase().includes(searchKey.toLowerCase())) &&
      (searchCountry === '' || student.country.toLowerCase() === searchCountry.toLowerCase())
    );
  
    setFilteredStudent(x);
  
  }, [searchKey, searchCountry, student]);
  


  const changeHandler = (value: any) => {
    setSearchCountry(value.label);
  };

  return (
    <div className='grid grid-cols-3 grid-rows-7 max-sm:grid-rows-10  gap-y-10 max-sm:gap-y-5 gap-x-3 overflow-auto sm:p-6 h-screen '>
      <div className='col-span-3 row-span-1'>
        <Navbar name={'Students Data'} />
      </div>

      <div className='col-span-1 max-sm:col-span-3 row-span-1 max-sm:p-3 z-10'>
        <form className='max-w-md' >
          <label htmlFor='default-search' className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'>
            Search
          </label>
          <div className='relative z-10'>
            <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
              <svg
                className='w-4 h-4 text-gray-500 dark:text-gray-400'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 20 20'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                />
              </svg>
            </div>
            <input
              type='search'
              id='default-search'
              className='block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='Search Student ID or Name'
              required
              onChange={(e) => {
                setSearchKey(e.target.value);
              }}
            />
            {/* <button
              type='submit'
              className='text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            >
              Search
            </button> */}

          </div>
        </form>
      </div>

      <div className='col-span-1 max-sm:col-span-3 row-span-1 flex items-center justify-around max-sm:p-3 dark:text-black'>
        <Select
      
          options={options}
          onChange={changeHandler}
          value={options.find((option) => option.label === searchCountry)}
          className='mt-1 w-full'
          placeholder='Filter by Country'
        />
        <form >
            <button
              type='submit'
              className='text-white ml-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
            >
              Search
            </button>
        </form>

      </div>

      {loading ? (
        <div className='col-span-3 row-span-5 max-sm:row-span-8 flex items-center justify-center dark:text-white'>
          <svg
            aria-hidden='true'
            className='inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300'
            viewBox='0 0 100 101'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
              fill='currentColor'
            />
            <path
              d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
              fill='currentFill'
            />
          </svg>
        </div>
      ) : filteredStudent.length > 0 ? (
        <div className='col-span-3 row-span-8 bg-white dark:bg-slate-700 rounded-lg p-3 overflow-auto space-y-5'>
          <div className='w-full grid grid-cols-6 max-sm:grid-cols-2 py-5'>
            <div className='col-span-2 flex flex-col justify-start'>
              <div>Details</div>
            </div>
            <div className='col-span-2 max-sm:hidden flex flex-col justify-center items-center'>
              <div>Country</div>
            </div>
            <div className='col-span-1 max-sm:hidden flex flex-col justify-center items-center'>
              <div>Password</div>
            </div>
            <div className='col-span-1 max-sm:hidden flex flex-col justify-center items-center'>
              <div>Courses Registered</div>
            </div>
          </div>
          {filteredStudent.map((obj) => (
            <div
              className='w-full grid grid-cols-6 max-sm:grid-cols-2 py-5 bg-slate-200 dark:bg-slate-800 rounded-lg px-3 hover:shadow-md hover:shadow-gray-600 hover:cursor-pointer'
              key={obj.id}
              onClick={() => navigate('/admin/view_student_details', { state: { studentData: obj } })}
            >
              <div className='col-span-2 flex flex-col justify-start'>
                <h2>ID : {obj.id}</h2>
                <h2>Name : {obj.name}</h2>
                <h2>Contact No : {obj.contactNo} min</h2>
              </div>
              <div className='col-span-2 max-sm:hidden flex flex-col justify-center border-l-2 border-gray-500 dark:border-gray-300 items-center'>
                <h2>{obj.country}</h2>
              </div>
              <div className='col-span-1 max-sm:hidden flex flex-col justify-center items-center border-l-2 border-gray-500 dark:border-gray-300'>
                <h2>
                  <span className='text-xl text-gray-600 dark:text-gray-400'>{obj.password}</span>
                </h2>
              </div>
              <div className={`col-span-1 max-sm:hidden flex flex-col justify-center items-center border-l-2 border-gray-500 dark:border-gray-300 px-3`}>
                <h2>{obj.registeredCourses.length}</h2>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='col-span-3 row-span-8 bg-white dark:bg-slate-700 rounded-lg p-3 overflow-auto space-y-5 flex items-center justify-center dark:text-white'>
          No results found
        </div>
      )}
    </div>
  );
};

export default AdminShowStudents;
