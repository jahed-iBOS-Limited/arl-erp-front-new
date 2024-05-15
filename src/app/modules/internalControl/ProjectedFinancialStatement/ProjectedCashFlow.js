import React from "react";
import { _dateFormatter } from "../../_helper/_dateFormate";
import { _formatMoney } from "../../_helper/_formatMoney";
import { isLastDayOfMonth } from "./helper";
import useAxiosPost from "../../_helper/customHooks/useAxiosPost";
import Loading from "../../_helper/_loading";
import { shallowEqual, useSelector } from "react-redux";
import numberWithCommas from "../../_helper/_numberWithCommas";

const ProjectedCashFlow = ({ rowDto, values, accountName }) => {
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [, sendToAssetLiability, loading] = useAxiosPost();
  return (
    <>
      {loading && <Loading />}
      {rowDto?.length > 0 && (
        <div className="d-flex flex-column align-items-center">
          <div className="text-center">
            <h2 className="mb-0" style={{ fontWeight: "bold" }}>
              {values?.businessUnit?.value > 0
                ? values?.businessUnit?.label
                : accountName}
            </h2>
            <h4 className="text-primary">Projected Cash Flow Statement</h4>
            <p className="mt-4" style={{ fontWeight: "bold" }}>
              {`For the period from: ${_dateFormatter(
                values?.fromDate
              )}  to  ${_dateFormatter(values?.toDate)}`}{" "}
            </p>
          </div>
          <div className="table-responsive">
            <table style={{ width: "75%" }} className="cashFlowStatement">
              <tr>
                <td className="pr-5 text-right">
                  Opening Cash & Cash Equivalent
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    textAlign: "center",
                  }}
                >
                  {numberWithCommas(Math.round(rowDto[0]["numPlannedOpening"]))}
                </td>
                <td
                  style={{
                    border: "1px solid black",
                    textAlign: "center",
                  }}
                >
                  {numberWithCommas(Math.round(rowDto[0]["numOpening"]))}
                </td>
                {/* <td
                style={{
                  border: "1px solid black",
                  textAlign: "center",
                }}
              >
                {_formatMoney(
                  rowDto[0]["numPlannedOpening"] - rowDto[0]["numOpening"]
                )}
              </td> */}
              </tr>
              <tr>
                <td style={{ height: "15px" }}></td>
                <td className="text-center" style={{ height: "15px" }}>
                  last Period
                </td>
                <td className="text-center" style={{ height: "15px" }}>
                  Current Period
                </td>
                {/* <td className="text-center" style={{ height: "15px" }}>
                Variance
              </td> */}
              </tr>
              {rowDto?.map((item, index) => {
                switch (item.intFSId) {
                  case 9999:
                    return (
                      <tr style={{ background: "#e6ecff" }}>
                        <td colSpan="4">{item?.strName}</td>
                      </tr>
                    );
                  case 0:
                    if (item.strName.startsWith("Net")) {
                      return (
                        <tr style={{ background: "#f0f0f5" }}>
                          <td>{item?.strName}</td>
                          <td className="text-right" style={{ width: "120px" }}>
                            {numberWithCommas(
                              Math.round(item?.numPlannedAmount)
                            )}
                          </td>
                          <td className="text-right" style={{ width: "120px" }}>
                            {numberWithCommas(Math.round(item?.numAmount))}
                          </td>
                          {/* <td className="text-right" style={{ width: "120px" }}>
                          {_formatMoney(
                            item?.numPlannedAmount - item?.numAmount
                          )}
                        </td> */}
                        </tr>
                      );
                    } else if (index === rowDto.length - 1) {
                      return (
                        <tr style={{ background: "#e6ecff" }}>
                          <td>{item?.strName}</td>
                          <td className="text-right" style={{ width: "120px" }}>
                            {numberWithCommas(
                              Math.round(item?.numPlannedAmount)
                            )}
                          </td>
                          <td className="text-right" style={{ width: "120px" }}>
                            <div className="d-flex justify-content-around align-items-center">
                              <div className="mr-5">
                                <button
                                  className="btn btn-primary"
                                  disabled={
                                    !isLastDayOfMonth(values?.toDate) ||
                                    !values?.businessUnit?.value ||
                                    !values?.conversionRate ||
                                    !item?.numAmount
                                  }
                                  onClick={() => {
                                    sendToAssetLiability(
                                      `/fino/BudgetFinancial/CreateAssetLiabilityPlan`,
                                      [
                                        {
                                          partName:
                                            "UpdateFromProjectedCashflowStatement",
                                          businessUnitId:
                                            values?.businessUnit?.value,
                                          dteDate: values?.toDate,
                                          conversionRate: +values?.conversionRate,
                                          yearName: "yyyy-yyyy",
                                          initialAmount: +item?.numAmount,
                                          actionBy: profileData?.userId,
                                        },
                                      ],
                                      null,
                                      true
                                    );
                                  }}
                                >
                                  Send to Asset/Liability
                                </button>
                              </div>
                              <div>
                                {numberWithCommas(Math.round(item?.numAmount))}
                              </div>
                            </div>
                          </td>
                          {/* <td className="text-right" style={{ width: "120px" }}>
                          {_formatMoney(
                            item?.numPlannedAmount - item?.numAmount
                          )}
                        </td> */}
                        </tr>
                      );
                    }
                    return (
                      <tr>
                        <td colSpan="4">{item?.strName}</td>
                      </tr>
                    );
                  case null:
                    return (
                      <tr>
                        <td colSpan="4" style={{ height: "15px" }}></td>
                      </tr>
                    );

                  default:
                    return (
                      <tr>
                        <td
                          style={{
                            padding: "0 0 0 5px",
                            fontWeight: "normal",
                          }}
                        >
                          {item?.strName}
                        </td>
                        <td
                          className="pr-1"
                          style={{
                            border: "1px solid black",
                            textAlign: "right",
                            width: "120px",
                            padding: "0",
                            fontWeight: "normal",
                          }}
                        >
                          {numberWithCommas(Math.round(item?.numPlannedAmount))}
                        </td>
                        <td
                          className="pr-1"
                          style={{
                            border: "1px solid black",
                            textAlign: "right",
                            width: "120px",
                            padding: "0",
                            fontWeight: "normal",
                          }}
                        >
                          {numberWithCommas(Math.round(item?.numAmount))}
                        </td>
                        {/* <td
                        className="pr-1"
                        style={{
                          border: "1px solid black",
                          textAlign: "right",
                          width: "120px",
                          padding: "0",
                          fontWeight: "normal",
                        }}
                      >
                        {_formatMoney(item?.numPlannedAmount - item?.numAmount)}
                        1
                      </td> */}
                      </tr>
                    );
                }
              })}
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectedCashFlow;
