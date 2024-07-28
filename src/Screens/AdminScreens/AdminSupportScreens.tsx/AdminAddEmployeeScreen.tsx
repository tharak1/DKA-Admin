import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../redux/PersistanceStorage';
import { GetCourses } from '../../../redux/CourcesSlice';
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { databaseStorage, db } from '../../../firebase_config';
import { v4 as uuidv4 } from 'uuid';
import { useLocation, useNavigate } from 'react-router-dom';
import { CourseModel } from '../../../Models/CourceModel';
import { EmployeeModel } from '../../../Models/EmployeeModel';
import { GetEmployees, createEmployee, editEmployee } from '../../../redux/EmployeeSlice';
import NotificationModal from '../AdminComponents/NotificationModal';
import { collection, getDocs, query, where } from 'firebase/firestore';

const uploadImage = async (image: File, name: string, folder: string): Promise<string> => {
  if (!image) return '';
  const imageRef = ref(databaseStorage, `${folder}/${name + uuidv4()}`);
  const snapshot = await uploadBytes(imageRef, image);
  console.log(getDownloadURL(snapshot.ref));
  return await getDownloadURL(snapshot.ref);
};

const AdminAddEmployeeScreen: React.FC = () => {
  const baseUrl = "https://firebasestorage.googleapis.com/v0/b/divya-kala-academy.appspot.com/o/";
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const encodedProduct = searchParams.get('type');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [coursesTaught, setCoursesTaught] = useState<string[]>([]);
  const [selectedValue, setSelectedValue] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<EmployeeModel>({
    employeeName: '',
    phone: '',
    email: '',
    address: '',
    isAdmin: false,
    qualifications: '',
    designation: '',
    coursesTaught: [],
    profileImage: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false); // State for confirm password visibility
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [error,setError] = useState<string>("");
  const [screenLoading, setScreenLoading] = useState<boolean>(true);
  const Courses = useSelector(GetCourses);
  const employees = useSelector(GetEmployees);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const encodedProduct = searchParams.get('type');
      const encodedid = searchParams.get('Id');
      if (encodedProduct === 'edit') {
        const employeeEditDetails = employees.find((obj: any) => obj.id === encodedid);
        if (employeeEditDetails) {
          setImagePreview(employeeEditDetails.profileImage);
          setCoursesTaught(employeeEditDetails.coursesTaught);
          setInitialValues(employeeEditDetails);
        }
      }
    } catch (error) {
      console.error("Error fetching employee details", error);
    } finally {
      setScreenLoading(false);
    }
  }, [location.search, employees]);

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(e.target.value === 'true'); // Convert string to boolean
  };

  const handleFormSubmit = async (values: any) => {
    const formValues = { ...values, coursesTaught };

    if (encodedProduct === 'edit') {
      setLoading(true);

      const querySnapshot =  await getDocs(query(collection(db,"employees"),where("email","==",formValues.email)))
      if(querySnapshot.size===1){
        console.log("ffffffffffffffffffuuuuuuuuuuuuuccccccccccckkkkkkkkkkkkkk");
        if(imageFile){
          
          const filePath = decodeURIComponent(initialValues.profileImage!.split(baseUrl)[1].split("?")[0]);
          const desertRef = ref(databaseStorage, filePath);
          console.log(filePath);
          await deleteObject(desertRef);

          const imageUrl = await uploadImage(imageFile!, values.employeeName!, "employees");
          await dispatch(editEmployee({ ...formValues, profileImage: imageUrl }))
        }else{
          await dispatch(editEmployee({ ...formValues, profileImage: initialValues.profileImage }))
        }
        openSubmit();
      }else{
        setError("Email already Exists");
      }
      setLoading(false);
    } else {
      if (coursesTaught.length === 0) {
        console.log("fill courses taught");
        open();
        return;
      }
      setLoading(true);

      const querySnapshot =  await getDocs(query(collection(db,"employees"),where("email","==",formValues.email)))


      if(querySnapshot.size===0){
        const imageUrl = await uploadImage(imageFile!, values.employeeName!, "employees");
        await dispatch(createEmployee({ ...formValues, profileImage: imageUrl, isAdmin: selectedValue }));
        openSubmit();
      }else{
        setError("Email already Exists");
      }
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    }
  };

  const handleDeleteCourse = (index: number) => {
    setCoursesTaught(coursesTaught.filter((_, i) => i !== index));
  };


  let [isOpen, setIsOpen] = useState(false)

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }


  let [isOpenSubmit, setIsOpenSubmit] = useState(false)

  function openSubmit() {
    setIsOpenSubmit(true)
  }

  function closeSubmit() {
    setIsOpenSubmit(false)
    navigate('/admin/employee_management');
  }

  return (
    <>
      {screenLoading ? (
        <div className="w-full h-full flex justify-center items-center mx-auto p-6 rounded shadow-md lg:px-24">
          <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
        </div>
      ) : (
        <div className="w-full h-full overflow-auto mx-auto p-6 rounded shadow-md lg:px-24">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">{encodedProduct === 'edit' ? "Edit employee" : "Create New Employee"}</h1>
          <Formik
            onSubmit={handleFormSubmit}
            initialValues={initialValues}
            validationSchema={checkoutSchema}
            enableReinitialize
          >
            {({
              values,
              errors,
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label htmlFor="employeeName" className="font-semibold">Employee Name</label>
                    <input
                      placeholder='Enter Name'
                      type="text"
                      id="employeeName"
                      name="employeeName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.employeeName}
                      className={`p-2 border rounded-md  dark:text-black ${touched.employeeName && errors.employeeName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.employeeName && errors.employeeName && <div className="text-red-500 text-sm mt-1">{errors.employeeName}</div>}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="phone" className="font-semibold">Phone</label>
                    <input
                      placeholder='Enter Phone No'
                      type="text"
                      id="phone"
                      name="phone"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.phone}
                      className={`p-2 border rounded-md dark:text-black ${touched.phone && errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.phone && errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label htmlFor="email" className="font-semibold">Email</label>
                    <input
                      placeholder='Email'
                      type="text"
                      id="email"
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      className={`p-2 border rounded-md dark:text-black ${touched.email && errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.email && errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="address" className="font-semibold">Address</label>
                    <input
                      placeholder='Enter Address'
                      type="text"
                      id="address"
                      name="address"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.address}
                      className={`p-2 border rounded-md dark:text-black ${touched.address && errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.address && errors.address && <div className="text-red-500 text-sm mt-1">{errors.address}</div>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label htmlFor="qualifications" className="font-semibold">Qualifications</label>
                    <input
                      placeholder='Enter Qualifications'
                      type="text"
                      id="qualifications"
                      name="qualifications"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.qualifications}
                      className={`p-2 border rounded-md dark:text-black ${touched.qualifications && errors.qualifications ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.qualifications && errors.qualifications && <div className="text-red-500 text-sm mt-1">{errors.qualifications}</div>}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="designation" className="font-semibold">Designation</label>
                    <input
                      placeholder='Enter Designation'
                      type="text"
                      id="designation"
                      name="designation"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.designation}
                      className={`p-2 border rounded-md dark:text-black ${touched.designation && errors.designation ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.designation && errors.designation && <div className="text-red-500 text-sm mt-1">{errors.designation}</div>}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="coursesTaught" className="font-semibold">Courses Taught</label>
                  <div className='flex flex-row'>
                  <select
                    id="courseTaught"
                    name="courseTaught"
                    value=""
                    onChange={(e) => {
                      const newCourse = e.target.value;
                      setCoursesTaught([...coursesTaught, newCourse]);
                    }}
                    className="p-2 border rounded-md border-gray-400 dark:text-black"
                  >
                    <option value="" disabled>Select Course</option>
                    {Courses.map((course: CourseModel) => (
                      <option key={course.id} value={course.courseName}>{course.courseName}</option>
                    ))}
                  </select>
                  </div>
                  <div className='flex flex-col'>
                    {coursesTaught.map((course, index) => (
                      <div className='flex flex-row m-2' key={index}>
                        <p className="mr-4">{course}</p>
                        <button className="hover:bg-slate-200 rounded-full" onClick={() => { handleDeleteCourse(index) }}>
                          <DeleteForeverIcon color='warning' fontSize='small' />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="profileImage" className="font-semibold ">Upload Profile Image</label>
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={(event) => {
                      handleImageChange(event);
                      setFieldValue('profileImage', event.currentTarget.files?.[0]);
                    }}
                    className="hidden dark:text-black" />
                  <button
                    type="button"
                    onClick={() => document.getElementById('profileImage')?.click()}
                    className="mt-2 px-2 py-2 w-28 bg-blue-500 text-white rounded">Choose File</button>
                  {touched.profileImage && errors.profileImage && <div className="text-red-500 text-sm mt-1">{errors.profileImage}</div>}
                </div>
                {imagePreview && (
                  <div className="mt-4">
                    <div className="flex justify-start">
                      <img
                        src={imagePreview as string}
                        alt="Preview"
                        className="max-h-52 rounded-t-md border border-gray-300"
                      />
                    </div>
                    <div className="rounded-b-md">
                      <button className="rounded-b-md p-3 bg-slate-300 hover:bg-slate-200 dark:text-white dark:bg-slate-700 dark:hover:bg-slate-500" onClick={() => { setImagePreview(null) }}>
                        <DeleteForeverIcon />
                      </button>
                    </div>
                  </div>
                )}
                <div className='flex flex-col'>
                  <label htmlFor="IsAdmin" className="font-semibold">Admin</label>
                  <div className='flex flex-ow'>
                    <div className='mr-3'>
                      <label>
                        <input
                          placeholder='Enter Admin'
                          className=''
                          type="radio"
                          name="truefalse"
                          value="true"
                          checked={selectedValue === true}
                          onChange={handleRadioChange}
                        />
                        True
                      </label>
                    </div>
                    <div className='mr-3 '>
                      <label>
                        <input
                          
                          type="radio"
                          name="truefalse"
                          value="false"
                          checked={selectedValue === false}
                          onChange={handleRadioChange}
                        />
                        False
                      </label>
                    </div>
                  </div>
                  <p>Selected value: {selectedValue !== null ? selectedValue.toString() : 'Please select'}</p>
                </div>
                <div className="flex flex-col relative">
                  <label htmlFor="password" className="font-semibold">Password</label>
                  <input
                    placeholder='Enter Password'
                    type={showPassword ? "text" : "password"} // Toggle input type based on showPassword state
                    id="password"
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    className={`p-2 border rounded-md dark:text-black ${touched.password && errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-11 transform -translate-y-1/2"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                  {touched.password && errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                </div>
                <div className="flex flex-col relative">
                  <label htmlFor="confirmPassword" className="font-semibold">Confirm Password</label>
                  <input
                    placeholder='Confirm Password'
                    type={showConfirmPassword ? "text" : "password"} // Toggle input type based on showConfirmPassword state
                    id="confirmPassword"
                    name="confirmPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.confirmPassword}
                    className={`p-2 border rounded-md dark:text-black ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-11 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </button>
                  {touched.confirmPassword && errors.confirmPassword && <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>}
                </div>
                {
                  error!=="" && (
                    <p className='text-red-500'>{error}</p>
                  )
                }
                <div className="flex justify-end">
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md shadow">{loading ? `${encodedProduct === 'edit' ? "Updating..." : "Creating..."}` : `${encodedProduct === 'edit' ? "Edit Employee" : "Create New Employee"}`}</button>
                </div>


              </form>
            )}
          </Formik>
        </div>
      )}
       <NotificationModal isOpen={isOpen} onClose={close} heading='Missing Course' body='Please enter select one course to create a Employee.' type='none'/>
        
      <NotificationModal isOpen={isOpenSubmit} onClose={closeSubmit} heading={encodedProduct==="edit"?"Edit Complete":'Employee Created'} body={encodedProduct==="edit"?"Employee has been edited successfully.":'New Employee has been created successfully.'} type='none'/>

    </>
  );
};

const checkoutSchema = yup.object().shape({
  employeeName: yup.string().required('required'),
  phone: yup.string().required('required'),
  email: yup.string().email('invalid email').required('required'),
  address: yup.string().required('required'),
  qualifications: yup.string().required('required'),
  designation: yup.string().required('required'),
  password: yup.string().required('required').min(8, 'Password is too short - should be 8 chars minimum.'),
  confirmPassword: yup.string().oneOf([yup.ref('password'), ""], 'Passwords must match').required('required'),
  profileImage: yup.mixed().required('required'),
});

export default AdminAddEmployeeScreen;
