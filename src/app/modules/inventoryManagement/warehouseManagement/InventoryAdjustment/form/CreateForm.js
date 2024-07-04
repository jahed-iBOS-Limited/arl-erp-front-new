import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { validationSchema, initData } from "./helper";
import InputField from "../../../../_helper/_inputField";
import RowDtoTable from "./rowDtoTable";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import {
  getreferenceTypeDDLAction,
  getreferenceNoDDLAction,
  getTransactionTypeDDLAction,
  getBusinessPartnerDDLAction,
  getpersonnelDDLAction,
  saveInventoryTransactionForAdjustInv,
  getStockDDLAction,
  getLocationTypeDDLAction,
  getItemforReftypeAction,
} from "../_redux/Actions";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../_helper/_formikError";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { toast } from "react-toastify";
import axios from "axios";
import { empAttachment_action } from "../helper";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { invTransactionSlice } from "../_redux/Slice";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { useLocation } from "react-router-dom";
import NewSelect from "../../../../_helper/_select";
const { actions: slice } = invTransactionSlice;

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
  const [, getUpdatedStock, updatedStockLoader] = useAxiosGet();
  const [, getCogs, cogsLoader] = useAxiosGet();
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [fileObjects, setFileObjects] = useState([]);
  const [open, setOpen] = useState(false);

  const [
    profitCenterDDL,
    getProfitCenterDDL,
    ,
    setProfitCenterDDL,
  ] = useAxiosGet();

  // redux store data
  const {
    referenceTypeDDL,
    referenceNoDDL,
    transactionTypeDDL,
    stockDDL,
    locationTypeDDL,
  } = useSelector((state) => state?.invTransa);

  //dispatch action creators
  useEffect(() => {
    getProfitCenterDDL(
      `/fino/CostSheet/ProfitCenterDetails?UnitId=${selectedBusinessUnit?.value}`,
      (data) => {
        const newData = data?.map((itm) => {
          itm.value = itm?.profitCenterId;
          itm.label = itm?.profitCenterName;
          return itm;
        });
        setProfitCenterDDL(newData);
      }
    );

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
    dispatch(getStockDDLAction());
    dispatch(
      getLocationTypeDDLAction(
        profileData.accountId,
        selectedBusinessUnit.value,
        landingData?.plant?.value,
        landingData?.warehouse?.value
      )
    );
    return () => {
      dispatch(slice.setItemDDL([]));
      dispatch(slice.setreferenceTypeDDL([]));
      dispatch(slice.setreferenceNoDDL([]));
      dispatch(slice.setTransactionTypeDDL([]));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData.accountId, selectedBusinessUnit.value]);

  const onChaneForRefType = (refTyp) => {
    if (refTyp?.label !== "NA (Without Reference)") {
      dispatch(
        getreferenceNoDDLAction(
          refTyp?.label,
          profileData.accountId,
          selectedBusinessUnit.value,
          landingData?.sbu?.value,
          landingData?.plant?.value,
          landingData?.warehouse?.value
        )
      );
    }
    dispatch(
      getTransactionTypeDDLAction(landingData?.transGrup?.value, refTyp.value)
    );
  };

  const onChangeForRefNo = (refNo, values) => {
    dispatch(getItemforReftypeAction(values.refType.label, refNo.value));
  };
  //add row Dto Data
  const addRowDtoData = (values) => {
    let data = rowDto?.find((data) => data?.itemName === values?.item?.label);
    if (data) {
      toast.warning("Item Already added");
    } else {
      getUpdatedStock(
        `/wms/InventoryTransaction/sprRuningQty?businessUnitId=${selectedBusinessUnit?.value}&whId=${location?.state?.warehouse?.value}&itemId=${values?.item?.value}`,
        (data) => {
          getCogs(
            // `/wms/InventoryTransaction/sprRuningRate?businessUnitId=${selectedBusinessUnit?.value}&whId=${location?.state?.warehouse?.value}&itemId=${values?.item?.value}`,
            `/wms/InventoryLoan/GetItemRate?ItemId=${values?.item?.value}&BusinessUnitId=${selectedBusinessUnit?.value}`,
            (cogs) => {
              const numTransactionQuantity = data * -1;
              const monTransactionValue = (
                numTransactionQuantity * (+cogs || 0)
              ).toFixed(6);
              const modifidRowDto = [
                ...rowDto,
                {
                  itemId: values.item.value,
                  itemName: values.item.itemName,
                  itemCode: values.item.code,
                  uoMid: values.item.baseUoMId,
                  uoMname: values.item.baseUoMName,
                  refQty: 0,
                  restQty: 0,
                  location: {
                    value: values.item.currenctLocationId,
                    label: values.item.currenctLocationName,
                    binNumber: values.item.binNo,
                  },
                  stockType: { value: 1, label: "Open Stock" },
                  quantity: 0,
                  monTransactionValue: monTransactionValue,
                  physicalStockQty: 0,
                  openStockQty: data,
                  cogs: cogs || 0,
                  numTransactionQuantity: numTransactionQuantity,
                },
              ];
              setRowDto(modifidRowDto);
            }
          );
        }
      );
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
    _sl[name] = value;
    setRowDto(data);
  };

  const saveHandler = async (values, cb) => {
    if (rowDto.length === 0) {
      toast.error("Please Add Item");
    } else {
      if (values && profileData?.accountId && selectedBusinessUnit?.value) {
        let rowDataformet = rowDto.map((data) => {
          return {
            itemId: data?.itemId,
            itemName: data?.itemName,
            uoMid: data.uoMid,
            uoMname: data.uoMname,
            numTransactionQuantity: +data.numTransactionQuantity || 0,
            monTransactionValue: +data?.monTransactionValue || 0,
            inventoryLocationId: data.location.value,
            inventoryLocationName: data.location.label,
            batchId: 0,
            batchNumber: "",
            inventoryStockTypeId: data.stockType.value,
            inventoryStockTypeName: data.stockType.label,
            strBinNo: data?.location?.binNumber || "",
          };
        });
        const payload = {
          objHeader: {
            transactionGroupId: landingData?.transGrup?.value,
            transactionGroupName: landingData?.transGrup?.label,
            transactionTypeId: values.transType.value,
            transactionTypeName: values.transType.label,
            referenceTypeId: values.refType.value,
            referenceTypeName: values.refType.label,
            referenceId: values.refNo.value || 1,
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
            profitCenterId:values?.profitCenter?.value || 0,
            profitCenterName:values?.profitCenter?.label || "",
            costCenterId: values?.costCenter?.value || -1,
            costCenterCode: values?.costCenter?.code || "",
            costCenterName: values?.costCenter?.label || "",
            projectId: values?.projName?.value || -1,
            projectCode: values?.projName?.code || "",
            projectName: values?.projName?.label || "",
            comments: values?.remarks || "",
            actionBy: profileData.userId,
            documentId: "",
            businessPartnerName: values?.busiPartner?.label || "N/A",
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
                documentId: data?.[0]?.id || "",
              },
              objRow: payload.objRow,
              objtransfer: {},
            };
            dispatch(
              saveInventoryTransactionForAdjustInv(
                { data: modifyPlyload, cb },
                setRowDto,
                setDisabled
              )
            );
          });
        } else {
          dispatch(
            saveInventoryTransactionForAdjustInv(
              { data: payload, cb },
              setRowDto,
              setDisabled
            )
          );
        }
      }
    }
  };

  const location = useLocation();

  return (
    <>
      {isDisabled && <Loading />}
      {(updatedStockLoader || cogsLoader) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setFileObjects([]);
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
                      setFieldValue("item", "");
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
                      onChangeForRefNo(data, values);
                    }}
                    isDisabled={
                      values.refType.label === "NA (Without Reference)" || true
                    }
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
                {[7]?.includes(landingData?.transGrup?.value) ?  
                <div className="col-lg-3">
                  <NewSelect
                    name="Profit Center"
                    options={profitCenterDDL || []}
                    value={values?.profitCenter}
                    label="Profit Center"
                    onChange={(valueOption) => {
                      setFieldValue("profitCenter", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div> :null}
                <div className="col-lg-2">
                  <InputField
                    value={values?.remarks}
                    label="Comments"
                    placeholder="Comments"
                    name="remarks"
                  />
                </div>
                <div className="col-lg-3 mt-6">
                  <button
                    className="btn btn-primary mr-2"
                    type="button"
                    onClick={() => setOpen(true)}
                  >
                    Attachment
                  </button>
                </div>
              </div>
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <label>Item</label>
                  <SearchAsyncSelect
                    selectedValue={values.item}
                    handleChange={(valueOption) => {
                      setFieldValue("item", valueOption);
                    }}
                    isDebounce
                    loadOptions={(v, resolve) => {
                      if (v?.length < 3) return [];
                      return (
                        axios
                          // .get(
                          //   `/wms/InventoryTransaction/GetItemForAdjustInventory?accountId=${profileData.accountId}&businessUnitId=${selectedBusinessUnit?.value}&plantId=${landingData?.plant?.value}&whId=${landingData?.warehouse?.value}&searchTerm=${v}`
                          // )
                          .get(
                            `/fino/AdjustmentJournal/GetItemForAdjustInventory?accountId=1&businessUnitId=${selectedBusinessUnit?.value}&plantId=${landingData?.plant?.value}&whId=${landingData?.warehouse?.value}&searchTerm=${v}`
                          )
                          .then((res) => {
                            const updateList = res?.data.map((item) => ({
                              ...item,
                              label: item?.itemDetails,
                            }));
                            resolve(updateList);
                          })
                      );
                    }}
                    isOptionSelected={(option, selectValue) =>
                      selectValue.some((i) => i === option)
                    }
                    isDisabled={!values?.refType}
                  />
                  <FormikError errors={errors} name="item" touched={touched} />
                </div>

                <div className="col-lg-3">
                  <button
                    style={{ marginTop: "23px" }}
                    type="button"
                    className="btn btn-primary mt-7 mb-3"
                    onClick={() => {
                      addRowDtoData(values);
                      setFieldValue("item", "");
                    }}
                    disabled={values.item === ""}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* show data table */}
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
