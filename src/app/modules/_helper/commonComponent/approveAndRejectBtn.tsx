type ApproveAndRejectBtnProps = {
  billSubmitBtn: boolean;
  approveSubmitlHandler: () => void;
  rejectSubmitlHandler: () => void;
};

function ApproveAndRejectBtn({
  billSubmitBtn,
  approveSubmitlHandler,
  rejectSubmitlHandler,
}: ApproveAndRejectBtnProps) {
  return (
    <>
      <div className="col-lg-3">
        <div className="d-flex justify-content-end ">
          <button
            type="button"
            className="approvalButton btn btn-primary"
            onClick={() => approveSubmitlHandler()}
            disabled={billSubmitBtn}
          >
            Approve
          </button>
          <button
            type="button"
            className="approvalButton btn btn-primary mr-1 ml-3"
            onClick={() => rejectSubmitlHandler()}
            disabled={billSubmitBtn}
          >
            Reject
          </button>
        </div>
      </div>
    </>
  );
}

export default ApproveAndRejectBtn;
