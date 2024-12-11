import React, { useCallback, useState } from "react";
import IView from "../../../../_helper/_helperIcons/_view";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { withRouter } from "react-router-dom";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import IDelete from "./../../../../_helper/_helperIcons/_delete";
import IApproval from "./../../../../_helper/_helperIcons/_approval";
import { _formatMoney } from "./../../../../_helper/_formatMoney";
import Loading from "./../../../../_helper/_loading";
// import PaginationTable from "./../../../../_helper/_tablePagination";
import { toast } from "react-toastify";
import IViewModal from "../../../../_helper/_viewModal";
import { InvTransViewTableRow } from "../report/tableRow";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { checkTwoFactorApproval } from "../../bankJournal/helper";
import { dynamicSerial } from "../../utils";
import IHistory from "../../../../_helper/_helperIcons/_history";
import HistoryModal from "../cashJournalHistory";
import { shallowEqual, useSelector } from "react-redux";
import findIndex from "../../../../_helper/_findIndex";

const GridData = ({
  history,
  rowDto,
  allGridCheck,
  itemSlectedHandler,
  remover,
  type,
  singleApprovalndler,
  completeDate,
  journalTypeValue,
  loading,
  paginationState,
  // setPositionHandler,
  values,
  selectedBusinessUnit,
  profileData,
  setRowDto,
  pageNo,
  pageSize,
}) => {

  let { userRole } = useSelector(
    (state) => state?.authData,
    { shallowEqual }
  );

  const [isShowModal, setIsShowModal] = useState(false);
  const [isHistoryModal, setIsHistoryModal] = useState(false);
  const [historyItem, setHistoryItem] = useState("");
  const [currentRowData, setCurrentRowData] = useState("");
  const [disabledModalButton, setDisabledModalButton] = useState(false);
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
    setDisabledModalButton(false);
  };

  const userPermission = userRole[findIndex(userRole, "Cash Journal")];

  const canCreate = userPermission?.isCreate;

  return (
    <>
      {/* Table Start */}
      <div className="row cash_journal" 
        style={{
        overflowX: "auto",
        }}>
        <div className="col-lg-12 pr-0 pl-0">
        <div className="table-responsive">
        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm">
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
                <th style={{ width: "80px", textAlign: "center" }}>
                  Journal Date
                </th>
                <th style={{ width: "120px" }}>Journal Code</th>
                <th style={{ width: "80px", textAlign: "center" }}>
                  Complete Date
                </th>
                <th style={{ width: "200px" }}>
                  {journalTypeValue === 1
                    ? "Receive From"
                    : journalTypeValue === 2
                      ? "Pay To"
                      : "Transfer To"}
                </th>
                <th style={{ width: "100px" }}>Amount</th>
                <th>Narration</th>
                <th style={{ width: "125px" }}>Actions</th>
              </tr>
            </thead>
            {loading && <Loading />}
            <tbody>
              {rowDto?.map((item, index) => (
                <tr>
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

                  <td className="text-center positionSticky"> {dynamicSerial(pageNo, pageSize, index)}</td>
                  <td>
                    <div className="pl-2  text-center">
                      {_dateFormatter(item?.journalDate)}
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
                  <td>
                    <div className="pl-2">{item?.receiveFrom}</div>
                  </td>
                  <td className="text-right">
                    <div className="pr-2">
                      {_formatMoney(Math.abs(item?.amount))}
                    </div>
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
                            setCurrentRowData({ ...values, ...item });
                            setIsShowModal(true);
                          }}
                        />
                      </span>
                      {type === "notComplated" ? (
                        <>
                          {canCreate && (
                            <span
                            className="edit ml-2"
                            onClick={() =>
                              history.push({
                                pathname: `${window.location.pathname}/edit/${item.journalId}`,
                                state: { ...values, ...item, accountingJournalTypeId: journalTypeValue },
                              })
                            }
                          >
                            <IEdit />
                          </span>
                          )}
                          {(canCreate && item?.isApproved && item?.isManual) && (
                            <span
                            className="approval ml-2"
                            onClick={() => {
                              if (
                                completeDate < _dateFormatter(item?.journalDate)
                              )
                                return toast.warn(
                                  "Complete date should be greater than or equal to journal date"
                                );
                              singleApprovalndler(index, completeDate, journalTypeValue);
                            }}
                          >
                            <IApproval />
                          </span>
                          )}
                          {canCreate && (<span
                            className="delete ml-2"
                            onClick={() => remover(index, journalTypeValue)}
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
                                data: { ...item, accountingJournalTypeId: journalTypeValue },
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
            <InvTransViewTableRow
              id={currentRowData?.journalId}
              headerData={{ ...currentRowData, accountingJournalTypeId: journalTypeValue }}
            />
          </IViewModal>
          <IViewModal show={isHistoryModal} onHide={() => setIsHistoryModal(false)}>
            <HistoryModal
              journalId={historyItem?.journalId}
              journalTypeValue={journalTypeValue}
            />
            {/* <InvTransViewTableRow
              id={currentRowData?.journalId}
              headerData={{ ...currentRowData, accountingJournalTypeId: journalTypeValue }}
            /> */}
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
                    reverseModalShowState?.data?.journalId,
                    reverseModalShowState?.data?.code,
                    journalTypeValue,
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
                    reverseModalShowState?.data?.journalId,
                    reverseModalShowState?.data?.code,
                    journalTypeValue,
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
              {disabledModalButton ? "Processing" : reverseModalShowState?.isOtpGenerate ? "Send" : "Yes"}
              {/* {reverseModalShowState?.isOtpGenerate ? "Send" : "Yes"} */}
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
