import * as yup from "yup";
import React, { useState } from "react";
import NewSelect from "../../../_helper/_select";
import Loading from "../../../_helper/_loading";
import { Form, Formik } from "formik";
import {
  CardBody,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import ButtonStyleOne from "../../../_helper/button/ButtonStyleOne";
import { CardHeader, Card } from "@material-ui/core";
import { DeleteOutlined } from "@ant-design/icons";
import { shallowEqual, useSelector } from "react-redux";
import { useEffect } from "react";
import { saveExpense } from "./projectApi";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { IInput } from "../../../_helper/_input";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

const initData = {
  intProfitCenterId: 0,
  intCostCenterId: 0,
  intCostElementId: 0,
  intResponsibleId: 0,
  intBudget: "",
};
const ProjectExpense = ({
  project,
  projectCostingExpense = [],
  isEdit = false,
}) => {
  // eslint-disable-next-line
  // DDL
  const [costDDL, setCostDDL] = useState([]);
  const [profitDDL, setProfitDDL] = useState([]);
  const [costCenterDDL, setCostCenterDDL] = useState([]);
  const [responsibleDDL, setResponsibleDDL] = useState([]);

  const [, getData] = useAxiosGet();
  const [, postData, loading] = useAxiosPost();
  const [expenseData, setExpenseData] = useState([]);

  // get account data
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state.authData,
    shallowEqual
  );
  const validationSchema = yup.object().shape({
    intProfitCenterId: yup
      .object({ label: yup.string(), value: yup.number() })
      .required(" Profit Center is required")
      .typeError("Profit Center is required"),
    intCostCenterId: yup
      .object({ label: yup.string(), value: yup.number() })
      .required(" Cost Center is required")
      .typeError("Cost Center is required"),
    intCostElementId: yup
      .object({ label: yup.string(), value: yup.number() })
      .required(" Cost Element is required")
      .typeError("Cost Element is required"),

    intBudget: yup
      .number()
      .required("Budget amount is required")
      .typeError("Budget amount is required"),
  });

  useEffect(() => {
    if (isEdit) {
      const modifiedData = projectCostingExpense?.map((item) => ({
        isEdit: true,
        ...item,
      }));
      setExpenseData(modifiedData);
    }
    // eslint-disable-next-line
  }, [isEdit, projectCostingExpense]);

  // cost DDL
  useEffect(() => {
    // profit center
    getData(
      `/fino/CostSheet/ProfitCenterDDL?BUId=${selectedBusinessUnit?.value}`,
      (res) => {
        setProfitDDL(res);
      }
    );

    // eslint-disable-next-line
  }, [selectedBusinessUnit?.value, profileData?.accountId, profileData?.sbuId]);

  // responsible DDL
  useEffect(() => {
    (project?.intProjectId || project?.id) &&
      getData(
        `/fino/ProjectAccounting/ProjectCostingResponsibleDDL?accountId=${
          profileData?.accountId
        }&businessUnitId=${
          selectedBusinessUnit?.value
        }&projectId=${project?.id || project?.intProjectId}`,
        (res) => {
          setResponsibleDDL(res);
        }
      );
    // eslint-disable-next-line
  }, [selectedBusinessUnit?.value, profileData?.accountId, project]);

  // remove team member method
  const removeExpense = (expenseDataIndex) => {
    const updateExpenseData = expenseData.filter(
      (expense, index) => index !== expenseDataIndex
    );
    setExpenseData(updateExpenseData);
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { resetForm }) => {
        setExpenseData([...expenseData, values]);
        resetForm();
      }}
    >
      {({
        errors,
        handleChange,
        touched,
        setFieldValue,
        resetForm,
        isValid,
        values,
      }) => (
        <>
          <Form className="form form-label-right">
            <Card>
              {true && <ModalProgressBar />}
              <div className="d-flex justify-content-between align-items-center">
                <CardHeader title={"Project Expense"}>
                  <CardHeaderToolbar></CardHeaderToolbar>
                </CardHeader>
                <ButtonStyleOne
                  type="button"
                  label={"Save"}
                  style={{ marginRight: "15px", padding: "5px 15px" }}
                  disabled={
                    (project?.intProjectId || project?.id) && !loading
                      ? false
                      : true
                  }
                  onClick={() => {
                    saveExpense(
                      profileData,
                      selectedBusinessUnit,
                      project,
                      expenseData,
                      isEdit,
                      postData
                    );
                  }}
                />
              </div>
              <CardBody className="pt-0 px-4">
                <Form className="form form-label-right">
                  {loading && <Loading />}
                  <div className="row global-form">
                    {/* Profit Center */}
                    <div className="col-md-3 ">
                      <NewSelect
                        menuPosition="fixed"
                        name="intProfitCenterId"
                        options={[...profitDDL]}
                        value={values.intProfitCenterId}
                        label="Profit Center"
                        placeholder=" Profit Center"
                        onChange={(valueOption) => {
                          setFieldValue("intProfitCenterId", valueOption);
                          setFieldValue("intCostCenterId", null);
                          setFieldValue("intCostElementId", null);
                          if (valueOption) {
                            getData(
                              `/fino/ProjectAccounting/GetCostCenterDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&ProfitCenterId=${valueOption?.value}`,
                              (res) => {
                                // console.log("ss", res);
                                setCostCenterDDL(res);
                              }
                            );
                          }
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {/* Cost Center */}
                    <div className="col-md-3 ">
                      <NewSelect
                        menuPosition="fixed"
                        name="intCostCenterId"
                        options={[...costCenterDDL]}
                        value={values.intCostCenterId}
                        placeholder="Cost Center"
                        label="Cost Center"
                        onChange={(valueOption) => {
                          setFieldValue("intCostCenterId", valueOption);
                          setFieldValue("intCostElementId", null);
                          if (valueOption) {
                            getData(
                              `/procurement/PurchaseOrder/GetCostElementByCostCenter?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&CostCenterId=${valueOption?.value}`,
                              (res) => {
                                setCostDDL(res);
                              }
                            );
                          }
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    {/* Cost Element */}
                    <div className="col-md-3 ">
                      <NewSelect
                        menuPosition="fixed"
                        name="intCostElementId"
                        options={[...costDDL]}
                        value={values.intCostElementId}
                        label="Cost Element"
                        onChange={(valueOption) => {
                          setFieldValue("intCostElementId", valueOption);
                        }}
                        placeholder=" Cost Element"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-md-3" style={{ marginTop: "5px" }}>
                      <span style={{ paddingRight: "10px" }}>
                        Budget Amount
                      </span>
                      <IInput
                        value={values.intBudget}
                        name="intBudget"
                        onChange={handleChange}
                      />
                    </div>

                    {/*Responsible */}
                    <div className="col-md-3 ">
                      <NewSelect
                        menuPosition="fixed"
                        name="intResponsibleId"
                        options={[...responsibleDDL]}
                        value={values.intResponsibleId}
                        label="Responsible"
                        onChange={(valueOption) => {
                          setFieldValue("intResponsibleId", valueOption);
                        }}
                        placeholder=" Responsible"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-md-3">
                      <div className="d-flex align-items-center flex align-items-end justify-content-start">
                        <ButtonStyleOne
                          type="type"
                          label="Add"
                          onClick={() => {
                            // console.log("btn");
                          }}
                          style={{ marginTop: "19px" }}
                          // disabled={addRole}
                        />
                      </div>
                    </div>
                  </div>
                </Form>
                <div className="row" id="pdf-section">
                  <div className="col-lg-12">
                    <div className="print_wrapper">
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered mt-3 global-table table-font-size-sm">
                          {expenseData.length > 0 && (
                            <thead>
                              <tr>
                                <th style={{ width: "50px" }}>SL</th>
                                <th style={{ width: "100px" }}>
                                  <div className="text-left ml-1">
                                    Profit Center
                                  </div>
                                </th>
                                <th style={{ width: "100px" }}>
                                  <div className="text-left ml-1">
                                    Cost Center
                                  </div>
                                </th>
                                <th style={{ width: "100px" }}>
                                  <div className="text-left ml-1">
                                    Cost Element
                                  </div>
                                </th>
                                <th style={{ width: "100px" }}>
                                  <div className="text-left ml-1">
                                    Responsible
                                  </div>
                                </th>
                                <th style={{ width: "100px" }}>
                                  <div className="text-right mr-1">
                                    Budget Amount
                                  </div>
                                </th>
                                <th style={{ width: "150px" }}>Action</th>
                              </tr>
                            </thead>
                          )}
                          <tbody>
                            {expenseData?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-left">
                                  {item?.isEdit
                                    ? item?.strProfitCenter || "N/A"
                                    : item?.intProfitCenterId?.label}
                                </td>
                                <td className="text-left">
                                  {item?.isEdit
                                    ? item?.strCostCenter || "N/A"
                                    : item?.intCostCenterId?.label}
                                </td>
                                <td className="text-left">
                                  {item?.isEdit
                                    ? item?.strCostElement
                                    : item?.intCostElementId?.label}
                                </td>
                                <td className="text-left">
                                  {item?.isEdit
                                    ? item?.strResponsible
                                    : item?.intResponsibleId?.label}
                                </td>
                                <td className="text-right">
                                  {item?.isEdit
                                    ? item?.numBudgetAmount
                                    : item?.intBudget}
                                </td>
                                <td className="text-right">
                                  {" "}
                                  <div className="text-center">
                                    {/* {!item?.completeDateTime && ( */}
                                    <span onClick={() => {}}>
                                      <DeleteOutlined
                                        onClick={() => removeExpense(index)}
                                      />
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div></div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Form>
          {/* table */}
        </>
      )}
    </Formik>
  );
};

export default ProjectExpense;
