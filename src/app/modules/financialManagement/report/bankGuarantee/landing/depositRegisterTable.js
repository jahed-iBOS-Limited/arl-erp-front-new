import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import PaginationTable from "../../../../_helper/_tablePagination";
import IClose from "../../../../_helper/_helperIcons/_close";
import IConfirmModal from "../../../../_helper/_confirmModal";

export default function DepositRegisterTable({
  rowData,
  values,
  pageNo,
  setPageNo,
  pageSize,
  setPageSize,
  setPositionHandler,
  history,
  closeHandler,
  profileData,
  setIsShowModal,
  setItem,
}) {
  const dispatch = useDispatch();

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered bj-table bj-table-landing">
          <thead>
            <tr>
              <th>SL</th>
              <th>SBU</th>
              <th>Bank</th>
              <th>Security Type</th>
              <th>Beneficiary Name</th>
              <th>Issue Date</th>
              <th>Retirement Date</th>
              <th>Amount</th>
              <th>In Fav. Of</th>
              <th>Purpose</th>
              <th>Responsible person to return</th>
              <th>Note</th>
              <th>Status</th>
              <th style={{ minWidth: "70px" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.data?.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item?.strSbu}</td>
                <td>{item?.strBankName}</td>
                <td>{item?.strSecurityType}</td>
                <td>{item?.strBeneficiaryTitle}</td>
                <td>{_dateFormatter(item?.dteIssueDate)}</td>
                <td>{_dateFormatter(item?.dteEndingDate)}</td>
                <td>{item?.numAmount}</td>
                <td>{item?.strInFavOf}</td>
                <td>{item?.strPurpose}</td>
                <td>{item?.strResponsiblePerson}</td>
                <td>{item?.strRemarks}</td>
                <td>{item?.strStatus}</td>
                <td>
                  <div className="d-flex justify-content-between">
                    <span style={{ cursor: "pointer", padding: "2px" }}>
                      <OverlayTrigger
                        overlay={<Tooltip id="cs-icon">History</Tooltip>}
                      >
                        <span
                          onClick={(e) => {
                            setIsShowModal(true);
                            setItem(item);
                          }}
                          className=""
                        >
                          <i
                            style={{ fontSize: "12px" }}
                            className={`fa fa-history`}
                            aria-hidden="true"
                          ></i>
                        </span>
                      </OverlayTrigger>
                    </span>
                    {item?.strAttachment ? (
                      <span style={{ cursor: "pointer", padding: "2px" }}>
                        <OverlayTrigger
                          overlay={
                            <Tooltip id="cs-icon">View Attachment</Tooltip>
                          }
                        >
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(
                                getDownlloadFileView_Action(
                                  item?.strAttachment || ""
                                )
                              );
                            }}
                            className=""
                          >
                            <i
                              style={{ fontSize: "12px" }}
                              className={`fas fa-paperclip`}
                              aria-hidden="true"
                            ></i>
                          </span>
                        </OverlayTrigger>
                      </span>
                    ) : null}
                    {["Issue", "Renewed"]?.includes(item?.strStatus) ? (
                      <span
                        onClick={() => {
                          history.push({
                            pathname: `/financial-management/banking/BankGuarantee/renew/${values?.type?.value}`,
                            state: item,
                          });
                        }}
                        style={{ cursor: "pointer", padding: "2px" }}
                        className="text-primary"
                      >
                        Renew
                      </span>
                    ) : null}
                    {item?.strStatus !== "Closed" ? (
                      <span
                        style={{ cursor: "pointer", padding: "2px" }}
                        onClick={() => {
                          IConfirmModal({
                            title: "Close Action",
                            closeOnClickOutside: false,
                            message: "Do you want to Close ?",
                            yesAlertFunc: () => {
                              closeHandler(
                                `/fino/CommonFino/CreateBankGuaranteeSecurityRegister`,
                                {
                                  strPartName: "close",
                                  intId: item?.intId,
                                  intActionBy: profileData?.userId,
                                },
                                () => {
                                  setPositionHandler(pageNo, pageSize, values);
                                },
                                true
                              );
                            },
                            noAlertFunc: () => {},
                          });
                        }}
                      >
                        <IClose />
                      </span>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rowData?.data?.length > 0 && (
        <PaginationTable
          count={rowData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{
            pageNo,
            setPageNo,
            pageSize,
            setPageSize,
          }}
          values={values}
        />
      )}
    </div>
  );
}
