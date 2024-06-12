import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { CourseModel,} from '../../Models/CourceModel';
import { useSelector } from 'react-redux';
import { Categories } from '../../redux/CategorySlice';
import CategoryModel from '../../Models/CategoryModel';
import { useAppDispatch } from '../../redux/PersistanceStorage';
import { CreateCourse, GetCourses, editCourse } from '../../redux/CourcesSlice';
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { databaseStorage } from '../../firebase_config';
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from 'react-router-dom';
import LoadingScreen from '../../Components/LoadingScreen';

const uploadImage = async (image: File, name: string, folder: string): Promise<string> => {
  if (!image) return '';
  const imageRef = ref(databaseStorage, `${folder}/${name + uuidv4()}`);
  const snapshot = await uploadBytes(imageRef, image);
  console.log(getDownloadURL(snapshot.ref));
  return await getDownloadURL(snapshot.ref);
};

const AdminAddCourseScreen: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const encodedProduct = searchParams.get('type');

  const categories = useSelector(Categories);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [sessions, setSessions] = useState<string[]>([]);
  const [performance, setPerformance] = useState<string[]>([]);
  const [initialValues, setInitialValues] = useState<CourseModel>({
    category: '',
    courseName: '',
    description: '',
    online: false,
    offline: false,
    price: '',
    image: '',
    sessions: [],
    showActions: false,
    coursePerformance: [],
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
      await dispatch(editCourse({ ...formValues, image: initialValues.image  }))
      setLoading(false);
    }
    else{
      if (sessions.length === 0) {
        console.log("fill sessions");
        return;
      }
      setLoading(true);
      const imageUrl = await uploadImage(imageFile!, values.courseName!, "courses");
      await dispatch(CreateCourse({ ...formValues, image: imageUrl }));
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
      setPerformance([...performance, newPerformance]);
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
        <LoadingScreen />
      ) : (
        <div className="w-full h-full overflow-auto mx-auto p-6 bg-white rounded shadow-md lg:px-24">
          <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Create New Course</h1>
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
                    <label htmlFor="category" className="font-semibold">Category</label>
                    <select
                      id="category"
                      name="category"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.category}
                      className={`p-2 border rounded-md ${touched.category && errors.category ? 'border-red-500' : 'border-gray-300'}`}
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
                      className={`p-2 border rounded-md ${touched.courseName && errors.courseName ? 'border-red-500' : 'border-gray-300'}`}
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
                    className={`p-2 border rounded-md ${touched.description && errors.description ? 'border-red-500' : 'border-gray-300'}`}
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
                        className="mr-2 h-4 w-4 rounded-xl"
                      />
                      <label className="font-semibold">Online</label>
                    </div>
                    <div className="flex items-center ml-4">
                      <input
                        type="checkbox"
                        name="offline"
                        checked={values.offline}
                        onChange={handleChange}
                        className="mr-2 h-4 w-4"
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
                      className={`p-2 border rounded-md border-gray-400 ${touched.sessions && errors.sessions ? 'border-red-500' : 'border-gray-300'}`}
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
                      className={`p-2 border rounded-md border-gray-400`}
                    />
                    <button className="py-2 px-4 rounded-md border-2 border-blue-300 bg-blue-400 hover:bg-blue-200 ml-4" onClick={handleAddPerformance} type='button'>
                      ADD
                    </button>
                  </div>
                  <div className='flex flex-col'>
                    {performance.map((perf, index) => (
                      <div className='flex flex-row m-2'>
                        <p className="mr-4">{perf}</p>
                        <button className="hover:bg-slate-200 rounded-full" onClick={() => { handleDeletePerformance(index) }}><DeleteForeverIcon color='warning' fontSize='small' /></button>
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
                    className={`p-2 border rounded-md ${touched.price && errors.price ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {touched.price && errors.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
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
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md shadow">{loading ? "Creating..." : "Create New Course"}</button>
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
  category: yup.string().required('required'),
  courseName: yup.string().required('required'),
  description: yup.string().required('required'),
  online: yup.boolean(),
  offline: yup.boolean(),
  price: yup.number().required('required').positive('must be a positive number'),
  image: yup.mixed().required('required'),
});

export default AdminAddCourseScreen;
