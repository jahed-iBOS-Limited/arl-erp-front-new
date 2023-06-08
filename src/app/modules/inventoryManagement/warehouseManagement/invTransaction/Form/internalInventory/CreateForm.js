/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { validationSchema, initData } from "./helper";
import InputField from "../../../../../_helper/_inputField";
import RowDtoTable from "./rowDtoTable";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import SearchAsyncSelect from './../../../../../_helper/SearchAsyncSelect'
import FormikError from './../../../../../_helper/_formikError'
import {
  getreferenceTypeDDLAction,
  getTransactionTypeDDLAction,
  getItemDDLAction,
  getStockDDLAction,
  getLocationTypeDDLAction,
  getLocationTypeDDLActionForInternalInv,
  saveInventoryTransactionForTransferInternal,
  attachment_action,
  getItemDDLForWithoutRefAction,
  getItemDDLForInternalInvAction
} from "../../_redux/Actions";
import { ISelect } from "../../../../../_helper/_inputDropDown";
import { toast } from "react-toastify";
import Loading from "../../../../../_helper/_loading";
import { invTransactionSlice } from '../../_redux/Slice'
import axios from "axios";
const { actions: slice } = invTransactionSlice


export default function CreateForm({
  btnRef,
  resetBtnRef,
  disableHandler,
  landingData,
}) {
  const [rowDto, setRowDto] = useState([]);
  const dispatch = useDispatch();
  
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [attachment, setAttachment] = useState("");
  // const [attachError, setAttachError] = useState(false);

  
  const [currentLocationsDDL, setCurrentLocationsDDL] = useState([]);
  const [toLocationsDDL, setToLocationsDDL] = useState([]);


  const onChangeForCurrentLocation = (curLocId) =>{
      let data = currentLocationsDDL.filter(data=> data?.value !== curLocId)
      setToLocationsDDL(data)
  }



  // redux store data
  const {
    referenceTypeDDL,
    transactionTypeDDL,
    itemDDL,
    stockDDL,
    locationTypeDDL,
  } = useSelector((state) => state?.invTransa);

  const onChangeForItem = (value) => {
    setCurrentLocationsDDL(value?.locationBasedStock)
    // dispatch(
    //   getLocationTypeDDLActionForInternalInv(
    //     profileData.accountId,
    //     selectedBusinessUnit.value,
    //     landingData?.plant?.value,
    //     landingData?.warehouse?.value,
    //     value.value,
    //     value.currenctLocationId
    //   )
    // );
  };

  //dispatch action creators
  useEffect(() => {
    dispatch(getreferenceTypeDDLAction(landingData?.transGrup?.value));
    // dispatch(
    //   getItemDDLForInternalInvAction(
    //     profileData.accountId,
    //     selectedBusinessUnit.value,
    //     landingData?.plant?.value,
    //     landingData?.warehouse?.value
    //   )
    // );
    //dispatch(getStockDDLAction());

    return () => {
      dispatch(slice.setItemDDL([]))
      dispatch(slice.setreferenceTypeDDL([]))
      dispatch(slice.setTransactionTypeDDL([]));
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData.accountId, selectedBusinessUnit.value]);

  useEffect(() => {
    if (referenceTypeDDL[0]) {
      dispatch(
        getTransactionTypeDDLAction(
          landingData?.transGrup?.value,
          referenceTypeDDL[0]?.value
        )
      );

      // if (referenceTypeDDL[0].label === "NA (Without Reference)") {
      //   dispatch(
      //     getItemDDLForWithoutRefAction(
      //       profileData.accountId,
      //       selectedBusinessUnit.value,
      //       landingData?.plant?.value,
      //       landingData?.warehouse?.value
      //     )
      //   );
      // }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referenceTypeDDL]);

  //add row Dto Data
  const addRowDtoData = (values) => {
    if(values.quantity < 1) {
      toast.warning("Quantity can not less then 1");
    }else{
      let data = rowDto?.find((data) => data?.itemId === values?.item?.value);
    if (data) {
      toast.warning("Item Already added");
    } else {
      setRowDto([
        ...rowDto,
        {
          itemId: values?.item?.value,
          itemName: values?.item?.itemName,
          itemCode: values?.item?.code,
          uoMid: values?.item?.baseUoMId,
          uoMname: values?.item?.baseUoMName,
          numTransactionQuantity: Math.abs(+values.quantity) || 0,
          monTransactionValue: values.quantity * values.item.baseValue,
          avaiableStock: +values?.currentStock,
          inventoryLocationId:values.presentLocation.value ,
          inventoryLocationName: values.presentLocation.label,
          batchId: 0,
          batchNumber: "",
          inventoryStockTypeId:1,
          inventoryStockTypeName: "Open Stock",
          toInventoryLocationId: values?.locaStock?.value,
          toInventoryLocationName:values?.locaStock.label,
          toInventoryStockTypeId:1,
          toInventoryStockTypeName:"Open Stock",
          strBinNo: values?.presentLocation?.binNumber || ""
        },
      ]);
    }
    }
  };

  // remove single data from rowDto
  const remover = (payload) => {
    const filterArr = rowDto.filter((itm) => itm?.itemId !== payload);
    setRowDto([...filterArr]);
  };

  const saveHandler = async (values, cb) => {
    if (rowDto.length === 0) {
      toast.error("Please Add Item");
    } else {
      if (values && profileData?.accountId && selectedBusinessUnit?.value) {
        const payload = {
          objHeader: {
            transactionGroupId: landingData?.transGrup?.value,
            transactionGroupName: landingData?.transGrup?.label,
            transactionTypeId: values.transType.value,
            transactionTypeName: values.transType.label,
            referenceTypeId: values.refType.value,
            referenceTypeName: values.refType.label,
            referenceId: values.refNo.value || 0,
            referenceCode: values.refNo.label || "",
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
            businessPartnerId: values?.busiPartner.value || -1,
            parsonnelId: values?.personnel?.value || -1,
            costCenterId: values?.costCenter?.value || -1,
            costCenterCode: values?.costCenter?.code || "string",
            costCenterName: values?.costCenter?.label || "string",
            projectId: values?.projName?.value || -1,
            projectCode: values?.projName?.code || "string",
            projectName: values?.projName?.label || "string",
            comments: values?.remarks || "",
            actionBy: profileData.userId,
            documentId: "",
            businessPartnerName: values?.busiPartner?.label,
            gateEntryNo: values?.getEntryn || "",
          },
          objRow: rowDto.filter((data) => data.numTransactionQuantity > 0),
          objtransfer: {
            fromPlantId: landingData?.plant?.value,
            fromWhid: landingData?.warehouse?.value,
            toPlantId: landingData?.plant?.value,
            toWhid: landingData?.warehouse?.value,
          },
        };

        if (values?.file) {
          dispatch(attachment_action(attachment)).then((data) => {
            const modifyPlyload = {
              objHeader: {
                ...payload?.objHeader,
                documentId: data[0]?.id || "",
              },
              objRow: payload.objRow,
              objtransfer: payload.objtransfer,
            };
            dispatch(
              saveInventoryTransactionForTransferInternal(
                { data: modifyPlyload, cb },
                setRowDto,setDisabled
              )
            );
          });
        } else {
          dispatch(
            saveInventoryTransactionForTransferInternal(
              { data: payload, cb },
              setRowDto,setDisabled
            )
          );
        }
      }
    }
  };

  // const attachmentHandleChange = (files) => {
  //   // file extention chack
  //   const condition = Array.from(files).every((itm) => {
  //     return (
  //       itm.type === "image/jpeg" ||
  //       itm.type === "image/png" ||
  //       itm.type === "image/jpg" ||
  //       itm.type === "application/pdf"
  //     );
  //   });
  //   if (condition && files.length > 0) {
  //     setAttachError(false);
  //   } else {
  //     setAttachError(true);
  //   }
  // };

  return (
    <>
    {isDisabled && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, refType: referenceTypeDDL[0] }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
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
            {disableHandler && disableHandler(!isValid)}
            <Form className="form form-label-right po-label">
              <div className="form-group row global-form">
                <div className="col-lg-2">
                  <ISelect
                    label="Select Reference Type"
                    options={referenceTypeDDL}
                    value={values?.refType}
                    name="refType"
                    onChange={(value) => {
                      setFieldValue("refType", value);
                      //onChaneForRefType(value)
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <ISelect
                    label="Select Transaction Type"
                    options={transactionTypeDDL}
                    value={values?.transType}
                    name="transType"
                    onChange={(value) => {
                      setFieldValue("transType", value);
                      setFieldValue("item", "");
                      setFieldValue("locaStock", "");
                      setFieldValue("quantity", "");
                      //setRowDto([]);
                    }}
                    // setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.remarks}
                    label="Comments"
                    placeholder="Comments"
                    name="remarks"
                  />
                </div>
                {/* <div className="col-lg-3 offset-9">
                  <div className="input-group mt-7" style={{ zIndex: "0" }}>
                    <div className="custom-file">
                      <InputField
                        value={values?.file}
                        label="Attachment"
                        name="file"
                        type="file"
                        class="custom-file-input"
                        id="inputGroupFile01"
                        aria-describedby="inputGroupFileAddon01"
                        className="d-none"
                        accept=".png, .jpg, .jpeg, .pdf"
                        onChange={(e) => {
                          setFieldValue("file", e.target.value);
                          setAttachment(e.target.files);
                          attachmentHandleChange(e.target.files);
                        }}
                      />

                      <label className="custom-file-label">
                        Choose file
                      </label>
                      <div className="file_label">
                        <p>{values?.file}</p>
                        <p>{attachError ? "file not supported" : ""} </p>
                      </div>
                    </div>
                  </div>
                </div> */}
              </div>
              <div className="form-group row global-form">
              <div className="col-lg-2">
                  <label>Item</label>
                  <SearchAsyncSelect
                    selectedValue={values.item}
                    handleChange={(valueOption) => {
                      setFieldValue('item', valueOption)                     
                      onChangeForItem(valueOption);
                      setFieldValue("locaStock", "");
                    }}
                    loadOptions={(v) => {
                      if (v?.length < 3) return []
                      return axios.get(                      
                        `/wms/InventoryTransaction/GetItemForInternalTransferInventory?accountId=${profileData.accountId}&businessUnitId=${selectedBusinessUnit?.value}&plantId=${landingData?.plant?.value}&whId=${landingData?.warehouse?.value}&searchTerm=${v}`
                      ).then((res) => {
                        const updateList = res?.data.map(item => ({
                          ...item,
                          label: item?.labelAndCode
                        }))
                        return updateList
                      })
                    }}
                    isOptionSelected={(option, selectValue) => selectValue.some(i => i === option)}
                    disabled={true}
                  />
                  <FormikError errors={errors} name="item" touched={touched} />
                </div>
                {/* <div className="col-lg-3">
                  <ISelect
                    label="Select Item"
                    options={itemDDL}
                    value={values?.item}
                    name="item"
                    onChange={(valueOption) => {
                      setFieldValue("item", valueOption);

                      setFieldValue("presentLocation", {
                        value: valueOption?.currenctLocationId,
                        label: valueOption?.currenctLocationName,
                      });
                      onChangeForItem(valueOption);
                      setFieldValue("locaStock", "");
                    }}
                    isOptionSelected={(option, selectValue) => selectValue.some(i => i === option)}
                    isDisabled={values?.transType === ""}
                    //setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
               
                <div className="col-lg-2">
                  <ISelect
                    label={
                      "Transfer From Location"
                    }
                    options={currentLocationsDDL}
                    value={values.presentLocation}
                    onChange={(valueOption)=>{
                       setFieldValue("presentLocation",valueOption)
                       setFieldValue("currentStock",valueOption?.currentStock)
                       onChangeForCurrentLocation(valueOption?.value)
                       setFieldValue("locaStock","")
                       setFieldValue("quantity","")
                    }}
                    name="presentLocation"
                   // isDisabled={true}
                    errors={errors}
                    touched={touched}
                  /> 
                </div>
                <div className="col-lg-2">
                  <ISelect
                    label={
                     "Select Transfer To Location"
                    }
                    options={toLocationsDDL|| []}
                    value={values?.locaStock}
                    name="locaStock"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    isDisabled={values?.presentLocation === ""}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <label>Current Stock</label>
                  <InputField
                    value={values?.currentStock}
                    type="number"
                    placeholder="Current Stock"
                    min={1}
                    disabled={true}
                    name="currentStock"
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.quantity}
                    label="Quantity"
                    type="number"
                    onChange={(e)=>{
                      if(values?.currentStock < +e.target.value) return
                      setFieldValue("quantity",e.target.value)
                    }}
                    placeholder="Quantity"
                    name="quantity"
                  />
                </div>
                
                
                <div className="col-lg-1">
                  <button
                    type="button"
                    style={{marginTop: "20px"}}
                    onClick={() =>{
                      addRowDtoData(values)
                      setFieldValue("item", "");
                      setFieldValue("locaStock", "");
                      setFieldValue("presentLocation", "");
                      setFieldValue("currentStock", "");
                      setFieldValue("quantity", "");
                    }}
                    className="btn btn-primary"
                    disabled={
                      !values.item || !values.quantity || !values.locaStock
                    }
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* RowDto table */}
              <RowDtoTable
                remover={remover}
                rowDto={rowDto}
                setRowDto={setRowDto}
                values={values}
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
                onSubmit={() => {
                  resetForm(initData);
                }}
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
