import React from 'react'
import { useLoadImagesQuery } from '../slices/images/imagesApiSlice'
import Loader from './Loader';

const ImageGallery = () => {
  const { data: images, error, isLoading } = useLoadImagesQuery({});  
  console.log('Fetched images:', images); 

  if (isLoading) return <Loader/>;

  if (!images || images.length === 0) {
    return <div>No images available</div>;
  }
  return (
    <div className='grid md:grid-cols-3 justify-center gap-4 mt-5'>
      {images.map(image => (
        <div key={image._id} className="card card-compact w-96 bg-base-100 shadow-xl">
          <figure><img src={image.url} alt={image.description || 'Image'} /></figure>
          <div className="card-body">
            <p>Uploaded by: {image.user.username}</p>
            <span>Created on: {new Date(image.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ImageGallery