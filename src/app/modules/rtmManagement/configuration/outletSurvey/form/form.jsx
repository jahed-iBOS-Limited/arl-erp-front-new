/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  surveyName: Yup.string().required("Survey Name is required"),
  fromDate: Yup.string().required("From Date is required"),
});

function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,

  // Row Data's State
  questionRowData,
  setQuestionRowData,

  // DDL
  MultipleQuestionFieldTypeDDL,
}) {
  // This Function Will Be Handle Set Question Under a Particuler Index
  const insertWithIndex = (arr, index, ...newItems) => [
    ...arr.slice(0, index),
    ...newItems,
    ...arr.slice(index),
  ];

  // Question Name handler
  const questionNameHandler = (value, index) => {
    const newRowData = [...questionRowData];
    newRowData[index].questionName = value;
    setQuestionRowData(newRowData);
  };

  // Question Field Type Handler, DDL Handler
  const questionFieldTypeHandler = (value, index) => {
    const newRowData = [...questionRowData];
    newRowData[index].questionFieldType = value;
    setQuestionRowData(newRowData);
  };

  // When Select Multiple Option From DDL Then it called
  const handleMultipleQuestionDropdown = (index) => {
    const newRowData = [...questionRowData];
    newRowData[index].multipleQuestionOptionList = [
      {
        questionOptionName: "",
      },
    ];
    setQuestionRowData(newRowData);
  };

  // When Select List from DDL Then it called
  const handleQuestionList = (index) => {
    const newRowData = [...questionRowData];
    newRowData[index].questionList = [
      {
        questionOptionName: "",
      },
    ];
    setQuestionRowData(newRowData);
  };

  // Onchange handler for multiple option form
  const multipleOptionNameHandler = (value, optionIndex, mainIndex) => {
    const newRowData = [...questionRowData];
    newRowData[mainIndex].multipleQuestionOptionList[
      optionIndex
    ].questionOptionName = value;
    setQuestionRowData(newRowData);
  };

  // Add Handler For multiple options add icon
  const multipleOptionNameAddHandler = (payload, optionIndex, mainIndex) => {
    const newRowData = [...questionRowData];
    const rowData = insertWithIndex(
      newRowData[mainIndex]?.multipleQuestionOptionList,
      optionIndex + 1,
      payload
    );
    newRowData[mainIndex].multipleQuestionOptionList = rowData;
    setQuestionRowData(newRowData);
    window.scrollBy(0, 20);
  };

  // Onchange handler for List option form
  const listNameHandler = (value, optionIndex, mainIndex) => {
    const newRowData = [...questionRowData];
    newRowData[mainIndex].questionList[optionIndex].questionOptionName = value;
    setQuestionRowData(newRowData);
    window.scrollBy(0, 50);
  };

  // Add Handler For List options add icon
  const listNameAddHandler = (payload, listIndex, mainIndex) => {
    const newRowData = [...questionRowData];
    const rowData = insertWithIndex(
      newRowData[mainIndex]?.questionList,
      listIndex + 1,
      payload
    );
    newRowData[mainIndex].questionList = rowData;
    setQuestionRowData(newRowData);
    window.scrollBy(0, 20);
  };

  // Clean When Onchange any question field type
  const cleanQuestionListAndMultipleOptionList = (index) => {
    const newRowData = [...questionRowData];
    newRowData[index].questionList = [];
    newRowData[index].multipleQuestionOptionList = [];
    setQuestionRowData(newRowData);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          setQuestionRowData([
            {
              questionName: "",
              questionFieldType: MultipleQuestionFieldTypeDDL[0],
              multipleQuestionOptionList: [],
              questionList: [],
            },
          ]);
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
          <Form>
            <div className="form-group global-form row">
              <div className="col-lg-3">
                <label>Survey Name*</label>
                <InputField
                  value={values?.surveyName}
                  name="surveyName"
                  placeholder="Survey Name"
                  type="text"
                  disabled={isEdit}
                />
              </div>
              <div className="col-lg-3">
                <label>From Date*</label>
                <InputField
                  value={values?.fromDate}
                  name="fromDate"
                  placeholder="From Date"
                  type="date"
                  disabled={isEdit}
                />
              </div>
              {!values?.isContinue && (
                <div className="col-lg-3">
                  <label>To Date</label>
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    placeholder="To Date"
                    type="date"
                    disabled={isEdit}
                  />
                </div>
              )}
              <div className="col-lg-3 d-flex align-items-end">
                <div className="d-flex align-items-center">
                  <input
                    disabled={isEdit}
                    name="isContinue"
                    type="checkbox"
                    checked={values?.isContinue}
                    onChange={(e) => {
                      setFieldValue("isContinue", e.target.checked);
                    }}
                  />
                  <label className="pl-2">isContinue</label>
                </div>
              </div>
            </div>
            {questionRowData?.length > 0 && (
              <>
                {questionRowData?.map((item, index) => (
                  <>
                    <div key={index} className="row m-0 p-0">
                      <div className="form-group col-lg-8 global-form row">
                        <div className="col-lg-12 d-flex justify-content-between mb-4">
                          <div>
                            <h6 className="border-bottom border-light">
                              Question {index + 1}
                            </h6>
                          </div>
                          {!isEdit && (
                            <div className="d-flex align-items-center">
                              <button
                                type="button"
                                disabled={
                                  !item?.questionName ||
                                  !item?.questionFieldType
                                }
                                onClick={() => {
                                  const payload = {
                                    questionName: "",
                                    questionFieldType:
                                      MultipleQuestionFieldTypeDDL[0],
                                    multipleQuestionOptionList: [],
                                    questionList: [],
                                  };

                                  const rowData = insertWithIndex(
                                    questionRowData,
                                    index + 1,
                                    payload
                                  );
                                  setQuestionRowData([...rowData]);
                                  window.scrollBy(0, 150);
                                }}
                                className="btn btn-primary p-2"
                              >
                                + Add
                              </button>
                              {questionRowData?.length > 1 && (
                                <button
                                  type="button"
                                  className="btn btn-danger p-2 ml-2"
                                  onClick={() => {
                                    const filterData = questionRowData?.filter(
                                      (item, idx) => idx !== index
                                    );
                                    setQuestionRowData(filterData);
                                  }}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="col-lg-6">
                          <label>Question Name</label>
                          <InputField
                            required={true}
                            disabled={isEdit}
                            value={item?.questionName}
                            name={`questionName${index}`}
                            placeholder="Question Name"
                            type="text"
                            onChange={(e) =>
                              questionNameHandler(e.target.value, index)
                            }
                          />
                        </div>
                        <div className="col-lg-6">
                          <NewSelect
                            isDisabled={isEdit}
                            name={`questionFieldType${index}`}
                            options={MultipleQuestionFieldTypeDDL}
                            value={item?.questionFieldType}
                            label="Field Type"
                            onChange={(valueOption) => {
                              cleanQuestionListAndMultipleOptionList(index);
                              questionFieldTypeHandler(valueOption, index);
                              if (valueOption?.label === "Multiple Option") {
                                handleMultipleQuestionDropdown(index);
                              }
                              if (valueOption?.label === "List") {
                                handleQuestionList(index);
                              }
                            }}
                            placeholder="Field Type"
                            errors={errors}
                            touched={touched}
                          />
                        </div>

                        {/* Multiple Option Attribute Start */}
                        {item?.multipleQuestionOptionList?.length > 0 && (
                          <>
                            {/* Multiple Option List */}
                            {item?.multipleQuestionOptionList?.map(
                              (optionItem, optionIndex) => (
                                <>
                                  <div
                                    key={optionIndex}
                                    className="col-lg-12 mt-4 row"
                                  >
                                    <div className="w-75 d-flex align-items-center pl-4">
                                      <label className="pr-2">
                                        {optionIndex + 1}.{" "}
                                      </label>
                                      <InputField
                                        required={true}
                                        disabled={isEdit}
                                        value={optionItem?.questionOptionName}
                                        name="multipleQuestionOne"
                                        placeholder="Option..."
                                        type="text"
                                        onChange={(e) => {
                                          multipleOptionNameHandler(
                                            e.target.value,
                                            optionIndex,
                                            index
                                          );
                                        }}
                                      />
                                      {/* Add & Delete Icon */}
                                      {!isEdit && (
                                        <>
                                          <button
                                            type="button"
                                            disabled={
                                              !optionItem?.questionOptionName
                                            }
                                            onClick={() => {
                                              const payload = {
                                                questionOptionName: "",
                                              };
                                              multipleOptionNameAddHandler(
                                                payload,
                                                optionIndex,
                                                index
                                              );
                                            }}
                                            className="ml-4 btn btn-primary p-1 text-center"
                                          >
                                            <i class="fas fa-plus-circle ml-1"></i>
                                          </button>

                                          {item?.multipleQuestionOptionList
                                            ?.length > 1 && (
                                            <button
                                              type="button"
                                              className="ml-4 btn btn-danger p-1 text-center"
                                              onClick={() => {
                                                const filterData = item?.multipleQuestionOptionList?.filter(
                                                  (item, idx) =>
                                                    idx !== optionIndex
                                                );
                                                const newRowData = [
                                                  ...questionRowData,
                                                ];
                                                newRowData[
                                                  index
                                                ].multipleQuestionOptionList = filterData;
                                                setQuestionRowData(newRowData);
                                              }}
                                            >
                                              <i class="fas fa-trash ml-1"></i>
                                            </button>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </>
                              )
                            )}
                          </>
                        )}
                        {/* Multiple Option Attribute End */}

                        {/* Question List Attribute Start */}
                        {item?.questionList?.length > 0 && (
                          <>
                            {/* Question Option List Render */}
                            {item?.questionList?.map((listItem, listIndex) => (
                              <>
                                <div
                                  key={listIndex}
                                  className="col-lg-12 mt-4 row"
                                >
                                  <div className="w-75 d-flex align-items-center pl-4">
                                    <label className="pr-2">
                                      {listIndex + 1}.{" "}
                                    </label>
                                    <InputField
                                      required={true}
                                      disabled={isEdit}
                                      value={listItem?.questionOptionName}
                                      placeholder="Option..."
                                      type="text"
                                      onChange={(e) => {
                                        listNameHandler(
                                          e.target.value,
                                          listIndex,
                                          index
                                        );
                                      }}
                                    />
                                    {/* Add & Delete Icon */}
                                    {!isEdit && (
                                      <>
                                        <button
                                          type="button"
                                          disabled={
                                            !listItem?.questionOptionName
                                          }
                                          onClick={() => {
                                            const payload = {
                                              questionOptionName: "",
                                            };
                                            listNameAddHandler(
                                              payload,
                                              listIndex,
                                              index
                                            );
                                          }}
                                          className="ml-4 btn btn-primary p-1 text-center"
                                        >
                                          <i class="fas fa-plus-circle ml-1"></i>
                                        </button>
                                        {item?.questionList?.length > 1 && (
                                          <button
                                            type="button"
                                            className="ml-4 btn btn-danger p-1 text-center"
                                            onClick={() => {
                                              const filterData = item?.questionList?.filter(
                                                (item, idx) => idx !== listIndex
                                              );
                                              const newRowData = [
                                                ...questionRowData,
                                              ];
                                              newRowData[
                                                index
                                              ].questionList = filterData;
                                              setQuestionRowData(newRowData);
                                            }}
                                          >
                                            <i class="fas fa-trash ml-1"></i>
                                          </button>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                              </>
                            ))}
                          </>
                        )}
                        {/* Question List Attribute End */}
                      </div>
                    </div>
                  </>
                ))}
              </>
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
  );
}

export default _Form;
