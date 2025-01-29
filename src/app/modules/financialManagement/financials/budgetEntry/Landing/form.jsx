import React, { useMemo } from "react";
import { Formik, Form } from "formik";
import ICustomTable from "../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import NewSelect from "../../../../_helper/_select";
import { getBudgetEntryLanding } from "../helper";
import IView from "../../../../_helper/_helperIcons/_view";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { useHistory } from "react-router-dom";
import { monthDDL } from "../../../../selfService/humanResource/officialInformation/EditForm/collpaseComponent/basicEmployeeInformation/helper";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";

export default function _Form({
  initData,
  btnRef,
  resetBtnRef,
  rowDto,
  sbu,
  setLoader,
  setRowDto,
  finYear,
}) {
  const history = useHistory();

  let ths = [
    "SL",
    "Month",
    "From Date",
    "To Date",
    "Year",
    "Financial Year",
    "Amount",
    "Action",
  ];

  const totalAmount = useMemo(
    () => rowDto.reduce((acc, item) => acc + (+item?.numAmount || 0), 0),
    [rowDto]
  );

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          sbu: sbu?.[0] || "",
          financialYear: finYear?.[0] || "",
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
            <Form className="form form-label-right">
              <div className="row global-form">
                <div className="col-md-3 pl-0">
                  <NewSelect
                    label="SBU"
                    placeholder="SBU"
                    name="sbu"
                    options={sbu}
                    value={values?.sbu}
                    onChange={(valueOption) => {
                      setFieldValue("sbu", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-md-3 pl-0">
                  <NewSelect
                    label="Financial Year"
                    placeholder="Financial Year"
                    name="financialYear"
                    options={finYear}
                    value={values?.financialYear}
                    onChange={(valueOption) => {
                      setFieldValue("financialYear", valueOption);
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
                    disabled={!values?.sbu || !values?.financialYear}
                    onClick={() => {
                      getBudgetEntryLanding(
                        values?.sbu?.value,
                        values?.financialYear?.value,
                        setLoader,
                        setRowDto
                      );
                    }}
                  />
                </div>
              </div>
              <ICustomTable ths={ths}>
                {rowDto?.length > 0 &&
                  rowDto.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{monthDDL?.[item?.intMonthId - 1]?.label}</td>
                      <td className="text-center">
                        {_dateFormatter(item?.dteFromDate)}
                      </td>
                      <td className="text-center">
                        {_dateFormatter(item?.dteToDate)}
                      </td>
                      <td className="text-center">{item?.intYear}</td>
                      <td className="text-center">{item?.strFinancialYear}</td>
                      <td className="text-right">{item?.numAmount}</td>
                      <td style={{ width: "70px" }}>
                        <div className="d-flex justify-content-around">
                          <IView
                            clickHandler={(e) => {
                              history.push(
                                `/financial-management/financials/budget-entry/view/${item?.intSbuId}/${item?.intMonthId}/${item?.intYear}`
                              );
                            }}
                          />
                          <IEdit
                            onClick={(e) => {
                              history.push(
                                `/financial-management/financials/budget-entry/edit/${item?.intSbuId}/${item?.intMonthId}/${item?.intYear}`
                              );
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                {rowDto?.length > 0 && (
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <div className="d-flex justify-content-between">
                        <b>Total Amount</b>
                        <b>{(totalAmount || 0)?.toFixed(2)}</b>
                      </div>
                    </td>
                    <td></td>
                  </tr>
                )}
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
          </>
        )}
      </Formik>
    </>
  );
}
