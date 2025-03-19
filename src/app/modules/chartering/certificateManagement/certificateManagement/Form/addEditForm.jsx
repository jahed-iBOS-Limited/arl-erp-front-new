/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { getVesselDDL } from "../../../helper";
import Loading from "../../../_chartinghelper/loading/_loading";
import { _todayDate } from "../../../_chartinghelper/_todayDate";
import {
  createAndEditCertificate,
  getCertificateDDL,
  getCertificateLanding,
} from "../helper";
import Form from "./form";


const initData = {
  vesselName: "",
  strCertificateTypeName: "",
  strCertificateName: "",
  dteIssueDate: _todayDate(),
  strIssuePlace: "",
  strIssuingAuthority: "",
  dteLastSurvey: _todayDate(),
  dteFromDate: _todayDate(),
  dteToDate: _todayDate(),
  strRemarks: "",
};

export default function CertificateManagementForm() {
  const { type, id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  //  attachment file
  const [attachmentFile, setAttachmentFile] = useState("");

  // State For DDL
  const [vesselDDL, setVesselDDL] = useState([]);
  const [certificateTypeDDL, setCertificateTypeDDL] = useState([]);

  /* State For Row Data All */
  const [singleData, setSingleData] = useState({});

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  console.log("singleData", singleData);
  /* Fetch DDL */
  const getByIdCalled = () => {
    if (id) {
      getCertificateLanding(
        setSingleData,
        "VesselCertificateLanding",
        {
          intAccountId: profileData?.accountId,
          intBusinessUnitId: selectedBusinessUnit?.value,
          intVesselId: 0,
          intCertificateId: 0,
          intCertificateTypeId: 0,
          intVesselCertificateId: +id,
        },
        setLoading,
        () => {},
        id
      );
    }
  };

  useEffect(() => {
    getByIdCalled();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[id])

  useEffect(() => {
    getVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setVesselDDL
    );
    getCertificateDDL(setCertificateTypeDDL, "CertificateTypeDDL", {
      intAccountId: profileData?.accountId,
      intBusinessUnitId: selectedBusinessUnit?.value,
      intCertificateTypeId: 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  /* Save Handler */
  const saveHandler = (values, cb) => {
      /* Create Part */
      const payload = {
        intVesselCertificateId: +id ? +id : 0,
        intAccountId: profileData?.accountId,
        intBusinessUnitId: selectedBusinessUnit?.value,
        intVesselId: values?.vesselName?.value,
        intCertificateTypeId: values?.strCertificateTypeName?.value,
        strCertificateTypeName: values?.strCertificateTypeName?.label,
        intCertificateId: values?.strCertificateName?.value,
        strCertificateName: values?.strCertificateName?.label,
        dteIssueDate: values?.dteIssueDate,
        dteFromDate: values?.dteFromDate || "",
        dteToDate: values?.dteToDate || "",
        strIssuePlace: values?.strIssuePlace,
        strIssuingAuthority: values?.strIssuingAuthority,
        dteLastSurvey: values?.dteLastSurvey,
        dteNextSurvey: _todayDate(),
        strRemarks: values?.strRemarks,
        strAttachment: attachmentFile,
        intActionBy: profileData.actionBy,
        intDateRangeTypeId: "",
        strDateRangeTypeName: "",
      };
      createAndEditCertificate(payload, setLoading, cb);
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        title={
          type === "view"
            ? "View Certificate"
            : type === "edit"
            ? "Edit Certificate"
            : "Create Certificate"
        }
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        viewType={type}
        getByIdCalled={getByIdCalled}
        singleData={singleData}
        id={id}
        /* DDL */
        vesselDDL={vesselDDL}
        certificateTypeDDL={certificateTypeDDL}
        setLoading={setLoading}
        /* Row Data */
        setAttachmentFile={setAttachmentFile}
        attachmentFile={attachmentFile}
      />
    </>
  );
}
