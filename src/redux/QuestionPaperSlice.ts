import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { QuestionPaper } from "../Models/ExamModel";
import { deleteObject, ref } from "firebase/storage";
import { databaseStorage, db } from "../firebase_config";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";

const baseUrl = "https://firebasestorage.googleapis.com/v0/b/divya-kala-academy.appspot.com/o/";

interface QuestionPaperSlice{
    QuestionPapers: QuestionPaper[];
    TempQuestionPapers: QuestionPaper[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState : QuestionPaperSlice ={
    QuestionPapers:[],
    TempQuestionPapers:[],
    status: 'idle',
    error: null,
};

export const deleteTempQuestionPaperById = createAsyncThunk(
    'questionPaper/deleteTempQuestionPaperById',
    async(QP:QuestionPaper)=>{
        QP.questions.map(async(obj)=>
            {
                if(obj.questionFormat === 'image'){
                    const filePath = decodeURIComponent(obj.question.split(baseUrl)[1].split("?")[0]);
                    const desertRef = ref(databaseStorage, filePath);
                    console.log(filePath);
                    
                    await deleteObject(desertRef);
                }
                if(obj.questionType ==='multi Correct question ans image' || obj.questionType === 'single Correct question ans image'){
                    obj.options.map(async(optobj)=>{
                        const filePath = decodeURIComponent(optobj.image!.split(baseUrl)[1].split("?")[0]);
                        const desertRef = ref(databaseStorage, filePath);
                        console.log(filePath);

                        await deleteObject(desertRef);
                    })
                }
        })
        QP.questionsImages?.map(async(obj)=>{
            const filePath = decodeURIComponent(obj.preview!.split(baseUrl)[1].split("?")[0]);
            const desertRef = ref(databaseStorage, filePath);
            console.log(filePath);
            await deleteObject(desertRef);
        })

        return QP.id;
    }
);

export const uploadQuestionPaper = createAsyncThunk(
    'questionPaper/uploadQuestionPaper',
    async(QP:QuestionPaper)=>{
        console.log(QP);
        
        await setDoc(doc(db, "Question-Paper", QP.id!), {...QP,editing:false});
        await setDoc(doc(db, "Online-exam-results", QP.id!),{course:QP.course,startDate:QP.startDate,startTime:QP.startTime,endDate:QP.endDate,endTime:QP.endTime,duration:QP.duration,totalMarks:QP.totalMarks,examType:QP.examType,noOfQuestions:QP.noOfQuestions,students:[]})
        return QP;
    }
)

export const fetchQuestionPapers = createAsyncThunk(
    'questionPaper/fetchQuestionPapers',
    async()=>{
        const docRef = collection(db, "Question-Paper");
        const CoursesSnap = await getDocs(docRef);
        const questionPapers: QuestionPaper[] = CoursesSnap.docs.map((doc) => ({
            ...doc.data(),
            uploaded:true,
        })) as QuestionPaper[]; 

        return questionPapers;
    }
)

export const editFetchedPaper = createAsyncThunk(
    'questionPaper/editFetchedPaper',
    async(QP:QuestionPaper)=>{
        await deleteDoc(doc(db, "Question-Paper", QP.id!));
        return QP;
    }
)



const QuestionPaperSlice = createSlice({
    name:'questionPaper',
    initialState,
    reducers:{
        addTempQuestionPaper: (state, action: PayloadAction<QuestionPaper>) => {
            const exists = state.TempQuestionPapers.some(questionPaper => questionPaper.id === action.payload.id);
            if (!exists) {
                state.TempQuestionPapers.push(action.payload);
            }
        },
        replaceTempQuestionPaperById: (state, action: PayloadAction<{ id: string, newQuestionPaper: QuestionPaper }>) => {
            const { id, newQuestionPaper } = action.payload;
            const index = state.TempQuestionPapers.findIndex(questionPaper => questionPaper.id === id);
            if (index !== -1) {
            state.TempQuestionPapers[index] = newQuestionPaper;
            }
        },
        // editFetchedPaper:(state, action: PayloadAction<QuestionPaper>)=>{
            // const exists = state.TempQuestionPapers.some(questionPaper => questionPaper.id === action.payload.id);
            // if (!exists) {
            //     state.TempQuestionPapers.push({...action.payload, editing:true});
            // }
        // }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(deleteTempQuestionPaperById.pending, (state) => {
            state.status = 'loading';
            state.error = "Null";

        })
        .addCase(deleteTempQuestionPaperById.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.TempQuestionPapers = state.TempQuestionPapers.filter(questionPaper => questionPaper.id !== action.payload);
            state.error = "Null";

        })
        .addCase(deleteTempQuestionPaperById.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message!;
        })


        .addCase(uploadQuestionPaper.pending, (state) => {
            state.status = 'loading';
            state.error = "Null";
        })
        .addCase(uploadQuestionPaper.fulfilled, (state, action) => {
            state.status = 'idle';
            state.TempQuestionPapers = state.TempQuestionPapers.filter(questionPaper => questionPaper.id !== action.payload.id);


            const index = state.QuestionPapers.findIndex(questionPaper => questionPaper.id === action.payload.id);

            if (index !== -1) {
                state.QuestionPapers[index] = action.payload;
            } else {
                state.QuestionPapers.push(action.payload);
            }
            state.error = "Null";

        })
        .addCase(uploadQuestionPaper.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message!;
        })

        .addCase(fetchQuestionPapers.pending, (state) => {
            state.status = 'loading';
            state.error = "Null";
        })
        .addCase(fetchQuestionPapers.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.QuestionPapers = action.payload;
        })
        .addCase(fetchQuestionPapers.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message!;
        })


        .addCase(editFetchedPaper.pending, (state) => {
            state.status = 'loading';
            state.error = "Null";
        })
        .addCase(editFetchedPaper.fulfilled, (state, action) => {
            state.status = 'succeeded';
            const exists = state.TempQuestionPapers.some(questionPaper => questionPaper.id === action.payload.id);
            if (!exists) {
                state.TempQuestionPapers.push({...action.payload, editing:true,uploaded:false});
            }
            state.QuestionPapers = state.QuestionPapers.filter(questionPaper => questionPaper.id !== action.payload.id);
            state.error = "Null";
            
        })
        .addCase(editFetchedPaper.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message!;
        })
    }
})


export const GetTempQP = (state:any)=>state.questionPaper.TempQuestionPapers;
export const GetQP = (state:any)=>state.questionPaper.QuestionPapers;



export const { addTempQuestionPaper, replaceTempQuestionPaperById } = QuestionPaperSlice.actions;

export default QuestionPaperSlice.reducer;