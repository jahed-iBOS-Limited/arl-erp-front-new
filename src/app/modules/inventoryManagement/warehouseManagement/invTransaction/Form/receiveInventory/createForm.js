/* eslint-disable eqeqeq */
import axios from "axios";
import { Form, Formik } from "formik";
import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getImageuploadStatus } from "../../../../../_helper/_commonApi";
import { ISelect } from "../../../../../_helper/_inputDropDown";
import InputField from "../../../../../_helper/_inputField";
import Loading from "../../../../../_helper/_loading";
import NewSelect from "../../../../../_helper/_select";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { compressfile } from "../../../../../_helper/compressfile";
import {
  getItemforReceiveInvAction,
  getItemforReceiveInvForeignPOAction,
  getStockDDLAction,
  getTransactionTypeDDLAction,
  getpersonnelDDLAction,
  getreferenceNoReceiveInvDDLAction,
  getreferenceTypeDDLAction,
  saveInventoryTransactionOrder,
} from "../../_redux/Actions";
import { invTransactionSlice } from "../../_redux/Slice";
import { getForeignPurchaseDDL, uploadAttachment } from "../../helper";
import SearchAsyncSelect from "./../../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../../_helper/_formikError";
import { getSupplierDDL, initData, validationSchema } from "./helper";
import RowDtoTable from "./rowDtoTable";
const { actions: slice } = invTransactionSlice;

export default function ReceiveInvCreateForm({ btnRef, resetBtnRef, disableHandler, landingData, isEdit }) {
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  const dispatch = useDispatch();
  const [rowDto, setRowDto] = useState([]);
  const [fileObjects, setFileObjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [supplierDDL, setSupplierDDL] = useState(false);
  const [foreignPurchaseDDL, setForeginPurchase] = useState([]);
  const [inLineRowItemView, setInLineRowItemView] = useState({
    isView: false,
    data: {},
  });

  const [items, setItems] = useState(rowDto);
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

  const [quantity, setQuantity] = useState();

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
    getSupplierDDL(profileData.accountId, selectedBusinessUnit.value, landingData?.sbu?.value, setSupplierDDL);
    dispatch(getpersonnelDDLAction(profileData.accountId, selectedBusinessUnit.value));
    dispatch(getStockDDLAction());
    return () => {
      dispatch(slice.setItemDDL([]));
      dispatch(slice.setreferenceTypeDDL([]));
      dispatch(slice.setreferenceNoDDL([]));
      dispatch(slice.setTransactionTypeDDL([]));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData.accountId, selectedBusinessUnit.value]);

  const onChaneForRefType = (refTyp, setFieldValue) => {
    if (refTyp?.label === "PO (Purchase Order)") {
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
    }
    dispatch(getTransactionTypeDDLAction(landingData?.transGrup?.value, refTyp?.value, setFieldValue));
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
    dispatch(getItemforReceiveInvAction(values?.refType?.value, values?.refType?.label, refNo?.value));
  };

  //add row Dto Data
  const addRowDtoData = (values) => {
    if (values.isAllItem === false) {
      let data = rowDto?.filter((data) => data?.itemId === values?.item?.value);
      if (data?.length > 0) {
        toast.warning("Item Already added", { toastId: "receiveInventory" });
      } else {
        const dto = [
          ...rowDto,
          {
            referenceId: values?.item?.intReferenceId,
            itemId: values?.item?.value,
            itemName: values?.item?.itemName,
            itemCode: values?.item?.code,
            uoMid: values?.item?.baseUoMId,
            uoMname: values?.item?.baseUoMName,
            refQty: values?.item?.refQty || 0,
            restQty: values?.item?.restQty || 0,
            vatValue: values?.item?.vatValue || 0,
            returnQuntity: values?.item?.returnQty || 0,
            issueQuantity: values?.item?.issueQty || 0,
            baseValue: values.refType.label === "NA (Without Reference)" ? 0 : values.item.baseValue,
            location: values.item.locationddl[0],
            stockType: { value: 1, label: "Open Stock" }, //values?.transType?.label === "Receive For PO To Blocked Stock" ? { value: 2, label: "Block Stock" } : { value: 1, label: "Open Stock" },
            quantity: "",
            locationddl: values.item.locationddl,
            discount: values?.item?.discount || 0,
            tatalVat: 0,
            totalValue: 0,
            netValue: 0,
            totalPoValue: values?.item?.totalPOValue,
            purchaseRate: values?.item?.purchaseRate || 0,
            salesRate: values?.item?.salesRate || 0,
            mrpRate: values?.item?.mrpRate || 0,
            expiredDate: _todayDate(),
            isSerialMaintain: values?.item?.isSerialMaintain,
            serialList: [],
          },
        ];
        setRowDto(dto);
      }
    } else {
      let data = itemDDL?.map((data) => {
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
          location: data.locationddl[0],
          stockType: { value: 1, label: "Open Stock" }, //values?.transType?.label === "Receive For PO To Blocked Stock" ? { value: 2, label: "Block Stock" } : { value: 1, label: "Open Stock" },
          quantity: "",
          locationddl: data.locationddl,
          discount: data.discount || 0,
          tatalVat: 0,
          totalValue: 0,
          netValue: 0,
          totalPoValue: data?.totalPOValue,
          purchaseRate: data?.purchaseRate || 0,
          salesRate: data?.salesRate || 0,
          mrpRate: data?.mrpRate || 0,
          expiredDate: _todayDate(),
          serialList: [],
          isSerialMaintain:data?.isSerialMaintain,
        };
      });
      setRowDto(data);
      console.log("from all",data);
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
      _sl["netValue"] = (_sl?.vatValue / _sl?.refQty) * +value + _sl?.baseValue.toFixed(2) * +value;
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

    if (totalVat === 0 && values?.vatAmmount > 0)
      return toast.warn("Vat amount should be zero, because total amount zero");

    if (
      values?.refType?.value === 1 &&
      (!values?.challanNO || !values?.challanDate)
    )
      return toast.warn("Challan and Challan Date is required");

    if (isDisabled) return "";

    const isInvalid = rowDto?.some((item) => {
      const list = item?.serialList;
      if (!list) {
        return false;
      }
      const hasMissingBarcode = list.some((element) => {
        if (!(element.hasOwnProperty("barCode")) || element.barCode === "") {
          return true;
        }
        return false;
      });
      return !!hasMissingBarcode;
    });

    if (isInvalid) {
      return toast.warn("Item quantity and serial list with barcode value need to be  same.");
    }

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
              serialNumber: data?.serialList?.map((item) => ({
                sl: 0,
                autoId: 0,
                itemId: data?.itemId,
                itemName: data?.itemName,
                uoMid: data?.uoMid,
                uoMname: data?.uoMname,
                supplierId: values?.busiPartner.value || 0,
                supplierName: values?.busiPartner.label || "",
                purchaseOrderId: values.refNo.value || 0,
                purchaseOrderCode: values.refNo.label || "NA",
                purchaseOrderDate: "2024-08-07T04:02:16.322Z",
                mrrid: 0,
                mrrcode: "",
                mrrdate: "2024-08-07T04:02:16.322Z",
                itemWiseSerialNo: 0,
                customerId: 0,
                customerName: "string",
                challanNo: values?.challanNO,
                salesOrderId: 0,
                salesOrderCode: "string",
                salesOrderDate: "2024-08-07T04:02:16.322Z",
                serialNo: item?.barCode || "",
                actionBy: 0,
                insertDate: "2024-08-07T04:02:16.322Z",
                isActive: true,
                lastActionDateTime: "2024-08-07T04:02:16.322Z",
                challanDate: values?.challanDate,
                itemCode: "string",
                challanNoForGet: {
                  value: "string",
                  label: "string",
                  deliveryDate: "2024-08-07T04:02:16.322Z",
                  customerId: 0,
                  customerName: "string",
                  salesOrderId: 0,
                  salesOrderCode: "string",
                  salesOrderDate: "2024-08-07T04:02:16.322Z",
                },
              })),
            };
          })
          .filter((data) => data.numTransactionQuantity > 0);

        if (rowDataformet.length === 0) {
          toast.warning("Item Quantity Can not be zero");
        } else {
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
            modifyPlyload.objHeader["isPOS"] =
              landingData?.warehouse?.isPOS && modifyPlyload?.objHeader?.referenceTypeId === 1 ? true : false;
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
        {({ handleSubmit, resetForm, values, errors, touched, setFieldValue, isValid }) => (
          <>
            {disableHandler && disableHandler(!isValid)}
            <Form className="form form-label-right po-label">
              <div className="form-group row inventory-form">
                <div className="col-lg-2">
                  <NewSelect
                    label="Reference Type"
                    options={referenceTypeDDL}
                    value={values?.refType}
                    name="refType"
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
                                value: valueOption?.actionBy || 0,
                                label: valueOption?.actionName || "",
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
                            `/wms/InventoryTransaction/GetReferenceNoForInventoryRequest?searchTerm=${v}&RefTypeId=5&RefTypeName=Inventory%20Request&accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&SbuId=${landingData?.sbu?.value}&PlantId=${landingData?.plant?.value}&WearhouseId=${landingData?.warehouse?.value}&IsActive=true&IsClosed=false`
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
                    <FormikError errors={errors} name="refNo" touched={touched} />
                  </div>
                ) : values.refType.label === "PO (Purchase Order)" ? (
                  <div className="col-lg-2">
                    <label>Reference No</label>
                    <SearchAsyncSelect
                      selectedValue={values?.refNo}
                      handleChange={(data) => {
                        setFieldValue("refNo", data);
                        setFieldValue("item", "");
                        setFieldValue("othersCharge", data?.othersCharge || 0);
                        setFieldValue("foreignPurchase", "");
                        if (data?.purchaseOrganizationName === "Foreign Procurement") {
                          dispatch(slice.setItemDDL([]));
                          getForeignPurchaseDDL(data?.value, landingData?.plant?.value, setForeginPurchase);
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
                            `/wms/InventoryTransaction/GetPoNoForInventory?PoTypeId=1&businessUnitId=${selectedBusinessUnit?.value ||
                              0}&SbuId=${landingData?.sbu?.value || 0}&PlantId=${landingData?.plant?.value ||
                              0}&WearhouseId=${landingData?.warehouse?.value || 0}&Search=${v || ""}`
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
                        setFieldValue("othersCharge", data?.othersCharge || 0);
                        setFieldValue("foreignPurchase", "");
                        if (data?.purchaseOrganizationName === "Foreign Procurement") {
                          dispatch(slice.setItemDDL([]));
                          getForeignPurchaseDDL(data?.value, landingData?.plant?.value, setForeginPurchase);
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
                      // setFieldValue={setFieldValue}
                      isDisabled={values.refType.label === "NA (Without Reference)" || values.refType === ""}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
                {values?.refNo?.purchaseOrganizationName === "Foreign Procurement" && (
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
                        if (!value?.isApprove) {
                          return toast.warn("Your 'Invoice Number' invoice has not been approved, Please approve it");
                        }
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
                    isDisabled={values.refType.label !== "NA (Without Reference)"}
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
                  <InputField value={values?.challanNO} placeholder="Challan" name="challanNO" autoComplete="off" />
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
                  <InputField value={values?.getEntry} placeholder="Gate Entry No" name="getEntry" autoComplete="off" />
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
                  <InputField value={values?.remarks} placeholder="Comments" name="remarks" autoComplete="off" />
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
                  <button className="btn btn-primary mr-2" type="button" onClick={() => setOpen(true)}>
                    Attachment
                  </button>
                </div>
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
                            `/wms/InventoryTransaction/GetItemForReceiveInventory?accountId=${
                              profileData.accountId
                            }&businessUnitId=${selectedBusinessUnit?.value || 0}&plantId=${landingData?.plant?.value ||
                              0}&warehouseId=${landingData?.warehouse?.value || 0}&searchTerm=${v ||
                              ""}&RefTypeId=${values?.refType?.value || 0}`
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
                    <FormikError errors={errors} name="item" touched={touched} />
                  </div>
                ) : (
                  <div className="col-lg-3">
                    <ISelect
                      label="Item"
                      options={itemDDL}
                      value={values.item}
                      name="item"
                      setFieldValue={setFieldValue}
                      isDisabled={values.isAllItem === true || values.refType === ""}
                      isOptionSelected={(option, selectValue) => selectValue.some((i) => i === option)}
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
                    <span className="mr-2 mt-auto font-weight-bold">Vat: {totalVat.toFixed(4)}</span>
                    <span className="mr-2 mt-auto font-weight-bold">Amount: {totalValue.toFixed(4)}</span>
                    <span className="mr-2 mt-auto font-weight-bold">Net Amount: {netValue.toFixed(4)}</span>
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
                landingData={landingData}
                setInLineRowItemView={setInLineRowItemView}
                inLineRowItemView={inLineRowItemView}
                setFieldValue={setFieldValue}
                setItems={setItems}
                items={items}
                setQuantity={setQuantity}
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
                  const newData = fileObjects.filter((item) => item.file.name !== deleteFileObj.file.name);
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

              <button type="button" style={{ display: "none" }} ref={btnRef} onClick={() => handleSubmit()}></button>

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
