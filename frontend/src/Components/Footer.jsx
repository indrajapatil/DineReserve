import React from 'react'
import { FaFacebook,FaInstagram, FaYoutube } from 'react-icons/fa'

const Footer = () => {
  return (
    <div className='flex flex-col gap-12 px-16 py-16 bg-white'>
      <div className='grid place-content-center gap-6 text-center'>
        <h2 className='text-4xl font-bold text-gray-600'>Need Updates on Latest Offers?</h2>
        <p className='text-lg text-gray-600'>Subscribe to our newsletter to get frequent updates</p>
        <div className='flex items-center justify-center max-w-xl mx-auto w-full'>
          <input type='email' placeholder='Email' className='flex-grow px-4 py-3 border-2 border-r-0 border-amber-500 rounded-1-full outline-none text-sm'/>
          <button className='bg-amber-500 text-white px-6 py-3 rounded-r-full font-bold'>Join Now</button>
        </div>
      </div>
      <div className='flex flex-col md:flex-row justify-between items-center text-center md-text-left gap-6'>
        <h2 className='text-2xl font-bold '>Indraja Bistro</h2>
        <div className='flex justify-center md:justify-start gap-4 mt-3 text-amber-500'>
          <FaFacebook/>
          <FaInstagram/>
          <FaYoutube/>
        </div>
      </div>
      <div>
        <ul className='flex gap-6 justify-center text-gray-700 text-base font-medium'>
          <li className='cursor pointer'>Home</li>
          <li className='cursor pointer'>Menu</li>
          <li className='cursor pointer'>About us</li>
          <li className='cursor pointer'>Privacy Policy</li>
        </ul>
      </div>
      <p className='text-center text-sm text-gray-500'>All Rights are Reserved.</p>
    </div>
  )
}

export default Footer
