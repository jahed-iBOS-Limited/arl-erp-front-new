/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import ICustomTable from "../../../../_helper/_customTable";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";

const Attachments = ({ clickRowData }) => {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const [attachments, getAttachments, loading] = useAxiosGet([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (clickRowData) {
      getAttachments(
        `/fino/AdjustmentJournal/GetVoucherAttachment?businessUnitId=${selectedBusinessUnit?.value}&journalTypeId=${clickRowData?.journalTypeId}&code=${clickRowData?.strAccountingJournalCode}&actionBy=${profileData?.userId}`
      );
    }
  }, [clickRowData]);
  return (
    <Card>
      {loading && <Loading />}
      <ModalProgressBar />
      <CardHeader title="Attachments">
        <CardHeaderToolbar></CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <div className="row">
          <div className="col-md-12">
            <ICustomTable ths={["SL", "Reference Code", "Document"]}>
              {Array.isArray(attachments) &&
                attachments.map((item, index) => (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{item?.strReferenceCode}</td>
                    <td>
                      <span
                        onClick={() => {
                          dispatch(
                            getDownlloadFileView_Action(item?.strDocumentId)
                          );
                        }}
                        style={{ color: "blue" }}
                        className="pointer"
                      >
                        {item?.strDocumentId}
                      </span>
                    </td>
                  </tr>
                ))}
            </ICustomTable>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default Attachments;
