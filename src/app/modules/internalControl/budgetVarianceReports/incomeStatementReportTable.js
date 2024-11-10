import moment from "moment";
import React, { useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _formatMoney } from "../../_helper/_formatMoney";
import IViewModal from "../../_helper/_viewModal";
import GeneralLedgerModalForIncomeStatement from "./generalLedgerModalForIncomeStatement";

export default function IncomeStatementReportTable({
  incomeStatement,
  values,
}) {
  const [showGeneralLedgerModal, setShowGeneralLedgerModal] = useState(false);
  const [incomeStatementRow, setIncomeStatementRow] = useState(null);
  const {
    localStorage: { reportIncomestatement },
    authData: {
      profileData: { accountId, ...restProfileData },
      businessUnitList,
      selectedBusinessUnit,
    },
  } = useSelector((state) => state, shallowEqual);
  const printRef = useRef();
  return (
    <>
      <div className="row" id="pdf-section" ref={printRef}>
        {incomeStatement.length > 0 && (
          <div className="col-lg-12">
            <div className="titleContent text-center">
              <h3>
                {values?.businessUnit?.value > 0
                  ? values?.businessUnit?.label
                  : restProfileData?.accountName}
              </h3>
              <h5>Comprehensive Income Statement</h5>
              <p className="m-0">
                <strong>
                  {`For the period from ${values?.fromDate} to ${values?.todate}`}
                </strong>
              </p>
            </div>
            <div className="print_wrapper">
              <table
                id="table-to-xlsx"
                className="table table-striped table-bordered mt-3 global-table table-font-size-sm"
              >
                <thead>
                  <tr>
                    <th style={{ width: "500px" }}>Particulars</th>
                    <th style={{ width: "200px" }}>Note SL</th>

                    <th
                      style={{ width: "250px" }}
                      className="incTableThPadding"
                    >
                      <span>
                        Budget
                        <br />
                        {/* {`${values?.fromDate} to ${values?.todate}`} */}
                      </span>
                    </th>
                    <th
                      style={{ width: "250px" }}
                      className="incTableThPadding"
                    >
                      <span>
                        Actual <br />
                        {/* {`${values?.lastPeriodFrom} to ${values?.lastPeriodTo}`} */}
                      </span>
                    </th>
                    <th style={{ width: "250px" }}>Variance</th>
                  </tr>
                </thead>
                <tbody>
                  {incomeStatement?.map((data, index) => (
                    <>
                      <tr
                        className={
                          data?.intFSId === 0 || data?.intFSId === 20
                            ? "font-weight-bold"
                            : ""
                        }
                      >
                        <td className="text-left">
                          {data?.strFSComponentName}
                        </td>
                        <td></td>

                        <td className="text-right">
                          {_formatMoney(data?.monLastPeriodAmount)}
                        </td>
                        <td
                          className="text-right pointer"
                          style={{
                            textDecoration:
                              data?.intFSId === 0 || data?.intFSId === 20
                                ? ""
                                : "underline",
                            color:
                              data?.intFSId === 0 || data?.intFSId === 20
                                ? ""
                                : "blue",
                          }}
                        >
                          <span
                            onClick={() => {
                              if (
                                !(data?.intFSId === 0 || data?.intFSId === 20)
                              ) {
                                setShowGeneralLedgerModal(true);
                                setIncomeStatementRow(data);
                              }
                            }}
                          >
                            {" "}
                            {_formatMoney(data?.monCurrentPeriodAmount)}
                          </span>
                        </td>
                        <td className="text-right">
                          {_formatMoney(
                            data?.monLastPeriodAmount -
                              data?.monCurrentPeriodAmount
                          )}
                        </td>
                      </tr>
                    </>
                  ))}
                  <tr>
                    <td
                      className="text-center d-none"
                      colSpan={4}
                    >{`System Generated Report - ${moment().format(
                      "LLLL"
                    )}`}</td>
                  </tr>
                </tbody>
              </table>
              <div></div>
            </div>
          </div>
        )}
      </div>
      <IViewModal
        show={showGeneralLedgerModal}
        onHide={() => {
          setShowGeneralLedgerModal(false);
          setIncomeStatementRow(null);
        }}
      >
        <GeneralLedgerModalForIncomeStatement
          values={values}
          businessUnitList={businessUnitList}
          incomeStatementRow={incomeStatementRow}
          profileData={{ ...restProfileData, accountId }}
        />
      </IViewModal>

      {/* <IViewModal
        show={statisticalDetailsModal}
        onHide={() => {
          setStatisticalDetailsModal(false);
        }}
      >
        <StatisticalDetails formValues={values} />
      </IViewModal> */}
    </>
  );
}
