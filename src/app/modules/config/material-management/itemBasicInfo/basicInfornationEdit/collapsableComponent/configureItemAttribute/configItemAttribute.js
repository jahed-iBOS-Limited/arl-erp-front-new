import React, { useRef, useState, useEffect } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  // ModalProgressBar
} from "../../../../../../../../_metronic/_partials/controls";
import Axios from "axios";
import Form from "./form.js";
import { isArray, uniqBy } from "lodash";

import { useParams } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { toast } from "react-toastify";

export default function ConfigItemAttribute({ id, isViewPage }) {
  const [data, setData] = useState([]);
  const [isExist, setExist] = useState(false);
  const [isDisabled, setDisabled] = useState(true);
  const [itemId, setItemId] = useState(null);
  const [configId, setConfigId] = useState(null);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const params = useParams();

  useEffect(() => {
    setItemId(id || params.id);
    toast.dismiss(1);
  }, [id, params]);

  useEffect(() => {
    if (itemId && profileData.accountId && selectedBusinessUnit.value) {
      itemId &&
        getDataById(itemId, profileData.accountId, selectedBusinessUnit.value);
    }
  }, [itemId, profileData, selectedBusinessUnit]);

  // Check duplicate for show warning
  function hasDuplicates(a) {
    return (
      uniqBy(a, function(itm) {
        return itm.attributeName;
      }).length !== a.length
    );
  }

  // Remove duplicate from alternateuom list
  const setDataToState = (payload) => {
    const duplicate = hasDuplicates([...data, payload]);
    if (duplicate) {
      toast.warn("Not allow duplicate attribute", {
        toastId: "attribute_duplicate",
      });
    } else {
      var uniq = uniqBy([...data, payload], function(itm) {
        return itm.attributeName;
      });
      setData(uniq);
    }
  };

  const getDataById = async (id, accId, buId) => {
    try {
      const res = await Axios.get(
        `/item/ItemAttributeConfig/GetItemAttributeConfigByItemId?accountId=${accId}&businessUnitId=${buId}&ItemId=${id}`
      );
      const { data, status } = res;
      if (status === 200) {
        setExist(data && data.length ? true : false);
        setData(data);
        if (data && data.length) {
          setConfigId(data[0]?.configId);
        }
      }
    } catch (err) {}
  };

  // save business unit data to DB
  const saveData = async (values, cb) => {
    toast.dismiss(1);
    if (isArray(values)) {
      const url = isExist
        ? "/item/ItemAttributeConfig/EditItemAttributeConfig"
        : "/item/ItemAttributeConfig/CreateItemAttributeConfig";
      const method = isExist ? "put" : "post";
      if (configId) {
        values.forEach((itm) => {
          itm.configId = configId;
          delete itm.sl;
        });
      }
      try {
        const res = await Axios[method](url, values);
        cb(data);
        getDataById(itemId, profileData.accountId, selectedBusinessUnit.value);
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: 1,
        });
      } catch (error) {
        getDataById(itemId, profileData.accountId, selectedBusinessUnit.value);

        toast.error(error?.response?.data?.message, { toastId: 1 });
      }
    }
  };

  const saveBtnRef = useRef();
  const saveDataClick = () => {
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

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const removeAlterUom = (payload) => {
    const filterArr = data.filter((itm) => itm.attributeId !== payload);
    setData(filterArr);
  };

  return (
    <Card>
      <CardHeader
        title={
          isViewPage ? "Config Item Attribute" : "Edit Config Item Attribute"
        }
      >
        <CardHeaderToolbar>
          {!isViewPage && (
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
      </CardHeader>
      <CardBody>
        <Form
          isViewPage={isViewPage}
          data={data}
          saveBtnRef={saveBtnRef}
          saveData={saveData}
          resetBtnRef={resetBtnRef}
          businessUnitName={false}
          businessUnitCode={true}
          isEdit={true}
          isDisabledCode={true}
          disableHandler={disableHandler}
          setDataToState={setDataToState}
          removeAlterUom={removeAlterUom}
          itemId={itemId}
          accountId={profileData.accountId}
          businessUnitId={selectedBusinessUnit.value}
          actionBy={profileData.userId}
        />
      </CardBody>
    </Card>
  );
}
