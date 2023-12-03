import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useLocation } from 'react-router-dom'

const Layout2 = ({children}) => {
  const navRef = useRef(null);
  const footerRef = useRef(null);
  const layoutRef = useRef(null);
  const location = useLocation();

  const adjustScale = () => {
    const screenWidth = document.body.clientWidth;
    const scale = screenWidth > 0 ? screenWidth / 1920 : 0;

    if (navRef.current && layoutRef.current && footerRef.current) {
      navRef.current.style.transform = `scale(${scale > 1 ? 1 : scale})`;
      layoutRef.current.style.transform = `scale(${scale > 1 ? 1 : scale})`;
      footerRef.current.style.transform = `scale(${scale > 1 ? 1 : scale})`;
    }
  };
     const checkHeight = () => {
      const screenWidth = document.body.clientWidth;

      const scale = screenWidth > 0 ? screenWidth / 1920 : 0;
      if (layoutRef.current) {
        // Access the clientHeight property of the ref's current property
        const windowHeight = window.innerHeight;
        const bodyScrollHeight = document.body.scrollHeight;
        const documentScrollHeight = document.documentElement.scrollHeight;
        const maxScrollHeight = documentScrollHeight - windowHeight;
        const layoutRealHeightAfterScale = layoutRef.current.clientHeight * (scale > 1 ? 1 : scale);
        const previousMargin = footerRef.current.style.marginTop;
        const previousMarginTopAsNumber = parseInt(previousMargin, 10);
        
        const documentHeight = document.body.style.height;
        console.warn({windowHeight,layoutRealHeightAfterScale,documentHeight});

        if(windowHeight>layoutRealHeightAfterScale){
          // If this doesnot works try body.height = 100vh and footer as absolute and bottom 0


          // const thisReqMargin = documentScrollHeight - windowHeight;
          // if(!isNaN(previousMarginTopAsNumber)){
          //   console.warn({previousMarginTopAsNumber,thisReqMargin})
          // const newReqMargin = thisReqMargin - previousMarginTopAsNumber;
          // console.warn({newReqMargin})
          // footerRef.current.style.marginTop = `${Math.round(-newReqMargin)}px`
          // }else{
          //   console.log({thisReqMargin})
          //   console.warn('previousMarginTopAsNumber is not a number')
          // footerRef.current.style.marginTop = `${Math.round(-thisReqMargin)}px`
          // }

          // using body method
          // document.body.style.width = `110vw`;
          // document.body.style.overflow = 'hidden';
          // document.body.style.display = 'flex';
          // document.body.style.flexDirection = 'column';
          // document.body.style.alignItems = 'center';
          // footerRef.current.style.position = 'absolute';
          footerRef.current.style.marginTop = '0px';
          footerRef.current.style.bottom = '0';
          footerRef.current.style.left = '0';
          return;
        }else{
          document.body.style.height = 'unset';
          footerRef.current.style.position = 'static';
        }
        // console.warn({windowHeight,bodyScrollHeight,documentScrollHeight,maxScrollHeight});
        const reqMargin = documentScrollHeight - layoutRealHeightAfterScale;
        // console.warn({Height: layoutRef.current.clientHeight * (scale > 1 ? 1 : scale),'documentScrollHeight':documentScrollHeight});
        // console.warn({reqMargin:Math.round(reqMargin)});
        if(!isNaN(previousMarginTopAsNumber)){
          console.warn({previousMarginTopAsNumber,reqMargin})
        const newReqMargin = reqMargin - previousMarginTopAsNumber;
        console.warn({newReqMargin})
        footerRef.current.style.marginTop = `${Math.round(-newReqMargin)}px`
        }else{
          console.log({reqMargin})
          console.warn('previousMarginTopAsNumber is not a number')
        footerRef.current.style.marginTop = `${Math.round(-reqMargin)}px`
        }
      } else {
        console.error('Element not found!');
      }
    };


  useEffect(() => {
    // Initial adjustment on component mount
    adjustScale();

    // Add event listener for window resize
    const intervalId = setInterval(checkHeight, 1000);
    window.addEventListener('resize', adjustScale);

    // Cleanup event listener on component unmount
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('resize', adjustScale);
    };
  }, []);
  useEffect(()=>{
    if(footerRef.current){
      footerRef.current.style.marginTop = 0;
    }
  },[location])
  // useEffect(() => {
  //   // Function to check the height

  //   // Set up an interval to check the height every 1000 milliseconds (1 second)
  //   const intervalId = setInterval(checkHeight, 1000);

  //   // Clean up the interval when the component is unmounted
  //   return () => clearInterval(intervalId);
  // }, []);
  return (<>
  <Navbar myRef={navRef} />
  <div style={{transformOrigin:"top left"}} ref={layoutRef} className='w-[1920px] mx-auto flex-col items-center'>
  <div className='h-[72px] w-full'></div>
  {children}
  </div>
  <Footer myRef={footerRef}/>
  </>)
}

export default Layout2