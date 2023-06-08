/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from "react";
import Form from "../../../common/form";
import Axios from "axios";
import shortid from "shortid";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../_metronic/_partials/controls";
import { useParams } from "react-router-dom";
import Loading from "./../../../../../../_helper/_loading";
import { editPartnerBasic_api } from "../../../helper";
import { partnerBasicAttachment_action } from "./../../../helper";

export default function PartnerBasic() {
  const { id } = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [warehouseData, setData] = useState("");
  //fileObjects
  const [fileObjects, setFileObjects] = useState([]);
  const selectedBusinessUnit = useSelector(
    (state) => state.authData.selectedBusinessUnit
  );
  const profileData = useSelector((state) => state.authData.profileData);

  useEffect(() => {
    getBusinessUnitById(profileData.accountId, selectedBusinessUnit.value, id);
  }, [profileData, selectedBusinessUnit, id]);

  const getBusinessUnitById = async (accid, buid, id) => {
    const res = await Axios.get(
      `/partner/BusinessPartnerBasicInfo/GetBusinessPartnerByID?accountId=${accid}&businessUnitId=${buid}&partnerID=${id}`
    );
    const { data, status } = res;
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
          businessPartnerCode: "abc",
          attachmentLink: r?.attachmentLink || "",
          createNewUser: r?.isUser || false,
          isUser: r?.isUser,
          userId: r?.userId || null,

          /* Last Added */
          division: r?.divisionId
            ? {
                value: r?.divisionId,
                label: r?.divisionName,
              }
            : "",
          district: r?.districtId
            ? {
                value: r?.districtId,
                label: r?.districtName,
              }
            : "",
          policeStation: r?.upazilaId
            ? {
                value: r?.upazilaId,
                label: r?.upazilaName,
              }
            : "",
            proprietor:  r?.propitor || "",
            contactPerson:  r?.contactPerson || "",
            contactNumber2:  r?.contactNumber2 || "",
            contactNumber3:  r?.contactNumber3 || "",
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
        partnerBasicAttachment_action(fileObjects).then((data) => {
          const modifyPlyload = {
            ...warehouseData,
            attachmentLink: data[0]?.id || "",
          };
          editPartnerBasic_api(modifyPlyload, cb, setDisabled).then((data) => {
            getBusinessUnitById(
              profileData.accountId,
              selectedBusinessUnit.value,
              id
            );
          });
        });
      } else {
        // attachmentLink not add
        editPartnerBasic_api(warehouseData, cb, setDisabled).then((data) => {
          getBusinessUnitById(
            profileData.accountId,
            selectedBusinessUnit.value,
            id
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
