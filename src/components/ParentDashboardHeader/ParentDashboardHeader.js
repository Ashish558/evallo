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
import { useLazyGetSettingsQuery } from "../../app/services/session";
import ImageSlideshow from "../ImageSlideshow/ImageSlideshow";
import { useLazyGetUserDetailQuery } from "../../app/services/users";
import { useSelector } from "react-redux";
import InputSelect from "../InputSelect/InputSelect";
import Ledger from "./../../pages/Ledger/Ledger";
import { useLazyPayBalanceQuery } from "../../app/services/dashboard";
import { useDisableBodyScroll } from "../../hooks/useDisableBodyScroll";
import InputSelectNew from "../InputSelectNew/InputSelectNew";

const ParentDashboardHeader = ({ selectedStudent, setSelectedStudent }) => {
  const [images, setImages] = useState([]);
  const [user, setUser] = useState({});
  const [associatedStudents, setAssociatedStudents] = useState([]);
  const { organization } = useSelector((state) => state.organization);
  const [ledgerVisible, setLedgerVisible] = useState(false);

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
    fetchSettings().then((res) => {
      setImages(res.data.data.setting.offerImages);
      console.log(res.data.data.setting);
    });
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
                : "/images/default.jpeg",
              serviceSeeking: res.data?.data?.userdetails?.serviceSeeking,
            },
          ]);
          setSelectedStudent({
            _id: res.data.data?.user._id,
            value: `${res.data.data?.user.firstName} ${res.data.data?.user.lastName}`,
            photo: res.data.data?.user.photo
              ? `${baseLink}${res.data.data?.user.photo}`
              : "/images/default.jpeg",
            serviceSeeking: res.data.data?.userdetails?.serviceSeeking,
          });
          setDetailStudent(res.data.data.userdetails);
        });
      });
    });
  }, []);

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

  console.log("associatedStudents", associatedStudents);
  console.log("selectedStudent", selectedStudent);

  return (
    <div className="w-full flex-1 mb-5">
      <p className="text-[#24A3D9] mt-7 mb-3 !my-[calc(50*0.0522vw)]">
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
        className="flex flex-row !gap-[calc(68*0.0522vw)] "
        id={styles.parentDashboardHeader}
      >
        <div className="w-full lg:w-2/3 !w-[calc(1050*0.0522vw)]">
          <div className="flex flex-row justify-between !w-[calc(1050*0.0522vw)]">
            <div className="w-full lg:w-2/3  !w-[calc(550*0.0522vw)] h-[206px] lg:h-auto ">
              <p className=" text-sm text-[#26435F] font-semibold text-base-20 mb-1">
                Announcements
              </p>

              <div
                className="w-full h-[225px] design:h-[260px] relative flex rounded-md items-center overflow-hidden shadow-[0px_0px_2.500001907348633px_0px_#00000040]"
                id={styles.exploreBgDisable}
              >
                {images?.length >= 1 && (
                  <ImageSlideshow images={images} text="text" />
                )}
              </div>
            </div>
            <div className="w-full lg:w-2/3  !w-[calc(463*0.0522vw)] h-[206px] lg:h-auto ">
              <p className=" text-sm text-[#26435F] font-semibold text-base-20 mb-1">
                Invoice details
              </p>

              <div
                className={`w-full  h-[225px] design:h-[260px] flex flex-col items-center justify-center gap-7 bg-white rounded-md`}
              >
                <div className="text-[#667085] bg-[#66708555] p-3 rounded-[15px] !w-[calc(354*0.0522vw)] flex flex-col gap-7 justify-center items-center">
                  <p className="whitespace-nowrap text-3xl leading-none mb-1 translate-y-5">
                    {/* {credits < 0 ? -credits : credits} USD */}-
                  </p>
                  <p
                    className="text-[13.17px] font-bold cursor-pointer text-base-17-5"
                    onClick={() => setLedgerVisible(true)}
                  >
                    View Ledger
                  </p>
                </div>
                <button
                  className={`bg-[#667085] rounded-md py-2 text-white  !w-[calc(354*0.0522vw)] text-base-17-5`}
                  disabled={amountToPay === 0}
                  onClick={handlePay}
                >
                  {amountToPay !== 0 ? (
                    <>Pay Now: $ {amountToPay}</>
                  ) : (
                    <>Coming Soon</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3 ">
          <div className="flex justify-between items-center px-[11px]">
          <InputSelectNew
                optionType="object"
                label={"Select Student "}
                labelClassname="text-[#26435F] -mt-2 font-semibold text-base-20 mb-1"
                iconClass=" translate-y-[0px] ml-3"
                parentClassName="mb-2"
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
          <div className=".mybox -mt-5 bg-white relative shadow-[0px_0px_2.500001907348633px_0px_#00000040] border-b-4 border-b-[#26435F] h-[215px] rounded-md !w-[calc(489*0.0522vw)]">
            <div id="borderLeft" className="rounded-r-lg"></div>

            <div
              className={` relative  w-100 h-full px-[22px] `}
            >
              <div className="flex flex-1 px-3 justify-between py-auto h-full items-center">
                {associatedStudents.length > 0 && (
                  <>
                    <div className="w-1/2">
                      <h2 className="mt-0 mb-8 font-semibold text-base-22-5  text-[#FFA28D]">
                        {/* {selectedStudent !== null && 'Joseph Brown'}  */}
                        {selectedStudent === null
                          ? "No students associated"
                          : selectedStudent.value}
                      </h2>

                      {/* <h6 className="text-[10px]">SAT Tutoring <br />Subject Tutoring</h6> */}

                      <ul className="text-[12px] text-[#517CA8] my-8 text-base-17-5">
                        {selectedStudent?.serviceSeeking?.length>0 ? selectedStudent?.serviceSeeking?.map((item, idx) => (
                          <li>
                            {item}
                            {idx < selectedStudent?.serviceSeeking?.length - 1
                              ? ","
                              : ""}{""}
                          </li>
                        )):"No service"}
                       
                      </ul>

                      <Link
                        className="p-2 mt-8 rounded-lg whitespace-nowrap text-sm px-4 bg-[#FFA28D] text-white"
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
                  <div className="relative ml-3 mt-1">
                    <img
                      className="absolute z-[500] left-[-15px] top-[6px] rounded-full !w-[100px] !h-[100px] object-cover shrink-0"
                      src={
                        selectedStudent.photo ? `${selectedStudent.photo}` : ""
                      }
                      alt=""
                    />
                    <svg
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
                    </svg>
                  </div>
                )}
              </div>
            </div>
            <div id="borderRight" className="rounded-l-lg bg-red-600"></div>
            <div id="borderBottom" className="rounded-b-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboardHeader;
