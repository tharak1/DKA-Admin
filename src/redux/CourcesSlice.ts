import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {CourseModel} from "../Models/CourceModel";
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase_config";

interface CoursesState {
    Courses: CourseModel[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState : CoursesState ={
    Courses:[],
    status: 'idle',
    error: null,
}; 

export const fetchCourses = createAsyncThunk(
    'course/fetchCourses',
    async()=>{
        const docRef = collection(db, "courses");
        const CoursesSnap = await getDocs(docRef);

        const courses: CourseModel[] = CoursesSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as CourseModel[]; 

        return courses;
    }
);

export const CreateCourse = createAsyncThunk(
    'course/CreateCourse',
    async(CourseData:CourseModel)=>{
        const docRef = await addDoc(collection(db, "courses"),CourseData);

        return {id:docRef.id,...CourseData}
    }
);

export const editCourse = createAsyncThunk(
    'course/editCourse',
    async(UpdatedCourseData:CourseModel)=>{
        const courseId = UpdatedCourseData.id; 
        const courseRef = doc(db, 'courses',courseId!);
        setDoc(courseRef,UpdatedCourseData, { merge: true });

        return UpdatedCourseData;
    }
);

export const deleteCourse = createAsyncThunk(
    'course/deleteCourse',
    async(courseId:string)=>{
        await deleteDoc(doc(db, "courses", courseId!));
        return courseId;
    }
)




const CourseSlice = createSlice({
    name:'course',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchCourses.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.Courses = action.payload;
        })
        .addCase(fetchCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
        })


        .addCase(CreateCourse.pending, (state) => {
        state.status = 'loading';
        })
        .addCase(CreateCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.Courses.push(action.payload);
        })
        .addCase(CreateCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
        })


        .addCase(editCourse.pending, (state) => {
        state.status = 'loading';
        })
        .addCase(editCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedCourse = action.payload;
        state.Courses = state.Courses.map((course) =>
            course.id === updatedCourse.id ? updatedCourse : course
          );
        })
        .addCase(editCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
        })

        .addCase(deleteCourse.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(deleteCourse.fulfilled, (state, action) => {
            state.Courses = state.Courses.filter((course) => course.id !== action.payload);
        })
        .addCase(deleteCourse.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message!;
        })

    }
});

export const GetCourses  = (state:any) => state.course.Courses;


export default CourseSlice.reducer;