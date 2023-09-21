import React from "react";

const FramesScreen = ({ data }) => {
  return (
    <>
      {data.map((data, id) => (
        <tr
          key={id}
          className={`my-[10px] ${
            id % 2 ? "bg-white" : "bg-[#F5F8FA]"
          }`}
        >
          <td className="whitespace-nowrap px-6 py-4">{data.orgName}</td>
          <td className="whitespace-nowrap px-6 py-4">{data.type}</td>
          <td className="whitespace-nowrap px-6 py-4">{data.address}</td>
          <td className="whitespace-nowrap px-6 py-4">{data.city}</td>
          <td className="whitespace-nowrap px-6 py-4">{data.state}</td>
          <td className="whitespace-nowrap px-6 py-4">{data.country}</td>
          <td className="whitespace-nowrap px-6 py-4">{data.adminName}</td>
          <td className="whitespace-nowrap px-6 py-4">{data.adminEmail}</td>
          <td className="whitespace-nowrap px-6 py-4">{data.AdminPhone}</td>
          <td className="whitespace-nowrap px-6 py-4">{data.status}</td>
          <td className="whitespace-nowrap px-6 py-4">{data.tutors}</td>
          <td className="whitespace-nowrap px-6 py-4">{data.students}</td>
          <td className="whitespace-nowrap px-6 py-4">{data.contributors}</td>
        </tr>
      ))}
    </>
  );
};

export default FramesScreen;
