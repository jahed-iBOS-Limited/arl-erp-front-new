import React from "react";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";

export default function DepositRegisterTable({
  rowData,
  values,
  pageNo,
  setPageNo,
  pageSize,
  setPageSize,
  setPositionHandler,
  history,
}) {
  const dispatch = useDispatch();

  return (
    <div>
      <table className="table table-striped table-bordered bj-table bj-table-landing">
        <thead>
          <tr>
            <th>SL</th>
            <th>SBU</th>
            <th>Bank</th>
            <th>Security Type</th>
            <th>Beneficiary</th>
            <th>Issue Date</th>
            <th>Retirement Date</th>
            <th>Amount</th>
            <th>In Fav. Of</th>
            <th>Purpose</th>
            <th>Responsible person to return</th>
            <th>Note</th>
            <th>Attachment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rowData?.data?.map((item, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{item?.strSbu}</td>
              <td>{item?.strBankName}</td>
              <td>{item?.strSecurityType}</td>
              <td>{item?.strBeneficiaryNumber}</td>
              <td>{_dateFormatter(item?.dteIssueDate)}</td>
              <td>{_dateFormatter(item?.dteEndingDate)}</td>
              <td>{item?.numAmount}</td>
              <td>{item?.strInFavOf}</td>
              <td>{item?.strPurpose}</td>
              <td>{item?.strResponsiblePerson}</td>
              <td>{item?.strRemarks}</td>
              <td className="text-center">
                <OverlayTrigger
                  overlay={<Tooltip id="cs-icon">View Attachment</Tooltip>}
                >
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(
                        getDownlloadFileView_Action(item?.strAttachment || "")
                      );
                    }}
                    className="ml-2"
                  >
                    <i
                      style={{ fontSize: "16px" }}
                      className={`fas fa-paperclip`}
                      aria-hidden="true"
                    ></i>
                  </span>
                </OverlayTrigger>
              </td>
              <td>
                <div>
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
