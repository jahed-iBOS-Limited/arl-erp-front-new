import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import PaginationTable from "../../../../_helper/_tablePagination";
import IConfirmModal from "../../../../_helper/_confirmModal";
import IClose from "../../../../_helper/_helperIcons/_close";

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
}) {
  return (
    <div>
      <table className="table table-striped table-bordered bj-table bj-table-landing">
        <thead>
          <tr>
            <th>SL</th>
            <th>SBU</th>
            <th>Bank</th>
            <th>Bank Guarantee Number</th>
            <th>Beneficiary</th>
            <th>Issuing Date</th>
            <th>Ending Date</th>
            <th>T Days</th>
            <th>Currency</th>
            <th> BG Amounts</th>
            <th> Status</th>
            <th>Margin Ref.</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rowData?.data?.map((item, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{item?.strSbu}</td>
              <td>{item?.strBankName}</td>
              <td>{item?.strBankGuaranteeNumber}</td>
              <td>{item?.strBeneficiaryName}</td>
              <td className="text-center">
                {_dateFormatter(item?.dteIssueDate)}
              </td>
              <td className="text-center">
                {_dateFormatter(item?.dteEndingDate)}
              </td>
              <td>{item?.intTdays}</td>
              <td>{item?.strCurrency}</td>
              <td>{item?.numAmount}</td>
              <td>{item?.strStatus}</td>
              <td>{item?.strMarginRef}</td>
              <td>
                <div className="d-flex justify-content-between">
                  {["Issue", "Renewed"]?.includes(item?.strStatus) ? (
                    <span
                      onClick={() => {
                        history.push({
                          pathname: `/financial-management/banking/BankGuarantee/renew/${values?.type?.value}`,
                          state: item,
                        });
                      }}
                      style={{ cursor: "pointer" }}
                      className="text-primary"
                    >
                      Renew
                    </span>
                  ) : null}
                  <span
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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
