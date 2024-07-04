import React from "react";
import { useDispatch } from "react-redux";
import { amountToWords } from "../../../_helper/_ConvertnumberToWord";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../_helper/_fixedPoint";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
const BillPreparationReport = ({
  printRef,
  gridData,
  buUnName,
  values,
  userPrintBtnClick,
  setFieldValue,
}) => {
  const motherVessel = values?.motherVessel?.label || "";
  const motherVesselName = motherVessel?.split("(")?.[0].trim();

  const totalPrice = gridData?.reduce((acc, cur) => {
    return (acc += +cur?.totalPrice || 0);
  }, 0);
  const dispatch = useDispatch();
  return (
    <>
      <div ref={printRef}>
        <div>
          <div className="row">
            <div className="col-lg-12 text-center">
              <h4 className="m-0">{buUnName}</h4>
              <p>
                <span>
                  Mother Vessel MV: {motherVesselName}({values?.item?.label})
                </span>
                <br />
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Program No: {values?.programNo}, Date:{" "}
                </span>
                <br />
                <span>Bill No: </span>
              </p>
            </div>
            <div className="col-lg-12">
              <p>To, Join-Director (Fertilizer), BADC, Boira, Khulna.</p>
              <p>
                Bill for DAP Fertilizer Clearing & Forwaring (C&F),
                Transportation there of different BADC Godowns,
              </p>
              <p>
                Subject: MV.ALFIOS (DAP Fertilizer) Final Transport Bill Form
                Mongla to different Gudan.
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="scroll-table-auto asset_list">
              <table className="table table-striped table-bordered global-table table-font-size-sm">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>{values?.organization?.label} Godowns Name</th>
                    <th>Invoice No</th>
                    <th>Invoice Date</th>
                    <th>Quantity(MT)</th>
                    <th>Quantity(BAG)</th>
                    <th>Short/Excess</th>
                    <th>Price/Ton(Taka)</th>
                    <th>Taka</th>
                    {!userPrintBtnClick && <th>Action</th>}
                  </tr>
                </thead>

                <tbody>
                  {gridData?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.shipToPartnerName}</td>
                      <td>{item?.invoiceId}</td>
                      <td>{_dateFormatter(item?.invoiceDate)}</td>
                      <td className="text-right">
                        {item?.totalDeliveryQuantityTon}
                      </td>
                      <td className="text-right">
                        {item?.totalDeliveryQuantityBag}
                      </td>
                      <td className="text-right">{item?.shortExcess}</td>
                      <td className="text-right">{item?.revenueRate}</td>
                      <td className="text-right">
                        <b>{item?.totalPrice}</b>
                      </td>
                      {!userPrintBtnClick && (
                        <td>
                          {item?.attachentInvoice && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(
                                  getDownlloadFileView_Action(
                                    item?.attachentInvoice
                                  )
                                );
                              }}
                              className="ml-2"
                              style={{
                                paddingTop: "5px",
                              }}
                            >
                              <i
                                style={{ fontSize: "16px" }}
                                className={`fa pointer fa-eye`}
                                aria-hidden="true"
                              ></i>
                            </span>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4}>
                      <b>Total</b>
                    </td>
                    <td className="text-right">
                      <b>
                        {_fixedPoint(
                          gridData?.reduce((acc, cur) => {
                            return (acc += +cur?.totalDeliveryQuantityTon || 0);
                          }, 0)
                        )}
                      </b>
                    </td>
                    <td className="text-right">
                      <b>
                        {_fixedPoint(
                          gridData?.reduce((acc, cur) => {
                            return (acc += +cur?.totalDeliveryQuantityBag || 0);
                          }, 0)
                        )}
                      </b>
                    </td>
                    <td className="text-right">
                      <b>
                        {_fixedPoint(
                          gridData?.reduce((acc, cur) => {
                            return (acc += +cur?.shortExcess || 0);
                          }, 0)
                        )}
                      </b>
                    </td>
                    <td className="text-right">
                      <b>
                        {_fixedPoint(
                          gridData?.reduce((acc, cur) => {
                            return (acc += +cur?.revenueRate || 0);
                          }, 0)
                        )}
                      </b>
                    </td>
                    <td className="text-right">
                      <b>{_fixedPoint(totalPrice)}</b>
                    </td>
                    {!userPrintBtnClick && <td></td>}
                  </tr>
                  <tr>
                    <td colSpan={userPrintBtnClick ? 10 : 11}>
                      <b>Total (In Word): {amountToWords(totalPrice)}</b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-12">
            <p>
              This bill has been prepared as per contract and if any amount
              wrongly changed had detected by the corporation at any time, the
              corporation will be at liberty to impose discretionary penalty and
              realize the same for a regular bills, security deposit or
              performance guarantee.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
export default BillPreparationReport;
