import React from 'react';


const WhoWeAreSection = () => {
  return (
    <section className="bg-white opacity-100 py-12 px-4 md:px-8 lg:px-16">
      <section className="flex flex-col lg:flex-row items-center justify-center gap-8">
        <div className="lg:w-1/2 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-800 text-start mb-4">We are Victoriahalf</h2>
          <p className="text-gray-700 mb-8">
            We are a global accounting consulting firm, focused on building strong stakeholder relationships and strategic financial partnerships.
          </p>
          <section className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div className="md:w-[45%] w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Who we are?</h3>
              <p className="text-gray-700">
                To be the global leader in accounting consulting, empowering businesses with innovative financial strategies for sustainable growth.
              </p>
            </div>

            <div className="md:w-[45%] w-full">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our mission</h3>
              <p className="text-gray-700">
                Our mission at Victoriahalf is to provide tailored, client-focused accounting solutions that foster strong stakeholder relationships, drive financial success, and create long-term value for our clients. We are committed to delivering exceptional service with integrity, expertise, and a forward-thinking approach to meet the evolving needs of businesses globally.
              </p>
            </div>
          </section>
          <a href="#read-more" className="text-blue-600 hover:underline mt-4 block">Read our story</a>
        </div>
        <div className="lg:w-1/2 w-full max-w-xl mx-auto mt-8 lg:mt-0">
        </div>
      </section>
    </section>
  );
};

export default WhoWeAreSection;
