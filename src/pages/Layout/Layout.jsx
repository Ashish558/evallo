import React from "react";

// importing Navbar and Footer
import Navbar from "../../components/Navbar/Navbar";

// importing
import SubContainer from "../../components/Layout/subContainer";
import PathNameContainer from "../../components/Layout/PathNameContainer";

import logo from "../../assets/icons/Evallo Logo.svg";
import ContentContainer from "../../components/Layout/ContentContainer";

const Layout = () => {
  return (
    <>
      {/* <Navbar /> */}

      <navbar className="lg:w-[1920px] md:w-screen w-screen h-[72px] flex justify-between items-center bg-[#26435F] px-[100px]">
        {/* logo */}
        <div>
          <img src={logo} alt="logo" />
        </div>

        {/*  navlinks */}
        {/*  to be replaced with real navlinks */}
        <ul className="flex justify-center items-center">
          {[1, 1, 1, 1, 1, 1, 1].map((d, index) => {
            return <li className="mx-2 bg-red-900">links</li>;
          })}
        </ul>

        {/* options */}
        <ul className="flex justify-center items-center">
          {/*  to be replaced with real options */}
          {[1, 1, 1, 1, 1, 1, 1].slice(0, 3).map((d, index) => {
            return <li className="mx-2 bg-red-900">links</li>;
          })}
        </ul>

        <div></div>
      </navbar>

      <div
        className="lg:w-[1920px] md:w-screen w-screen h-auto flex flex-col justify-start items-center bg-[#F5F8FA]"
        // default padding - px-[160px]
      >
        <div className="lg:w-10/12 md:w-11/12 w-11/12 flex flex-col justify-start items-center mt-[50.17px] p-1">
          {/* pathName */}
          <PathNameContainer
            path={"{Organization Name} > {Admin Full Name} > Dashboard"}
          />

          {/*  unique to pages  */}
          <SubContainer
            marginTop={"mt-[40px]"}
            headerVisibility={true}
            heading={true}
            headingContent="heading"
            inputDateRangeVisibility={true}
            contentMarginTop={"mt-[15px]"}
            content={<></>}
          />

          {/*  divider lines */}
          <hr className="w-full bg-[#CBD6E2] my-[50px]" />

          {/*  */}

          <SubContainer 
             marginTop={"mt-[40px]"} 
             heading={true}
             headerVisibility={true}
             headingContent="heading"
             inputDateRangeVisibility={true}
             contentMarginTop={"mt-[15px]"}
             content={
               <>
                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta molestias veritatis odio quae optio! Quibusdam id quo obcaecati ut hic labore at exercitationem!

                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi, ab. Repellendus dolorum eveniet accusantium cumque, rerum laborum obcaecati ipsa cum nisi dolores aut distinctio provident ratione corporis sapiente in quo nemo libero ipsum veniam animi beatae nesciunt? Voluptatibus perferendis, consequuntur unde nulla labore adipisci doloribus.

                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet doloribus non, doloremque ea itaque quo animi, id quidem odit est, placeat eligendi nulla ipsa magni sed ad facere optio culpa! Repellendus itaque perferendis minus quaerat eaque tempora, natus, est, obcaecati earum illum assumenda. Repudiandae, explicabo.

                  Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta molestias veritatis odio quae optio! Quibusdam id quo obcaecati ut hic labore at exercitationem!
                  
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi, ab. Repellendus dolorum eveniet accusantium cumque, rerum laborum obcaecati ipsa cum nisi dolores aut distinctio provident ratione corporis sapiente in quo nemo libero ipsum veniam animi beatae nesciunt? Voluptatibus perferendis, consequuntur unde nulla labore adipisci doloribus.

                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet doloribus non, doloremque ea itaque quo animi, id quidem odit est, placeat eligendi nulla ipsa magni sed ad facere optio culpa! Repellendus itaque perferendis minus quaerat eaque tempora, natus, est, obcaecati earum illum assumenda. Repudiandae, explicabo.
               </>
             }
          />
          
          <SubContainer
              marginTop={"mt-[70.58px]"}
              heading={false}
              headerVisibility={false}
              headingContent="heading"
              inputDateRangeVisibility={false}
              
              content={
                <>
                   Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta molestias veritatis odio quae optio! Quibusdam id quo obcaecati ut hic labore at exercitationem!
 
                   Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi, ab. Repellendus dolorum eveniet accusantium cumque, rerum laborum obcaecati ipsa cum nisi dolores aut distinctio provident ratione corporis sapiente in quo nemo libero ipsum veniam animi beatae nesciunt? Voluptatibus perferendis, consequuntur unde nulla labore adipisci doloribus.
 
                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet doloribus non, doloremque ea itaque quo animi, id quidem odit est, placeat eligendi nulla ipsa magni sed ad facere optio culpa! Repellendus itaque perferendis minus quaerat eaque tempora, natus, est, obcaecati earum illum assumenda. Repudiandae, explicabo.
 
                   Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta molestias veritatis odio quae optio! Quibusdam id quo obcaecati ut hic labore at exercitationem!
                   
                   Lorem ipsum dolor sit amet consectetur, adipisicing elit. Excepturi, ab. Repellendus dolorum eveniet accusantium cumque, rerum laborum obcaecati ipsa cum nisi dolores aut distinctio provident ratione corporis sapiente in quo nemo libero ipsum veniam animi beatae nesciunt? Voluptatibus perferendis, consequuntur unde nulla labore adipisci doloribus.
 
                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet doloribus non, doloremque ea itaque quo animi, id quidem odit est, placeat eligendi nulla ipsa magni sed ad facere optio culpa! Repellendus itaque perferendis minus quaerat eaque tempora, natus, est, obcaecati earum illum assumenda. Repudiandae, explicabo.
                </>
              }
          />
          <div className="mt-[70.58px]"></div>
        </div>
      </div>

      
      {/* <footer className="lg:w-[1920px] md:w-screen w-screen flex justify-between items-center bg-[#26435F] text-white pl-[87.33px] pr-[61px] py-[24px]">

        Copyright © Evallo Digital Products Private Limited

        <ul className="e font-medium flex justify-center items-center">
          <li className="mr-[43.33px]">Terms Of Usage</li>
          <li>Terms Of Usage</li>
        </ul>

      </footer> */}
    </>
  );
};

export default Layout;
