/* eslint-disable no-array-constructor */
import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector, shallowEqual } from "react-redux";
import NewSelect from "../../../_helper/_select";
import { Card, CardHeader, CardBody, ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import { getMonthlySalesReport, getWarehouseDDL } from "../helper"

const initData = {
  outletName: "",
  reportType: "",
};

// Validation schema
const validationSchema = Yup.object().shape({
  
});

const reportTypeDDL=[
  {value: 1, label: "Sales Value"},
  {value: 2, label: "Sales Beneficiaries"},
  {value: 3, label: "Average Basket Size"},
  {value: 4, label: "Basket Size > 2000 TK"},
  {value: 5, label: "Basket Size < 500 TK"},
]

export default function MonthlySalesReport() {
  const [whName, setWhName] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [months, setMonths] = useState([]);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getWarehouseDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setWhName
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    var monthName = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
    var d = new Date();
    d.setDate(1);
    let months=[]
    for (let i=0; i<=11; i++) {
      months.push({monthId:d.getMonth()+1, month:monthName[d.getMonth()] + ',' + d.getFullYear()})
      d.setMonth(d.getMonth() - 1);
    }
    setMonths(months);
  }, [])

  const getMonthSalesAmount=(monthId, data)=>{
    const index=data.findIndex((item=>item.monthId === monthId))
    if(index> -1){
      return data[index].value
    }else{
      return 0;
    }
  }

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          //saveHandler(values);
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
          <div className="global-card-header">
            <Card>
            {true && <ModalProgressBar />}
              <CardHeader title={"Monthly Sales Report"}>
                
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <NewSelect
                          name="outletName"
                          options={[{value:0, label:"All"}, ...whName]}
                          value={values?.outletName}
                          onChange={(valueOption) => {
                            setFieldValue("outletName", valueOption)
                            if(valueOption?.value===0){
                              let outletList=[]
                              for(let item of whName){
                                outletList.push(item?.value)
                              }
                              setFieldValue("outletList", outletList)
                            }else{
                              setFieldValue("outletList", [valueOption?.value]);
                            }
                          }}
                          placeholder="Outlet Name"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="reportType"
                          options={reportTypeDDL}
                          value={values?.reportType}
                          onChange={(valueOption) => {
                            setFieldValue("reportType", valueOption);
                          }}
                          placeholder="Report Type"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div style={{ marginTop: "18px" }} className="col-lg-1">
                        <button
                          //disabled={!values?.whName || !values?.counter}
                          className="btn btn-primary"
                          onClick={() => {
                            getMonthlySalesReport(
                              values?.reportType?.value, 
                              values?.outletList,
                              setRowDto
                            );
                          }}
                          type="button"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Outlet Name</th>
                          {
                            months.map(data=>(
                              <th>{data.month}</th>
                            ))
                          }
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.outletName}</td>
                            {
                              months.map(data=>(
                                <td>{getMonthSalesAmount(data?.monthId, item?.value)}</td>
                              ))
                            }
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
}
