import Axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { getPlantList, getPurchaseOrganizationDDL, getSBU, getWhList } from "../../../../_helper/_commonApi";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../_helper/_formikError";
import {
  getControllingUnitList,
  getCostCenterList,
  getCostElementList,
  getRequestTypeList,
  getUOMList,
} from "./helper";

// Validation schema
const validationSchema = Yup.object().shape({
  requestType: Yup.object().shape({
    value: Yup.string().required("Request type is required"),
    label: Yup.string().required("Request type is required"),
  }),
  purpose: Yup.string()
    .required("Purpose is required")
    .min(2, "Minimum 2 characters")
    .max(99, "Maximum 100 Characters"),
  address: Yup.string()
    .required("Address is required")
    .min(2, "Minimum 2 characters")
    .max(100, "Maximum 100 Characters"),
  refNo: Yup.string()
    .min(2, "Minimum 2 characters")
    .max(100, "Maximum 100 Characters"),
  sbu: Yup.object().shape({
    value: Yup.string().required("SBU is required"),
    label: Yup.string().required("SBU is required"),
  }),
  po: Yup.object().shape({
    value: Yup.string().required("Purchase Organization is required"),
    label: Yup.string().required("Purchase Organization is required"),
  }),
  plant: Yup.object().shape({
    value: Yup.string().required("Plant is required"),
    label: Yup.string().required("Plant is required"),
  }),
  wh: Yup.object().shape({
    value: Yup.string().required("Warehouse is required"),
    label: Yup.string().required("Warehouse is required"),
  }),
});

export default function FormCmp({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  selectedBusinessUnit,
  profileData,
  rowDto,
  setRowDto,
  setter,
  remover,
  prId,
  type,
  // location,
}) {
  // ddl state
  const [reqTypeList, setReqTypeList] = useState([]);
  const [cuList, setCUList] = useState([]);
  const [costCenterList, setCostCenterList] = useState([]);
  const [costElementList, setCostElementList] = useState([]);

  const [uomList, setUOMList] = useState([]);
  const [itemTypeId, setItemTypeId] = useState([]);

  // ddl state
  const [sbuList, setSbuList] = useState("");
  const [poList, setPoList] = useState("");
  const [plantList, setPlantList] = useState("");
  const [whList, setWhList] = useState("");

  useEffect(() => {
    getSBU(profileData?.accountId, selectedBusinessUnit?.value, setSbuList);
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getPlantList(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPlantList
      );

      getRequestTypeList(setReqTypeList);
      getControllingUnitList(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCUList
      );
      getPurchaseOrganizationDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPoList
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    let itemType =
      initData?.requestType?.label === "Asset PR"
        ? 9
        : initData?.requestType?.label === "Service PR"
          ? 8
          : initData?.requestType?.label === "Standard PR" && 2;

    if (prId) {
      setItemTypeId(itemType);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initData]);

  const loadItemList = (v, values) => {
    //  if (v?.length < 3) return []
    return Axios.get(
      `/wms/ItemPlantWarehouse/GetItemPlantWarehouseForPurchaseRequestSearchDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&plantId=${values?.plant?.value}&whId=${values?.wh?.value}&purchaseOrganizationId=${values?.po?.value}&typeId=${itemTypeId}&searchTerm=${v}`
    ).then((res) => {
      const updateList = res?.data.map((item) => ({
        ...item,
      }));
      return updateList;
    });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm, setFieldValue }) => {
          const formValue = values;
          saveHandler(values, () => {
            resetForm();
            setFieldValue("requestType", formValue?.requestType);
            setRowDto([]);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}

            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-2 global-form">
                  <div className="row">
                    <div className="col-lg-12">
                      <NewSelect
                        name="requestType"
                        options={reqTypeList || []}
                        value={values?.requestType}
                        // if rowDto has length, we will disable this, because , our item api load depends on this field, user have to clear rowDto, then user can change this.
                        isDisabled={rowDto?.length >= 1}
                        label="Request Type"
                        onChange={(valueOption) => {
                          setFieldValue("costElement", "");
                          setFieldValue("costCenter", "");
                          setFieldValue("controllingUnit", "");
                          setFieldValue("itemName", "");
                          setFieldValue("requestType", valueOption);
                          // let itemType =
                          //   valueOption?.label === "Asset PR"
                          //     ? 10
                          //     : valueOption?.label === "Service PR"
                          //       ? 9
                          //       : valueOption?.label === "Standard PR" && 0;
                          setItemTypeId(valueOption?.value);
                          // getItemList(
                          //   profileData?.accountId,
                          //   selectedBusinessUnit?.value,
                          //   location?.state?.plant?.value,
                          //   location?.state?.wh?.value,
                          //   location?.state?.po?.value,
                          //   itemType,
                          //   setItemList
                          // );
                        }}
                        placeholder="Request Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {/* <div className="col-lg-6">
                      <NewSelect
                        name="supplyingWh"
                        options={[]}
                        value={values?.supplyingWh}
                        isDisabled
                        label="Supplying Warehouse"
                        onChange={(valueOption) => {
                          setFieldValue("supplyingWh", valueOption);
                        }}
                        placeholder="Supply Warehouse"
                        errors={errors}
                        touched={touched}
                      />
                    </div> */}
                    {/* <div className="col-lg-6">
                      <label>Request Date</label>
                      <InputField
                        value={values?.requestDate}
                        name="requestDate"
                        disabled={true}
                        placeholder="Request Date"
                        type="date"
                      />
                    </div> */}
                    {/* <div className="col-lg-6">
                      <NewSelect
                        name="bom"
                        options={[]}
                        value={values?.bom}
                        isDisabled
                        label="BOM"
                        onChange={(valueOption) => {
                          setFieldValue("bom", valueOption);
                        }}
                        placeholder="BOM"
                        errors={errors}
                        touched={touched}
                      />
                    </div> */}
                    {/* {!prId && (
                      <> */}
                    {values?.requestType?.label === "Service PR" && (
                      <>
                        <div className="col-lg-12">
                          <NewSelect
                            name="controllingUnit"
                            options={cuList || []}
                            isDisabled={
                              prId
                                ? true
                                : values?.requestType?.label === "Service PR"
                                  ? false
                                  : true
                            }
                            value={values?.controllingUnit}
                            label="Controlling Unit"
                            onChange={(valueOption) => {
                              setFieldValue("costElement", "");
                              setFieldValue("costCenter", "");
                              setFieldValue("controllingUnit", valueOption);
                              getCostCenterList(
                                profileData?.accountId,
                                selectedBusinessUnit?.value,
                                valueOption?.value,
                                setCostCenterList
                              );
                              getCostElementList(
                                profileData?.accountId,
                                selectedBusinessUnit?.value,
                                valueOption?.value,
                                setCostElementList
                              );
                            }}
                            placeholder="Controlling Unit"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-12">
                          <NewSelect
                            name="costCenter"
                            options={costCenterList || []}
                            value={values?.costCenter}
                            isDisabled={
                              prId
                                ? true
                                : values?.requestType?.label === "Service PR"
                                  ? false
                                  : true
                            }
                            label="Cost Center"
                            onChange={(valueOption) => {
                              setFieldValue("costCenter", valueOption);
                            }}
                            placeholder="Cost Center"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        {/* </>
                    )} */}
                        <div className="col-lg-12">
                          <NewSelect
                            name="costElement"
                            options={costElementList || []}
                            value={values?.costElement}
                            isDisabled={
                              prId
                                ? true
                                : values?.requestType?.label === "Service PR"
                                  ? false
                                  : true
                            }
                            label="Cost Element"
                            onChange={(valueOption) => {
                              setFieldValue("costElement", valueOption);
                            }}
                            placeholder="Cost Element"
                            errors={errors}
                            touched={touched}
                          />
                        </div>{" "}
                      </>
                    )}
                    <div className="col-lg-12">
                      <label>Required Date</label>
                      <InputField
                        value={values?.requiredDate}
                        name="requiredDate"
                        placeholder="Required Date"
                        type="date"
                      />
                    </div>

                    <div className="col-lg-12">
                      <label>Reference No.</label>
                      <InputField
                        value={values?.refNo}
                        name="refNo"
                        onChange={(e) => {
                          //if(e.target.value.length > 100) return;
                          setFieldValue("refNo", e.target.value);
                        }}
                        // disabled={prId}
                        placeholder="Reference No."
                        type="text"
                      />
                    </div>
                    {/* <div className="col-lg-6">
                      <label>Code</label>
                      <InputField
                        value={values?.code}
                        name="code"
                        placeholder="Code"
                        disabled={prId}
                        type="text"
                      />
                    </div> */}
                    <div className="col-lg-12">
                      <label>Address</label>
                      <InputField
                        value={values?.address}
                        name="address"
                        onChange={(e) => {
                          //if(e.target.value.length > 100) return;
                          setFieldValue("address", e.target.value);
                        }}
                        placeholder="Address"
                        // disabled={prId}
                        type="text"
                      />
                    </div>
                    <div className="col-lg-12">
                      <label>Purpose</label>
                      <InputField
                        value={values?.purpose}
                        name="purpose"
                        onChange={(e) => {
                          if (e.target.value.length > 100)
                            return setFieldValue("purpose", "");
                          setFieldValue("purpose", e.target.value);
                        }}
                        placeholder="Purpose"
                        // disabled={prId}
                        type="text"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-10">
                  <div
                    className="row global-form"
                    style={{ background: " #d6dadd" }}
                  >
                    <div className="col-lg-3">
                      <NewSelect
                        name="sbu"
                        options={sbuList || []}
                        value={values?.sbu}
                        label="SBU"
                        onChange={(v) => {
                          setFieldValue("sbu", v);
                        }}
                        placeholder="SBU"
                        errors={errors}
                        touched={touched}
                      />{" "}
                    </div>
                    {console.log("Values", values)}
                    <div className="col-lg-3">
                      <NewSelect
                        name="po"
                        options={poList || []}
                        value={values?.po}
                        label="Purchase Organization"
                        onChange={(v) => {
                          setFieldValue("po", v);
                        }}
                        placeholder="Purchase Organization"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="plant"
                        options={plantList || []}
                        value={values?.plant}
                        label="Plant"
                        onChange={(v) => {
                          getWhList(
                            profileData?.userId,
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            v?.value,
                            setWhList
                          );
                          setFieldValue("plant", v);
                          setFieldValue("wh", "");
                        }}
                        placeholder="Plant"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="wh"
                        options={whList || []}
                        value={values?.wh}
                        label="Warehouse"
                        onChange={(v) => {
                          setFieldValue("wh", v);
                          setFieldValue("address", v?.address);
                        }}
                        placeholder="Warehouse"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>

                  {type === "viewType" ? (
                    ""
                  ) : (
                    <div className="row global-form">
                      <div className="col-lg-4">
                        <label>Item Name</label>
                        <SearchAsyncSelect
                          selectedValue={values?.itemName}
                          handleChange={(valueOption) => {
                            setFieldValue("itemName", valueOption);
                            setFieldValue("uomName", "");
                            getUOMList(
                              valueOption?.value,
                              selectedBusinessUnit?.value,
                              profileData?.accountId,
                              setUOMList,
                              setFieldValue
                            );
                          }}
                          loadOptions={(v) => loadItemList(v, values)}
                          disabled={true}
                        />
                        <FormikError
                          errors={errors}
                          name="itemName"
                          touched={touched}
                        />
                      </div>

                      <div className="col-lg-2 pr-0">
                        <NewSelect
                          name="uomName"
                          options={uomList || []}
                          value={values?.uomName}
                          label="UOM"
                          onChange={(valueOption) => {
                            setFieldValue("uomName", valueOption);
                          }}
                          isDisabled={true}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg pr-0">
                        <label>Quantity</label>
                        <InputField
                          value={values?.quantity}
                          name="quantity"
                          type="number"
                          oninput="validity.valid||(value=value.replace(/\D+/g, ''))"
                          min="0"
                          onChange={(e) => {
                            // if (e.target.value === "")
                            //   return setFieldValue("quantity", "");
                            // if (+e.target.value === 0)
                            //   return setFieldValue("quantity", "");
                            // const valid = QuantityCheck(e.target.value);
                            // if (valid === false) return;
                            // setFieldValue(
                            //   "quantity",
                            //   e.target.value.replace(/\D/, "")
                            // );
                            setFieldValue("quantity", e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-lg-4 pr-0">
                        <label>Purpose</label>
                        <InputField
                          value={values?.rowPurpose}
                          name="rowPurpose"
                          type="text"
                          onChange={(e) => {
                            setFieldValue("rowPurpose", e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-lg-1 pr-0">
                        <button
                          onClick={() =>
                            setter(values, () => {
                              setFieldValue("itemName", "");
                              setFieldValue("uomName", "");
                              setFieldValue("quantity", "");
                              setFieldValue("rowPurpose", "");
                            })
                          }
                          style={{ marginTop: "18px" }}
                          type="button"
                          className="btn btn-primary"
                          disabled={
                            !values?.requiredDate ||
                            !values?.itemName ||
                            !values?.quantity ||
                            type === "viewType"
                          }
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}

                  <table className="global-table table">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}>SL</th>
                        {/* <th>Required Date</th> */}
                        <th style={{ width: "30px" }}>Code</th>
                        <th>Item Name</th>
                        <th style={{ width: "50px" }}>UOM</th>
                        <th style={{ width: "50px" }}>Quantity</th>
                        <th style={{ width: "120px" }}>Purpose</th>
                        {type === "viewType" ? (
                          ""
                        ) : (
                          <th style={{ width: "30px" }}>Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          {/* <td className="text-center">{item?.requiredDate}</td> */}
                          <td className="text-center" style={{ width: "30px" }}>
                            {item?.itemName?.itemCode || item?.itemName?.code}
                          </td>
                          <td className="ml-2" style={{ width: "150px" }}>
                            {item?.itemName?.itemName}
                          </td>
                          <td
                            style={{ maxWidth: "50px" }}
                            className="text-center"
                          >
                            {item?.uomName?.label ||
                              item?.itemName?.baseUoMName}
                          </td>
                          <td
                            style={{ maxWidth: "50px" }}
                            className="text-center"
                          >
                            {item?.quantity}
                          </td>
                          <td>{item?.rowPurpose}</td>
                          {type === "viewType" ? (
                            ""
                          ) : (
                            <td
                              style={{ maxWidth: "30px" }}
                              className="text-center align-middle"
                            >
                              <IDelete remover={remover} id={index} />
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
                onClick={() => setItemTypeId("")}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
