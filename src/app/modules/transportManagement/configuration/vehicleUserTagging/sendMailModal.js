import React, { useState } from "react";
import styles from "./mailModal.module.css";

import moment from "moment";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../_helper/_loading";
import {
  exportToPDF,
  uploadPDF,
} from "../../../shippingOperation/deadWeightPreStowagePlanning/deadWeightPreStowagePlanningChild/helper";
import { generateFileUrl } from "../../../chartering/operation/helper";
import { marineBaseUrlPythonAPI } from "../../../../App";
import { getLetterHead } from "../../../financialManagement/report/bankLetter/helper";
import { shallowEqual, useSelector } from "react-redux";

const SendMailModal = ({ singleItem }) => {
  const { selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [, onSendEmail, loader] = useAxiosPost();

  return (
    <>
      {(loading || loader) && <Loading />}
      <div className="text-right my-2">
        <button
          onClick={async () => {
            const pdfBlob = await exportToPDF(
              "AssetAssignmailModal",
              "vessel_nomination"
            );
            const uploadResponse = await uploadPDF(pdfBlob, setLoading);
            const pdfURL = uploadResponse?.[0]?.id || "";

            const payload = {
              body: `
                        <!DOCTYPE html>
                        <html>
                            <body>
                                <p>Dear ${singleItem?.strEmployeeFullName},</p>
                                <p>
                                    As per decision by Management, this is to inform you that to help the Organization,
                                    a car mentioned in the heading is to be allotted against you with immediate effect.
                                    In this regard, you are hereby advised to receive your <strong>Car</strong> from the Administration Department
                                    at Akij Resource Corporate Office, Tejgaon, Dhaka-1208, at the earliest.
                                </p>
                                <p>
                                    Management expects you will accomplish your duties and responsibilities perfectly and smoothly.
                                </p>
                            </body>
                        </html>
                    `,
              email_list: "shihab.corp@akijcement.com",
              file_path: generateFileUrl(pdfURL) || "",
              receiver: `${singleItem?.strEmail}`,
              subject: `Regarding Allotment of Car (${singleItem?.strVehicleNo ||
                ""})`,
            };

            onSendEmail(
              `${marineBaseUrlPythonAPI}/automation/erp_mail_sender`,
              payload,
              null,
              true
            );
          }}
          className="btn btn-primary"
        >
          Send
        </button>
      </div>
      <div
        className={styles.container}
        id="AssetAssignmailModal"
        style={{ position: "relative" }}
      >
        <div
          style={{
            backgroundImage: `url(${getLetterHead({
              buId: selectedBusinessUnit?.value || 0,
            })})`,
            backgroundRepeat: "no-repeat",
            height: "150px",
            backgroundSize: "cover",
            width: "100%",
          }}
        ></div>

        <div contentEditable={true}>
          <div className={styles.section}>
            <p style={{ marginTop: "15px" }}>Ref: No-AR/HR & Admin/2024/9736</p>
            <p>Date: {moment().format("DD/MM/YYYY")}</p>
          </div>

          <div className={styles.section}>
            <p>{singleItem?.strEmployeeFullName}</p>
            <p>Enroll: {singleItem?.intEmployeeID}</p>
            <p>{singleItem?.strDesignationName}</p>
            <p>{singleItem?.strBusinessUnitName}</p>
          </div>

          <div className={styles.section}>
            <p className={styles.subject}>
              Sub: Regarding Allotment of Car ({singleItem?.strVehicleNo})
            </p>
          </div>

          <div className={styles.section}>
            <p className={styles.mb_10}>
              Dear {singleItem?.strEmployeeFullName},
            </p>
            <p>
              As per decision by Management, this is to inform you that to help
              the Organization, a car mentioned in the heading is to be allotted
              against you with immediate effect. In this regard, you are hereby
              advised to receive your <strong>Car</strong> from the
              Administration Department at Akij Resource Corporate Office,
              Tejgaon, Dhaka-1208, at the earliest.
            </p>
            <p className={styles.mt_10}>
              Management expects you will accomplish your duties and
              responsibilities perfectly and smoothly.
            </p>
          </div>

          <div className={`${styles.section} ${styles.note}`}>
            <p>Note: System generated mail</p>
          </div>
        </div>
        <div
          style={{
            backgroundImage: `url(${getLetterHead({
              buId: selectedBusinessUnit?.value || 0,
            })})`,
            backgroundRepeat: "no-repeat",
            height: "100px",
            backgroundPosition: "left bottom",
            backgroundSize: "cover",
            bottom: "-0px",
            position: "absolte",
            width: "100%",
            left: "0px",
          }}
        ></div>
      </div>
    </>
  );
};

export default SendMailModal;
