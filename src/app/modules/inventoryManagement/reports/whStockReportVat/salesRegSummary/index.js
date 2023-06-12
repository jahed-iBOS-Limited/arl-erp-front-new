import React, { useMemo } from "react";
import { _fixedPointVat } from "../../../../_helper/_fixedPointVat";
const SalesRegSummary = ({ rowDto }) => {
  const totalSum = useMemo(() => {
    if (rowDto?.length > 0) {
      return rowDto.reduce(
        (acc, cur) => {
          return {
            ProduceQty: acc.ProduceQty + cur.ProduceQty,
            SalesQty: acc.SalesQty + cur.SalesQty,
            ProduceValue: acc.ProduceValue + cur.ProduceValue,
            SalesVal: acc.SalesVal + cur.SalesVal,
          };
        },
        {
          ProduceQty: 0,
          SalesQty: 0,
          ProduceValue: 0,
          SalesVal: 0,
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
              <div className="left mr-3">
                <p className="mb-0">
                  <span style={{ width: "150px", display: "inline-block" }}>
                    Total opening quantity
                  </span>
                  : <b>{_fixedPointVat(rowDto?.[0]?.OpeningQty, 3, true)}</b>
                </p>

                <p className="mb-0">
                  <span style={{ width: "150px", display: "inline-block" }}>
                    Total procuction quantity
                  </span>
                  : <b>{_fixedPointVat(totalSum?.ProduceQty, 3, true)}</b>
                </p>
                <p className="mb-0">
                  <span style={{ width: "150px", display: "inline-block" }}>
                    Total stock quantity
                  </span>
                  :{" "}
                  <b>
                    {_fixedPointVat(
                      rowDto?.[0]?.OpeningQty + totalSum?.ProduceQty,
                      3, true
                    )}
                  </b>
                </p>

                <p className="mb-0">
                  <span style={{ width: "150px", display: "inline-block" }}>
                    Total sales quantity
                  </span>
                  : <b>{_fixedPointVat(totalSum?.SalesQty, 3, true)}</b>
                </p>

                <p className="mb-0">
                  <span style={{ width: "150px", display: "inline-block" }}>
                    Total closing quantity
                  </span>
                  :{" "}
                  <b>
                    {_fixedPointVat(
                      rowDto?.[0]?.OpeningQty +
                        totalSum?.ProduceQty -
                        totalSum?.SalesQty,
                      3, true
                    )}
                  </b>
                </p>
              </div>
              <div className="right ">
                <p className="mb-0">
                  <span style={{ width: "150px", display: "inline-block" }}>
                    Total opening value
                  </span>
                  : <b>{_fixedPointVat(rowDto?.[0]?.OpeningVal, null, true)}</b>
                </p>

                <p className="mb-0">
                  <span style={{ width: "150px", display: "inline-block" }}>
                    Total procuction value
                  </span>
                  : <b>{_fixedPointVat(totalSum?.ProduceValue, null, true)}</b>
                </p>
                <p className="mb-0">
                  <span style={{ width: "150px", display: "inline-block" }}>
                    Total stock value
                  </span>
                  :{" "}
                  <b>
                    {_fixedPointVat(
                      rowDto?.[0]?.OpeningVal + totalSum?.ProduceValue, null, true
                    )}
                  </b>
                </p>

                <p className="mb-0">
                  <span style={{ width: "150px", display: "inline-block" }}>
                    Total sales value
                  </span>
                  : <b>{_fixedPointVat(totalSum?.SalesVal, null, true)}</b>
                </p>

                <p className="mb-0">
                  <span style={{ width: "150px", display: "inline-block" }}>
                    Total closing value
                  </span>
                  :{" "}
                  <b>
                    {_fixedPointVat(
                      rowDto?.[0]?.OpeningVal +
                        totalSum?.ProduceValue -
                        totalSum?.SalesVal,
                         null, true
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

export default SalesRegSummary;
