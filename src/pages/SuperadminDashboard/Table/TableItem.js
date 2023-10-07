import React from "react";
import LatestSignUpTableItem from "./LatestSignUpTableItem";
import { useSelector } from "react-redux";
import { getFormattedDate } from "../../../utils/utils";

export default function TableItem({ item, onClick, AdminLatestSignUp }) {
  const { dateFormat } = useSelector(state => state.user)
  const handleClick = () => {
    onClick.redirect(item);
  };
  return AdminLatestSignUp ? (
    <LatestSignUpTableItem item={item} onClick={onClick} />
  ) : (
    <tr className="my-5 box-content  shadow-[0px_0px_1.33333px_0px_rgba(0,0,0,0.25)]">
     
      <td className="  text-sm px-1  min-w-14 py-3 text-left">
        <span
          className="inline-block cursor-pointer pl-4 "
          onClick={handleClick}
        >
          {item.name}
        </span>
      </td>
      <td className=" text-sm px-1 min-w-14 py-3 text-left">
        <div>{item.admin}</div>
      </td>
      <td className=" text-sm pr-2  min-w-14 py-3 pl-1">
        <div>{item.status}</div>
      </td>
      <td className=" text-sm   min-w-14 py-3 pr-3 pl-1">
        <div>{item.type}</div>
      </td>
      <td className=" text-sm   min-w-14 py-3 pr-3 pl-1">
        <div>
          {/* {new Date(item.date).toDateString().split(' ')[1] }. {new Date(item.date).getDate() }, {new Date(item.date).getFullYear()} */}
          {getFormattedDate(item.date, dateFormat)}
        </div>
      </td>
    </tr>
  );
}
