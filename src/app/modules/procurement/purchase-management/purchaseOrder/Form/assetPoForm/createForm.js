/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from "react";
import { Formik, Form, Field } from "formik";
import { ISelect } from "../../../../../_helper/_inputDropDown";
import { IInput } from "../../../../../_helper/_input";
import {
  validationSchema,
  initData,
  setInputFieldsFunc,
  getRefNoDdlFoAssetPo,
} from "./helper";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getPOItemForAssetItemDDLAction } from "../../_redux/Actions";
import RowDtoTable from "./rowDtoTable";
import { toast } from "react-toastify";
import TotalNetAmount from "../../TotalNetAmount";
import { getUniQueItems, lastPriceFunc } from "../../helper";
import SearchAsyncSelect from "./../../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../../_helper/_formikError";
import axios from "axios";
import TextArea from "../../../../../_helper/TextArea";
import useAxiosGet from "../../customHooks/useAxiosGet";
import NewSelect from "../../../../../_helper/_select";
import { getProfitCenterList } from "../assetStandardPo/helper";
import Loading from "../../../../../_helper/_loading";
import AttachmentUploaderNew from "../../../../../_helper/attachmentUploaderNew";

// This form is also used for standard PO

export default function AssetPOCreateForm({
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  isEdit,
}) {
  const [inputFields, setInputFields] = useState();
  const location = useLocation();
  const dispatch = useDispatch();
  const [rowDto, setRowDto] = useState([]);
  const [refNoDDL, setRefNoDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profitCenterList, setProfitCenterList] = useState([]);
  const [attachmentList, setAttachmentList] = useState([]);

  // redux store data
  const storeData = useSelector((state) => {
    return {
      supplierNameDDL: state.purchaseOrder.supplierNameDDL,
      currencyDDL: state.purchaseOrder.currencyDDL,
      paymentTermsDDL: state.purchaseOrder.paymentTermsDDL,
      incoTermsDDL: state.purchaseOrder.incoTermsDDL,
      poReferenceNoDDL: state.purchaseOrder.poReferenceNoDDL,
      poItemsDDL: state.purchaseOrder.poItemsDDL,
      // uomDDL: state.commonDDL.uomDDL,
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  }, shallowEqual);

  const {
    supplierNameDDL,
    currencyDDL,
    paymentTermsDDL,
    incoTermsDDL,
    poItemsDDL,
    // uomDDL,
    profileData,
    selectedBusinessUnit,
  } = storeData;

  useEffect(() => {
    // all input fields : this function will set our all input fields  , then we will use loop to generate input fields in UI
    setInputFieldsFunc(setInputFields, storeData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierNameDDL, currencyDDL, paymentTermsDDL, incoTermsDDL]);

  // add single item to row or add all item to row
  const addRowDtoData = (data, values) => {
    if (values?.isAllItem) {
      // get new items that not exit in rowdto
      const refferenceItems = getUniQueItems(data, rowDto, values);

      // show error if no new item found
      if (refferenceItems?.length === 0) {
        return toast.warn("Not allowed to duplicate items");
      }

      const newData = refferenceItems?.map((item, index) => {
        // const priceStructure = item?.priceStructure?.map((item) => ({
        //   ...item,
        //   value: item?.value || 0,
        //   amount: item?.amount || 0,
        // }));

        let obj = {
          ...values,
          item: { ...item },
          desc: "",
          selectedUom: { value: item?.uoMId, label: item?.uoMName },
          refQty: item?.refQty,
          orderQty: 0,
          restofQty: item?.restofQty || 0,
          netValue: 0,
          priceStructureTotal: 0,
          priceStructure: [], //priceStructure,
          basicPrice: 0,
          lastPrice: lastPriceFunc(item?.lastPoInfo) || 0,
          vat: 0,
          userGivenVatAmount: "",
          vatAmount: 0,
        };
        return obj;
      });
      setRowDto([...newData, ...rowDto]);
    } else {
      // if reference, can't add same reference and same item multiple
      // if not reference, can't add multiple item
      let arr;

      if (values?.referenceNo) {
        arr = rowDto?.filter(
          (item) =>
            item.referenceNo?.value === values?.referenceNo?.value &&
            item?.item?.value === values?.item?.value
        );
      } else {
        arr = rowDto?.filter(
          (item) => item?.item?.value === values?.item?.value
        );
      }

      if (arr?.length > 0) {
        toast.warn("Not allowed to duplicate items");
      } else {
        // const priceStructure = values?.item?.priceStructure?.map((item) => ({
        //   ...item,
        //   value: item?.value || 0,
        //   amount: item?.amount || 0,
        // }));

        const newData = {
          ...values,
          item: { ...values?.item },
          desc: "",
          selectedUom: {
            value: values?.item?.uoMId,
            label: values?.item?.uoMName,
          },
          orderQty: 0,
          refQty: values?.item?.refQty,
          restofQty: values?.item?.restofQty || 0,
          netValue: 0,
          priceStructureTotal: 0,
          priceStructure: [], //priceStructure,
          basicPrice: 0,
          lastPrice: lastPriceFunc(values?.item?.lastPoInfo) || 0,
          vat: 0,
          userGivenVatAmount: "",
          vatAmount: 0,
        };
        setRowDto([...rowDto, newData]);
      }
    }
  };

  // remove single data from rowDto
  const remover = (payload) => {
    // const filterArr = rowDto.filter((itm) => itm?.item?.value !== payload);

    const filterArr = rowDto.filter((itm) => {
      // don't filter other refference items
      if (itm?.referenceNo?.value !== payload?.referenceNo?.value) {
        return true;
      }
      // flter refference items via item id
      if (
        itm?.item?.value !== payload?.item?.value &&
        itm?.referenceNo?.value === payload?.referenceNo?.value
      ) {
        return true;
      } else {
        return false;
      }
    });
    setRowDto([...filterArr]);
  };

  const getItemDDL = (supplierId, refType, referenceNo) => {
    dispatch(
      getPOItemForAssetItemDDLAction(
        location?.state?.orderType?.value,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        location?.state?.sbu?.value,
        location?.state?.purchaseOrg?.value,
        location?.state?.plant?.value,
        location?.state?.warehouse?.value,
        supplierId,
        refType,
        referenceNo
      )
    );
  };

  useEffect(() => {
    getRefNoDDL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  // getRefNoDdlBySupplier
  const getRefNoDDL = (supplierId) => {
    getRefNoDdlFoAssetPo(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      location?.state?.sbu?.value,
      location?.state?.purchaseOrg?.value,
      location?.state?.plant?.value,
      location?.state?.warehouse?.value,
      location?.state?.refType?.label,
      setRefNoDDL
    );
  };

  const [transferBu, getTransferBu] = useAxiosGet();
  const [buTransaction, getBuTransaction] = useAxiosGet();

  const businessTransactionDDL = useMemo(() => {
    if (buTransaction?.length > 0) {
      let data = buTransaction.map((item) => ({
        ...item,
        value: item?.businessTransactionId,
        label: item?.businessTransactionName,
      }));
      return data;
    }
  }, [buTransaction]);

  const businessUnitDDL = useMemo(() => {
    if (transferBu?.length > 0) {
      let data = transferBu.map((item) => ({
        ...item,
        value: item?.businessUnitId,
        label: item?.businessUnitName,
      }));
      return data;
    }
  }, [transferBu]);

  useEffect(() => {
    getTransferBu(
      `/procurement/PurchaseOrder/TransferPoBusinessUnit?UnitId=${selectedBusinessUnit?.value}`
    );
    getBuTransaction(
      `/fino/BusinessTransaction/BusinessTransactionList?GroupId=1&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
  }, [selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          deliveryAddress: location?.state?.warehouse?.address,
          currency: currencyDDL[0],
          incoterms:
            location?.state?.purchaseOrg?.label === "Foreign Procurement"
              ? { value: 1, label: "CFR (Cost And Freight)" }
              : "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler({ ...values, attachmentList }, rowDto, () => {
            resetForm(initData);
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
            {loading && <Loading />}
            <Form className="form form-label-right po-label">
              <div className="global-form">
                <div className="form-group row">
                  <div className="col-lg-2">
                    <label>Supplier Name</label>
                    <SearchAsyncSelect
                      selectedValue={values.supplierName}
                      handleChange={(valueOption) => {
                        setFieldValue("supplierName", valueOption);
                        // setFieldValue("item", "");
                        // setFieldValue("referenceNo", "");
                      }}
                      loadOptions={(v) => {
                        if (v.length < 3) return [];
                        return axios
                          .get(
                            `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&SBUId=${location?.state?.sbu?.value}`
                          )
                          .then((res) => {
                            const updateList = res?.data.map((item) => ({
                              ...item,
                            }));
                            return updateList;
                          });
                      }}
                      disabled={true}
                      isDisabled={false}
                    />
                    <FormikError
                      errors={errors}
                      name="supplierName"
                      touched={touched}
                    />
                  </div>
                  {/* <div className="col-lg-2">
                    <ISelect
                      label="Supplier Name"
                      options={supplierNameDDL || []}
                      value={values?.supplierName}
                      dependencyFunc={(currentValue) => {
                        setFieldValue("item", "");
                        setFieldValue("referenceNo", "");

                        // if (location?.state?.refType?.value === 2) {
                        //   getRefNoDDL(currentValue)
                        // }

                        // if user select without reference in landing
                        if (location?.state?.refType?.value === 3) {
                          getItemDDL(currentValue, 3, 0)
                          //getItemDDL(currentValue, 3, 0);
                        }
                        // if user has reference, we call this action based on supplier selection and also based on reference selection in reference ddl
                        if (values?.referenceNo) {
                          getItemDDL(
                            values?.supplierName?.value,
                            location?.state?.refType?.value,
                            values?.referenceNo?.value
                          );
                        }
                      }}
                      name="supplierName"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  {inputFields?.map((item, index) =>
                    item.type === 1 ? (
                      <div key={index} className="col-lg-2">
                        <ISelect
                          label={item.label}
                          options={item.options}
                          defaultValue={values[item.name]}
                          name={item.name}
                          isDisabled={
                            item?.name === "incoterms" &&
                            location?.state?.purchaseOrg?.label ===
                              "Foreign Procurement"
                              ? false
                              : item?.disabled
                          }
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    ) : item.type === 2 ? (
                      <div key={index} className="col-lg-2">
                        <IInput
                          value={values[item.name]}
                          label={item.label}
                          name={item.name}
                          step="any"
                          min={item?.name === "cash" && 0}
                          max={item?.name === "cash" && 100}
                          disabled={
                            item?.name === "cash" &&
                            values?.paymentTerms?.label === "Credit"
                          }
                          type={item.isNum ? "number" : "text"}
                        />
                      </div>
                    ) : (
                      item.type === 3 && (
                        <div key={index} className="col-lg-2">
                          <IInput
                            value={values[item.name]}
                            label={item.label}
                            type="date"
                            name={item.name}
                            disabled={isEdit || item?.disabled}
                          />
                        </div>
                      )
                    )
                  )}
                  <div className="col-lg-2">
                    <IInput
                      value={values.freight}
                      label="Freight/Transport"
                      name={"freight"}
                      type={"number"}
                    />
                  </div>
                  <div className="col-lg-2">
                    <IInput
                      value={values.discount}
                      label={"Gross Discount"}
                      name={"discount"}
                      type={"number"}
                    />
                  </div>
                  <div className="col-lg-2">
                    <IInput
                      value={values.commision}
                      label={"Commission"}
                      name={"commision"}
                      type={"number"}
                    />
                  </div>
                  <div className="col-lg-2">
                    <IInput
                      value={values?.othersCharge}
                      label="Others Charge"
                      name="othersCharge"
                      type="number"
                    />
                  </div>
                  <div className="col-lg-2">
                    <IInput
                      value={values?.leadTimeDays}
                      label="Lead Time (Days)"
                      name="leadTimeDays"
                      type="number"
                    />
                  </div>
                  <div className="col-lg-2 mt-5">
                    <AttachmentUploaderNew
                      CBAttachmentRes={(attachmentData) => {
                        if (Array.isArray(attachmentData)) {
                          setAttachmentList(attachmentData);
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <div
                      style={{ marginTop: "23px" }}
                      className="d-flex align-items-center"
                    >
                      <span className="mr-2">Is Transfer</span>
                      <Field
                        type="checkbox"
                        name="isTransfer"
                        checked={values.isTransfer}
                        onChange={(e) => {
                          setFieldValue("isTransfer", e.target.checked);
                        }}
                      />
                    </div>
                  </div>
                  <div className={values.isTransfer ? "col-lg-6" : "col-lg-12"}>
                    {/* <IInput
                      value={values?.otherTerms}
                      label="Other Terms"
                      name="otherTerms"
                      type="text"
                    /> */}
                    <label>Other Terms</label>
                    <TextArea
                      value={values?.otherTerms}
                      name="otherTerms"
                      placeholder="Other Terms"
                      rows="1"
                      max={1000}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {values.isTransfer && (
                    <>
                      <div className="col-lg-2">
                        <NewSelect
                          label="Transfer Business unit"
                          options={businessUnitDDL}
                          value={values?.transferBusinessUnit}
                          name="transferBusinessUnit"
                          isDisabled={!values?.isTransfer}
                          onChange={(valueOption) => {
                            setFieldValue("transferBusinessUnit", valueOption);
                            getProfitCenterList(
                              valueOption?.value,
                              setProfitCenterList,
                              setLoading
                            );
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-2">
                        <NewSelect
                          name="profitCenter"
                          options={profitCenterList || []}
                          value={values?.profitCenter}
                          onChange={(valueOption) => {
                            setFieldValue("profitCenter", valueOption);
                          }}
                          label="Profit Center"
                          placeholder="Profit Center"
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.isTransfer}
                        />
                      </div>
                      <div className="col-lg-2">
                        <ISelect
                          label="Business Transaction"
                          options={businessTransactionDDL}
                          value={values?.businessTransaction}
                          name="businessTransaction"
                          isDisabled={!values?.isTransfer}
                          setFieldValue={setFieldValue}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </>
                  )}
                </div>
                {values?.supplierName?.label && (
                  <div style={{ marginTop: "-25px", color: "blue" }}>
                    <b>Supplier : {values?.supplierName?.label} , </b>
                    <b>
                      Supplier Address : {values?.supplierName?.supplierAddress}
                    </b>
                  </div>
                )}
                <div className="form-group row">
                  <div className="col-lg-2">
                    <ISelect
                      label="Reference No"
                      options={refNoDDL}
                      value={values?.referenceNo}
                      isDisabled={
                        location.state?.refType?.value === 3
                        // || !values?.supplierName
                      }
                      name="referenceNo"
                      dependencyFunc={(value, allValues, setFieldValue) => {
                        setFieldValue("item", "");
                        console.log(value);
                        if (location?.state?.refType?.value) {
                          getItemDDL(
                            values?.supplierName?.value,
                            location?.state?.refType?.value,
                            value
                          );
                        }
                      }}
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  {location.state?.refType?.value === 3 ? (
                    <div className="col-lg-4">
                      <label>Item</label>
                      <SearchAsyncSelect
                        selectedValue={values.item}
                        handleChange={(valueOption) => {
                          setFieldValue("item", valueOption);
                        }}
                        loadOptions={(v) => {
                          if (v.length < 3) return [];
                          return axios
                            .get(
                              `/procurement/PurchaseOrderItemDDL/AssetPurchaseOrderItemList?ItemTypeId=0&OrderTypeId=${
                                location?.state?.orderType?.value
                              }&AccountId=${
                                profileData?.accountId
                              }&BusinessUnitId=${
                                selectedBusinessUnit?.value
                              }&SbuId=${
                                location?.state?.sbu?.value
                              }&PurchaseOrgId=${
                                location?.state?.purchaseOrg?.value
                              }&PlantId=${
                                location?.state?.plant?.value
                              }&WearhouseId=${
                                location?.state?.warehouse?.value
                              }&RefTypeId=${
                                location?.state?.refType?.value
                              }&RefNoId=${0}&searchTerm=${v}`
                            )
                            .then((res) => {
                              const updateList = res?.data.map((item) => ({
                                ...item,
                              }));
                              return updateList;
                            });
                        }}
                        disabled={true}
                        // isDisabled={!values?.supplierName}
                      />
                      <FormikError
                        errors={errors}
                        name="item"
                        touched={touched}
                      />
                    </div>
                  ) : (
                    <div className="col-lg-4">
                      <ISelect
                        label="Item"
                        isDisabled={
                          location.state?.refType?.value === 3
                            ? values.isAllItem
                            : !values.referenceNo || values.isAllItem
                        }
                        options={poItemsDDL}
                        value={values.item}
                        name="item"
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )}

                  {location?.state?.refType?.value !== 3 && (
                    <div className="col-lg-1">
                      <Field
                        name={values.isAllItem}
                        component={() => (
                          <input
                            id="poIsAllItem"
                            type="checkbox"
                            style={{ marginTop: "25px" }}
                            className="mx-2"
                            value={values.isAllItem || ""}
                            checked={values.isAllItem}
                            name="isAllItem"
                            onChange={(e) => {
                              setFieldValue("isAllItem", e.target.checked);
                              setFieldValue("item", "");
                            }}
                          />
                        )}
                        label="isAllItem"
                      />
                      <label
                        style={{
                          position: "absolute",
                          top: "20px",
                        }}
                      >
                        All Item
                      </label>
                    </div>
                  )}
                  <div className="col-lg-1">
                    <button
                      type="button"
                      disabled={
                        location.state?.refType?.value === 3
                          ? !values.isAllItem
                            ? !values.item
                            : false
                          : !values.isAllItem
                          ? !values.referenceNo || !values.item
                          : !values.referenceNo
                      }
                      style={{
                        marginTop: "20px",
                        marginLeft:
                          location?.state?.refType?.value === 3
                            ? "0px"
                            : "-20px",
                      }}
                      className="btn btn-primary"
                      onClick={() => {
                        addRowDtoData(poItemsDDL, values);
                        if (location.state?.refType?.value === 3) {
                          setFieldValue("isAllItem", false);
                        }
                      }}
                    >
                      Add
                    </button>
                  </div>
                  <div
                    style={{ transform: "translateY(23px)" }}
                    className="col-lg"
                  >
                    <TotalNetAmount rowDto={rowDto} />
                  </div>
                </div>
              </div>

              {/* RowDto table */}
              <RowDtoTable
                // detect user is selected without refference or not
                isWithoutRef={location?.state?.refType?.value !== 3}
                remover={remover}
                rowDto={rowDto}
                setRowDto={setRowDto}
                // uomDDL={uomDDL}
                values={values}
                selectedBusinessUnit={selectedBusinessUnit}
                profileData={profileData}
              />

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
                onClick={() => {
                  setRowDto([]);
                }}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
