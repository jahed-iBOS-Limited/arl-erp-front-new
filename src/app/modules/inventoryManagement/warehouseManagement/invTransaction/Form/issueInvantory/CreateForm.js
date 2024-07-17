/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { validationSchema, initData, CostElementDDLApi } from "./helper";
import { useLocation } from "react-router-dom";
import InputField from "../../../../../_helper/_inputField";
import RowDtoTable from "./rowDtoTable";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { ISelect } from "../../../../../_helper/_inputDropDown";
import {
  getreferenceTypeDDLAction,
  getreferenceNoDDLActionforIssue,
  getTransactionTypeDDLAction,
  getBusinessPartnerDDLAction,
  getpersonnelDDLAction,
  getItemDDLAction,
  getCostCenterDDLAction,
  getprojectNameDDLAction,
  saveInventoryTransactionForIssue,
  getLocationTypeDDLAction,
  getStockDDLAction,
  getItemforIssueInv,
  getBusinessTransactionDDLAction,
} from "../../_redux/Actions";
import { toast } from "react-toastify";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { empAttachment_action } from "../../helper";
import { invTransactionSlice } from "../../_redux/Slice";
import Loading from "../../../../../_helper/_loading";
import { useMemo } from "react";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
const { actions: slice } = invTransactionSlice;

export default function CreateForm({
  btnRef,
  resetBtnRef,
  disableHandler,
  landingData,
}) {
  const [rowDto, setRowDto] = useState([]);
  const dispatch = useDispatch();
  const [isDisabled, setDisabled] = useState(false);
  const [isProjectIdExist, setIsProjectIdExist] = useState(false);
  const [coseElementDDL, setCostElementDDL] = useState([]);
  const [profitcenterDDL, getProfitcenterDDL, , setProfitcenterDDL] = useAxiosGet();
  const [, getCurrentRateList ] = useAxiosGet();

  const [fileObjects, setFileObjects] = useState([]);
  const [open, setOpen] = useState(false);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // redux store data
  const {
    referenceTypeDDL,
    referenceNoDDL,
    transactionTypeDDL,
    busiPartnerDDL,
    personelDDL,
    itemDDL,
    // projectNameDDL,
    costCenterDDL,
    stockDDL,
    locationTypeDDL,
    businessTransactionDDL
  } = useSelector((state) => state?.invTransa);

  //dispatch action creators
  useEffect(() => {
    dispatch(getreferenceTypeDDLAction(landingData?.transGrup?.value));
    dispatch(
      getBusinessPartnerDDLAction(
        profileData.accountId,
        selectedBusinessUnit.value
      )
    );
    dispatch(
      getpersonnelDDLAction(profileData.accountId, selectedBusinessUnit.value)
    );
    // dispatch(getItemDDLAction(profileData.accountId,selectedBusinessUnit.value,landingData?.plant?.value,landingData?.warehouse?.value))
    dispatch(
      getCostCenterDDLAction(
        profileData.accountId,
        selectedBusinessUnit.value,
        landingData?.sbu?.value
      )
    );
    dispatch(
      getprojectNameDDLAction(profileData.accountId, selectedBusinessUnit.value)
    );
    dispatch(getStockDDLAction());
    dispatch(
      getLocationTypeDDLAction(
        profileData.accountId,
        selectedBusinessUnit.value,
        landingData?.plant?.value,
        landingData?.warehouse?.value
      )
    );
    dispatch(getBusinessTransactionDDLAction(selectedBusinessUnit.value))

    return () => {
      dispatch(slice.setItemDDL([]));
      dispatch(slice.setreferenceTypeDDL([]));
      dispatch(slice.setreferenceNoDDL([]));
      dispatch(slice.setTransactionTypeDDL([]));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData.accountId, selectedBusinessUnit.value]);

  const onChaneForRefType = (refTyp) => {
    dispatch(
      getreferenceNoDDLActionforIssue(
        refTyp?.value,
        refTyp?.label,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        landingData?.plant?.value,
        landingData?.warehouse?.value
      )
    );
    dispatch(
      getTransactionTypeDDLAction(landingData?.transGrup?.value, refTyp.value)
    );
    if (refTyp.label === "NA (Without Reference)") {
      dispatch(
        getItemDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value,
          landingData?.plant?.value,
          landingData?.warehouse?.value
        )
      );
    }
  };

  const onChangeForRefNo = (refNo, values) => {
    dispatch(
      getItemforIssueInv(
        values?.refType?.value,
        values?.refType?.label,
        refNo.value
      )
    );
  };
  //add row Dto Data
  const addRowDtoData = (values) => {
    if (values.isAllItem === false) {
      let data = rowDto?.find((data) => data?.itemId === values?.item?.value);
      if (data) {
        alert("Item Already added");
      } else {
        getCurrentRateList(`/wms/InventoryLoan/GetMultipleItemRatesByIds?ItemIds=${values?.item?.value}&BusinessUnitId=${selectedBusinessUnit?.value}`, (currentRateList)=>{
          setRowDto([
            ...rowDto,
            {
              ...values?.item,
              itemId: values?.item?.value,
              itemName: values?.item?.itemName,
              itemCode: values?.item?.code,
              uoMid: values?.item?.baseUoMId,
              uoMname: values?.item?.baseUoMName,
              refQty: values?.item?.refQty || 0,
              restQty: values?.item?.restQty || 0,
              // baseValue: values.item.baseValue || 0,
              baseValue: currentRateList[0]?.numAverageRate || 0,
              availableStock: values?.item?.locationBasedStock[0]?.currentStock,
              location: values?.item?.locationBasedStock[0],
              LocationDDL: values?.item?.locationBasedStock,
              stockType: { value: 1, label: "Open Stock" },
              quantity: 0,
            },
          ]);
        })
      }
    } else {
      const itemIds = itemDDL.map((data) => data.value).join(",");
      getCurrentRateList(
        `/wms/InventoryLoan/GetMultipleItemRatesByIds?ItemIds=${itemIds}&BusinessUnitId=${selectedBusinessUnit?.value}`,
        (currentRateList) => {
          let data = itemDDL?.map((data, index) => {
            return {
              ...data,
              itemId: data?.value,
              itemName: data?.itemName,
              uoMid: data?.baseUoMId,
              uoMname: data?.baseUoMName,
              itemCode: data?.code,
              refQty: data?.refQty || 0,
              restQty: data?.restQty || 0,
              // baseValue: data?.baseValue || 0,
              baseValue: currentRateList[index]?.numAverageRate || 0,
              availableStock: data?.locationBasedStock[0]?.currentStock,
              location: data?.locationBasedStock[0],
              LocationDDL: data?.locationBasedStock,
              stockType: { value: 1, label: "Open Stock" },
              quantity: 0,
            };
          });
          setRowDto(data);
        }
        );
    }
  };

  // remove single data from rowDto
  const remover = (payload) => {
    const filterArr = rowDto.filter((itm) => itm?.itemId !== payload);
    setRowDto([...filterArr]);
  };

  // rowdto handler for catch data from row's input field in rowTable
  const rowDtoHandler = (name, value, sl) => {
    let data = [...rowDto];
    let _sl = data[sl];
    if (name === "quantity") {
      _sl[name] = value;
    } else {
      _sl[name] = value;
    }
    setRowDto(data);
  };

  const saveHandler = async (values, cb) => {
    if (values?.transType?.value !== 14 && values?.transType?.value !== 11) {
      if (!values?.costCenter) {
        return toast.warn("Cost Center is required");
      }
      if (!values?.costElement) {
        return toast.warn("Cost Element is required");
      }
      if (!values?.profitcenter) {
        return toast.warn("Profit Center is required");
      }
    }
    if (rowDto.length === 0) {
      toast.error("Please Add Item");
    } else {
      if (values && profileData?.accountId && selectedBusinessUnit?.value) {
        let rowDataformet = rowDto
          .map((data) => {
            return {
              itemId: data?.itemId,
              itemName: data?.itemName,
              uoMid: data.uoMid,
              uoMname: data.uoMname,
              numTransactionQuantity: +data.quantity,
              monTransactionValue: +data.baseValue * +data.quantity,
              inventoryLocationId: data.location.value,
              inventoryLocationName: data.location.label,
              batchId: 0,
              batchNumber: "",
              inventoryStockTypeId: data.stockType.value,
              inventoryStockTypeName: data.stockType.label,
              strBinNo: data?.location?.binNumber || "",
            };
          })
          .filter((data) => data.numTransactionQuantity > 0);
        const payload = {
          objHeader: {
            transactionGroupId: landingData?.transGrup?.value,
            transactionGroupName: landingData?.transGrup?.label,
            transactionTypeId: values.transType.value,
            transactionTypeName: values.transType.label,
            referenceTypeId: values.refType.value,
            referenceTypeName: values.refType.label,
            referenceId: values.refNo.value,
            referenceCode: values.refNo.label,
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
            businessPartnerId: values?.busiPartner?.value || 0,
            parsonnelId: values?.personnel?.value || 0,
            costElementName: values?.costElement?.value || 0, /* I didn't know why bind the values?.costElement?.value here for costElementName field. I was adding just || 0 for validation discased with backend dev*/
            costCenterId: values?.costCenter?.value || -1,
            costCenterCode: values?.costCenter?.label
              ? values?.costCenter?.label.split(",")[1] || ""
              : "",
            costCenterName: values?.costCenter?.label
              ? values?.costCenter?.label.split(",")[0] || ""
              : "",
            profitCenterId: values?.profitcenter?.value || 0,
            profitCenterName: values?.profitcenter?.label || "",
            projectId: values?.projName?.value || -1,
            projectCode: values?.projName?.code || "",
            projectName: values?.projName?.label || "",
            comments: values?.remarks || "",
            actionBy: profileData.userId,
            documentId: "",
            businessPartnerName: values?.busiPartner?.label,
            gateEntryNo: values?.getEntryn || "",
            businessTransactionId: values?.businessTransaction?.value || 0,
            generalLedgerId: values?.businessTransaction?.intId || 0,
          },
          objRow: rowDataformet,
          objtransfer: {},
        };
        dispatch(
          saveInventoryTransactionForIssue(
            { data: payload, cb },
            setRowDto,
            setDisabled
          )
        );
        // if (fileObjects.length > 0) {
        //   empAttachment_action(fileObjects).then((data) => {
        //     const modifyPlyload = {
        //       objHeader: {
        //         ...payload?.objHeader,
        //         documentId: data[0]?.id || "",
        //       },
        //       objRow: payload.objRow,
        //       objtransfer: {},
        //     };
        //     dispatch(
        //       saveInventoryTransactionForIssue(
        //         { data: modifyPlyload, cb },
        //         setRowDto,
        //         setDisabled
        //       )
        //     );
        //   });
        // } else {
        //   dispatch(
        //     saveInventoryTransactionForIssue(
        //       { data: payload, cb },
        //       setRowDto,
        //       setDisabled
        //     )
        //   );
        // }
      } else {
      }
    }
  };

  const transTypeDDLIsProductionOrder = transactionTypeDDL?.filter(
    (itm) => itm?.value === 14
  );
  const transTypeDDLNotIsProductionOrder = transactionTypeDDL?.filter(
    (itm) => itm?.value !== 14 && itm?.label !== "Issue For Project"
  );
  const transTypeDDLObjectForProject = useMemo(() => {
    return transactionTypeDDL?.filter((itm) => itm?.value === 11)[0];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transTypeDDLNotIsProductionOrder]);

  const [projectDDL, getProjectDDL] = useAxiosGet();
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
                      onChaneForRefType(value);
                      setFieldValue("refNo", "");
                      setFieldValue("transType", "");
                      setRowDto([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <ISelect
                    label="Select Reference No"
                    options={referenceNoDDL}
                    value={values?.refNo}
                    name="refNo"
                    onChange={(data) => {
                      setFieldValue("refNo", data);
                      setFieldValue("item", "");
                      setFieldValue("personnel", {
                        value: data?.personalId,
                        label: data?.personalName,
                      });
                      onChangeForRefNo(data, values);
                      setRowDto([]);
                      setFieldValue("transType", "");
                      if (data?.intProjectId) {
                        setFieldValue(
                          "transType",
                          transTypeDDLObjectForProject
                        );
                        getProjectDDL(
                          `/fino/ProjectAccounting/ProjectNameDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
                        );
                      }
                      data?.intProjectId && setIsProjectIdExist(true)
                    }}
                    //setFieldValue={setFieldValue}
                    errors={errors}
                    isDisabled={
                      //values.refType.label === "NA (Without Reference)"
                      values.refType === ""
                    }
                    touched={touched}
                  />
                </div>
                {values?.refNo?.isFromProductionOrder ?
                  <>
                    <div className="col-lg-2">
                      <ISelect
                        label="Select Transaction Type"
                        options={transTypeDDLIsProductionOrder}
                        value={values?.transType}
                        name="transType"
                        setFieldValue={setFieldValue}
                        isDisabled={values.refType === ""}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </> :
                  <>
                    <div className="col-lg-2">
                      <ISelect
                        label="Select Transaction Type"
                        options={transTypeDDLNotIsProductionOrder}
                        value={values?.transType}
                        name="transType"
                        setFieldValue={setFieldValue}
                        isDisabled={isProjectIdExist ? true : values.refType === ""}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                }
                {/* <div className="col-lg-2">
                  <ISelect
                    label="Select Transaction Type"
                    options={transactionTypeDDL}
                    value={values?.transType}
                    name="transType"
                    setFieldValue={setFieldValue}
                    isDisabled={values.refType === ""}
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                {values?.transType?.label !== "Issue For Project" && (
                  <>
                    <div className="col-lg-2">
                      <ISelect
                        label="Select Cost Center"
                        options={costCenterDDL}
                        value={values?.costCenter}
                        name="costCenter"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("costCenter", valueOption);
                            CostElementDDLApi(
                              profileData.accountId,
                              selectedBusinessUnit.value,
                              valueOption?.value,
                              setCostElementDDL
                            );
                            getProfitcenterDDL(`/costmgmt/ProfitCenter/GetProfitcenterDDLByCostCenterId?costCenterId=${valueOption?.value}&businessUnitId=${selectedBusinessUnit.value}`, (data) => {
                              if (data?.length) {
                                setFieldValue("profitcenter", data[0]);
                              }
                            })
                            setFieldValue("projName", "");
                            setFieldValue("costElement", "");
                          } else {
                            setFieldValue("costCenter", "");
                            setFieldValue("projName", "");
                            setFieldValue("costElement", "");
                            setFieldValue("profitcenter", "");
                            setProfitcenterDDL([]);
                          }
                        }}
                        //isDisabled={values?.projName !== ""}
                        isDisabled={values?.transType?.value === 14}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <ISelect
                        label="Select Cost Element"
                        options={coseElementDDL}
                        value={values?.costElement}
                        name="costElement"
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        isDisabled={values?.transType?.value === 14}
                      />
                    </div>
                    <div className="col-lg-2">
                      <ISelect
                        label="Select Profit Center"
                        options={profitcenterDDL || []}
                        value={values?.profitcenter}
                        name="profitcenter"
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                        isDisabled={values?.transType?.value === 14}
                      />
                    </div>
                  </>
                )}
                {values?.transType?.label === "Issue For Project" && (
                  <>
                    <div className="col-lg-2">
                      <ISelect
                        label="Select Project Name"
                        options={projectDDL}
                        value={values?.projName}
                        name="projName"
                        onChange={(valueOption) => {
                          setFieldValue("costCenter", "");
                          setFieldValue("projName", valueOption);
                        }}
                        // isDisabled={
                        //  // values?.transType.value !== 11
                        //  values?.costCenter !== ""
                        // }
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2">
                      <ISelect
                        label="Business Transaction"
                        options={businessTransactionDDL || []}
                        value={values?.businessTransaction}
                        name="businessTransaction"
                        onChange={(valueOption) => {
                          setFieldValue("costCenter", "");
                          setFieldValue("businessTransaction", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                  
                )}
                {values?.refType?.label !== "Inventory Request" && (
                  <div className="col-lg-2">
                    <ISelect
                      label="Select Business Partner"
                      options={busiPartnerDDL}
                      value={values?.busiPartner}
                      name="busiPartner"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
                <div className="col-lg-2">
                  <ISelect
                    label="Select Personnel"
                    options={personelDDL}
                    value={values?.personnel}
                    isDisabled={true}
                    name="personnel"
                    setFieldValue={setFieldValue}
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
                {itemDDL?.[0]?.remarks && (
                  <div className="col-lg-2">
                    <InputField
                      value={itemDDL?.[0]?.remarks || ""}
                      label="Remarks"
                      placeholder="Remarks"
                      name="itemRemarks"
                      disabled
                    />
                  </div>
                )}

                {/* <div className="col-lg-3">
                  <button
                    className="btn btn-primary mr-2"
                    style={{ marginTop: "21px" }}
                    type="button"
                    onClick={() => setOpen(true)}
                  >
                    Attachment
                  </button>
                </div> */}
              </div>
              <div className="form-group row global-form mb-3 mb-2">
                <div className="col-lg-3">
                  <ISelect
                    label="Select Item"
                    options={itemDDL}
                    value={values.item}
                    name="item"
                    setFieldValue={setFieldValue}
                    isDisabled={
                      values.isAllItem === true || values.refNo === ""
                    }
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <Field
                    name={values.isAllItem}
                    component={() => (
                      <input
                        style={{
                          position: "absolute",
                          top: "30px",
                          left: "65px",
                        }}
                        id="poIsAllItem"
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
                    )}
                    label="isAllItem"
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
                    style={{ marginTop: "22px", transform: "translateX(95px)" }}
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
              </div>
              {/* RowDto table */}
              <RowDtoTable
                rowDtoHandler={rowDtoHandler}
                remover={remover}
                rowDto={rowDto}
                setRowDto={setRowDto}
                values={values}
                stockDDL={stockDDL}
                locationTypeDDL={locationTypeDDL}
              />

              <DropzoneDialogBase
                filesLimit={1}
                acceptedFiles={["image/*", "application/pdf"]}
                fileObjects={fileObjects}
                cancelButtonText={"cancel"}
                submitButtonText={"submit"}
                maxFileSize={5000000}
                open={open}
                onAdd={(newFileObjs) => {
                  setFileObjects([].concat(fileObjects, newFileObjs));
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
