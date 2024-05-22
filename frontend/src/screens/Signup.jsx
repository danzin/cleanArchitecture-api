import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { useRegisterMutation } from '../slices/users/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if(userInfo){
      navigate('/')
    }
  }, [navigate, userInfo])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
      toast.error('Password don\'t match');
    }else{
      try {
        const res = await register({username, email, password }).unwrap();
        dispatch(setCredentials({...res}));
        navigate('/');
      } catch (e) {
        toast.error(e?.data?.body || e.error || e);
      }
    }
  };

  return (
  <>
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col ">
        <div className="text-center">
          <h1 className="text-5xl font-bold">Peek</h1>
          <p className='py-6'> Register an account</p>
        </div>
        <div className="card sm:w-[30rem] shrink-0 shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input 
                type="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="input input-bordered"
                required />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="input input-bordered input-bordered invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-600"
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
                placeholder="Password"
                className="input input-bordered"
                required />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm password</span>
              </label>
              <input 
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className={`input input-bordered`}
                required />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-primary" type="submit" disabled={isLoading} >
                {isLoading ? <Loader/> : 'Register'}
              </button>           
            </div>
            <div>
                <p>Already have an account? <Link to='/signin' className='text-sky-500'>Login</Link></p>
              </div>
          </form>
        </div>
      </div>
    </div>

  </>
  )
}

export default Signup