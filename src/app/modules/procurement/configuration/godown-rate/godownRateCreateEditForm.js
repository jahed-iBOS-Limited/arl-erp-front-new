import axios from "axios";
import { Form, Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from 'react-router-dom';
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import ButtonStyleOne from "../../../_helper/button/ButtonStyleOne";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { empAttachment_action, validationSchema } from "./helper";

const initData = {
  plant: "",
  warehouse: "",
  supplier: "",
  item: "",
  totalLand: "",
  rate: "",
  startDate: "",
  endDate: "",
};

export default function GodownRateCreateEditForm() {
  const [open, setOpen] = useState(false);
  const [uploadImage, setUploadImage] = useState({});
  const [fileObjects, setFileObjects] = useState([]);
  const [objProps, setObjprops] = useState({});
  const [plantDDL, getPlantDDL] = useAxiosGet();
  const [wareHouseDDL, getWareHouseDDL] = useAxiosGet();
  const [sbuDDL, getSbuDDL] = useAxiosGet();
  const[,saveGodownData,loadSaveGodownData] = useAxiosPost()
  const[editAbleInitData,setEditAbleInitData] = useState({})
  const {id} = useParams()
  const {state} = useLocation()
  const {
    profileData: { accountId: accId,userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const handleSaveAndEdit = (values) => {
    const payload = {
      godownRateConfigId: id ? state?.godownRateConfigId : 0,
      businessUnitId: buId,
      plantId: values?.plant?.value,
      warehouseId: values?.warehouse?.value,
      supplierId: values?.supplier?.value,
      itemId: values?.item?.value,
      totalSize: values?.totalLand,
      rate: values?.rate,
      contractStartDate: values?.startDate,
      contractEndtDate: values?.endDate,
      attachmentId: id ? state?.attachmentId:uploadImage[0]?.id,
      createdBy: userId,
      createdAt: _todayDate(),
    };
    saveGodownData(
        `/procurement/PurchaseOrder/CreateAndUpdateGodownRateConfiguration`,
        payload,
        (data)=>{
          if(data){
            
          }
        },
        true
    )
  };
  const saveHandler = (values, cb) => {
    handleSaveAndEdit(values);
    cb()
  };
  useEffect(() => {
    getPlantDDL(
      `/wms/Plant/GetPlantDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);
  useEffect(()=>{
  setEditAbleInitData({
  plant: {value:state?.plantId,label:state?.plantName},
  warehouse: {value:state?.warehouseId,label:state?.warehouseName},
  supplier: {value:state?.supplierId,label:state?.supplierName},
  item: {value:state?.itemId,label:state?.itemName},
  totalLand:state?.totalSize,
  rate: state?.rate,
  startDate: _dateFormatter(state?.contractStartDate),
  endDate: _dateFormatter(state?.contractStartDate),
   })
  },[id,state])
  return (
    <Formik
      enableReinitialize={true}
      initialValues={id ? editAbleInitData:initData}
        validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {loadSaveGodownData && <Loading />}
          <IForm title="Create Godown Rate" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={plantDDL}
                    value={values?.plant}
                    label="Plant"
                    onChange={(valueOption) => {
                      setFieldValue("plant", valueOption);
                      getWareHouseDDL(
                        `/wms/ItemPlantWarehouse/GetWareHouseItemPlantWareHouseDDL?accountId=${accId}&businessUnitId=${buId}&PlantId=${valueOption?.value}`
                      );
                    }}
                    isDisabled={id}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="warehouse"
                    options={wareHouseDDL}
                    value={values?.warehouse}
                    label="Warehouse"
                    onChange={(valueOption) => {
                      setFieldValue("warehouse", valueOption);
                      getSbuDDL(
                        `/costmgmt/SBU/GetSBUListDDL?AccountId=${accId}&BusinessUnitId=${buId}&Status=true`
                      );
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={id}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Supplier</label>
                  <SearchAsyncSelect
                    selectedValue={values?.supplier}
                    handleChange={(valueOption) => {
                      setFieldValue("supplier", valueOption);
                    }}
                    isDisabled={!values?.warehouse || id}
                    placeholder="Search Supplier"
                    loadOptions={(v) => {
                      const searchValue = v.trim();
                      if (searchValue?.length < 3) return [];
                      return axios
                        .get(
                          `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accId}&UnitId=${buId}&SBUId=${sbuDDL[0]?.value}`
                        )
                        .then((res) => res?.data);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Item</label>
                  <SearchAsyncSelect
                    selectedValue={values?.item}
                    handleChange={(valueOption) => {
                      setFieldValue("item", valueOption);
                    }}
                    isDisabled={!values?.supplier || id}
                    placeholder="Search Item"
                    loadOptions={(v) => {
                      const searchValue = v.trim();
                      if (searchValue?.length < 3) return [];
                      return axios
                        .get(
                          `/procurement/PurchaseOrderItemDDL/ServicePurchaseOrderItemList?ItemTypeId=0&OrderTypeId=5&AccountId=${accId}&BusinessUnitId=${buId}&SbuId=${sbuDDL[0]?.value}&PurchaseOrgId=11&PlantId=${values?.plant?.value}&WearhouseId=${values?.warehouse?.value}&RefTypeId=3&RefNoId=0&searchTerm=${v}`
                        )
                        .then((res) => res?.data);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.totalLand}
                    label="Total Land (Square Rate)"
                    name="totalLand"
                    type="number"
                    placeholder="Total Land"
                    min={0}
                    onChange={(e) => {
                      setFieldValue("totalLand", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.rate}
                    label="Rate"
                    name="rate"
                    type="number"
                    placeholder="Rate"
                    min={0}
                    onChange={(e) => {
                      setFieldValue("rate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.startDate}
                    label="Contract Start Date"
                    name="startDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("startDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.endDate}
                    label="Contract End Date"
                    name="endDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("endDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <div style={{ marginTop: "18px", marginRight: "5px" }}>
                    <ButtonStyleOne
                      className="btn btn-primary"
                      type="button"
                      onClick={() => setOpen(true)}
                      label="Attachment"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
              <DropzoneDialogBase
                filesLimit={1}
                acceptedFiles={["image/*", "application/pdf"]}
                fileObjects={fileObjects}
                cancelButtonText={"cancel"}
                submitButtonText={"submit"}
                maxFileSize={1000000}
                open={open}
                onAdd={(newFileObjs) => {
                  setFileObjects([].concat(newFileObjs));
                }}
                onDelete={(deleteFileObj) => {
                  const newData = fileObjects.filter(
                    (item) => item.file.name !== deleteFileObj.file.name
                  );
                  setFileObjects(newData);
                }}
                onClose={() => setOpen(false)}
                onSave={() => {
                  setOpen(false);
                  empAttachment_action(fileObjects).then((data) => {
                    setUploadImage(data);
                  });
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
              />
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
