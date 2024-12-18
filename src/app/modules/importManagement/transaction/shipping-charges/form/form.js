/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  Card,
  CardHeader,
  ModalProgressBar,
  CardHeaderToolbar,
  CardBody,
} from '../../../../../../_metronic/_partials/controls';
import { useHistory } from 'react-router-dom';
import { Formik, Form } from 'formik';
import NewSelect from '../../../../_helper/_select';
import { useDispatch } from 'react-redux';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import InputField from '../../../../_helper/_inputField';
import ICustomTable from '../../../../_helper/_customTable';
import ButtonStyleOne from '../../../../_helper/button/ButtonStyleOne';
import { DropzoneDialogBase } from 'material-ui-dropzone';
import { getDownlloadFileView_Action } from '../../../../_helper/_redux/Actions';
import { empAttachment_action } from '../helper';

export default function _Form({
  initData,
  saveHandler,
  edit,
  viewType,
  agentDDL,
  shipmentDDL,
  shippingLineDDL,
  bankListDDL,
  open,
  setOpen,
  setFileObjects,
  fileObjects,
  setUploadImage,
  accId,
  buId,
  gridData,
}) {
  // Table Headers
  const header = ['Bill No', 'PO', 'Payment Date', 'Amount (BDT)'];
  const history = useHistory();
  const backHandler = () => {
    history.goBack();
  };

  const TotalAmount = () => {
    let total = 0;
    gridData.forEach((item) => {
      total += item?.totalAmount;
    });
    return total;
  };

  const dispatch = useDispatch();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            // setRowDto([]);
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
          setValues,
        }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Shipping Charges Payment Info">
                <CardHeaderToolbar>
                  <>
                    <button
                      type="reset"
                      onClick={backHandler}
                      // ref={resetBtnRef}
                      className="btn btn-light ml-2"
                    >
                      <i className="fa fa-arrow-left"></i>
                      Back
                    </button>
                    <button
                      type="reset"
                      onClick={resetForm}
                      // ref={resetBtnRef}
                      className="btn btn-light ml-2"
                      disabled={viewType === 'view' ? true : false}
                    >
                      <i className="fa fa-redo"></i>
                      Reset
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="btn btn-primary ml-2"
                      type="submit"
                      disabled={viewType === 'view' ? true : false}
                    >
                      Save
                    </button>
                  </>
                </CardHeaderToolbar>
              </CardHeader>

              <CardBody>
                <Form className="form form-label-right">
                  {/* Header Start */}

                  <div className="row cash_journal">
                    {/* {loading && <Loading />} */}
                    <div className="col-lg-7">
                      <div className="d-flex pl-5">
                        <div className="p-2">
                          <NewSelect
                            options={shippingLineDDL || []}
                            value={values?.shippingLine}
                            name="shippingLine"
                            label="Shipping Line"
                            onChange={(valueOption) => {
                              setFieldValue('shippingLine', valueOption);
                            }}
                            isDisabled={viewType === 'view' ? true : false}
                          />
                        </div>
                        <div className="p-2">
                          <NewSelect
                            name="agent"
                            value={values?.agent}
                            options={agentDDL || []}
                            label="Agent/Forwarder"
                            onChange={(valueOption) => {
                              setFieldValue('agent', valueOption);
                            }}
                            isDisabled={viewType === 'view' ? true : false}
                          />
                        </div>
                        <div className="pt-2 pl-1">
                          <label>Arival Date</label>
                          <InputField
                            value={values?.arivalDate}
                            name="arivalDate"
                            type="date"
                            disabled={viewType === 'view' ? true : false}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="pl-5 payment pl-5 pr-5">
                          <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing ">
                            <tbody>
                              <tr>
                                <th>Bill No</th>
                                <td>
                                  <InputField
                                    value={values?.billNo}
                                    name="billNo"
                                    disabled={
                                      viewType === 'view' ? true : false
                                    }
                                  />
                                </td>
                              </tr>
                              <tr>
                                <th>Description</th>
                                <td>
                                  <InputField
                                    value={values?.description}
                                    name="description"
                                    disabled={
                                      viewType === 'view' ? true : false
                                    }
                                  />
                                </td>
                              </tr>
                              <tr>
                                <th>Instrument</th>
                                <td>
                                  <NewSelect
                                    // options={[]}
                                    name="instrument"
                                    value={values?.instrument}
                                    isDisabled={
                                      viewType === 'view' ? true : false
                                    }
                                  />
                                </td>
                              </tr>
                              <tr>
                                <th>Pay Bank</th>
                                <td>
                                  <NewSelect
                                    options={bankListDDL || []}
                                    value={values?.payBank}
                                    name="payBank"
                                    onChange={(valueOption) => {
                                      setFieldValue('payBank', valueOption);
                                    }}
                                    isDisabled={
                                      viewType === 'view' ? true : false
                                    }
                                  />
                                </td>
                              </tr>
                              <tr>
                                <th>Delivery Date</th>
                                <td>
                                  <InputField
                                    name="deliveryDate"
                                    value={values?.deliveryDate}
                                    type="date"
                                    disabled={
                                      viewType === 'view' ? true : false
                                    }
                                  />
                                </td>
                              </tr>
                              <tr>
                                <th>Amount (BDT)</th>
                                <td>
                                  <InputField
                                    name="amountBDT"
                                    value={values?.amountBDT}
                                    disabled={
                                      viewType === 'view' ? true : false
                                    }
                                  />
                                </td>
                              </tr>
                              <tr>
                                <th>Demurrage (BDT)</th>
                                <td>
                                  <InputField
                                    name="demurrage"
                                    value={values?.demurrage}
                                    disabled={
                                      viewType === 'view' ? true : false
                                    }
                                  />
                                </td>
                              </tr>
                              <tr>
                                <th>Total (BDT)</th>
                                <td>
                                  <InputField
                                    name="total"
                                    value={values?.total}
                                    disabled={
                                      viewType === 'view' ? true : false
                                    }
                                  />
                                </td>
                              </tr>
                              <tr>
                                <th>Payment Date</th>
                                <td>
                                  <InputField
                                    name="paymentDate"
                                    value={values?.paymentDate}
                                    type="date"
                                    disabled={
                                      viewType === 'view' ? true : false
                                    }
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div className="text-right pt-1">
                            {/* <div className="col-lg-3"> */}

                            {viewType === 'view' ? (
                              <div className="text-right">
                                <button
                                  className="btn btn-primary d-flex"
                                  type="button"
                                  onClick={() => {
                                    console.log(
                                      values?.attachment,
                                      'attachment',
                                    );
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        values?.attachment,
                                      ),
                                    );
                                  }}
                                >
                                  <i className="fas fa-eye mr-1"></i>
                                  View
                                </button>
                              </div>
                            ) : (
                              <div>
                                <DropzoneDialogBase
                                  filesLimit={1}
                                  acceptedFiles={['image/*', 'application/pdf']}
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
                                      (item) =>
                                        item.file.name !==
                                        deleteFileObj.file.name,
                                    );
                                    setFileObjects(newData);
                                  }}
                                  onClose={() => setOpen(false)}
                                  onSave={() => {
                                    setOpen(false);
                                    empAttachment_action(fileObjects).then(
                                      (data) => {
                                        setUploadImage(data);
                                      },
                                    );
                                  }}
                                  showPreviews={true}
                                  showFileNamesInPreview={true}
                                />
                                <div>
                                  <ButtonStyleOne
                                    className="btn btn-primary mr-2"
                                    type="button"
                                    onClick={() => setOpen(true)}
                                    label="Attachment"
                                  />
                                </div>
                              </div>
                            )}

                            {/* </div> */}
                            {/* <button
                              style={btnStyle}
                              className="btn btn-primary"
                              type="submit"
                              onClick={handleSubmit}
                            >
                              Save Shipping Charges Payment
                            </button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-5 pt-1">
                      <div className="pb-2">
                        <NewSelect
                          name="shipment"
                          options={shipmentDDL || []}
                          value={values?.shipment}
                          label="Shipment"
                          onChange={(valueOption) => {
                            setFieldValue('shipment', valueOption);
                          }}
                          isDisabled={
                            viewType === 'view' || viewType === 'edit'
                          }
                        />
                      </div>
                      {/* <h5 className="text-center p-5">
                        Shipping Charges Payment Info
                      </h5> */}
                      <ICustomTable ths={header}>
                        {gridData?.length > 0 &&
                          gridData?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  <span className="pl-2">{item?.billNo}</span>
                                </td>
                                <td>
                                  <span className="pl-2">{item?.poNumber}</span>
                                </td>
                                <td>
                                  <span className="pl-2">
                                    {_dateFormatter(item?.paymentDate)}
                                  </span>
                                </td>
                                <td className="text-right">
                                  <span className="pl-2">
                                    {item?.totalAmount}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        <tr>
                          <td></td>
                          <td style={{ fontWeight: '900', textAlign: 'right' }}>
                            Total
                          </td>

                          <td></td>
                          <td style={{ fontWeight: '900', textAlign: 'right' }}>
                            {TotalAmount()}
                          </td>
                        </tr>
                      </ICustomTable>
                    </div>

                    {/* {gridData?.data?.length > 0 && (
                      <PaginationTable
                        count={gridData?.totalCount}
                        setPositionHandler={setPositionHandler}
                        paginationState={{
                          pageNo,
                          setPageNo,
                          pageSize,
                          setPageSize,
                        }}
                      />
                    )} */}
                  </div>
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
