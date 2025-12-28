const SpeakersSection = () => {
  const speakers = [
    { name: 'Alice Johnson', title: 'Web3 Innovator', image: '/images/speaker1.jpg' },
    { name: 'David Smith', title: 'Blockchain Expert', image: '/images/speaker2.jpg' },
    { name: 'Lila Nguyen', title: 'NFT Strategist', image: '/images/speaker3.jpg' },
  ];

  return (
    <section className="w-full py-20 bg-black text-white px-6 md:px-20">
      <h2 className="text-4xl md:text-5xl font-bold text-center mb-10">
        Meet Our Speakers
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {speakers.map((speaker, idx) => (
          <div key={idx} className="bg-gray-900 rounded-xl p-6 flex flex-col items-center text-center shadow-lg">
            <div className="w-32 h-32 mb-4 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
              <img src={speaker.image} alt={speaker.name} className="w-full h-full object-cover" />
            </div>
            <h3 className="text-2xl font-semibold">{speaker.name}</h3>
            <p className="text-gray-300">{speaker.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpeakersSection;
