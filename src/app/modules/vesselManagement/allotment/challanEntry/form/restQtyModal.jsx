import React from "react";

export default function RestQtyModal({ restQty }) {
  console.log(restQty);
  return (
    <div style={{ margin: "30px 20px" }} className="row">
      <table className="col-lg-12 table table-striped table-bordered bj-table bj-table-landing">
        <thead>
          <tr>
            <th>Report Name</th>
            <th>Qty</th>
            <th>Report Name</th>
            <th>Qty</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Godown Wise Challan Qty Ton</td>
            <td>{restQty?.godownWiseChallanQntTon || 0}</td>
            <td>Vessel Program Qty Ton </td>
            <td>{restQty?.mVesselProgramQntTon || 0}</td>
          </tr>
          <tr>
            <td>Godown Wise Challan Qty Bag</td>
            <td>{restQty?.godownWiseChallanQntBag || 0}</td>
            <td>Vessel Program Qty Bag </td>
            <td>{restQty?.mVesselProgramQntBag || 0}</td>
          </tr>
          <tr>
            <td>Total Allotment Qty Ton</td>
            <td>{restQty?.totalAllotmentQntTon || 0}</td>
            <td>Vessel Challan Qty Ton</td>
            <td>{restQty?.mVesselChallanQntTon || 0}</td>
          </tr>
          <tr>
            <td>Total Allotment Bag</td>
            <td>{restQty?.totalAllotmentQntBag || 0}</td>
            <td>Vessel Challan Qty Bag</td>
            <td>{restQty?.mVesselChallanQntBag || 0}</td>
          </tr>
          <tr>
            <td>Extra Allotment Qty Ton</td>
            <td>{restQty?.extraAllotmentQntTon || 0}</td>
            <td>Rest Vessel Program Qty Ton</td>
            <td>{restQty?.restMVesselProgramQntTon || 0}</td>
          </tr>
          <tr>
            <td>Extra Allotment Qty Bag</td>
            <td>{restQty?.extraAllotmentQntBag || 0}</td>
            <td>Rest Vessel Program Qty Bag</td>
            <td>{restQty?.restMVesselProgramQntBag || 0}</td>
          </tr>
          <tr>
            <td>Rest Allotment Qty Ton</td>
            <td>{restQty?.restAllotmentQntTon || 0}</td>
            <td>Total Unload Qty Ton</td>
            <td>{restQty?.totalUnloadQntTon || 0}</td>
          </tr>
          <tr>
            <td>Rest Allotment Qty Bag</td>
            <td>{restQty?.restAllotmentQntBag || 0}</td>
            <td>Total Unload Qty Bag</td>
            <td>{restQty?.totalUnloadQntBag || 0}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
