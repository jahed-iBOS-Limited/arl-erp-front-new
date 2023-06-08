import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { validationSchema, initData } from "./helper";
import InputField from "../../../../../_helper/_inputField";
import RowDtoTable from "./rowDtoTable";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { ISelect } from "../../../../../_helper/_inputDropDown";
import {
  getreferenceTypeDDLAction,
  getreferenceNoDDLActionforreturnDeleviry,
  getTransactionTypeDDLAction,
  getBusinessPartnerDDLAction,
  getpersonnelDDLAction,
  getItemDDLAction,
  saveInventoryTransactionForPurchaseReturn,
  getStockDDLAction,
  getLocationTypeDDLAction,
  getItemReturnInvAction,
} from "../../_redux/Actions";
import { toast } from "react-toastify";
import { empAttachment_action } from "../../helper";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { invTransactionSlice } from "../../_redux/Slice";
import Loading from "../../../../../_helper/_loading";
const { actions: slice } = invTransactionSlice;

export default function CreateForm({
  btnRef,
  resetBtnRef,
  disableHandler,
  landingData,
}) {
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);

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
    stockDDL,
    locationTypeDDL,
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
    dispatch(getStockDDLAction());
    dispatch(
      getLocationTypeDDLAction(
        profileData.accountId,
        selectedBusinessUnit.value,
        landingData?.plant?.value,
        landingData?.warehouse?.value
      )
    );
    return () => dispatch(slice.setItemDDL([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData.accountId, selectedBusinessUnit.value]);

  const onChaneForRefType = (refTyp) => {
    dispatch(
      getreferenceNoDDLActionforreturnDeleviry(
        refTyp.value,
        refTyp.label,
        profileData.accountId,
        selectedBusinessUnit.value,
        landingData?.sbu?.value,
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
    dispatch(getItemReturnInvAction(values?.refType?.value, values.refType.label, refNo.value));
  };

  //add row Dto Data
  const addRowDtoData = (values) => {
    // if (values.isAllItem === false) {
    //   let data = rowDto?.find((data) => data?.itemId === values?.item?.value);
    //   if (data) {
    //     alert("Item Already added");
    //   } else {
    //     setRowDto([
    //       ...rowDto,
    //       {
    //         itemId: values.item.value,
    //         itemName: values.item.label.split('[')[0].trim(),
    //         itemCode: values.item.code,
    //         uoMid: values.item.baseUoMId,
    //         uoMname: values.item.baseUoMName,
    //         refQty: values.item.refQty || 0,
    //         restQty: values.item.restQty || 0,
    //         baseValue: values.item.baseValue || 0,
    //         netValue: values.item.netValue || 0,
    //         location: "",
    //         stockType:{ value: 1, label: "Open Stock" }, //values?.transType?.label === "Return To Vendor From Blocked Stock" ? { value: 2, label: "Block Stock" } : { value: 1, label: "Open Stock" },
    //         quantity: values.item.refQty,
    //       },
    //     ]);
    //   }
    // } else {
    let data = itemDDL?.map((data) => {
      return {
        itemId: data?.value,
        itemName: data.label.split('[')[0].trim(),
        uoMid: data?.baseUoMId,
        uoMname: data?.baseUoMName,
        itemCode: data?.code,
        refQty: data?.refQty || 0,
        restQty: data?.restQty || 0,
        baseValue: data?.baseValue || 0,
        netValue: data?.netValue || 0,
        location: data?.locationddl[0],
        currentStock: data?.locationddl[0]?.currentStock,
        locationddl: data?.locationddl,
        stockType: { value: 1, label: "Open Stock" }, // values?.transType?.label === "Return To Vendor From Blocked Stock" ? { value: 2, label: "Block Stock" } : { value: 1, label: "Open Stock" },
        quantity: data.refQty,
      };
    });
    setRowDto(data);
    // }
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
      _sl[name] = +value;
    } else {
      _sl[name] = value;
    }
    setRowDto(data);
  };

  const saveHandler = async (values, cb) => {
    if (rowDto.length === 0) {
      toast.error("Please Add Item");
    } else {
      if (values && profileData?.accountId && selectedBusinessUnit?.value) {

        let findStock = rowDto.filter(data => data?.quantity > data?.currentStock)

        if (findStock.length > 0) return toast.warning("Stock Is not Available")


        let rowDataformet = rowDto
          .map((data) => {
            return {
              itemId: data?.itemId,
              itemName: data?.itemName,
              uoMid: data.uoMid,
              uoMname: data.uoMname,
              numTransactionQuantity: data.quantity,
              monTransactionValue: data.baseValue * data.quantity,
              inventoryLocationId: data.location.value,
              inventoryLocationName: data.location.label,
              batchId: 0,
              batchNumber: "",
              inventoryStockTypeId: data.stockType.value,
              inventoryStockTypeName: data.stockType.label,
              strBinNo: data?.location?.binNumber || ""
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
            referenceId: values.refNo.value || -1,
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
            businessPartnerId: values.busiPartner.value,
            parsonnelId: values.personnel.value || 0,
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
            gateEntryNo: values?.getEntryn || "",
          },
          objRow: rowDataformet,
          objtransfer: {},
        };
        if (fileObjects.length > 0) {
          empAttachment_action(fileObjects).then((data) => {
            const modifyPlyload = {
              objHeader: {
                ...payload?.objHeader,
                documentId: data[0]?.id || "",
              },
              objRow: payload.objRow,
              objtransfer: {},
            };
            dispatch(
              saveInventoryTransactionForPurchaseReturn(
                { data: modifyPlyload, cb },
                setRowDto,
                setDisabled
              )
            );
          });
        } else {
          dispatch(
            saveInventoryTransactionForPurchaseReturn(
              { data: payload, cb },
              setRowDto,
              setDisabled
            )
          );
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
                    onChange={(selectedOption) => {
                      setFieldValue("refType", selectedOption);
                      onChaneForRefType(selectedOption);
                      setFieldValue("refNo", "");
                      setFieldValue("transType", "");
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
                    isDisabled={values.refType === ""}
                    onChange={(data) => {
                      setFieldValue("refNo", data);
                      onChangeForRefNo(data, values);
                      setFieldValue("busiPartner", {
                        value: data?.partnerId || 0,
                        label: data?.partner || "",
                      });
                      setRowDto([])
                    }}
                    // setFieldValue={setFieldValue}
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
                    setFieldValue={setFieldValue}
                    isDisabled={values.refType === ""}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <ISelect
                    label="Select Business Partner"
                    options={busiPartnerDDL}
                    value={values?.busiPartner}
                    name="busiPartner"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    isDisabled={
                      values?.refType?.label === "PO (Purchase Order)"
                    }
                  />
                </div>
                {values?.refType?.label !== "PO (Purchase Order)" && (
                  <div className="col-lg-2">
                    <ISelect
                      label="Select Personnel"
                      options={personelDDL}
                      defaultValue={values?.personnel}
                      name="personnel"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
               
                <div className="col-lg-2">
                  <InputField
                    value={values?.remarks}
                    label="Comments"
                    placeholder="Comments"
                    name="remarks"
                  />
                </div>
                <div className="col-lg-1 mt-6">
                  <button
                    type="button"
                    // style={{ marginTop: "23px", transform: "translateX(95px)" }}
                    className="btn btn-primary mr-4"
                    disabled={!values?.refNo}
                    //disabled={values.item === "" && values.isAllItem === false}
                    onClick={() => addRowDtoData(values)}
                  >
                    Add
                  </button>
                </div>
                <div className="col-lg-2 mt-7">
                  <button
                    className="btn btn-primary ml-2"
                    type="button"
                    onClick={() => setOpen(true)}
                  >
                    Attachment
                  </button>
                </div>
                
              </div>
              {/* <div className="form-group row global-form">
                <div className="col-lg-3">
                  <ISelect
                    label="Select Item"
                    options={itemDDL}
                    value={values.item}
                    name="item"
                    isDisabled={
                      values.isAllItem === true || values.refNo === ""
                    }
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg">
                  <Field
                    name={values.isAllItem}
                    component={() => (
                      <input
                        style={{
                          position: "absolute",
                          top: "30px",
                          left: "65px",
                        }}
                        disabled={
                          values.refType.label === "NA (Without Reference)"
                        }
                        id="poIsAllItem"
                        type="checkbox"
                        className="ml-2"
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
                      top: "21px",
                    }}
                  >
                    All Item
                  </label>

                  <button
                    type="button"
                    style={{ marginTop: "23px", transform: "translateX(95px)" }}
                    className="btn btn-primary ml-2"
                    disabled={values.item === "" && values.isAllItem === false}
                    onClick={() => addRowDtoData(values)}
                  >
                    Add
                  </button>
                </div>
              </div> */}

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
