import React from "react";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import { _dateFormatter } from "../../../_chartinghelper/_dateFormatter";

const AttachmentModal = ({ taskSelected, fileListModal }) => {
  const dispatch = useDispatch();
  return (
    <>
      <div className="marine-modal-form-card">
        {taskSelected?.VoyageListTypeId && (
          <>
            <div className="marine-form-card-heading">
              <p>{taskSelected?.VoyageListType || "N/A"}</p>
            </div>
            <div className="marine-form-card-content">
              {fileListModal?.map((item, index) => (
                <div key={index}>
                  {
                    item?.TblVoyageChecklistItemList?.length > 0 && (
                      <p style={{margin: "0px", marginTop: "8px"}}><b>Submitted Date: {_dateFormatter(item?.CheckDate)}</b></p>
                    )
                  }
                  {item?.TblVoyageChecklistItemList?.map((file, i) => (
                    <>
                      <p
                        key={i}
                        style={{ color: "#08a5e5", marginBottom: "0", cursor: "pointer" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(getDownlloadFileView_Action(file?.StrAttachmentUrl));
                        }}
                      >
                        {i + 1}. {file?.StrAttachmentUrl || "N/A"}
                      </p>
                    </>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AttachmentModal;
