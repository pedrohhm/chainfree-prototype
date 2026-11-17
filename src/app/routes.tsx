import { createBrowserRouter, Navigate } from 'react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Subscription from './pages/Subscription';
import LegalDocument from './pages/LegalDocument';
import PatientLayout from './components/PatientLayout';
import TherapistLayout from './components/TherapistLayout';
import RequireHealthConsent from './components/RequireHealthConsent';

// Patient pages
import PatientDashboard from './pages/patient/Dashboard';
import Psychoeducation from './pages/patient/Psychoeducation';
import WhatIsOCD from './pages/patient/psychoeducation/WhatIsOCD';
import PsychologicalTreatments from './pages/patient/psychoeducation/PsychologicalTreatments';
import PsychiatricTreatments from './pages/patient/psychoeducation/PsychiatricTreatments';
import YBOCS from './pages/patient/YBOCS';
import Mapping from './pages/patient/Mapping';
import MappingObsessions from './pages/patient/MappingObsessions';
import MappingCompulsions from './pages/patient/MappingCompulsions';
import EPR from './pages/patient/EPR';
import Progress from './pages/patient/Progress';
import Timer from './pages/patient/Timer';
import PatientQuestions from './pages/patient/Questions';
import PatientSuggestions from './pages/patient/Suggestions';
import PatientManual from './pages/patient/Manual';
import PatientProfile from './pages/patient/Profile';

// Therapist pages
import TherapistDashboard from './pages/therapist/Dashboard';
import Patients from './pages/therapist/Patients';
import TherapistQuestions from './pages/therapist/Questions';
import Notes from './pages/therapist/Notes';
import Reports from './pages/therapist/Reports';
import TherapistManual from './pages/therapist/Manual';
import TherapistProfile from './pages/therapist/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/subscription',
    element: <Subscription />,
  },
  {
    path: '/terms',
    element: <LegalDocument type="terms" />,
  },
  {
    path: '/privacy',
    element: <LegalDocument type="privacy" />,
  },
  {
    path: '/patient',
    element: <PatientLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/patient/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <PatientDashboard />,
      },
      {
        path: 'psychoeducation',
        element: <Psychoeducation />,
      },
      {
        path: 'psychoeducation/what-is-ocd',
        element: <WhatIsOCD />,
      },
      {
        path: 'psychoeducation/psychological-treatments',
        element: <PsychologicalTreatments />,
      },
      {
        path: 'psychoeducation/psychiatric-treatments',
        element: <PsychiatricTreatments />,
      },
      {
        element: <RequireHealthConsent />,
        children: [
          { path: 'ybocs', element: <YBOCS /> },
          { path: 'mapping', element: <Mapping /> },
          { path: 'mapping/obsessions', element: <MappingObsessions /> },
          { path: 'mapping/compulsions', element: <MappingCompulsions /> },
          { path: 'epr', element: <EPR /> },
          { path: 'progress', element: <Progress /> },
          { path: 'questions', element: <PatientQuestions /> },
        ],
      },
      {
        path: 'timer',
        element: <Timer />,
      },
      {
        path: 'suggestions',
        element: <PatientSuggestions />,
      },
      {
        path: 'manual',
        element: <PatientManual />,
      },
      {
        path: 'profile',
        element: <PatientProfile />,
      },
    ],
  },
  {
    path: '/therapist',
    element: <TherapistLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/therapist/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <TherapistDashboard />,
      },
      {
        path: 'patients',
        element: <Patients />,
      },
      {
        path: 'questions',
        element: <TherapistQuestions />,
      },
      {
        path: 'notes',
        element: <Notes />,
      },
      {
        path: 'reports',
        element: <Reports />,
      },
      {
        path: 'manual',
        element: <TherapistManual />,
      },
      {
        path: 'profile',
        element: <TherapistProfile />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
