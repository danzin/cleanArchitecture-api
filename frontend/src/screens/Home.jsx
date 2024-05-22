import React from 'react'
import Navbar from '../components/Navbar'
import UploadForm from '../components/UploadForm'
import ImageGallery from '../components/ImageGallery'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <div className='max-w-4xl mx-auto'>
    <Navbar/>
    <ImageGallery/>
    <Outlet/>

    <div>Home</div>
    </div>
  )
}

export default Home