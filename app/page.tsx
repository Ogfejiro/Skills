import React from 'react'
import HomeView from '@/View/HomeView'
import WhyAttendPage from '@/View/WhyAttend';
import FaqView from '@/View/FaqView';
import FooterView from '@/View/FooterView';

const page = () => {
  return (
    <div>
      <HomeView/>   
      <WhyAttendPage/>
      <FaqView/>
      <FooterView/>
    </div>
  )
}


export default page
