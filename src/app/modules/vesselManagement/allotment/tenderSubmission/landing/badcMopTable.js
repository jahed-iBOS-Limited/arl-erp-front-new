import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import { fetchBADCMOPRowsDataForPrintPage, selectEditId } from "../helper";

const BADCMOPTable = ({
  accountId,
  buUnId,
  submittedTenderLists,
  handleTenderPrint,
  getTenderDetails,
  setTenderPrintId,
}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <div className="table-responsive">
      <table
        id="table-to-xlsx"
        className={
          "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm global-table"
        }
      >
        <thead>
          <tr className="cursor-pointer">
            <th>SL</th>
            <th style={{ width: "150px" }}>Business Partner</th>
            <th>Enquiry No</th>
            <th>Submission Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submittedTenderLists?.data?.map((item, index) => {
            return (
              <tr key={index}>
                <td style={{ width: "40px" }} className="text-center">
                  {index + 1}
                </td>
                <td>{item?.businessPartnerName}</td>
                <td>{item?.mopInvoiceId}</td>
                <td>{_dateFormatter(item?.submissionDate)}</td>
                <td style={{ width: "70px" }}>
                  {item?.isAccept
                    ? "Approved"
                    : item?.isReject
                    ? "Reject"
                    : item?.isPending
                    ? "Pending"
                    : "NA"}
                </td>
                <td style={{ width: "80px" }} className="text-center">
                  <div className="d-flex justify-content-around">
                    {item?.isAccept !== true && (
                      <span>
                        <IEdit
                          onClick={() => {
                            history.push({
                              pathname: `/vessel-management/allotment/tendersubmission/edit/${selectEditId(
                                item
                              )}`,
                              state: item,
                            });
                            // setShow(true);
                          }}
                          // id={item?.shiptoPartnerId}
                        />
                      </span>
                    )}
                    <span
                      // 2nd approch
                      onClick={() => {
                        fetchBADCMOPRowsDataForPrintPage(
                          accountId,
                          buUnId,
                          item?.mopTenderId,
                          getTenderDetails,
                          handleTenderPrint,
                          "initReport",
                          1 // chittagong port id
                        );
                        // Set 1 for ctg port & show Annexure A & description on print head
                        setTenderPrintId(1);
                      }}
                    >
                      <OverlayTrigger
                        overlay={
                          <Tooltip id="cs-icon">Print Chittagong</Tooltip>
                        }
                      >
                        <i
                          style={{ fontSize: "16px" }}
                          class="fa fa-print cursor-pointer"
                          aria-hidden="true"
                        ></i>
                      </OverlayTrigger>
                    </span>

                    <span
                      onClick={() => {
                        fetchBADCMOPRowsDataForPrintPage(
                          accountId,
                          buUnId,
                          item?.mopTenderId,
                          getTenderDetails,
                          handleTenderPrint,
                          "initReport",
                          4 // mangla port id
                        );
                        // Set 1 for mangla port & show Annexure B &  description on print head
                        setTenderPrintId(4);
                      }}
                    >
                      <OverlayTrigger
                        overlay={<Tooltip id="cs-icon">Print Mangla</Tooltip>}
                      >
                        <i
                          style={{ fontSize: "16px" }}
                          class="fa fa-print cursor-pointer"
                          aria-hidden="true"
                        ></i>
                      </OverlayTrigger>
                    </span>
                    <span
                      onClick={() => {
                        fetchBADCMOPRowsDataForPrintPage(
                          accountId,
                          buUnId,
                          item?.mopTenderId,
                          getTenderDetails,
                          handleTenderPrint,
                          "finalReport"
                        );
                        // Set 0 for hide Annexure description on print head
                        setTenderPrintId(0);
                      }}
                    >
                      <OverlayTrigger
                        overlay={<Tooltip id="cs-icon">Print Final</Tooltip>}
                      >
                        <i
                          style={{ fontSize: "16px" }}
                          class="fa fa-print cursor-pointer"
                          aria-hidden="true"
                        ></i>
                      </OverlayTrigger>
                    </span>
                    {item?.attachment && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            getDownlloadFileView_Action(item?.attachment)
                          );
                        }}
                      >
                        <ICon title={`View Attachment`}>
                          <i class="far fa-file-image"></i>
                        </ICon>
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BADCMOPTable;
