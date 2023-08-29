import React from "react";
import styles from "../style.module.css";
import { useSelector } from "react-redux";
import EditableText from "../../../../components/EditableText/EditableText";

const SPFrame1 = ({ settings, userDetail,editable, setToEdit, toEdit, }) => {
  const { awsLink } = useSelector((state) => state.user);
  return (
    <div>
      {" "}
      <div className="flex mt-7 justify-between gap-5">
        <div className="flex-1 h-[230px] gap-7 flex flex-col">
          <div className="flex-1 ">
            <p className=" text-sm text-[#26435F] font-semibold">
              Whiteboard Links
              <EditableText
                    editable={editable}
                    onClick={() =>
                      setToEdit({
                        ...toEdit,
                        subscriptionCode: {
                          ...toEdit.subscriptionCode,
                          active: true,
                        },
                      })
                    }
                    text="edit"
                    textClassName="text-sm text-[#517CA8] text-underline  "
                    className="text-sm my-0 flex justify-end   float-right"
                  />
            </p>

            <div
              className="w-full relative !border-[1.25px_dashed_#517CA8] h-full flex rounded-md items-center overflow-hidden shadow-[0px_0px_2.500001907348633px_0px_#00000040]"
              id={styles.borderDashed}
            ></div>
          </div>
          <div className="flex-1 ">
            <p className=" text-sm text-[#26435F] font-semibold">
              Associated docs
             
            </p>

            <div
              className="w-full relative !border-[1.25px_dashed_#517CA8] h-full flex rounded-md items-center overflow-hidden shadow-[0px_0px_2.500001907348633px_0px_#00000040]"
              id={styles.borderDashed}
            ></div>
          </div>
        </div>
        <div className="flex-1 h-[230px]">
          <p className=" text-sm text-[#26435F] font-semibold">Interests   <EditableText
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
                  /></p>

          <div className="w-full relative h-full p-1 flex flex-col gap-1  rounded-md items-center overflow-y-auto custom-scroller">
            {settings ?
              settings.interest.length > 0 &&
              userDetail.interest.map((id, idx) => {
                return settings.interest.find((item) => item._id === id) ? (
                  <div
                    key={idx}
                    className="bg-white h-[100px] p-2 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] flex-1 w-full"
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
                  <>
                    {" "}
                   
                  </>
                );
              }):<></>}
               {
              !settings?.interest?.length > 0 &&[1, 2, 3, 4, 5].map((it) => {
                return (
                  <div className="bg-white h-[100px] p-2 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] flex-1 w-full">
                    {it}
                  </div>
                );
              })}
          </div>
        </div>

        <div className="flex-1 h-[230px]">
          <p className=" text-sm text-[#26435F] font-semibold">Subjects    <EditableText
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
                  /></p>

          <div className="w-full relative h-full p-1 flex flex-col gap-1  rounded-md items-center overflow-y-auto custom-scroller">
            {userDetail?.subjects
              ? userDetail.subjects.map((sub, idx) => {
                  return (
                    <p
                      key={idx}
                      className="bg-white h-[100px] p-2 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] flex-1 w-full"
                    >
                      {sub}{" "}
                    </p>
                  );
                })
              : [1, 2, 3, 4, 5]?.map((it) => {
                  return (
                    <div className="bg-white h-[100px] p-2 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] flex-1 w-full">
                      {it}
                    </div>
                  );
                })}
          </div>
        </div>
        <div className="flex-1 h-[230px]">
          <p className=" text-sm text-[#26435F] font-semibold">Personality    
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
                  /></p>

          <div className="w-full relative h-full p-1 flex flex-col gap-1  rounded-md items-center overflow-y-auto custom-scroller">
            {settings &&
              settings.personality &&
              settings.personality.length > 0 &&
              userDetail.personality &&
              userDetail.personality.map((id, idx) => {
                return settings.personality.find((item) => item._id === id) ? (
                  <div
                    key={idx}
                    className="bg-white h-[100px] p-2 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] flex-1 w-full"
                  >
                    <div className="flex h-90 w-90 rounded-full  items-center justify-center mb-3">
                      <img
                        className="max-w-[90px] max-h-[90px]"
                        src={
                          settings.personality.find((item) => item._id === id)
                            ? `${awsLink}${
                                settings.personality.find(
                                  (item) => item._id === id
                                )?.image
                              }`
                            : ""
                        }
                      />
                    </div>
                    <p className="opacity-70 font-semibold text-lg">
                      {settings.personality.find((item) => item._id === id) ? (
                        settings.personality.find((item) => item._id === id)
                          .text
                      ) : (
                        <></>
                      )}
                    </p>
                  </div>
                ) : (
                  <>
                  
                  </>
                );
              })}
               {
              !settings?.personality?.length > 0&&[1, 2, 3, 4, 5].map((it) => {
                return (
                  <div className="bg-white h-[100px] p-2 !rounded-md shadow-[0px_0px_2.500001907348633px_0px_#00000040] flex-1 w-full">
                    {it}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SPFrame1;
