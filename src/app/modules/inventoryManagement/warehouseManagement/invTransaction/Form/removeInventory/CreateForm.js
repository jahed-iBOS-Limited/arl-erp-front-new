import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { validationSchema, initData } from "./helper";
import InputField from "../../../../../_helper/_inputField";
import RowDtoTable from "./rowDtoTable";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import {
  getreferenceTypeDDLAction,
  getreferenceNoDDLAction,
  getTransactionTypeDDLAction,
  getBusinessPartnerDDLAction,
  getpersonnelDDLAction,
  saveInventoryTransactionForRemoveInventory,
  getStockDDLAction,
  getLocationTypeDDLAction,
  getItemforRemoveInv,
} from "../../_redux/Actions";
import { ISelect } from "../../../../../_helper/_inputDropDown";
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
  //const location = useLocation();
  const [rowDto, setRowDto] = useState([]);
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);

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
      getreferenceNoDDLAction(
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
    // if(refTyp.label === "NA (Without Reference)"){
    //   dispatch(
    //     getItemDDLAction(
    //       profileData.accountId,
    //       selectedBusinessUnit.value,
    //       landingData?.plant?.value,
    //       landingData?.warehouse?.value
    //     )
    //   );
    // }
  };

  //    const onChangeForRefNo = (refNo,values) =>{
  //     dispatch(getItemforReftypeAction(values.refType.label,refNo.value))
  // }

  const onChangeForTransType = (transTyp, values) => {
    dispatch(
      getItemforRemoveInv(
        profileData.accountId,
        selectedBusinessUnit.value,
        landingData?.plant?.value,
        landingData?.warehouse?.value,
        transTyp.label
      )
    );
  };

  //add row Dto Data
  const addRowDtoData = (values) => {
    let data = rowDto?.find((data) => data?.itemName === values?.item?.label);
    if (data) {
      alert("Item Already added");
    } else {
      setRowDto([
        ...rowDto,
        {
          itemId: values?.item?.value,
          itemName: values?.item?.label.split("[")[0].trim(),
          itemCode: values?.item?.code,
          uoMid: values?.item?.baseUoMId,
          uoMname: values.item.baseUoMName,
          refQty: 0,
          restQty: 0,
          baseValue: values.item.baseValue || 0,
          location: {
            value: values.item.currenctLocationId,
            label: values.item.currenctLocationName,
          },
          stockType: { value: 1, label: "Open Stock" },
          quantity: 0,
          avaibleStock: values?.item?.availableStock,
        },
      ]);
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
            businessPartnerId: values.busiPartner.value,
            parsonnelId: values.personnel.value,
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
              saveInventoryTransactionForRemoveInventory(
                { data: modifyPlyload, cb },
                setRowDto,
                setDisabled
              )
            );
          });
        } else {
          dispatch(
            saveInventoryTransactionForRemoveInventory(
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
            {isDisabled && <Loading />}
            {disableHandler && disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
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
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Select Reference No"
                    options={referenceNoDDL}
                    value={values?.refNo}
                    name="refNo"
                    // onChange={data =>{
                    //   setFieldValue("refNo",data)
                    //   onChangeForRefNo(data,values)
                    // }}
                    setFieldValue={setFieldValue}
                    isDisabled={
                      values.refType.label === "NA (Without Reference)" ||
                      values.refType === ""
                    }
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Select Transaction Type"
                    options={transactionTypeDDL}
                    value={values?.transType}
                    name="transType"
                    onChange={(value) => {
                      setFieldValue("transType", value);
                      onChangeForTransType(value, values);
                      setRowDto([]);
                      setFieldValue("item", "");
                    }}
                    isDisabled={values.refType === ""}
                    //setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* <div className="col-lg-3">
                  <ISelect
                    label="Select Business Partner"
                    options={busiPartnerDDL}
                    defaultValue={values?.busiPartner}
                    name="busiPartner"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Select Personnel"
                    options={personelDDL}
                    defaultValue={values?.personnel}
                    name="personnel"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.remarks}
                    label="Comments"
                    placeholder="Comments"
                    name="remarks"
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    className="btn btn-primary mr-2"
                    type="button"
                    onClick={() => setOpen(true)}
                  >
                    Attachment
                  </button>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-3">
                  <ISelect
                    label="Select Item"
                    options={itemDDL}
                    value={values.item}
                    name="item"
                    setFieldValue={setFieldValue}
                    isOptionSelected={(option, selectValue) =>
                      selectValue.some((i) => i === option)
                    }
                    isDisabled={values.transType === ""}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <button
                    type="button"
                    className="btn btn-primary mt-7"
                    onClick={() => addRowDtoData(values)}
                    disabled={values.item === ""}
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
                landingData={landingData}
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
