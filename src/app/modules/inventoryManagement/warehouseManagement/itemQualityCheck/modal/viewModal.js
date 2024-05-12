import React, { useEffect } from "react";
import Loading from "../../../../_helper/_loading";
import CommonTable from "../../../../_helper/commonTable";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { _numbering } from "../helper";

export default function QualityCheckViewModal({ singleData }) {
  const [modalData, getModalData, loadModalData] = useAxiosGet();
  let totalSystemDeduction = 0;
  useEffect(() => {
    getModalData(
      `/mes/QCTest/GetItemQualityCheckDataById?qualityCheckId=${singleData?.qualityCheckId}`
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);
  return (
    <div>
      {loadModalData && <Loading />}
      <div
        style={{
          margin: "30px 0px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div>
            <strong> Supplier Name:{modalData?.supplierName}</strong>
          </div>
          <div>
            <strong> Item Name:{modalData?.itemName}</strong>
          </div>
          <div>
            <strong> Deduct :{modalData?.deductionPercentage} %</strong>
          </div>
          <div>
            <strong> Net Weight :{modalData?.netWeight} </strong>
          </div>
          <div>
            <strong> Get Entry Code :{modalData?.entryCode} </strong>
          </div>
        </div>
        <div>
          <div>
            <strong> Address :{modalData?.supplierAddress} </strong>
          </div>
          <div>
            <strong> Item Type :{modalData?.itemType} </strong>
          </div>
          <div>
            <strong>Status :{modalData?.status} </strong>
          </div>
          <div>
            <strong>Date :{modalData?.date} </strong>
          </div>
          <div>
            <strong>Vehicle No :{modalData?.vehicleNo} </strong>
          </div>
          <div>
            <strong>Po No :{modalData?.purchaseOrderCode} </strong>
          </div>
        </div>
      </div>
      <div>
        <p><strong>Bag Qty :{modalData?.bagQty}</strong> </p>
        <p><strong>Net Weight :{modalData?.netWeight}</strong> </p>
        <p><strong>Per Bag:{modalData?.kgPerBag}</strong> </p>
        <p><strong>Deduct Qty:{modalData?.deductionQuantity}</strong> </p>
        <p><strong>Unload Deduct :{modalData?.unloadedDeductionQuantity}</strong> </p>
        <p><strong>Total Actual Qty:{modalData?.actualQuantity}</strong> </p>
      </div>
      {
         modalData?.headerDetailsList?.map((parentItem, parentIndex)=>(
          <CommonTable  headersData={[
            "Sl",
            "Item Name",
            "UOM",
            "QC Qty(Bag)",
            "QC Qty",
            "Deduct %",
            "Deduct Qty",
            "Unload Deduct",
            "Actual Qty",
            "Remarks",
          ]}>
            <tbody key={parentIndex}>
                <tr>
                <td className="text-center">{_numbering(parentIndex + 1)}</td>
                <td className="text-center">{modalData?.itemName}</td>
                <td className="text-center">{modalData?.uomName}</td>
                <td className="text-center">{parentItem?.qcQuantityBag}</td>
                <td className="text-center">{parentItem?.qcQuantity}</td>
                <td className="text-center">
                  {parentItem?.deductionPercentage}
                </td>
                <td className="text-center">{parentItem?.deductionQuantity}</td>
                <td className="text-center">
                  {parentItem?.unloadedDeductionQuantity}
                </td>
                <td className="text-center">{parentItem?.actualQuantity}</td>
                <td className="text-center">{parentItem?.remarks}</td>
               
              </tr>
              {parentItem?.rowList?.length > 0 &&(
                 <tr  style={{ margin: "10px" }}>
                <td colSpan={10}>
                <CommonTable
                   headersData={[
                     "Parameter",
                     "Standard Value",
                     "Actual Value",
                     "System Deduction",
                     "Manual Deduction",
                     "Remarks",
                   ]}
                 >
                   <tbody>
                     {parentItem?.rowList?.map((item, index) => (
                       <tr key={index}>
                         <td>{item?.parameterName}</td>
                         <td>{item?.standardValue}</td>
                         <td>{item?.actualValue}</td>
                         <td>{item?.systemDeduction}</td>
                         <td>{item?.manualDeduction}</td>
                         <td>{item?.remarks}</td>
                       </tr>
                     ))}
                     <tr>
                       <td colSpan={3}>Total</td>
                       <td>{totalSystemDeduction}</td>
                       <td></td>
                       <td></td>
                     </tr>
                   </tbody>
                 </CommonTable>
                </td>
               </tr>
              )}
            </tbody>
          </CommonTable>
         ))
      }
     
    </div>
  );
}
