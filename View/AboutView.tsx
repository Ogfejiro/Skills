const AboutSection = () => {
  return (
    <section className="w-full py-20 bg-black text-white px-6 md:px-20">
      <div className="flex flex-col md:flex-row items-center gap-10">
        {/* About Text */}
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            About LOFTE-3
          </h2>
          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6">
            LOFTE-3 is Nigeria's premier Web3 event, bringing together
            enthusiasts, innovators, and investors. Experience talks, panels,
            and networking opportunities like never before.
          </p>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Connect with top Web3 professionals</li>
            <li>Learn from expert-led panels and talks</li>
            <li>Discover cutting-edge projects and innovations</li>
          </ul>
        </div>

        {/* Video Placeholder */}
        <div className="flex-1 w-full h-64 md:h-96 bg-gray-800 flex items-center justify-center rounded-xl">
          <span className="text-gray-400 text-lg">[Video Placeholder]</span>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
