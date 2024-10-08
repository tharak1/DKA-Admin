import React, { useEffect, useState } from 'react';
import Navbar from './AdminComponents/Navbar';
import Payment from '../../Models/PaymentModel';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase_config';
import { useAppDispatch } from '../../redux/PersistanceStorage';
import { GetCourses, fetchCourses } from '../../redux/CourcesSlice';
import { useSelector } from 'react-redux';
import { CourseModel } from '../../Models/CourceModel';

const AdminShowPayments: React.FC = () => {
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [filteredPayments, setFilteredPayments] = useState<Payment[] | null>(null);
  const [filters, setFilters] = useState({
    courseName: '',
    studentSearch: '',
    date: '',
    status: ''
  });

  const dispatch = useAppDispatch();
  const courses = useSelector(GetCourses);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const paymentsSnapshot = await getDocs(collection(db, 'payments'));
      const paymentsData: Payment[] = paymentsSnapshot.docs.map((doc) => ({
        ...doc.data(),
      })) as Payment[];
      setPayments(paymentsData);
      setFilteredPayments(paymentsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading payments:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  useEffect(() => {
    if (payments) {
      const filtered = payments.filter((payment) => {
        return (
          (filters.courseName === '' || payment.courseName === filters.courseName) &&
          (filters.studentSearch === '' || 
            payment.studentId.toLowerCase().includes(filters.studentSearch.toLowerCase()) ||
            payment.studentName.toLowerCase().includes(filters.studentSearch.toLowerCase())) &&
          (filters.date === '' || payment.date === filters.date) &&
          (filters.status === '' || payment.status === filters.status)
        );
      });      
      setFilteredPayments(filtered);
    }
  }, [filters]);


  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering is already handled by the useEffect
    setFilters({   
      courseName: '',
      studentSearch: '',
      date: '',
      status: ''
    })
  };

  return (
    <div className='grid grid-cols-2 grid-rows-12 gap-y-10 gap-x-3 w-full h-screen sm:p-6'>
      <div className='col-span-2 row-span-1'>
        <Navbar name='Payments' />
      </div>

      <div className='col-span-2 row-span-2 flex max-sm:flex-col items-end h-full w-full rounded-lg max-sm:mt-4 max-sm:p-2'>
        <form className='w-full flex max-sm:flex-col' onSubmit={handleFilterSubmit}>
          <div className='w-full flex max-sm:flex-col max-sm:space-y-3 justify-between'>
            <div className='flex'>
            <label htmlFor='courseName' className='sr-only'>
              Filter by Course
            </label>
            <select
              id='courseName'
              name='courseName'
              value={filters.courseName}
              onChange={(e)=>{    setFilters({
                ...filters,
                courseName: e.target.value,
              });}}
              className='flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-2 focus:outline-none'
            >
              <option value=''>All Courses</option>
              {courses.map((obj: CourseModel) => (
                <option value={obj.courseName} key={obj.id}>
                  {obj.courseName}
                </option>
              ))}
            </select>
           

            <div className='relative w-96'>
              <input
                type='search'
                id='studentSearch'
                name='studentSearch'
                value={filters.studentSearch}
                onChange={(e)=>{    setFilters({
                  ...filters,
                  studentSearch: e.target.value,
                });}}
                className='block p-2.5 w-full h-full z-20 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-r-lg placeholder-gray-400 focus:placeholder-gray-600'
                placeholder='Student ID or Name'
              />
            </div>
            </div>
            <div className='flex'>
            <div className='relative w-48'>
              <input
              placeholder='Select Date'
                type='date'
                id='date'
                name='date'
                value={filters.date}
                onChange={(e)=>{    setFilters({
                  ...filters,
                  date: e.target.value,
                });}}
                className='sm:ml-2 block p-2.5 w-full z-10 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg placeholder-gray-400 focus:placeholder-gray-600'
              />
            </div>
            
            <div className='ml-2'>
            <select
              id='status'
              name='status'
              value={filters.status}
              onChange={(e)=>{    setFilters({
                ...filters,
                status: e.target.value,
              });}}
              className='ml-2 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:outline-none'
            >
              <option value=''>All Statuses</option>
              <option value='Success'>Success</option>
              <option value='Pending'>Pending</option>
              <option value='Failed'>Failed</option>
              <option value='Cash'>Cash</option>

            </select>
            </div>
            <button
              type='submit'
              className='ml-2 sm:px-4 sm:py-2 py-1 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300'
            >
              Clear Filter
            </button>
            </div>
          </div>
        </form>
      </div>

      {loading ? (
        <div className='col-span-2 row-span-11 h-full w-full rounded-lg bg-white dark:bg-slate-700 overflow-auto flex justify-center items-center'>
          <div>
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
        </div>
      ) : filteredPayments !== null ? (
        <div className=' col-span-2 row-span-11 h-full w-full rounded-lg bg-white dark:bg-slate-700 overflow-auto p-3 space-y-5'>
          <div className='max-sm:hidden w-full grid grid-cols-6 max-sm:grid-cols-2 max-sm:grid-rows-2 py-5'>
            <div className='col-span-2  max-sm:col-span-1 max-sm:row-span-1 flex flex-col justify-start'>
              <div>Purchase</div>
            </div>
            <div className='col-span-1 max-sm:col-span-1 max-sm:row-span-1 flex flex-col justify-center items-center'>
              <div>Amount</div>
            </div>
            <div className='col-span-2 max-sm:col-span-1 max-sm:row-span-1 flex flex-col justify-center items-center'>
              <div>Payment Date</div>
            </div>
            <div className='col-span-1 max-sm:col-span-1 max-sm:row-span-1 flex flex-col justify-center items-center'>
              <div>Payment Status</div>
            </div>
          </div>
          {filteredPayments.map((obj,index) => (
            <div
              className='w-full grid grid-cols-6 max-sm:grid-cols-3 max-sm:grid-rows-2 py-5 bg-slate-200 dark:bg-slate-800 rounded-lg px-3 hover:shadow-md hover:shadow-gray-600'
              key={index}
            >
              <div className='col-span-2 max-sm:col-span-2 max-sm:row-span-1 flex flex-col justify-start'>
                <h2>{obj.courseName}</h2>
                <h2>{obj.studentName}</h2>
                <h2>{obj.studentId}</h2>
              </div>
              <div className='col-span-1 max-sm:col-span-1 max-sm:row-span-1 flex flex-col justify-center border-l-2 items-center'>
              <span className='text-xs text-gray-600 dark:text-gray-400'> Amount :</span><h2>{obj.courseAmount}</h2>
              </div>
              <div className='col-span-2 max-sm:col-span-2 max-sm:row-span-1 flex flex-col justify-start items-center max-sm:items-start sm:border-l-2'>
                <h2>
                  <span className='text-xs text-gray-600 dark:text-gray-400'>Payment ID :</span> {obj.paymentId}
                </h2>
                <h2>
                  <span className='text-xs text-gray-600 dark:text-gray-400'>Payment Date :</span> {new Date(obj.date).toLocaleDateString('en-IN')}
                </h2>
              </div>
              <div className={`col-span-1 max-sm:col-span-1 max-sm:row-span-1 flex flex-col justify-center items-center border-l-2`}>
                <span
                  className={`px-4 py-2 rounded-lg bg-blend-lighten ${
                    obj.status.toLowerCase() === 'success'
                      ? 'bg-green-500'
                      : obj.status.toLowerCase() === 'pending'
                      ? 'bg-orange-400'
                      : obj.status.toLowerCase() === 'cash'
                      ? 'bg-green-500'
                      : 'bg-red-500 '
                  }`}
                >
                  {obj.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='col-span-2 row-span-11 h-full w-full rounded-lg bg-white dark:bg-slate-700 overflow-auto flex justify-center items-center'>
          <div>
            <h2>No data</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminShowPayments;
