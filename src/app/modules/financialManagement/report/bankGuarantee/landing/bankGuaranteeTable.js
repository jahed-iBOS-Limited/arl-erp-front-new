import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import PaginationTable from "../../../../_helper/_tablePagination";
import IConfirmModal from "../../../../_helper/_confirmModal";
import IClose from "../../../../_helper/_helperIcons/_close";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export default function BankGuaranteeTable({
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
  return (
    <div>
      <div className="table-responsive">
        <table className="table table-striped table-bordered bj-table bj-table-landing">
          <thead>
            <tr>
              <th>SL</th>
              <th>SBU</th>
              <th>Bank</th>
              <th>BG Number</th>
              <th>Beneficiary Name</th>
              <th>Issuing Date</th>
              <th>Ending Date</th>
              <th>T Days</th>
              <th>Currency</th>
              <th>BG Amounts</th>
              <th>Margin Ref.</th>
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
                <td>{item?.strBankGuaranteeNumber}</td>
                <td>{item?.strBeneficiaryTitle}</td>
                <td className="text-center">
                  {_dateFormatter(item?.dteIssueDate)}
                </td>
                <td className="text-center">
                  {_dateFormatter(item?.dteEndingDate)}
                </td>
                <td>{item?.intTdays}</td>
                <td>{item?.strCurrency}</td>
                <td>{item?.numAmount}</td>
                <td>{item?.strMarginRef}</td>
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
                          className="ml-2"
                        >
                          <i
                            style={{ fontSize: "12px" }}
                            className={`fa fa-history`}
                            aria-hidden="true"
                          ></i>
                        </span>
                      </OverlayTrigger>
                    </span>
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
