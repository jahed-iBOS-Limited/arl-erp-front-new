import axios from "axios";
import { Form, Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import { getImageuploadStatus } from "../../../_helper/_commonApi";
import IForm from "../../../_helper/_form";
import FormikError from "../../../_helper/_formikError";
import { ISelect } from "../../../_helper/_inputDropDown";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import { compressfile } from "../../../_helper/compressfile";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import RowDtoTable from "../invTransaction/Form/receiveInventory/rowDtoTable";
import {
    getItemforReceiveInvAction,
    getItemforReceiveInvForeignPOAction,
    getStockDDLAction,
    getTransactionTypeDDLAction,
    getpersonnelDDLAction,
    getreferenceNoReceiveInvDDLAction,
    getreferenceTypeDDLAction,
    saveInventoryTransactionOrder,
} from "../invTransaction/_redux/Actions";
import { invTransactionSlice } from "../invTransaction/_redux/Slice";
import {
    getForeignPurchaseDDL,
    getSupplierDDL,
    initData,
    uploadAttachment,
    validationSchemaForMRR,
} from "./helper";
const { actions: slice } = invTransactionSlice;
export default function CreateMRR() {
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const dispatch = useDispatch();
  const [rowDto, setRowDto] = useState([]);
  const [fileObjects, setFileObjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [supplierDDL, setSupplierDDL] = useState(false);
  const [foreignPurchaseDDL, setForeginPurchase] = useState([]);
  const { state } = useLocation();
  const [qcInformationForMRR, getQcInformationForMRR] = useAxiosGet();
  const [modifiedIntiData, setModifiedInitData] = useState();
  const [itemsDDL,setItemsDDL]=useState([])
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
    stockDDL,
    locationTypeDDL,
  } = useSelector((state) => state?.invTransa);

  let vatAmount = rowDto?.reduce((sum, data) => sum + data?.vatValue, 0);
  let totalVat = rowDto?.reduce((sum, data) => sum + data?.tatalVat, 0);
  let totalValue = rowDto?.reduce((sum, data) => sum + data?.totalValue, 0);
  let netValue = rowDto?.reduce((sum, data) => sum + data?.netValue, 0);

  console.log("rowDto", rowDto);

  //dispatch action creators
  useEffect(() => {
    dispatch(slice.setItemDDL([]));
    dispatch(getreferenceTypeDDLAction(state?.transactionGroupId));
    getSupplierDDL(
      profileData.accountId,
      selectedBusinessUnit.value,
      qcInformationForMRR?.businessUnitId,
      setSupplierDDL
    );
    dispatch(
      getpersonnelDDLAction(profileData.accountId, selectedBusinessUnit.value)
    );
    dispatch(getStockDDLAction());
    return () => {
      dispatch(slice.setItemDDL([]));
      dispatch(slice.setreferenceTypeDDL([]));
      dispatch(slice.setreferenceNoDDL([]));
      dispatch(slice.setTransactionTypeDDL([]));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData.accountId, selectedBusinessUnit.value, state]);

  useEffect(() => {
    getQcInformationForMRR(
      `/mes/QCTest/GetQcInformationForMrr?transactionRefTypeId=${state?.transactionGroupId}&businessUnitId=${selectedBusinessUnit?.value}&purchaseOrderId=${state?.purchaseOrderId}&gateItemEntryListId=${state?.gateEntryListId}`,
      (data) => {
        const makeInitData = {
          refType: "",
          refNo: {
            value: data?.poData?.purchaseOrderId,
            label: data?.poData?.purchaseOrderCode,
          },
          transType: "",
          busiPartner: {
            value: data?.poData?.supplierId,
            label: data?.poData?.supplierName,
          },
          personnel: "",
          remarks: "",
          item: "",
          costCenter: "",
          projName: "",
          isAllItem: false,
          getEntry: data?.poData?.gateEntryCode,
          file: "",
          challanNO: "",
          challanDate: "",
          vatChallan: "",
          vatAmmount: "",
          freight: data?.poData?.freight,
          grossDiscount: data?.poData?.grossDiscount,
          commission: data?.poData?.commission,
          foreignPurchase: "",
          othersCharge: data?.poData?.othersCharge,
          productCost: data?.poData?.productCost,
        };
        const updatedItems = data?.itemData?.map(item=>({...item,value:item?.itemId,label:item?.itemName}))
        setModifiedInitData(makeInitData);
        setItemsDDL(updatedItems)
        
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const onChaneForRefType = (refTyp, setFieldValue) => {
    if (refTyp?.label === "PO (Purchase Order)") {
      dispatch(
        getreferenceNoReceiveInvDDLAction(
          refTyp?.value,
          refTyp?.label,
          profileData?.accountId,
          selectedBusinessUnit?.value,
          qcInformationForMRR?.poData?.businessUnitId,
          qcInformationForMRR?.poData?.plantId,
          qcInformationForMRR?.poData?.warehouseId,
          setFieldValue
        )
      );
    }
    dispatch(
      getTransactionTypeDDLAction(
        state?.transactionGroupId,
        refTyp?.value,
        setFieldValue
      )
    );
    // if (refTyp.label === 'NA (Without Reference)') {
    //   dispatch(
    //     getItemDDLForWithoutRefAction(
    //       profileData.accountId,
    //       selectedBusinessUnit.value,
    //       landingData?.plant?.value,
    //       landingData?.warehouse?.value
    //     )
    //   )
    // }
  };

  const onChangeForRefNo = (refNo, values) => {
    dispatch(
      getItemforReceiveInvAction(
        values?.refType?.value,
        values?.refType?.label,
        refNo?.value
      )
    );
  };

  //add row Dto Data
  const addRowDtoData = (values) => {
    if (values.isAllItem === false) {
      let data = rowDto?.filter((data) => data?.itemId === values?.item?.value);
      if (data?.length > 0) {
        toast.warning("Item Already added", { toastId: "receiveInventory" });
      } else {
        setRowDto([
          ...rowDto,
          {
            referenceId: values?.item?.referenceId, //nai
            itemId: values?.item?.value,
            itemName: values?.item?.itemName,
            itemCode: values?.item?.itemCode,
            uoMid: values?.item?.baseUoMId,
            uoMname: values?.item?.baseUoMName,
            refQty: values?.item?.refQty || 0,
            restQty: values?.item?.restQty || 0,
            vatValue: values?.item?.vatValue || 0,
            returnQuntity: values?.item?.returnQty || 0,
            issueQuantity: values?.item?.issueQty || 0,
            baseValue:
              values.refType.label === "NA (Without Reference)"
                ? 0
                : values.item.baseValue,
            location: values?.item?.locationDDL[0],
            stockType: { value: 1, label: "Open Stock" }, //values?.transType?.label === "Receive For PO To Blocked Stock" ? { value: 2, label: "Block Stock" } : { value: 1, label: "Open Stock" },
            quantity: "",
            locationddl: values.item.locationDDL,
            discount: values?.item?.discount || 0,
            tatalVat: 0,
            totalValue: 0,
            netValue: 0,
            totalPoValue: values?.item?.totalPOValue,
            purchaseRate: values?.item?.purchaseRate || 0,
            salesRate: values?.item?.salesRate || 0,
            mrpRate: values?.item?.mrpRate || 0,
            expiredDate: _todayDate(),
          },
        ]);
      }
    } else {
      let data = itemsDDL?.map((data) => {
        return {
          referenceId: data?.intReferenceId || 0,
          itemId: data?.value,
          itemName: data.itemName,
          uoMid: data.baseUoMId,
          uoMname: data.baseUoMName,
          itemCode: data.code,
          refQty: data?.refQty || 0,
          restQty: data?.restQty || 0,
          vatValue: data?.vatValue || 0,
          returnQuntity: data.returnQty || 0,
          issueQuantity: data.issueQty,
          baseValue: data.baseValue || 0,
          location: data.locationDDL[0],
          stockType: { value: 1, label: "Open Stock" }, //values?.transType?.label === "Receive For PO To Blocked Stock" ? { value: 2, label: "Block Stock" } : { value: 1, label: "Open Stock" },
          quantity: "",
          locationddl: data.locationDDL,
          discount: data.discount || 0,
          tatalVat: 0,
          totalValue: 0,
          netValue: 0,
          totalPoValue: data?.totalPOValue,
          purchaseRate: data?.purchaseRate || 0,
          salesRate: data?.salesRate || 0,
          mrpRate: data?.mrpRate || 0,
          expiredDate: _todayDate(),
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
      _sl[name] = value ? +value : value;
      _sl["tatalVat"] = (_sl?.vatValue / _sl?.refQty) * +value;
      _sl["totalValue"] = _sl?.baseValue.toFixed(2) * +value;
      _sl["netValue"] =
        (_sl?.vatValue / _sl?.refQty) * +value +
        _sl?.baseValue.toFixed(2) * +value;
    } else if (name === "baseValue") {
      _sl[name] = value ? +value : value;
    } else {
      _sl[name] = value;
    }
    setRowDto(data);
  };

  const IConfirmModal = (props) => {
    const { title, message, noAlertFunc } = props;
    return confirmAlert({
      title: title,
      message: message,
      buttons: [
        {
          label: "Ok",
          onClick: () => noAlertFunc(),
        },
      ],
    });
  };

  const saveHandler = async (values, cb) => {
    if (totalVat.toFixed(4) > 0 && values?.vatAmmount < 1)
      return toast.warn("Vat amount should be greater than zero");

    if (totalVat == 0 && values?.vatAmmount > 0)
      return toast.warn("Vat amount should be zero, because total amount zero");

    if (
      values?.refType?.value === 1 &&
      (!values?.challanNO || !values?.challanDate)
    )
      return toast.warn("Challan and Challan Date is required");

    if (isDisabled) return "";
    if (rowDto.length === 0) {
      toast.warning("Please Add Item", { toastId: "receiveInventory" });
    } else {
      if (values && profileData?.accountId && selectedBusinessUnit?.value) {
        let rowDataformet = rowDto
          .map((data) => {
            return {
              referenceId: data?.referenceId || 0,
              itemId: data?.itemId,
              itemName: data?.itemName,
              uoMid: data?.uoMid,
              uoMname: data?.uoMname,
              numTransactionQuantity: +data?.quantity,
              monTransactionValue: data?.baseValue * data.quantity,
              // monTransactionValue: values?.refType?.value === 1 ? ((data?.totalPoValue / data?.refQty) * data.quantity ) : data?.baseValue * data.quantity,
              inventoryLocationId: data?.location?.value,
              inventoryLocationName: data?.location?.label,
              batchId: 0,
              batchNumber: "",
              inventoryStockTypeId: data.stockType.value,
              inventoryStockTypeName: data.stockType.label,
              strBinNo: data?.location?.binNumber || "",
              vatAmount: data?.vatValue || 0,
              discount: data?.discount || 0,
              purchaseRate: data?.purchaseRate || 0,
              salesRate: +data?.salesRate || 0,
              mrpRate: +data?.mrpRate || 0,
              expiredDate: data?.expiredDate,
            };
          })
          .filter((data) => data.numTransactionQuantity > 0);

        if (rowDataformet.length === 0) {
          toast.warning("Item Quantity Can not be zero");
        } else {
          const payload = {
            objHeader: {
              transactionGroupId: state?.transactionGroupId,
              transactionGroupName: state?.transactionGroupName,
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
              sbuId: qcInformationForMRR?.businessUnitId,
              sbuName: qcInformationForMRR?.businessUnitName,
              plantId: qcInformationForMRR?.plantId,
              plantName: qcInformationForMRR?.plantName,
              warehouseId: qcInformationForMRR?.warehouseId,
              warehouseName: qcInformationForMRR?.warehouseName,
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
              gateEntryNo: values?.getEntry,
              challan: values?.challanNO,
              challanDateTime: values?.challanDate,
              vatChallan: values?.vatChallan,
              vatAmount: +values?.vatAmmount || 0,
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
          try {
            setDisabled(true);
            const modifyPlyload = {
              objHeader: {
                ...payload?.objHeader,
                documentId: "",
              },
              images: [],
              objRow: payload.objRow,
              objtransfer: {},
            };
            //   modifyPlyload.objHeader["isPOS"] =
            //     landingData?.warehouse?.isPOS &&
            //     modifyPlyload?.objHeader?.referenceTypeId === 1
            //       ? true
            //       : false;
            let compressedFile = [];
            if (fileObjects?.length > 0) {
              compressedFile = await compressfile(
                fileObjects?.map((f) => f?.file)
              );
            }
            const r = await getImageuploadStatus(profileData?.accountId);
            if (r?.data) {
              if (compressedFile.length < 1) {
                setDisabled(false);
                return toast.warn("Attachment required");
              } else {
                uploadAttachment(
                  compressedFile?.map((item) => ({ file: item }))
                )
                  .then((res) => {
                    if (res?.data?.length) {
                      modifyPlyload["documentId"] = res?.data?.[0]?.id || "";
                      modifyPlyload["images"] = res?.data?.map((data) => {
                        return {
                          imageId: data?.id,
                        };
                      });
                      dispatch(
                        saveInventoryTransactionOrder(
                          { data: modifyPlyload, cb },
                          setRowDto,
                          setDisabled,
                          setFileObjects,
                          IConfirmModal
                        )
                      );
                    }
                  })
                  .catch((error) => {
                    setDisabled(false);
                  });
              }
            } else {
              if (compressedFile.length > 0) {
                uploadAttachment(
                  compressedFile?.map((item) => ({ file: item }))
                )
                  .then((res) => {
                    if (res?.data?.length) {
                      modifyPlyload["documentId"] = res?.data[0]?.id || "";
                      modifyPlyload["images"] = res?.data?.map((data) => {
                        return {
                          imageId: data?.id,
                        };
                      });
                      dispatch(
                        saveInventoryTransactionOrder(
                          { data: modifyPlyload, cb },
                          setRowDto,
                          setDisabled,
                          setFileObjects,
                          IConfirmModal
                        )
                      );
                    }
                  })
                  .catch((error) => {
                    setDisabled(false);
                  });
              } else {
                dispatch(
                  saveInventoryTransactionOrder(
                    { data: modifyPlyload, cb },
                    setRowDto,
                    setDisabled,
                    setFileObjects,
                    IConfirmModal
                  )
                );
              }
            }
          } catch (error) {
            setDisabled(false);
            toast.error("File upload error");
          }
        }
      } else {
      }
    }
  };
  console.log("modifiedIntiData", modifiedIntiData);

  return (
    <>
      {isDisabled && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={modifiedIntiData ? modifiedIntiData : initData}
        validationSchema={validationSchemaForMRR}
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
          <IForm title="Create Receive MRR" getProps={setObjprops}>
            {/* {disableHandler && disableHandler(!isValid)} */}
            <Form className="form form-label-right po-label">
              <div className="form-group row inventory-form">
                <div className="col-lg-2">
                  <NewSelect
                    label="Reference Type"
                    options={[referenceTypeDDL[0]]}
                    value={values?.refType}
                    name="refType"
                    placeholder="Reference Type"
                    onChange={(value) => {
                      if (value?.label) {
                        setFieldValue("refType", value);
                      }
                      onChaneForRefType(value, setFieldValue);
                      //   setFieldValue("refNo", "");
                      //   setFieldValue("item", "");
                      //   // setFieldValue("transType", "");
                      //   setFieldValue("busiPartner", "");
                      //   setFieldValue("freight", "");
                      //   setFieldValue("grossDiscount", "");
                      //   setFieldValue("commission", "");
                      //   setFieldValue("productCost", "");
                      //   setFieldValue("othersCharge", "");
                      setRowDto([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <label>Reference No</label>
                  <SearchAsyncSelect
                    selectedValue={values?.refNo}
                    isDisabled={state}
                    handleChange={(data) => {
                      setFieldValue("refNo", data);
                      setFieldValue("item", "");
                      setFieldValue("othersCharge", data?.othersCharge || 0);
                      setFieldValue("foreignPurchase", "");
                      if (
                        data?.purchaseOrganizationName === "Foreign Procurement"
                      ) {
                        dispatch(slice.setItemDDL([]));
                        getForeignPurchaseDDL(
                          data?.value,
                          qcInformationForMRR?.plantId,
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
                        data?.supplierId
                          ? {
                              value: data?.supplierId || 0,
                              label: data?.supplierName || "",
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
                    loadOptions={(v) => {
                      if (v?.length < 3) return [];
                      return axios
                        .get(
                          `/wms/InventoryTransaction/GetPoNoForInventory?PoTypeId=1&businessUnitId=${selectedBusinessUnit?.value}&SbuId=${qcInformationForMRR?.businessUnitId}&PlantId=${qcInformationForMRR?.plantId}&WearhouseId=${qcInformationForMRR?.warehouseId}&Search=${v}`
                        )
                        .then((res) => {
                          // const updateList = res?.data.map((item) => ({
                          //   ...item,
                          //   label: `${item?.label}`,
                          // }));
                          return res?.data;
                        });
                    }}
                  />
                  <FormikError errors={errors} name="refNo" touched={touched} />
                </div>
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
                    isDisabled={values.refType === ""}
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
                <div className="col-lg-2">
                  <label>Vat Challan</label>
                  <InputField
                    value={values?.vatChallan}
                    placeholder="Vat Challan"
                    name="vatChallan"
                    autoComplete="off"
                  />
                </div>
                <div className="col-lg-2">
                  <label>Gate Entry No</label>
                  <InputField
                    value={values?.getEntry}
                    placeholder="Gate Entry No"
                    name="getEntry"
                    autoComplete="off"
                  />
                </div>
                <div className="col-lg-2">
                  <label>Vat Amount</label>
                  <InputField
                    value={values?.vatAmmount}
                    placeholder="Vat Amount"
                    type="number"
                    name="vatAmmount"
                    autoComplete="off"
                  />
                </div>

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
                      disabled
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

                <div className="col-lg-3 mt-5">
                  <button
                    className="btn btn-primary mr-2"
                    type="button"
                    onClick={() => setOpen(true)}
                  >
                    Attachment
                  </button>
                </div>
              </div>

              <div className="form-group row inventory-form">
                <div className="col-lg-3">
                  <ISelect
                    label="Item"
                    options={itemsDDL}
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
                //   landingData={landingData}
              />

              <DropzoneDialogBase
                filesLimit={3}
                acceptedFiles={["image/*", "application/pdf"]}
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
                ref={objProps.btnRef}
                onClick={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps.resetBtnRef}
                onSubmit={() => resetForm(initData)}
                onClick={() => {
                  setRowDto([]);
                }}
              ></button>
            </Form>
          </IForm>
        )}
      </Formik>
    </>
  );
}
