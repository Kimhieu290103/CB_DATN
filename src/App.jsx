// import './App.css'
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { Fragment } from 'react'
import HomePage from './layout/homepage/homepage'
import { publicRoutes, privateRoutes } from './routes'
import PrivateRoute from './routes/private-routes'

function App() {

  return (
    <>
      <Router>
      <div className="App">
        <Routes>
            {publicRoutes.map((route, index) => {
             let Layout = HomePage;

              if(route.Layout){
                Layout = route.Layout;
              }
              else if(route.Layout === null){
                Layout = Fragment;
              }
            return <Route 
                      key={index} 
                      path={route.path} 
                      element={<Layout><route.element /></Layout>} 
                    />
          })}

            {privateRoutes.map((route, index) => {
              let Layout = HomePage;

              if (route.Layout) {
                Layout = route.Layout;
              } else if (route.Layout === null) {
                Layout = Fragment;
              }
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <PrivateRoute
                      roles={route.roles}
                      element={() => (
                          <Layout>
                            <route.element />
                          </Layout>
                      )} 
                    />}  
                />
              );
            })}
        </Routes>
      </div>
      </Router>
    </>
  )
}

export default App
