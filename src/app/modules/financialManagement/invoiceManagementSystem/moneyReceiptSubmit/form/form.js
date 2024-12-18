import { Form, Formik } from 'formik';
import React from 'react';
import { useHistory } from 'react-router-dom';
import ICustomCard from '../../../../_helper/_customCard';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import { _fixedPoint } from '../../../../_helper/_fixedPoint';
import InputField from '../../../../_helper/_inputField';
import NewSelect from '../../../../_helper/_select';
import { getBankBranchDDL_api } from '../helper';

export default function _Form({
  type,
  title,
  rowData,
  initData,
  bankList,
  branchList,
  addDisable,
  saveHandler,
  setBranchList,
  rowDataHandler,
}) {
  // const radioStyle = { height: "25px", width: "25px" };
  const history = useHistory();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
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
        }) => (
          <ICustomCard
            title={title}
            backHandler={() => {
              history.goBack();
            }}
            resetHandler={() => resetForm(initData)}
            saveHandler={() => handleSubmit()}
          >
            <Form className="form form-label-right">
              <div className="row global-form global-form-custom">
                {/* <div className="col-12 mt-3 d-flex">
                  <div className="d-flex align-items-center mr-5">
                    <input
                      style={radioStyle}
                      type="radio"
                      name="type"
                      id="badc"
                      value={values?.type}
                      checked={values?.type === "badc"}
                      onChange={() => {
                        setFieldValue("type", "badc");
                      }}
                      disabled={type === "view"}
                    />
                    <label htmlFor="badc" className="ml-1">
                      <h3>BADC</h3>
                    </label>
                  </div>
                  <div className="d-flex align-items-center ml-5">
                    <input
                      style={radioStyle}
                      type="radio"
                      name="type"
                      id="bcic"
                      value={values?.type}
                      checked={values?.type === "bcic"}
                      onChange={() => {
                        setFieldValue("type", "bcic");
                      }}
                      disabled={type === "view"}
                    />
                    <label htmlFor="bcic" className="ml-1">
                      <h3>BCIC</h3>
                    </label>
                  </div>
                </div> */}
                <div className="col-lg-3">
                  <NewSelect
                    name="depositMode"
                    options={[
                      { value: 1, label: 'Bank' },
                      { value: 2, label: 'Cash' },
                    ]}
                    value={values?.depositMode}
                    label="Deposit Mode"
                    onChange={(valueOption) => {
                      setFieldValue('depositMode', valueOption);
                    }}
                    placeholder="Deposit Mode"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {values?.depositMode?.value === 1 && (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="bank"
                        options={bankList || []}
                        value={values?.bank}
                        label="Bank Name"
                        onChange={(valueOption) => {
                          setFieldValue('bank', valueOption);
                          getBankBranchDDL_api(
                            valueOption?.value,
                            setBranchList,
                          );
                        }}
                        placeholder="Bank Name"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="branch"
                        options={branchList || []}
                        value={values?.branch}
                        label="Branch Name"
                        onChange={(valueOption) => {
                          setFieldValue('branch', valueOption);
                        }}
                        placeholder="Branch Name"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                )}

                <div className="col-lg-3">
                  <InputField
                    value={values?.referenceNo}
                    name="referenceNo"
                    label="Reference No"
                    placeholder="Reference No"
                    type="text"
                    disabled={type}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.date}
                    name="date"
                    label="Date"
                    placeholder="Date"
                    type="date"
                    disabled={type}
                  />
                </div>
                <div className="col-12"></div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.amount}
                    name="amount"
                    label="Amount"
                    placeholder="Amount"
                    type="number"
                    disabled={type}
                  />
                </div>
                <div className="col-lg-3 mt-5">
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      rowDataHandler(values);
                    }}
                    disabled={addDisable || !values?.amount}
                  >
                    + Add
                  </button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40px' }}>SL</th>
                      <th>Delivery Code</th>
                      <th>Completion Date</th>
                      <th>Quantity</th>
                      <th>Delivery Invoice Amount</th>
                      <th>Salesforce Dues</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowData?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td> {index + 1}</td>
                          <td>{item?.strdeliverycode}</td>
                          <td>{_dateFormatter(item?.dteCompleteDate)}</td>
                          <td className="text-right">
                            {_fixedPoint(item?.numQuantity, true, 0)}
                          </td>
                          <td className="text-right">
                            {_fixedPoint(item?.numDeliveryInvoiceAmount, true)}
                          </td>
                          <td className="text-right">
                            {_fixedPoint(item?.monSalesForceDues, true)}
                          </td>
                          <td className="text-right">
                            {_fixedPoint(item?.amount, true)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Form>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
