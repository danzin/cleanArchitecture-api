import React, { useEffect, useState  } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if(userInfo){
      navigate('/')
    }
  }, [navigate, userInfo])


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({...res}));
      navigate('/');
    } catch (e) {
      toast.error(e?.data?.body || e.error || e);
    }
   
  };
  return (

      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col ">
          <div className="text-center ">
            <h1 className="text-5xl font-bold">Peek</h1>
            <p className="py-6">Login to share photos</p>
          </div>
          <div className="card sm:w-[30rem] shadow-2xl bg-base-100">
            <form className="card-body" onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="input input-bordered invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-600"
                required />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Password</span>
                </label>
                <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*******"
                className="input input-bordered"
                required />   
                <label className="label">
                  <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
                </label>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary" type="submit">Login</button>
              </div>
              <div>
                <p>Don't have an account? <Link to='/signup' className='text-sky-500'>Register</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    
  )
}

export default Signin