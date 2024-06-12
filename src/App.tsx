import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SideBar from './Screens/SideBar';
import AdminDashboard from './Screens/AdminScreens/AdminDashboard';
import AdminManageCategory from './Screens/AdminScreens/AdminManageCategory';
import AdminManageCourse from './Screens/AdminScreens/AdminManageCourse';
import AdminAddCourseScreen from './Screens/AdminScreens/AdminAddCourseScreen';
import AdminShowStudents from './Screens/AdminScreens/AdminShowStudents';
import AdminShowPayments from './Screens/AdminScreens/AdminShowPayments';
import AdminManageQuestionPaper from './Screens/AdminScreens/AdminManageQuestionPaper';
import CreateQuestionPaper from './Screens/AdminScreens/AdminCreateQuestionPaper';
import AdminEployeeManagement from './Screens/AdminScreens/AdminEployeeManagement';
import AdminExamReports from './Screens/AdminScreens/AdminExamReports';
import LoginPage from './Screens/LoginPage'
// import create_question_paper from './screens/Admin_screens/create_question_paper';


import { pdfjs } from "react-pdf";
import AdminOnlineManagement from './Screens/AdminScreens/AdminOnlineManagement';
import WriteExamScreen from './Screens/Client_screens/WriteExamScreen';
import UploadAnsScreen from './Components/UploadAnsScreen';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();


function App() {

  return (
    <>
      <Router>
        <Routes>

          <Route path='/Login' element = {<LoginPage/>} />

          <Route path='/admin' element = {<SideBar/>} >
            <Route path="/admin/online_class_management" element={<AdminOnlineManagement/>}/>
            <Route path="/admin/upload-answers-screen" element={<UploadAnsScreen/>}/>
            <Route path="/admin/create_question_paper" element={<CreateQuestionPaper/>}/>
            <Route path="/admin/manage_questionPaper" element={<AdminManageQuestionPaper/>}/>
            <Route path="/admin/employee_management" element={<AdminEployeeManagement/>}/>
            <Route path="/admin/manage_categories" element={<AdminManageCategory/>}/>
            <Route path="/admin/manage_courses" element={<AdminManageCourse/>}/>
            <Route path="/admin/exam_reports" element={<AdminExamReports/>}/>
            <Route path="/admin/add_courses" element={<AdminAddCourseScreen/>}/>
            <Route path="/admin/writeExam" element={<WriteExamScreen/>}/>
            <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
            <Route path="/admin/students" element={<AdminShowStudents/>}/>
            <Route path="/admin/payments" element={<AdminShowPayments/>}/>
          </Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
