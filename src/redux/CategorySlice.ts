import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import CategoryModel from "../Models/CategoryModel";
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase_config";

interface CategorySlice{
    Categories: CategoryModel[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState : CategorySlice ={
    Categories:[],
    status: 'idle', 
    error: null,
};

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async()=>{
        const docRef = collection(db, "categories");
        const CoursesSnap = await getDocs(docRef);

        const categories: CategoryModel[] = CoursesSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as CategoryModel[]; 

        return categories;
    }
);

export const CreateCategory = createAsyncThunk(
    'categories/CreateCategory',
    async(CategoryData:CategoryModel)=>{
        const docRef = await addDoc(collection(db, "categories"),CategoryData);
        return {id:docRef.id,...CategoryData}
    }
);

export const editCategory = createAsyncThunk(
    'categories/editCategory',
    async(UpdatedCategoryData:CategoryModel)=>{
        const courseId = UpdatedCategoryData.id; 
        const courseRef = doc(db, 'categories',courseId!);
        setDoc(courseRef,UpdatedCategoryData, { merge: true });

        return UpdatedCategoryData;
    }
);

export const deleteCategory = createAsyncThunk(
    'categories/deleteCategory',
    async(categoryId:string)=>{
        await deleteDoc(doc(db, "categories", categoryId!));
        return categoryId;
    }
)

const CategorySlice = createSlice({
    name:'categories',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchCategories.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.Categories = action.payload;
        })
        .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
        })


        .addCase(CreateCategory.pending, (state) => {
        state.status = 'loading';
        })
        .addCase(CreateCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.Categories.push(action.payload);
        })
        .addCase(CreateCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
        })


        .addCase(editCategory.pending, (state) => {
        state.status = 'loading';
        })
        .addCase(editCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedCourse = action.payload;
        state.Categories = state.Categories.map((course) =>
            course.id === updatedCourse.id ? updatedCourse : course
          );
        })
        .addCase(editCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message!;
        })

        .addCase(deleteCategory.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(deleteCategory.fulfilled, (state, action) => {
            state.Categories = state.Categories.filter((course) => course.id !== action.payload);
        })
        .addCase(deleteCategory.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message!;
        })
    }
});

export const Categories  = (state:any) => state.categories.Categories;


export default CategorySlice.reducer;