import React from 'react'
import HomeView from '@/View/HomeView'
import AboutSection from '@/View/AboutView'
import WhyAttendSection from '@/View/WhyAttendView'
import SpeakersSection from '@/View/SpeakerView'
import SponsorsSection from '@/View/SponsorView'
import Footer from '@/View/FooterView'

const page = () => {
  return (
    <div>
      <HomeView/>
      <AboutSection/>
      <WhyAttendSection/>
      <SpeakersSection/>
      <SponsorsSection/>
      <Footer/>
    </div>
  )
}

export default page
