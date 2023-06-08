/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Loading from "./../../../../_helper/_loading";
import { Modal } from 'react-bootstrap';
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { isUniq } from "../../../../_helper/uniqChecker";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { saveServicezbreakdown, getCommercialCostingServiceBreakdown } from "../helper"
import { toast } from "react-toastify";

const validationSchema = Yup.object().shape({});
const initData={}

const BreakDownModal = ({show, onHide, supplierDDL, polcNo, referenceId, setReferenceId, shipmentId}) => {
  const [rowDto, setRowDto] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    if(referenceId){
      getCommercialCostingServiceBreakdown(referenceId, setRowDto)
    }
  }, [referenceId])

  const addHandler = (payload) => {
    if (isUniq('supplierName', payload.supplierName, rowDto)) {
      setRowDto([payload, ...rowDto])
    }
  }

  const remover = (id) => {
    let data = rowDto.filter((itm, index) => index !== id);
    setRowDto(data);
  };

  const saveHandler= (payload) => {
    if(rowDto.length>0){
      saveServicezbreakdown(rowDto, setIsLoading, onHide, setReferenceId)
    }else{
      toast.warning("Please add at least one row")
    }
  }

  return (
    <div className="viewModal">
         <Modal
            show={show}
            onHide={onHide}
            size="xl"
            aria-labelledby="example-modal-sizes-title-xl"
         >
            <>
              {" "}
              <Modal.Header className="bg-custom ">
                  <Modal.Title className="text-center">Service Break Down</Modal.Title>
              </Modal.Header>
              {/* <p style={{ borderBottom: "1px solid gray" }} className="my-1"></p> */}
              <Modal.Body id="example-modal-sizes-title-xl">
                <Formik
                  enableReinitialize={true}
                  initialValues={initData}
                  validationSchema={validationSchema}
                  onSubmit={(values, { setSubmitting, resetForm }) => {
                    // saveHandler(values, () => {
                    //   resetForm(initData);
                    //   setRowData([]);
                    // });
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
                    <Form className="form form-label-right">
                      {isloading && <Loading />}
                      <div className="global-form">
                        <div className="row">
                          <div className="col-lg-3">
                            <NewSelect
                              label="Supplier"
                              options={supplierDDL || []}
                              value={values?.supplier}
                              placeholder="Select Supplier"
                              name="costElement"
                              onChange={(valueOption) => {
                                setFieldValue("supplier", valueOption);
                              }}
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              value={values?.amount}
                              label="Amount"
                              placeholder="Amount"
                              onChange={e => {
                               if(e.target.value<0){
                                 setFieldValue("amount", "")
                               }else{
                                setFieldValue("amount", parseInt(e.target.value))
                               }
                              }}
                              type="number"
                              name="amount"
                            />
                          </div>
                          <div className="col-lg-3">
                            <InputField
                              value={values?.description}
                              label="Description (optional)"
                              placeholder="Description"
                              required
                              type="text"
                              name="description"
                            />
                          </div>
                          <div className="col-lg-1" style={{ marginTop: "20px" }}>
                            <button
                              type="button"
                              disabled={
                                !values.supplier || !values.amount
                              }
                              onClick={() => {
                               addHandler({
                                "accountId": profileData?.accountId,
                                "businessUnitId": selectedBusinessUnit?.value,
                                "serviceBreakdownId": 0,
                                "referenceId": referenceId,
                                "poId": polcNo?.poId,
                                "lcId": polcNo?.lcId,
                                "shipmentId": shipmentId,
                                "supplierId": values?.supplier?.value,
                                "supplierName": values?.supplier?.label,
                                "description": values?.description,
                                "numContractedAmount": values?.amount
                               })
                               setFieldValue("supplier", "")
                               setFieldValue("amount", "")
                               setFieldValue("description", "")
                              }}
                              className="btn btn-primary"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>      
                      <div className="react-bootstrap-table table-responsive">
                        <table className="table table-striped table-bordered global-table">
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Supplier</th>
                              <th>Description</th>
                              <th>Amount</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.length > 0 &&
                              rowDto?.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <td style={{ width: "30px" }} className="text-center">
                                      {index + 1}
                                    </td>
                                    <td>
                                      <span className="pl-2">{item?.supplierName}</span>
                                    </td>
                                    <td>
                                      <span className="pl-2">{item?.description}</span>
                                    </td>
                                    <td>
                                      <span className="pl-2">{item?.numContractedAmount}</span>
                                    </td>
                                    <td style={{ width: "60px" }} className="text-center">
                                      <IDelete remover={remover} id={index} />
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </div>
                    </Form>  
                  )}
                </Formik>    
              </Modal.Body>
              <Modal.Footer>
                <div>
                    <button
                      type="button"
                      onClick={() => saveHandler()}
                      className="btn btn-primary mr-2"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() =>{
                        setRowDto([])
                        setReferenceId(0)
                        onHide()
                      }}
                      className="btn btn-light btn-elevate"
                    >
                      Close
                    </button>
                </div>
              </Modal.Footer>
            </>
         </Modal>
      </div>
  );
};

export default BreakDownModal;
