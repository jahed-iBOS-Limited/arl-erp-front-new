/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import ICustomTable from "../../../../_helper/_customTable";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import useAxiosGet from "../customHooks/useAxiosGet";

const ths = ["SL", "Attachment"];

export default function AttachmentView({ singleData, orderTypeId }) {
  const dispatch = useDispatch();
  const [rowData, getRowData, loading] = useAxiosGet();

  useEffect(() => {
    getRowData(
      `/procurement/PurchaseOrder/GetPurchaseOrderInformationByPOtoPrint_Id?PurchaseOrderId=${singleData?.purchaseOrderId}&OrderTypeId=${singleData?.purchaseOrderTypeId ? singleData?.purchaseOrderTypeId: orderTypeId}`
    );
  }, []);

  return (
    <div>
      {loading && <Loading />}
      <div className="text-right">
        <ICustomTable ths={ths}>
          {rowData?.[0]?.objAttachmentListDTO?.length > 0 &&
            rowData?.[0]?.objAttachmentListDTO?.map((item, index) => (
              <tr key={index}>
                <td> {index + 1} </td>
                <td className="text-center">
                  <IView
                    title={"Attachment"}
                    classes={"text-primary"}
                    clickHandler={() => {
                      dispatch(getDownlloadFileView_Action(item?.imageId));
                    }}
                  />
                </td>
              </tr>
            ))}
        </ICustomTable>
      </div>
    </div>
  );
}
