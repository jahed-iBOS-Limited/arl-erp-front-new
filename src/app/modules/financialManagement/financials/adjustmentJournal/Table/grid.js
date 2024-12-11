import React, { useCallback, useState } from "react";
import IView from "../../../../_helper/_helperIcons/_view";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { withRouter } from "react-router-dom";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import IDelete from "./../../../../_helper/_helperIcons/_delete";
import IApproval from "./../../../../_helper/_helperIcons/_approval";
import Loading from "./../../../../_helper/_loading";
// import PaginationTable from "./../../../../_helper/_tablePagination";
import { toast } from "react-toastify";
import IViewModal from "../../../../_helper/_viewModal";
import { AdjustmentJournalViewTableRow } from "../report/tableRow";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { checkTwoFactorApproval } from "../../bankJournal/helper";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { dynamicSerial } from "../../utils";
import IHistory from "../../../../_helper/_helperIcons/_history";
import HistoryModal from "../adjustmentJournalHistory";
import findIndex from "../../../../_helper/_findIndex";
import { shallowEqual, useSelector } from "react-redux";

const GridData = ({
  history,
  rowDto,
  allGridCheck,
  itemSlectedHandler,
  remover,
  type,
  singleApprovalndler,
  completeDate,
  loading,
  paginationState,
  gridDataLoad,
  values,
  selectedBusinessUnit,
  profileData,
  setRowDto,
  pageNo,
  pageSize,
}) => {

  let {  userRole } = useSelector(
    (state) => state?.authData,
    { shallowEqual }
  );
  const [currentItem, setCurrentItem] = useState("");
  const [historyItem, setHistoryItem] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const [isHistoryModal, setIsHistoryModal] = useState(false);
  const [disabledModalButton, setDisabledModalButton] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const totalAmount = useCallback(
    rowDto.reduce((acc, item) => acc + +item.amount, 0)
  );
  const [reverseModalShowState, setReverseModalShowState] = useState({
    isShow: false,
    data: null,
  });
  const handleClose = () => {
    setReverseModalShowState({
      isShow: false,
      data: null,
    });
  };

  const userPermission = userRole[findIndex(userRole, "Adjustment Journal")];

  const canCreate = userPermission?.isCreate;

  return (
    <>
      <p className="p-0 m-0 d-flex justify-content-end">
        <b>Total: </b>
        {rowDto
          ?.filter((itm) => itm?.itemCheck)
          .reduce((acc, cur) => acc + +cur?.amount, 0)
          .toFixed(2)}
      </p>
      {/* Table Start */}
      <div className="row cash_journal">
        <div className="col-lg-12">
        <div className="table-responsive">
        <table className="table table-striped table-bordered mt-0 bj-table bj-table-landing table-font-size-sm">
            <thead>
              <tr>
                {type === "notComplated" ? (
                  <th style={{ width: "23px" }}>
                    <input
                      type="checkbox"
                      id="parent"
                      onChange={(event) => {
                        allGridCheck(event.target.checked);
                      }}
                    />
                  </th>
                ) : null}
                <th style={{ minWidth: "30px" }} className="positionSticky">SL</th>
                <th style={{ width: "100px" }}>Transaction Date</th>
                <th style={{ width: "120px" }}>Journal Code</th>
                <th style={{ width: "100px" }}>Complete Date</th>
                <th style={{ width: "120px" }}>Amount</th>
                <th>Header Narration</th>
                <th style={{ width: "125px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && <Loading />}
              {rowDto?.map((item, index) => (
                <tr key={index}>
                  {type === "notComplated" ? (
                    <td>
                      <input
                        id="itemCheck"
                        type="checkbox"
                        className=""
                        value={item.itemCheck}
                        checked={item.itemCheck}
                        name={item.itemCheck}
                        onChange={(e) => {
                          //setFieldValue("itemCheck", e.target.checked);
                          itemSlectedHandler(e.target.checked, index);
                        }}
                      />
                    </td>
                  ) : null}

                  <td className="text-center positionSticky">
                    {" "}
                    {dynamicSerial(pageNo, pageSize, index)}
                  </td>
                  <td>
                    <div className="pl-2">
                      {_dateFormatter(item?.journaldate)}
                    </div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.code}</div>
                  </td>
                  <td>
                    <div className="pl-2 text-center">
                      {type === "notComplated"
                        ? "N/A"
                        : _dateFormatter(item?.completeDate)}
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="pr-2">{_formatMoney(item?.amount)}</div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.narration}</div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center">
                      <span className="view ml-2">
                        <IHistory
                          clickHandler={() => {
                            setHistoryItem(item);
                            setIsHistoryModal(true);
                          }}
                        />
                      </span>
                      <span className="view ml-2">
                        <IView
                          clickHandler={() => {
                            setCurrentItem(item);
                            setIsShowModal(true);
                          }}
                        />
                      </span>
                      {type === "notComplated" ? (
                        <>
                          {canCreate && (<span
                            className="edit ml-2"
                            onClick={() => {
                              history.push(
                                `${window.location.pathname}/edit/${item.journlaId}`
                              );
                            }}
                          >
                            <IEdit />
                          </span>)}
                          {(canCreate && item?.isApproved && item?.isManual) && (<span
                            className="approval ml-2"
                            onClick={() => {
                              if (
                                completeDate < _dateFormatter(item?.journaldate)
                              )
                                return toast.warn(
                                  "Complete date should be greater than or equal to journal date"
                                );
                              singleApprovalndler(index, completeDate);
                            }}
                          >
                            <IApproval />
                          </span>)}
                          {canCreate && (<span
                            className="delete ml-2"
                            onClick={() => remover(index)}
                          >
                            <IDelete />
                          </span>)}
                        </>
                      ) : null}
                      {type === "complated" && (
                        <OverlayTrigger
                          overlay={<Tooltip id="cs-icon">{"Reverse"}</Tooltip>}
                        >
                          <span
                            className={`iconActive ml-2`}
                            onClick={() => {
                              setReverseModalShowState({
                                isShow: true,
                                data: item,
                                index,
                                otp: "",
                              });
                            }}
                          >
                            <i
                              className={`fa pointer fa fa-history`}
                              aria-hidden="true"
                            ></i>
                          </span>
                        </OverlayTrigger>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {rowDto.length > 0 && (
                <tr>
                  {type === "notComplated" && <td></td>}
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>
                    <b className="pl-2">Total</b>
                  </td>
                  <td className="text-right">
                    <div className="pr-2">{(totalAmount || 0).toFixed(2)}</div>
                  </td>
                  <td></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
      </div>
          <IViewModal show={isShowModal} onHide={() => setIsShowModal(false)}>
            <AdjustmentJournalViewTableRow id={currentItem?.journlaId} />
          </IViewModal>

          <IViewModal
            show={isHistoryModal}
            onHide={() => setIsHistoryModal(false)}
          >
            <HistoryModal adjustmentJournalId={historyItem?.journlaId} landingItem={historyItem} />
          </IViewModal>
        </div>
      </div>

      <Modal
        show={reverseModalShowState?.isShow}
        backdrop="static"
        onHide={handleClose}
        centered
      >
        <Modal.Header closeButton>
          {!reverseModalShowState?.isOtpGenerate && (
            <Modal.Title>Do you want to reverse the journal?</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          {!reverseModalShowState?.isOtpGenerate && (
            <>
              <div className="d-flex justify-content-center my-5">
                <p className="mr-5">
                  <span className="font-weight-bold">Voucher :</span>
                  {reverseModalShowState?.data?.code}
                </p>
                <p className="mr-5">
                  <span className="font-weight-bold">Amount :</span>
                  {reverseModalShowState?.data?.amount}
                </p>
              </div>
            </>
          )}
          {reverseModalShowState?.isOtpGenerate && (
            <div className="text-center my-5">
              <span className="mr-3"> Please Enter OTP Number</span>
              <input
                value={reverseModalShowState?.otp}
                onChange={(e) => {
                  setReverseModalShowState({
                    ...reverseModalShowState,
                    otp: e.target.value,
                  });
                }}
              />
            </div>
          )}
          <div className="text-center my-5">
            <button
              className="btn btn-primary mr-5"
              onClick={(e) => {
                if (reverseModalShowState?.isOtpGenerate) {
                  checkTwoFactorApproval(
                    2,
                    selectedBusinessUnit?.value,
                    "Journal",
                    reverseModalShowState?.data?.journlaId,
                    reverseModalShowState?.data?.code,
                    7,
                    profileData?.userId,
                    reverseModalShowState?.otp,
                    1,
                    setDisabledModalButton,
                    (status) => {
                      if (status === 1) {
                        rowDto.splice(reverseModalShowState?.index, 1);
                        setRowDto([...rowDto]);
                        setReverseModalShowState({
                          isShow: false,
                          data: null,
                        });
                      }
                    }
                  );
                } else {
                  checkTwoFactorApproval(
                    1,
                    selectedBusinessUnit?.value,
                    "Journal",
                    reverseModalShowState?.data?.journlaId,
                    reverseModalShowState?.data?.code,
                    7,
                    profileData?.userId,
                    "",
                    1,
                    setDisabledModalButton,
                    () => {
                      setReverseModalShowState({
                        ...reverseModalShowState,
                        otp: "",
                        isOtpGenerate: true,
                      });
                    }
                  );
                }
              }}
              disabled={disabledModalButton}
            >
              {disabledModalButton
                ? "Processing"
                : reverseModalShowState?.isOtpGenerate
                ? "Send"
                : "Yes"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleClose}
              // disabled={disabledModalButton}
            >
              {reverseModalShowState?.isOtpGenerate ? "Cancel" : "No"}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default withRouter(GridData);
