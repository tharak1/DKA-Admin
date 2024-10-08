import storage from "redux-persist/lib/storage";
import {persistReducer} from "redux-persist";
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import themeReducer from "./ThemeSlice";
import categoryReducer from './CategorySlice'
import courseReducer from './CourcesSlice'
import questionPaperReducer from './QuestionPaperSlice'
import employeesReducer from './EmployeeSlice'
import userReducer from './UserSlice';
import drawerReducer from './DrawerSlice';
import charityUploadsReducer from './CharityUploadSlice';
import achievementsUploadsReducer from './AchievementsUploadSlice';
import onlineExamResultsReducer from './ExamReportsSlice';
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";


const persistConfig = {
    key:"adminRoot",
    version:1,
    storage
}

const reducer = combineReducers({
    theme:themeReducer,
    course:courseReducer,
    categories:categoryReducer,
    questionPaper:questionPaperReducer,
    employees:employeesReducer,
    user:userReducer,
    drawer:drawerReducer,
    charityUploads:charityUploadsReducer,
    achievementsUploads:achievementsUploadsReducer,
    onlineExamResults:onlineExamResultsReducer
});

const persistedReducer = persistReducer(persistConfig,reducer);


export const store = configureStore({
    reducer : persistedReducer
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();



export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;