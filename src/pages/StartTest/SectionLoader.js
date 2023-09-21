import React, { useEffect, useState } from 'react';
import "./SectionLoader.css"
export default function SectionLoader({ onSubmit }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate submission delay for 3 seconds
    setTimeout(() => {
      setIsLoading(false);
      onSubmit();
    }, 3000);
  }, [onSubmit]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-center">
        <p className="text-2xl font-semibold text-blue-900 my-4">This Module Is Over</p>
        <p className="text-lg mb-2">All your work has been saved.</p>
        <p className="text-lg mb-2">You'll move on automatically in just a moment.</p>
        <p className="text-lg mb-4">Do not refresh this page or quit the app.</p>
        {isLoading && (
          <div className="flex items-center justify-center">
            <div className="loader-dots space-x-2">
    <div className="loader-dot"></div>
    <div className="loader-dot"></div>
    <div className="loader-dot"></div>
  </div>

          </div>
        )}
      </div>
    </div>
  );
}
