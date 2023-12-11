// created a new one because the old Modal code is too messed up to work with.
import CrossIcon from "../../assets/icons/Groupcancel bt.svg";

function Modal2({
    className,
    headerClassName,
    underlineClassName,
    title,
    titleClassName,
    crossIconClassName,
    OnCrossIconClicked,
    children,
    contentClassName,
}) {
    return (
        <div className={`bg-[#fff] rounded ${className}`} >
            <div className={`flex items-center justify-between ${headerClassName}`} >
                <div className={`text-[#26435F] ${titleClassName}`} >{title}</div>
                <button
                    onClick={() => {
                        if(OnCrossIconClicked.constructor && OnCrossIconClicked.constructor.name === "Function") {
                            OnCrossIconClicked();
                        }
                    }}
                >
                    <img
                        src={CrossIcon}
                        className={`${crossIconClassName}`}
                    />
                </button>
            </div>
            <div className={`border-[#00000033] border-t-[1px] w-full ${underlineClassName}`} ></div>
            <div className={`${contentClassName}`} >
                {children}
            </div>
        </div>
    )
}

export default Modal2;