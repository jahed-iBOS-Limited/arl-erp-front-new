import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import {
  fetchTenderDetailsCallbackForPrintAndCreateEditPage,
  selectEditId,
} from "../helper";

const BADCTendersTable = ({
  accountId,
  buUnId,
  values,
  submittedTenderLists,
  handleTenderPrint,
  getTenderDetails,
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
            <th>Item Name</th>
            <th>Load Port</th>
            <th style={{ width: "150px" }}>Foreign Qty (MT)</th>
            <th>Foreign Price (USD)</th>
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
                <td>{item?.enquiryNo}</td>
                <td>{item?.itemName}</td>
                <td style={{ width: "200px" }}>{item?.loadPortName}</td>
                <td className="text-right" style={{ width: "70px" }}>
                  {item?.foreignQty}
                </td>
                <td className="text-right" style={{ width: "200px" }}>
                  {item?.foreignPriceUsd === null ? 0 : item?.foreignPriceUsd}
                </td>
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
                  <div className="d-flex" style={{ columnGap: "5px" }}>
                    {!item?.isAccept ? (
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
                    ) : (
                      <></>
                    )}
                    <span
                      // 1st approch
                      // onClick={() => {
                      //     fetchTenderDetails(item?.tenderId)
                      //     handleTenderPrint()
                      // }}
                      // 2nd approch
                      onClick={() => {
                        fetchTenderDetailsCallbackForPrintAndCreateEditPage(
                          accountId,
                          buUnId,
                          values,
                          item?.tenderId,
                          getTenderDetails,
                          handleTenderPrint
                        );
                      }}
                    >
                      <OverlayTrigger
                        overlay={<Tooltip id="cs-icon">Print</Tooltip>}
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

export default BADCTendersTable;
