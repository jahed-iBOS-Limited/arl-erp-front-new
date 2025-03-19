import React from "react";
// import IView from "../../../_helper/_helperIcons/_view";
import { useDispatch } from "react-redux";
import IView from "../../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
// import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";

const AttachmentListTable = ({ attachmentItemList }) => {
  const dispatch = useDispatch();
  return (
    <div>
      <h6 className="text-center">Attachment List</h6>
      <table className="table table-striped table-bordered bj-table bj-table-landing">
        <thead>
          <tr>
            <th>SL</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {attachmentItemList?.length > 0 &&
            attachmentItemList?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className="text-center">
                  <IView
                    title="View Attachment"
                    clickHandler={() => {
                      dispatch(getDownlloadFileView_Action(item));
                    }}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttachmentListTable;
