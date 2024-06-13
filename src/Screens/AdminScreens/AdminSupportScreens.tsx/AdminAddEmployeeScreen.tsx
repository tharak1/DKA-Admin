import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../redux/PersistanceStorage';
import { GetCourses } from '../../../redux/CourcesSlice';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { databaseStorage } from '../../../firebase_config';
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from 'react-router-dom';
import LoadingScreen from '../../../Components/LoadingScreen';
import { MenuItem, Select } from '@mui/material';
import { CourseModel } from '../../../Models/CourceModel';
import { EmployeeModel } from '../../../Models/EmployeeModel';
import { GetEmployees, createEmployee, editEmployee } from '../../../redux/EmployeeSlice';

const uploadImage = async (image: File, name: string, folder: string): Promise<string> => {
  if (!image) return '';
  const imageRef = ref(databaseStorage, `${folder}/${name + uuidv4()}`);
  const snapshot = await uploadBytes(imageRef, image);
  console.log(getDownloadURL(snapshot.ref));
  return await getDownloadURL(snapshot.ref);
};

const AdminAddEmployeeScreen: React.FC = () => {
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
    isAdmin:false,
    qualifications: '',
    designation: '',
    coursesTaught: [],
    profileImage: '',
    password: '',
    confirmPassword: '',
  });
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [screenLoading, setScreenLoading] = useState<boolean>(true);
  const Courses = useSelector(GetCourses);
  const employees = useSelector(GetEmployees);

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
      await dispatch(editEmployee({ ...formValues, profileImage: initialValues.profileImage }))
      setLoading(false);
    } else {
      if (coursesTaught.length === 0) {
        console.log("fill courses taught");
        return;
      }
      setLoading(true);

      const imageUrl = await uploadImage(imageFile!, values.employeeName!, "employees");
      await dispatch(createEmployee({ ...formValues, profileImage: imageUrl,isAdmin:selectedValue }));
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

  return (
    <>
      {screenLoading ? (
        <LoadingScreen />
      ) : (
        <div className="w-full h-full overflow-auto mx-auto p-6 bg-white rounded shadow-md lg:px-24">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Create New Employee</h1>
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
                      type="text"
                      id="employeeName"
                      name="employeeName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.employeeName}
                      className={`p-2 border rounded-md ${touched.employeeName && errors.employeeName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.employeeName && errors.employeeName && <div className="text-red-500 text-sm mt-1">{errors.employeeName}</div>}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="phone" className="font-semibold">Phone</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.phone}
                      className={`p-2 border rounded-md ${touched.phone && errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.phone && errors.phone && <div className="text-red-500 text-sm mt-1">{errors.phone}</div>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label htmlFor="email" className="font-semibold">Email</label>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.email}
                      className={`p-2 border rounded-md ${touched.email && errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.email && errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="address" className="font-semibold">Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.address}
                      className={`p-2 border rounded-md ${touched.address && errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.address && errors.address && <div className="text-red-500 text-sm mt-1">{errors.address}</div>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label htmlFor="qualifications" className="font-semibold">Qualifications</label>
                    <input
                      type="text"
                      id="qualifications"
                      name="qualifications"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.qualifications}
                      className={`p-2 border rounded-md ${touched.qualifications && errors.qualifications ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.qualifications && errors.qualifications && <div className="text-red-500 text-sm mt-1">{errors.qualifications}</div>}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="designation" className="font-semibold">Designation</label>
                    <input
                      type="text"
                      id="designation"
                      name="designation"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.designation}
                      className={`p-2 border rounded-md ${touched.designation && errors.designation ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.designation && errors.designation && <div className="text-red-500 text-sm mt-1">{errors.designation}</div>}
                  </div>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="coursesTaught" className="font-semibold">Courses Taught</label>
                    <div className='flex flex-row'>
                        <Select
                        id="courseTaught"
                        name="courseTaught"
                        value=""
                        onChange={(e) => {
                            const newCourse = e.target.value;
                            setCoursesTaught([...coursesTaught, newCourse]);
                        }}
                        displayEmpty
                        className="p-2 border rounded-md border-gray-400"
                        >
                        <MenuItem value="" disabled>Select Course</MenuItem>
                        {Courses.map((course:CourseModel) => (
                            <MenuItem key={course.id} value={course.courseName}>{course.courseName}</MenuItem>
                        ))}
                        </Select>
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
                    className="hidden" />
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

                  <div>
                        <h2>Choose True or False</h2>
                        <label>
                          <input
                            type="radio"
                            name="truefalse"
                            value="true"
                            checked={selectedValue === true}
                            onChange={handleRadioChange}
                          />
                          True
                        </label>
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
                        <p>Selected value: {selectedValue !== null ? selectedValue.toString() : 'Please select'}</p>
                      </div>
                <div className="flex flex-col">
                  <label htmlFor="password" className="font-semibold">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.password}
                    className={`p-2 border rounded-md ${touched.password && errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {touched.password && errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="confirmPassword" className="font-semibold">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.confirmPassword}
                    className={`p-2 border rounded-md ${touched.confirmPassword && errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {touched.confirmPassword && errors.confirmPassword && <div className="text-red-500 text-sm mt-1">{errors.confirmPassword}</div>}
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md shadow">{loading ? "Creating..." : "Create New Employee"}</button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      )}
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
