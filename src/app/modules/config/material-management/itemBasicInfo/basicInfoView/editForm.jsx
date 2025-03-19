/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
// import Form from "../common/form";
import Axios from "axios";
import { useParams } from "react-router-dom";
import { isObject } from "lodash";
import { useSelector, shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";
import Form from "./itemBasicForm";

export default function EditForm({ history, isViewPage }) {
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
    // console.log(res)
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
        itemName: values.itemName,
        itemTypeId: values.itemType.value,
        itemTypeName: values.itemType.label,
        itemCategoryId: values.itemCategory.value,
        itemCategoryName: values.itemCategory.label,
        itemSubCategoryId: values.itemSubCategory.value,
        itemSubCategoryName: values.itemSubCategory.label,
        actionBy: profileData.userId,
        // lastActionDateTime: "2020-07-08T05:24:31.882Z",
        isActive: true,
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

  const resetBtnRef = useRef();

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader
        title={isViewPage ? "Item Basic Info" : "Edit Item Basic Info"}
      ></CardHeader>
      <CardBody>
        {isDisabled && <Loading />}
        {data && (
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
            />
          </div>
        )}
      </CardBody>
    </Card>
  );
}
