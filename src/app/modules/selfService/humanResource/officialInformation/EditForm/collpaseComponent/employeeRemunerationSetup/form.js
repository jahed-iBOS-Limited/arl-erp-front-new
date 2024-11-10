import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import InputField from "../../../../../../_helper/_inputField";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../../../_metronic/_partials/controls";
import StandardRemuFormTable from "./standardRemuFormTable";
import OtherAllowances from "./otherAllowances";
import EmpRemuSetupLanding from "./empRemuSetupLanding";
import { getCurrencyDDL, getEmpRemuType } from "./helper";
import { shallowEqual, useSelector } from "react-redux";
import NewSelect from "../../../../../../_helper/_select";
import { useLocation } from "react-router";

// Validation schema
const validationSchema = Yup.object().shape({
  remunerationValidForm: Yup.string().required(
    "Remuneration valid form required"
  ),
});

export default function _Form({
  initData,
  saveHandler,
  setEdit,
  edit,
  selectedBusinessUnit,
  profileData,
  accountId,
  businessUnitId,
  landingData,
  setDisabled,
  allowanceTotal,
  setAllowanceTotal,
  setRemuTotal,
  remuTotal,
  // DDL and RowData
  DDL,

  // Calculation
  netPayable,
  setNetPayable,
  grossAmount,
  setGrossAmount,
  basicSalery,
  setBasicSalery,
  totalPayable,
  setTotalPayable,
  isConsolidated,
  setIsConsolidated,
}) {
  // Destructure All DDL
  let {
    standardRemunarationBasic,
    setStandardRemunarationBasic,
    standardRemunaration,
    setStandardRemunaration,
    filterStandardRemunaration,
    setFilterStandardRemunaration,
    rowData,
    setRowData,
    fixedDeductionsRemunerarion,
    setFixedDeductionsRemunerarion,
  } = DDL;

  const [chekConsolidated, setChekConsolidated] = useState("");

  useEffect(() => {
    setChekConsolidated(isConsolidated);
  }, [isConsolidated]);

  // Filter Consolidated Salary from standard Remunaration
  const filterArray = () => {
    let newArray = standardRemunaration?.filter(
      (item) => item?.remunerationComponentTypeId === 1
    );
    setFilterStandardRemunaration(newArray);
  };

  useEffect(() => {
    let newArray = standardRemunaration?.filter(
      (item) => item?.remunerationComponentTypeId === 1
    );
    setFilterStandardRemunaration(newArray);
  }, [standardRemunaration]);

  // Calculate all sum
  const sumOfObj = () => {
    let totalStandardRemuneration = 0;
    let totalFixedRemuneration = 0;
    let totalOtherAllowances = 0;

    fixedDeductionsRemunerarion.forEach((item) => {
      totalFixedRemuneration = +totalFixedRemuneration + Number(item?.amount);
    });

    standardRemunaration.forEach((item) => {
      totalStandardRemuneration =
        +totalStandardRemuneration + Number(item?.amount);
    });

    if (rowData.length > 0) {
      rowData.forEach((item) => {
        totalOtherAllowances = +totalOtherAllowances + Number(item?.amount);
      });
    }
    if (chekConsolidated === false) {
      setGrossAmount(totalStandardRemuneration + +basicSalery);
      setTotalPayable(
        totalStandardRemuneration + +basicSalery + +totalOtherAllowances
      );

      let sum =
        +totalStandardRemuneration + +basicSalery + +totalOtherAllowances;
      setNetPayable(sum - +totalFixedRemuneration);
    }
  };

  // Basic Salary Handler
  const basicSaleryHandler = (value) => {
    let newstandardRemunaration = standardRemunaration.map((item) => {
      return {
        ...item,
        amount: (value * item.defaultPercentOnBasic) / 100,
      };
    });
    let newFixedDeductionsRemunerarion = fixedDeductionsRemunerarion.map(
      (item) => {
        return {
          ...item,
          amount: (value * item.defaultPercentOnBasic) / 100,
        };
      }
    );
    setStandardRemunaration(newstandardRemunaration);
    setFixedDeductionsRemunerarion(newFixedDeductionsRemunerarion);
    setBasicSalery(value);
  };

  // When Basic Salary update then it called
  useEffect(() => {
    sumOfObj();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basicSalery]);

  // When netPayable update then it called
  useEffect(() => {
    sumOfObj();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [netPayable]);

  // This is for total deduction value count
  const [totalDeduction, setTotalDeduction] = useState(0);
  useEffect(() => {
    let totalAmount = 0;
    for (let i = 0; i < fixedDeductionsRemunerarion?.length > 0; i++) {
      totalAmount += fixedDeductionsRemunerarion[i].amount;
    }
    setTotalDeduction(+totalAmount);
  }, [fixedDeductionsRemunerarion]);

  // Change Parsentage to Amount
  const changeParsentageToAmount = (obj, setObj, value, index) => {
    if (+value <= 100) {
      let newstandardRemunaration = [...obj];
      newstandardRemunaration[index].defaultPercentOnBasic = value;
      newstandardRemunaration[index].amount = (basicSalery * value) / 100;
      setObj(newstandardRemunaration);
      sumOfObj();
    }
  };

  // Change Amount to Parsentage
  const changeAmountToparsentage = (obj, setObj, value, index) => {
    if (+value <= +basicSalery) {
      let newstandardRemunaration = [...obj];
      newstandardRemunaration[index].amount = value;
      newstandardRemunaration[index].defaultPercentOnBasic =
        (100 * +value) / +basicSalery;
      setObj(newstandardRemunaration);
      sumOfObj();
    }
  };

  const userRole = useSelector(
    (state) => state?.authData?.userRole,
    shallowEqual
  );

  const remunaration = userRole[93];

  const [currencyDDL, setCurrencyDDL] = useState("");
  useEffect(() => {
    getCurrencyDDL(setCurrencyDDL);
  }, []);

  const location = useLocation();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          currency: { value: 141, label: "Taka" },
          isConsolidated,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(
            values,
            standardRemunaration,
            fixedDeductionsRemunerarion,
            rowData,
            filterStandardRemunaration,
            () => {
              // This all logic for callback fun called
              setRowData([]);
              setEdit(false);
              resetForm(initData);
              let sList = standardRemunaration.map((item) => {
                return {
                  ...item,
                  amount: "",
                };
              });
              setStandardRemunaration(sList);

              let fList = fixedDeductionsRemunerarion.map((item) => {
                return {
                  ...item,
                  amount: "",
                };
              });

              setFixedDeductionsRemunerarion(fList);
              setBasicSalery(0);
              setNetPayable(0);
              setGrossAmount(0);
            }
          );
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
          setValues,
        }) => (
          <div className={!edit ? "editForm" : ""}>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Employee Remuneration Setup"}>
                {!location?.state?.fromReRegistration && (
                  <CardHeaderToolbar>
                    {edit ? (
                      <>
                        <button
                          onClick={() => {
                            setEdit(false);
                            resetForm(initData);
                          }}
                          className="btn btn-light "
                          type="button"
                        >
                          <i className="fas fa-times pointer"></i>
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmit}
                          className="btn btn-primary ml-2"
                          type="submit"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      remunaration?.isEdit && (
                        <button
                          onClick={() => setEdit(true)}
                          className="btn btn-light"
                          type="button"
                        >
                          <i className="fas fa-pen-square pointer"></i>
                          Edit
                        </button>
                      )
                    )}
                  </CardHeaderToolbar>
                )}
              </CardHeader>
              <CardBody>
                {/* Create Page */}
                <Form className="form form-label-right">
                  {edit && (
                    <>
                      <div className="row global-form global-form-custom bj-left pb-2">
                        <div className="col-lg">
                          <label>Remuneration Valid From</label>
                          <InputField
                            // className={"input-item"}
                            value={values?.remunerationValidForm}
                            style={{ paddingRight: "4px" }}
                            name="remunerationValidForm"
                            placeholder="Remuneration Valid Form"
                            type="date"
                            disabled={!edit}
                          />
                        </div>

                        <div className="col-lg">
                          <NewSelect
                            name="currency"
                            options={currencyDDL}
                            value={values?.currency}
                            label="Currency"
                            onChange={(valueOption) => {
                              setFieldValue("currency", valueOption);
                            }}
                            placeholder="Currency"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg">
                          <div
                            style={{
                              position: "relative",
                              top: "12px",
                              marginRight: "-10px",
                            }}
                            className="mr-n4"
                          >
                            <Field
                              name="isConsolidated"
                              component={() => (
                                <input
                                  id="isConsolidated"
                                  type="checkbox"
                                  style={{
                                    position: "relative",
                                    top: "4px",
                                    marginRight: "4px",
                                  }}
                                  label="Consolidated?"
                                  // className="ml-2"
                                  // value={isConsolidated}
                                  checked={values?.isConsolidated}
                                  name="isConsolidated"
                                  onChange={(e) => {
                                    setChekConsolidated(e.target.checked);
                                    filterArray();
                                    if (!values?.isConsolidated) {
                                      setRowData([]);
                                      setFixedDeductionsRemunerarion([]);
                                      // setStandardRemunaration([]);
                                      setBasicSalery(0);
                                      setNetPayable(0);
                                      setGrossAmount(0);
                                      setTotalPayable(0);
                                      setRemuTotal(0);
                                    } else {
                                      getEmpRemuType(
                                        accountId,
                                        1,
                                        setStandardRemunarationBasic,
                                        setDisabled,
                                        () => {
                                          getEmpRemuType(
                                            accountId,
                                            1,
                                            setStandardRemunaration,
                                            setDisabled,
                                            () => {
                                              getEmpRemuType(
                                                accountId,
                                                4,
                                                setFixedDeductionsRemunerarion,
                                                setDisabled,
                                                () => {
                                                  console.log("Fetch Done");
                                                }
                                              );
                                            }
                                          );
                                        }
                                      );
                                    }
                                    if (!isConsolidated)
                                      setFieldValue(
                                        "isConsolidated",
                                        e.target.checked
                                      );
                                    setIsConsolidated(e.target.checked);
                                  }}
                                />
                              )}
                            />
                            <label htmlFor="isConsolidated">
                              Consolidated Salary?
                            </label>
                          </div>
                        </div>

                        <div className="col-lg">
                          <label>Gross Amount</label>
                          <InputField
                            value={grossAmount}
                            name="grossAmount"
                            placeholder="Gross Amount"
                            type="text"
                            disabled={true}
                          />
                        </div>
                        <div className="col-lg">
                          <label>Total Payable</label>
                          <InputField
                            value={totalPayable}
                            name="totalPayable"
                            placeholder="Total Payable"
                            type="text"
                            disabled={true}
                          />
                        </div>
                        <div className="col-lg">
                          <label>Net Payable</label>
                          <InputField
                            value={netPayable}
                            name="netPayable"
                            placeholder="Net Payable"
                            type="text"
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className="row d-flex justify-content-between">
                        {/* Standard Remunerarion Section */}
                        <div className="col-lg-6 w-100 standard-remu-table p-2">
                          {values?.isConsolidated ? (
                            <>
                              <h4 className="pt-2">Standard Remuneration</h4>
                              <div className="table-responsive">
                              <table className="global-table w-100 table-bordered border-secondary">
                                <thead>
                                  <tr>
                                    <th className="text-center px-2">SL</th>
                                    <th className="text-center text-align-left pl-2">
                                      Component
                                    </th>
                                    <th className="text-center">
                                      Percentage (%) of Basic
                                    </th>
                                    <th className="text-center">Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {/* Only for Consolidated Salary  */}
                                  {filterStandardRemunaration &&
                                    filterStandardRemunaration?.map(
                                      (item, index) => {
                                        return (
                                          <tr key={index}>
                                            <td>
                                              <span className="px-2">
                                                {index + 1}
                                              </span>
                                            </td>
                                            <td>
                                              <span className="text-align-left pl-2">
                                                {item?.remunerationComponent}
                                              </span>
                                            </td>
                                            <td
                                              style={{
                                                alignItems: "center",
                                                width: "90px",
                                              }}
                                              className="text-center"
                                            >
                                              -
                                            </td>
                                            <td style={{ width: "90px" }}>
                                              <input
                                                value={
                                                  filterStandardRemunaration[
                                                    index
                                                  ]?.amount
                                                }
                                                min="0"
                                                name="amount"
                                                placeholder="Amount"
                                                type="number"
                                                className="form-control w-100 py-0 px-4"
                                                onChange={(e) => {
                                                  let newstandardRemunaration = [
                                                    ...filterStandardRemunaration,
                                                  ];
                                                  newstandardRemunaration[
                                                    index
                                                  ].amount = +e.target.value;
                                                  newstandardRemunaration[
                                                    index
                                                  ].defaultPercentOnBasic = 0;
                                                  setFilterStandardRemunaration(
                                                    newstandardRemunaration
                                                  );
                                                  setBasicSalery(
                                                    e.target.value
                                                  );
                                                  setNetPayable(e.target.value);
                                                  setGrossAmount(
                                                    e.target.value
                                                  );
                                                  setTotalPayable(
                                                    e.target.value
                                                  );
                                                }}
                                              />
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                </tbody>
                              </table>
                              </div>
                            </>
                          ) : (
                            <StandardRemuFormTable
                              setGrossAmount={setGrossAmount}
                              basicSalery={basicSalery}
                              setRemuTotal={setRemuTotal}
                              remuTotal={remuTotal}
                              basicSaleryHandler={basicSaleryHandler}
                              standardRemunaration={standardRemunaration.filter(
                                (item) => item?.remunerationComponentId !== 1
                              )}
                              setStandardRemunaration={setStandardRemunaration}
                              changeParsentageToAmount={
                                changeParsentageToAmount
                              }
                              changeAmountToparsentage={
                                changeAmountToparsentage
                              }
                              standardRemunarationBasic={
                                standardRemunarationBasic
                              }
                            />
                          )}
                        </div>
                        {/* Standard Remunerarion Section End */}

                        {/* Fixed Deductions Remunerarion	*/}
                        {!values?.isConsolidated && (
                          <div className="col-lg-6">
                            <div className="standard-remu-table p-2">
                              <h4 className="pt-2">Deductions</h4>
                              <table className="global-table table-bordered border-dark w-100">
                                <thead>
                                  <tr>
                                    <th className="text-center">SL</th>
                                    <th className="text-center">Component</th>
                                    <th className="text-center">
                                      Parcentage (%) of Basic
                                    </th>
                                    <th className="text-center">Amount</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {fixedDeductionsRemunerarion &&
                                    fixedDeductionsRemunerarion.map(
                                      (item, index) => {
                                        return (
                                          <tr key={index}>
                                            <td className="text-center">
                                              {index + 1}
                                            </td>
                                            <td>
                                              <span className="text-align-left pl-2">
                                                {item.remunerationComponent}
                                              </span>
                                            </td>
                                            <td style={{ width: "90px" }}>
                                              <input
                                                value={
                                                  fixedDeductionsRemunerarion[
                                                    index
                                                  ]?.defaultPercentOnBasic
                                                }
                                                name="amount"
                                                placeholder="Amount"
                                                type="number"
                                                min="0"
                                                className="form-control w-100 py-0 px-4"
                                                onChange={(e) =>
                                                  changeParsentageToAmount(
                                                    fixedDeductionsRemunerarion,
                                                    setFixedDeductionsRemunerarion,
                                                    e.target.value,
                                                    index
                                                  )
                                                }
                                              />
                                            </td>
                                            <td style={{ width: "90px" }}>
                                              <input
                                                value={
                                                  fixedDeductionsRemunerarion[
                                                    index
                                                  ]?.amount
                                                }
                                                name="amount"
                                                placeholder="Amount"
                                                type="number"
                                                min="0"
                                                className="form-control w-100 py-0 px-4"
                                                onChange={(e) =>
                                                  changeAmountToparsentage(
                                                    fixedDeductionsRemunerarion,
                                                    setFixedDeductionsRemunerarion,
                                                    e.target.value,
                                                    index
                                                  )
                                                }
                                              />
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                  <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>Total : {totalDeduction}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                        {/* Fixed Deductions Remunerarion End	*/}
                      </div>

                      {/* Benifits & Allowances */}
                      <div className="row my-4">
                        <OtherAllowances
                          rowData={rowData}
                          setRowData={setRowData}
                          netPayable={netPayable}
                          setNetPayable={setNetPayable}
                          basicSalery={basicSalery}
                          accountId={accountId}
                          allowanceTotal={allowanceTotal}
                          setAllowanceTotal={setAllowanceTotal}
                        />
                      </div>
                      {landingData.length > 0 && (
                        <EmpRemuSetupLanding landingData={landingData} />
                      )}
                      {/* Benifits & Allowances End */}
                    </>
                  )}
                </Form>
                {/* Create Page End */}

                {/* Landing Page */}
                {!edit && <EmpRemuSetupLanding landingData={landingData} />}
                {/* Landing Page End */}
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
}
