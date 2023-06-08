import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import { ISelect } from "../../../../../_helper/_inputDropDown";
import NewSelect from "../../../../../_helper/_select";
import { validationSchema, initData, getSupplierDDL } from "./helper";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  getreferenceTypeDDLAction,
  // getTransactionTypeDDLAction,
  getpersonnelDDLAction,
  // saveInventoryTransactionOrder,
  getStockDDLAction,
  getreferenceNoReceiveInvDDLAction,
  // getItemforReceiveInvAction,
  getItemListForIssueReturnAction,
  getItemforReceiveInvForeignPOAction,
  saveInventoryTransactionForIssue,
} from "../../_redux/Actions";
import RowDtoTable from "./rowDtoTable";
import SearchAsyncSelect from "./../../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../../_helper/_formikError";
// import { confirmAlert } from "react-confirm-alert";
import InputField from "../../../../../_helper/_inputField";
import { toast } from "react-toastify";
import { empAttachment_action } from "../../helper";
import { getForeignPurchaseDDL } from "../../helper";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { invTransactionSlice } from "../../_redux/Slice";
import Loading from "../../../../../_helper/_loading";
import axios from "axios";
const { actions: slice } = invTransactionSlice;

export default function ReceiveInvCreateForm({
  btnRef,
  resetBtnRef,
  disableHandler,
  landingData,
  isEdit,
}) {
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  const [rowDto, setRowDto] = useState([]);
  console.log("rowDtoooooo: ", rowDto);
  const [fileObjects, setFileObjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [supplierDDL, setSupplierDDL] = useState(false);
  const [foreignPurchaseDDL, setForeginPurchase] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  // redux store data
  const {
    referenceTypeDDL,
    referenceNoDDL,
    transactionTypeDDL,
    //busiPartnerDDL,
    //personelDDL,
    itemDDL,
    stockDDL,
    locationTypeDDL,
  } = useSelector((state) => state?.invTransa);

  let vatAmount = rowDto?.reduce((sum, data) => sum + data?.vatValue, 0);
  let totalVat = rowDto?.reduce((sum, data) => sum + data?.tatalVat, 0);
  let totalValue = rowDto?.reduce((sum, data) => sum + data?.totalValue, 0);
  let netValue = rowDto?.reduce((sum, data) => sum + data?.netValue, 0);

  const onChaneForRefType = (refTyp, setFieldValue = null) => {
    dispatch(
      getreferenceNoReceiveInvDDLAction(
        refTyp?.value,
        refTyp?.label,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        landingData?.sbu?.value,
        landingData?.plant?.value,
        landingData?.warehouse?.value,
        setFieldValue
      )
    );
  };

  //dispatch action creators
  useEffect(() => {
    dispatch(slice.setItemDDL([]));
    dispatch(getreferenceTypeDDLAction(landingData?.transGrup?.value));
    // dispatch(
    //   getBusinessPartnerDDLAction(
    //     profileData.accountId,
    //     selectedBusinessUnit.value
    //   )
    // );
    getSupplierDDL(
      profileData.accountId,
      selectedBusinessUnit.value,
      landingData?.sbu?.value,
      setSupplierDDL
    );
    dispatch(
      getpersonnelDDLAction(profileData.accountId, selectedBusinessUnit.value)
    );
    onChaneForRefType({ value: 5, label: "Inventory Request" });
    dispatch(getStockDDLAction());
    return () => {
      dispatch(slice.setItemDDL([]));
      dispatch(slice.setreferenceTypeDDL([]));
      dispatch(slice.setreferenceNoDDL([]));
      dispatch(slice.setTransactionTypeDDL([]));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData.accountId, selectedBusinessUnit.value]);

  // const onChangeForRefNo = (refNo, values) => {
  //   dispatch(
  //     getItemforReceiveInvAction(
  //       values?.refType?.value,
  //       values?.refType?.label,
  //       refNo?.value
  //     )
  //   );
  // };

  const onChangeForRefNo = (refNo, values) => {
    dispatch(getItemListForIssueReturnAction(refNo?.value));
  };

  //add row Dto Data
  const addRowDtoData = (values) => {
    if (values.isAllItem === false) {
      console.log("rowDto add rowdto data: ", rowDto);
      let data = rowDto?.filter((data) => data?.itemId === values?.item?.value);
      if (data?.length > 0) {
        toast.warning("Item Already added", { toastId: "receiveInventory" });
      } else {
        setRowDto([
          ...rowDto,
          {
            itemId: values?.item?.value,
            itemName: values?.item?.label,
            itemCode: values?.item?.code,
            uoMid: values?.item?.uoMId,
            uoMname: values?.item?.uoMName,
            refQty: values?.item?.refQty || 0,
            requestQty: values?.item?.requestQty || 0,
            restQty: values?.item?.restQty || 0,
            vatValue: values?.item?.vatValue || 0,
            returnQuntity: values?.item?.returnQty || 0,
            issueQuantity: values?.item?.issueQty || 0,
            baseValue:
              values.refType.label === "NA (Without Reference)"
                ? 0
                : values.item.baseValue,
            location: values?.item?.location
              ? [
                  {
                    value: values?.item?.location?.locationId,
                    label: values?.item?.location?.locationName,
                  },
                ]
              : [{ value: 0, label: "" }],
            stockType: { value: 1, label: "Open Stock" }, //values?.transType?.label === "Receive For PO To Blocked Stock" ? { value: 2, label: "Block Stock" } : { value: 1, label: "Open Stock" },
            quantity: Math.abs(values?.item?.issueQty),
            locationddl: values.item.location,
            discount: values?.item?.discount || 0,
            tatalVat: 0,
            totalValue: 0,
            netValue: 0,
            totalPoValue: values?.item?.totalPOValue,
          },
        ]);
      }
    } else {
      let data = itemDDL?.map((data) => {
        console.log("Dataaaaaaaa: ", data);
        return {
          itemId: data?.value,
          itemName: data?.label,
          uoMid: data.uoMId,
          uoMname: data?.uoMName,
          itemCode: data.code,
          refQty: data?.refQty || 0,
          restQty: data?.restQty || 0,
          requestQty: data?.requestQty || 0,
          vatValue: data?.vatValue || 0,
          returnQuntity: data.returnQty || 0,
          issueQuantity: data.issueQty,
          baseValue: data.baseValue || 0,
          location: data?.location
            ? [
                {
                  value: data?.location?.locationId,
                  label: data?.location?.locationName,
                },
              ]
            : [{ value: 0, label: "" }],
          stockType: { value: 1, label: "Open Stock" }, //values?.transType?.label === "Receive For PO To Blocked Stock" ? { value: 2, label: "Block Stock" } : { value: 1, label: "Open Stock" },
          quantity: Math.abs(data?.issueQty),
          locationddl: data.location,
          discount: data.discount || 0,
          tatalVat: 0,
          totalValue: 0,
          netValue: 0,
          totalPoValue: data?.totalPOValue,
        };
      });

      setRowDto(data);
    }
  };

  // remove single data from rowDto
  const remover = (payload) => {
    const filterArr = rowDto.filter((itm, index) => index !== payload);
    setRowDto([...filterArr]);
  };

  // rowdto handler for catch data from row's input field in rowTable
  const rowDtoHandler = (name, value, sl) => {
    let data = [...rowDto];
    let _sl = data[sl];
    if (name === "quantity") {
      _sl[name] = +value;
      _sl["tatalVat"] = (_sl?.vatValue / _sl?.refQty) * +value;
      _sl["totalValue"] = _sl?.baseValue * +value;
      _sl["netValue"] =
        (_sl?.vatValue / _sl?.refQty) * +value + _sl?.baseValue * +value;
    } else if (name === "baseValue") {
      _sl[name] = +value;
    } else {
      _sl[name] = value;
    }
    setRowDto(data);
  };

  // const IConfirmModal = (props) => {
  //   const { title, message, noAlertFunc } = props;
  //   return confirmAlert({
  //     title: title,
  //     message: message,
  //     buttons: [
  //       {
  //         label: "Ok",
  //         onClick: () => noAlertFunc(),
  //       },
  //     ],
  //   });

  // };

  const saveHandler = async (values, cb) => {
    // if(totalVat.toFixed(4) > 0 && values?.vatAmmount < 1) return toast.warn("Vat amount should be greater than zero")

    if (isDisabled) return "";
    if (rowDto?.length === 0) {
      toast.warning("Please Add Item", { toastId: "receiveInventory" });
    } else {
      if (values && profileData?.accountId && selectedBusinessUnit?.value) {
        let rowDataformet = rowDto
          .map((data) => {
            console.log("dataaaaa: ", data);
            return {
              itemId: data?.itemId,
              itemName: data?.itemName,
              uoMid: data?.uoMid,
              uoMname: data?.uoMname,
              numTransactionQuantity: Math.abs(data?.quantity),
              monTransactionValue: data?.baseValue ? data?.baseValue * data.quantity : 0,
              // monTransactionValue: values?.refType?.value === 1 ? ((data?.totalPoValue / data?.refQty) * data.quantity ) : data?.baseValue * data.quantity,
              inventoryLocationId: data?.locationddl
                ? data?.locationddl?.locationId
                : 0,
              inventoryLocationName: data?.locationddl
                ? data?.locationddl?.locationName
                : "",
              batchId: 0,
              batchNumber: "",
              inventoryStockTypeId: data.stockType ? data.stockType.value : 0,
              inventoryStockTypeName: data.stockType
                ? data.stockType.label
                : "",
              strBinNo: data?.location?.strBinNo
                ? data?.location?.strBinNo
                : "",
              vatAmount: data?.vatValue || 0,
              discount: data?.discount || 0,
            };
          })
          .filter((data) => data.numTransactionQuantity > 0);

        console.log(rowDataformet);

        // if (rowDataformet.length === 0) {
        //   toast.warning("Item Quantity Can not be zero");
        // } else {
        const payload = {
          objHeader: {
            transactionGroupId: landingData?.transGrup?.value,
            transactionGroupName: landingData?.transGrup?.label,
            transactionTypeId: values.transType.value,
            transactionTypeName: values.transType.label,
            referenceTypeId: values.refType.value,
            referenceTypeName: values.refType.label,
            referenceId: values.refNo.value || 0,
            referenceCode: values.refNo.label || "NA",
            accountId: profileData?.accountId,
            accountName: profileData?.accountName,
            businessUnitId: selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            sbuId: landingData?.sbu?.value,
            sbuName: landingData?.sbu?.label,
            plantId: landingData?.plant?.value,
            plantName: landingData?.plant?.label,
            warehouseId: landingData?.warehouse?.value,
            warehouseName: landingData?.warehouse?.label,
            businessPartnerId: values?.busiPartner.value,
            parsonnelId: values?.personnel?.value || 0,
            costCenterId: values?.costCenter?.value || -1,
            costCenterCode: values?.costCenter?.code || "",
            costCenterName: values?.costCenter?.label || "",
            projectId: values?.projName?.value || -1,
            projectCode: values?.projName?.code || "",
            projectName: values?.projName?.label || "",
            comments: values?.remarks || "",
            actionBy: profileData.userId,
            documentId: "",
            businessPartnerName: values?.busiPartner?.label,
            gateEntryNo: 0,
            challan: values?.challanNO,
            challanDateTime: values?.challanDate,
            vatChallan: 0,
            vatAmount: 0,
            grossDiscount: +values?.grossDiscount || 0,
            freight: +values?.freight || 0,
            commission: +values?.commission || 0,
            shipmentId: values?.foreignPurchase?.value || 0,
            othersCharge: +values?.othersCharge || 0,
          },
          objRow: rowDataformet,
          objtransfer: {},
        };
        let cb = () => {
          setDisabled(false);
        };
        if (fileObjects.length > 0) {
          setDisabled(true);
          empAttachment_action(fileObjects, cb).then((data) => {
            if (data?.length) {
              const modifyPlyload = {
                objHeader: {
                  ...payload?.objHeader,
                  documentId: data[0]?.id || "",
                },
                images: data?.map((data) => {
                  return {
                    imageId: data?.id,
                  };
                }),
                objRow: payload.objRow,
                objtransfer: {},
              };
              dispatch(
                saveInventoryTransactionForIssue(
                  { data: modifyPlyload, cb },
                  setRowDto,
                  setDisabled
                  // setFileObjects,
                  // IConfirmModal
                )
              );
            } else {
            }
          });
        } else {
          dispatch(
            saveInventoryTransactionForIssue(
              { data: payload, cb },
              setRowDto,
              setDisabled
            )
          );
          // toast.warning("Please Select Attachment")
        }
      }
      // }
      else {
      }
    }
  };

  return (
    <>
      {isDisabled && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {disableHandler && disableHandler(!isValid)}
            {console.log("values", values)}
            <Form className="form form-label-right po-label">
              <div className="form-group row inventory-form">
                <div className="col-lg-2">
                  <NewSelect
                    label="Reference Type"
                    options={referenceTypeDDL}
                    value={values?.refType}
                    name="refType"
                    isDisabled
                    placeholder="Reference Type"
                    onChange={(value) => {
                      if (value?.label) {
                        setFieldValue("refType", value);
                      }
                      onChaneForRefType(value, setFieldValue);
                      setFieldValue("refNo", "");
                      setFieldValue("item", "");
                      // setFieldValue("transType", "");
                      setFieldValue("busiPartner", "");
                      setFieldValue("freight", "");
                      setFieldValue("grossDiscount", "");
                      setFieldValue("commission", "");
                      setFieldValue("productCost", "");
                      setFieldValue("othersCharge", "");
                      setRowDto([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {values.refType.label === "Inventory Request" ? (
                  <div className="col-lg-2">
                    <label>Reference No</label>
                    <SearchAsyncSelect
                      selectedValue={values?.refNo}
                      handleChange={(valueOption) => {
                        setFieldValue("refNo", valueOption);
                        onChangeForRefNo(valueOption, values);
                        setFieldValue(
                          "busiPartner",
                          valueOption?.actionBy
                            ? {
                                value: valueOption.actionBy || 0,
                                label: valueOption.actionName || "",
                              }
                            : ""
                        );
                        setFieldValue("item", "");
                        setRowDto([]);
                      }}
                      loadOptions={(v) => {
                        if (v?.length < 3) return [];
                        return axios
                          .get(
                            `/wms/InventoryTransaction/GetReferenceNoForInventoryRequest?searchTerm=${v}&RefTypeId=7&RefTypeName=Inventory%20Request&accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&SbuId=${landingData?.sbu?.value}&PlantId=${landingData?.plant?.value}&WearhouseId=${landingData?.warehouse?.value}&IsActive=true&IsClosed=false`
                          )
                          .then((res) => {
                            const updateList = res?.data.map((item) => ({
                              ...item,
                              label: `${item?.label}`,
                            }));
                            return updateList;
                          });
                      }}
                      disabled={true}
                    />
                    <FormikError
                      errors={errors}
                      name="refNo"
                      touched={touched}
                    />
                  </div>
                ) : (
                  <div className="col-lg-2">
                    <NewSelect
                      label="Reference No"
                      options={referenceNoDDL}
                      value={values?.refNo}
                      name="refNo"
                      placeholder="Reference No"
                      onChange={(data) => {
                        setFieldValue("refNo", data);
                        setFieldValue("item", "");
                        setFieldValue("foreignPurchase", "");
                        if (
                          data?.purchaseOrganizationName ===
                          "Foreign Procurement"
                        ) {
                          dispatch(slice.setItemDDL([]));
                          getForeignPurchaseDDL(
                            data?.value,
                            landingData?.plant?.value,
                            setForeginPurchase
                          );
                        } else {
                          dispatch(
                            getItemforReceiveInvForeignPOAction(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              data?.value,
                              0
                            )
                          );
                        }

                        // if (
                        //   values.refType.label === 'STO (Stock Transfer Order)'
                        // ) {
                        //   setFieldValue('busiPartner', {
                        //     value: data.fromPlantId,
                        //     label:
                        //       data.fromPlantName + ',' + data.fromWearHouseName,
                        //   })
                        // } else {
                        setFieldValue(
                          "busiPartner",
                          data.supplierId
                            ? {
                                value: data.supplierId || 0,
                                label: data.supplierName || "",
                              }
                            : ""
                        );
                        setFieldValue("freight", data?.freight);
                        setFieldValue("grossDiscount", data?.grossDiscount);
                        setFieldValue("commission", data?.commission);
                        setFieldValue("productCost", data?.productCost);
                        // }
                        setRowDto([]);
                      }}
                      // setFieldValue={setFieldValue}
                      isDisabled={
                        values.refType.label === "NA (Without Reference)" ||
                        values.refType === ""
                      }
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
                {values?.refNo?.purchaseOrganizationName ===
                  "Foreign Procurement" && (
                  <div className="col-lg-2">
                    <NewSelect
                      label="Invoice"
                      options={foreignPurchaseDDL}
                      value={values?.foreignPurchase}
                      placeholder="Invoice"
                      name="foreignPurchase"
                      onChange={(value) => {
                        setFieldValue("foreignPurchase", value);
                        setRowDto([]);
                        dispatch(
                          getItemforReceiveInvForeignPOAction(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            values?.refNo?.value,
                            value?.value
                          )
                        );
                      }}
                      //setFieldValue={setFieldValue}
                      isDisabled={values.refType === ""}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
                <div className="col-lg-2">
                  <NewSelect
                    label="Transaction Type"
                    options={transactionTypeDDL}
                    value={values?.transType}
                    placeholder="Transaction Type"
                    name="transType"
                    onChange={(value) => {
                      setFieldValue("transType", value);
                    }}
                    //setFieldValue={setFieldValue}
                    isDisabled
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <NewSelect
                    label="Receive From"
                    options={supplierDDL}
                    value={values?.busiPartner}
                    placeholder="Receive From"
                    name="busiPartner"
                    onChange={(valueOption) => {
                      setFieldValue("busiPartner", valueOption);
                      // dispatch(getItemDDLForWithoutRefReceiveInvAction(profileData.accountId,
                      //   selectedBusinessUnit.value,
                      //   landingData?.plant?.value,
                      //   landingData?.warehouse?.value, valueOption?.value))
                    }}
                    //setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    isDisabled={
                      values.refType.label !== "NA (Without Reference)"
                    }
                  />
                </div>
                {/* <div className="col-lg-3">
                  <ISelect
                    label="Personnel"
                    options={personelDDL}
                    defaultValue={values?.personnel}
                    name="personnel"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div> */}

                <div className="col-lg-2">
                  <label>Challan</label>
                  <InputField
                    value={values?.challanNO}
                    placeholder="Challan"
                    name="challanNO"
                    autoComplete="off"
                  />
                </div>
                <div className="col-lg-2">
                  <label>Challan Date</label>
                  <InputField
                    value={values?.challanDate}
                    placeholder="Challan Date"
                    type="date"
                    name="challanDate"
                    autoComplete="off"
                  />
                </div>
                {/* <div className="col-lg-2">
                  <label>Vat Challan</label>
                  <InputField
                    value={values?.vatChallan}
                    placeholder="Vat Challan"
                    name="vatChallan"
                    autoComplete="off"
                  />
                </div> */}
                {/* <div className="col-lg-2">
                  <label>Vat Amount</label>
                  <InputField
                    value={values?.vatAmmount}
                    placeholder="Vat Amount"
                    type="number"
                    name="vatAmmount"
                    autoComplete="off"
                  />
                </div> */}
                {/* <div className="col-lg-2">
                  <label>Gate Entry No</label>
                  <InputField
                    value={values?.getEntry}
                    placeholder="Gate Entry No"
                    name="getEntry"
                    autoComplete="off"
                  />
                </div> */}
                {values.refType.value === 1 && (
                  <>
                    <div className="col-lg-2">
                      <label>Freight</label>
                      <InputField
                        value={values?.freight}
                        placeholder="Freight"
                        name="freight"
                        disabled={true}
                        type="number"
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>Gross Discount</label>
                      <InputField
                        value={values?.grossDiscount}
                        placeholder="Gross Discount"
                        type="number"
                        disabled={true}
                        name="grossDiscount"
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>Commission</label>
                      <InputField
                        value={values?.commission}
                        placeholder="Commission"
                        name="Commission"
                        disabled={true}
                        type="number"
                        autoComplete="off"
                      />
                    </div>
                  </>
                )}
                <div className="col-lg-2">
                  <label>Comments</label>
                  <InputField
                    value={values?.remarks}
                    placeholder="Comments"
                    name="remarks"
                    autoComplete="off"
                  />
                </div>
                {values?.refType?.value === 1 && (
                  <div className="col-lg-2">
                    <label>Others Charge</label>
                    <InputField
                      value={values?.othersCharge}
                      placeholder="Others Charge"
                      name="othersCharge"
                      autoComplete="off"
                      type="number"
                    />
                  </div>
                )}

                {values.refType.value === 1 && (
                  <>
                    {" "}
                    <div className="col-lg-2">
                      <label>Total Vat</label>
                      <InputField
                        value={vatAmount}
                        placeholder="Total Vat"
                        name="totalVat"
                        disabled={true}
                        autoComplete="off"
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>Product Cost</label>
                      <InputField
                        value={values?.productCost}
                        placeholder="Product Cost"
                        name="productCost"
                        disabled={true}
                        autoComplete="off"
                      />
                    </div>{" "}
                  </>
                )}

                {/* <div className="col-lg-3 mt-5">
                  <button
                    className="btn btn-primary mr-2"
                    type="button"
                    onClick={() => setOpen(true)}
                  >
                    Attachment
                  </button>
                </div> */}
              </div>

              <div className="form-group row inventory-form">
                {values.refType.label === "NA (Without Reference)" ? (
                  <div className="col-lg-3">
                    <label>Item</label>
                    <SearchAsyncSelect
                      selectedValue={values.item}
                      handleChange={(valueOption) => {
                        setFieldValue("item", valueOption);
                      }}
                      loadOptions={(v) => {
                        if (v?.length < 3) return [];
                        return axios
                          .get(
                            `/wms/InventoryTransaction/GetItemForReceiveInventory?accountId=${profileData.accountId}&businessUnitId=${selectedBusinessUnit?.value}&plantId=${landingData?.plant?.value}&warehouseId=${landingData?.warehouse?.value}&searchTerm=${v}&RefTypeId=${values?.refType?.value}`
                          )
                          .then((res) => {
                            const updateList = res?.data.map((item) => ({
                              ...item,
                              label: `${item?.label} [${item?.code}]`,
                            }));
                            return updateList;
                          });
                      }}
                      disabled={true}
                    />
                    <FormikError
                      errors={errors}
                      name="item"
                      touched={touched}
                    />
                  </div>
                ) : (
                  <div className="col-lg-3">
                    <ISelect
                      label="Item"
                      options={itemDDL}
                      value={values.item}
                      name="item"
                      setFieldValue={setFieldValue}
                      isDisabled={
                        values.isAllItem === true || values.refType === ""
                      }
                      isOptionSelected={(option, selectValue) =>
                        selectValue.some((i) => i === option)
                      }
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
                <div className="col-lg-3">
                  {/* <Field
                    name="isAllItem"
                    component={() => ( */}
                  <input
                    style={{
                      position: "absolute",
                      top: "30px",
                      left: "65px",
                    }}
                    disabled={values.refType.label === "NA (Without Reference)"}
                    id="isAllItem"
                    type="checkbox"
                    className="ml-2"
                    value={values.isAllItem}
                    checked={values.isAllItem}
                    name="isAllItem"
                    onChange={(e) => {
                      setFieldValue("isAllItem", e.target.checked);
                      setFieldValue("item", "");
                    }}
                  />
                  {/* )}
                    label="isAllItem"
                  /> */}
                  <label
                    style={{
                      position: "absolute",
                      top: "21px",
                    }}
                  >
                    All Item
                  </label>

                  <button
                    type="submit"
                    style={{ marginTop: "23px", transform: "translateX(95px)" }}
                    className="btn btn-primary ml-2"
                    disabled={values.item === "" && values.isAllItem === false}
                    onClick={() => {
                      addRowDtoData(values);
                      setFieldValue("item", "");
                      setFieldValue("isAllItem", false);
                    }}
                  >
                    Add
                  </button>
                </div>
                {values.refType.value === 1 && (
                  <div
                    className="col-lg-6 d-flex align-items-end justify-content-end"
                    // style={{ marginTop: "45px" }}
                  >
                    <span className="mr-2 mt-auto font-weight-bold">
                      Vat: {totalVat.toFixed(4)}
                    </span>
                    <span className="mr-2 mt-auto font-weight-bold">
                      Amount: {totalValue.toFixed(4)}
                    </span>
                    <span className="mr-2 mt-auto font-weight-bold">
                      Net Amount: {netValue.toFixed(4)}
                    </span>
                  </div>
                )}
              </div>

              {/* RowDto table */}
              <RowDtoTable
                rowDtoHandler={rowDtoHandler}
                remover={remover}
                rowDto={rowDto}
                setRowDto={setRowDto}
                stockDDL={stockDDL}
                locationTypeDDL={locationTypeDDL}
                values={values}
              />

              <DropzoneDialogBase
                filesLimit={3}
                acceptedFiles={["image/*"]}
                fileObjects={fileObjects}
                cancelButtonText={"cancel"}
                submitButtonText={"submit"}
                maxFileSize={1000000}
                open={open}
                onAdd={(newFileObjs) => {
                  setFileObjects(fileObjects.concat(newFileObjs));
                  //setFileObjects([].concat(newFileObjs));
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
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
              />

              {/* <DropzoneDialogBase
                filesLimit={5}
                acceptedFiles={["image/*", "application/pdf"]}
                fileObjects={fileObjects}
                cancelButtonText={"cancel"}
                submitButtonText={"submit"}
                maxFileSize={3000000000000}
                open={open}
                onAdd={(newFileObjs) => {
                  setFileObjects(fileObjects.concat(newFileObjs));
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
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
              /> */}

              <button
                type="button"
                style={{ display: "none" }}
                ref={btnRef}
                onClick={() => handleSubmit()}
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
