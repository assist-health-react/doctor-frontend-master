import { lazy } from 'react';

const SchoolsList = lazy(() => import('./schools'));
const SchoolView = lazy(() => import('./schools/SchoolView'));
const Students = lazy(() => import('./students'));
const Assessments = lazy(() => import('./assessments'));
const Infirmary = lazy(() => import('./infirmary'));
const Reports = lazy(() => import('./reports'));
const Inventory = lazy(() => import('./inventory'));

export const routes = [
  {
    path: '/',
    element: <SchoolsList />
  },
  {
    path: ':schoolId/*',
    element: <SchoolView />,
    children: [
      {
        path: 'students',
        element: <Students />
      },
      {
        path: 'assessments',
        element: <Assessments />
      },
      {
        path: 'infirmary',
        element: <Infirmary />
      },
      {
        path: 'reports',
        element: <Reports />
      },
      {
        path: 'inventory',
        element: <Inventory />
      }
    ]
  }
]; 