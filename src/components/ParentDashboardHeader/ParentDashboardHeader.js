import React, { useState, useEffect } from "react";
import styles from "./ParentDashboardHeader.module.css";
import explore from "./../../assets/images/explore-bg.png";
import Drop from "./../../assets/YIcons/Drop.svg";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import shivam from "./../../assets/images/tutors/shivam-shrivastab.png";
import { Link, useNavigate } from "react-router-dom";
import josephBrown from "../../assets/images/joseph-brown.png";
import rightArrow from "../../assets/icons/arrow-down.png";
import AnnouncementsDefaultImage from  "../../assets/Dashboard/AnnouncementsDefaultImage.png";
import { useLazyGetSettingsQuery } from "../../app/services/session";
import ImageSlideshow from "../ImageSlideshow/ImageSlideshow";
import { useLazyGetUserDetailQuery } from "../../app/services/users";
import { useSelector } from "react-redux";
import InputSelect from "../InputSelect/InputSelect";
import Ledger from "./../../pages/Ledger/Ledger";
import { useLazyPayBalanceQuery } from "../../app/services/dashboard";
import { useDisableBodyScroll } from "../../hooks/useDisableBodyScroll";
import InputSelectNew from "../InputSelectNew/InputSelectNew";
import { useRef } from "react";


const ParentDashboardHeader = ({ selectedStudent, setSelectedStudent }) => {
  const [images, setImages] = useState([]);
  const [user, setUser] = useState({});
  const [associatedStudents, setAssociatedStudents] = useState([]);
  const { organization } = useSelector((state) => state.organization);
  const [ledgerVisible, setLedgerVisible] = useState(false);
  const tutorCarouselRef = useRef();
  const [getUserDetail, userDetailResp] = useLazyGetUserDetailQuery();
  const [fetchSettings, fetchSettingsResp] = useLazyGetSettingsQuery();
  const [payBalance, payBalanceResp] = useLazyPayBalanceQuery();

  const [detailStudent, setDetailStudent] = useState(null);
  const { awsLink } = useSelector((state) => state.user);

  const navigate = useNavigate();
  //  sessionStorage
  const { id, amountToPay, credits } = useSelector((state) => state.user);

  useDisableBodyScroll(ledgerVisible);
  useEffect(() => {
    // fetchSettings().then((res) => {
    //   console.log("images loaded", res);
    //   setImages(res.data.data.setting.offerImages);
    //   console.log(res.data.data.setting);
    // });
    getUserDetail({ id }).then((res) => {
      // console.log('response', res.data.data);
      const baseLink = res.data.data.baseLink;
      setUser(res.data.data.user);
      setAssociatedStudents([]);
      res.data.data.user.assiginedStudents.map((student, idx) => {
        getUserDetail({ id: student }).then((res) => {
          if (res.error) return;
          setAssociatedStudents((prev) => [
            ...prev,
            {
              _id: res.data?.data?.user._id,
              name: `${res.data?.data?.user.firstName} ${res.data?.data?.user.lastName}`,
              photo: res.data.data?.user.photo
                ? `${baseLink}${res.data.data.user.photo}`
                : "/images/Rectangle 2346.svg",
              serviceSeeking: res.data?.data?.userdetails?.serviceSeeking,
            },
          ]);
          setSelectedStudent({
            _id: res.data.data?.user._id,
            value: `${res.data.data?.user.firstName} ${res.data.data?.user.lastName}`,
            photo: res.data.data?.user.photo
              ? `${baseLink}${res.data.data?.user.photo}`
              : "/images/Rectangle 2346.svg",
            serviceSeeking: res.data.data?.userdetails?.serviceSeeking,
          });
          setDetailStudent(res.data.data.userdetails);
        });
      });
    });
  }, []);

  useEffect(() => {
    if (organization?.settings) {
      console.log({ organization })
      setImages(organization?.settings?.offerImages)
    }
  }, [organization])
  useEffect(() => {
    if (user.assiginedStudents === undefined) return;
    const fetch = async () => {
      let studentsData = [];
      const students = await user.assiginedStudents.map((student) => {
        getUserDetail({ id: student }).then((res) => {
          studentsData.push({
            _id: res.data.data.user._id,
            name: `${res.data.data.user.firstName} ${res.data.data.user.lastName}`,
          });
        });
      });
      // setAssociatedStudents(studentsData)
    };
    fetch();
  }, [user]);

  const handlePay = () => {
    payBalance().then((res) => {
      if (res.error) {
        console.log(res.error);
        if (res.error.data) alert(res.error.data.message);
        return;
      }
      console.log(res.data.data);
      if (res.data.data) {
        if (res.data.data.link) window.open(res.data.data.link);
      }
    });
  };
  const openLink = (link) => {
    console.log({ link })
    window.open(link, '_blank');

  }
  console.log("associatedStudents", associatedStudents);
  console.log("selectedStudent", selectedStudent);

  return (
    <div className="w-full flex-1 mb-5">
      <p className="text-[#24A3D9] mb-[30px] mt-[50px] text-[20px]">
        {organization?.company +
          " > " +
          user?.firstName +
          " " +
          user?.lastName +
          " > "}
        <span className="font-semibold">Dashboard</span>
      </p>
      {ledgerVisible && <Ledger setLedgerVisible={setLedgerVisible} />}

      <div
        className="flex flex-row items-start justify-between"
        id={styles.parentDashboardHeader}
      >
          <div className="flex flex-row justify-between w-[1045px]">
            <div className="w-[550px]">
              <p className="text-base-20 text-[#26435F] font-semibold text-[20px] mb-1">
                Announcements
              </p>

              <div
                className="w-full h-[250px] relative flex rounded-md items-center  shadow-[0px_0px_2.500001907348633px_0px_#00000040] parentDashboardCarousel"
                id={styles.exploreBgDisable}
              >
                <div className={styles.images}>
                  {images?.length > 0 ? (
                    <OwlCarousel
                      ref={tutorCarouselRef}
                      className="owl-theme h-full"
                      loop
                      margin={8}
                      items={1}
                    >
                      {images.map((image, idx) => {
                        return (
                          <div className={` rounded-md bg-cover	bg-center	 ${styles.img} !h-[250px] !relative !transform-none flex flex-col gap-[43px]  items-start justify-end`}
                          style={{
                            backgroundImage: `url(${image?.image ? `${awsLink}${image?.image}` : AnnouncementsDefaultImage})`
                          }}
                          >                
                            <button onClick={() => openLink(image.link)} className="bg-[#FFA28D] text-white p-2 text-[17.5px] px-4 rounded-lg  ml-[30px] w-auto z-10 mb-[26px]">
                              {image?.buttonText ? image?.buttonText : "Register"}
                            </button>
                          </div>
                        );
                      })}
                    </OwlCarousel>
                  ) : (
                    <p
                      className="text-white  text-center w-full font-semibold pt-8 not-italic pb-8 text-lg"
                      style={{
                        fontSize: "18px",
                        fontStyle: "normal",
                        fontWeight: "500",
                      }}
                    >
                      No Announcements
                    </p>
                  )}
                </div>
                {/* {images?.length >= 1 && (
                  <ImageSlideshow images={images} text="text" />
                )}
                {console.log({images})} */}
              </div>
            </div>
            <div className="w-[462.5px]">
              <p className="text-base-20 text-[#26435F] font-semibold text-[20px] mb-1">
                Invoice Details
              </p>

              <div
                className={`w-full h-[250px] flex flex-col items-center justify-center gap-7 bg-white rounded-md`}
              >
                <div className="text-[#667085] bg-[#66708555] p-3 rounded-[15px] h-[102px] w-[355px] flex flex-col gap-7 justify-center items-center">
                  <p className="whitespace-nowrap text-3xl leading-none mb-1 translate-y-5">
                    {/* {credits < 0 ? -credits : credits} USD */}-
                  </p>
                  <p
                    className="font-medium cursor-pointer text-[17.5px]"
                    onClick={() => setLedgerVisible(true)}
                  >
                    View Ledger
                  </p>
                </div>
                <button
                  className={`bg-[#667085] rounded-md py-2 text-white w-[354px] text-[17.5px] font-semibold`}
                  disabled={amountToPay === 0}
                  onClick={handlePay}
                >
                  {amountToPay !== 0 && false ? (
                    <>Pay Now: $ {amountToPay}</>
                  ) : (
                    <>Coming Soon</>
                  )}
                </button>
              </div>
            </div>
          </div>

        <div className="w-[490px]">
          <div className="flex justify-between items-center ">
            <InputSelectNew
              optionType="object"
              label={"Select Student "}
              labelClassname="text-[#26435F]  font-semibold text-[20px] mb-[5px]"
              iconClass="text-[#26435F] ml-2 translate-y-[0px]  mb-1"
              parentClassName=""
              inputContainerClassName="pt-1 pb-1"
              optionData={associatedStudents.map((item) => ({
                _id: item._id,
                name: item.name,
                value: item.name,
                photo: item.photo,
                serviceSeeking: item.serviceSeeking,
              }))}
              labelIcon={Drop}
              optionClassName="w-[130px] text-sm"
              optionListClassName="text-sm"
              value={""}
              onChange={(val) => setSelectedStudent(val)}
            />

          </div>
          <div className=".mybox -mt-[30px] bg-white relative shadow-[0px_0px_2.500001907348633px_0px_#00000040] h-[250px] rounded-md w-[490px]">
            <div id="borderLeft" className=""></div>
            <svg className="absolute bottom-0 left-0 z-10" xmlns="http://www.w3.org/2000/svg" width="490" height="99" viewBox="0 0 490 99" fill="none">
  <path d="M489.25 93.7501V0C486.489 0 484.25 2.23853 484.25 4.99989L484.25 50.6251L484.25 88.1251C484.25 90.8865 482.012 93.1251 479.25 93.1251H11.125C8.36358 93.1251 6.125 90.8865 6.125 88.1251V49.3751L6.125 5.625C6.125 2.5184 3.6066 0 0.5 0V93.7501C0.5 96.5115 2.73858 98.7501 5.5 98.7501H484.25C487.012 98.7501 489.25 96.5115 489.25 93.7501Z" fill="#26435F"/>
</svg>
            <div
              className={` relative  w-100 h-[250px] px-[22px] `}
            >
              <div className="flex flex-1 px-3 justify-between py-auto h-[250px] items-center">
                {associatedStudents.length > 0 && (
                  <>
                    <div className="w-1/2 z-20">
                      <h2 className="mt-0 mb-8 text-[22px] font-semibold text-base-22-5  text-[#FFA28D]">
                        {/* {selectedStudent !== null && 'Joseph Brown'}  */}
                        {selectedStudent === null
                          ? "No students associated"
                          : selectedStudent.value}
                      </h2>
                      {/* <h6 className="text-[10px]">SAT Tutoring <br />Subject Tutoring</h6> */}

                      <ul className="text-[#517CA8] my-8 text-[17.5px]">
                        {selectedStudent?.serviceSeeking?.length > 0 ? selectedStudent?.serviceSeeking?.map((item, idx) => (
                          <li>
                            {item}
                            {idx < selectedStudent?.serviceSeeking?.length - 1
                              ? ","
                              : ""}{""}
                          </li>
                        )) : "No service"}

                      </ul>

                      <Link
                        className="p-2 mt-8 rounded-lg whitespace-nowrap text-sm px-4 bg-[#FFA28D] text-white relative z-20"
                        to={
                          selectedStudent !== null &&
                          `/profile/student/${selectedStudent._id}`
                        }
                      >
                        View Profile
                      </Link>
                    </div>
                  </>
                )}
                {associatedStudents.length === 0 && (
                  <p>No students Associated</p>
                )}
                {associatedStudents.length > 0 && selectedStudent !== null && (
                  <div className="relative ml-3 mt-1 !w-[128px] !h-[128px]">
                    {/* <img src=""/> */}
                    <img
                      className="absolute z-[500] left-[-6px] top-[30px] rounded-full  object-cover shrink-0 !w-[128px] !h-[128px]"
                      src={
                        selectedStudent.photo ? `${selectedStudent.photo}` : ""
                      }
                      alt=""
                    />
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="z-5000 rotate-[0.7deg]"
                      width="100"
                      height="112"
                      viewBox="0 0 108 144"
                      fill="none"
                    >
                      <path
                        d="M1.08485 11.1823C11.5308 5.14155 23.363 1.90312 35.4341 1.78098C47.5053 1.65883 59.406 4.65711 69.9823 10.4851C80.5587 16.3132 89.4518 24.7732 95.7996 35.045C102.147 45.3168 105.734 57.0519 106.213 69.1125C106.691 81.1731 104.045 93.15 98.5308 103.882C93.0163 114.614 84.8207 123.737 74.7387 130.367C64.6566 136.996 53.0301 140.907 40.9863 141.721C28.9425 142.534 16.8902 140.223 5.99775 135.01"
                        stroke="#26435F"
                        strokeWidth="3.19966"
                      />
                    </svg> */}
                  </div>
                )}
              </div>
            </div>
            <div id="borderRight" className=""></div>
            <div id="borderBottom" className=""></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboardHeader;
