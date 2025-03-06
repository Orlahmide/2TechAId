import React, { useEffect, useState } from 'react';

const Marquise = () => {

    const sentences = [
        "Welcome to the Staff Dashboard!",
        "Stay productive and manage tickets efficiently.",
        "Tip: Always update ticket statuses regularly.",
        "Need help? Check the user guide in the sidebar.",
        "Track and resolve tickets in real-time!",
        "New feature coming soon: AI ticket suggestions!",
      ];
      const [marqueeText, setMarqueeText] = useState(sentences[0]);
    
      // ✅ Change text every 5 seconds
      useEffect(() => {
        const interval = setInterval(() => {
          setMarqueeText(sentences[Math.floor(Math.random() * sentences.length)]);
        }, 15000); // Change text every 10 seconds
        return () => clearInterval(interval);
      }, []);
  return <div>
     <div className="mt-5/6 w-full h-16 text-blue-900 
                flex items-center overflow-hidden mt-16">
          <div className="whitespace-nowrap animate-marquee text-lg font-semibold rounded-lg">
            {marqueeText}
          </div>
        </div>

  </div>;
};

export default Marquise;