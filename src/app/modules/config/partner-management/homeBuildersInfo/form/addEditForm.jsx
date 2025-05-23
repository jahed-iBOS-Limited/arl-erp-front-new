import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Loading from '../../../../_helper/_loading';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import Form from './form';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';

const initData = {
  channel: '',
  region: '',
  area: '',
  territory: '',
  type: { value: 3, label: 'IHB' },
  name: '',
  address: '',
  contactNumber: '',
  email: '',
  nidNumber: '',
  birthDate: '',
  projectStatus: '',
  storiedType: '',
  startDate: '',
  approximateEndDate: '',
  usingBrand: '',
};

export default function HomeBuildersInfoEntryForm() {
  // get user data from store
  const {
    profileData: { accountId: accId, userId, employeeId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const { type } = useParams();
  const [objProps] = useState({});
  const [, postData, isLoading] = useAxiosPost();
  const [uploadedImage, setUploadedImage] = useState([]);
  const [employeeInfo, getEmployeeInfo] = useAxiosGet();

  useEffect(() => {
    getEmployeeInfo(
      `/hcm/RemoteAttendance/GetEmployeeLoginInfo?AccountId=${accId}&BusinessUnitId=${buId}&EmployeeId=${employeeId}`
    );
  }, [accId, buId]);

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

  const initialValues = {
    ...initData,
    channel:
      employeeInfo?.empLevelId === 7
        ? {
            value: employeeInfo?.empChannelId,
            label: employeeInfo?.empChannelName,
          }
        : '',
    region:
      employeeInfo?.empLevelId === 7
        ? {
            value: employeeInfo?.regionId,
            label: employeeInfo?.regionName,
          }
        : '',
    area:
      employeeInfo?.empLevelId === 7
        ? {
            value: employeeInfo?.areaId,
            label: employeeInfo?.areaName,
          }
        : '',
    territory:
      employeeInfo?.empLevelId === 7
        ? {
            value: employeeInfo?.territoryInfoId,
            label: employeeInfo?.territoryInfoName,
          }
        : '',
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          viewType={type}
          initData={initialValues}
          saveHandler={saveHandler}
          setUploadedImage={setUploadedImage}
        />
      </div>
    </>
  );
}
