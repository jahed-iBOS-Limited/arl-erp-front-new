import { Formik } from "formik";
import React from "react";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";

export default function RowDetails({ row }) {
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {false && <Loading />}
          <IForm isHiddenReset isHiddenBack isHiddenSave>
            <div>
              <div>
                <h5>Date: {_dateFormatter(row?.dteDate)}</h5>
                <h5>Shift: {row?.strShiftName}</h5>
                <h5>Mill: {row?.strMillName}</h5>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Breakdown Type</th>
                          <th>Breakdown Details</th>
                          <th>Breakdown Hour</th>
                        </tr>
                      </thead>
                      <tbody>
                        {row?.row?.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">
                              {item?.strBreakDownTypeName}
                            </td>
                            <td className="text-center">
                              {item?.strBreakdownDetails}
                            </td>
                            <td className="text-center">
                              {item?.numBreakdownHour}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </IForm>
        </>
      )}
    </Formik>
  );
}
