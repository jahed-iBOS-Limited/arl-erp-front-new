/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router";
import Loading from "../../../../_helper/_loading";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Form from "./form";

const initData = {
  channel: "",
  region: "",
  area: "",
  territory: "",
  type: "",
  name: "",
  address: "",
  contactNumber: "",
  email: "",
  nidNumber: "",
  birthDate: "",
  projectStatus: "",
  storiedType: "",
  startDate: "",
  approximateEndDate: "",
  usingBrand: "",
};

export default function HomeBuildersInfoEntryForm() {
  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const { type } = useParams();
  const [objProps] = useState({});
  const [, postData, isLoading] = useAxiosPost();
  const [uploadedImage, setUploadedImage] = useState([]);

  const saveHandler = (values, cb) => {
    const payload = {
      intPeopleId: 0,
      intAccountId: accId,
      intBusinessUnitId: buId,
      strName: values?.name,
      strPresentAddress: values?.address,
      strContactNumber: values?.contactNumber,
      intTypeId: values?.type?.value,
      strTypeName: values?.type?.label,
      strEmail: values?.email,
      dteBirthDate: values?.birthDate,
      intActionBy: userId,
      intTerritoryId: values?.territory?.value,
      strAttachment: uploadedImage[0]?.id,
      strNationalId: values?.nidNumber,
      strProjectStatus: values?.projectStatus,
      strStroyedTye: values?.storiedType?.label,
      dteStartDate: values?.startDate,
      dteEndDate: values?.approximateEndDate,
      strUsingBrand: values?.usingBrand,
    };

    postData(
      `/oms/SitePeopleInfos/createIndividualHomeBuildersInfo`,
      payload,
      () => {
        cb();
      },
      true
    );
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          viewType={type}
          initData={initData}
          saveHandler={saveHandler}
          setUploadedImage={setUploadedImage}
        />
      </div>
    </>
  );
}
