
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SandTimerGif from './sand-timer.gif';

const LoaderPage = () => {

  return (
    <div className='flex flex-col items-center justify-center min-h-screen'>
      <div className='text-3xl font-bold mb-4'>We're Preparing Your Test Preview</div>
      <div className='w-40'>
        <img src={SandTimerGif} alt='Sand Timer' />
      </div>
      <div className='text-xl text-center mt-4'>
        This may take up to a minute. Please don't refresh this page or quit the app.
      </div>
      
      
    </div>
  );
};

export default LoaderPage;
