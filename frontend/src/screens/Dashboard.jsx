import React from 'react'
import { useLoadUsersQuery } from '../slices/users/usersApiSlice';
import Loader from '../components/Loader';

const Dashboard = () => {
  const { data: users, error, isLoading } = useLoadUsersQuery({});  
  console.log('Fetched users:', users);

  
  if (!users || users.length === 0) {
    return <div>No users available</div>;
  }

  return (
  <div className="overflow-x-auto">
    <table className="table">

      <thead>
        <tr>
          <th>Username</th>
          <th>Email</th>
          <th>Registered at</th>
          <th>Images uploaded</th>
        </tr>
      </thead>
      <tbody>

        {  isLoading && <Loader/>}
        {users.map(user => (
        <tr>
          <td>{user.username}</td>
          <td>{user.email}</td>
          <td>{new Date(user.createdAt).toLocaleDateString()}</td>
          <td>{user.photos.length}</td>

        </tr>
        ))}
        
       
      </tbody>
    </table>
  </div>
  )
}

export default Dashboard