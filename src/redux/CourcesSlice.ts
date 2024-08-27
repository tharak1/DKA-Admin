import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {CourseModel} from "../Models/CourceModel";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase_config";


const convertListToObject = (list: string[]): Record<string, string> => {
    return list.reduce((acc, item) => {
        if(item === "Grade"){
            acc[item] = "";
        }
        else{
            acc[item] = "0";
        }
        return acc;
    }, {} as Record<string, string>);
};

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
    async (CourseData: CourseModel, { rejectWithValue }) => {
      try {
        const docRef = await addDoc(collection(db, 'courses'), CourseData);

        await setDoc(doc(db,'performances',docRef.id),{performanceTemplate:convertListToObject(CourseData.coursePerformance!),students:[]});
        await setDoc(doc(db,'regStuByCourse',docRef.id),{couseName:CourseData.courseName,students:[]})

        return { id: docRef.id, ...CourseData };
      } catch (error) {
        console.error("Error creating course:", error);
        return rejectWithValue(error);
      }
    }
  );

// export const editCourse = createAsyncThunk(
//     'course/editCourse',
//     async(UpdatedCourseData:CourseModel)=>{
//         const courseId = UpdatedCourseData.id; 
//         const courseRef = doc(db, 'courses',courseId!);

//         await updateDoc(doc(db,'performances',UpdatedCourseData.id!),{performanceTemplate:convertListToObject(UpdatedCourseData.coursePerformance!)});
//         await setDoc(courseRef,UpdatedCourseData, { merge: true });
//         return UpdatedCourseData;
//     }
// );

export const editCourse = createAsyncThunk(
    'course/editCourse',
    async (UpdatedCourseData: CourseModel) => {
        const courseId = UpdatedCourseData.id;
        const courseRef = doc(db, 'courses', courseId!);

        // Update the course data in Firestore
        await setDoc(courseRef, UpdatedCourseData, { merge: true });

        // Fetch the performance document associated with the course
        const performanceRef = doc(db, 'performances', courseId!);
        const performanceSnapshot = await getDoc(performanceRef);

        if (performanceSnapshot.exists()) {
            const performanceData = performanceSnapshot.data();

            // Update the performance template
            const updatedPerformanceTemplate = convertListToObject(UpdatedCourseData.coursePerformance!);
            performanceData.performanceTemplate = updatedPerformanceTemplate;

            // Update all students in the performance document with the new template values
            const updatedStudents = performanceData.students.map((student: any) => ({
                ...student,
                ...updatedPerformanceTemplate,
            }));

            // Save the updated performance data
            await updateDoc(performanceRef, {
                performanceTemplate: updatedPerformanceTemplate,
                students: updatedStudents
            });
        }

        return UpdatedCourseData;
    }
);


export const deleteCourse = createAsyncThunk(
    'course/deleteCourse',
    async(courseId:string)=>{
        await deleteDoc(doc(db, "courses", courseId!));
        return courseId;
    }
);







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