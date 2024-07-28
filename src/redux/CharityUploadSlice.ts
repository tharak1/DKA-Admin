import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"; // Assuming you have this model defined
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase_config";
import { CharityUploadModel } from "../Models/CharityModel";

interface CharityUploadSlice {
    charityUploads: CharityUploadModel[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: CharityUploadSlice = {
    charityUploads: [],
    status: 'idle',
    error: null,
};

export const fetchCharityUploads = createAsyncThunk(
    'charityUploads/fetchCharityUploads',
    async () => {
        const docRef = collection(db, "charityUpload");
        const uploadsSnap = await getDocs(docRef);

        const charityUploads: CharityUploadModel[] = uploadsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as CharityUploadModel[];

        return charityUploads;
    }
);

export const createCharityUpload = createAsyncThunk(
    'charityUploads/createCharityUpload',
    async (uploadData: CharityUploadModel) => {
        const docRef = await addDoc(collection(db, "charityUpload"), uploadData);
        return { id: docRef.id, ...uploadData };
    }
);

export const editCharityUpload = createAsyncThunk(
    'charityUploads/editCharityUpload',
    async (updatedUploadData: CharityUploadModel) => {
        const uploadId = updatedUploadData.id;
        const uploadRef = doc(db, 'charityUpload', uploadId!);
        setDoc(uploadRef, updatedUploadData, { merge: true });

        return updatedUploadData;
    }
);

export const deleteCharityUpload = createAsyncThunk(
    'charityUploads/deleteCharityUpload',
    async (uploadId: string) => {
        await deleteDoc(doc(db, "charityUpload", uploadId!));
        return uploadId;
    }
)

const CharityUploadSlice = createSlice({
    name: 'charityUploads',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCharityUploads.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCharityUploads.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.charityUploads = action.payload;
            })
            .addCase(fetchCharityUploads.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message!;
            })
            .addCase(createCharityUpload.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createCharityUpload.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.charityUploads.push(action.payload);
            })
            .addCase(createCharityUpload.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message!;
            })
            .addCase(editCharityUpload.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(editCharityUpload.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const updatedUpload = action.payload;
                state.charityUploads = state.charityUploads.map((upload) =>
                    upload.id === updatedUpload.id ? updatedUpload : upload
                );
            })
            .addCase(editCharityUpload.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message!;
            })
            .addCase(deleteCharityUpload.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteCharityUpload.fulfilled, (state, action) => {
                state.charityUploads = state.charityUploads.filter((upload) => upload.id !== action.payload);
            })
            .addCase(deleteCharityUpload.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message!;
            })
    }
});

export const selectCharityUploads = (state: any) => state.charityUploads.charityUploads;

export default CharityUploadSlice.reducer;