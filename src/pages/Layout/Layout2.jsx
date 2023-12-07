import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { useEffect } from "react";
import { useRef } from "react";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import loginStyles from '../Login/Login.module.css'

const Layout2 = ({ children }) => {
  const navRef = useRef(null);
  const footerRef = useRef(null);
  const layoutRef = useRef(null);
  const layoutParentRef = useRef(null);
  const location = useLocation();
  const [layoutParentHeight, setLayoutParentHeight] = useState(null);
  const [scaleState,setScaleState] = useState(1);
  const { isLoggedIn } = useSelector((state) => state.user);

  const adjustScale = () => {
    const screenWidth = document.body.clientWidth;
    const scale = screenWidth > 0 ? screenWidth / 1920 : 0;

    if (navRef.current && layoutRef.current && footerRef.current) {
      navRef.current.style.transform = `scale(${scale > 1 ? 1 : scale})`;
      layoutRef.current.style.transform = `scale(${scale > 1 ? 1 : scale})`;
      footerRef.current.style.transform = `scale(${scale > 1 ? 1 : scale})`;
      // const reverseScale = 1920>screenWidth? 0: 1920/screenWidth;
      // console.log({reverseScale});
      // layoutRef.current.style.marginTop = `-${72*(scale>1?0:(1-scale))}px`;
    }
  };
  const checkHeight = () => {
    const screenWidth = document.body.clientWidth;
    const windowHeight = window.innerHeight;
    const scale = screenWidth > 0 ? screenWidth / 1920 : 0;
    setScaleState(scale);
    if(layoutRef.current){
    const layoutRealHeightAfterScale =
      layoutRef.current?.clientHeight * (scale > 1 ? 1 : scale);
      if((layoutRealHeightAfterScale+72+67)<windowHeight){
        const heightForFullScreenLayout = windowHeight-67;
        layoutRef.current.style.marginTop = `-${72*(scale>1?0:(1-scale))}px`;
    // console.warn({windowHeight,layoutRealHeightAfterScale,heightForFullScreenLayout});
        setLayoutParentHeight(heightForFullScreenLayout);
        // footerRef.current.style.position = 'absolute';
      }else{
        // footerRef.current.style.position = 'static';
        layoutRef.current.style.marginTop = `-${130*(scale>1?0:(1-scale))}px`;
        // console.warn({layoutRefMarginTop:130*(scale>1?0:(1-scale)),layoutRealHeightAfterScale})
    setLayoutParentHeight(layoutRealHeightAfterScale);
  };}
  // if (navRef.current && layoutParentRef.current) {
  //   const rect1 = navRef.current.getBoundingClientRect();
  //   const rect2 = layoutParentRef.current.getBoundingClientRect();
  //   const distance = rect2.top - rect1.height;
  //   console.warn({rect1,rect2,distance});
  //   if(distance>1){
  //     layoutParentRef.current.style.marginTop = `-${distance}px`
  //   }
  // }
  }
  useEffect(() => {
    adjustScale();
    const intervalId = setInterval(checkHeight, 100);
    window.addEventListener("resize", adjustScale);
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
      <div style={{backgroundRepeat:"repeat"}} className={`relative h-full min-h-screen ${isLoggedIn===false?loginStyles.bg:""}`}>
        <Navbar myRef={navRef} />
        <div ref={layoutParentRef} style={{height:layoutParentHeight!==null?`${layoutParentHeight}px`:''}} className='min-h-[calc(100vh-67px)]'>
        {/* <div className="flex-grow"> */}
          <div
            style={{ transformOrigin: "top left" }}
            ref={layoutRef}
            className="w-[1920px] design:ml-[calc(50vw-960px)] static"
          >
            {children}
          {/* </div> */}
        </div>
        </div>
        <Footer scaleState={scaleState} myRef={footerRef} />
      </div>
    </>
  );
};

export default Layout2;
