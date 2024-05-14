/* eslint-disable react-hooks/exhaustive-deps */
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import Loading from "../../../_chartinghelper/loading/_loading";
import { _formatMoney } from "../../../_chartinghelper/_formatMoney";
import { getVoyageDetails } from "../helper";

const chartererHeaders = [
  { name: "SL" },
  { name: "Charterer Name" },
  { name: "Broker Name" },
  { name: "Broker Commission" },
  { name: "Address Commission" },
  { name: "Total Freight" },
];
const purchaseBunkerHeaders = [
  { name: "SL" },
  { name: "Purchase From" },
  { name: "Company Name" },
  { name: "Item Name" },
  { name: "Item Qty" },
];
const bunkerCostHeaders = [
  { name: "SL" },
  { name: "Purchase From" },
  { name: "Company Name" },
  { name: "Item Name" },
  { name: "Item Qty" },
];

export default function VoyageDetails({ singleRow }) {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getVoyageDetails(singleRow?.voyageId, setLoading, setGridData);
  }, [profileData, selectedBusinessUnit]);

  const { objBunker, objBunkerPurchase, objChtr, objBunkerCost } =
    gridData || {};
  const bunkerInfo = objBunker?.length ? objBunker[0] : {};
  const bunkerCost = objBunkerCost?.length ? objBunkerCost[0] : {};
  const {
    bodLsfo1Qty,
    bodLsfo2Qty,
    bodLsmgoQty,
    borLsfo1Qty,
    borLsfo2Qty,
    borLsmgoQty,
    bunkerSaleLsfo1Qty,
    bunkerSaleLsfo2Qty,
    bunkerSaleLsmgoQty,
    // consumptionLsfo1qty,
    // consumptionLsfo2qty,
    // consumptionLsmgoqty,
  } = bunkerInfo;

  const {
    consmQtyLsfo1,
    consmQtyLsfo2,
    consmQtyLsmgo,
    totalBunkerCost,
  } = bunkerCost;

  return (
    <>
      {loading && <Loading />}
      <div>
        <h5 className="text-center shadow-sm p-3  bg-body rounded">
          Voyage Details
        </h5>
        <div className="row">
          <div className="col-md-6 ">
            <h6>
              <b>Vessel Name & Voyage No: </b>
              {singleRow?.vesselName + " & V" + singleRow?.voyageNo}
            </h6>
            <h6>
              <b>Ship Owner: </b>
              {singleRow?.ownerName}
            </h6>
            <h6>
              <b>Commence Date: </b>
              {moment(singleRow?.voyageStartDate).format("DD-MMM-yyyy, HH:mm")}
            </h6>

            <h6>
              <b>Duration: </b>
              {singleRow?.voyageDurrition}
            </h6>
          </div>
          <div className="col-md-6">
            <h6>
              <b>Ship Type: </b>
              {singleRow?.hireTypeName}
            </h6>
            <h6>
              <b>Voyage Type: </b>
              {singleRow?.voyageTypeName}
            </h6>
            <h6>
              <b>Completion Date: </b>
              {moment(singleRow?.voyageEndDate).format("DD-MMM-yyyy, HH:mm")}
            </h6>
          </div>
        </div>
      </div>
     <div className="table-responsive">
     <table className="table mt-3 bj-table bj-table-landing">
        <thead>
          <tr className="text-left" style={{ backgroundColor: "#dbeafe" }}>
            <td colSpan={chartererHeaders?.length}>
              {" "}
              <b>Charterers</b>{" "}
            </td>
          </tr>
          <tr>
            {chartererHeaders?.map((th, index) => {
              return <th key={index}>{th.name} </th>;
            })}
          </tr>
        </thead>
        <tbody>
          {objChtr?.length > 0 ? (
            objChtr.map((item, index) => {
              return (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{item?.charterName}</td>
                  <td>{item?.brokerName}</td>
                  <td>{item?.brokerCommission || 0}%</td>
                  <td>{item?.addressCommission || 0}%</td>
                  <td className="text-right">
                    {_fixedPoint(item?.totalCargoAmount, true)}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={chartererHeaders.length}>
                <h6 className="pt-2 text-center">No Data Found</h6>{" "}
              </td>
            </tr>
          )}
        </tbody>
      </table>
     </div>

      {/* <h6 className="mt-2 font-weight-bold"></h6> */}
     <div className="table-responsive">
     <table className="table mt-2 bj-table bj-table-landing">
        <thead>
          <tr className="text-left" style={{ backgroundColor: "#dbeafe" }}>
            <td colSpan={12}>
              {" "}
              <b>Bunker Information</b>{" "}
            </td>
          </tr>
          <tr>
            <th colSpan={3}> BOD </th>
            <th colSpan={3}> BOR </th>
            <th colSpan={3}> Bunker Sale </th>
            {/* <th colSpan={3}> Consumption </th> */}
          </tr>
          <tr>
            <th> LSMGO </th>
            <th> LSFO-1 </th>
            <th> LSFO-2 </th>
            <th> LSMGO </th>
            <th> LSFO-1 </th>
            <th> LSFO-2 </th>
            <th> LSMGO </th>
            <th> LSFO-1 </th>
            <th> LSFO-2 </th>
            {/* <th> LSMGO </th>
            <th> LSFO-1 </th>
            <th> LSFO-2 </th> */}
          </tr>
        </thead>
        {objBunker?.length > 0 ? (
          <tbody>
            <tr>
              <td> {bodLsmgoQty} </td>
              <td> {bodLsfo1Qty} </td>
              <td> {bodLsfo2Qty} </td>
              <td> {borLsmgoQty} </td>
              <td> {borLsfo1Qty} </td>
              <td> {borLsfo2Qty} </td>
              <td> {bunkerSaleLsmgoQty} </td>
              <td> {bunkerSaleLsfo1Qty} </td>
              <td> {bunkerSaleLsfo2Qty} </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={12}>
                <h6 className="pt-2 text-center">No Data Found</h6>
              </td>
            </tr>
          </tbody>
        )}
      </table>
     </div>

    <div className="table-responsive">
    <table className="table mt-2 bj-table bj-table-landing">
        <thead>
          <tr className="text-left" style={{ backgroundColor: "#dbeafe" }}>
            <td colSpan={purchaseBunkerHeaders?.length}>
              <b>Bunker Purchase</b>{" "}
            </td>
          </tr>
          <tr>
            {purchaseBunkerHeaders?.map((th, index) => {
              return (
                <th key={index} style={th.style}>
                  {th.name}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {objBunkerPurchase?.length > 0 ? (
            objBunkerPurchase.map((item, index) => {
              return (
                <tr key={index}>
                  <td className="text-center">{index + 1}</td>
                  <td>{item?.purchaseFromName}</td>
                  <td>{item?.companyName}</td>
                  <td>{item?.itemName}</td>
                  <td>{item?.itemQty}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={purchaseBunkerHeaders.length}>
                <h6 className="pt-2 text-center">
                  No purchases were made on this voyage
                </h6>{" "}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
     <div className="table-responsive">
     <table className="table mt-2 bj-table bj-table-landing">
        <thead>
          <tr className="text-left" style={{ backgroundColor: "#dbeafe" }}>
            <td colSpan={bunkerCostHeaders?.length}>
              <b>Bunker Cost & Consumption</b>{" "}
            </td>
          </tr>
          <tr>
            <th colSpan={3}> Consumption </th>
            <th rowSpan={2} className="align-middle">
              {" "}
              Bunker Cost{" "}
            </th>
          </tr>
          <tr>
            <th> LSMGO </th>
            <th> LSFO-1 </th>
            <th> LSFO-2 </th>
          </tr>
        </thead>
        <tbody>
          {objBunkerCost?.length > 0 ? (
            <tr>
              <td> {consmQtyLsmgo} </td>
              <td> {consmQtyLsfo1} </td>
              <td> {consmQtyLsfo2} </td>
              <td className="text-right"> {_formatMoney(totalBunkerCost)} </td>
            </tr>
          ) : (
            <tr>
              <td colSpan={4}>
                <h6 className="pt-2 text-center">No Data Found</h6>{" "}
              </td>
            </tr>
          )}
        </tbody>
      </table>
     </div>
    </>
  );
}
