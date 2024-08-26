import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { CourseModel,} from '../../../Models/CourceModel';
import { useSelector } from 'react-redux';
import { Categories } from '../../../redux/CategorySlice';
import CategoryModel from '../../../Models/CategoryModel';
import { useAppDispatch } from '../../../redux/PersistanceStorage';
import { CreateCourse, GetCourses, editCourse } from '../../../redux/CourcesSlice';
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { databaseStorage } from '../../../firebase_config';
import { v4 as uuidv4 } from 'uuid';
import { useLocation, useNavigate } from 'react-router-dom';
import NotificationModal from '../AdminComponents/NotificationModal';

const uploadImage = async (image: File, name: string, folder: string): Promise<string> => {
  if (!image) return '';
  const imageRef = ref(databaseStorage, `${folder}/${name + uuidv4()}`);
  const snapshot = await uploadBytes(imageRef, image);
  console.log(getDownloadURL(snapshot.ref));
  return await getDownloadURL(snapshot.ref);
};

const AdminAddCourseScreen: React.FC = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const encodedProduct = searchParams.get('type');


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
    navigate('/admin/manage_courses');
  }

  const baseUrl = "https://firebasestorage.googleapis.com/v0/b/divya-kala-academy.appspot.com/o/";
  const categories = useSelector(Categories);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sessions, setSessions] = useState<string[]>([]);
  const [performance, setPerformance] = useState<string[]>(["Grade","TotalClassesAttended","TotalClassesTaken","totalMarks","totalMarksObtained","startDate","endDate"]);
  const [initialValues, setInitialValues] = useState<CourseModel>({
    category: '',
    courseName: '',
    description: '',
    online: false,
    offline: false,
    price: '',
    ageLimit: '',
    image: '',
    sessions: [],
    showActions: false,
    coursePerformance: [],
    courseCountry:"",
    coursesSold:0
  });
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [screenLoading, setScreenLoading] = useState<boolean>(true);
  const Courses = useSelector(GetCourses);

  useEffect(() => {
    try {
      const encodedProduct = searchParams.get('type');
      const encodedid = searchParams.get('Id');
      if (encodedProduct === 'edit') {
        const courseEditDetails = Courses.find((obj: CourseModel) => obj.id === encodedid);        
        if (courseEditDetails) {
          setImagePreview(courseEditDetails.image);
          setSessions(courseEditDetails.sessions);
          setPerformance(courseEditDetails.coursePerformance);
          setInitialValues(courseEditDetails);
        }
      }
    } catch (error) {
      console.error("Error fetching course details", error);
    } finally {
      setScreenLoading(false);
    }
  }, [location.search, Courses]);



  const handleFormSubmit = async (values: any) => {
    const formValues = { ...values, sessions: sessions, coursePerformance: performance };

    if(encodedProduct==='edit'){
      console.log(initialValues);
      setLoading(true);
      if (imageFile){
        
        const filePath = decodeURIComponent(initialValues.image!.split(baseUrl)[1].split("?")[0]);
        const desertRef = ref(databaseStorage, filePath);
        console.log(filePath);
        await deleteObject(desertRef);

        const imageUrl = await uploadImage(imageFile!,"Course", "courses");
        await dispatch(editCourse({ ...formValues, image: imageUrl  }))
      }
      else{
        await dispatch(editCourse({ ...formValues, image: initialValues.image  }))
      }
      setLoading(false);
      openSubmit();

    }
    else{
      if (sessions.length === 0) {
        open();
        console.log("fill sessions");
        return;
      }
      setLoading(true);
      const imageUrl = await uploadImage(imageFile!, "Course", "courses");
      await dispatch(CreateCourse({ ...formValues, image: imageUrl }));
      setLoading(false);
      openSubmit();
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

  const handleAddSessions = () => {
    const inputElement = document.getElementById('session') as HTMLInputElement;
    if (inputElement) {
      const newSession = inputElement.value;
      setSessions([...sessions, newSession]);
      inputElement.value = "";
    }
  };

  const handleAddPerformance = () => {
    const inputElement = document.getElementById('performance') as HTMLInputElement;
    if (inputElement) {
      const newPerformance = inputElement.value;
      if (!performance.includes(newPerformance)) {
        setPerformance([...performance, newPerformance]);
      }
      inputElement.value = "";
    }
  };

  const handleDeletePerformance = (index: number) => {
    setPerformance(performance.filter((_, i) => i !== index));
  };

  const handleDeleteSession = (index: number) => {
    setSessions(sessions.filter((_, i) => i !== index));
  };

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
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">{encodedProduct==='edit'?"Edit Course":"Create New Course"}</h1>
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
              <form onSubmit={handleSubmit} className="space-y-6 ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label htmlFor="category" className="font-semibold">Category</label>
                    <select
                      id="category"
                      name="category"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.category}
                      className={`p-2 border rounded-md  dark:text-gray-600 ${touched.category && errors.category ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Category</option>
                      {categories.map((obj: CategoryModel) => (
                        <option value={obj.name} key={obj.id}>{obj.name}</option>
                      ))}
                    </select>
                    {touched.category && errors.category && <div className="text-red-500 text-sm mt-1">{errors.category}</div>}
                  </div>
                  <div className="flex flex-col">
                    <label htmlFor="courseName" className="font-semibold">Course Name</label>
                    <input
                      type="text"
                      id="courseName"
                      name="courseName"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.courseName}
                      className={`p-2 border rounded-md dark:text-gray-600 ${touched.courseName && errors.courseName ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {touched.courseName && errors.courseName && <div className="text-red-500 text-sm mt-1">{errors.courseName}</div>}
                  </div>
                </div>
                <div className="flex flex-col ">
                  <label htmlFor="description" className="font-semibold">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.description}
                    rows={4}
                    className={`p-2 border rounded-md dark:text-gray-600 ${touched.description && errors.description ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {touched.description && errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <label htmlFor="courseAvailability" className="font-semibold">Course Availability :</label>
                  <div className="flex flex-row ">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="online"
                        checked={values.online}
                        onChange={handleChange}
                        className="mr-2 h-4 w-4 rounded-xl dark:text-gray-600"
                      />
                      <label className="font-semibold">Online</label>
                    </div>
                    <div className="flex items-center ml-4">
                      <input
                        type="checkbox"
                        name="offline"
                        checked={values.offline}
                        onChange={handleChange}
                        className="mr-2 h-4 w-4 dark:text-gray-600"
                      />
                      <label className="font-semibold">Offline</label>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="sessions" className="font-semibold">Sessions</label>
                  <div className='flex flex-row '>
                    <input
                      type="text"
                      id="session"
                      name="session"
                      onBlur={handleBlur}
                      className={`p-2 border rounded-md dark:text-gray-600 border-gray-400 ${touched.sessions && errors.sessions ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    <button className="py-2 px-4 rounded-md border-2 border-blue-300 bg-blue-400 hover:bg-blue-200 ml-4" onClick={handleAddSessions} type='button'>
                      ADD
                    </button>
                  </div>
                  <div className='flex flex-col'>
                    {sessions.map((session, index) => (
                      <div className='flex flex-row m-2' key={index}>
                        <p className="mr-4">{session}</p>
                        <button className="hover:bg-slate-200 rounded-full" onClick={() => { handleDeleteSession(index) }}><DeleteForeverIcon color='warning' fontSize='small' /></button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="performance" className="font-semibold">Performance</label>
                  <div className='flex flex-row '>
                    <input
                      type="text"
                      id="performance"
                      name="performance"
                      onBlur={handleBlur}
                      className={`p-2 border rounded-md border-gray-400 dark:text-gray-600`}
                    />
                    <button className="py-2 px-4 rounded-md border-2 border-blue-300 bg-blue-400 hover:bg-blue-200 ml-4" onClick={handleAddPerformance} type='button'>
                      ADD
                    </button>
                  </div>
                  <div className='flex flex-col'>
                    {performance.map((perf, index) => (
                      <div className='flex flex-row m-2' key={index}>
                        <p className="mr-4">{perf}</p>
                        <button className="hover:bg-slate-200 rounded-full dark:text-gray-600" onClick={() => { handleDeletePerformance(index) }}><DeleteForeverIcon color='warning' fontSize='small' /></button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="price" className="font-semibold">Price</label>
                  <input
                    type="text"
                    id="price"
                    name="price"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.price}
                    className={`p-2 border rounded-md dark:text-gray-600 ${touched.price && errors.price ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {touched.price && errors.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
                </div>
                <div className="flex flex-col">
                  <label htmlFor="ageLimit" className="font-semibold">Age Limit</label>
                  <input
                    type="text"
                    id="ageLimit"
                    name="ageLimit"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.ageLimit}
                    className={`p-2 border rounded-md dark:text-gray-600 ${touched.ageLimit && errors.ageLimit ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {touched.ageLimit && errors.ageLimit && <div className="text-red-500 text-sm mt-1">{errors.ageLimit}</div>}
                </div>
                <div className="flex flex-col">
                    <label htmlFor="courseCountry" className="font-semibold">Select Course Country</label>
                    <select
                      id="courseCountry"
                      name="courseCountry"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.courseCountry}
                      className={`p-2 border rounded-md dark:text-gray-600 ${touched.courseCountry && errors.courseCountry ? 'border-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Country</option>
                      <option value="all">All</option>
                      <option value="India">India</option>
                      <option value="other">Other</option>
                    </select>
                    {touched.courseCountry && errors.courseCountry && <div className="text-red-500 text-sm mt-1">{errors.courseCountry}</div>}
                  </div>

                <div className="flex flex-col">
                  <label htmlFor="image" className="font-semibold ">Upload Image</label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={(event) => {
                      handleImageChange(event);
                      setFieldValue('image', event.currentTarget.files?.[0]);
                    }}
                    className="hidden" />
                  <button
                    type="button"
                    onClick={() => document.getElementById('image')?.click()}
                    className="mt-2 px-2 py-2 w-28 bg-blue-500 text-white rounded">Choose File</button>
                  {touched.image && errors.image && <div className="text-red-500 text-sm mt-1">{errors.image}</div>}
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
                <div className="flex justify-end">
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md shadow">{loading ? `${encodedProduct==='edit'?"Updating...":"Creating..."}` : `${encodedProduct==='edit'?"Edit Course":"Create New Course"}`}</button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      )}


          <NotificationModal isOpen={isOpen} onClose={close} heading='Missing Sessions' body='Please enter atleast one session to create a course.' type='none'/>
        
          <NotificationModal isOpen={isOpenSubmit} onClose={closeSubmit} heading={encodedProduct==="edit"?"Edit Complete":'Course Created'} body={encodedProduct==="edit"?"Course has been edited successfully.":'New Course has been created successfully.'} type='none'/>
    </>
  );
};

const checkoutSchema = yup.object().shape({
  category: yup.string().required('required'),
  courseName: yup.string().required('required'),
  description: yup.string().required('required'),
  online: yup.boolean(),
  offline: yup.boolean(),
  price: yup.number().required('required').positive('must be a positive number'),
  ageLimit: yup.string().required('required'),
  image: yup.mixed().required('required'),
  courseCountry: yup.string().required('required'),
});

export default AdminAddCourseScreen;
