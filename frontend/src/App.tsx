/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { InterviewSetupPage } from './pages/InterviewSetupPage';
import { InterviewRoomPage } from './pages/InterviewRoomPage';
import { InterviewResultPage } from './pages/InterviewResultPage';
import { AssessmentSetupPage } from './pages/AssessmentSetupPage';
import { AssessmentTestPage } from './pages/AssessmentTestPage';
import { AssessmentResultPage } from './pages/AssessmentResultPage';
import { CoursesCatalogPage } from './pages/CoursesCatalogPage';
import { CourseDetailsPage } from './pages/CourseDetailsPage';
import { LessonPlayerPage } from './pages/LessonPlayerPage';
import { NotesDirectoryPage } from './pages/NotesDirectoryPage';
import { NotesViewerPage } from './pages/NotesViewerPage';

function RouterView() {
  const { currentPath } = useApp();

  // Normalize path without trailing slash
  const path = currentPath === '/' ? '/' : currentPath.replace(/\/$/, '');

  // Routes
  if (path === '/' || path === '') return <LandingPage />;
  if (path === '/signup') return <SignupPage />;
  if (path === '/login') return <LoginPage />;
  if (path === '/dashboard') return <DashboardPage />;

  // Module 1: Interview
  if (path === '/interview/setup') return <InterviewSetupPage />;
  if (path === '/interview/room') return <InterviewRoomPage />;
  if (path.startsWith('/interview/result')) return <InterviewResultPage />;

  // Module 2: Assessment
  if (path === '/assessment/setup') return <AssessmentSetupPage />;
  if (path === '/assessment/test') return <AssessmentTestPage />;
  if (path.startsWith('/assessment/result')) return <AssessmentResultPage />;

  // Module 3: Courses
  if (path === '/courses') return <CoursesCatalogPage />;
  if (path.includes('/lesson/')) return <LessonPlayerPage />;
  if (path.startsWith('/courses/')) return <CourseDetailsPage />;

  // Module 3: Notes
  if (path === '/notes') return <NotesDirectoryPage />;
  if (path.startsWith('/notes/')) return <NotesViewerPage />;

  // Fallback to Landing
  return <LandingPage />;
}

function MainLayout() {
  const { currentPath } = useApp();

  // Determine whether to display global Navbar & Footer
  const isImmersiveRoom = currentPath === '/interview/room' || 
                          currentPath.includes('/lesson/') || 
                          currentPath === '/assessment/test';
  
  const isAuthPage = currentPath === '/login' || currentPath === '/signup';

  return (
    <div className="min-h-screen bg-[#100D14] flex flex-col justify-between selection:bg-[#E879B9]/30 selection:text-[#FF8866]">
      {!isImmersiveRoom && !isAuthPage && <Navbar />}

      <div className="flex-1">
        <RouterView />
      </div>

      {!isImmersiveRoom && !isAuthPage && <Footer />}

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
