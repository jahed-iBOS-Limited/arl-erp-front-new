import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import ICustomTable from "../../../../_helper/_customTable";
const TableRow = () => {
  const [loader] = useState(false);
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const initData = {
    unit: "",
    item: "",
  };

  return (
    <>
      {loader && <Loading />}
      <ICustomCard title="Item Wise Stock">
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
          }}
          //   validationSchema={LoanApproveSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm(initData);
          }}
        >
          {({ values, errors, touched, setFieldValue, dirty, isValid }) => (
            <>
              <Form className="form form-label-right">
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="unit"
                      options={[]}
                      value={values?.unit}
                      onChange={(valueOption) => {
                        setFieldValue("unit", valueOption);
                      }}
                      placeholder="Unit"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="item"
                      options={[]}
                      value={values?.item}
                      onChange={(valueOption) => {
                        setFieldValue("item", valueOption);
                      }}
                      placeholder="Item"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 pt-5">
                    <button
                      className="btn btn-primary"
                      disabled={!isValid || !dirty}
                    >
                      Show
                    </button>
                  </div>
                </div>
                {/* Table Start */}
              </Form>
              <div>
                <h2 className="text-center"> {selectedBusinessUnit?.label} </h2>
                <div>
                  <b>Item Nam:</b> Zirconiam
                </div>
                <div className="row pb-5">
                  <div className="col-lg-3">
                    <b>UoM: </b>
                  </div>
                  <div className="col-lg-3">
                    <b>Current: </b>
                  </div>
                  <div className="col-lg-3">
                    <b>Pipeline Stock: </b>
                  </div>
                  <div className="col-lg-3">
                    <b>Dt: </b>
                  </div>
                </div>
              </div>
              <div>
                <b>Previous Consignment</b>
              </div>
              <ICustomTable
                ths={[
                  "SL",
                  "LC No",
                  "LC Date",
                  "Last BL",
                  "BL Date",
                  "Last MRR Date",
                ]}
              >
                <tr>
                  <td>1</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              </ICustomTable>
              <div>
                {" "}
                <b>Budget Vs Consumption</b>{" "}
              </div>
              <ICustomTable
                ths={[
                  "Aug-20",
                  "Sep-20",
                  "Oct-20",
                  "Nov-20",
                  "Dec-20",
                  "Jan-21",
                ]}
              >
                <tr>
                  <td>Requirtment</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>Consumption</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td>% of use</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan="5">
                    Average use of last 3 months based on budget
                  </td>
                  <td></td>
                </tr>
              </ICustomTable>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
};

export default TableRow;
