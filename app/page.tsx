import React from 'react'
import Navbar from '@/components/Navbar'
import HomeView from '@/View/HomeView'
import WhyAttendPage from '@/View/WhyAttend';
import FaqView from '@/View/FaqView';
import FooterView from '@/View/FooterView';

const page = () => {
  return (
    <div className="overflow-hidden">
      <Navbar />
      <HomeView/>   
      <WhyAttendPage/>
      <FaqView/>
      <FooterView/>
    </div>
  )
}


export default page
