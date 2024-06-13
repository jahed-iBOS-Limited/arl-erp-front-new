import React, { useState } from "react";
import Loading from "../../../_helper/_loading";
import { useHistory } from "react-router-dom";
import { useParams } from "react-router";
import Form from "./form";
import { _todayDate } from "../../../_helper/_todayDate";
import { shallowEqual, useSelector } from "react-redux";
const initData = {
  vesselType: "",
  vessel: "",
  strCertificateName: "",
  date: _todayDate(),
  vesselPosition: "",
  title: "",
  category: "",
  type: "",
};
export default function CreateEditVesselAudit() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  const { type, id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [singleData, setSingleData] = useState({});

  const getByIdCalled = () => {
    if (id) {
      //   getCertificateLanding(
      //     setSingleData,
      //     "VesselCertificateLanding",
      //     {
      //       intAccountId: profileData?.accountId,
      //       intBusinessUnitId: selectedBusinessUnit?.value,
      //       intVesselId: 0,
      //       intCertificateId: 0,
      //       intCertificateTypeId: 0,
      //       intVesselCertificateId: +id,
      //     },
      //     setLoading,
      //     () => {},
      //     id
      //   );
    }
  };

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
      //   strAttachment: attachmentFile,
      intActionBy: profileData.actionBy,
      intDateRangeTypeId: "",
      strDateRangeTypeName: "",
    };
    // createAndEditCertificate(payload, setLoading, cb);
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
        vesselDDL={[]}
        certificateTypeDDL={[]}
        setLoading={setLoading}
        /* Row Data */
      />
    </>
  );
}
