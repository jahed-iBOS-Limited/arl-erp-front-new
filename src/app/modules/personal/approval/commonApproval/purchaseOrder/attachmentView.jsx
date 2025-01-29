import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import IView from "../../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";

export default function AttachmentView({ attachmentModalInfo }) {
  const { purchaseOrderId, orderTypeId } = attachmentModalInfo || {};
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [rowData, getRowData, rowDataLoader] = useAxiosGet();

  useEffect(() => {
    getRowData(
      `/procurement/PurchaseOrder/GetPurchaseOrderInformationByPOtoPrint_Id?PurchaseOrderId=${purchaseOrderId}&OrderTypeId=${orderTypeId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {(rowDataLoader || isLoading) && <Loading />}
      <div className="text-right">
       <div className="table-responsive">
       <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>SL</th>
              <th>Attachment</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.[0]?.objAttachmentListDTO?.length > 0 &&
              rowData?.[0]?.objAttachmentListDTO?.map((item, index) => (
                <tr key={index}>
                  <td> {index + 1} </td>
                  <td className="text-center">
                    <IView
                      title={"Attachment"}
                      classes={"text-primary"}
                      clickHandler={() => {
                        dispatch(
                          getDownlloadFileView_Action(item?.imageId, null, null, setIsLoading)
                        );
                      }}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
       </div>
      </div>
    </>
  );
}
