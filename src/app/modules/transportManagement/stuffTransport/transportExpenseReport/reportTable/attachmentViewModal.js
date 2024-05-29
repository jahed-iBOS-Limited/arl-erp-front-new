import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import NewIcon from "../../../../_helper/_helperIcons/newIcon";
import Loading from "../../../../_helper/_loading";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

export default function AttachmentViewModal({ singleData }) {
  const [
    attachmentData,
    getAttachmentData,
    loadingAttachmentData,
  ] = useAxiosGet();
  const dispatch = useDispatch();
  useEffect(() => {
    getAttachmentData(
      `/mes/VehicleLog/GetStuffTripExpenseAttachmentList?tripId=${singleData?.intTripId}`
    );
  }, []);
  return (
    <>
      {loadingAttachmentData && <Loading />}
      <div style={{ marginTop: "20px" }} className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th className="text-center">Trip Code</th>
              <th className="text-center">Attachment</th>
            </tr>
          </thead>
          <tbody>
            {attachmentData?.length > 0 &&
              attachmentData?.map((item, index) => (
                <tr>
                  <td className="text-center">{item?.tripCode}</td>
                  <td className="text-center">
                    {item?.attachment ? (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            getDownlloadFileView_Action(item?.attachment)
                          );
                        }}
                      >
                        <NewIcon title="Show Attachment" />
                      </span>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
