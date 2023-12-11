import { useEffect, useState } from "react";
import { useLazyPastTransactionsQuery } from "../../app/services/subscription";
import Modal2 from "../Modal2/Modal2";
import Table from "../Table/Table";
import { useSelector } from "react-redux";
import { CurrencyNameToSymbole, getFormattedDate } from "../../utils/utils";
import DownloadIcon from "../../assets/icons/download2.svg";

function ViewTransactionsModal({
    className,
    OnCrossIconClicked,
}) {
    const [transactionDetails, SetTransactionDetails] = useState([]);
    const [getPastTransaction, getPastTransactionResp] = useLazyPastTransactionsQuery();
    const { dateFormat } = useSelector((state) => state.user);
    useEffect(() => {
        getPastTransaction()
        .then(data => {
            console.log("getPastTransactionResp response");
            console.log(data);
            if(data?.data?.invoices) {
                SetTransactionDetails(data.data.invoices);
            }
        })
    }, []);
    return (
        <Modal2
            title="View Transactions"
            className={`${className}`}
            titleClassName="font-[600] text-[21.33px]"
            headerClassName="pb-[20px] pt-[30px] pl-[30px] pr-[33.33px]"
            OnCrossIconClicked={() => {
                if(OnCrossIconClicked.constructor && OnCrossIconClicked.constructor.name === "Function") {
                    OnCrossIconClicked();
                }
            }}
        >
            <div className="flex justify-center h-full w-full" >
                <div className="overflow-y-scroll h-[245px] w-[1050px]" >
                <table className="mt-[30px]  w-[1050px]" >
                    <tr className="bg-[#26435F] mb-[8px] rounded-[5px] h-[62px] w-full" >
                        <th className="font-[500] text-[#fff] text-[20px]" >Invoice ID</th>
                        <th className="font-[500] text-[#fff] text-[20px]" >Date</th>
                        <th className="font-[500] text-[#fff] text-[20px]" >Subscription</th>
                        <th className="font-[500] text-[#fff] text-[20px]" >Extensions</th>
                        <th className="font-[500] text-[#fff] text-[20px]" >Discount</th>
                        <th className="font-[500] text-[#fff] text-[20px]" >Tax</th>
                        <th className="font-[500] text-[#fff] text-[#FFA28D] text-[20px]" >Total</th>
                        <th className="font-[500] text-[#fff] text-[20px]" >Download</th>
                    </tr>
                    {
                        transactionDetails?.map((item , index) => {
                            const invoiceId = item?.id;
                            const date = item?.effective_at;
                            const currency = item?.currency;
                            const currencySymbol = CurrencyNameToSymbole(currency);
                            const subscriptionPrice = item?.amount_paid;
                            const extensionPrice = 0;
                            const discountPrice = 0;
                            const tax = "-"
                            const total = subscriptionPrice + extensionPrice - discountPrice;
                            return (
                                <tr className="mt-[5px] rounded-[5px] shadow-[0px_0px_2px_rgba(0,0,0,0.25)] h-[40px]" >
                                    <td className="text-center" >{invoiceId}</td>
                                    <td className="text-center" >{getFormattedDate(date, dateFormat)}</td>
                                    <td className="text-center" >{currencySymbol + subscriptionPrice}</td>
                                    <td className="text-center" >{currencySymbol + extensionPrice}</td>
                                    <td className="text-center" >{currencySymbol + discountPrice}</td>
                                    <td className="text-center" >{tax}</td>
                                    <td className="text-center" >{total}</td>
                                    <td className="text-center" >
                                        <img
                                            src={DownloadIcon}
                                        />
                                    </td>
                                </tr>
                            )
                        })
                    }
                </table>
                </div>
            </div>
        </Modal2>
    )
}

export default ViewTransactionsModal;