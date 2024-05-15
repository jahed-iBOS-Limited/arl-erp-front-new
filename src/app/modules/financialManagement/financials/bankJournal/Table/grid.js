import React, { useCallback, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import IView from "../../../../_helper/_helperIcons/_view";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { withRouter } from "react-router-dom";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import IDelete from "./../../../../_helper/_helperIcons/_delete";
import IApproval from "./../../../../_helper/_helperIcons/_approval";
import { _formatMoney } from "./../../../../_helper/_formatMoney";
import Loading from "./../../../../_helper/_loading";
// import PaginationTable from "./../../../../_helper/_tablePagination";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ChequeModal from "../ChequeModal/chequeModal";
import ChequePrintModal from "../chequePrintModal/chequePrintModal";
// import IConfirmModal from "./../../../../_helper/_confirmModal";
// import { setGenarateChequeNo } from "./../helper";
import { toast } from "react-toastify";
import IViewModal from "../../../../_helper/_viewModal";
import { BankJournalViewTableRow } from "../report/tableRow";
import { checkTwoFactorApproval, chequeGeneretor } from "../helper";
import { Modal } from "react-bootstrap";
import { dynamicSerial } from "../../utils";
import IHistory from "../../../../_helper/_helperIcons/_history";
import HistoryModal from "../bankJournalHistory";
// import { set } from "object-path";

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
  formValues,
  landing,
  paginationState,
  gridDataLoad,
  values,
  setRowDto,
}) => {
  const {
    pageNo,
    // setPageNo,
    pageSize,
    // setPageSize,
    // totalCountRowDto,
  } = paginationState;

  // Cheque Modal State
  const [isChequeModalActive, setChequeModal] = useState(false);
  const [reverseModalShowState, setReverseModalShowState] = useState({
    isShow: false,
    data: null,
  });
  const [changeModalShowState, setChangeModalShowState] = useState({
    isShow: false,
    data: null,
  });
  const [chequeModalData, setChequeModalData] = useState({});
  const [chequePrintModalData, setChequePrintModalData] = useState({});
  const [currentCheckNo] = useState("");

  const [chequePrintModalShow, setChequePrintModalShow] = useState(false);
  const [disabledModalButton, setDisabledModalButton] = useState(false);

  let { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    { shallowEqual }
  );

  const [isShowModal, setIsShowModal] = useState(false);
  const [currentRowData, setCurrentRowData] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const totalAmount = useCallback(
    rowDto.reduce((acc, item) => acc + +item.amount, 0)
  );

  const handleClose = () => {
    setReverseModalShowState({
      isShow: false,
      data: null,
    });
  };

  const [isHistoryModal, setIsHistoryModal] = useState(false);
  const [historyItem, setHistoryItem] = useState("");


  return (
    <>
      {/* Table Start */}
      <div className="row cash_journal">
        <div className="col-lg-12">
        <div className="table-responsive">
        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
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
                <th style={{ width: "30px" }}>SL</th>
                <th style={{ width: "80px", textAlign: "center" }}>
                  Journal Date
                </th>
                <th style={{ width: "120px" }}>Journal Code</th>
                <th style={{ width: "100px" }}>Complete Date</th>
                <th style={{ width: "100px" }}>Instrument Date</th>
                <th>Instrument No</th>
                <th style={{ width: "200px" }}>
                  {journalTypeValue === 4
                    ? "Receive From"
                    : journalTypeValue === 5
                      ? "Pay To"
                      : "Transfer To"}
                </th>
                <th style={{ width: "100px" }}>Amount</th>
                <th>Bank Name</th>

                <th style={{ width: "160px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {landing && <Loading />}
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
                          itemSlectedHandler(e.target.checked, index);
                        }}
                      />
                    </td>
                  ) : null}

                  <td className="text-center">{dynamicSerial(pageNo, pageSize, index)}</td>
                  <td>
                    <div className="pl-2 text-center">
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
                    <div className="pl-2 text-center">
                      {" "}
                      {_dateFormatter(item?.instrumentDate)}
                    </div>
                  </td>
                  <td>{item?.instrumentNo}</td>
                  <td>
                    <div className="pl-2">{item?.receiveName}</div>
                  </td>
                  <td className="text-right">
                    <div className="pr-2">
                      {_formatMoney(Math.abs(item?.amount))}
                    </div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.bankName}</div>
                  </td>

                  <td>
                    <div className="d-flex justify-content-center">
                      <span className="view mr-2">
                        <IHistory
                          clickHandler={() => {
                            console.log("item",item);
                            setHistoryItem(item);
                            setIsHistoryModal(true);
                          }}
                        />
                      </span>

                      <span className="view">
                        <IView
                          clickHandler={() => {
                            setCurrentRowData({ ...item, accountingJournalTypeId: journalTypeValue });
                            setIsShowModal(true);
                          }}
                        />
                      </span>
                      {type === "notComplated" ? (
                        <>
                          <span
                            className="edit ml-3"
                            onClick={() =>
                              history.push({
                                pathname: `${window.location.pathname}/edit/${item.journalId}`,
                                state: {
                                  selectedJournal:
                                    formValues.accountingJournalTypeId,
                                  selectedSbu: formValues.sbu,
                                  transactionDate: formValues.transactionDate,
                                },
                              })
                            }
                          >
                            <IEdit />
                          </span>

                          {(item?.instrumentType === 2 ||
                            item?.instrumentType === 3) && (
                              <>
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">
                                      {"Change Cheque No"}
                                    </Tooltip>
                                  }
                                >
                                  <span
                                    className={
                                      item?.instrumentType === 2 ||
                                        item?.instrumentType === 3
                                        ? `iconActive ml-3`
                                        : `iconInActive ml-3`
                                    }
                                    onClick={() => {
                                      if (
                                        item?.instrumentType === 2 ||
                                        item?.instrumentType === 3
                                      ) {
                                        setChangeModalShowState({
                                          isShow: true,
                                          data: item,
                                          index,
                                          otp: "",
                                        });
                                      }
                                    }}
                                  >
                                    <i
                                      className={`fa pointer fa-credit-card`}
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                </OverlayTrigger>
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">
                                      {"Cheque Print"}
                                    </Tooltip>
                                  }
                                >
                                  <span
                                    className={
                                      item?.instrumentType === 2 ||
                                        item?.instrumentType === 3
                                        ? `iconActive ml-3`
                                        : `iconInActive ml-3`
                                    }
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      if (
                                        item?.instrumentType === 2 ||
                                        item?.instrumentType === 3
                                      ) {
                                        setChequePrintModalShow(true);
                                        setChequePrintModalData(item);
                                      }
                                    }}
                                  >
                                    <i class="fas fa-print"></i>
                                  </span>
                                </OverlayTrigger>
                              </>
                            )}

                          <span
                            className="approval ml-3"
                            onClick={() => {
                              if (
                                completeDate < _dateFormatter(item?.journalDate) && values?.accountingJournalTypeId?.label?.trim() !== "Bank Receipts"
                              )
                                return toast.warn(
                                  "Complete date should be greater than or equal to journal date"
                                );
                              singleApprovalndler(index, completeDate, journalTypeValue);
                            }}
                          >
                            <IApproval />
                          </span>
                          <span
                            className="delete ml-3"
                            onClick={() => remover(index, journalTypeValue)}
                          >
                            <IDelete />
                          </span>
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
            <BankJournalViewTableRow
              id={currentRowData?.journalId}
              headerData={currentRowData}
            />
          </IViewModal>

          {currentCheckNo && (
            <ChequeModal
              show={isChequeModalActive}
              history={history}
              chequeData={chequeModalData}
              currentCheckNo={currentCheckNo}
              parentFormValue={values}
              pageNo={pageNo}
              pageSize={pageSize}
              onHide={() => {
                setChequeModal(true);
                setChequeModalData({});
              }}
              setChequeModal={setChequeModal}
              gridDataLoad={gridDataLoad}
            />
          )}

          <ChequePrintModal
            show={chequePrintModalShow}
            onHide={() => {
              setChequePrintModalShow(false);
              setChequePrintModalData({});
            }}
            item={chequePrintModalData}
          />
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
                    formValues.accountingJournalTypeId?.value,
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
                    formValues.accountingJournalTypeId?.value,
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
                  // setReverseModalShowState({
                  //   ...reverseModalShowState,
                  //   otp:"",
                  //   isOtpGenerate: true,
                  // });
                }
              }}
              disabled={disabledModalButton}
            >
              {/* {reverseModalShowState?.isOtpGenerate ? "Send" : "Yes"} */}
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
      <Modal
        show={changeModalShowState?.isShow}
        backdrop="static"
        onHide={(e) => {
          setChangeModalShowState({
            isShow: false,
            data: null,
          });
        }}
        centered
      >
        <Modal.Header closeButton>
          {!changeModalShowState?.isOtpGenerate && (
            <Modal.Title>Do you want to change the cheque?</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          {!changeModalShowState?.isOtpGenerate && (
            <>
              <div className="d-flex justify-content-center my-5">
                <p className="mr-5">
                  <span className="font-weight-bold">Voucher :</span>
                  {changeModalShowState?.data?.code}
                </p>
                <p className="mr-5">
                  <span className="font-weight-bold">Amount :</span>
                  {changeModalShowState?.data?.amount}
                </p>
              </div>
            </>
          )}
          {changeModalShowState?.isOtpGenerate && (
            <div className="text-center my-5">
              <span className="mr-3"> Please Enter OTP Number</span>
              <input
                value={changeModalShowState?.otp}
                onChange={(e) => {
                  setChangeModalShowState({
                    ...changeModalShowState,
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
                if (changeModalShowState?.isOtpGenerate) {
                  checkTwoFactorApproval(
                    2,
                    selectedBusinessUnit?.value,
                    "ChangeCheque",
                    changeModalShowState?.data?.journalId,
                    changeModalShowState?.data?.code,
                    formValues.accountingJournalTypeId?.value,
                    profileData?.userId,
                    changeModalShowState?.otp,
                    1,
                    setDisabledModalButton,
                    (status) => {
                      if (status === 1) {
                        chequeGeneretor(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          changeModalShowState?.data?.bankId,
                          changeModalShowState?.data?.branchId,
                          changeModalShowState?.data?.bankAccountId,
                          changeModalShowState?.data?.bankAccountNo,
                          changeModalShowState?.data?.instrumentType,
                          changeModalShowState?.data?.journalId,
                          (obj) => {
                            rowDto[changeModalShowState?.index]["instrumentNo"] =
                              obj?.currentChequeNo;
                            setRowDto([...rowDto]);
                            setChangeModalShowState({
                              isShow: false,
                              data: null,
                            });
                            setDisabledModalButton(false);
                          }
                        );
                        // setChequeModalData(changeModalShowState?.data);
                      }
                    }
                  );
                } else {
                  checkTwoFactorApproval(
                    1,
                    selectedBusinessUnit?.value,
                    "ChangeCheque",
                    changeModalShowState?.data?.journalId,
                    changeModalShowState?.data?.code,
                    formValues.accountingJournalTypeId?.value,
                    profileData?.userId,
                    "",
                    1,
                    setDisabledModalButton,
                    () => {
                      setChangeModalShowState({
                        ...changeModalShowState,
                        otp: "",
                        isOtpGenerate: true,
                      });
                      setDisabledModalButton(false);
                    }
                  );
                  // setReverseModalShowState({
                  //   ...reverseModalShowState,
                  //   otp:"",
                  //   isOtpGenerate: true,
                  // });
                }
              }}
              disabled={disabledModalButton}
            >
              {/* {reverseModalShowState?.isOtpGenerate ? "Send" : "Yes"} */}
              {disabledModalButton
                ? "Processing"
                : changeModalShowState?.isOtpGenerate
                  ? "Send"
                  : "Yes"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={(e) => {
                setChangeModalShowState({
                  isShow: false,
                  data: null,
                });
                setDisabledModalButton(false);
              }}
            // disabled={disabledModalButton}
            >
              {changeModalShowState?.isOtpGenerate ? "Cancel" : "No"}
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <IViewModal show={isHistoryModal} onHide={() => setIsHistoryModal(false)}>
        <HistoryModal journalId={historyItem?.journalId} journalTypeId={historyItem?.intAccountingJournalTypeId} />
      </IViewModal>

    </>
  );
};

export default withRouter(GridData);
