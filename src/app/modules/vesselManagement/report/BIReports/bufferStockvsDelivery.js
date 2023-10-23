import React from "react";
import { _fixedPoint } from "../../../_helper/_fixedPoint";

export default function BufferStockvsDelivery({ rowData }) {
  let strShippointnameList = [];
  let matchShippontObj = {
    strShippointname: "",
    ChallanQntTon: 0,
    PendingQntTon: 0,
  };
  return (
    <div className='mt-5'>
      <div className='table-responsive'>
        <table className='table table-striped table-bordered global-table mt-0'>
          <thead>
            <tr>
              <th>Sl</th>
              <th>Delivery Code</th>
              <th>Delivery Code</th>
              <th>ShipPoint Name</th>
              <th>Buffer Name</th>
              <th>Mother Vessel</th>
              <th>Allotment Qnt Ton</th>
              <th>Challan Qnt Ton</th>
              <th>Pending Qnt Ton</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.length > 0 &&
              rowData?.map((item, index) => {
                const prvShipPointSame =
                  item?.strShippointname ===
                  rowData[index + 1]?.strShippointname;
                if (prvShipPointSame) {
                  strShippointnameList.push(item);
                  matchShippontObj = {};
                } else {
                  strShippointnameList.push(item);
                  matchShippontObj = {
                    strShippointname:
                      strShippointnameList?.[0]?.strShippointname,
                    ChallanQntTon: strShippointnameList?.reduce(
                      (acc, curr) => acc + (+curr?.ChallanQntTon || 0),
                      0
                    ),
                    PendingQntTon:
                      strShippointnameList[strShippointnameList?.length - 1]
                        ?.PendingQntTon || 0,
                  };
                  strShippointnameList = [];
                }

                return (
                  <>
                    <tr key={index}>
                      <td className='text-center'>{index + 1}</td>
                      <td>{item?.strSalesOrder}</td>
                      <td>{item?.strDeliveryCode}</td>
                      <td>{item?.strShippointname}</td>
                      <td>{item?.strShipToPartnerName}</td>
                      <td>{item?.strMVesselName}</td>
                      <td className='text-center'>
                        {_fixedPoint(item?.AllotMentQntTon)}
                      </td>
                      <td className='text-center'>
                        {_fixedPoint(item?.ChallanQntTon)}
                      </td>
                      <td className='text-center'>
                        {_fixedPoint(item?.PendingQntTon)}
                      </td>
                    </tr>
                    {matchShippontObj?.strShippointname && (
                      <>
                        <tr
                          style={{
                            backgroundColor: "#ffe9e9",
                          }}
                        >
                          <td colSpan={6}>
                            <strong>
                              {matchShippontObj?.strShippointname}
                            </strong>
                          </td>
                          <td className='text-center'>
                            <strong>
                              {_fixedPoint(matchShippontObj?.ChallanQntTon)}
                            </strong>
                          </td>

                          <td className='text-center'>
                            <strong>
                              {_fixedPoint(matchShippontObj?.PendingQntTon)}
                            </strong>
                          </td>
                        </tr>
                      </>
                    )}
                  </>
                );
              })}
            <tr>
              <td colSpan={7}>
                <strong>Total</strong>
              </td>
              <td className='text-center'>
                <b>
                  {" "}
                  {_fixedPoint(
                    rowData.reduce(
                      (acc, { ChallanQntTon }) => acc + (+ChallanQntTon || 0),
                      0
                    )
                  )}
                </b>
              </td>

              <td className='text-center'></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
