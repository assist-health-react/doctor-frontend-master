import { Suspense } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { routes } from './routes';
import { LoadingSpinner } from './common/LoadingSpinner';

const Ahana = () => {
  console.log('Ahana component rendered');
  
  return (
    <div className="flex flex-col h-full">
      {/* Content Area */}
      <div className="flex-1">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        }>
          <Routes>
            <Route path="/" element={routes[0].element} />
            <Route path=":schoolId" element={routes[1].element}>
              {routes[1].children.map((route) => (
                <Route
                  key={route.path}
                  path={`${route.path}/*`}
                  element={
                    <Suspense fallback={
                      <div className="flex items-center justify-center h-full">
                        <LoadingSpinner />
                      </div>
                    }>
                      {route.element}
                    </Suspense>
                  }
                />
              ))}
            </Route>
          </Routes>
        </Suspense>
      </div>
    </div>
  );
};

export default Ahana; 