import axios from 'axios';
import { Form, Formik } from 'formik';
import { DropzoneDialogBase } from 'material-ui-dropzone';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from '../../../../../../../_metronic/_partials/controls';
import SearchAsyncSelect from '../../../../../_helper/SearchAsyncSelect';
import InputField from '../../../../../_helper/_inputField';
import NewSelect from '../../../../../_helper/_select';
import PaginationTable from '../../../../../_helper/_tablePagination';
import { getLandingData, empAttachment_action } from '../helper';
// import { _dateFormatter } from "../../../../../_helper/_dateFormate";
// import { _formatMoney } from "../../../../../_helper/_formatMoney";
import useAxiosGet from '../../../../../_helper/customHooks/useAxiosGet';
import ServiceBreakDownViewModal from '../serviceBreakDown/serviceBreakDownViewModal';

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  selectedBusinessUnit,
  profileData,
  rowDto,
  setRowDto,
  supplierDDL,
  statusOption,
  getLandingDataForCommercialBill,
  setPageSize,
  pageSize,
  setPageNo,
  pageNo,
  rowDtoHandler,
  setAllCheck,
  setUploadImage,
  setDisabled,
  setTotalCount,
  totalCount,
  state,
  rowDtoSelectHandler,
}) {
  const { state: headerData } = useLocation();
  const [fileObjects, setFileObjects] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [poNumber, setPoNumber] = useState('');
  const [shipmentNo, setShipmentNo] = useState('');
  const [lcNumber, setLcNumber] = useState('');
  const [referenceId, setReferenceId] = useState('');
  const [itemData, setItemData] = useState('');
  const [chargeTypeDDL, getChargeTypeDDL] = useAxiosGet();
  const [
    subChargeTypeDDL,
    getSubChargeTypeDDL,
    ,
    setSubChargeTypeDDL,
  ] = useAxiosGet();

  useEffect(() => {
    getChargeTypeDDL(
      `/imp/ImportCommonDDL/getChargeTypeDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const loadPoLcList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/imp/ImportCommonDDL/GetPONumberListFromShipment?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchTerm=${v}`,
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  const history = useHistory();
  const backHandler = () => {
    history.goBack();
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.poLc?.label,
      values?.supplier?.value,
      0,
      setRowDto,
      pageNo,
      pageSize,
      setDisabled,
      setTotalCount,
    );
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
            <Card>
              <CardHeader
                title={`${headerData?.billType?.label} (${'Bill Register'})`}
              >
                <CardHeaderToolbar>
                  <button
                    type="button"
                    onClick={backHandler}
                    className={'btn btn-light'}
                  >
                    <i className="fa fa-arrow-left"></i>
                    Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary ml-2"
                    type="submit"
                    disabled={values?.billingStatus?.label === 'Done'}
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className=" row global-form">
                    <div className="col-lg-2">
                      <label>PO/LC</label>
                      <SearchAsyncSelect
                        selectedValue={values?.poLc}
                        isSearchIcon={true}
                        name="poLc"
                        handleChange={(valueOption) => {
                          setFieldValue('poLc', valueOption);
                          setFieldValue('supplier', '');
                          getLandingDataForCommercialBill(
                            valueOption?.label,
                            values?.supplier?.value,
                            0,
                            values?.chargeType?.label || '',
                            values?.subChargeType?.value || 0,
                          );
                        }}
                        loadOptions={loadPoLcList || []}
                        placeholder="Search by PO/LC Id"
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        options={supplierDDL || []}
                        label="Supplier"
                        placeholder="Supplier"
                        name="supplier"
                        value={values?.supplier}
                        onChange={(valueOption) => {
                          setFieldValue('supplier', valueOption);
                          getLandingDataForCommercialBill(
                            values?.poLc?.label,
                            valueOption?.value,
                            0,
                            values?.chargeType?.label || '',
                            valueOption?.value || 0,
                          );
                        }}
                      />
                    </div>
                    {/* <div className="col-lg-2">
                      <NewSelect
                        options={statusOption || []}
                        placeholder="Billing Status"
                        label="Billing Status"
                        value={values?.billingStatus}
                        name="billingStatus"
                        isClearable={false}
                        onChange={(valueOption) => {
                          setFieldValue("billingStatus", valueOption);
                          getLandingDataForCommercialBill(
                            values?.poLc?.label,
                            values?.supplier?.value,
                            valueOption?.value,
                            values?.fromDate,
                            values?.toDate
                          );
                        }}
                      />
                    </div> */}

                    <div className="col-lg-2">
                      <NewSelect
                        options={chargeTypeDDL || []}
                        label="Charge Type"
                        name="chargeType"
                        value={values?.chargeType}
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue('chargeType', valueOption);
                            getSubChargeTypeDDL(
                              `/imp/ImportCommonDDL/SubChargeTypeDDL?ChargeTypeId=${valueOption?.value}`,
                              (data) => {
                                const result = data.map((item) => ({
                                  ...item,
                                  value: item?.subChargeTypeId,
                                  label: item?.subChargeTypeName,
                                }));
                                setSubChargeTypeDDL(result);
                              },
                            );
                            getLandingDataForCommercialBill(
                              values?.poLc?.label,
                              values?.supplier?.value || 0,
                              0,
                              valueOption?.label,
                              0,
                            );
                          } else {
                            setFieldValue('chargeType', '');
                            setFieldValue('subChargeType', '');
                            setSubChargeTypeDDL([]);
                            getLandingDataForCommercialBill(
                              values?.poLc?.label,
                              values?.supplier?.value || 0,
                              0,
                              '',
                              values?.subChargeType?.value || 0,
                            );
                          }
                        }}
                      />
                    </div>
                    {subChargeTypeDDL?.length > 0 ? (
                      <div className="col-lg-2">
                        <NewSelect
                          options={subChargeTypeDDL || []}
                          label="Sub Charge Type"
                          name="subChargeType"
                          value={values?.subChargeType}
                          onChange={(valueOption) => {
                            setFieldValue('subChargeType', valueOption);
                            getLandingDataForCommercialBill(
                              values?.poLc?.label,
                              valueOption?.value,
                              0,
                              values?.chargeType?.label || '',
                              valueOption?.value || 0,
                            );
                          }}
                        />
                      </div>
                    ) : (
                      ''
                    )}

                    {values?.billingStatus?.value === 0 && (
                      <div className="col-lg-2">
                        <label>Bill No</label>
                        <InputField
                          value={values?.billNo}
                          name="billNo"
                          placeholder="Bill No"
                          type="text"
                          // disabled={values?.billingStatus?.label === "Done"}
                        />
                      </div>
                    )}

                    {/* <div className="col-lg-2">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        // disabled={values?.billingStatus?.label === "Done"}
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
                          getLandingDataForCommercialBill(
                            values?.poLc?.label,
                            values?.supplier?.value,
                            values?.billingStatus?.value,
                            e.target.value,
                            values?.toDate
                          );
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To Date"
                        type="date"
                        // disabled={values?.billingStatus?.label === "Done"}
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value);
                          getLandingDataForCommercialBill(
                            values?.poLc?.label,
                            values?.supplier?.value,
                            values?.billingStatus?.value,
                            values?.fromDate,
                            e.target.value
                          );
                        }}
                      />
                    </div> */}
                    {/* {values?.billingStatus?.value === 0 && ( */}
                    <div className="col-lg-2">
                      <button
                        className="btn btn-primary mr-2 mt-5"
                        type="button"
                        onClick={() => setOpen(true)}
                      >
                        Attachment
                      </button>
                    </div>
                    {/* )} */}

                    <DropzoneDialogBase
                      filesLimit={5}
                      acceptedFiles={['image/*']}
                      fileObjects={fileObjects}
                      cancelButtonText={'cancel'}
                      submitButtonText={'submit'}
                      maxFileSize={1000000}
                      open={open}
                      onAdd={(newFileObjs) => {
                        setFileObjects([].concat(newFileObjs));
                      }}
                      onDelete={(deleteFileObj) => {
                        const newData = fileObjects.filter(
                          (item) => item.file.name !== deleteFileObj.file.name,
                        );
                        setFileObjects(newData);
                      }}
                      onClose={() => setOpen(false)}
                      onSave={() => {
                        setOpen(false);
                        empAttachment_action(fileObjects).then((data) => {
                          setUploadImage(data);
                        });
                      }}
                      showPreviews={true}
                      showFileNamesInPreview={true}
                    />
                  </div>
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="mr-5">
                      <strong style={{ fontSize: '14px' }}>
                        Total Bill Amount (with VAT) :{' '}
                        {rowDto?.length > 0
                          ? rowDto
                              ?.filter((item) => item?.isSelect)
                              ?.reduce(
                                (accumulator, currentValue) =>
                                  accumulator +
                                    +currentValue?.totalBilledAmount || 0,
                                0,
                              )
                          : 0}
                      </strong>
                    </div>
                    <div>
                      <InputField
                        name="modifyVatPercentage"
                        placeholder="Modify Vat Percentage"
                        type="number"
                        className="form-control"
                        disabled={
                          !rowDto?.filter((item) => item?.isSelect)?.length
                        }
                        onChange={(e) => {
                          setFieldValue(
                            'modifyVatPercentage',
                            e.target.value || '',
                          );
                          const modifyData = rowDto?.map((item) => {
                            let numericTotalAmount =
                              parseFloat(
                                +item?.totalAmount.replace(/,/g, ''),
                              ) || 0;

                            let modifyVatAmount =
                              ((numericTotalAmount || 0) *
                                (+e?.target?.value || 0)) /
                              100;

                            return item?.isSelect
                              ? {
                                  ...item,
                                  vatamount: modifyVatAmount,
                                  modifyVatPercentage: +e.target.value || 0,
                                  totalBilledAmount:
                                    (+item?.totalAmount || 0) +
                                    (+modifyVatAmount || 0),
                                }
                              : item;
                          });
                          setRowDto(modifyData);
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{ maxHeight: '900px' }}
                    className="scroll-table-auto"
                  >
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          {/* {values?.billingStatus?.label !== "Done" && ( */}
                          <th style={{ minWidth: '35px' }}>
                            <input
                              type="checkbox"
                              name="allCheck"
                              onClick={() => {
                                setAllCheck();
                              }}
                              disabled
                            />
                          </th>
                          {/* )} */}
                          <th style={{ minWidth: '150px' }}>Charge Type</th>
                          <th style={{ minWidth: '100px' }}>PO No</th>
                          <th style={{ minWidth: '100px' }}>LC No</th>
                          <th style={{ minWidth: '100px' }}>Shipment</th>
                          <th style={{ minWidth: '100px' }}>Sub Charge Type</th>
                          <th style={{ minWidth: '100px' }}>Supplier</th>
                          <th style={{ minWidth: '80px' }}>Booked Amount</th>
                          <th style={{ minWidth: '130px' }}>
                            Bill Amount (with VAT)
                          </th>
                          <th style={{ minWidth: '100px' }}>VAT Amount</th>
                          <th style={{ minWidth: '60px' }}>Due Date</th>
                        </tr>
                      </thead>
                      <tbody className="">
                        {rowDto?.map((item, index) => (
                          <tr
                            key={index}
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                              if (
                                // item.costTypeId === 12 ||
                                // item.costTypeId === 21 ||
                                // item.costTypeId === 22 ||
                                // item.costTypeId === 13 ||
                                // item.costTypeId === 14 ||
                                // item.costTypeId === 15 ||
                                // item.costTypeId === 20
                                item.isMultipleSupplier
                              ) {
                                setIsShowModal(true);
                                setPoNumber(item?.ponumber);
                                setShipmentNo(item?.shipmentCode);
                                setLcNumber(item?.lcnumber);
                                setReferenceId(item?.costId);
                                setItemData(item);
                              }
                            }}
                          >
                            <td className="text-center">
                              <input
                                type="checkbox"
                                name="isSelect"
                                // disabled={
                                //   item.costTypeId === 12 ||
                                //   item.costTypeId === 21 ||
                                //   item.costTypeId === 22 ||
                                //   item.costTypeId === 13 ||
                                //   item.costTypeId === 14 ||
                                //   item.costTypeId === 15 ||
                                //   item.costTypeId === 20
                                // }
                                disabled={item.isMultipleSupplier}
                                checked={item?.isSelect}
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                onChange={(valueOption) => {
                                  rowDtoSelectHandler(
                                    item?.costTypeName,
                                    'isSelect',
                                    !item?.isSelect,
                                    index,
                                    values,
                                  );
                                }}
                              />
                            </td>
                            {/* )} */}
                            <td className="text-center">
                              {item?.costTypeName}
                            </td>
                            <td className="text-center">{item?.ponumber}</td>
                            <td className="text-center">{item?.lcnumber}</td>
                            <td className="text-center">
                              {item?.shipmentCode ? item.shipmentCode : '-'}
                            </td>
                            <td>{item?.subChargeTypeName}</td>
                            <td className="text-center">
                              {item?.businessPartnerName}
                            </td>
                            <td className="text-right">{item?.totalAmount}</td>
                            <td className="text-right">
                              {/* {values?.billingStatus?.label === "Done" &&
                                _formatMoney(item?.actualAmount)} */}
                              {/* {values?.billingStatus?.label !== "Done" && ( */}
                              <InputField
                                name="totalBilledAmount"
                                type="number"
                                className="form-control"
                                // disabled={item.costTypeId===12 || item.costTypeId===21 ||
                                //   item.costTypeId===22 || item.costTypeId===13 || item.costTypeId===14 || item.costTypeId===15 || item.costTypeId===20
                                // }
                                value={item?.totalBilledAmount}
                                placeholder="Total Billed Amount"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                onChange={(valueOption) => {
                                  rowDtoHandler(
                                    'totalBilledAmount',
                                    valueOption?.target?.value,
                                    index,
                                  );
                                }}
                              />
                              {/* )} */}
                            </td>
                            <td className="text-right">
                              {/* {values?.billingStatus?.label === "Done" &&
                                _formatMoney(item?.actualVat)} */}
                              {/* {values?.billingStatus?.label !== "Done" && ( */}
                              <InputField
                                name="vatamount"
                                placeholder="VAT"
                                value={rowDto[index]?.vatamount}
                                // disabled={item.costTypeId===12 || item.costTypeId===21 ||
                                //   item.costTypeId===22 || item.costTypeId===13 || item.costTypeId===14 || item.costTypeId===15 || item.costTypeId===20
                                // }
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                onChange={(e) => {
                                  rowDtoHandler(
                                    'vatamount',
                                    e?.target?.value,
                                    index,
                                  );

                                  let data = [...rowDto];
                                  let numericTotalAmount = parseFloat(
                                    item?.totalAmount.replace(/,/g, ''),
                                  );
                                  // data[index]["totalBilledAmount"] = (numericTotalAmount|| 0) + (numericTotalAmount * +e?.target?.value /100 || 0);
                                  data[index]['totalBilledAmount'] =
                                    (+numericTotalAmount || 0) +
                                    (+e?.target?.value || 0);
                                  setRowDto(data);
                                }}
                              />
                              {/* )} */}
                            </td>
                            <td className="text-center">
                              {/* {values?.billingStatus?.label === "Done" &&
                                _dateFormatter(item?.dueDate)} */}
                              {/* {values?.billingStatus?.label !== "Done" && ( */}
                              <InputField
                                value={item?.dueDate}
                                type="date"
                                name="dueDate"
                                className="form-control"
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                onChange={(valueOption) => {
                                  rowDtoHandler(
                                    'dueDate',
                                    valueOption?.target?.value,
                                    index,
                                  );
                                }}
                                disabled={
                                  values?.billingStatus?.label === 'Done'
                                }
                              />
                              {/* )} */}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

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
                  ></button>
                </Form>
              </CardBody>
              {rowDto?.length > 0 && (
                <PaginationTable
                  count={totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
              )}
            </Card>
            <ServiceBreakDownViewModal
              show={isShowModal}
              onHide={() => setIsShowModal(false)}
              supplierDDL={supplierDDL}
              poNumber={poNumber}
              shipmentNo={shipmentNo}
              lcNumber={lcNumber}
              referenceId={referenceId}
              state={state}
              itemData={itemData}
            />
          </>
        )}
      </Formik>
    </>
  );
}
