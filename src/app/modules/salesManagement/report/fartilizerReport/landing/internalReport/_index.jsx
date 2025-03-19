import React, { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { IInput } from "../../../../../_helper/_input";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { shallowEqual, useSelector } from "react-redux";
import {
  getItemDDLFertilizerReport,
  internalReport1Landing,
  internalReport2Landing,
} from "../../helper";
import UnderGovSubsidyTable from "./underGovtSubsidy";
// import OutsideGovSubsidyTable from "./outsideGovtSubsidy";
import NewSelect from "../../../../../_helper/_select";
import * as Yup from "yup";
import OutsideGovSubsidyTable from "./outsideGovtSubsidy";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  item: "",
  type: 1,
  typeWise: { value: 1, label: "All" },
};

export const validationSchema = Yup.object().shape({
  item: Yup.object().shape({
    label: Yup.string().required("Item Name is required"),
    value: Yup.string().required("Item Name is required"),
  }),
});

export function InternalReport({ printRef, setLoading }) {
  const [gridData, setGridData] = useState("");
  const [itemDDL, setItemDDL] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getItemDDLFertilizerReport(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setItemDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const viewHandler = async (values, setter) => {
    if (values?.type === 1) {
      internalReport1Landing(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.fromDate,
        values?.toDate,
        values?.item?.value,
        values?.typeWise?.value,
        setLoading,
        setter
      );
    } else {
      internalReport2Landing(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.fromDate,
        values?.toDate,
        values?.item?.value,
        setLoading,
        setter
      );
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          viewHandler(values, setGridData);
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <Form className="form form-label-right">
            <div className="form-group row global-form printSectionNone">
              <div className="col-lg-12 row mt-0 mb-4 mx-0 p-0">
                <div className="col-lg-6 d-flex m-0 p-0 align-items-center">
                  <div>
                    <input
                      type="radio"
                      name="type"
                      value={values?.type}
                      checked={values?.type === 1}
                      onChange={() => {
                        setGridData("");
                        setFieldValue("type", 1);
                      }}
                    />
                    <label className="mx-2">Under Govt. Subsidy</label>
                  </div>

                  <div>
                    <input
                      type="radio"
                      name="type"
                      value={values?.type}
                      checked={values?.type === 2}
                      onChange={() => {
                        setGridData("");
                        setFieldValue("type", 2);
                      }}
                    />
                    <label className="mx-2">
                      Managed Outside Govt. Subsidy
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-lg-3">
                <IInput
                  value={values?.fromDate}
                  label="From Date"
                  name="fromDate"
                  type="date"
                  onChange={(e) => {
                    setFieldValue("fromDate", e?.target?.value);
                    setGridData("");
                  }}
                />
              </div>

              <div className="col-lg-3">
                <IInput
                  value={values?.toDate}
                  label="To Date"
                  name="toDate"
                  type="date"
                  onChange={(e) => {
                    setFieldValue("toDate", e?.target?.value);
                    setGridData("");
                  }}
                />
              </div>

              <div className="col-lg-3">
                <NewSelect
                  name="item"
                  options={itemDDL}
                  value={values?.item}
                  label="Item Name"
                  onChange={(valueOption) => {
                    setGridData("");
                    setFieldValue("item", valueOption);
                  }}
                  placeholder="Item Name"
                  errors={errors}
                  touched={touched}
                />
              </div>

              {values?.type === 1 ? (
                <div className="col-lg-3">
                  <NewSelect
                    name="typeWise"
                    options={[
                      { value: 1, label: "All" },
                      { value: 2, label: "District Wise" },
                    ]}
                    value={values?.typeWise}
                    label="Type"
                    onChange={(valueOption) => {
                      setFieldValue("typeWise", valueOption);
                      setGridData("");
                    }}
                    placeholder="Type"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              ) : null}

              <div className="col-lg-1">
                <button type="submit" className="btn btn-primary mt-5">
                  View
                </button>
              </div>
            </div>

            {gridData && values?.type === 1 ? (
              <div ref={printRef}>
                <UnderGovSubsidyTable
                  rowData={gridData?.internalReport1 || []}
                />
              </div>
            ) : null}

            {gridData && values?.type === 2 ? (
              <div ref={printRef}>
                <OutsideGovSubsidyTable rowData={gridData || []} />
              </div>
            ) : null}
          </Form>
        )}
      </Formik>
    </>
  );
}
