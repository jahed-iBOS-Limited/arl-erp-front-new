/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import Loading from "../../../_chartinghelper/loading/_loading";
import { createCertificateName, getCertificateDDL, getCertificateLanding } from "../helper";

import Form from "./form";


const date = new Date();

const initData = {
  strCertificateName: "",
  strCertificateTypeName: "",
  strDateRangeType: "",
};

export default function CertificateNameForm() {
  const { type, id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  // State For DDL
  const [certificateTypeDDL,setCertificateTypeDDL] = useState([]);

  /* State For Row Data All */
  const [singleData, setSingleData] = useState({});

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const getByIdCalled = () => {
    if (id) {
      getCertificateLanding(
        setSingleData,
        "CertificateLanding",
        {
          intAccountId: profileData?.accountId,
          intBusinessUnitId: selectedBusinessUnit?.value,
          intVesselId: 0,
          intCertificateId: +id,
          intCertificateTypeId: 0,
          intVesselCertificateId: 0,
        },
        setLoading,
        () => {},
        id
      );
    }
  };
  useEffect(() => {
    getByIdCalled()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /* Fetch DDL */
  useEffect(() => {
    getCertificateDDL(setCertificateTypeDDL, "CertificateTypeDDL",{
      intAccountId: profileData?.accountId,
      intBusinessUnitId: selectedBusinessUnit?.value,
      intCertificateTypeId: 0,
    });
  }, [profileData, selectedBusinessUnit]);

  /* Save Handler */
  const saveHandler = (values, cb) => {
      /* Create Part */
      const payload = {
        intVesselCertificateId: 0,
        intAccountId: profileData?.accountId,
        intBusinessUnitId: selectedBusinessUnit?.value,
        intVesselId: 0,
        intCertificateTypeId: values?.strCertificateTypeName?.value,
        strCertificateTypeName: values?.strCertificateTypeName?.label,
        intCertificateId: +id ? +id : 0,
        strCertificateName: values?.strCertificateName,
        strIssuePlace: "",
        strIssuingAuthority: "",
        strRemarks: "",
        strAttachment: "",
        intActionBy: profileData.actionBy,
        intDateRangeTypeId: values?.strDateRangeType?.value || "",
        strDateRangeTypeName: values?.strDateRangeType?.label || "",
      };
      createCertificateName(payload, setLoading, cb);
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
        id={id}
        /* DDL */
        certificateTypeDDL={certificateTypeDDL}
        setLoading={setLoading}
        /* Row Data */
      />
    </>
  );
}
