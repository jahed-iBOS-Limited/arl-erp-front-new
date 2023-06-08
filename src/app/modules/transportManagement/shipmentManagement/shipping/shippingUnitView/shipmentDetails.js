import React, { useState } from "react";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import IViewModal from "../../../../_helper/_viewModal";
import { toast } from "react-toastify";

const ShipmentDetailsInfo = ({ rowDto }) => {
  const [open, setOpen] = useState(false);
  const [slabRates, setSlabRates] = useState([]);
  return (
    <div>
      <table className="table table-striped global-table ">
        <thead>
          <tr>
            <th>SL</th>
            <th>Delivery Code</th>
            <th>Sold to Partner</th>
            <th>Ship to Partner</th>
            <th>ShipPoint</th>
            <th>Transport Zone</th>
            <th>Address</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Labour cost</th>
            <th>Handling cost</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.map((itm, i) => {
            return (
              <tr key={i}>
                <td className="text-center"> {i + 1}</td>
                <td> {itm?.deliveryCode}</td>
                <td> {itm?.soldToPartnerName}</td>
                <td> {itm?.shipToPartnerName}</td>
                <td> {itm?.shipPointName}</td>
                <td> {itm?.transportZoneName}</td>
                <td> {itm?.address}</td>
                <td> {itm?.itemName}</td>
                <td className="text-right"> {itm?.quantity}</td>
                <td className="text-right"> {itm?.labourCost}</td>
                <td className="text-right"> {itm?.handlingCost}</td>
                <td className="text-center">
                  <ICon
                    title={"See Slab Program"}
                    onClick={() => {
                      if (itm?.slabProgram?.length > 0) {
                        setSlabRates(itm?.slabProgram);
                        setOpen(true);
                      } else {
                        toast.warn("Slab Program not found!");
                      }
                    }}
                  >
                    <i class="fas fa-sitemap"></i>
                  </ICon>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <IViewModal
        modelSize={"md"}
        show={open}
        onHide={() => setOpen(false)}
        title={"Slab Programs"}
      >
        <table className="table table-striped global-table ">
          <thead>
            <tr>
              <th>SL</th>
              <th>Slab Range</th>
              <th>Slab Rate</th>
            </tr>
          </thead>
          <tbody>
            {slabRates?.map((itm, i) => {
              return (
                <tr key={i}>
                  <td className="text-center"> {i + 1}</td>
                  <td> {itm?.slabRange}</td>
                  <td className="text-right"> {itm?.slabRate}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </IViewModal>
    </div>
  );
};

export default ShipmentDetailsInfo;
