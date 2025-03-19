import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { getHorizonDDL, getItemListSalesPlanDDL } from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

// Validation schema
const validationSchema = Yup.object().shape({
  plant: Yup.object().shape({
    value: Yup.string().required("Plant Name is required"),
    label: Yup.string().required("Plant Name is required"),
  }),
  year: Yup.object().shape({
    value: Yup.string().required("Year is required"),
    label: Yup.string().required("Year is required"),
  }),
  horizon: Yup.object().shape({
    value: Yup.string().required("Planning Horizon is required"),
    label: Yup.string().required("Planning Horizon is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  selectedBusinessUnit,
  profileData,
  rowDto,
  setRowDto,
  remover,
  plantDDL,
  yearDDL,
  gridData,
  rowDtoHandler,
  itemNameDDL,
  setItemNameDDL,
  horizonDDL,
  setHorizonDDL,
  inputHandler,
}) {
  // eslint-disable-next-line no-unused-vars

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
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="global-form p-2">
                <div className="form-group row">
                  <div className="col-lg-4">
                    <NewSelect
                      name="plant"
                      options={plantDDL}
                      value={values?.plant}
                      label="Plant"
                      onChange={(valueOption) => {
                        setFieldValue("plant", valueOption);
                        setFieldValue("itemName", {});
                        getItemListSalesPlanDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setItemNameDDL
                        );
                      }}
                      isDisabled={true}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-4">
                    <NewSelect
                      name="year"
                      options={yearDDL}
                      value={values?.year}
                      label="Year"
                      onChange={(valueOption) => {
                        setFieldValue("year", valueOption);
                        setFieldValue("horizon", {});
                        getHorizonDDL(valueOption?.value, setHorizonDDL);
                      }}
                      isDisabled={true}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-4">
                    <NewSelect
                      name="horizon"
                      options={horizonDDL}
                      value={values?.horizon}
                      label="Planning Horizon"
                      onChange={(valueOption) => {
                        setFieldValue("horizon", valueOption);
                        setFieldValue(
                          "startDate",
                          _dateFormatter(valueOption?.startDate)
                        );
                        setFieldValue(
                          "endDate",
                          _dateFormatter(valueOption?.endDate)
                        );
                      }}
                      isDisabled={true}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-4">
                    <label>Start Date</label>
                    <InputField
                      value={values?.startDate}
                      name="startDate"
                      type="text"
                      disabled
                    />
                  </div>
                  <div className="col-lg-4">
                    <label>End Date</label>
                    <InputField
                      value={values?.endDate}
                      name="endDate"
                      type="text"
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="table-responsive">
                <table className="global-table table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Item Name</th>
                      <th>Plan Quantity</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center">{index + 1}</td>
                        <td className="pl-2">{item?.itemName}</td>
                        <td className="text-center">
                          <InputField
                            value={item?.itemPlanQty}
                            name="itemPlanQty"
                            type="number"
                            onChange={(e) => {
                              inputHandler(
                                item,
                                e?.target?.value,
                                "itemPlanQty",
                                rowDto,
                                setRowDto
                              );
                            }}
                            min="0"
                          />
                        </td>
                        <td className="pl-2 text-center">
                          {_dateFormatter(item?.startdateTime)}
                        </td>
                        <td className="pl-2 text-center">
                          {_dateFormatter(item?.enddateTime)}
                        </td>
                        <td className="text-center">
                          <IDelete id={index} remover={remover} />
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
