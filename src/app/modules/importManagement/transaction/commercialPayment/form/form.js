import React from "react";
import { Formik, Form } from "formik";
import axios from "axios";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { getLandingData } from "../helper";
import NewSelect from "../../../../_helper/_select";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  selectedBusinessUnit,
  profileData,
  rowDto,
  supplierDDL,
  remover,
  setRowDto,
  statusOption,
}) {
  const loadPOLC = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/imp/LetterOfCredit/GetPOorLCNumberList?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchTerm=${v}`
      )
      .then((res) => res?.data);
  };
  const allChecked = (value) => {
    let data = [...rowDto];
    let newData = data?.map((item) => {
      return {
        ...item,
        isSelect: value,
      };
    });
    setRowDto(newData);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
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
            <Form className='form form-label-right'>
              {/* {console.log("values", values)} */}
              <div className=' row global-form'>
                <div className='col-lg-3'>
                  <label htmlFor=''>PO no/ LC no(Optional)</label>
                  <SearchAsyncSelect
                    name='polcNo'
                    selectedValue={values?.polcNo}
                    isSearchIcon={true}
                    handleChange={(valueOption) => {
                      setFieldValue("polcNo", valueOption);
                    }}
                    loadOptions={loadPOLC}
                  />
                </div>
                <div className='col-lg-3'>
                  <NewSelect
                    options={supplierDDL}
                    label='Supplier (Optional)'
                    placeholder='Supplier (Optional)'
                    onChange={(valueOption) => {
                      setFieldValue("supplier", valueOption);
                    }}
                  />
                </div>
                {console.log("Values", values)}
                <div className='col-lg-3'>
                  <NewSelect
                    name='billingStatus'
                    value={values?.billingStatus}
                    options={statusOption}
                    label='Status'
                    onChange={(valueOption) => {
                      setFieldValue("billingStatus", valueOption);
                    }}
                  />
                </div>
                <div className='col-lg-3 d-flex align-items-end'>
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={() => {
                      getLandingData(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        values?.polcNo?.label,
                        values?.supplier?.value,
                        values?.billingStatus?.value,
                        setRowDto
                      );
                    }}
                  >
                    Show
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className='loan-scrollable-table'>
                <div
                  className='scroll-table _table'
                  style={{ maxHeight: "30rem" }}
                >
                  <table className='table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table mr-1'>
                    <thead>
                      <tr>
                        <th
                          style={{ minWidth: "75px" }}
                          className='d-flex flex-column justify-content-center align-items-center'
                        >
                          <label>CheckBox</label>
                          <input
                            style={{ width: "15px", height: "15px" }}
                            name='isSelect'
                            checked={values?.isSelect}
                            className='form-control'
                            type='checkbox'
                            onChange={(e) => allChecked(e.target.checked)}
                            // onChange={(e) => setAllSelect(!allSelect)}
                          />
                        </th>
                        <th style={{ minWidth: "200px" }}>Charge Type</th>
                        <th style={{ minWidth: "100px" }}>Supplier</th>
                        <th style={{ minWidth: "100px" }}>PO no</th>
                        <th style={{ minWidth: "100px" }}>LC no</th>
                        <th style={{ minWidth: "100px" }}>Booked Amount</th>
                        <th style={{ minWidth: "130px" }}>
                          Total Billed Amount
                        </th>
                        <th style={{ minWidth: "100px" }}>VAT Amount</th>
                        <th style={{ minWidth: "100px" }}>Due Date</th>
                        <th style={{ minWidth: "100px" }}>Billing Status</th>
                        <th style={{ minWidth: "100px" }}>Payment Status</th>
                      </tr>
                    </thead>
                    <tbody className='global-form'>
                      {rowDto?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            {/* <input type="checkbox" name="checkbox" /> */}
                            <input
                              style={{ width: "15px", height: "15px" }}
                              name='isSelect'
                              checked={item?.isSelect}
                              className='form-control ml-8'
                              type='checkbox'
                              onChange={() => {
                                const data = [...rowDto];
                                data[index].isSelect = !data[index].isSelect;
                                setRowDto(data);
                              }}
                            />
                          </td>
                          <td>{item?.costTypeName}</td>
                          <td>{item?.businessPartnerName}</td>
                          <td>{item?.ponumber}</td>
                          <td>{item?.lcnumber}</td>
                          <td>{item?.totalAmount}</td>
                          <td>
                            <input
                              type='number'
                              name='totalBilledAmount'
                              className='form-control'
                              placeholder='Total Billed Amount'
                              min={0}
                              step='any'
                              onChange={(e) => {
                                const data = [...rowDto];
                                data[index].totalBilledAmount = e.target.value;
                                setRowDto(data);
                              }}
                            />
                          </td>
                          <td>
                            <input
                              disabled
                              placeholder='VAT Amount'
                              defaultValue={item?.vatamount}
                              // value={values?.vatAmount}
                              name='vatAmount'
                              type='number'
                              step='any'
                            />
                          </td>
                          <td>
                            <input
                              type='date'
                              name='dueDate'
                              className='form-control'
                              value={item?.dueDate}
                              onChange={(e) => {
                                const data = [...rowDto];
                                data[index].dueDate = _dateFormatter(
                                  e.target.value
                                );
                                setRowDto(data);
                              }}
                            />
                          </td>
                          <td>{item?.billingStatus ? "True" : "False"}</td>
                          <td>{item?.paymentStatus ? "True" : "False"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <button
                type='submit'
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type='reset'
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
