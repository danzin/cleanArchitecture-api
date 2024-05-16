import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { setCredentials } from '../slices/authSlice';
import { useUpdateUserMutation } from '../slices/usersApiSlice';
const ProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  
  const dispatch = useDispatch();
  
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if(userInfo){
      setUsername(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfo.username, userInfo.email])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
      toast.error('Password don\'t match');
    }else{
      try {
        const res = await updateUser({
            id: userInfo._id,
            data: {
              username,
              email,
              password: password || null
            }
          }).unwrap();
        dispatch(setCredentials({...res}));
        toast.success('Profile updated');
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
        <h1 className="text-5xl font-bold">Edit profile</h1>

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
                <span className="label-text">New Password</span>
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
              <button className="btn btn-primary" type="submit"  >
                {isLoading ? <Loader/> : 'Update'}
              </button>           
            </div>

          </form>
        </div>
      </div>
    </div>

  </>
  )
}

export default ProfileScreen