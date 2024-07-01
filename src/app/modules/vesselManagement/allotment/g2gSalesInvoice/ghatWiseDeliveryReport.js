import React from "react";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../_helper/_fixedPoint";
const GhatWiseDeliveryReport = ({ printRef, gridData, buUnName, values }) => {
  return (
    <div ref={printRef}>
      <div>
        <div className="row">
          <div className="col-lg-12 text-center">
            <h4 className="m-0">{buUnName}</h4>
            <p>
              <span>Ghat Wise Delivery Report</span>
              <br />
              <span>{values?.motherVessel?.label}</span>
              <br />
              <span>{values?.item?.label}</span>
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
                  <th>Date</th>
                  <th>Truck No</th>
                  <th>Challan No</th>
                  <th>Quantity(MT)</th>
                  <th>Quantity(BAG)</th>
                  <th>Epmty Bag</th>
                  <th>Destination</th>
                  <th>Receiving Date</th>
                </tr>
              </thead>

              <tbody>
                {gridData?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{_dateFormatter(item?.deliveryDate)}</td>
                    <td>{item?.vehicleRegNo}</td>
                    <td>{item?.deliveryCode}</td>
                    <td className="text-right">
                      {item?.totalDeliveryQuantity}
                    </td>
                    <td className="text-right">{item?.totalDeliveryValue}</td>
                    <td className="text-right">{item?.emptyBag}</td>
                    <td>{item?.shipPointName}</td>
                    <td>
                      {item?.receiveDate
                        ? _dateFormatter(item?.receiveDate)
                        : ""}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4}>Total</td>
                  <td className="text-right">
                    <b>
                      {_fixedPoint(
                        gridData?.reduce((acc, cur) => {
                          return (acc += +cur?.totalDeliveryQuantity || 0);
                        }, 0)
                      )}
                    </b>
                  </td>
                  <td className="text-right">
                    <b>
                      {_fixedPoint(
                        gridData?.reduce((acc, cur) => {
                          return (acc += +cur?.totalDeliveryValue || 0);
                        }, 0)
                      )}
                    </b>
                  </td>
                  <td className="text-right">
                    <b>
                      {_fixedPoint(
                        gridData?.reduce((acc, cur) => {
                          return (acc += +cur?.emptyBag || 0);
                        }, 0)
                      )}
                    </b>
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GhatWiseDeliveryReport;
