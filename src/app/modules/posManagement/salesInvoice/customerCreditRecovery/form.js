/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Formik, Form } from 'formik'
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { ExcelRenderer } from "react-excel-renderer";
import * as Yup from "yup";
import NewSelect from './../../../_helper/_select'
import { getCustomers } from "./../helper"
//import IDelete from './../../../_helper/_helperIcons/_delete';
import axios from 'axios';
import SearchAsyncSelect from '../../../_helper/SearchAsyncSelect';

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
  accountId,
  bussinessUnitId,
  whNameDDL,
  rowDto,
  setRowDto,
  remover,
  updateRecoverAmount,
}) {
  const [fileObject, setFileObject] = useState("");
  const [warehouseId, setWarehouseId] = useState("")
  const hiddenFileInput = React.useRef(null);
  const loadCustomerList = (v) => {
    if (v?.length < 3) return [];
    return axios
    .get(
      `/partner/Pos/GetCustomerNameDDL?SearchTerm=${v}&AccountId=${accountId}&BusinessUnitId=${bussinessUnitId}&WarehouseId=${warehouseId}`
    )
      .then((res) => res?.data);
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if (fileObject) {
      ExcelRenderer(fileObject, (err, resp) => {
        if (err) {
        } else {
          let rowData = [];
          for (let i = 1; i < resp.rows.length; i++) {
            rowData.push({
              customerId: resp.rows[i][0],
              customerName: resp.rows[i][1],
              customerHR_Code: resp.rows[i][2],
              employementInfo: resp.rows[i][3],
              creditLimit: resp.rows[i][4],
              customerDueAmount: resp.rows[i][5],
              recoverAmount: resp.rows[i][6],
            });
          }
          setRowDto(rowData);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileObject]);
  
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
                      name="whName"
                      options={whNameDDL}
                      value={values?.whName}
                      onChange={(valueOption) => {
                        setFieldValue("whName", valueOption);
                        setWarehouseId(valueOption?.value)
                      }}
                      placeholder="Outlet Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <div>
                      <label>Customer</label>
                      <SearchAsyncSelect
                        selectedValue={values?.customer}
                        name="customer"
                        handleChange={(valueOption) => {
                          setFieldValue("customer", valueOption);
                        }}
                        placeholder="Search By Mobile Number"
                        loadOptions={loadCustomerList}
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: "18px" }} className="col-lg-1">
                    <button
                      disabled={!values?.whName}
                      className="btn btn-primary"
                      onClick={() => {
                        getCustomers(values?.whName?.value, values?.customer?.value || 0, setRowDto);
                      }}
                      type="button"
                    >
                      View
                    </button>
                  </div>
                  <div className="col-lg-2">

                  </div>
                  <div className="col-lg-3">
                    <button
                      className="btn btn-primary"
                      onClick={handleClick}
                      type="button"
                      style={{
                        marginLeft: "10px",
                        marginTop: "18px",
                        float: "right"
                      }}
                    >
                      Import Excel
                    </button>
                    <input
                      type="file"
                      onChange={(e) => {
                        setFileObject(e.target.files[0]);
                        e.target.value = "";
                      }}
                      ref={hiddenFileInput}
                      style={{ display: "none" }}
                    />
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button"
                      className="btn btn-primary sales_invoice_btn customer-export-excel"
                      table="table-to-xlsx"
                      filename="customerCreditRecovery"
                      sheet="tablexls"
                      buttonText="Export Excel"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  {/* RowDto */}
                  <table className="table table-striped table-bordered global-table" id="table-to-xlsx">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Customer Name</th>
                        <th>Customer Enroll</th>
                        <th>Employeement Info</th>
                        <th>Customer's Due Amount</th>
                        <th style={{width:'120px'}}>Recover Amount</th>
                        {/* <th style={{width:'60px'}}>Action</th> */}
                      </tr>
                    </thead>
                    <tbody className="itemList">
                      {rowDto?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="text-left">{item?.customerName}</td>
                          <td className="text-left">{item?.customerHR_Code}</td>
                          <td>{item?.employementInfo}</td>
                          <td className="text-center">{item?.customerDueAmount}</td>
                          <td className="text-center">
                            <input 
                              style={{width:'120px', borderRadius: "5px"}}
                              type="number" 
                              name="recoverAmount"
                              defaultValue={item?.recoverAmount}
                              value={values?.recoverAmount}
                              onChange={(e)=>{
                                updateRecoverAmount(e.target.value, index)
                              }}
                            /> 
                          </td>
                          {/* <td className="text-right" style={{display: 'flex', justifyContent: 'space-around'}}>
                            <IDelete remover={remover} id={item?.itemName} />
                          </td> */}
                        </tr>
                      ))}
                      
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
