import React from "react";
import { useDispatch } from "react-redux";
import IDelete from "./../../../../_helper/_helperIcons/_delete";
import IView from "./../../../../_helper/_helperIcons/_view";
import InputField from "./../../../../_helper/_inputField";
import { getMultipleFileView_Action } from "./../../../../_helper/_redux/Actions";

function AttachmentGrid({
  values,
  setOpen,
  setAttachmentGridFunc,
  attachmentGrid,
  uploadImageTwo,
  removerAttachmentGridRow,
}) {
  const dispatch = useDispatch();


  return (
    <div className="col-lg-6">
      <h5 className="mt-1">File Attachment</h5>
      <div className="row global-form">
        <div className="col-lg-5">
          <label>Reason</label>
          <InputField
            value={values?.reason}
            name="reason"
            placeholder="Reason"
            type="text"
          />
        </div>
        <div className="col-lg-3 mt-5">
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => setOpen({ type: "attachMentGrid", isOpen: true })}
          >
            Attachment
          </button>
        </div>
        <div className="col-lg-3 mt-5">
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => {
              setAttachmentGridFunc(values);
            }}
            disabled={!values?.reason || !uploadImageTwo?.[0]?.id}
          >
            Add
          </button>
        </div>
      </div>
      <div className="table-responsive">
      <table className={"table global-table"}>
        <thead>
          <tr>
            <th style={{ width: "50px" }}>SL</th>
            <th style={{ width: "350px" }}>Resion</th>
            <th>Attachment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {attachmentGrid?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item?.reason}</td>
              <td className="text-center">
                {" "}
                {item?.attachmentFileId?.length > 0 && (
                  <IView
                    clickHandler={() => {
                      dispatch(
                        getMultipleFileView_Action(item?.attachmentFileId)
                      );
                    }}
                  />
                )}
              </td>
              <td className="text-center">
                <IDelete remover={removerAttachmentGridRow} id={index} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default AttachmentGrid;
