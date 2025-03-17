/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import Axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import shortid from 'shortid';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from '../../../../../../../../_metronic/_partials/controls';
import { empAttachment_action } from '../../../../../../_helper/attachmentUpload';
import Form from '../../../common/form';
import { editPartnerBasic_api } from '../../../helper';
import Loading from './../../../../../../_helper/_loading';

export default function PartnerBasic() {
  const { id } = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [warehouseData, setData] = useState('');
  //fileObjects
  const [fileObjects, setFileObjects] = useState([]);
  const selectedBusinessUnit = useSelector(
    (state) => state.authData.selectedBusinessUnit,
  );
  const profileData = useSelector((state) => state.authData.profileData);

  useEffect(() => {
    getBusinessUnitById(profileData.accountId, selectedBusinessUnit.value, id);
  }, [profileData, selectedBusinessUnit, id]);

  const getBusinessUnitById = async (accid, buid, id) => {
    const res = await Axios.get(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerByID?accountId=${accid}&businessUnitId=${buid}&partnerID=${id}`,
    );
    const { data, status } = res;
    console.log({ resData: data });
    if (status === 200 && data) {
      data.forEach((r) => {
        const singleObject = {
          businessPartnerId: r.businessPartnerId,
          businessPartnerName: r.businessPartnerName,
          businessPartnerAddress: r.businessPartnerAddress,
          contactNumber: r.contactNumber,
          bin: r.bin,
          licenseNo: r.licenseNo,
          email: r.email,
          businessPartnerTypeId: r.businessPartnerTypeId,
          partnerSalesType: r.businessPartnerTypeName,
          businessPartnerType: {
            value: r.businessPartnerTypeId,
            label: r.businessPartnerTypeName,
          },
          businessPartnerCode: 'abc',
          attachmentLink: r?.attachmentLink || '',
          createNewUser: r?.isUser || false,
          isUser: r?.isUser,
          userId: r?.userId || null,

          /* Last Added */
          division: r?.divisionId
            ? {
              value: r?.divisionId,
              label: r?.divisionName,
            }
            : '',
          district: r?.districtId
            ? {
              value: r?.districtId,
              label: r?.districtName,
            }
            : '',
          policeStation: r?.upazilaId
            ? {
              value: r?.upazilaId,
              label: r?.upazilaName,
            }
            : '',
          proprietor: r?.propitor || '',
          contactPerson: r?.contactPerson || '',
          contactNumber2: r?.contactNumber2 || '',
          contactNumber3: r?.contactNumber3 || '',
          cargoType: r?.cargoTypeId
            ? {
              value: r?.cargoTypeId,
              label: r?.cargoType,
            }
            : '',
        };
        setData(singleObject);
      });
    }
  };
  // save business unit data to DB
  const saveWarehouse = async (values, cb) => {
    const { accountId, actionBy } = profileData;
    const { value: buid } = selectedBusinessUnit;
    const warehouseData = {
      businessPartnerId: values.businessPartnerId,
      accountId: accountId,
      businessUnitId: buid,
      businessPartnerCode: values.businessPartnerCode,
      businessPartnerName: values.businessPartnerName,
      businessPartnerAddress: values.businessPartnerAddress,
      contactNumber: values.contactNumber,
      bin: values.bin,
      licenseNo: values.licenseNo,
      email: values.email,
      businessPartnerTypeId: values.businessPartnerType.value,
      partnerSalesType: values.businessPartnerType.label,
      actionBy: actionBy,
      attachmentLink: values?.attachmentLink,
      isCreateUser: values?.isUser ? false : values?.createNewUser,
      userId: values?.userId || null,
      isUpdateLoginId: values?.updateUserLoginId,

      /* Last Added */
      districtId: values?.district?.value,
      districtName: values?.district?.label,
      upazilaId: values?.policeStation?.value,
      upazilaName: values?.policeStation?.label,

      propitor: values?.proprietor,
      contactPerson: values?.contactPerson,
      contactNumber2: values?.contactNumber2,
      contactNumber3: values?.contactNumber3,
      cargoTypeId: values?.cargoType?.value || 0,
      cargoType: values?.cargoType?.label || '',
    };

    try {
      // setDisabled(true);
      // const res = await Axios.put(
      //   "/partner/BusinessPartnerBasicInfo/EditBusinessPartner",
      //   warehouseData
      // );
      // cb();
      // toast.success(res.data?.message || "Submitted successfully", {
      //   toastId: shortid(),
      // });
      // setDisabled(false);

      if (fileObjects?.length > 0) {
        // attachmentLink  add
        empAttachment_action(fileObjects).then((data) => {
          const modifyPlyload = {
            ...warehouseData,
            attachmentLink: data[0]?.id || '',
          };
          editPartnerBasic_api(modifyPlyload, cb, setDisabled).then((data) => {
            getBusinessUnitById(
              profileData.accountId,
              selectedBusinessUnit.value,
              id,
            );
          });
        });
      } else {
        // attachmentLink not add
        editPartnerBasic_api(warehouseData, cb, setDisabled).then((data) => {
          getBusinessUnitById(
            profileData.accountId,
            selectedBusinessUnit.value,
            id,
          );
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message, { toastId: shortid() });
      setDisabled(false);
    }
  };

  const btnRef = useRef();
  const saveBtnClicker = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.click();
    }
  };

  const resetBtnRef = useRef();
  const ResetProductClick = () => {
    if (resetBtnRef && resetBtnRef.current) {
      resetBtnRef.current.click();
    }
  };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Edit Partners Basic Information">
        <CardHeaderToolbar>
          <button
            type="reset"
            onClick={ResetProductClick}
            ref={resetBtnRef}
            className="btn btn-light ml-2"
          >
            <i className="fa fa-redo"></i>
            Reset
          </button>
          <button
            type="submit"
            className="btn btn-primary ml-2"
            onClick={saveBtnClicker}
            ref={btnRef}
            disabled={isDisabled}
          >
            Save
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        {warehouseData && (
          <div className="mt-0">
            {isDisabled && <Loading />}
            <Form
              product={warehouseData}
              btnRef={btnRef}
              saveWarehouse={saveWarehouse}
              resetBtnRef={resetBtnRef}
              businessPartnerCode={true}
              selectedBusinessUnit={selectedBusinessUnit}
              profileData={profileData}
              setFileObjects={setFileObjects}
              fileObjects={fileObjects}
              id={id}
            />
          </div>
        )}
      </CardBody>
    </Card>
  );
}
