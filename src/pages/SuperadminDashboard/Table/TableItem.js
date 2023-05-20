import React from 'react'

export default function TableItem({ item, onClick }) {


    return (
        <tr className="shadow-sm shadow-slate-200 rounded-2xl leading-8">
            <td className="font-semibold text-sm px-1  min-w-14 py-4 text-left">
                <span
                    className="inline-block cursor-pointer pl-4"
                    onClick={() => onClick.redirect(item)}
                >
                    {item.name}
                </span>
            </td>
            <td className="font-medium text-sm px-1 min-w-14 py-4">
                <div className="my-[6px]">
                    {item.admin}
                </div>
            </td>
            <td className="font-medium text-sm px-1  min-w-14 py-4">
                <div className="my-[6px]">
                    {item.status}
                </div>
            </td>
            <td className="font-medium text-sm px-1  min-w-14 py-4">
                <div className="my-[6px]">
                    {item.type}
                </div>
            </td>
            <td className="font-medium text-sm px-1  min-w-14 py-4">
                <div className="my-[6px]">
                    {item.date}
                </div>
            </td>

        </tr>
    )
}
