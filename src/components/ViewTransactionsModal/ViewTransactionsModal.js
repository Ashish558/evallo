import Modal2 from "../Modal2/Modal2";

function ViewTransactionsModal({
    className,
    OnCrossIconClicked,
}) {
    return (
        <Modal2
            title="View Transactions"
            className={`${className}`}
            OnCrossIconClicked={() => {
                if(OnCrossIconClicked.constructor && OnCrossIconClicked.constructor.name === "Function") {
                    OnCrossIconClicked();
                }
            }}
        >

        </Modal2>
    )
}

export default ViewTransactionsModal;