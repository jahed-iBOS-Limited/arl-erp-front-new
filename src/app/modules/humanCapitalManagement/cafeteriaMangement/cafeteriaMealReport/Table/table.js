import React, { useEffect, useState, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICard from "../../../../_helper/_card";
import ICustomTable from "../../../../_helper/_customTable";

import { Formik, Form } from "formik";
import { _todayDate } from "../../../../_helper/_todayDate";

import NewSelect from "../../../../_helper/_select";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";

import {
  getCustomerNameDDL,
  GetShippointDDL,
} from "../helper";
import Axios from "axios";

const ths = ["Sl", "Product NAme", "QTY", "Amount"];
const reportDDL = [
  { value: 1, label: "All" },
  { value: 2, label: "Shippoint" },
  { value: 3, label: "Customer Name" },
];

// Validation schema
const validationSchema = Yup.object().shape({
  fromDate: Yup.date().required("From Date is required"),

  toDate: Yup.date().required("To Date is required"),

  reportDDL: Yup.object().shape({
    label: Yup.string().required("Report Type is required"),
    value: Yup.string().required("Report Type is required"),
  }),
  shippointDDL: Yup.object().shape({
    label: Yup.string().required("Ship Point is required"),
    value: Yup.string().required("Ship Point is required"),
  }),
  customerNameDDL: Yup.object().shape({
    label: Yup.string().required("Customer Name is required"),
    value: Yup.string().required("Customer Name is required"),
  }),
});

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  reportDDL: "",
  shippointDDL: "",
  customerNameDDL: "",
};

export default function CafeteriaMealReportTable({
  btnRef,
  saveHandler,
  resetBtnRef,
  empDDL,
  isEdit,
}) {
  const printRef = useRef();

  const [rowDto, setRowDto] = useState([]);
  const [shippointDDL, setShippointDDL] = useState([]);
  const [customerNameDDL, setCustomerNameDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetShippointDDL(
        profileData?.userId,
        profileData?.accountId,
        setShippointDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getCustomerNameDDL(profileData?.accountId, selectedBusinessUnit?.value, setCustomerNameDDL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const getSalesReportData = async (values, setter) => {
    const {fromDate,toDate,reportDDL} = values

    if(!fromDate||!toDate||!reportDDL) return

    try {
      const res = await Axios.get(
        
        `/oms/OManagementReport/GetSalesReportInDateRange?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&ReportTypeId=${values?.reportDDL?.value}&ShippointId=${values?.shippointDDL?.value || 0}&CustomerId=${values?.customerNameDDL?.value || 0}`
      );
      if (res.status === 200 && res?.data) {
        setter(res?.data);
      }
    } catch (error) {
      
    }
  };

  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title=""
          isPrint={true}
          isShowPrintBtn={true}
          componentRef={printRef}
        >
          <div ref={printRef}>
            <div className="mx-auto">
              <div className="text-center my-2">
                <b className="display-5"> DELIVERY REPORT </b> <br />
                <b className="display-5"> {selectedBusinessUnit?.label} </b>
              </div>

              <Formik
                enableReinitialize={true}
                initialValues={initData}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                 
                  saveHandler(values, () => {
                    resetForm(initData);
                  });
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    {/*
                     */}
                    {console.log(values)}
                    <Form className="form form-label-right">
                      <div className="form-group row">
                        <div className="col-lg-2">

                       
                          <IInput
                            value={values?.fromDate}
                            label="From date"
                            name="fromDate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("fromDate",e?.target?.value)

                              const value = {
                                ...values,
                                fromDate: e?.target?.value
                              }
                              getSalesReportData(value, setRowDto);
                            }}
                          />
                        </div>

                        <div className="col-lg-2">
                          <IInput
                            value={values?.toDate}
                            label="To date"
                            name="toDate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("toDate",e?.target?.value)
                              
                              const value = {
                                ...values,
                                toDate: e?.target?.value
                              }
                              getSalesReportData(value, setRowDto);
                            }}
                          />
                        </div>

                        <div className="col-lg-2">
                          <NewSelect
                            name="reportDDL"
                            options={reportDDL}
                            value={values?.reportDDL}
                            label="Select Report Type"
                            onChange={(valueOption) => {
                              if(valueOption?.label !== "Shippoint" ){
                                setFieldValue("shippointDDL", "");
                              }
                              if(valueOption?.label !== "Customer Name" ){
                                setFieldValue("customerNameDDL", "");
                              }
                              setFieldValue("reportDDL", valueOption);

                              const value = {
                                ...values,
                                reportDDL: valueOption
                              }
                              
                              getSalesReportData(value, setRowDto);
                            }}
                            placeholder="Report Type"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-2">
                          <NewSelect
                            name="shippointDDL"
                            options={shippointDDL || []}
                            value={values?.shippointDDL}
                            label="Select Shippoint"
                            onChange={(valueOption) => {
                              setFieldValue("shippointDDL", valueOption);

                              const value = {
                                ...values,
                                shippointDDL: valueOption
                              }
                              getSalesReportData(value, setRowDto);
                            }}
                            placeholder="Ship Point"
                            errors={errors}
                            touched={touched}
                            isDisabled={
                              values?.reportDDL?.label === "All" ||
                              values?.reportDDL?.label === "Customer Name"
                            }
                          />
                        </div>
                        <div className="col-lg-2">
                          <NewSelect
                            name="customerNameDDL"
                            options={customerNameDDL || []}
                            value={values?.customerNameDDL}
                            label="Select Customer Name"
                            onChange={(valueOption) => {
                              setFieldValue("customerNameDDL", valueOption);

                              const value = {
                                ...values,
                                customerNameDDL: valueOption
                              }
                              getSalesReportData(value,setRowDto);
                            }}
                            placeholder="Customer name"
                            errors={errors}
                            touched={touched}
                            isDisabled={
                              values?.reportDDL?.label === "All" ||
                              values?.reportDDL?.label === "Shippoint"
                            }
                          />
                        </div>
                      </div>
                    </Form>
                  </>
                )}
              </Formik>

              <div className=" my-5">
                <ICustomTable ths={ths}>
                  {rowDto.map((itm, i) => {
                    return (
                      <tr key={i}>
                        <td className="text-center"> {i + 1}</td>
                        <td className="text-center"> {itm.productName}</td>
                        <td className="text-center"> {itm.productQTY}</td>
                        <td className="text-center">{itm.amount}</td>
                      </tr>
                    );
                  })}
                </ICustomTable>
              </div>
            </div>
          </div>
        </ICard>
      </>
    </Formik>
  );
}
