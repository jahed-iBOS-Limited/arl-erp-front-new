
import React, { useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import Form from "../common/form";
import { toast } from "react-toastify";
import shortid from "shortid";
import { useSelector } from "react-redux";
import Loading from "./../../../../_helper/_loading";
import {
  partnerBasicAttachment_action,
  createPartnerBasic_api,
} from "../helper";
const initProduct = {
  id: undefined,
  businessPartnerName: "",
  businessPartnerAddress: "",
  contactNumber: "",
  bin: "",
  licenseNo: "",
  email: "",
  businessPartnerType: "",

};

export default function PartnerAddForm({
  history,
  match: {
    params: { id },
  },
}) {
  const selectedBusinessUnit = useSelector(
    (state) => state.authData.selectedBusinessUnit
  );
  const profileData = useSelector((state) => state.authData.profileData);
  const [isDisabled, setDisabled] = useState(false);
  //fileObjects
  const [fileObjects, setFileObjects] = useState([]);
  const saveWarehouse = async (values, cb) => {
    if (!id && values && selectedBusinessUnit && profileData) {
      const { accountId, userId: actionBy } = profileData;
      const { value: businessunitid } = selectedBusinessUnit;

      const warehouseData = {
        accountId: accountId,
        businessUnitId: businessunitid,
        businessPartnerCode: "abc",
        businessPartnerName: values.businessPartnerName,
        businessPartnerAddress: values.businessPartnerAddress,
        contactNumber: values.contactNumber,
        bin: values.bin,
        licenseNo: values.licenseNo,
        email: values.email,
        businessPartnerTypeId: values.businessPartnerType.value,
        partnerSalesType: values.businessPartnerType.label,
        actionBy: actionBy,
        attachmentLink: "",
      };

      try {
        if (fileObjects.length > 0) {
          // attachmentLink  add
          partnerBasicAttachment_action(fileObjects).then((data) => {
            // upload image link
            const modifyPlyload = {
              ...warehouseData,
              attachmentLink: data[0]?.id || "",
            };
            createPartnerBasic_api(modifyPlyload, cb, setDisabled);
          });
        } else {
          // attachmentLink not add
          createPartnerBasic_api(warehouseData, cb, setDisabled);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message, { toastId: shortid() });
        setDisabled(false);
      }
    } else {
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

  const backToWarehouseList = () => {
    history.push(`/config/partner-management/partner-basic-info/`);
  };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Business Partner Basic Info">
        <CardHeaderToolbar>
          <button
            type="button"
            onClick={backToWarehouseList}
            className="btn btn-light"
          >
            <i className="fa fa-arrow-left"></i>
            Back
          </button>
          {`  `}
          <button
            type="reset"
            onClick={ResetProductClick}
            ref={resetBtnRef}
            className="btn btn-light ml-2"
          >
            <i className="fa fa-redo"></i>
            Reset
          </button>
          {`  `}
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
        <div className="mt-0">
          {isDisabled && <Loading />}
          <Form
            product={initProduct}
            btnRef={btnRef}
            saveWarehouse={saveWarehouse}
            resetBtnRef={resetBtnRef}
            selectedBusinessUnit={selectedBusinessUnit}
            accountId={profileData.accountId}
            setFileObjects={setFileObjects}
            fileObjects={fileObjects}
          />
        </div>
      </CardBody>
    </Card>
  );
}
