import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation } from "../slices/usersApiSlice";
import { clearCredentials } from '../slices/authSlice';

const Navbar = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCredentials());
      navigate('/');
    } catch (e) {
    console.log(e)  
    }
  }

  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="font-bold text-xl">Peek</a>
        </div>
        <div className="flex-none gap-2">
          <div className="form-control">
            <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
          </div>

          { !userInfo ? ( 
            <div className="navbar-end">
              <Link to='/signin' className="btn">
                  Sign In
                </Link> 
                <Link to='/signup' className="btn">
                  Sign Up
                </Link> 
            </div>
            ) : (
             <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img alt="Tailwind CSS Navbar component" src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
                </div>
              </div>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li>
                <Link to='/profile' className="justify-between">
                  Profile
                 </Link> 
              </li>
              <li>
                <Link to='/' onClick={ logoutHandler }>
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        )}
         


        </div>
      </div>
   </>
  )
}

export default Navbar
