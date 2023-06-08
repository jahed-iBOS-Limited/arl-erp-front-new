/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router";
import Loading from "../../../_chartinghelper/loading/_loading";
import { getChartererCPData, saveCPClause } from "../helper";
import Form from "./form";

const initData = {
  fileName: "",
  cpData: "",
};

export default function CharterPartyClauseForm() {
  const { type, id } = useParams();
  const [loading, setLoading] = useState(false);
  const [cpData, setCPdata] = useState({});

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    if (id) {
      getChartererCPData({
        accId: profileData?.accountId,
        buId: selectedBusinessUnit?.value,
        reportType: 0,
        docId: id,
        setter: setCPdata,
        setLoading: setLoading,
      });
    } else {
      getChartererCPData({
        accId: profileData?.accountId,
        buId: selectedBusinessUnit?.value,
        reportType: 1,
        docId: 0,
        setter: setCPdata,
        setLoading: setLoading,
      });
    }
  }, [profileData, selectedBusinessUnit, id]);

  const saveHandler = (values, cb) => {
    if (id) {
    } else {
      const data = {
        docId: 0,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        docName: values?.fileName,
        docType: "html",
        varDataFile: values?.cpData,
        isReadOnly: false,
        actionBy: profileData?.userId,
      };
      saveCPClause(data, setLoading, () => {
        cb();
      });
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Form
        title={"CP Clause"}
        initData={initData}
        saveHandler={saveHandler}
        viewType={type}
        cpData={cpData}
      />
    </>
  );
}
