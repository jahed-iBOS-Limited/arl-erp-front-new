import { Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import FormikSelect from "../../_chartinghelper/common/formikSelect";
import customStyles from "../../_chartinghelper/common/selectCustomStyle";
import Loading from "../../_chartinghelper/loading/_loading";

const initData = {
  fromPort: "",
  toPort: "",
};

const PortDistanceReport = () => {
  const [rowDto, getRowDto, loading] = useAxiosGet();
  const [fromPortDDL, getFromPortDDL] = useAxiosGet();
  const [toPortDDL, getToPortDDL] = useAxiosGet();

  useEffect(() => {
    getFromPortDDL(`/imp/ImportReport/GetFormPortDDL`);
    getToPortDDL(`/imp/ImportReport/GetToPortDDL`);
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Port Distance Report</p>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.fromPort || ""}
                      options={fromPortDDL || []}
                      styles={customStyles}
                      name="fromPort"
                      placeholder="From Port"
                      label="From Port"
                      onChange={(valueOption) => {
                        setFieldValue("fromPort", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.toPort || ""}
                      options={toPortDDL || []}
                      styles={customStyles}
                      name="toPort"
                      placeholder="To Port"
                      label="To Port"
                      onChange={(valueOption) => {
                        setFieldValue("toPort", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div>
                    <button
                      onClick={() => {
                        getRowDto(
                          `/imp/ImportReport/GetMasterPort?formPort=${values?.fromPort?.label}&toPort=${values?.toPort?.label}`
                        );
                      }}
                      type="button"
                      className="btn btn-primary mt-4"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
              <div className=" mt-3">
                <div>
                  <table className="table table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>From Port</th>
                        <th>To Port</th>
                        <th>From Lat</th>
                        <th>To Lat</th>
                        <th>From Long</th>
                        <th>To Long</th>
                        <th>Distnace</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.length > 0 &&
                        rowDto?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">{item?.fromPort}</td>
                            <td className="text-center">{item?.toPort}</td>
                            <td className="text-center">{item?.fromLat}</td>
                            <td className="text-center">{item?.toLat}</td>
                            <td className="text-center">{item?.fromLong}</td>
                            <td className="text-center">{item?.toLong}</td>
                            <td className="text-center">{item?.distnace}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </form>
          </>
        )}
      </Formik>
    </>
  );
};

export default PortDistanceReport;
