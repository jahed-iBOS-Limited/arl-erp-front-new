/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import Form from "../common/form";
import Axios from "axios";
import { useParams } from "react-router-dom";
import { isObject } from "lodash";

import { useSelector, shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";

export default function EditForm({ history,isViewPage }) {
  const [isDisabled, setDisabled] = useState(false);
  const [data, setData] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const businessUnitId = selectedBusinessUnit?.value;
  const isWorkable = (businessUnitId === 138 || businessUnitId === 186 )

  let { id } = useParams();
  useEffect(() => {
    getDataById(id);
    toast.dismiss(2);
  }, [id]);

  const getDataById = async (id, accountId) => {
    const res = await Axios.get(
      `/item/ItemBasic/GetItemBasicByItemId?Itemid=${id}`
    );
    const { data, status } = res;
    if (status === 200) {
      const meta = data[0];
      meta &&
        setData({
          ...meta,
          itemType: { value: meta.itemTypeId, label: meta.itemTypeName },
          itemCategory: {
            value: meta.itemCategoryId,
            label: meta.itemCategoryName,
          },
          itemSubCategory: {
            value: meta.itemSubCategoryId,
            label: meta.itemSubCategoryName,
          },
          minimumStockQuantity: meta?.minimumStockQuantity || "",
          safetyStockQuantity : meta?.safetyStockQuantity || "",
          maximumQuantity :meta?.maximumQuantity || "",
          reorderQuantity : meta?.reorderQuantity || "",
          reorderLevel:meta?.reorderLevel || "",
          isMaintainSerial : meta?.isSerialMaintain
        });
    }
  };

  // save business unit data to DB
  const saveData = async (values, cb) => {
    // console.log(values)
    if (isObject(values) && Object.keys(values).length && profileData) {
      setDisabled(true);
      const editData = {
        itemId: +id,
        drawingCode: values?.drawingCode,
        partNo: values?.partNo,
        itemName: values.itemName,
        itemCode: selectedBusinessUnit?.value === 102 ? values?.itemCode || "" : "",
        itemTypeId: values.itemType.value,
        itemTypeName: values.itemType.label,
        itemCategoryId: values.itemCategory.value,
        itemCategoryName: values.itemCategory.label,
        itemSubCategoryId: values.itemSubCategory.value,
        itemSubCategoryName: values.itemSubCategory.label,
        actionBy: profileData.userId,
        businessUnitId: selectedBusinessUnit?.value,
        isActive: true,
        minimumStockQuantity: +values?.minimumStockQuantity || 0,
        safetyStockQuantity : +values?.safetyStockQuantity || 0,
        maximumQuantity : +values?.maximumQuantity || 0,
        reorderQuantity : +values?.reorderQuantity || 0,
        reorderLevel: values?.reorderLevel || "",
        isSerialMaintain :!!values?.isMaintainSerial || false
      };

      try {
        setDisabled(true);
        const res = await Axios.put("/item/ItemBasic/EditItemBasic", editData);
        cb(data);
        getDataById(id);
        setDisabled(false);
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: 2,
        });
      } catch (error) {
       
        toast.error("Sorry! please try again", { toastId: 2 });

        setDisabled(false);
      }
    }
  };

  const saveBtnRef = useRef();
  const saveDataClick = () => {
    // console.log("entered");
    if (saveBtnRef && saveBtnRef.current) {
      saveBtnRef.current.click();
    }
  };

  const resetBtnRef = useRef();
  const resetBtnClick = () => {
    if (resetBtnRef && resetBtnRef.current) {
      resetBtnRef.current.click();
    }
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  return (
    <Card>
      {true && <ModalProgressBar />}
      {/* <CardHeader  title={isViewPage ? "Item Basic Info" : "Edit Item Basic Info"} >
        <CardHeaderToolbar>
          {!isViewPage &&(
            <>
          <button
            type="reset"
            onClick={resetBtnClick}
            ref={resetBtnRef}
            className="btn btn-light ml-2"
          >
            <i className="fa fa-redo"></i>
            Reset
          </button>
          <button
            type="submit"
            className="btn btn-primary ml-2"
            onClick={saveDataClick}
            ref={saveBtnRef}
            disabled={isDisabled}
          >
            Save
          </button>
          </>
          )}
        </CardHeaderToolbar>
      </CardHeader> */}
      <CardBody>
        {isDisabled && <Loading />}
        {/* {data && (
          <div className="mt-0">
            <Form
              data={data}
              saveBtnRef={saveBtnRef}
              saveData={saveData}
              resetBtnRef={resetBtnRef}
              // disableHandler={disableHandler}
              businessUnitName={false}
              businessUnitCode={true}
              isEdit={true}
              isDisabledCode={true}
              selectedBusinessUnit={selectedBusinessUnit}
              accountId={profileData.accountId}
              id={id}
              isWorkable={isWorkable}
            />
          </div>
        )} */}
      </CardBody>
    </Card>
  );
}
