function SubscriptionAndExtensionModal({
    className
}) {
    return (
        <div className={`aspect-[1400/900] bg-[#FFFFFF] flex rounded-[15px] w-[1000px] ${className}`} >
            <div className="w-1/12" ></div>

            <div className={`ml-[90px] w-9/12`} >
                <div className="flex justify-between mt-[20px] w-full" >
                    <button className="text-[#B3BDC7]" >
                        <span className="font-[500]" >{"< back to "}</span><span className="font-[700]" >Subscription</span>
                    </button>

                    <button className="text-[#B3BDC7]" >
                        <span className="font-[700]" >Skip</span><span className="font-[500]" >{" this step >"}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default SubscriptionAndExtensionModal;