/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { Formik, Form } from 'formik'
import * as Yup from "yup";
import NewSelect from './../../../_helper/_select'
import InputField from "../../../_helper/_inputField";
import { getItemDDL } from "../helper"
import IDelete from './../../../_helper/_helperIcons/_delete';
import IEdit from '../../../_helper/_helperIcons/_edit';

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
  setItemDDL,
  itemDDL,
  rowDto,
  setter,
  remover,
  updateQuantity,
  editQuantity,
  setEditQuantity,
  isEdit,
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
                  <div className="col-lg-2">
                    <NewSelect
                      name="whName"
                      options={whNameDDL}
                      value={values?.whName}
                      onChange={(valueOption) => {
                        setFieldValue("whName", valueOption);
                        getItemDDL(accountId, bussinessUnitId, valueOption?.value, setItemDDL);
                      }}
                      placeholder="Outlet Name"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Narration</label>
                    <InputField
                      name="narration"
                      value={values?.narration}
                      placeholder="Narration"
                      type="text"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Damage Entry Date</label>
                    <InputField
                      name="dteDamageEntryDate"
                      value={values?.dteDamageEntryDate}
                      placeholder="Damage Entry Date"
                      type="date"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>
              <div className="global-form">  
                <div className="row">
                  <div className="col-lg-2">
                    <NewSelect
                      name="item"
                      options={itemDDL}
                      value={values?.item}
                      label="Item"
                      onChange={(valueOption) => {
                        setFieldValue("item", valueOption);
                      }}
                      placeholder="Search Item"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {
                    values?.item?.mrp> -1 && 
                    <div className="col-lg-2">
                      <label>M.R.P</label>
                      <InputField
                        name="mrp"
                        value={values?.item?.mrp}
                        placeholder="M.R.P"
                        type="text"
                        disabled="true"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  }
                  <div className="col-lg-2">
                    <label>Rate</label>
                    <InputField
                      name="rate"
                      value={values?.item?.rate}
                      placeholder="Rate"
                      type="text"
                      disabled={values?.item?.rate> -1? true: false}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Damage Quantity</label>
                    <InputField
                      name="damageQuantity"
                      value={values?.damageQuantity}
                      placeholder="Damage Quantity"
                      type="number"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div style={{ marginTop: "18px" }} className="col-lg-1">
                    <button
                      disabled={!values?.damageQuantity}
                      className="btn btn-primary"
                      onClick={ async () => {
                        await setter({
                          "itemId": values?.item?.value,
                          "itemCode": values?.item?.code,
                          "itemName": values?.item?.label,
                          "numDamageRate": values?.item?.rate,
                          "numMrp": values?.item?.mrp,
                          "uoMId": values?.item?.uomId,
                          "uoMName": values?.item?.uomName,
                          "numDamageQty": values?.damageQuantity,
                          "isActive": true
                        })
                        setFieldValue("item", "");
                        setFieldValue("damageQuantity", "")
                        setFieldValue("rate", "")
                      }}
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  {/* RowDto */}
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Item Name</th>
                        <th>Item Code</th>
                        <th>UOM</th>
                        <th>M.R.P</th>
                        <th>Rate</th>
                        <th style={{width:'120px'}}>Damage Quantity</th>
                        <th style={{ width:'60px'}}>Action</th>
                      </tr>
                    </thead>
                    <tbody className="itemList">
                      {rowDto?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="text-left">{item?.itemName}</td>
                          <td className="text-left">{item?.itemCode}</td>
                          <td>{item?.uoMName}</td>
                          <td className="text-center">{item?.numMrp}</td>
                          <td className="text-center">{item?.numDamageRate}</td>
                          {editQuantity?
                            <td className="text-center">
                              <input 
                                style={{width:'120px'}}
                                type="number" 
                                name="quantity"
                                defaultValue={item?.numDamageQty}
                                value={values?.numDamageQty}
                                onChange={(e)=>{
                                  updateQuantity(e.target.value, index)
                                }}
                                onKeyPress={(e)=>{
                                  if(e.key === "Enter"){
                                    setEditQuantity(false)
                                  }
                                }}
                              /> 
                            </td>:
                            <td className="text-center">{item?.numDamageQty}</td>
                          }
                          <td className="text-right" style={{display: 'flex', justifyContent: 'space-around'}}>
                            <IDelete remover={remover} id={item?.itemName} />
                            {isEdit?
                              <button 
                                style={{padding:0, border:0}}
                                onClick={(e)=>{
                                  e.preventDefault();
                                  setEditQuantity(true);
                                }} 
                              >
                                <IEdit />
                              </button>
                            :""}
                          </td>
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
