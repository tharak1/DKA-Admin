import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase_config";
import { AchievementsUploadModel } from "../Models/CharityModel";


interface AchievementsUploadSlice {
    achievementsUploads: AchievementsUploadModel[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: AchievementsUploadSlice = {
    achievementsUploads: [],
    status: 'idle',
    error: null,
};

export const fetchAchievementsUploads = createAsyncThunk(
    'achievementsUploads/fetchAchievementsUploads',
    async () => {
        const docRef = collection(db, "achievementsUpload");
        const uploadsSnap = await getDocs(docRef);

        const achievementsUploads: AchievementsUploadModel[] = uploadsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as AchievementsUploadModel[];

        return achievementsUploads;
    }
);

export const createAchievementsUpload = createAsyncThunk(
    'achievementsUploads/createAchievementsUpload',
    async (uploadData: Omit<AchievementsUploadModel, 'id'>) => {
        const docRef = await addDoc(collection(db, "achievementsUpload"), uploadData);
        return { id: docRef.id, ...uploadData };
    }
);

export const editAchievementsUpload = createAsyncThunk(
    'achievementsUploads/editAchievementsUpload',
    async (updatedUploadData: AchievementsUploadModel) => {
        const uploadId = updatedUploadData.id;
        const uploadRef = doc(db, 'achievementsUpload', uploadId!);
        await setDoc(uploadRef, updatedUploadData, { merge: true });

        return updatedUploadData;
    }
);

export const deleteAchievementsUpload = createAsyncThunk(
    'achievementsUploads/deleteAchievementsUpload',
    async (uploadId: string) => {
        await deleteDoc(doc(db, "achievementsUpload", uploadId));
        return uploadId;
    }
)

const AchievementsUploadSlice = createSlice({
    name: 'achievementsUploads',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAchievementsUploads.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAchievementsUploads.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.achievementsUploads = action.payload;
            })
            .addCase(fetchAchievementsUploads.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message!;
            })
            .addCase(createAchievementsUpload.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createAchievementsUpload.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.achievementsUploads.push(action.payload);
            })
            .addCase(createAchievementsUpload.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message!;
            })
            .addCase(editAchievementsUpload.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editAchievementsUpload.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedUpload = action.payload;
                state.achievementsUploads = state.achievementsUploads.map((upload) =>
                    upload.id === updatedUpload.id ? updatedUpload : upload
                );
            })
            .addCase(editAchievementsUpload.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message!;
            })
            .addCase(deleteAchievementsUpload.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteAchievementsUpload.fulfilled, (state, action) => {
                state.achievementsUploads = state.achievementsUploads.filter((upload) => upload.id !== action.payload);
            })
            .addCase(deleteAchievementsUpload.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message!;
            })
    }
});

export const selectAchievementsUploads = (state: any) => state.achievementsUploads.achievementsUploads;

export default AchievementsUploadSlice.reducer;
