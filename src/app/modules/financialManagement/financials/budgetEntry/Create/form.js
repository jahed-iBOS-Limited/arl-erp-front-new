import React, { useMemo } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import ICustomTable from "../../../../_helper/_customTable";
import NewSelect from "../../../../_helper/_select";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IConfirmModal from "../../../../_helper/_confirmModal";
import UploadButton from "./UploadButton";
import { downloadFile } from "../../../../_helper/downloadFile";
import { getMonthlyDataAction } from "../helper";
import RowComp from "./RowComp";

const validationSchema = Yup.object().shape({
  sbu: Yup.object().shape({
    value: Yup.string().required("SBU is required"),
    label: Yup.string().required("SBU is required"),
  }),
  // gl: Yup.object().shape({
  //   value: Yup.string().required("General ledger is required"),
  //   label: Yup.string().required("General ledger is required"),
  // }),
  type: Yup.object().shape({
    value: Yup.string().required("Type is required"),
    label: Yup.string().required("Type is required"),
  }),
  financialYear: Yup.object().shape({
    value: Yup.string().required("Financial Year is required"),
    label: Yup.string().required("Financial Year is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  SBUDDL,
  typeDDL,
  setRowDto,
  monthlyData,
  rowDto,
  rowDtoHandler,
  GLDDL,
  addButtonHandler,
  totalAmount,
  rowDtoTwo,
  remover,
  setRowDtoTwo,
  fileUpload,
  finYear,
  setMonthlyData,
  sbuIdView,
  monthId,
  sbuId,
  singleData,
}) {
  let ths = ["SL", "From Date", "To Date", "Amount"];
  let thsTwo = ["SL", "GL Code", "GL Name", "Amount", "Action"];
  let thsTwoView = [
    "SL",
    "GL Code",
    "GL Name",
    "From Date",
    "To Date",
    "Amount",
  ];
  let thsTwoEdit = [
    "SL",
    "GL Code",
    "GL Name",
    "From Date",
    "To Date",
    "Amount",
    "Action",
  ];

  const totalAmountRowDtoTwo = useMemo(
    () => rowDtoTwo.reduce((acc, item) => acc + (+item?.amount || 0), 0),
    [rowDtoTwo]
  );

  const addDataToRowDto = (setFieldValue, valueOption, values) => {
    setRowDto([]);
    setRowDtoTwo([]);
    setFieldValue("fromDate", "");
    setFieldValue("toDate", "");
    setFieldValue("type", valueOption);
    if (valueOption?.label === "Yearly by Month") {
      setRowDto(monthlyData);
    } else if (
      valueOption?.label === "Custom" &&
      values?.fromDate &&
      values?.toDate
    ) {
      setRowDto([
        {
          amount: 0,
          fromDate: values?.fromDate,
          toDate: values?.toDate,
        },
      ]);
    }
  };

  const confirmToChangeType = (setFieldValue, valueOption, values) => {
    let confirmObject = {
      title: "Are you sure?",
      message: "If you change this, all added data will be lost",
      yesAlertFunc: async () => {
        addDataToRowDto(setFieldValue, valueOption, values);
      },
      noAlertFunc: () => {
        setFieldValue("type", values?.type);
      },
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={sbuId || sbuIdView ? singleData : initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            if (!sbuId) {
              setRowDto([]);
              setRowDtoTwo([]);
              resetForm(initData);
            }
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
                  <div className="col-lg-2">
                    <NewSelect
                      label="SBU"
                      placeholder="SBU"
                      name="sbu"
                      options={SBUDDL}
                      value={values?.sbu}
                      onChange={(valueOption) => {
                        setFieldValue("sbu", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={sbuId || sbuIdView}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      label="Financial Year"
                      placeholder="Financial Year"
                      name="financialYear"
                      options={finYear}
                      value={values?.financialYear}
                      onChange={(valueOption) => {
                        setFieldValue("financialYear", valueOption);
                        getMonthlyDataAction(valueOption, setMonthlyData);
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={sbuId || sbuIdView}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      label="Type"
                      placeholder="Type"
                      name="type"
                      isDisabled={!values?.financialYear || sbuId || sbuIdView}
                      options={typeDDL}
                      value={values?.type}
                      onChange={(valueOption) => {
                        if (rowDto?.length > 0) {
                          confirmToChangeType(
                            setFieldValue,
                            valueOption,
                            values
                          );
                        } else {
                          addDataToRowDto(setFieldValue, valueOption, values);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {!sbuId && (
                    <RowComp
                      obj={{
                        values,
                        setRowDto,
                        setFieldValue,
                        errors,
                        touched,
                        addButtonHandler,
                        GLDDL,
                        sbuId,
                        sbuIdView,
                      }}
                    />
                  )}
                </div>
                {sbuId && (
                  <div className="row">
                    <RowComp
                      obj={{
                        values,
                        setFieldValue,
                        errors,
                        touched,
                        addButtonHandler,
                        GLDDL,
                        sbuId,
                        sbuIdView,
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="row">
                <div className="col-lg-6">
                  {!monthId && (
                    <div className="text-right mt-2">
                      <ButtonStyleOne
                        style={{ padding: "6px 8px" }}
                        label="Add"
                        type="button"
                        onClick={() => {
                          addButtonHandler(values);
                        }}
                      />
                    </div>
                  )}

                  {!monthId && (
                    <ICustomTable ths={ths}>
                      {rowDto?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td className="text-center">{item?.fromDate}</td>
                          <td className="text-center">{item?.toDate}</td>
                          <td style={{ width: "100px" }}>
                            <input
                              placeholder="Amount"
                              type="number"
                              name="amount"
                              value={item?.amount}
                              required
                              onChange={(e) =>
                                rowDtoHandler("amount", index, e.target.value)
                              }
                            />
                          </td>
                        </tr>
                      ))}
                      {rowDto?.length > 0 && (
                        <tr>
                          <td>#</td>
                          <td
                            className="text-right font-weight-bold"
                            colspan="3"
                            style={{ width: "100px" }}
                          >
                            Total : {totalAmount}
                          </td>
                        </tr>
                      )}
                    </ICustomTable>
                  )}
                </div>
                <div className={sbuId || sbuIdView ? "col-lg-12" : "col-lg-6"}>
                  {!monthId && (
                    <div className="d-flex justify-content-between mt-2">
                      <ButtonStyleOne
                        label="Download Excel"
                        style={{ padding: "6px 8px" }}
                        type="button"
                        onClick={() => {
                          downloadFile(
                            `/fino/BudgetFinancial/BudgetFinancialTempletDownload`,
                            "Budget Entry",
                            "xlsx"
                          );
                        }}
                      />
                      <UploadButton onFileChange={fileUpload} values={values} />
                    </div>
                  )}

                  <ICustomTable
                    ths={sbuIdView ? thsTwoView : sbuId ? thsTwoEdit : thsTwo}
                  >
                    {rowDtoTwo?.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="text-center">{item?.gl?.code}</td>
                        <td className="text-left">{item?.gl?.label}</td>
                        {(sbuId || sbuIdView) && (
                          <>
                            <td className="text-center">{item?.fromDate}</td>
                            <td className="text-center">{item?.toDate}</td>
                          </>
                        )}
                        <td className="text-right">{item?.amount}</td>
                        {!sbuIdView && (
                          <td className="text-center">
                            <IDelete remover={remover} id={index} />
                          </td>
                        )}
                      </tr>
                    ))}
                    {rowDtoTwo?.length > 0 && monthId && (
                      <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                        {console.log("totalAmountRowDtoTwo",totalAmountRowDtoTwo)}
                          <div className="d-flex justify-content-between">
                            <b>Total Amount</b>
                            <b>{(totalAmountRowDtoTwo || 0)?.toFixed(2)}</b>
                          </div>
                        </td>

                        {sbuId && <td></td>}
                      </tr>
                    )}
                  </ICustomTable>
                </div>
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
