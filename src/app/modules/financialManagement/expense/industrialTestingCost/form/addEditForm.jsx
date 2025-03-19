import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Form from "./form";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const initData = {
  testDate: _todayDate(),
  testType: "",
  projectType: "",
  projectLocation: "",
  testPerformPlace: "",
  quantity: "",
  rate: "",
  amount: "",
  remark: "",
  supervisorAmount: "",
  //   costCenter: "",
  //   profitCenter: "",
  //   costElement: "",
};

export default function IndustrialTestingCostEntryForm() {
  //   const { type } = useParams();
  const [, postData, loading] = useAxiosPost();
  const [uploadedImage, setUploadedImage] = useState([]);
  const [projectTypes, getProjectTypes] = useAxiosGet();
  const [testTypes, getTestTypes] = useAxiosGet();
  const [performPlaces, getPerformPlaces] = useAxiosGet();

  // get user data from store
  const {
    profileData: { userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getProjectTypes(`/oms/ShipPoint/GetDDLByTypeNUnit?TypeId=3&UnitId=${buId}`);
    getTestTypes(`/oms/ShipPoint/GetDDLByTypeNUnit?TypeId=2&UnitId=${buId}`);
    getPerformPlaces(
      `/oms/ShipPoint/GetDDLByTypeNUnit?TypeId=1&UnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  const saveHandler = async (values, cb) => {
    const payload = [
      {
        autoId: 0,
        testDate: values?.testDate,
        businessTransactionId: 0,
        businessTransactionName: "",
        businessUnitId: buId,
        testTypeId: values?.testType?.value,
        testTypeName: values?.testType?.label,
        projectTypeName: values?.projectType?.label,
        projectTypeId: values?.projectType?.value,
        projectLocation: values?.projectLocation,
        testPerformPlaceId: values?.testPerformPlace?.value,
        testPerformPlaceName: values?.testPerformPlace?.label,
        quantity: values?.quantity,
        rate: values?.rate,
        amount: values?.amount,
        comments: values?.remark,
        attachmentLink: uploadedImage[0]?.id ? uploadedImage[0]?.id : "",
        actionBy: userId,
        supervisorAmount: 0,
        updateBySuperUser: 0,
        costCenterId: 0,
        costCenterName: "",
        profitCenterId: 0,
        profitCenterName: "",
        costElementId: 0,
        costElementName: "",
      },
    ];

    const URL = "/oms/IndustrialTestExpense/CreateIndustrialTestExpense";

    postData(
      URL,
      payload,
      () => {
        cb();
      },
      true
    );
  };

  const title = `Industrial Testing Cost Entry`;

  const loader = loading;

  return (
    <>
      {loader && <Loading />}
      <Form
        obj={{
          title,
          initData,
          testTypes,
          saveHandler,
          projectTypes,
          performPlaces,
          setUploadedImage,
        }}
      />
    </>
  );
}
