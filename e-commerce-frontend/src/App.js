import Navbar from './Navbar/navbar';
import './App.css';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { Shop } from './Pages/shop';
import { ShopCategory } from './Pages/ShopCategory';
import { Product } from './Pages/Product';
import {Cart} from './Pages/Cart';
import {  LoginSignUp  } from './Pages/LoginSignUp';
import { Footer } from './Footer/Footer';
import men_banner from './Assest/Assets/Frontend_Assets/banner_mens.png'
import women_banner from './Assest/Assets/Frontend_Assets/banner_women.png'
import kids_banner from './Assest/Assets/Frontend_Assets/banner_kids.png'
function App() {
  return (
  <div>
    <BrowserRouter>
     <Navbar/>
     <Routes>
      <Route path='/' element={<Shop />}/>
      <Route path='/mens' element={<ShopCategory  banner={men_banner}category="men"/>}/>
      <Route path='/womens' element={<ShopCategory banner={women_banner} category="women"/>}/>
      <Route path='/kids' element={<ShopCategory banner={kids_banner} category="kid"/>}/>
      <Route path='/product' element={<Product/>}>
       <Route path=':productId' element={<Product/>}/>
      </Route>
      <Route path='/cart' element={<Cart />}/>
      <Route path='/login' element={< LoginSignUp/>}/>
     </Routes>
     <Footer/>
     </BrowserRouter>
  </div>);
    

}

export default App;
