import React, { useMemo } from "react";
import { _fixedPointVat } from "../../../../_helper/_fixedPointVat";
const PurchaseRegSummary = ({ rowDto }) => {
  const totalSum = useMemo(() => {
    if (rowDto?.length > 0) {
      return rowDto.reduce(
        (acc, cur) => {
          // // 11
          const calRcvQty =
            cur?.TaxTransactionTypeId === 4 ? 0 : +cur?.RcvQty || 0;
          // //12
          const calWithoutSDvatValue =
            cur?.TaxTransactionTypeId === 4 ? 0 : +cur?.WithoutSDvatValue || 0;

          return {
            RcvQty: acc.RcvQty + (+calRcvQty || 0),
            WithoutSDvatValue:
              acc.WithoutSDvatValue + (+calWithoutSDvatValue || 0),
            IssueQty: acc.IssueQty + (+cur.IssueQty || 0),
            IssueVal: acc.IssueVal + (+cur.IssueVal || 0),
          };
        },
        {
          RcvQty: 0,
          WithoutSDvatValue: 0,
          IssueQty: 0,
          IssueVal: 0,
        }
      );
    }
  }, [rowDto]);
  return (
    <>
      {rowDto?.length > 0 && (
        <div className="row">
          <div className="col-lg-12 purchaseRegistrationTable">
            <div className="d-flex">
              <div className="left mr-4">
                <p className="mb-0">
                  <span style={{ width: "150px", display: "inline-block" }}>
                    Total opening quantity
                  </span>
                  : <b>{_fixedPointVat(rowDto?.[0]?.OpeningQty, 3, true)}</b>
                </p>

                <p className="mb-0">
                  <span style={{ width: "150px", display: "inline-block" }}>
                    Total purchased quantity
                  </span>
                  : <b>{_fixedPointVat(totalSum.RcvQty, 3, true)}</b>
                </p>

                <p className="mb-0">
                  <span style={{ width: "150px", display: "inline-block" }}>
                    Total stock quantity
                  </span>
                  :{" "}
                  <b>
                    {_fixedPointVat(
                      rowDto?.[0]?.OpeningQty + totalSum.RcvQty,
                      3, true
                    )}
                  </b>
                </p>

                <p className="mb-0">
                  <span style={{ width: "150px", display: "inline-block" }}>
                    Total Issue quantity
                  </span>
                  : <b>{_fixedPointVat(totalSum.IssueQty, 3, true)}</b>
                </p>

                <p className="mb-0">
                  <span style={{ width: "150px", display: "inline-block" }}>
                    Total closing quantity
                  </span>
                  :{" "}
                  <b>
                    {_fixedPointVat(
                      rowDto?.[0]?.OpeningQty +
                        totalSum.RcvQty -
                        totalSum.IssueQty,
                      3, true
                    )}
                  </b>
                </p>
              </div>
              <div className="right">
                <p className="mb-0">
                  <span style={{ width: "150px", display: "inline-block" }}>
                    Total opening value
                  </span>
                  : <b>{_fixedPointVat(rowDto?.[0]?.OpeningVal, null , true)}</b>
                </p>

                <p className="mb-0">
                  <span style={{ width: "150px", display: "inline-block" }}>
                    Total purchased value
                  </span>
                  : <b>{_fixedPointVat(totalSum.WithoutSDvatValue, null , true)}</b>
                </p>

                <p className="mb-0">
                  <span style={{ width: "150px", display: "inline-block" }}>
                    Total stock value
                  </span>
                  :{" "}
                  <b>
                    {_fixedPointVat(
                      rowDto?.[0]?.OpeningVal + totalSum.WithoutSDvatValue,null , true
                    )}
                  </b>
                </p>

                <p className="mb-0">
                  <span style={{ width: "150px", display: "inline-block" }}>
                    Total Issue value
                  </span>
                  : <b>{_fixedPointVat(totalSum.IssueVal, null , true)}</b>
                </p>

                <p className="mb-0">
                  <span style={{ width: "150px", display: "inline-block" }}>
                    Total closing value
                  </span>
                  :{" "}
                  <b>
                    {_fixedPointVat(
                      rowDto?.[0]?.OpeningVal +
                        totalSum.WithoutSDvatValue -
                        totalSum.IssueVal, null , true
                    )}
                  </b>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PurchaseRegSummary;
