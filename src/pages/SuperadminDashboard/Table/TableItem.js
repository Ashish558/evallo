import React from 'react'

export default function TableItem({ item, onClick }) {


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
                <div className="">
                    {item.admin}
                </div>
            </td>
            <td className=" text-sm px-1  min-w-14 py-3">
                <div className="">
                    {item.status}
                </div>
            </td>
            <td className=" text-sm px-1  min-w-14 py-3">
                <div className="">
                    {item.type}
                </div>
            </td>
            <td className=" text-sm px-1  min-w-14 py-3">
                <div className="">
                    {item.date}
                </div>
            </td>

        </tr>
    )
}
