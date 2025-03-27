import React, { useEffect, useRef, useState } from 'react';
import { Formik, Form } from 'formik';
import { ISelect } from '../../../../../_helper/_inputDropDown';
import { validationSchema, initData } from './helper';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import SearchAsyncSelect from './../../../../../_helper/SearchAsyncSelect';
import FormikError from './../../../../../_helper/_formikError';
import {
  // getreferenceTypeDDLAction,
  getTransactionTypeDDLAction,
  getBusinessPartnerDDLAction,
  getpersonnelDDLAction,
  saveInventoryTransactionForTransferInv,
  getStockDDLAction,
  getLocationTypeDDLAction,
  getItemForTransferInvInInvDDLAction,
  getreferenceNoForTransferInInvDDLAction,
} from '../../_redux/Actions';
import { getPlantDDL, getWareForTransferDDL } from '../../helper';
import RowDtoTable from './rowDtoTable';
import InputField from '../../../../../_helper/_inputField';
import { toast } from 'react-toastify';
// import { empAttachment_action } from "../../helper";
// import { DropzoneDialogBase } from "react-mui-dropzone";
import { invTransactionSlice } from '../../_redux/Slice';
import Loading from '../../../../../_helper/_loading';
import axios from 'axios';
import { getDownlloadFileView_Action } from '../../../../../_helper/_redux/Actions';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import placeholderImg from '../../../../../_helper/images/placeholderImg.png';
import { attachmentUpload } from '../../../../../_helper/attachmentUpload';
import './style.css';

const { actions: slice } = invTransactionSlice;

export default function TransferInForm({
  btnRef,
  resetBtnRef,
  disableHandler,
  landingData,
}) {
  const dispatch = useDispatch();
  const [rowDto, setRowDto] = useState([]);
  const [plantDDL, setPlantDDL] = useState([]);
  const [warehouseDDL, setWrehouseDDL] = useState([]);
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

  // redux store data
  const {
    referenceTypeDDL,
    referenceNoDDL,
    transactionTypeDDL,
    itemDDL,
    stockDDL,
    locationTypeDDL,
  } = useSelector((state) => state?.invTransa);

  // const [fileObjects, setFileObjects] = useState([]);
  // const [open, setOpen] = useState(false);
  const [attachmentFile, setAttachmentFile] = useState('');

  const inputAttachFile = useRef(null);
  const onButtonAttachmentClick = () => {
    inputAttachFile.current.click();
  };

  //dispatch action creators
  useEffect(() => {
    // dispatch(getreferenceTypeDDLAction(4));
    dispatch(
      getBusinessPartnerDDLAction(
        profileData.accountId,
        selectedBusinessUnit.value,
      ),
    );
    dispatch(
      getpersonnelDDLAction(profileData.accountId, selectedBusinessUnit.value),
    );
    getPlantDDL(
      profileData.userId,
      profileData.accountId,
      selectedBusinessUnit.value,
      setPlantDDL,
    );
    dispatch(getStockDDLAction());
    dispatch(
      getLocationTypeDDLAction(
        profileData.accountId,
        selectedBusinessUnit.value,
        landingData?.plant?.value,
        landingData?.warehouse?.value,
      ),
    );
    onChaneForRefType({ value: 23, label: 'Transfer' });
    return () => dispatch(slice.setItemDDL([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData.accountId, selectedBusinessUnit.value]);

  const onChaneForRefType = (refTyp) => {
    dispatch(
      getTransactionTypeDDLAction(landingData?.transGrup?.value, refTyp.value),
    );
    dispatch(
      getreferenceNoForTransferInInvDDLAction(
        refTyp?.value,
        profileData.accountId,
        selectedBusinessUnit.value,
        landingData?.plant?.value,
        landingData?.warehouse?.value,
      ),
    );
  };

  const onChangeforPlant = (plantId) => {
    getWareForTransferDDL(
      profileData.userId,
      profileData.accountId,
      selectedBusinessUnit.value,
      plantId.value,
      landingData?.warehouse?.value,
      landingData?.plant?.value,
      setWrehouseDDL,
    );
    //dispatch(slice.setItemDDL([]))
  };

  const onChangeForRefNo = (refNo, values) => {
    dispatch(getItemForTransferInvInInvDDLAction(refNo?.value));
  };

  // const onChangeFOrWarehouse = (whId, values) => {
  //   dispatch(
  //     getItemforTransferInv(
  //       profileData.accountId,
  //       selectedBusinessUnit.value,
  //       landingData?.plant?.value,
  //       landingData?.warehouse?.value,
  //       values.transplant.value,
  //       whId.value
  //     )
  //   );
  // };

  //add row Dto Data
  const addRowDtoData = (values) => {
    console.log(values);
    if (values.isAllItem === false) {
      //let data = rowDto?.find((data) => data?.itemName === values?.item?.label)
      // let data = rowDto?.find((data) => data?.itemId === values?.item?.value)
      let data = rowDto?.find((data) => data?.itemName === values?.item?.label);

      if (data) {
        alert('Item Already added');
      } else {
        setRowDto([
          ...rowDto,
          {
            ...values?.item,
            itemId: values.item?.value,
            itemName: values.item?.itemName,
            itemCode: values.item?.code,
            uoMid: values.item?.baseUoMId,
            uoMname: values?.item?.baseUoMName,
            baseValue: values.item.baseValue || 0,
            availableStock: values?.item?.locationBasedStock[0].currentStock,
            refQty:
              values.refType.label === 'NA (Without Reference)'
                ? 0
                : values?.item?.refQty || 0,
            restQty:
              values.refType.label === 'NA (Without Reference)'
                ? 0
                : values?.item?.restQty || 0,
            location: '',
            stockType: { value: 1, label: 'Open Stock' },
            fromLocation: values?.item?.locationBasedStock[0],
            fromStock: { value: 1, label: 'Open Stock' },
            quantity: 0,
            transferDDl: values?.item?.locationBasedStock,
            transferToLocation: values.item.transferToLocation,
          },
        ]);
      }
    } else {
      let data = itemDDL?.map((data) => {
        return {
          ...data,
          itemId: data?.value,
          itemName: data.label.split('[')[0].trim(),
          uoMid: data.baseUoMId,
          uoMname: data.baseUoMName,
          itemCode: data.code,
          baseValue: data.baseValue || 0,
          availableStock: values?.item?.locationBasedStock[0].currentStock,
          refQty: data.availableStock || 0,
          restQty: data.restQty || 0,
          location: '',
          stockType: '',
          quantity: 0,
        };
      });
      setRowDto(data);
    }
  };

  // remove single data from rowDto
  const remover = (payload) => {
    const filterArr = rowDto.filter((itm) => itm?.itemName !== payload);
    setRowDto([...filterArr]);
  };

  // rowdto handler for catch data from row's input field in rowTable
  const rowDtoHandler = (name, value, sl) => {
    let data = [...rowDto];
    let _sl = data[sl];
    if (name === 'quantity') {
      _sl[name] = +value;
    } else {
      _sl[name] = value;
    }
    setRowDto(data);
  };

  const saveHandler = async (values, cb) => {
    if (rowDto.length === 0) {
      toast.error('Please Add Item');
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
              // monTransactionValue: data.baseValue * data.quantity,
              monTransactionValue: data.numAverageRate * data.quantity,
              inventoryLocationId: data.fromLocation.value,
              inventoryLocationName: data.fromLocation.label,
              batchId: 0,
              batchNumber: '',
              inventoryStockTypeId: data.fromStock.value,
              inventoryStockTypeName: data.fromStock.label,
              toInventoryLocationId: 0, //data.location.value,
              toInventoryLocationName: '', //data.location.label,
              toInventoryStockTypeId: data.stockType.value,
              toInventoryStockTypeName: data.stockType.label,
              strBinNo: data?.fromLocation?.binNumber || '',
            };
          })
          .filter((data) => data.numTransactionQuantity > 0);
        const payload = {
          objHeader: {
            transactionGroupId: landingData?.transGrup?.value,
            transactionGroupName: landingData?.transGrup?.label,
            transactionTypeId: values?.transType.value,
            transactionTypeName: values?.transType.label,
            referenceTypeId: values?.refType.value,
            referenceTypeName: values?.refType.label,
            referenceId: values?.refNo.value || 1,
            referenceCode: values.refNo.label || 'NA',
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
            businessPartnerId: values?.busiPartner?.value || -1, //61
            parsonnelId: values?.personnel?.value || -1,
            costCenterId: values?.costCenter?.value || -1,
            costCenterCode: values?.costCenter?.code || '',
            costCenterName: values?.costCenter?.label || '',
            projectId: values?.projName?.value || -1,
            projectCode: values?.projName?.code || '',
            projectName: values?.projName?.label || '',
            comments: values?.remarks || '',
            actionBy: profileData.userId,
            documentId: '',
            businessPartnerName: values?.busiPartner?.label || '',
            gateEntryNo: values?.getEntryn || '',
          },
          objRow: rowDataformet,
          objtransfer: {
            fromPlantId:
              values.refType.label === 'NA (Without Reference)'
                ? landingData?.plant?.value
                : values.transplant.value,
            fromWhid:
              values.refType.label === 'NA (Without Reference)'
                ? landingData?.warehouse?.value
                : values.transWare.value,
            toPlantId:
              values.refType.label === 'NA (Without Reference)'
                ? values.transplant.value
                : landingData?.plant?.value,
            toPlantName:
              values.refType.label === 'NA (Without Reference)'
                ? values.transplant.label
                : landingData?.plant?.label,
            toWhid:
              values.refType.label === 'NA (Without Reference)'
                ? values.transWare.value
                : landingData?.warehouse?.value,
            toWhName:
              values.refType.label === 'NA (Without Reference)'
                ? values.transWare.label
                : landingData?.warehouse?.label,
          },
        };

        if (attachmentFile) {
          const modifyPlyload = {
            objHeader: {
              ...payload?.objHeader,
              documentId: attachmentFile || '',
            },
            objRow: payload.objRow,
            // objtransfer: {}, cemmenting and change value of objtransfer requirment of Ziaul Islam (Backend)
            objtransfer: { ...payload?.objtransfer },
          };
          dispatch(
            saveInventoryTransactionForTransferInv(
              { data: modifyPlyload, cb },
              setRowDto,
              setDisabled,
            ),
          );
        } else {
          dispatch(
            saveInventoryTransactionForTransferInv(
              { data: payload, cb },
              setRowDto,
              setDisabled,
            ),
          );
        }
      } else {
      }
    }
  };

  const debounceHandelar = debounce(({ setLoading, CB }) => {
    setLoading(false);
    CB();
  }, 5000);

  return (
    <>
      {isDisabled && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setDisabled(true);
          debounceHandelar({
            setLoading: setDisabled,
            CB: () => {
              saveHandler(values, () => {
                resetForm(initData);
                setAttachmentFile('');
              });
            },
          });
          
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setValues,
          setFieldValue,
          isValid,
        }) => (
          <>
            {disableHandler && disableHandler(!isValid)}
            <Form className="form form-label-right po-label">
              <div className="global-form create-Transfer-in-wrapper">
                <div className="form-group row">
                  <div className="col-lg-2">
                    <ISelect
                      label="Select Reference Type"
                      options={referenceTypeDDL}
                      value={values?.refType}
                      isDisabled
                      name="refType"
                      onChange={(value) => {
                        setFieldValue('refType', value);
                        setFieldValue('refNo', '');
                        setFieldValue('transType', '');
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
                        setFieldValue('refNo', data);
                        setFieldValue('item', '');
                        setFieldValue('transplant', {
                          value: data?.fromPlantId,
                          label: data?.fromPlantName,
                        });
                        setFieldValue('transWare', {
                          value: data?.fromWarehouseId,
                          label: data?.fromWarehouseName,
                        });
                        onChangeForRefNo(data, values);
                        setRowDto([]);
                      }}
                      //setFieldValue={setFieldValue}
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
                      isDisabled
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <ISelect
                      label={
                        values.refType.label === 'NA (Without Reference)'
                          ? 'Select To (Plant)'
                          : 'Select From (Plant)'
                      }
                      options={plantDDL}
                      value={values?.transplant}
                      name="transplant"
                      onChange={(value) => {
                        setFieldValue('transplant', value);
                        onChangeforPlant(value);
                        setFieldValue('transWare', '');
                        setFieldValue('item', '');
                        setRowDto([]);
                      }}
                      isDisabled={
                        values.refType.label !== 'NA (Without Reference)'
                      }
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <ISelect
                      label={
                        values.refType.label === 'NA (Without Reference)'
                          ? 'Select To (Warehouse)'
                          : 'Select From (Warehouse)'
                      }
                      options={warehouseDDL}
                      value={values?.transWare}
                      name="transWare"
                      onChange={(value) => {
                        setFieldValue('transWare', value);
                        //onChangeFOrWarehouse(value, values);
                        setFieldValue('item', '');
                        setRowDto([]);
                      }}
                      isDisabled={
                        values.refType.label !== 'NA (Without Reference)'
                      }
                      //setFieldValue={setFieldValue}
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
                  {/* <div className="col-lg-3 mt-3">
                    <button
                      className="btn btn-primary mr-2"
                      type="button"
                      onClick={() => setOpen(true)}
                    >
                      Attachment
                    </button>
                  </div> */}
                  <div className="col-lg-3">
                    <label>Attachment </label>
                    <div
                      className={
                        attachmentFile
                          ? 'image-upload-box with-img'
                          : 'image-upload-box'
                      }
                      onClick={onButtonAttachmentClick}
                      style={{
                        cursor: 'pointer',
                        position: 'relative',
                        height: '35px',
                      }}
                    >
                      <input
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            attachmentUpload(e.target.files)
                              .then((data) => {
                                setAttachmentFile(data?.[0]?.id);
                              })
                              .catch((error) => {
                                setAttachmentFile('');
                              });
                          }
                        }}
                        type="file"
                        ref={inputAttachFile}
                        id="file"
                        style={{ display: 'none' }}
                      />
                      <div>
                        {!attachmentFile && (
                          <img
                            style={{ maxWidth: '50px' }}
                            src={placeholderImg}
                            className="img-fluid"
                            alt="Upload or drag documents"
                          />
                        )}
                      </div>
                      {attachmentFile && (
                        <div className="d-flex align-items-center">
                          <p
                            style={{
                              fontSize: '12px',
                              fontWeight: '500',
                              color: '#0072E5',
                              cursor: 'pointer',
                              margin: '0px',
                            }}
                          >
                            {attachmentFile}
                          </p>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">View Attachment</Tooltip>
                            }
                          >
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(
                                  getDownlloadFileView_Action(attachmentFile),
                                );
                              }}
                              className="ml-2"
                            >
                              <i
                                style={{ fontSize: '16px' }}
                                className={`fa pointer fa-eye`}
                                aria-hidden="true"
                              ></i>
                            </span>
                          </OverlayTrigger>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="row">
                  {values.refType.label === 'NA (Without Reference)' ? (
                    <div className="col-lg-3">
                      <label>Item</label>
                      <SearchAsyncSelect
                        selectedValue={values.item}
                        handleChange={(valueOption) => {
                          setFieldValue('item', valueOption);
                        }}
                        loadOptions={(v) => {
                          if (v?.length < 3) return [];
                          return axios
                            .get(
                              `/wms/InventoryTransaction/GetItemForWarehouseTransferInventory?AccountId=${profileData.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&fromPlantId=${landingData?.plant?.value}&fromWarehouseId=${landingData?.warehouse?.value}&toPlantId=${values?.transplant?.value}&toWarehouseId=${values?.transWare?.value}&searchTerm=${v}`,
                            )
                            .then((res) => {
                              const updateList = res?.data.map((item) => ({
                                ...item,
                                label: item?.labelAndCode,
                              }));
                              return updateList;
                            });
                        }}
                        isOptionSelected={(option, selectValue) =>
                          selectValue.some((i) => i === option)
                        }
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
                          values.isAllItem === true || values.refType === ''
                        }
                        isOptionSelected={(option, selectValue) =>
                          selectValue.some((i) => i === option)
                        }
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )}
                  <div className="col-lg-1">
                    <button
                      type="button"
                      style={{ marginTop: '18px' }}
                      className="btn btn-primary ml-2"
                      onClick={() => addRowDtoData(values)}
                      disabled={
                        values.item === '' && values.isAllItem === false
                      }
                    >
                      Add
                    </button>
                  </div>
                </div>
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
              {/* <DropzoneDialogBase
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
              /> */}
              <button
                type="submit"
                style={{ display: 'none' }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: 'none' }}
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
