import React, { useState } from "react";
import { toast } from "react-toastify";
import ICard from "../../../_helper/_card";
import AttachmentUploaderNew from "../../../_helper/attachmentUploaderNew";

export default function VoyageLicenseFlagAttachment({ values, setFieldValue, item, getGridData, setVoyageLicenseFlagShow, setIsShowMailModal }) {
  const [attachment, setAttachment] = useState(null);

  return (
    <>
      <ICard printTitle="" title="">
        {/* Main Row Container */}
        <div className="form-group  global-form row">

          {/* Attachment Row */}
          <div>
            {/* <label className="form-label">Upload Attachment</label> */}
            <AttachmentUploaderNew
              isExistAttachment={values?.voyageFlagLicenseAtt}
              CBAttachmentRes={(attachmentData) => {
                console.log("attachmentData", attachmentData);
                if (Array.isArray(attachmentData)) {
                  setAttachment(attachmentData?.[0]?.id);
                  setFieldValue("voyageFlagLicenseAtt", attachmentData?.[0]?.id);
                }
              }}
            />
          </div>

          {/* Save Button Row */}
          <div className="ml-4">
            <button
              className="btn btn-primary px-1 py-1"
              type="button"
              onClick={() => {
                if (!attachment) {
                  return toast.warn("Please Upload Attachment First");
                }
                setIsShowMailModal(true);
              }}
              disabled={!attachment}
            >
              VOYAGE LICENSE/FLAG WAIVER EMAIL SEND
            </button>
          </div>

        </div>
      </ICard>
    </>
  );
}
