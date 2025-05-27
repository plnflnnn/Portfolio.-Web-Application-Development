import {Suspense } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import MainPage from '../pages/MainPage/MainPage';
import OurCoffee from '../pages/OurCoffee/OurCoffee';
import CoffeePage from '../pages/CoffeePage/CoffeePage';
import ForYourPleasurePage from '../pages/ForYourPleasurePage/ForYourPleasurePage';
import Loading from '../pages/commonComponents/loading/loading';
import Page404 from '../pages/404';


import './App.css';

function App() {
  return (
    <Router>
      <Suspense fallback={<Loading/>}>
        <Routes>
          <Route path='/' element={<MainPage></MainPage>}/>
          <Route path='/our_coffee' element={<OurCoffee></OurCoffee>}/>
          <Route path='/:coffeeId' element={<CoffeePage></CoffeePage>}/>
          <Route path='/for_your_pleasure' element={<ForYourPleasurePage></ForYourPleasurePage>}/>
          <Route path="*" element={<Page404></Page404>}/>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;