/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextArea from "./../../../../_helper/TextArea";
import InputField from "./../../../../_helper/_inputField";
import ICustomTable from "./../../../../_helper/_customTable";
import PaginationTable from "./../../../../_helper/_tablePagination";
import Loading from "./../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";

// Validation schema
const validationSchema = Yup.object().shape({
  bonusName: Yup.object()
    .shape({
      value: Yup.string().required("Bonus Name is required"),
      label: Yup.string().required("Bonus Name is required"),
    })
    .typeError("Bonus Name is required"),
  bonusDescription: Yup.string()
    .min(5, "Minimum 2 symbols")
    .required("Bonus Description is required"),
  religion: Yup.object()
    .shape({
      value: Yup.string().required("Religion is required"),
      label: Yup.string().required("Religion is required"),
    })
    .typeError("Religion is required"),
  employeeType: Yup.object()
    .shape({
      value: Yup.string().required("Employment Type is required"),
      label: Yup.string().required("Employment Type is required"),
    })
    .typeError("Employment Type is required"),
  bonusPercentageOn: Yup.object()
    .shape({
      value: Yup.string().required("Bonus Percentage On is required"),
      label: Yup.string().required("Bonus Percentage On is required"),
    })
    .typeError("Bonus Percentage on is required"),
  servicelength: Yup.number()
    .min(0, "Minimum 0 range")
    .required("Service Length is required"),
  bonusPercentage: Yup.number()
    .min(0, "Minimum 0 range")
    .required("Bonus Percentage is required"),
});

const headers = [
  "SL",
  "Bonus Name",
  "Bonus Description",
  "Religion",
  "Employee Type",
  "Service Length",
  "Bonus Percentage On",
  "Bonus Percentage",
];

const TBody = ({ loader, rowData }) => {
  return (
    <>
      {loader && <Loading />}
      {rowData?.data?.length > 0 &&
        rowData?.data?.map((item, index) => {
          return (
            <tr key={index}>
              <td style={{ textAlign: "center" }}>{index + 1}</td>
              <td>
                <div className="pl-2">{item?.bonusName}</div>
              </td>
              <td>
                <div className="pl-2">{item?.bonusDescription}</div>
              </td>
              <td>
                <div className="pl-2">{item?.religion}</div>
              </td>
              <td>
                <div className="pl-2">{item?.employmentType}</div>
              </td>
              <td>
                <div className="text-right pr-2">
                  {item?.minimumServiceLengthMonth}
                </div>
              </td>
              <td>
                <div className="pl-2">{item?.bonusPercentageOn}</div>
              </td>
              <td>
                <div className="text-right pr-2">{item?.bonusPercentage}</div>
              </td>
            </tr>
          );
        })}
    </>
  );
};

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  religionDDL,
  employeeTypeDDL,
  bonusNameDDL,
  loader,
  isEdit,
  rowData,
  pageNo,
  setPageNo,
  pageSize,
  setPageSize,
  setPositionHandler,
}) {
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
              <div className="global-form">
                <div className="row">
                  <div className="col-lg-3 mb-3">
                    <NewSelect
                      label="Select Bonus Name"
                      options={bonusNameDDL || []}
                      value={values?.bonusName}
                      name="bonusName"
                      onChange={(valueOption) => {
                        setFieldValue(
                          "bonusDescription",
                          valueOption?.description
                        );
                        setFieldValue("bonusName", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 mb-3">
                    <NewSelect
                      label="Select Religion"
                      options={religionDDL || []}
                      value={values?.religion}
                      name="religion"
                      onChange={(valueOption) => {
                        setFieldValue("religion", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 mb-3">
                    <NewSelect
                      label="Select Employeement Type"
                      options={employeeTypeDDL || []}
                      value={values?.employeeType}
                      name="employeeType"
                      onChange={(valueOption) => {
                        setFieldValue("employeeType", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 mb-3">
                    <InputField
                      type="number"
                      value={values?.servicelength}
                      label="Service Length (Month)"
                      placeholder="Service Length (Month)"
                      name="servicelength"
                      min="0"
                      onChange={(e) => {
                        setFieldValue(
                          "servicelength",
                          Math.abs(e.target.value)
                        );
                      }}
                    />
                  </div>
                  <div className="col-lg-3 mb-3">
                    <NewSelect
                      label="Select Bonus Percentage On"
                      options={[
                        { value: 1, label: "Gross" },
                        { value: 2, label: "Basic" },
                      ]}
                      value={values?.bonusPercentageOn}
                      name="bonusPercentageOn"
                      onChange={(valueOption) => {
                        setFieldValue("bonusPercentageOn", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 mb-3">
                    <InputField
                      type="number"
                      value={values?.bonusPercentage}
                      label="Bonus Percentage"
                      placeholder="Bonus Percentage"
                      name="bonusPercentage"
                      min="0"
                      step="any"
                      onChange={(e) => {
                        setFieldValue(
                          "bonusPercentage",
                          Math.abs(e.target.value)
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-3 mb-3">
                    <label>Bonus Description</label>
                    <TextArea
                      value={values?.bonusDescription}
                      name="bonusDescription"
                      placeholder="Bonus Description"
                      rows="3"
                      max={1000}
                      disabled
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>

              <ICustomTable
                ths={headers}
                children={<TBody loader={loader} rowData={rowData} />}
              />

              {rowData?.data?.length > 0 && (
                <PaginationTable
                  count={rowData?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                />
              )}

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
