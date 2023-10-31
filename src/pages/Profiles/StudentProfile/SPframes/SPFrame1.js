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
  editable,
  setToEdit,
  toEdit,
  fetchDetails,
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
  console.log("frame1", { userDetail, xlsFile });
  return (
    <div>
      {" "}
      <div className="flex mt-7 justify-between gap-5 design:mt-10 design:gap-8">
        <div className="flex-1 w-[300px] h-[280px] design:h-[290px] gap-2 flex flex-col design:gap-4">
          <div className="flex-1 mb-1 ">
            <p className="mb-1 text-base-20 text-[#26435F] font-semibold text-base-17-5 ">
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
                  textClassName="text-sm text-[#517CA8] text-underline  "
                  className="text-sm my-0 flex justify-end   float-right"
                />
              )}
            </p>

            <div
              className="w-full relative custom-scroller !border-[1.25px_dashed_#517CA8] bg-white h-[110px]  flex flex-col rounded-md items-center overflow-y-auto "
              id={styles.borderDashed}
            >
              {userDetail?.whiteBoardLinks?.length > 0 ? (
                userDetail?.whiteBoardLinks?.map((it, id) => {
                  return (
                    <p
                      key={id}
                      className="flex flex-1 text-[#517CA8] w-full text-xs justify-between px-3 py-1"
                    >
                      <a
                        href={it}
                        className="w-[90%] !break-words text-base-15"
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
            <p className="mb-1 mt-1 text-base-20 text-[#26435F] font-semibold text-base-17-5">
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
                    : null}
                </div>
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
                      disabled={persona === "student" || persona === "parent"}
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
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1 h-[300px]  design:h-[305px]">
          <p className="mb-1 text-base-20 text-[#26435F] font-semibold text-base-17-5">
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

          <div className="w-full relative h-full p-1 flex flex-col gap-2  rounded-md items-center overflow-y-auto custom-scroller">
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
                    className="bg-white p-2 h-min  text-[#517CA8] text-base-17-5 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040]  w-full"
                  >
                    {it}
                  </div>
                );
              })
            ) : (
              <div id="sinterest" className="w-full h-full rounded-md bg-white flex justify-center flex-col text-center items-center">
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
          <p className=" mb-1 text-base-20 text-[#26435F] font-semibold text-base-17-5">
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
              <div id="ssubject" className="w-full h-full rounded-md bg-white flex justify-center flex-col text-center items-center">
                <div className="flex flex-col justify-center items-center h-full">
                  <button className="bg-[#38C980] text-white rounded-md p-2 py-1">
                    Add Subjects +
                  </button>
                </div>{" "}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 h-[300px]  design:h-[305px]">
          <p className="mb-1 text-base-20 text-[#26435F] font-semibold text-base-17-5">
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
              <div id="spersonal" className="w-full h-full rounded-md bg-white flex justify-center flex-col text-center items-center">
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
