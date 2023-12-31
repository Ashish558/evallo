import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useGetActionLogRangeMutation } from "../../../app/services/superAdmin";
import { getFormattedDate } from "../../../utils/utils";
import styles from "./styles.module.css";
function ActionLog({ dateRange }) {
	const [actionLogData, fetchStatus] = useGetActionLogRangeMutation();
	const { role: persona } = useSelector((state) => state.user);
	const [currentElementIndex, setCurrentElementIndex] = useState(0);
	const [extraElement, setExtraElement] = useState(0);
	const [sortedAction, setSortedAction] = useState([]);
	const [actionLog, setActionLog] = useState([]);
	const ref = useRef();
	const [dateFormat, setDateFormat] = useState("dd/mm/yy");

	const { organization: organization2 } = useSelector(
		(state) => state.organization
	);

	useEffect(() => {
		if (organization2 && organization2?.settings) {
			setDateFormat(organization2?.settings?.dateFormat);
		}
	}, [organization2]);

	console.log("latest", { dateFormat, organization2 });

	const handleScroll = (e) => {
		const elementHeight = e.target.scrollHeight / actionLog?.length;

		const index = Math.floor(e.target.scrollTop / elementHeight);

		let headerDate =
			sortedAction?.length > 0 && sortedAction[index]
				? new Date(sortedAction[index]?.createdAt).toDateString()
				: new Date().toDateString();
		if (headerDate) {
			headerDate = headerDate.split(" ");
			let temp = headerDate[1] + " " + headerDate[2] + ", " + headerDate[3];
			headerDate = temp;
		}
		ref.current.textContent = headerDate;
	};

	// useEffect(() => {
	// 	if (persona === "manager" || !actionLog || !Array.isArray(actionLog))
	// 		return;
	// 	setCurrentElementIndex(0);
	// 	const sorting = (newarr, extra) => {
	// 		let sortedData = [...actionLog];
	// 		sortedData.sort((a, b) => {
	// 			return a.createdAt - b.createdAt;
	// 		});
	// 		let i = 0,
	// 			j = 0;
	// 		let check = 0;

	// 		while (j < sortedData.length && check <= 2 * sortedData.length) {
	// 			check++;
	// 			if (
	// 				new Date(sortedData[i].createdAt).toDateString() ===
	// 				new Date(sortedData[j].createdAt).toDateString()
	// 			) {
	// 				j++;
	// 			} else {
	// 				extra++;
	// 				let k = j - 1;
	// 				sortedData[k] = {
	// 					...sortedData[k],
	// 					topDate: new Date(sortedData[k]?.createdAt).toDateString(),
	// 				};
	// 				while (k >= i) newarr.push(sortedData[k--]);
	// 				i = j;
	// 			}
	// 		}
	// 		let k = j - 1;
	// 		sortedData[k] = {
	// 			...sortedData[k],
	// 			topDate: new Date(sortedData[k]?.createdAt).toDateString(),
	// 		};
	// 		while (k >= i) newarr.push(sortedData[k--]);
	// 		i = j;
	// 		return extra;
	// 	};
	// 	let newarr = [];
	// 	let extra = 1;
	// 	extra = sorting(newarr, extra);
	// 	setExtraElement(extra);
	// 	setSortedAction(newarr);
	// }, [actionLog]);

	useEffect(() => {
		if (persona === "manager" || !actionLog || !Array.isArray(actionLog))
  return;

setCurrentElementIndex(0);
const sorting = (newarr, extra) => {
  let sortedData = [...actionLog];
  sortedData.sort((a, b) => {
    if (new Date(a.createdAt) < new Date(b.createdAt)) return 1;
    if (new Date(a.createdAt) > new Date(b.createdAt)) return -1;
    return 0;
  });

  let i = 0;
  let j = 0;
  let check = 0;

  while (j < sortedData.length && check <= 2 * sortedData.length) {
    check++;
    if (
      new Date(sortedData[i].createdAt).toDateString() ===
      new Date(sortedData[j].createdAt).toDateString()
    ) {
      j++;
    } else {
      extra++;
      let k = j - 1;
      sortedData[k] = {
        ...sortedData[k],
        topDate: new Date(sortedData[k]?.createdAt).toDateString(),
      };
      // Sorting time in reverse order within each date group
      const dateGroup = sortedData.slice(i, j);
      dateGroup.sort((a, b) => {
        if (new Date(a.createdAt) < new Date(b.createdAt)) return 1;
        if (new Date(a.createdAt) > new Date(b.createdAt)) return -1;
        return 0;
      });
      newarr.push(...dateGroup);

      i = j;
    }
  }

  let k = j - 1;
  sortedData[k] = {
    ...sortedData[k],
    topDate: new Date(sortedData[k]?.createdAt).toDateString(),
  };
  const dateGroup = sortedData.slice(i, j);
  dateGroup.sort((a, b) => {
    if (new Date(a.createdAt) < new Date(b.createdAt)) return 1;
    if (new Date(a.createdAt) > new Date(b.createdAt)) return -1;
    return 0;
  });
  newarr.push(...dateGroup);

  i = j;
  return extra;
};

let newarr = [];
let extra = 1;
extra = sorting(newarr, extra);
setExtraElement(extra);
setSortedAction(newarr);

	}, [actionLog]);

	useEffect(() => {
		if (dateRange === "" || !dateRange || persona === "manager") return;
		const fetchActivity = () => {
			actionLogData(dateRange).then((res) => {
				console.log("actionlog", { dateRange }, { res: res?.data });
				setActionLog(res?.data?.actions);
			});
		};
		fetchActivity();
	}, [dateRange]);

	let headerDate = sortedAction[currentElementIndex]
		? new Date(sortedAction[currentElementIndex]?.createdAt).toDateString()
		: new Date().toDateString();

	if (headerDate) {
		headerDate = headerDate.split(" ");
		let temp = headerDate[1] + " " + headerDate[2] + ", " + headerDate[3];
		headerDate = temp;
	}

	return (
		<div className="flex-1">
			<h2 className="font-semibold mb-1 text-[#26435F] text-[21.33px]">
				Action Log
			</h2>

			<div className="flex flex-col rounded-[5.33px] border-[1.333px] border-[#FFF]  bg-[#FFF] shadow-[0px_0px_2px_rgba(0,0,0,0.25)]">
				<div className="border-b-[1.333px]  border-b-[#CBD6E2]">
					<p
						ref={ref}
						className="uppercase  pl-[29px] pt-[16px] pb-3 text-[#26435F]"
					>
						{getFormattedDate(headerDate, dateFormat)}
					</p>
				</div>
				<ul
					onScroll={handleScroll}
					className="list-disc max-h-[397px] overflow-y-scroll !scroll-my-4  custom-scroller rounded-b-md "
				>
					{sortedAction?.map((item, index) => (
						<div key={index} className="flex ml-2 h-[57px] pl-5 relative">
							<p className="text-[#4A556C] pt-6 font-light text-base mr-6 w-[80px]">
								{item?.message &&
									item.createdAt &&
									new Date(item.createdAt)
										.toLocaleTimeString([], {
											hour: "2-digit",
											minute: "2-digit",
											hour12: true,
										})
										.toLowerCase()}

								{item.topDate && item?.message && (
									<span className="text-xs ml-5 top-0 text-[#FFA28D] absolute backdrop-blur-sm ">
										{" "}
										{/* {getFormattedDate(item?.topDate, dateFormat)} */}
									</span>
								)}
							</p>
							<div className={`pt-5 ${styles.actionBorder}`}>
								<div className={styles.circle}>
									<div className={styles.circle2}></div>
								</div>
								<p className="pl-4 text-18.66 font-light text-[#4A556C]">
									{item.message}
								</p>
							</div>
						</div>
					))}
					{persona === "manager" && (
						<div className="flex-1 h-full h-[390.33px] text-base-25 flex justify-center items-center font-medium text-[#4A556C]">
							Only Super Admin Can View This.
						</div>
					)}
				</ul>
			</div>
		</div>
	);
}

export default React.memo(ActionLog);
