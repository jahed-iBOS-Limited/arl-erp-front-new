/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { useSelector, shallowEqual } from "react-redux";
import Form from "../common/form";
import Axios from "axios";
import shortid from "shortid";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";

const data = {
  id: undefined,
  itemName: "",
  itemCode: "",
  drawingCode: "",
  partNo: "",
  itemType: "",
  itemTypeId: "",
  itemCategoryName: "",
  itemCategoryId: "",
  itemSubCategoryName: "",
  itemSubCategoryId: "",
  itemCategory: "",
};

export default function AddForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [saveConfigBtn, setSaveConfigBtn] = useState(false);
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const saveData = async (values, cb) => {
    setDisabled(true);
    if (
      !id &&
      values &&
      profileData?.accountId &&
      selectedBusinessUnit?.value
    ) {
      const { accountId, userId: actionBy } = profileData;
      const itemBasicData = {
        itemCode:
          selectedBusinessUnit?.value === 102
            ? values?.itemCode
              ? values?.itemCode
              : ""
            : "",
        drawingCode: values?.drawingCode || "",
        partNo: values?.partNo || "",
        itemName: values.itemName,
        itemTypeId: values.itemType.value,
        itemTypeName: values.itemType.label,
        itemCategoryId: values.itemCategory.value,
        itemCategoryName: values.itemCategory.label,
        itemSubCategoryId: values.itemSubCategory.value,
        itemSubCategoryName: values.itemSubCategory.label,
        businessUnitId: selectedBusinessUnit?.value,
        actionBy,
        isActive: true,
        accountId,
        isSerialMaintain: !!values?.isMaintainSerial
      };
      if (!saveConfigBtn) {
        try {
          setDisabled(true);
          const res = await Axios.post(
            "/item/ItemBasic/CreateItemBasic",
            itemBasicData
          );
          cb(data);
          setDisabled(false);
          toast.success(res.data?.message || "Submitted successfully", {
            toastId: shortid(),
          });
        } catch (error) {
          setDisabled(false);
          toast.error(error?.response?.data?.message, { toastId: shortid() });
        }
      } else {
        try {
          setDisabled(true);
          const res = await Axios.post(
            "/item/ItemBasic/CreateItemBasic",
            itemBasicData
          );
          if (res?.data) {
            history.push({
              pathname: `/config/material-management/item-basic-info/edit/${res?.data?.key}`,
              state: {
                item: {
                  itemName: res?.data?.keyValue,
                  itemCode: res?.data?.itemCode,
                },
              },
            });
          }
        } catch (error) {
          setDisabled(false);
          toast.error(error?.response?.data?.message, { toastId: shortid() });
        }
      }
    } else {
      setDisabled(false);
    }
  };

  const saveBtnRef = useRef();
  const saveItemBasicClick = () => {
    if (saveBtnRef && saveBtnRef.current) {
      saveBtnRef.current.click();
    }
  };

  const saveConfigBtnRef = useRef();
  const saveConfigItemBasicClick = () => {
    if (saveConfigBtnRef && saveConfigBtnRef.current) {
      saveConfigBtnRef.current.click();
    }
  };

  const resetBtnRef = useRef();
  const ResetProductClick = () => {
    if (resetBtnRef && resetBtnRef.current) {
      resetBtnRef.current.click();
    }
  };

  const backHandler = () => {
    history.push(`/config/material-management/item-basic-info`);
  };

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Create Item Basic info">
        <CardHeaderToolbar>
          <button type="button" onClick={backHandler} className="btn btn-light">
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
            onClick={saveItemBasicClick}
            ref={saveBtnRef}
            disabled={isDisabled}
          >
            Save
          </button>
          <button
            type="submit"
            className="btn btn-primary ml-2"
            onClick={saveConfigItemBasicClick}
            ref={saveConfigBtnRef}
            disabled={isDisabled}
          >
            Save & Complete
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        {isDisabled && <Loading />}
        <div className="mt-0">
          <Form
            data={data}
            saveBtnRef={saveBtnRef}
            saveConfigBtnRef={saveConfigBtnRef}
            saveData={saveData}
            resetBtnRef={resetBtnRef}
            selectedBusinessUnit={selectedBusinessUnit}
            accountId={profileData.accountId}
            setSaveConfigBtn={setSaveConfigBtn}
          />
        </div>
      </CardBody>
    </Card>
  );
}
