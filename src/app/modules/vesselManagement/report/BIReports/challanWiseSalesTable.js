import React from "react";
import ICustomTable from "../../../chartering/_chartinghelper/_customTable";
import { _dateFormatter } from "../../../_helper/_dateFormate";

const headers = [
  { name: "SL", style: { minWidth: "30px" } },
  { name: "Challan Code", style: { minWidth: "100px" } },
  { name: "Mother Vessel", style: { minWidth: "100px" } },
  { name: "Program No", style: { minWidth: "60px" } },
  { name: "Sold to Partner", style: { minWidth: "120px" } },
  { name: "Ship to Partner", style: { minWidth: "120px" } },
  { name: "Address", style: { minWidth: "150px" } },
  { name: "Delivery Date", style: { minWidth: "90px" } },
  { name: "ShipPoint", style: { minWidth: "120px" } },
  { name: "Quantity", style: { minWidth: "60px" } },
  { name: "Quantity (ton)", style: { minWidth: "60px" } },
  { name: "Local Revenue Rate", style: { minWidth: "40px" } },
  { name: "International Revenue Rate", style: { minWidth: "40px" } },
  { name: "Transport Revenue Rate", style: { minWidth: "40px" } },
  { name: "Item Price", style: { minWidth: "50px" } },
  { name: "Amount", style: { minWidth: "30px" } },
];

export default function ChallanWiseSalesReport({ obj }) {
  const { rowData } = obj;
  return (
    <div>
      {rowData?.length > 0 && (
        <ICustomTable ths={headers} scrollable={true}>
          {rowData?.map((item, i) => {
            return (
              <tr key={item?.deliveryCode + i}>
                <td>{i + 1}</td>
                <td>{item?.deliveryCode}</td>
                <td>{item?.motherVesselName}</td>
                <td>{item?.program}</td>
                <td>{item?.soldToPartnerName}</td>
                <td>{item?.shipToPartnerName}</td>
                <td>{item?.shipToPartnerAddress}</td>
                <td>{_dateFormatter(item?.deliveryDate)}</td>
                <td>{item?.shipPointName}</td>
                <td className="text-right">{item?.quantity}</td>
                <td className="text-right">{item?.quantityTon}</td>
                <td className="text-right">{item?.localRevenueRate}</td>
                <td className="text-right">{item?.internationalRevenueRate}</td>
                <td className="text-right">{item?.transportRevenueRate}</td>
                <td className="text-right">{item?.itemPrice}</td>
                <td className="text-right">{item?.salesValue}</td>
              </tr>
            );
          })}
        </ICustomTable>
      )}
    </div>
  );
}
