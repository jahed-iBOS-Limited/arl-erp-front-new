/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from "yup";
import NewSelect from './../../../../_helper/_select'
import InputField from '../../../../_helper/_inputField';
import IEdit from '../../../../_helper/_helperIcons/_edit';
import PaginationSearch from '../../../../_helper/_search';

const validationSchema = Yup.object().shape({
  // whName: Yup.string()
  //   .min(2, "Minimum 2 strings")
  //   .max(100, "Maximum 100 strings")
  //   .required("Holiday group name is required"),
});

function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  updateStatus,
  setWalletId,
  setId,
  paginationSearchHandler
}) {

  
  
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values);
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
          isValid,
        }) => (
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="strWalletType"
                      options={[{label: "Bank", value: 1}, {label: "MFS", value: 2}]}
                      value={values?.strWalletType}
                      onChange={(valueOption) => {
                        setFieldValue("strWalletType", valueOption);
                        // getItemDDL(accountId, bussinessUnitId, valueOption?.value, setRowDto);
                      }}
                      placeholder="Wallet Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Wallet Name</label>
                    <InputField
                      value={values?.strWalletName}
                      name="strWalletName"
                      placeholder="Wallet name"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Bank A/C ID</label>
                    <InputField
                      value={values?.strBankAccountId}
                      name="strBankAccountId"
                      placeholder="Bank A/C ID"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Bank A/C No</label>
                    <InputField
                      value={values?.strBankAccountNo}
                      name="strBankAccountNo"
                      placeholder="Bank A/C No"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Bank Name</label>
                    <InputField
                      value={values?.strBankName}
                      name="strBankName"
                      placeholder="Bank Name"
                      type="text"
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Commission (%)</label>
                    <InputField
                      value={values?.numCommissionPercentage}
                      name="numCommissionPercentage"
                      placeholder="Commission"
                      type="text"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3">
                  <PaginationSearch
                    placeholder="Wallet Name & Wallet Type"
                    paginationSearchHandler={paginationSearchHandler}
                  />
                </div>
                <div className="col-md-12">
                  {/* RowDto */}
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Wallet Name</th>
                        <th>Wallet Type</th>
                        <th>Bank A/C ID</th>
                        <th>Bank A/C No</th>
                        <th>Bank Name</th>
                        <th>Commission (%)</th>
                        <th>Is Active</th>
                        <th style={{width:'100px'}}>Action</th>
                      </tr>
                    </thead>
                    <tbody className="itemList">
                      {rowDto?.length>0 && rowDto?.map((item, index) =>{
                      return(
                        <tr key={item?.sl}>
                          <td>{item?.sl}</td>
                          <td className="text-left">{item?.strWalletName}</td>
                          <td className="text-left">{item?.strWalletType}</td>
                          <td>{item?.strBankAccountId}</td>
                          <td>{item?.strBankAccountNo}</td>
                          <td>{item?.strBankName}</td>
                          <td className="text-center">{item?.numCommissionPercentage}</td>
                          <td className="text-center">
                            <input 
                              style={{width:'80px', borderRadius: "5px"}}
                              type="checkbox" 
                              checked={item?.isActive}
                              onChange={()=>{
                                updateStatus(!item?.isActive, index)
                                setWalletId(item?.id)
                              }}
                            /> 
                          </td>
                          <td className="text-center">
                            <span
                              className="ml-3"
                              onClick={() => {
                                setId(item?.id)
                              }}
                            >
                              <IEdit />
                            </span>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              </div>
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
              ></button>
            </Form>
            
        )}
      </Formik>
    </>
  )
}

export default _Form
