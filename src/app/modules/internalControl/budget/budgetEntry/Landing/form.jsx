import React from "react";
import { Formik, Form } from "formik";
import ICustomTable from "../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import NewSelect from "../../../../_helper/_select";
import { getBudgetEntryLanding } from "../helper";
import IView from "../../../../_helper/_helperIcons/_view";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { useHistory } from "react-router-dom";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import { setInternalControlBudgetInitAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import { getMonthName } from "./../../../../_helper/monthIdToMonthName";
import {
  Card,
  CardHeader,
} from "./../../../../../../_metronic/_partials/controls";
import { ModalProgressBar } from "./../../../../../../_metronic/_partials/controls/ModalProgressBar";
import {
  CardHeaderToolbar,
  CardBody,
} from "./../../../../../../_metronic/_partials/controls/Card";
import { toast } from "react-toastify";

export default function _Form({
  initData,
  btnRef,
  resetBtnRef,
  rowDto,
  setLoader,
  setRowDto,
  finYear,
  budgetTypeDDL,
  dispatch,
  localStorageData,
  buId,
}) {
  const history = useHistory();

  let ths = ["SL", "Budget Type", "Entry Date", "Month", "Year", "Action"];

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          financialYear: localStorageData?.financialYear,
          budgetType: localStorageData?.budgetType,
        }}
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
            <div className={`global-card-header`}>
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={"Budget Entry"}>
                  <CardHeaderToolbar>
                    <button
                      onClick={() => {
                        if (!values?.financialYear || !values?.budgetType) {
                          return toast.warning(
                            "please provide fiscal year & budget type"
                          );
                        }
                        history.push({
                          pathname: `/internal-control/budget/budgetentry/add`,
                          state: localStorageData,
                        });
                      }}
                      className="btn btn-primary"
                    >
                      Create
                    </button>
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  <div className="mt-0">
                    <Form className="form form-label-right">
                      <div className="row global-form">
                        <div className="col-md-3 pl-0">
                          <NewSelect
                            label="Financial Year"
                            placeholder="Financial Year"
                            name="financialYear"
                            options={finYear}
                            value={values?.financialYear}
                            onChange={(valueOption) => {
                              dispatch(
                                setInternalControlBudgetInitAction({
                                  ...localStorageData,
                                  financialYear: valueOption,
                                })
                              );
                              setFieldValue("financialYear", valueOption);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-md-3 pl-0">
                          <NewSelect
                            label="Budget Type"
                            placeholder="Budget Type"
                            name="budgetType"
                            options={budgetTypeDDL || []}
                            value={values?.budgetType}
                            onChange={(valueOption) => {
                              dispatch(
                                setInternalControlBudgetInitAction({
                                  ...localStorageData,
                                  budgetType: valueOption,
                                })
                              );
                              setFieldValue("budgetType", valueOption);
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-md-3">
                          <ButtonStyleOne
                            style={{ marginTop: "19px" }}
                            label="View"
                            type="button"
                            disabled={
                              !values?.budgetType || !values?.financialYear
                            }
                            onClick={() => {
                              getBudgetEntryLanding(
                                values?.financialYear?.label,
                                values?.budgetType?.value,
                                buId,
                                setLoader,
                                setRowDto
                              );
                            }}
                          />
                        </div>
                      </div>
                      <ICustomTable ths={ths}>
                        {rowDto?.length > 0 &&
                          rowDto?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item?.strBudgetTypeName}</td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteServerDatetime)}
                                </td>
                                <td className="text-center">
                                  {getMonthName(item?.intMonth)}
                                </td>
                                <td className="text-center">{item?.intYear}</td>
                                <td style={{ width: "70px" }}>
                                  <div className="d-flex justify-content-around">
                                    <IView
                                      clickHandler={(e) => {
                                        history.push({
                                          pathname: `/internal-control/budget/budgetentry/view/${item?.intBudgetId}`,
                                          state: item,
                                        });
                                      }}
                                    />
                                    <IEdit
                                      onClick={(e) => {
                                        history.push({
                                          pathname: `/internal-control/budget/budgetentry/edit/${item?.intBudgetId}`,
                                          state: item,
                                        });
                                      }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </ICustomTable>

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
                  </div>
                </CardBody>
              </Card>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
