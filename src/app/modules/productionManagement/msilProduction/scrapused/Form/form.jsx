import { Form, Formik } from "formik";
import React from "react";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

export default function ScrapusedCreateForm({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  loading,
  profileData,
  validationSchema,
  total,
  setTotal,
  numberInfo,
  setNumberInfo,
  id
}) {
  const updateNumber = (name, value) => {
    let newNumber = {
      ...numberInfo,
      [name]: value,
    };

    let newTotal = Object.values(newNumber).reduce(
      (acc, item) => acc + +item,
      0
    );

    let newValue = 0;

    if (newTotal > 100) {
      newValue = numberInfo[name];
      newTotal = Object.values(numberInfo).reduce(
        (acc, item) => acc + +item,
        0
      );
    } else {
      newValue = value;
    }

    setNumberInfo({
      ...numberInfo,
      [name]: newValue,
    });

    setTotal(newTotal);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
          saveHandler(values, setFieldValue, () => {
            // resetForm(initData);
            setFieldValue("date", "");
            setFieldValue("shift", "");
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          setFieldValue,
          isValid,
          errors,
          touched,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <InputField
                    value={values?.date}
                    label="Date"
                    name="date"
                    type="date"
                    disabled={id}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="shift"
                    options={[
                      { value: "A", label: "A" },
                      { value: "B", label: "B" },
                      { value: "C", label: "C" },
                    ]}
                    value={values?.shift}
                    label="Shift"
                    onChange={(valueOption) => {
                      setFieldValue("shift", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={numberInfo?.grade}
                    label="A Grade"
                    name="grade"
                    disabled={total === 100 && !numberInfo?.grade}
                    type="number"
                    onChange={(e) => {
                      updateNumber("grade", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={numberInfo?.forignScrap}
                    label="Forign Scrap"
                    disabled={total === 100 && !numberInfo?.forignScrap}
                    name="forignScrap"
                    type="number"
                    onChange={(e) => {
                      updateNumber("forignScrap", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={numberInfo?.hundredSuper}
                    label="100 Super"
                    name="hundredSuper"
                    disabled={total === 100 && !numberInfo?.hundredSuper}
                    type="number"
                    onChange={(e) => {
                      updateNumber("hundredSuper", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={numberInfo?.castIron}
                    label="Cast Iron"
                    name="castIron"
                    disabled={total === 100 && !numberInfo?.castIron}
                    type="number"
                    onChange={(e) => {
                      updateNumber("castIron", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={numberInfo?.hardScrap}
                    label="Hard Scrap"
                    name="hardScrap"
                    disabled={total === 100 && !numberInfo?.hardScrap}
                    type="number"
                    onChange={(e) => {
                      updateNumber("hardScrap", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={numberInfo?.railwayWheel}
                    label="Railway Wheel"
                    name="railwayWheel"
                    disabled={total === 100 && !numberInfo?.railwayWheel}
                    type="number"
                    onChange={(e) => {
                      updateNumber("railwayWheel", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={numberInfo?.mediumSuper}
                    label="Medium Super"
                    name="mediumSuper"
                    disabled={total === 100 && !numberInfo?.mediumSuper}
                    type="number"
                    onChange={(e) => {
                      updateNumber("mediumSuper", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={numberInfo?.msBabri}
                    label="MS Barbi"
                    name="msBabri"
                    disabled={total === 100 && !numberInfo?.msBabri}
                    type="number"
                    onChange={(e) => {
                      updateNumber("msBabri", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={numberInfo?.tinBundle}
                    label="Tin Bundle"
                    name="tinBundle"
                    disabled={total === 100 && !numberInfo?.tinBundle}
                    type="number"
                    onChange={(e) => {
                      updateNumber("tinBundle", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={numberInfo?.spongeIron}
                    label="Sponge Iron"
                    disabled={total === 100 && !numberInfo?.spongeIron}
                    name="spongeIron"
                    type="number"
                    onChange={(e) => {
                      updateNumber("spongeIron", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={numberInfo?.scapAvgGrade}
                    label="Scap AvgGrade"
                    name="scapAvgGrade"
                    type="number"
                    disabled={total === 100 && !numberInfo?.scapAvgGrade}
                    onChange={(e) => {
                      updateNumber("scapAvgGrade", e.target.value);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={total}
                    label="Total %"
                    name="total"
                    type="number"
                    disabled={true}
                  />
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
