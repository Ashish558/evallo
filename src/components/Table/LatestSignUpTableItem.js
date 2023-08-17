

const LatestSignUpTableItem = ({ item, onClick }) => {
    const handleClick = () => {
        onClick.redirect(item);
      };
    return (
      <tr className=" leading-8 ">
        <td className="  text-sm px-1  min-w-14 py-3 text-left">
          <span
            className="inline-block cursor-pointer pl-4 "
            onClick={handleClick}
          >
            {item.firstName + " " + item.lastName}
          </span>
        </td>
        <td className=" text-sm px-1 min-w-14 py-3 ">
          <div >{item.role}</div>
        </td>
        <td className=" text-sm px-1  min-w-14 py-3">
          <div >{item.email}</div>
        </td>
        <td className=" text-sm px-1  min-w-14 py-3">
          <div >{item.phone}</div>
        </td>
        <td className=" text-sm px-1  min-w-14 py-3">
          <div >
            {item.assiginedTutors?.length>0  ? item.assiginedTutors : "NA"}
          </div>
        </td>
        <td className=" text-sm px-1  min-w-14 py-3">
          <div >{item.credits}</div>
        </td>
        <td className=" text-sm px-1  min-w-14 py-3">
          <div >{item.userStatus}</div>
        </td>
        <td className=" text-sm px-1  min-w-14 py-3">
          <div >
            {item?.specialization?.length>0 ? item.specialization : "NA"}
          </div>
        </td>
        <td className=" text-sm px-1  min-w-14 py-3">
          <div >{new Date(item.lastSignUp).toDateString()}</div>
        </td>
      </tr>
    );
  };

  export default LatestSignUpTableItem