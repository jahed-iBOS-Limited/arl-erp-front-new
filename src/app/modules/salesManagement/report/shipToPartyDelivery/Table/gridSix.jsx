import React from "react";
import ICustomTable from "../../../../_helper/_customTable";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";

const ths = [
  "Sl",
  "Date",
  "SO Number",
  "Challan No",
  "Product Name",
  "UoM",
  "Product Rate",
  "Product Quantity",
  "Amount",
  "Trs. Zone Name",
  "Trs. Zone Rate",
  "Trs. Zone Amount",
  "Handling Rate",
  "Handling Cost",
  "Loading Labour Rate",
  "Loading Labour Cost",
  "Subsidiary Rate",
  "Subsidiary",
  "Grand Amount",
];

const thsWithShipPointAll = [
  "Sl",
  "Date",
  "SO Number",
  "Challan No",
  "Product Name",
  "Shippoint",
  "UoM",
  "Product Rate",
  "Product Quantity",
  "Amount",
  "Trs. Zone Name",
  "Trs. Zone Rate",
  "Trs. Zone Amount",
  "Handling Rate",
  "Handling Cost",
  "Loading Labour Rate",
  "Loading Labour Cost",
  "Subsidiary Rate",
  "Subsidiary",
  "Grand Amount",
];

function TableGirdSix({ rowDto, values }) {
  let GrandQuantity = 0;
  let GrandAmount = 0;
  let totalOfAllGrandAmount = 0;
  let totalSubsidiary = 0;

  return (
    <ICustomTable
      ths={values?.shippointDDL?.label === "All" ? thsWithShipPointAll : ths}
    >
      <>
        {rowDto.map((itmOne) => {
          GrandQuantity += itmOne?.objList?.reduce(
            (acc, cur) => (acc += cur?.deliveryQty),
            0
          );
          GrandAmount += itmOne?.objList?.reduce(
            (acc, cur) => (acc += cur?.deliveryValue),
            0
          );
          return (
            <>
              <tr style={{ background: "#f1dbdb" }}>
                <td
                  colSpan={
                    values?.shippointDDL?.label === "All"
                      ? thsWithShipPointAll.length
                      : ths.length
                  }
                  className="text-left"
                >
                  <b>{itmOne?.customerName}</b>
                </td>
              </tr>

              {itmOne?.objList?.map((itm, i) => {
                let totalGrandAmount =
                  (itm?.transportzoneAmount || 0) +
                  (itm?.handlingCost || 0) +
                  (itm?.loadingLabourCostAmaount || 0);
                totalOfAllGrandAmount += totalGrandAmount;
                totalSubsidiary += itm?.subsidiaryRate * itm?.deliveryQty;
                return (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{_dateFormatter(itm?.deliveryDate)}</td>
                    <td>{itm?.so}</td>
                    <td>{itm?.deliveryCode}</td>
                    <td> {itm?.itemName}</td>
                    {values?.shippointDDL?.label === "All" && (
                      <td>{itm?.shipPointName}</td>
                    )}
                    <td className="text-center">{itm?.uomName}</td>
                    <td className="text-right">
                      {numberWithCommas(_fixedPoint(itm?.itemRate))}
                    </td>
                    <td className="text-right">
                      {numberWithCommas(_fixedPoint(itm?.deliveryQty))}
                    </td>
                    <td className="text-right">
                      {numberWithCommas(_fixedPoint(itm?.deliveryValue))}
                    </td>
                    <td>{itm?.transportZoneName}</td>
                    <td className="text-right">
                      {numberWithCommas(_fixedPoint(itm?.transportzoneRate))}
                    </td>
                    <td className="text-right">
                      {numberWithCommas(_fixedPoint(itm?.transportzoneAmount))}
                    </td>
                    <td className="text-right">
                      {numberWithCommas(_fixedPoint(itm?.handlingRate))}
                    </td>
                    <td className="text-right">
                      {numberWithCommas(_fixedPoint(itm?.handlingCost))}
                    </td>
                    <td className="text-right">
                      {numberWithCommas(_fixedPoint(itm?.loadingLabourRate))}
                    </td>
                    <td className="text-right">
                      {numberWithCommas(
                        _fixedPoint(itm?.loadingLabourCostAmaount)
                      )}
                    </td>
                    <td className="text-right">
                      {numberWithCommas(_fixedPoint(itm?.subsidiaryRate))}
                    </td>
                    <td className="text-right">
                      {numberWithCommas(
                        _fixedPoint(itm?.subsidiaryRate * itm?.deliveryQty)
                      )}
                    </td>
                    <td className="text-right">
                      {numberWithCommas(_fixedPoint(totalGrandAmount))}
                    </td>
                  </tr>
                );
              })}

              <tr className="text-right font-weight-bold">
                <td
                  colSpan={values?.shippointDDL?.label === "All" ? "8" : "7"}
                  className="text-right"
                >
                  Total
                </td>

                <td className="text-right">
                  {Number.isInteger(
                    _fixedPoint(
                      itmOne?.objList?.reduce(
                        (acc, cur) => (acc += cur?.deliveryQty),
                        0
                      )
                    )
                  )
                    ? numberWithCommas(
                        _fixedPoint(
                          itmOne?.objList?.reduce(
                            (acc, cur) => (acc += cur?.deliveryQty),
                            0
                          )
                        )
                      )
                    : _formatMoney(
                        _fixedPoint(
                          itmOne?.objList?.reduce(
                            (acc, cur) => (acc += cur?.deliveryQty),
                            0
                          )
                        )
                      )}
                </td>
                <td className="text-right">
                  {numberWithCommas(
                    _fixedPoint(
                      itmOne?.objList?.reduce(
                        (acc, cur) => (acc += cur?.deliveryValue),
                        0
                      )
                    )
                  )}
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>
                  {" "}
                  {_formatMoney(
                    itmOne?.objList?.reduce(
                      (acc, cur) => (acc += cur?.loadingLabourCostAmaount),
                      0
                    )
                  )}{" "}
                  {/* {_formatMoney(
                    itmOne?.objList?.reduce(
                      (acc, cur) => (acc += cur?.handlingCost),
                      0
                    )
                  )}{" "} */}
                </td>

                <td></td>
                <td>{_fixedPoint(totalSubsidiary, true)}</td>
                <td>
                  {_fixedPoint(totalOfAllGrandAmount, true)}
                  {/* {" "}
                  {_formatMoney(
                    itmOne?.objList?.reduce(
                      (acc, cur) => (acc += cur?.loadingLabourCostAmaount),
                      0
                    )
                  )}{" "} */}
                </td>
                {/* <td></td> */}
              </tr>
            </>
          );
        })}
        <tr>
          <td
            colSpan={values?.shippointDDL?.label === "All" ? "11" : "12"}
            className="text-right"
          >
            <b>Grand Total </b>
          </td>
          <td className="text-right">
            <b>{numberWithCommas(_fixedPoint(GrandQuantity))}</b>
          </td>
          <td className="text-right">
            <b>{numberWithCommas(_fixedPoint(GrandAmount))}</b>
          </td>
          <td colSpan={9}></td>
        </tr>
      </>
    </ICustomTable>
  );
}

export default TableGirdSix;
