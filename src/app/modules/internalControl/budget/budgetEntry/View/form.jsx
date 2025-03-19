import { Form, Formik } from "formik";
import React from "react";
import * as Yup from "yup";
import { getMonthName } from "../../../../_helper/monthIdToMonthName";
import ICustomTable from "../../../../_helper/_customTable";
import { generateBudgetEntryAction } from "../excel/bonusExcel";
import { getRowTotal } from "../helper";
import {
  budgetEntryCostExcelColumn,
  budgetEntryExcelColumn,
  budgetExcelCostData,
  budgetExcelData,
} from "../utility/excelColum";
import ButtonStyleOne from "./../../../../_helper/button/ButtonStyleOne";

const validationSchema = Yup.object().shape({});

export default function _Form({ initData, saveHandler, state }) {
  const tableHeader = (id) => {
    switch (id) {
      case 2:
      case 3:
        return [
          "SL",
          "Cost Revenue Center Name",
          "Code",
          `${state?.strBudgetTypeName} Description`,
          "Plan/Target Qty.",
          "Plan/Target Amount",
        ];

      default:
        return [
          "SL",
          "Code",
          `${state?.strBudgetTypeName} Description`,
          "Plan/Target Qty.",
          "Plan/Target Amount",
        ];
    }
  };

  // excel column set up
  const excelColumnFunc = (processId) => {
    switch (processId) {
      case 2:
      case 3:
        return budgetEntryCostExcelColumn;
      default:
        return budgetEntryExcelColumn;
    }
  };

  // excel data set up
  const excelDataFunc = (processId) => {
    switch (processId) {
      case 2:
      case 3:
        return budgetExcelCostData(state?.budgetRowDTO);
      default:
        return budgetExcelData(state?.budgetRowDTO);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
              <div className="row">
                <div className="col-lg-6">
                  <ButtonStyleOne
                    style={{ marginTop: "19px" }}
                    label="Export Excel"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const excelLanding = () => {
                        generateBudgetEntryAction(
                          `Budget Entry View of ${getMonthName(
                            state?.intMonth
                          )}, ${state?.intYear}`,
                          "",
                          "",
                          excelColumnFunc(state?.intBudgetTypeId),
                          excelDataFunc(state?.intBudgetTypeId),
                          state?.strBusinessUnit,
                          state?.intBudgetTypeId,
                          state?.budgetRowDTO
                        );
                      };
                      excelLanding();
                    }}
                  />
                </div>
                <div className="col-lg-6"></div>
                <div className="col-lg-6">
                  <ICustomTable ths={tableHeader(state?.intBudgetTypeId)}>
                    {state?.budgetRowDTO?.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        {(state?.intBudgetTypeId === 2 ||
                          state?.intBudgetTypeId === 3) && (
                          <td>{item?.costRevCenterName}</td>
                        )}
                        <td className="text-center">{item?.strElementCode}</td>
                        <td className="text-center">{item?.strElementName}</td>
                        <td className="text-right">{item?.numBudgetQty}</td>
                        <td className="text-right">{item?.numBudgetValue}</td>
                      </tr>
                    ))}
                    <tr>
                      <td></td>
                      <td></td>
                      <td>
                        <div className="d-flex justify-content-between">
                          <b>Total Amount</b>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-end">
                          <b>
                            {getRowTotal(
                              state?.budgetRowDTO,
                              "numBudgetQty"
                            )?.toFixed(2)}
                          </b>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-end">
                          <b>
                            {getRowTotal(
                              state?.budgetRowDTO,
                              "numBudgetValue"
                            )?.toFixed(2)}
                          </b>
                        </div>
                      </td>
                    </tr>
                  </ICustomTable>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
