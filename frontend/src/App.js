
import React from 'react';
import {BrowserRouter,Route,Routes} from 'react-router-dom';
import './index.css';
import LandingPage from './pages/LandingPage/LandingPage.jsx'
import './index.js'
import CommunityPage from './pages/Community/CommunityPage.jsx';
import Job from './pages/Job-Related-Pages/Job.jsx';
import UserPage from './pages/user-page/userPage.jsx';
import AddPost from './components/community/AddPost.js';
import CompanyPage from './pages/Company-Page/CompanyPage.jsx';
import JobBasics from './pages/Job-Related-Pages/JobBasics.jsx';
import JobPost from './pages/Job-Related-Pages/Job_post.jsx';
import SalaryPage from './pages/Salary/SalaryPage.jsx';
import VerifyEmail from './pages/PasswordChanges/VerifyEmail.jsx';
import ForgotPassword from './pages/PasswordChanges/ForgotPassword.jsx';
import UpdatePassword from './pages/PasswordChanges/UpdatePassword.jsx';
import axios from 'axios'
import ChatProvider  from './UserContext.js';
import Chats from './components/Chats-ChatsHome/Chats.js';


function App() {
  axios.defaults.baseURL = 'http://localhost:5000';
  axios.defaults.withCredentials = true;
  return (
    <BrowserRouter>
      <ChatProvider>
          <div className="App w-screen">
            <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/community" element={<CommunityPage/>}/>
            <Route path="/jobs" element={<Job/>}/>
            <Route path="/profile" element={<UserPage/>}/>
            <Route path="/add-post" element={<AddPost/>}/>
            <Route path="/companies" element={<CompanyPage/>}/>
            <Route path="/job-basics" element={<JobBasics/>}/>
            <Route path="/job-post" element={<JobPost/>}/>
            <Route path="/salaries" element={<SalaryPage/>}></Route>
            <Route path="/verify-email" element={<VerifyEmail/>}></Route>
            <Route path="/forgot-password" element={<ForgotPassword/>}></Route>
            <Route path="/update-password/:id" element={<UpdatePassword/>}></Route>
            <Route path="/chats" element={<Chats/>}/>
            </Routes>
        
          </div>
         </ChatProvider>
        </BrowserRouter>
  );
}

export default App;