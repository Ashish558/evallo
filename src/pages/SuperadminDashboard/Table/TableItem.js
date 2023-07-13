import React from "react";

export default function TableItem({ item, onClick, AdminLatestSignUp }) {
  //console.log(item, AdminLatestSignUp);
  return AdminLatestSignUp ? (
    <LatestSignUpTableItem item={item} onClick={onClick} />
  ) : (
    <DefaultItem item={item} onClick={onClick} />
  );
}

const LatestSignUpTableItem = ({ item, onClick }) => {
  return (
    <tr className="shadow-sm shadow-slate-200 rounded-2xl leading-8 ">
      <td className="  text-sm px-1  min-w-14 py-3 text-left">
        <span
          className="inline-block cursor-pointer pl-4 "
          onClick={() => onClick.redirect(item)}
        >
          {item.firstName + " " + item.lastName}
        </span>
      </td>
      <td className=" text-sm px-1 min-w-14 py-3 ">
        <div className="">{item.role}</div>
      </td>
      <td className=" text-sm px-1  min-w-14 py-3">
        <div className="">{item.email}</div>
      </td>
      <td className=" text-sm px-1  min-w-14 py-3">
        <div className="">{item.phone}</div>
      </td>
      <td className=" text-sm px-1  min-w-14 py-3">
        <div className="">
          {item.assiginedTutors?.length>0  ? item.assiginedTutors : "NA"}
        </div>
      </td>
      <td className=" text-sm px-1  min-w-14 py-3">
        <div className="">{item.credits}</div>
      </td>
      <td className=" text-sm px-1  min-w-14 py-3">
        <div className="">{item.userStatus}</div>
      </td>
      <td className=" text-sm px-1  min-w-14 py-3">
        <div className="">
          {item?.specialization?.length>0 ? item.specialization : "NA"}
        </div>
      </td>
      <td className=" text-sm px-1  min-w-14 py-3">
        <div className="">{new Date(item.createdAt).toDateString()}</div>
      </td>
    </tr>
  );
};
const DefaultItem = ({ item, onClick }) => {
  return (
    <tr className="shadow-sm shadow-slate-200 rounded-2xl leading-8 ">
      <td className="  text-sm px-1  min-w-14 py-3 text-left">
        <span
          className="inline-block cursor-pointer pl-4 "
          onClick={() => onClick.redirect(item)}
        >
          {item.name}
        </span>
      </td>
      <td className=" text-sm px-1 min-w-14 py-3 ">
        <div className="">{item.admin}</div>
      </td>
      <td className=" text-sm px-1  min-w-14 py-3">
        <div className="">{item.status}</div>
      </td>
      <td className=" text-sm px-1  min-w-14 py-3">
        <div className="">{item.type}</div>
      </td>
      <td className=" text-sm px-1  min-w-14 py-3">
        <div className="">{item.date}</div>
      </td>
    </tr>
  );
};
