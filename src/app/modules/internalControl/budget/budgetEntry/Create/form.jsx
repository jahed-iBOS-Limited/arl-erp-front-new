import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import ReactHtmlTableToExcel from "react-html-table-to-excel";
import * as Yup from "yup";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { setInternalControlBudgetInitAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import InputField from "../../../../_helper/_inputField";
import { getBudgetCreateLanding } from "../helper";
import ICustomTable from "./../../../../_helper/_customTable";
import NewSelect from "./../../../../_helper/_select";

const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  setRowDto,
  rowDto,
  rowDtoHandler,
  buId,
  setLoading,
  budgetTypeDDL,
  state,
  localStorageData,
  dispatch,
}) {
  const [costRevDDL, getCostRevDDL, , setCostRevDDL] = useAxiosGet();
  const [
    profitCenterDDL,
    getProfitCenterDDL,
    ,
    setProfitCenterDDL,
  ] = useAxiosGet();

  useEffect(() => {
    getProfitCenterDDL(
      `/fino/CostSheet/ProfitCenterDetails?UnitId=${buId}`,
      (data) => {
        const result = data?.map((item) => ({
          ...item,
          value: item.profitCenterId,
          label: item.profitCenterName,
        }));
        setProfitCenterDDL(result);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tableHeader = (id) => {
    switch (id) {
      case 4:
        return [
          "SL",
          "Budget Type Name",
          "Code",
          "Description",
          "Plan/Target Qty",
          "Plan/Target Amount",
        ];

      case 2:
      case 3:
        return [
          "SL",
          "Budget Type Name",
          "Code",
          "Cost Revenue Center Name",
          "Description",
          "Plan/Target Amount",
        ];

      default:
        return [
          "SL",
          "Budget Type Name",
          "Code",
          "Description",
          "Plan/Target Amount",
        ];
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          budgetType: state?.budgetType,
        }}
        validationSchema={validationSchema}
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
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="global-form">
                <div className="form-group row">
                  <div className="col-md-2">
                    <NewSelect
                      label="Budget Type"
                      placeholder="Budget Type"
                      name="budgetType"
                      options={budgetTypeDDL || []}
                      value={values?.budgetType}
                      onChange={(valueOption) => {
                        setFieldValue("monthId", "");
                        setFieldValue("yearId", "");
                        setFieldValue("month", "");
                        setFieldValue("costRev", "");
                        setFieldValue("profitCenter", "");
                        setFieldValue("budgetType", valueOption);
                        dispatch(
                          setInternalControlBudgetInitAction({
                            ...localStorageData,
                            budgetType: valueOption,
                          })
                        );
                        setRowDto([]);
                      }}
                      errors={errors}
                      touched={touched}
                      isClearable={false}
                    />
                  </div>
                  {(values?.budgetType?.value === 2 ||
                    values?.budgetType?.value === 3) && (
                      <div className="col-md-2">
                        <NewSelect
                          label="Profit Center"
                          placeholder=" "
                          name="profitCenter"
                          options={profitCenterDDL || []}
                          value={values?.profitCenter}
                          onChange={(valueOption) => {
                            setFieldValue("costRev", "");
                            setFieldValue("profitCenter", valueOption);
                            getCostRevDDL(
                              `/fino/BudgetFinancial/CostCenterNRevCenterDDL?BudgetTypeId=${values?.budgetType?.value}&BusinessUnitId=${buId}&profitCenterId=${valueOption?.value}`,
                              (data) => {
                                const result = data?.map((item) => ({
                                  ...item,
                                  value: item.costCenterRevCenterId,
                                  label: item.costCenterRevCenterName,
                                }));
                                if (values?.budgetType?.value === 2) {
                                  // add new item before result array and set it
                                  setCostRevDDL([{ value: 0, label: "All" }, ...result]);
                                } else {
                                  setCostRevDDL(result);
                                }

                              }
                            );
                          }}
                          errors={errors}
                          touched={touched}
                          isClearable={false}
                        />
                      </div>
                    )}
                  {(values?.budgetType?.value === 2 ||
                    values?.budgetType?.value === 3) && (
                      <div className="col-md-2">
                        <NewSelect
                          label="Cost & Revenue Type"
                          placeholder=" "
                          name="costRev"
                          options={costRevDDL || []}
                          value={values?.costRev}
                          onChange={(valueOption) => {
                            setFieldValue("costRev", valueOption);
                            setRowDto([]);
                          }}
                          errors={errors}
                          touched={touched}
                          isClearable={false}
                        />
                      </div>
                    )}
                  <div className="col-lg-2">
                    <InputField
                      label="Month"
                      placeholder="Month"
                      name="month"
                      type="month"
                      value={values?.month}
                      onChange={(e) => {
                        setFieldValue(
                          "monthId",
                          +e.target.value
                            .split("")
                            .slice(-2)
                            .join("")
                        );
                        setFieldValue(
                          "yearId",
                          +e.target.value
                            .split("")
                            .slice(0, 4)
                            .join("")
                        );
                        setFieldValue("month", e.target.value);
                        setRowDto([]);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {values?.budgetType?.value === 2 ||
                    values?.budgetType?.value === 3 ? (
                    <>
                      <div className="col-md-3">
                        <ButtonStyleOne
                          style={{ marginTop: "19px" }}
                          label="View"
                          type="button"
                          disabled={
                            !values?.budgetType ||
                            !values?.month ||
                            !values?.costRev
                          }
                          onClick={() => {
                            getBudgetCreateLanding(
                              values?.monthId,
                              values?.yearId,
                              values?.budgetType?.value,
                              buId,
                              setLoading,
                              setRowDto,
                              values?.costRev?.value
                            );
                          }}
                        />
                        {values?.budgetType?.value === 2 ? (
                          <ReactHtmlTableToExcel
                            id="test-table-xls-button"
                            className="btn btn-primary ml-2 mt-5"
                            table="Create_Budget_Entry_excel"
                            filename="Create Budget Entry"
                            sheet="Create Budget Entry"
                            buttonText="Export Excel"
                          />
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-md-3">
                        <ButtonStyleOne
                          style={{ marginTop: "19px" }}
                          label="View"
                          type="button"
                          disabled={!values?.budgetType || !values?.month}
                          onClick={() => {
                            getBudgetCreateLanding(
                              values?.monthId,
                              values?.yearId,
                              values?.budgetType?.value,
                              buId,
                              setLoading,
                              setRowDto
                            );
                          }}
                        />
                      </div>
                    </>
                  )}

                </div>
              </div>

              <div className="row">
                {values?.month && (
                  <ICustomTable id={"Create_Budget_Entry_excel"} ths={tableHeader(localStorageData?.budgetType?.value)}
                  >
                    {rowDto?.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="pl-2">{item?.strBudgetTypeName}</td>
                        <td className="pl-2">{item?.strElementCode}</td>
                        {(localStorageData?.budgetType?.value === 2 ||
                          localStorageData?.budgetType?.value === 3) && (
                            <td>{item?.CostRevCenterName}</td>
                          )}
                        <td className="pl-2">{item?.strElementName}</td>
                        {localStorageData?.budgetType?.value === 4 ? (
                          <>
                            <td style={{ width: "100px" }}>
                              <input
                                placeholder=" "
                                type="number"
                                value={item[item?.levelVariableQty]}
                                name={item?.levelVariableQty}
                                onChange={(e) =>
                                  rowDtoHandler(
                                    `${item?.levelVariableQty}`,
                                    index,
                                    e.target.value
                                  )
                                }
                                disabled={
                                  item?.numBudgetQty > 0 && item?.intRowId > 0
                                }
                                step="any"
                                required={
                                  item[item?.levelVariableAmount] > 0
                                    ? true
                                    : false
                                }
                              />
                            </td>
                            <td style={{ width: "100px" }}>
                              <input
                                placeholder=" "
                                type="number"
                                value={item[item?.levelVariableAmount]}
                                name={item?.levelVariableAmount}
                                onChange={(e) =>
                                  rowDtoHandler(
                                    `${item?.levelVariableAmount}`,
                                    index,
                                    e.target.value
                                  )
                                }
                                disabled={
                                  item?.numBudgetValue > 0 && item?.intRowId > 0
                                }
                                step="any"
                                required={
                                  item[item?.levelVariableQty] > 0
                                    ? true
                                    : false
                                }
                              />
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ width: "100px" }}>
                              <input
                                placeholder=" "
                                type="number"
                                value={item[item?.levelVariableAmount]}
                                name={item?.levelVariableAmount}
                                onChange={(e) =>
                                  rowDtoHandler(
                                    `${item?.levelVariableAmount}`,
                                    index,
                                    e.target.value
                                  )
                                }
                                disabled={
                                  item?.numBudgetValue > 0 && item?.intRowId > 0
                                }
                                step="any"
                              />
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </ICustomTable>
                )}
              </div>

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
