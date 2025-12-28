import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const WhyAttendSection = () => {
  const cards = [
    { title: 'Networking', desc: 'Meet top Web3 professionals and enthusiasts.' },
    { title: 'Learning', desc: 'Gain insights from expert talks and panels.' },
    { title: 'Innovation', desc: 'Discover cutting-edge Web3 projects and ideas.' },
    { title: 'Community', desc: 'Join a vibrant Web3 community.' },
  ];

  return (
    <section className="w-full py-20 bg-black text-white px-6 md:px-20">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-10">
        Why You Should Attend
      </h2>
      <Swiper
        spaceBetween={20}
        slidesPerView={1.2}
        breakpoints={{
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3 },
        }}
      >
        {cards.map((card, idx) => (
          <SwiperSlide key={idx}>
            <div className="bg-gray-900 rounded-xl p-6 flex flex-col items-center text-center h-full shadow-lg">
              <h3 className="text-2xl font-semibold mb-3">{card.title}</h3>
              <p className="text-gray-300">{card.desc}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default WhyAttendSection;
