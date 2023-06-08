/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ButtonStyleOne from "../../../../_helper/button/ButtonStyleOne";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import ICustomTable from "../../../../_helper/_customTable";
import IForm from "../../../../_helper/_form";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import { addButtonHandler, saveHandler } from "../helper";

const initData = {
  date: _todayDate(),
  bankName: "",
  limitType: "",
  type: "",
  amount: "",
};

const CreateBankLimit = () => {
  const history = useHistory();
  const { selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [bankDDL, getBankDDl] = useAxiosGet();
  const [, saveData, loading] = useAxiosPost({});

  useEffect(() => {
    getBankDDl(`/hcm/HCMDDL/GetBankDDL`);
  }, []);

  const remover = (ind) => {
    const data = rowDto.filter((item, index) => index !== ind);
    setRowDto(data);
  };

  return (
    <div>
      {(isDisabled || loading) && <Loading />}
      <IForm title={"Create Bank Limit"} getProps={setObjprops} isDisabled={isDisabled}>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          // validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler({
              values,
              cb: () => {
                setRowDto([]);
                resetForm(initData);
                setDisabled(false);
                history.goBack();
              },
              selectedBusinessUnit,
              rowDto,
              setDisabled,
              saveData,
            });
          }}
        >
          {({ handleSubmit, resetForm, values, errors, touched, setFieldValue, isValid }) => (
            <>
              <Form className="form form-label-right">
                <div className="form-group row global-form">
                  <div className="col-lg-2">
                    <InputField
                      label="Date"
                      placeholder="Date"
                      name="date"
                      type="date"
                      value={values?.date}
                      onChange={(e) => {
                        setFieldValue("date", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      label="Bank Name"
                      placeholder="Bank Name"
                      name="bankName"
                      options={bankDDL}
                      value={values?.bankName}
                      onChange={(valueOption) => {
                        setFieldValue("bankName", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      label="Limit Type"
                      placeholder="Limit Type"
                      name="limitType"
                      options={[
                        { value: 1, label: "Limit-1" },
                        { value: 2, label: "Limit-2" },
                      ]}
                      value={values?.limitType}
                      onChange={(valueOption) => {
                        setFieldValue("limitType", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      label="Type"
                      placeholder="Type"
                      name="type"
                      options={[
                        { value: 1, label: "Addition" },
                        { value: 2, label: "Deduction" },
                      ]}
                      value={values?.type}
                      onChange={(valueOption) => {
                        setFieldValue("type", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      label="Amount"
                      placeholder="Amount"
                      name="amount"
                      type="number"
                      value={values?.amount}
                      onChange={(e) => {
                        if (+e.target.value < 0) return null;
                        setFieldValue("amount", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2 align-self-end">
                    <div className="text-left">
                      <ButtonStyleOne
                        label="Add"
                        type="button"
                        onClick={() => {
                          addButtonHandler({ values, rowDto, setRowDto });
                        }}
                      />
                    </div>
                  </div>
                  {rowDto?.length ? (
                    <div className="col-lg-12 mt-2">
                      <ICustomTable ths={["SL", "Date ", "Bank Name", "Limit Type", "Type", "Amount", "Action"]}>
                        {rowDto?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">{item?.date}</td>
                            <td>{item?.bankName}</td>
                            <td>{item?.limitType}</td>
                            <td>{item?.type}</td>
                            <td className="text-center">{item?.amount}</td>
                            <td className="text-center">
                              <IDelete remover={remover} id={index} />
                            </td>
                          </tr>
                        ))}
                        {rowDto?.length ? (
                          <tr>
                            <td colSpan="5" className="text-right">
                              Total:
                            </td>
                            <td className="text-center">{rowDto?.reduce((total, value) => total + +value?.amount, 0)}</td>
                            <td></td>
                          </tr>
                        ) : null}
                      </ICustomTable>
                    </div>
                  ) : null}
                  <button type="submit" style={{ display: "none" }} ref={objProps.btnRef} onSubmit={() => handleSubmit()}></button>
                  <button type="reset" style={{ display: "none" }} ref={objProps.resetBtnRef} onSubmit={() => resetForm(initData)}></button>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </IForm>
    </div>
  );
};

export default CreateBankLimit;
