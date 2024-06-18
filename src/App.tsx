import { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GetUser } from './redux/UserSlice';
import { EmployeeModel } from './Models/EmployeeModel';
import AdminViewFullPerformance from './Screens/AdminScreens/AdminSupportScreens.tsx/AdminViewFullPerformance';
import AdminShowPendingPayments from './Screens/AdminScreens/AdminShowPendingPayments';
import AdminMarksScreen from './Screens/AdminScreens/AdminMarksScreen';
import ResultsScreen from './Screens/Client_screens/ResultsScreen';
import AdminOnlineExamViewPort from './Screens/AdminScreens/AdminSupportScreens.tsx/AdminOnlineExamViewPort';
import AdminEvaluationScreen from './Screens/AdminScreens/AdminEvaluationScreen';

const SideBar = lazy(() => import('./Screens/SideBar'));
const AdminDashboard = lazy(() => import('./Screens/AdminScreens/AdminDashboard'));
const AdminManageCategory = lazy(() => import('./Screens/AdminScreens/AdminManageCategory'));
const AdminManageCourse = lazy(() => import('./Screens/AdminScreens/AdminManageCourse'));
const AdminAddCourseScreen = lazy(() => import('./Screens/AdminScreens/AdminSupportScreens.tsx/AdminAddCourseScreen'));
const AdminShowStudents = lazy(() => import('./Screens/AdminScreens/AdminShowStudents'));
const AdminShowPayments = lazy(() => import('./Screens/AdminScreens/AdminShowPayments'));
const AdminManageQuestionPaper = lazy(() => import('./Screens/AdminScreens/AdminManageQuestionPaper'));
const CreateQuestionPaper = lazy(() => import('./Screens/AdminScreens/AdminSupportScreens.tsx/AdminCreateQuestionPaper'));
const AdminEployeeManagement = lazy(() => import('./Screens/AdminScreens/AdminEployeeManagement'));
const AdminExamReports = lazy(() => import('./Screens/AdminScreens/AdminExamReports'));
const AdminOnlineManagement = lazy(() => import('./Screens/AdminScreens/AdminOnlineManagement'));
const WriteExamScreen = lazy(() => import('./Screens/Client_screens/WriteExamScreen'));
const UploadAnsScreen = lazy(() => import('./Components/UploadAnsScreen'));
const LoginScreen = lazy(() => import('./Screens/LoginScreen'));
const AddAdminAddEmployeeScreen = lazy(() => import('./Screens/AdminScreens/AdminSupportScreens.tsx/AdminAddEmployeeScreen'));
import { SpeedInsights } from '@vercel/speed-insights/react';
import AdminViewFullPaymentHistory from './Screens/AdminScreens/AdminSupportScreens.tsx/AdminViewFullPaymentHistory';


function App() {
  const user = useSelector(GetUser) as EmployeeModel;
  return (
    <>
          <SpeedInsights />

      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/' element={<LoginScreen />} />
            <Route path='/results' element={<ResultsScreen/>}/>

            {
              user!=null&&(
                <Route path='/admin' element={<SideBar />}>
                <Route path="/admin/online_class_management" element={<AdminOnlineManagement />} />
                <Route path="/admin/upload-answers-screen" element={<UploadAnsScreen />} />
                <Route path="/admin/create_question_paper" element={<CreateQuestionPaper />} />
                <Route path="/admin/manage_questionPaper" element={<AdminManageQuestionPaper />} />
                <Route path="/admin/exam_reports" element={<AdminExamReports />} />
                <Route path="/admin/writeExam" element={<WriteExamScreen />} />
                <Route path='/admin/pending_payments' element={<AdminShowPendingPayments/>}/>
                <Route path='/admin/detailPerformance' element={<AdminViewFullPerformance/>}/>
                <Route path="/admin/marks_entry" element={<AdminMarksScreen />} />
                <Route path="/admin/online_exam_viewport" element={<AdminOnlineExamViewPort />} />
                <Route path="/admin/online_exam_evaluation" element={<AdminEvaluationScreen />} />
                <Route path="/admin/view_all_payments" element={<AdminViewFullPaymentHistory />} />


                {user.isAdmin && (
                  <>
                    <Route path="/admin/employee_management" element={<AdminEployeeManagement />} />
                    <Route path="/admin/manage_categories" element={<AdminManageCategory />} />
                    <Route path="/admin/manage_courses" element={<AdminManageCourse />} />
                    <Route path="/admin/add_courses" element={<AdminAddCourseScreen />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/students" element={<AdminShowStudents />} />
                    <Route path="/admin/payments" element={<AdminShowPayments />} />
                    <Route path="/admin/add_employee" element={<AddAdminAddEmployeeScreen />} />
                  </>
                )}
              </Route>
            )}
          </Routes>
        </Suspense>
      </Router>
    </>
  )
}

export default App;


