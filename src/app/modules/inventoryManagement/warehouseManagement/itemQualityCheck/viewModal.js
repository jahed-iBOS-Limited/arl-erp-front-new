import React, { useEffect } from "react";
import Loading from "../../../_helper/_loading";
import CommonTable from "../../../_helper/commonTable";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

export default function QualityCheckViewModal({ singleData }) {
  const [modalData, getModalData, loadModalData] = useAxiosGet();
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
            margin:"30px 0px",
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
      <CommonTable headersData={["Parameter","Standard Value(%)","Actual Value(%)","System Deduction","Manual Deduction","Remarks"]}>
            <tbody>
                {
                    modalData?.rowData?.map((item,index)=>(
                        <tr key={index}>
                            <td className="text-center">{item?.parameterName}</td>
                            <td className="text-center">{item?.standardValue}</td>
                            <td className="text-center">{item?.actualValue}</td>
                            <td className="text-center">{item?.systemDeduction}</td>
                            <td className="text-center">{item?.manualDeduction}</td>
                            <td className="text-center">{item?.remarks}</td>
                        </tr>
                    ))
                }
            </tbody>
        </CommonTable>
    </div>
  );
}
