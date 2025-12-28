import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import SwiperCore, { Autoplay } from 'swiper';

SwiperCore.use([Autoplay]);

const SponsorsSection = () => {
  const sponsors = [
    '/images/sponsor1.png',
    '/images/sponsor2.png',
    '/images/sponsor3.png',
    '/images/sponsor4.png',
    '/images/sponsor5.png',
  ];

  return (
    <section className="w-full py-10 bg-black">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-8">
        Our Sponsors
      </h2>
      <Swiper
        spaceBetween={30}
        slidesPerView={3}
        loop={true}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        breakpoints={{
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1024: { slidesPerView: 5 },
        }}
      >
        {sponsors.map((logo, idx) => (
          <SwiperSlide key={idx} className="flex items-center justify-center">
            <img src={logo} alt={`Sponsor ${idx + 1}`} className="h-16 object-contain" />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default SponsorsSection;
