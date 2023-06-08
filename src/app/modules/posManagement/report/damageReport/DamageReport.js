import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import moment from "moment";
import ICard from "../../../_helper/_card";
import ICustomTable from "../../../_helper/_customTable";

import { Formik, Form } from "formik";
import { _todayDate } from "../../../_helper/_todayDate";

import NewSelect from "../../../_helper/_select";
import * as Yup from "yup";
import { IInput } from "../../../_helper/_input";

import {
  getDamageReportData,
  getWareHouseDDL
} from "../helper";
import Loading from "../../../_helper/_loading";
import numberWithCommas from "../../../_helper/_numberWithCommas";

const ths = ["Sl", "Warehouse", "Narration", "Damage Date", "Product Code", "Product Name", "UoM", " Damage QTY", "Damage Amount"];

// Validation schema
const validationSchema = Yup.object().shape({
  fromDate: Yup.date().required("From Date is required"),

  toDate: Yup.date().required("To Date is required"),

  reportType: Yup.object().shape({
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
  reportType: "",
  shippointDDL: "",
  customerNameDDL: "",
  salesOrg: "",
};

export default function DamageReport() {
  const printRef = useRef();

  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [whNameDDL, setWhNameDDL] = useState([])

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const setPositionHandler = (values) => {
    getDamageReportData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.whName?.value,
      values?.fromDate,
      values?.toDate,
      setLoading,
      setRowDto
    )
  };

  useEffect(() => {
    if(profileData?.accountId && selectedBusinessUnit?.value){
      getWareHouseDDL(profileData?.accountId, selectedBusinessUnit?.value, setWhNameDDL)
    }
  }, [profileData, selectedBusinessUnit])

  
  
  let totalAmount = 0;
  let totalProductQTY = 0;
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
                <h3>
                  <b className=""> DAMAGE REPORT </b>
                </h3>
                <h4>
                  <b className=""> {selectedBusinessUnit?.label} </b>
                </h4>
              </div>

              <Formik
                enableReinitialize={true}
                initialValues={initData}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  // saveHandler(values, () => {
                  //   resetForm(initData);
                  // });
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    <Form className="form form-label-right">
                      <div className="form-group row global-form printSectionNone">
                        <div className="col-lg-2">
                          <NewSelect
                            name="whName"
                            options={whNameDDL}
                            value={values?.whName}
                            label="Outlet Name"
                            onChange={(valueOption) => {
                              setRowDto([]);
                              setFieldValue("whName", valueOption)
                            }}
                            placeholder="Outlet Name"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-2">
                          <IInput
                            value={values?.fromDate}
                            label="From date"
                            name="fromDate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("fromDate", e?.target?.value);
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
                              setFieldValue("toDate", e?.target?.value);
                            }}
                          />
                        </div>
                        <div style={{ marginTop: "18px" }} className="col-lg-1">
                          <button
                            disabled={!values?.fromDate || !values?.toDate || !values?.whName}
                            className="btn btn-primary"
                            onClick={() => {
                              setPositionHandler(values)
                            }}
                            type="button"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </Form>
                  </>
                )}
              </Formik>
              {loading && <Loading />}
              <div className=" my-5">
                <ICustomTable ths={ths}>
                  {rowDto.map((itm, i) => {
                     totalAmount += +itm.damageAmount;
                     totalProductQTY += +itm.damageQty;
                    return (
                      <tr key={i}>
                        <td className="text-center"> {i+1}</td>
                        <td> {itm.wareHouse}</td>
                        <td> {itm.narration}</td>
                        <td> {moment(itm.damageDate).format('L')}</td>
                        <td> {itm.itemCode}</td>
                        <td> {itm.itemName}</td>
                        <td> {itm.uoMName}</td>
                        <td className="text-center">
                          {" "}
                          {numberWithCommas(itm.damageQty)}
                        </td>
                        <td className="text-right">
                          {numberWithCommas(itm.damageAmount.toFixed(2))}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colspan="7">
                      <b>Grand Total </b>
                    </td>
                    <td className="text-center">
                      <b>{numberWithCommas(Math.round(totalProductQTY))}</b>
                    </td>
                    <td className="text-right">
                      <b>{numberWithCommas(totalAmount.toFixed(2))}</b>
                    </td>
                  </tr>
                </ICustomTable>
              </div>
              {/* {rowDto?.data?.length > 0 && (
                <PaginationTable
                  count={rowDto?.totalCount}
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
          </div>
        </ICard>
      </>
    </Formik>
  );
}
