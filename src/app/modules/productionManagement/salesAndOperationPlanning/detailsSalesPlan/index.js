import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import {
  getLandingPlantDDL,
  getSalesPlanLanding,
  getSalesPlanYearDDL,
} from "./helper";
import { shallowEqual, useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useHistory } from "react-router-dom";

const initData = {
  plant: "",
  year: "",
};
export default function MonthlySalesPlanLanding() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [plantDDL, setPlantDDL] = useState([]);
  const [yearDDL, setYearDDL] = useState([]);
  const [gridData, setGridData] = useState([]);

  useEffect(() => {
    getLandingPlantDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = (values, cb) => {};
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
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
          {loading && <Loading />}
          <IForm
            title="Monthly Sales Plan"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div className="global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={plantDDL || []}
                    value={values?.plant}
                    label="Plant"
                    onChange={(valueOption) => {
                      setFieldValue("plant", valueOption);
                      getSalesPlanYearDDL(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        valueOption?.value,
                        setYearDDL
                      );

                      setGridData([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="year"
                    options={yearDDL || []}
                    value={values?.year}
                    label="Year"
                    onChange={(valueOption) => {
                      setFieldValue("year", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="">
                  <button
                    onClick={() => {
                      getSalesPlanLanding(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        values?.plant?.value,
                        values?.year?.label,
                        setGridData,
                        setLoading
                      );
                    }}
                    style={{ marginTop: "18px" }}
                    className="btn btn-primary"
                    disabled={!values?.plant || !values?.year}
                  >
                    View
                  </button>
                </div>
              </div>

              {gridData?.length > 0 && (
                <div className="table-responsive">
                  <table className="global-table table">
                    <>
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Horizon Name</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Sales Plan Quantity</th>
                          <th>Production Plan Quantity</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((item, index) => (
                          <tr key={index}>
                            <td>{item?.sl}</td>
                            <td>{item?.horizonName}</td>
                            <td>{_dateFormatter(item?.startDate)}</td>
                            <td>{_dateFormatter(item?.endDate)}</td>
                            <td>{item?.planQTY}</td>
                            <td>{item?.productionPlanQTY}</td>
                            <td>
                              <div className="d-flex justify-content-around">
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">
                                      {"Create Details Sales Plan"}
                                    </Tooltip>
                                  }
                                >
                                  <span
                                    onClick={() => {
                                      history.push({
                                        pathname: `/internal-control/budget/detailsalseplan/details`,
                                        state: {
                                          monthlyValues: values,
                                          monthlyItem: item,
                                        },
                                      });
                                    }}
                                  >
                                    <i
                                      className={`fas fas fa-share-square`}
                                    ></i>
                                  </span>
                                </OverlayTrigger>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </>
                  </table>
                </div>
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
