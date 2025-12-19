import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap_14 my-10 mt-40 text-sm'>
              <div>
                <img src={assets.logo} className='mb-5 w-32' alt="" />
                <p className='w-full md:h-2/3 text-gray-600'>Forever is your go-to destination for quality, style, and convenience. We bring you a carefully curated selection of products designed to elevate your everyday life, delivered with trust and care.</p>
                </div>
              <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li> Privacy policy</li>

            
                </ul>
              </div>
              <div>
                <p className='text-xl font-medium mb-5 '>GET IN TOUCH</p>
                <ul>
                    <li>+251-213-48-555</li>
                    <li>contact@berhanumulu2024@gmail.com</li>
                </ul>
              </div>
        </div>

        <div>
            <hr />
             <p className='py-5 text-sm text-center '>copyright 2026@ forever.com -All Right Reserved</p>
        
        </div>
    </div>
  )
}

export default Footer