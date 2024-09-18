import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router";
import ICard from "../../../_helper/_card";
import AttachmentUploaderNew from "../../../_helper/attachmentUploaderNew";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { toast } from "react-toastify";
import { marineBaseUrlPythonAPI } from "../../../../App";

export default function VoyageLicenseFlagAttachment({ values, setFieldValue, item, getGridData, setVoyageLicenseFlagShow, setIsShowMailModal }) {
  const [loading, setLoading] = React.useState(false);
  const { state: landingData } = useLocation();
  const [attachment, setAttachment] = useState(null);
  const [, voyageLicenseFlagWaiverMailSend] = useAxiosPost();

  let { selectedBusinessUnit, profileData } = useSelector(
    (state) => {
      return {
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        profileData: state.authData.profileData,
      };
    },
    { shallowEqual }
  );

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
                      // voyageLicenseFlagWaiverMailSend(
                      //   `${marineBaseUrlPythonAPI}/automation/voyage_license_flag_waiver_email_sender`,
                      //   { 
                      //     intId: item?.intId,
                      //     attachmenturl: 'https://erp.ibos.io/domain/Document/DownlloadFile?id=' + attachment,
                      //   },
                      //   () => {
                      //     getGridData();
                      //     setVoyageLicenseFlagShow(false);
                      //   },
                      //   true
                      // );
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
