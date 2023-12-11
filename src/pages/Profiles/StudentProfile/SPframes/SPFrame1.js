import React, { useState } from "react";
import styles from "../style.module.css";
import { useSelector } from "react-redux";
import EditableText from "../../../../components/EditableText/EditableText";
import fileupload from "../../../../assets/icons/basil_file-upload-outline (2).svg";
import BCut from "../../../../assets/YIcons/BCut.svg";
import interest from "../../../../assets/YIcons/Student Profile - Interests 1interests.svg";
import subject from "../../../../assets/YIcons/Student Profile - Subjects 1subject.svg";
import personality from "../../../../assets/YIcons/Student Profile - Personality 1personality.svg";

import { commonSubjects, Interest, qualities } from "./staticData";
import {
  useAddAssociatedDocStudentMutation,
  useUpdateUserDetailsMutation,
} from "../../../../app/services/users";
const SPFrame1 = ({
  userId,
  settings,
  userDetail,
  fetchDetails,
  editable,
  setToEdit,
  toEdit,
  fetchDetailss,
}) => {
  const [xlsFile, setXlsFile] = useState({});
  const { awsLink } = useSelector((state) => state.user);
  const [addDoc, addDocStatus] = useAddAssociatedDocStudentMutation();
  const [updateDetails, updateDetailsResp] = useUpdateUserDetailsMutation();
  const { role: persona } = useSelector((state) => state.user);
  const reduceArr = (id, update) => {
    //  ////console.log({toEdit})
    let temp = [...toEdit?.whiteBoardLinks?.whiteBoardLinks];
    temp = temp?.filter((item, idd) => idd !== id);

    if (update) {
      handleSubmit(temp, "whiteBoardLinks");
    }
  };
  const reduceArr2 = (id, update) => {
    //  ////console.log({toEdit})
    let temp = [...userDetail?.associatedDocs];
    temp = temp?.filter((item, idd) => idd !== id);

    if (update) {
      handleSubmit(temp, "associatedDocs");
    }
  };
  const addDocHandler = () => {
    if (!xlsFile || !xlsFile.name) {
      return;
    }
    ////console.log("size",xlsFile.size)
    let size = xlsFile.size / 1024;
    size = size / 1024;
    if (size > 1) {
      alert("File is larger than than 1MB");
      return;
    }
    const formData = new FormData();
    formData.append("file", xlsFile);
    formData.append("studentId", userDetail?.userId);
    addDoc(formData).then((res) => {
      console.log("docc", res);
      fetchDetailss()
      if (res?.data) {
        alert(res?.data?.message);
        setXlsFile({});
      }
    });
  };
  const handleSubmit = (e, type) => {
    //e.preventDefault();
    // setLoading(true);
    let reqBody = { [type]: e };
    // delete reqBody["active"];
    //   ////console.log({reqBody,id:userId});
    const userDetailSave = (reqBody) => {
      // ////console.log({reqBody,userDetail});
      // return
      updateDetails({ id: userId, fields: reqBody }).then((res) => {
        // ////console.log(res);
        //setLoading(false);
        fetchDetails(true, true);
        // handleClose()
      });
    };

    userDetailSave(reqBody);
  };

  return (
    <div>
      {" "}
      <div className="flex mt-7 justify-between gap-5 design:mt-10 design:gap-8">
        <div className="flex-1 w-[300px] h-[280px] design:h-[290px] gap-2 flex flex-col design:gap-4">
          <div className="flex-1 mb-1 mt-1.5">
            <p className="mb-2.5 text-[20px] text-[#26435F] leading-[12.5px] font-semibold flex justify-between items-end">
              Whiteboard Links
              {persona !== "student" && persona !== "parent" && (
                <EditableText
                  editable={editable}
                  onClick={() =>
                    setToEdit({
                      ...toEdit,
                      whiteBoardLinks: {
                        ...toEdit.whiteBoardLinks,
                        active: true,
                      },
                    })
                  }
                  text="edit"
                  textClassName="text-sm text-[#517CA8] text-underline leading-[10px] "
                  className="text-sm my-0 flex justify-end   float-right"
                />
              )}
            </p>

            <div
              className="w-full relative custom-scroller !border-[1.25px_dashed_#517CA8] bg-white h-[168px]  flex flex-col rounded-md overflow-y-auto pt-[25px] pb-[10px]"
              id={styles.borderDashed}
            >
              {userDetail?.whiteBoardLinks?.length > 0 ? (
                userDetail?.whiteBoardLinks?.map((it, id) => {
                  return (
                    <p
                      key={id}
                      className="flex text-[#517CA8] w-full text-xs justify-between items-center px-[22.5px] mb-[15px]"
                    >
                      <a
                        href={it}
                        className="w-[90%] font-light !break-words text-[17.7px]"
                        target="_blank"
                      >
                        {it}
                      </a>
                      <img
                        onClick={() =>
                          (persona === "tutor" || persona === "admin") &&
                          reduceArr(id, true)
                        }
                        src={BCut}
                        className="text-xs !h-[20px] !w-[20px] inline-block"
                        alt="cut"
                      />
                    </p>
                  );
                })
              ) : (
                <div className="flex flex-col justify-center items-center h-full">
                  {persona === "admin" ? (
                    <button
                      onClick={() =>
                        setToEdit({
                          ...toEdit,
                          whiteBoardLinks: {
                            ...toEdit.whiteBoardLinks,
                            active: true,
                          },
                        })
                      }
                      className="bg-[#38C980] text-white rounded-md p-2 py-1"
                    >
                      Add a Whiteboard +
                    </button>
                  ) : (
                    <button className="bg-[#FF7979] text-white rounded-md p-2 py-1">
                      No Links Added
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 ">
            <p className="mb-2.5 mt-[30px] text-[20px] text-[#26435F] leading-[12.5px] font-semibold flex justify-between items-end">

              Associated Docs
            </p>
            <div
              id={styles.borderDashed}
              className="w-full relative !border-[1.25px_dashed_#517CA8] h-full  !max-h-[150px] flex rounded-md items-center bg-white "
            >
              <div className=" flex-1 !max-h-[140px] overflow-y-auto custom-scroller ">
                <div className="">
                  {userDetail?.associatedDocs?.length > 0
                    ? userDetail?.associatedDocs?.map((it, id) => {
                      return (
                        <p
                          key={id}
                          className="flex flex-1 mt-1 text-[#517CA8] w-full text-xs justify-between px-3 py-1"
                        >
                          <a
                            className="w-[70%] break-words text-base-15"
                            href={it?.public_url}
                            target="_blank"
                          >
                            {it?.key}
                          </a>
                          <img
                            onClick={() =>
                              (persona === "tutor" || persona === "admin") &&
                              reduceArr2(id, true)
                            }
                            src={BCut}
                            className="text-xs !h-[20px] !w-[20px] inline-block"
                            alt="cut"
                          />
                        </p>
                      );
                    })
                    : (persona === "student" || persona === "parent") && (
                      <div className="flex flex-col justify-center items-center h-full">
                        {(persona === "student" || persona !== "parent") && (
                          <button className="bg-[#FF7979] text-white rounded-md p-2 py-1">
                            No Links Added
                          </button>
                        )}
                      </div>
                    )}
                </div>
                {persona === "student" || persona === "parent" ? (
                  <> </>
                ) : (
                  <>
                    <div className="mt-[20px] mb-[10px] items-center flex justify-center">
                      <img src={fileupload} alt="fileuploadIcon"></img>
                    </div>

                    <div className="flex items-center text-center justify-center text-base-15">
                      {xlsFile == undefined ? (
                        <p className=""></p>
                      ) : (
                        <p className="block ">{xlsFile.name}</p>
                      )}
                    </div>
                    {!xlsFile?.name ? (
                      <div className="flex justify-center">
                        <label
                          htmlFor="file"
                          className="block text-sm text-white bg-[#517CA8] hover:bg-[#517CA8] items-center justify-center  rounded-[5px]  px-3 py-2 text-base-17-5 text-center ] cursor-pointer"
                        >
                          Choose file
                        </label>
                        <input
                          onChange={(e) => setXlsFile(e.target.files[0])}
                          type="file"
                          className="hidden"
                          disabled={
                            persona === "student" || persona === "parent"
                          }
                          id="file"
                        ></input>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <span
                          onClick={addDocHandler}
                          className=" cursor-pointer block text-sm text-white bg-[#517CA8] hover:bg-[#517CA8] items-center justify-center  rounded-[5px]  px-4 py-2 text-center text-base-17-5]"
                        >
                          Submit File
                        </span>
                      </div>
                    )}
                    <label
                      htmlFor="file"
                      className="block text-xs items-center justify-center  rounded-[5px]  px-4 py-2 font-normal text-center text-[#517CA8] text-base-15"
                    >
                      Less than 1 MB
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 h-[300px]  design:h-[305px]">
          <p className="mb-1.5 text-[20px] text-[#26435F]  leading-[12.5px] font-semibold flex items-end justify-between">
            Interests{" "}
            <EditableText
              editable={editable}
              onClick={() =>
                setToEdit({
                  ...toEdit,
                  interest: { ...toEdit.interest, active: true },
                })
              }
              text="edit"
              textClassName="text-sm text-[#517CA8] text-underline  "
              className="text-sm my-0 flex justify-end   float-right"
            />
          </p>

          <div className="w-full relative p-1 flex flex-1 h-[300px] flex-col gap-2  rounded-md items-center overflow-y-auto custom-scroller">
            {/* {settings ? (
              settings.interest.length > 0 &&
              userDetail?.interest.map((id, idx) => {
                return settings.interest.find((item) => item._id === id) ? (
                  <div
                    key={idx}

                    className="bg-white  p-2 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] flex-1 w-full"

                  >
                    <div className="flex h-90 w-90 rounded-full  items-center justify-center mb-3">
                      <img
                        className="max-w-[90px] max-h-[90px]"
                        src={
                          settings.interest.find((item) => item._id === id)
                            ? `${awsLink}${
                                settings.interest.find(
                                  (item) => item._id === id
                                ).image
                              }`
                            : ""
                        }
                      />
                    </div>
                    <p className="opacity-70 font-semibold text-lg">
                      {settings.interest.find((item) => item._id === id) ? (
                        settings.interest.find((item) => item._id === id).text
                      ) : (
                        <></>
                      )}
                    </p>
                  </div>
                ) : (
                  <> </>
                );
              })
            ) : (
              <></>
            )} */}

            {userDetail?.interest?.length > 0 ? (
              userDetail?.interest.map((it, idx) => {
                return (
                  <div
                    key={idx}
                    className="bg-white p-[20px] h-[56px] text-[#517CA8] text-base-17-5 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] w-full flex justify-start items-center"
                  >
                    {/*  icon container */}

                    <div className="mr-[18.75px]">
                      {/* {it === "Soccer" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="26"
                          height="25"
                          viewBox="0 0 26 25"
                          fill="none"
                        >
                          <path
                            d="M21.5049 3.66118C19.1439 1.30024 16.0049 0 12.666 0C9.32714 0 6.18813 1.30024 3.82715 3.66118C1.46621 6.02212 0.166016 9.16113 0.166016 12.5C0.166016 15.8389 1.46621 18.9779 3.82715 21.3389C6.18808 23.6998 9.32714 25 12.666 25C16.0049 25 19.1439 23.6998 21.5049 21.3389C23.8658 18.9779 25.166 15.8389 25.166 12.5C25.166 9.16113 23.8658 6.02212 21.5049 3.66118ZM13.3984 4.2436L16.3511 2.09834C18.5593 2.88306 20.4458 4.3519 21.7547 6.24897L20.6859 9.53833L16.9192 10.7623L13.3984 8.20444V4.2436ZM8.9809 2.09839L11.9336 4.2436V8.20454L8.41333 10.762L4.64634 9.53809L3.57744 6.24878C4.88628 4.35181 6.77275 2.88306 8.9809 2.09839ZM4.14013 19.4982C2.63032 17.6622 1.70073 15.3319 1.63472 12.7904L4.1937 10.9312L7.96045 12.1551L9.30522 16.294L6.97719 19.4982H4.14013ZM16.3429 22.9045C15.1922 23.3124 13.9547 23.5352 12.666 23.5352C11.3773 23.5352 10.1399 23.3124 8.98925 22.9045L8.1622 20.3592L10.4902 17.1551L14.8419 17.1549L17.17 20.3591L16.3429 22.9045ZM21.192 19.4981H18.355L16.0269 16.2939L17.3717 12.1554L21.1386 10.9315L23.6973 12.7906C23.6313 15.332 22.7017 17.6622 21.192 19.4981Z"
                            fill="#517CA8"
                          />
                        </svg>
                      ) : (
                        ""
                      )} */}
                    </div>
                    {it}
                  </div>
                );
              })
            ) : (
              <div
                id="sinterest"
                className="w-full h-full rounded-md bg-white flex justify-center flex-col text-center items-center"
              >
                <div className="flex flex-col justify-center items-center h-full">
                  <button className="bg-[#38C980] text-white rounded-md p-2 py-1">
                    Add Interests +
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 h-[300px]  design:h-[305px]">
          <p className="mb-2.5 text-[20px] text-[#26435F] leading-[12.5px] font-semibold flex justify-between items-end">
            Subjects{" "}
            <EditableText
              editable={editable}
              onClick={() =>
                setToEdit({
                  ...toEdit,
                  subjects: { ...toEdit.subjects, active: true },
                })
              }
              text="edit"
              textClassName="text-sm text-[#517CA8] text-underline  "
              className="text-sm my-0 flex justify-end   float-right"
            />
          </p>

          <div className="w-full relative h-full p-1 flex flex-col gap-2   rounded-md items-center overflow-y-auto custom-scroller">
            {userDetail?.subjects && userDetail?.subjects?.length > 0 ? (
              userDetail?.subjects.map((sub, idx) => {
                return (
                  <p
                    key={idx}
                    className="bg-white text-[#517CA8] text-base-17-5 p-2 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] flex-1 w-full"
                  >
                    {sub}{" "}
                  </p>
                );
              })
            ) : (
              <div
                id="ssubject"
                className="w-full h-full rounded-md bg-white flex justify-center flex-col text-center items-center"
              >
                <div className="flex flex-col justify-center items-center h-full">
                  <button
                    onClick={() =>
                      setToEdit({
                        ...toEdit,
                        subjects: { ...toEdit.subjects, active: true },
                      })
                    }
                    className="bg-[#38C980] text-white rounded-md p-2 py-1"
                  >
                    Add Subjects +
                  </button>
                </div>{" "}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 h-[300px]  design:h-[305px]">
          <p className="mb-2.5 text-[20px] text-[#26435F] leading-[12.5px] font-semibold flex justify-between items-end">
            Personality
            <EditableText
              editable={editable}
              onClick={() =>
                setToEdit({
                  ...toEdit,
                  personality: { ...toEdit.personality, active: true },
                })
              }
              text="edit"
              textClassName="text-sm text-[#517CA8] text-underline  "
              className="text-sm my-0 flex justify-end   float-right"
            />
          </p>

          <div className="w-full relative h-full p-1 flex flex-col gap-2 rounded-md items-center overflow-y-auto custom-scroller">
            {userDetail?.personality?.length > 0 ? (
              userDetail?.personality.map((it, idx) => {
                return (
                  <div
                    key={idx}
                    className="bg-white h-[100px]  text-[#517CA8] text-base-17-5 p-2 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] flex-1 w-full"
                  >
                    {it}
                  </div>
                );
              })
            ) : (
              <div
                id="spersonal"
                className="w-full h-full rounded-md bg-white flex justify-center flex-col text-center items-center"
              >
                <div className="flex flex-col justify-center items-center h-full">
                  <button className="bg-[#38C980] text-white rounded-md p-2 py-1">
                    Add Personality +
                  </button>
                </div>{" "}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SPFrame1;
