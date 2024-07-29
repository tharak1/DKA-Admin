// slices/onlineExamResultsSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, deleteDoc, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../firebase_config";


interface OnlineExamResultsState {
  onlineExamResults: ExamDetails[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OnlineExamResultsState = {
  onlineExamResults: [],
  status: 'idle',
  error: null,
};

export const fetchOnlineExamResults = createAsyncThunk(
  'onlineExamResults/fetchOnlineExamResults',
  async (courseName: string) => {
    const docRef = collection(db, "Online-exam-results");
    const resultsSnap = await getDocs(query(docRef, where("course", "==", courseName)));

    const onlineExamResults: ExamDetails[] = resultsSnap.docs.map((doc) => {
      const data = doc.data();
      const students: StudentPerformance[] = data.students.map((studentData: any) => {
        if (data.examType === "create question paper") {
          return {
            correctAnswers: studentData.correctAnswers,
            incorrectAnswers: studentData.incorrectAnswers,
            marksObtained: studentData.marksObtained,
            studentId: studentData.studentId,
            studentName: studentData.studentName,
            unanswered: studentData.unanswered
          } as CreateQuestionPaperPerformance;
        } else if (data.examType === "upload question Paper") {
          return {
            evaluated: studentData.evaluated,
            marksObtained: studentData.marksObtained,
            studentId: studentData.studentId,
            studentName: studentData.studentName,
            uploadedPagesUrl: studentData.uploadedPagesUrl
          } as UploadQuestionPaperPerformance;
        }
        return {} as StudentPerformance;
      });

      return {
        id: doc.id,
        course: data.course,
        startDate: data.startDate,
        startTime: data.startTime,
        endDate: data.endDate,
        endTime: data.endTime,
        duration: data.duration,
        totalMarks: data.totalMarks,
        examType: data.examType,
        noOfQuestions: data.noOfQuestions,
        students: students
      } as ExamDetails;
    });

    return onlineExamResults;
  }
);



export const editOnlineExamResult = createAsyncThunk(
  'onlineExamResults/editOnlineExamResult',
  async (updatedExamResultData: ExamDetails) => {
    const resultId = updatedExamResultData.id;
    const resultRef = doc(db, 'Online-exam-results', resultId!);
    await setDoc(resultRef, updatedExamResultData, { merge: true });

    return updatedExamResultData;
  }
);

export const deleteOnlineExamResult = createAsyncThunk(
  'onlineExamResults/deleteOnlineExamResult',
  async (examResultId: string) => {
    await deleteDoc(doc(db, "Online-exam-results", examResultId!));
    return examResultId;
  }
);

const onlineExamResultsSlice = createSlice({
  name: 'onlineExamResults',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOnlineExamResults.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOnlineExamResults.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.onlineExamResults = action.payload;
      })
      .addCase(fetchOnlineExamResults.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
      })
      .addCase(editOnlineExamResult.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editOnlineExamResult.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedResult = action.payload;
        state.onlineExamResults = state.onlineExamResults.map((result) =>
          result.id === updatedResult.id ? updatedResult : result
        );
      })
      .addCase(editOnlineExamResult.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
      })

      .addCase(deleteOnlineExamResult.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteOnlineExamResult.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.onlineExamResults = state.onlineExamResults.filter((result) => result.id !== action.payload);
      })
      .addCase(deleteOnlineExamResult.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
      });
  }
});

export const selectOnlineExamResults = (state: any) => state.onlineExamResults.onlineExamResults;

export default onlineExamResultsSlice.reducer;
