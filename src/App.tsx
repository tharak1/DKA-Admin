// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import SideBar from './Screens/SideBar';
// import AdminDashboard from './Screens/AdminScreens/AdminDashboard';
// import AdminManageCategory from './Screens/AdminScreens/AdminManageCategory';
// import AdminManageCourse from './Screens/AdminScreens/AdminManageCourse';
// import AdminAddCourseScreen from './Screens/AdminScreens/AdminAddCourseScreen';
// import AdminShowStudents from './Screens/AdminScreens/AdminShowStudents';
// import AdminShowPayments from './Screens/AdminScreens/AdminShowPayments';
// import AdminManageQuestionPaper from './Screens/AdminScreens/AdminManageQuestionPaper';
// import CreateQuestionPaper from './Screens/AdminScreens/AdminCreateQuestionPaper';
// import AdminEployeeManagement from './Screens/AdminScreens/AdminEployeeManagement';
// import AdminExamReports from './Screens/AdminScreens/AdminExamReports';
// import AdminOnlineManagement from './Screens/AdminScreens/AdminOnlineManagement';
// import WriteExamScreen from './Screens/Client_screens/WriteExamScreen';
// import UploadAnsScreen from './Components/UploadAnsScreen';
// import LoginScreen from './Screens/LoginScreen';

// function App() {

//   return (
//     <>
//       <Router>
//         <Routes>

//           <Route path='/' element = {<LoginScreen/>} />

//           <Route path='/admin' element = {<SideBar/>} >
//             <Route path="/admin/online_class_management" element={<AdminOnlineManagement/>}/>
//             <Route path="/admin/upload-answers-screen" element={<UploadAnsScreen/>}/>
//             <Route path="/admin/create_question_paper" element={<CreateQuestionPaper/>}/>
//             <Route path="/admin/manage_questionPaper" element={<AdminManageQuestionPaper/>}/>
//             <Route path="/admin/employee_management" element={<AdminEployeeManagement/>}/>
//             <Route path="/admin/manage_categories" element={<AdminManageCategory/>}/>
//             <Route path="/admin/manage_courses" element={<AdminManageCourse/>}/>
//             <Route path="/admin/exam_reports" element={<AdminExamReports/>}/>
//             <Route path="/admin/add_courses" element={<AdminAddCourseScreen/>}/>
//             <Route path="/admin/writeExam" element={<WriteExamScreen/>}/>
//             <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
//             <Route path="/admin/students" element={<AdminShowStudents/>}/>
//             <Route path="/admin/payments" element={<AdminShowPayments/>}/>
//           </Route>

//         </Routes>
//       </Router>
//     </>
//   )
// }

// export default App


import { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GetUser } from './redux/UserSlice';
import { EmployeeModel } from './Models/EmployeeModel';

// Lazy load the components
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


function App() {
  const user = useSelector(GetUser) as EmployeeModel;
  return (
    <>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/' element={<LoginScreen />} />


            {
              user!=null&&(
                <Route path='/admin' element={<SideBar />}>
                <Route path="/admin/online_class_management" element={<AdminOnlineManagement />} />
                <Route path="/admin/upload-answers-screen" element={<UploadAnsScreen />} />
                <Route path="/admin/create_question_paper" element={<CreateQuestionPaper />} />
                <Route path="/admin/manage_questionPaper" element={<AdminManageQuestionPaper />} />
                <Route path="/admin/exam_reports" element={<AdminExamReports />} />
                <Route path="/admin/writeExam" element={<WriteExamScreen />} />

                
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
