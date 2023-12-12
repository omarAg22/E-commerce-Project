import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/homeScreen/HomeScreen';
import ProductScreen from './screens/productScreen/ProductScreen';
import { useContext } from 'react';
import { Store } from './Store';
import CartScreen from './screens/cartScreen/CartScreen';
import SigninScreen from './screens/signinScreen/SigninScreen';
import ShippingAdressScreen from './screens/shippingAdressScreen/ShippingAdressScreen';
import SignupScreen from './screens/signupScreen/SignupScreen';
import PaymentScreen from './screens/paymentScreen/PaymentScreen';
import PlaceOrderScreen from './screens/placeOrderScreen/PlaceOrderScreen';
import OrderScreen from './screens/orderScreen/OrderScreen';
import OrderHistory from './screens/orderHistory/OrderHistory';
import NavigationBar from './components/navigationBar/NavigationBar';
import Footer from './components/footer/Footer';
import ProfileScreen from './screens/profile/ProfileScreen';
import Shop from './screens/shop/Shop';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
  };
  return (
    <BrowserRouter>
      <div className="d-flex flex-column site-container">
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <NavigationBar
            userInfo={userInfo}
            cart={cart}
            signoutHandler={signoutHandler}
          />
        </header>
          <div className='container'>
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/shop/:id" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/shipping" element={<ShippingAdressScreen />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/orderhistory" element={<OrderHistory />} />
            </Routes>
          </div>
          <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
