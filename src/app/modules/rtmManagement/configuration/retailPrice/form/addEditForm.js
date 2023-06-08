/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Form from "./form";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import IForm from "./../../../../_helper/_form";
import {
  createRetailPrice,
  editRetailPrice,
  getDistributionChannelDDL,
  // retailPriceAttachment_action,
} from "../helper";
import { toast } from "react-toastify";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { getRetailPriceId, getItemDDL } from "./../helper";
// import { editRetailPrice } from "./../helper";

const initData = {
  distribution: "",
  item: "",
  UomId: "",
  UoM: "",
  rate: "",
  itemBanglaName: "",
  productImage: "",
  packageQuantity: "",
  tprate: "",
  dprate: "",
  productType: "",
};

const RetailPriceForm = () => {
  const { id } = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [uploadImage, setUploadImage] = useState("");
  const [singleData, setSingleData] = useState("");
  const [rowData, setRowData] = useState([]);

  // iamge attachment
  const [fileObjects, setFileObjects] = useState([]);

  // All DDL
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Fetch All DDL
  useEffect(() => {
    getDistributionChannelDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setDistributionChannelDDL
    );
    // getItemDDL(profileData?.accountId, setItemDDL);
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  // Get Single Data By Id
  useEffect(() => {
    if (id) {
      getItemDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        id,
        setItemDDL
      );

      getRetailPriceId(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.userId,
        id,
        setSingleData,
        setRowData,
        setDisabled
      );
    }
  }, [id]);

  // Save Handler
  const saveHandler = (values, cb) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      if (rowData?.length > 0) {
        if (!id) {
          // Create
          createRetailPrice(rowData, cb);
        } else {
          // Edit
          editRetailPrice(rowData);
        }
      } else {
        toast.warning("Please select at least one item");
      }
    }
  };

  // Handle Add Row Data
  const rowDataHandler = (values, setFieldValue) => {
    let foundDuplicate = rowData?.filter(
      (item) => item?.itemId === values?.item?.value
    );

    if (foundDuplicate?.length === 0) {
      const payload = {
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        itemId: values?.item?.value,
        itemName: values?.item?.label,
        itemCode: values?.item?.name,
        uomId: values?.UoMId,
        uomName: values?.UoM,
        itemBanglaName: values?.itemBanglaName,
        productImage: values?.productImage,
        packageQuantity: values?.packageQuantity,
        tprate: values?.tprate,
        dprate: values?.dprate,
        distributionChannelId: values?.distribution?.value,
        distributionChannelName: values?.distribution?.label,
        itemRate: values?.rate,
        actionBy: profileData?.userId,
        dteLastActionDateTime: _todayDate(),
        productTypeId: values?.productType?.value,
        productTypeName: values?.productType?.label,
        isActive: true,
      };
      if (fileObjects.length > 0) {
        const modifyPlyload = {
          ...payload,
          productImage: uploadImage[0]?.id || "",
        };
        setRowData([...rowData, modifyPlyload]);
        setFieldValue("tprate", "");
        setFieldValue("dprate", "");
        setFieldValue("packageQuantity", "");
        setFieldValue("rate", "");
        setFieldValue("itemBanglaName", "");
        setFieldValue("productImage", "");
        setFieldValue("productType", "");
        setFileObjects([]);
      } else {
        const modifyPlyload = {
          ...payload,
          productImage: "",
        };
        setRowData([...rowData, modifyPlyload]);
        setFieldValue("tprate", "");
        setFieldValue("dprate", "");
        setFieldValue("packageQuantity", "");
        setFieldValue("rate", "");
        setFieldValue("itemBanglaName", "");
        setFieldValue("productImage", "");
        setFieldValue("productType", "");
      }
    } else {
      toast.warning("Data already exits", { toastId: "Dupi" });
    }
  };

  const remover = (index) => {
    const filterArr = rowData?.filter((itm, i) => i !== index);
    setRowData(filterArr);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <>
      <IForm
        title={!id ? "Create Retail Price Set Up" : "Edit Retail Price Set Up"}
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={singleData || initData}
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          buId={selectedBusinessUnit?.value}
          // All DDL
          distributionChannelDDL={distributionChannelDDL}
          itemDDL={itemDDL}
          setItemDDL={setItemDDL}
          // Other
          rowData={rowData}
          isEdit={id}
          setRowData={setRowData}
          rowDataHandler={rowDataHandler}
          remover={remover}
          // image attachment
          setFileObjects={setFileObjects}
          fileObjects={fileObjects}
          uploadImage={uploadImage}
          setUploadImage={setUploadImage}
        />
      </IForm>
    </>
  );
};

export default RetailPriceForm;
