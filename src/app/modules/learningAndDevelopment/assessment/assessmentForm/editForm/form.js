import { Form, Formik } from "formik";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast } from "react-toastify";
import IConfirmModal from "../../../../_helper/_confirmModal";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";

export default function AssessmentForm({
  id,
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  questionsList,
  setQuestionsList,
}) {
  const nextQuestionId = (questionsList) => {
    const maxId = questionsList.reduce(
      (maxId, todo) => Math.max(todo.id, maxId),
      0
    );
    return maxId + 1;
  };

  const deleteHandler = (index, questionsList) => {
    IConfirmModal({
      title: "Are you want to delete ?",
      yesAlertFunc: () => {
        let data = questionsList?.filter((item) => item.id !== id);
        setQuestionsList(data);
      },
      noAlertFunc: () => { },
    });
  };

  const addOptionHandler = (i) => {
    if (questionsList?.length > 0) {
      let data = [...questionsList];
      if (!data[i]["strOption"]) return toast.warn("Option is required");
      if (!data[i]["numPoints"]) return toast.warn("Marks is required");
      data[i]["options"].push({
        name: data[i]["strOption"],
        marks: data[i]["numPoints"],
      });
      data[i]["option"] = "";
      data[i]["marks"] = "";
      setQuestionsList(data);
    } else {
      let data = [...questionsList];
      if (!data[i]["option"]) return toast.warn("Option is required");
      if (!data[i]["marks"]) return toast.warn("Marks is required");
      data[i]["options"].push({
        name: data[i]["option"],
        marks: data[i]["marks"],
      });
      data[i]["option"] = "";
      data[i]["marks"] = "";
      setQuestionsList(data);
    }
  };

  const optionRemover = (index, i) => {
    const data = [...questionsList];
    data[index]["options"] = data[index]["options"].filter(
      (option, optionIndex) => optionIndex !== i
    );
    setQuestionsList(data);
  };

  const rowDtoHandler = (name, value, i, setFieldValue) => {
    switch (name) {
      case "isRequired":
        let requiredData = [...questionsList];
        requiredData[i].isRequired = value;
        setQuestionsList(requiredData);
        return;
      case "question":
        let questionData = [...questionsList];
        questionData[i].question = value;
        setQuestionsList(questionData);
        return;
      case "strQuestion":
        let strQuestionData = [...questionsList];
        strQuestionData[i].strQuestion = value;
        setQuestionsList(strQuestionData);
        return;
      case "marks":
        let marksData = [...questionsList];
        marksData[i].marks = value;
        setQuestionsList(marksData);
        return;
      case "numPoints":
        let numPointsData = [...questionsList];
        numPointsData[i].numPoints = value;
        setQuestionsList(numPointsData);
        return;
      case "option":
        let optionData = [...questionsList];
        optionData[i].option = value;
        setQuestionsList(optionData);
        return;
      case "strOption":
        let strOptionData = [...questionsList];
        strOptionData[i].strOption = value;
        setQuestionsList(strOptionData);
        return;

      default:
        return;
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
          setFieldValue,
          isValid,
          errors,
          touched,
        }) => (
          <>
            <Form className="form form-label-right">
              {false && <Loading />}

              <div className="form-group row global-form">
                <>Header Part</>
              </div>
              <div className="d-flex align-items-center mt-5">
                <h4 style={{ marginRight: "10px" }}>Question: Add Question</h4>
                <OverlayTrigger
                  overlay={<Tooltip id="cs-icon">{"ADD"}</Tooltip>}
                >
                  <span>
                    <i
                      style={{ fontSize: "20px" }}
                      className={`fas fa-plus-circle cursor-pointer`}
                      onClick={() => {
                        setQuestionsList([
                          ...questionsList,
                          {
                            id: nextQuestionId(questionsList),
                            isRequired: false,
                            question: "",
                            option: "",
                            options: [],
                            marks: "",
                          },
                        ]);
                      }}
                    ></i>
                  </span>
                </OverlayTrigger>
              </div>
              {questionsList?.length > 0 &&
                questionsList.map((item, index) => (
                  <div key={index} className="question-wrapper">
                    <div className="row">
                      <div className="col-lg-12">
                        <div className="form-group row global-form">
                          <div
                            style={{ margin: "0 15px" }}
                            className="d-flex align-items-center"
                          >
                            <input
                              type="checkbox"
                              checked={item?.isRequired}
                              onChange={(e) => {
                                rowDtoHandler(
                                  "isRequired",
                                  e.target.checked,
                                  index
                                );
                              }}
                            />
                          </div>
                          <div className="col-lg-6">
                            <label>Question</label>
                            <InputField
                              value={questionsList?.length > 0 ? item?.strQuestion : item?.question}
                              type="text"
                              onChange={(e) => {
                                questionsList?.length > 0 ? rowDtoHandler(
                                  "strQuestion",
                                  e.target.value,
                                  index
                                ) :
                                rowDtoHandler(
                                  "question",
                                  e.target.value,
                                  index
                                );
                              }}
                            />
                          </div>
                          <div className="col-lg-4">
                            <label>Option</label>
                            <InputField
                              type="text"
                              value={item?.option}
                              onChange={(e) => {
                                id ? rowDtoHandler("strOption", e.target.value, index) :
                                  rowDtoHandler("option", e.target.value, index);
                              }}
                            />
                          </div>
                          <div className="col-lg-1">
                            <label>Marks</label>
                            <InputField
                              value={item?.marks}
                              type="number"
                              onChange={(e) => {
                                id ? rowDtoHandler("numPoints", e.target.value, index) :
                                  rowDtoHandler("marks", e.target.value, index);
                              }}
                            />
                          </div>
                          <div
                            style={{ marginTop: "25px", marginLeft: "-7px" }}
                          >
                            <OverlayTrigger
                              overlay={<Tooltip id="cs-icon">{"ADD"}</Tooltip>}
                            >
                              <span>
                                <i
                                  style={{ fontSize: "15px" }}
                                  className={`fas fa-plus-circle cursor-pointer`}
                                  onClick={() => {
                                    addOptionHandler(index);
                                  }}
                                ></i>
                              </span>
                            </OverlayTrigger>
                          </div>
                          <div className="d-flex justify-content-end">
                            <OverlayTrigger
                              overlay={
                                <Tooltip id="cs-icon">{"Delete"}</Tooltip>
                              }
                            >
                              <span>
                                <i
                                  style={{
                                    fontSize: "12px",
                                    marginTop: "24px",
                                    marginLeft: "20px",
                                  }}
                                  className={`fa fa-trash text-danger`}
                                  onClick={() => {
                                    deleteHandler(item?.index, questionsList);
                                  }}
                                ></i>
                              </span>
                            </OverlayTrigger>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap">
                      {item?.options?.length > 0 &&
                        item?.options?.map((option, i) => (
                          <div
                            style={{
                              background: "#ebebeb",
                              padding: "1px 5px",
                              marginTop: "3px",
                              marginRight: "5px",
                              fontWeight: "500",
                              borderRadius: "2px",
                            }}
                          >
                            <span style={{ marginRight: "5px" }}>
                              {/* {`${option?.name?.slice(0, 15)}${(option?.name?.length > 15) ? "..." : ""} (${option?.marks})`}{" "} */}
                              {`${(option?.name?.slice(0, 15) || option?.strOption.slice(0, 15))}${(option?.name?.length > 15 || option?.strOption?.length > 15) ? "..." : ""} (${(option?.marks || option?.numPoints)})`}{" "}

                            </span>
                            <OverlayTrigger
                              overlay={
                                <Tooltip id="cs-icon">{"Delete"}</Tooltip>
                              }
                            >
                              <span>
                                <i
                                  style={{ fontSize: "12px" }}
                                  className={`fa fa-times cursor-pointer`}
                                  onClick={() => {
                                    optionRemover(index, i);
                                  }}
                                ></i>
                              </span>
                            </OverlayTrigger>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
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
