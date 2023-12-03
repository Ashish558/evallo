import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useEffect } from "react";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";

const Layout2 = ({ children }) => {
  const navRef = useRef(null);
  const footerRef = useRef(null);
  const layoutRef = useRef(null);
  const location = useLocation();
  const [layoutParentHeight, setLayoutParentHeight] = useState(null);

  const adjustScale = () => {
    const screenWidth = document.body.clientWidth;
    const scale = screenWidth > 0 ? screenWidth / 1920 : 0;

    if (navRef.current && layoutRef.current && footerRef.current) {
      navRef.current.style.transform = `scale(${scale > 1 ? 1 : scale})`;
      layoutRef.current.style.transform = `scale(${scale > 1 ? 1 : scale})`;
      footerRef.current.style.transform = `scale(${scale > 1 ? 1 : scale})`;
      // const reverseScale = 1920>screenWidth? 0: 1920/screenWidth;
      // console.log({reverseScale});
      // layoutRef.current.style.marginTop = `-${50*(scale>1?1:1920/screenWidth)}px`;
    }
  };
  const checkHeight = () => {
    const screenWidth = document.body.clientWidth;
    const scale = screenWidth > 0 ? screenWidth / 1920 : 0;
    const layoutRealHeightAfterScale =
      layoutRef.current.clientHeight * (scale > 1 ? 1 : scale);
    setLayoutParentHeight(layoutRealHeightAfterScale);
  };

  useEffect(() => {
    // Initial adjustment on component mount
    adjustScale();

    // Add event listener for window resize
    const intervalId = setInterval(checkHeight, 1000);
    window.addEventListener("resize", adjustScale);

    // Cleanup event listener on component unmount
    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", adjustScale);
    };
  }, []);
  // useEffect(() => {
  //   if (footerRef.current) {
  //     footerRef.current.style.marginTop = 0;
  //   }
  // }, [location]);
  return (
    <>
      <div className="relative h-full">
        <Navbar myRef={navRef} />
        <div style={{height:layoutParentHeight!==null?`${layoutParentHeight}px`:''}} className='min-h-[calc(100vh-59px)]'>
        {/* <div className="flex-grow"> */}
          <div
            style={{ transformOrigin: "top left" }}
            ref={layoutRef}
            className="w-[1920px]  design:ml-[calc(50vw-960px)]"
          >
            {children}
          {/* </div> */}
        </div>
        </div>
        <Footer myRef={footerRef} />
      </div>
    </>
  );
};

export default Layout2;
