import React, { useState } from "react";
import IViewModal from "../../../../_helper/_viewModal";

const ShipmentDetailsInfo = ({ rowDto }) => {
  const [open, setOpen] = useState(false);
  const [slabRates, ] = useState([]);
  return (
    <div className="table-responsive">
      <table className="table table-striped global-table ">
        <thead>
          <tr>
            <th rowSpan={2}>SL</th>
            <th rowSpan={2}>Delivery Code</th>
            <th rowSpan={2}>ShipPoint</th>
            <th rowSpan={2}>Transport Zone</th>
            <th rowSpan={2}>Distance/km</th>
            <th colSpan={2}>Range</th>
            <th colSpan={2}>Rates</th>
            <th rowSpan={2}>Labour cost</th>
            <th rowSpan={2}>Handling cost</th>
            {/* <th>Action</th> */}
          </tr>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>7 Ton</th>
            <th>20 Ton</th> 
          </tr>
        </thead>
        <tbody>
          {rowDto?.map((itm, i) => {
            return (
              <tr key={i}>
                <td className="text-center"> {i + 1}</td>
                <td> {itm?.deliveryCode}</td>
                <td> {itm?.shipPointName}</td>
                <td> {itm?.transportZoneName}</td>
                <td> {itm?.distanceKM}</td>
                <td> {itm?.numRangeFrom}</td>
                <td> {itm?.numRangeTo}</td>
                <td> {itm?.num7TonRate}</td>
                <td> {itm?.num20TonRate}</td>
                <td className="text-right"> {itm?.labourCost}</td>
                <td className="text-right"> {itm?.handlingCost}</td>
                {/* <td className="text-center">
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
                </td> */}
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
       <div className="table-responsive">
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
       </div>
      </IViewModal>
    </div>
  );
};

export default ShipmentDetailsInfo;
