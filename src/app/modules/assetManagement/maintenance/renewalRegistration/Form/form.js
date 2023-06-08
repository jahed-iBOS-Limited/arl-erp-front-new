import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { getBRTAVehicleType } from "../helper";

// Validation schema
const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  rowDtoHandler,
  prevData,
  setisShowModalforCreate,
  totalAmount,
  setActivityByRenewalServiceId,
  setRowDto,
  getGridAction
}) {
  const [brtaTypeDDL, setBrtaTypeDDL] = useState([]);
  useEffect(() => {
    getBRTAVehicleType(setBrtaTypeDDL);
  }, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setisShowModalforCreate(false);
            getGridAction()
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
            {/* {disableHandler(!isValid)} */}
            {console.log("values", values)}
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <InputField
                    value={values?.renewalDate}
                    label={
                      prevData?.renewalType?.label === "Registration"
                        ? "Registration Date"
                        : "Renewal Date"
                    }
                    placeholder={
                      prevData?.renewalType?.label === "Registration"
                        ? "Registration Date"
                        : "Renewal Date"
                    }
                    required
                    type="date"
                    name="renewalDate"
                  />
                </div>
                {prevData?.renewalType?.label !== "Registration" && (
                  <>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.expiredDate}
                        label="Expired Date"
                        placeholder="Expired Date"
                        required
                        type="date"
                        name="expiredDate"
                      />
                    </div>
                    <div className="col-lg-3  ">
                      <InputField
                        value={values?.nextRenewal}
                        label="Next Renewal"
                        placeholder="Next Renewal"
                        required
                        type="date"
                        name="nextRenewal"
                      />
                    </div>
                  </>
                )}
                {!prevData?.vehicleNo?.brtaVehicelTypeId && (
                  <div className="col-lg-3">
                    <NewSelect
                      label="BRTA Type"
                      name="brtaType"
                      options={brtaTypeDDL}
                      value={values?.brtaType}
                      onChange={(option) => {
                        setRowDto([]);
                        setFieldValue("brtaType", option);
                        if (option?.value)
                          setActivityByRenewalServiceId(
                            prevData?.renewalType?.value,
                            option?.value,
                            prevData?.vehicleNo?.value,
                            setRowDto
                          );
                      }}
                    />
                  </div>
                )}

                <div style={{ marginTop: "26px" }} className="col-lg-3">
                  <b>Total {totalAmount}</b>
                </div>
              </div>
              <div className="table-responsive">
                <table style={{ width: "50%" }} className="table global-table">
                  <thead>
                    <tr>
                      <th className="p-0">SL</th>
                      <th className="p-0">Attribute</th>
                      <th className="p-0">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.map((item, index) => (
                      <tr key={index}>
                        <td> {index + 1} </td>
                        <td className="align-middle">
                          <label>{item?.attributeName}</label>
                        </td>
                        <td className="align-middle">
                          <InputField
                            value={item?.amount}
                            required
                            type="number"
                            onChange={(e) =>
                              rowDtoHandler("amount", e.target.value, index)
                            }
                            name="amount"
                            min="0"
                            disabled={item?.attributeId !== 11 && item.attributeId !== 19}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
