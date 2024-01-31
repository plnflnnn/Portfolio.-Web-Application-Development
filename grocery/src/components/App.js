import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Loading from './Loading';

const Page404 = lazy(() => import('../pages/404'));
const MainPage = lazy(() => import('../pages/MainPage'));
const Products = lazy(() => import('../pages/Products'));
const Item = lazy(() => import ('../pages/Item'));
const Category = lazy(() => import('../pages/Category'));
const Cart = lazy(() => import('../pages/Cart'));
const Success = lazy(() => import('../pages/SuccessfulPayment'));

function App() {
  return (
    <>
    <Router>
        <Suspense fallback={<Loading/>}>
          <Routes>
            <Route path='/' element={<MainPage></MainPage>}/>
            <Route path='/products' element={<Products></Products>}/>
            <Route path='/products/:categoryName' element={<Category></Category>}/>
            <Route path='/products/:categoryName/:itemName' element={<Item></Item>}/>
            <Route path="/cart" element={<Cart></Cart>}/>
            <Route path="/success" element={<Success></Success>}/>
            <Route path="*" element={<Page404></Page404>}/>
          </Routes>
        </Suspense>
      </Router>

    </>
  );
}

export default App;
