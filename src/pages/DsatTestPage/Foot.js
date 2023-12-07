import React from "react";
import {
  faXmark,
  faLocationDot,
  faBookmark,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import Modal from "../../components/Modal/Modal";
export default function Foot(props) {
  // const {next,prev  ,ind,s,data ,set} =props
  const {
    next,
    prev,
    mark,
    name,
    i,
    s,
    data,
    sectionDetails,
    sectionindex,
    set,
    answers,
    handleSubmitSection,
    tog2,
    toggle2,
    markreview,
  } = props;
  const [toggle, setToggle] = useState(false);
  const [btnloader, setbtnloader] = useState(false);
  function set_btnloader() {
    setbtnloader(true);
  }
  let click = (e) => {
    if (e.target.innerText == 1) {
      set(1);
    }
    set(e.target.innerText - 1);
    console.log(e.target.innerText);
  };
  let click2 = (e) => {
    tog2();
    if (e.target.innerText == 1) {
      set(1);
    }
    set(e.target.innerText - 1);
    console.log(e.target.innerText);
  };
  let tog = () => {
    setToggle(!toggle);
  };
  return (
    <>
      {toggle2 ? (
        <section className=" bg-white absolute  shadow-md shadow-gray-400 top-[16%] px-12 pt-2 h-[60%] w-full ">
          <h3 className=" text-center text-lg py-3 font-semibold">
            Section {" " + sectionindex + " "} :
            {" " + sectionDetails?.name ? sectionDetails.name : "loading..."}{" "}
          </h3>
          <hr className=" border border-gray-400 border-t-0" />
          <div className=" py-3 flex text-center align-middle justify-evenly">
            <div>
              <FontAwesomeIcon
                icon={faSquare}
                color="white"
                className="border-black border rounded mr-2 "
              />
              <span>Unanswered</span>
            </div>
            <div>
              <FontAwesomeIcon
                icon={faBookmark}
                color="yellow"
                className="mr-2"
              />
              <span>For review</span>
            </div>
          </div>
          <hr className=" border border-gray-400 border-t-0" />
          <div className=" pt-8 flex justify-center">
            {data.map((e, ind) => {
              return (
                <span
                  onClick={click2}
                  className={`text-black font-semibold border border-dotted border-black py-2 px-3 mx-2 ${
                    answers[ind].ResponseAnswer != ""
                      ? "text-white bg-blue-600"
                      : null
                  } ${markreview[ind]?.review && "bg-yellow-400"}`}
                >
                  {ind + 1}
                </span>
              );
            })}
          </div>
        </section>
      ) : null}
      <div className=" ">
        {toggle ? (
          <div className="absolute w-full flex bottom-20  justify-center items-center ">
            <section className=" bg-white  shadow-md shadow-gray-400 px-12 pt-2 h-64">
              <h3 className=" text-center text-lg py-3 font-semibold">
                Section {" " + sectionindex + " "} :{" "}
                {" " + sectionDetails?.name
                  ? sectionDetails.name
                  : "loading..."}{" "}
              </h3>
              <FontAwesomeIcon
                onClick={tog}
                icon={faXmark}
                className=" absolute right-7 top-6"
              />
              <hr className=" border border-gray-400 border-t-0" />
              <div className=" py-3 flex text-center align-middle justify-evenly">
                <div>
                  <FontAwesomeIcon
                    icon={faSquare}
                    color="green"
                    className="border-black rounded mr-2 "
                  />
                  <span>Current</span>
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faSquare}
                    color="white"
                    className="border-black border rounded mr-2 "
                  />
                  <span>Unanswered</span>
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faBookmark}
                    color="yellow"
                    className="mr-2"
                  />
                  <span>For review</span>
                </div>
              </div>
              <hr className=" border border-gray-400 border-t-0" />
              <div className=" pt-8">
                {data?.map((e, ind) => {
                  return (
                    <span
                      onClick={click}
                      className={` relative text-black font-semibold border border-dotted border-black py-2 px-3 mx-2 ${
                        i == ind + 1
                          ? "text-white bg-green-600"
                          : answers[ind].ResponseAnswer != ""
                          ? "text-white bg-blue-600"
                          : null
                      } ${markreview[ind].review && "bg-yellow-400"}`}
                    >
                      {mark[i + 1] ? (
                        <FontAwesomeIcon
                          icon={faBookmark}
                          className={` absolute top-0 text-red-700 `}
                        />
                      ) : null}
                      {ind + 1}
                    </span>
                  );
                })}
              </div>
              <div
                className=" left-40 text-blue-700 font-semibold flex justify-center items-center mx-16 px-6 border border-blue-700 mt-8 py-1  rounded-2xl"
                onClick={() => {
                  tog();
                  tog2();
                }}
              >
                <button> Go to review page </button>
              </div>
            </section>
          </div>
        ) : null}
        <footer className="w-[1920px] absolute   left-0 right-0 bottom-0 flex justify-between px-12 pt-4 pb-8 border border-black ">
          <div className="flex justify-start items-center w-1/3">
            <h2 className=" text-xl font-semibold ">{name}</h2>
          </div>

          {toggle2 ? null : (
            <div className="flex justify-center items-center w-1/3">
              <button
                className={` bg-black text-white rounded-lg w-48 relative `}
                onClick={tog}
              >
                Question {i} of {s}{" "}
              </button>
            </div>
          )}
          <div className=" flex flex-row justify-end items-center w-1/3 ">
            {i > 1 ? (
              <button
                className=" bg-blue-700 rounded-full py-2 px-6 text-white font-semibold mx-2  "
                onClick={toggle2 ? tog2 : prev}
              >
                Back
              </button>
            ) : null}

            <button
              className=" bg-blue-700 rounded-full py-2 px-6 text-white font-semibold "
              onClick={i < s ? next : !toggle2 ? tog2 : set_btnloader}
            >
              {i >= s && toggle2 ? "Submit" : "Next"}
            </button>
          </div>
        </footer>
      </div>
      {btnloader ? (
        <div className="max-w-1/2 relative flex justify-center items-center h-full">
          <Modal

          topClass={"!h-[115%]"}
            classname="max-w-[700px] mx-auto !mt-[120px]"
            title="Are you sure you want to Submit the section?"
            titleClassName="mr-4  mb-4"
            primaryBtn={{
              text: "Submit",
              className: "bg-[#FF7979] w-[146.67px] h-[46.67px] ml-0",
              onClick: handleSubmitSection,
            }}
            handleClose={() => setbtnloader(false)}
          />
        </div>
      ) : null}
    </>
  );
}
