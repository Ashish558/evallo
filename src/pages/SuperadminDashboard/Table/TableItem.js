import React from "react";
import LatestSignUpTableItem from "./LatestSignUpTableItem";

export default function TableItem({ item, onClick, AdminLatestSignUp }) {
  const handleClick = () => {
    onClick.redirect(item);
  };
  return AdminLatestSignUp ? (
    <LatestSignUpTableItem item={item} onClick={onClick} />
  ) : (
    <tr className=" shadow-sm shadow-slate-200 rounded-lg border border-gray-400 leading-8 ">
      <td className="  text-sm px-1  min-w-14 py-3 text-left">
        <span
          className="inline-block cursor-pointer pl-4 "
          onClick={handleClick}
        >
          {item.name}
        </span>
      </td>
      <td className=" text-sm px-1 min-w-14 py-3 ">
        <div>{item.admin}</div>
      </td>
      <td className=" text-sm px-1  min-w-14 py-3">
        <div>{item.status}</div>
      </td>
      <td className=" text-sm px-1  min-w-14 py-3">
        <div>{item.type}</div>
      </td>
      <td className=" text-sm px-1  min-w-14 py-3">
        <div>{new Date(item.date).toDateString().split(' ')[1] }. {new Date(item.date).getDate() }, {new Date(item.date).getFullYear()}</div>
      </td>
    </tr>
  );
}
