import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import InputField from "../../_helper/_inputField";
import Loading from "../../_helper/_loading";
import IDelete from "../_chartinghelper/_delete";

// Initial data for Formik
const initData = {
  toEmail: "",
  ccEmail: "",
};

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  toEmail: Yup.string()
    .test("valid-to-email", "Invalid email address", (value) => {
      if (!value) return false;
      const trimmedValue = value.trim(); // Trim spaces before validation
      return Yup.string()
        .email()
        .isValidSync(trimmedValue);
    })
    .required("To Email is required"),

  ccEmail: Yup.string()
    .test(
      "valid-cc-emails",
      "Each email in 'Cc' field must be valid and no trailing commas",
      (value) => {
        if (!value) return true; // ccEmail is optional
        const emails = value.split(",").map((email) => email.trim());

        // Check for empty email entries (e.g., due to trailing commas)
        if (emails.some((email) => email === "")) {
          return false; // Invalid if there are empty emails
        }

        // Validate all emails
        return emails.every((email) =>
          Yup.string()
            .email()
            .isValidSync(email)
        );
      }
    )
    .nullable(),
});

export default function AddTOCC({ setIsShow, setEmailData, prevEmailList }) {
  const [emailList, setEmailList] = useState({
    to: [],
    email_list: [],
  });

  useEffect(() => {
    setEmailList({ ...prevEmailList });
  }, [prevEmailList]);

  const saveHandler = (values, cb) => {
    // Add emails to the state, clean unnecessary spaces
    setEmailList((prev) => ({
      to: [...prev.to, values.toEmail?.trim()?.toLowerCase()], // Trim before adding
      email_list: [
        ...prev.email_list,
        values.ccEmail
          ? values.ccEmail
              .split(",")
              .map((email) => email?.trim()?.toLowerCase()) // Trim spaces when adding to state
          : [], // If no ccEmail, add an empty array
      ],
    }));
    cb(); // Reset form after saving
  };

  const handleDelete = (index) => {
    setEmailList((prev) => ({
      to: prev.to.filter((_, i) => i !== index),
      email_list: prev.email_list.filter((_, i) => i !== index),
    }));
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({ handleSubmit, values, setFieldValue, isValid, errors }) => (
          <>
            {false && <Loading />}
            <Form>
              <div className="text-right">
                <button
                  onClick={() => {
                    setEmailData((prev) => ({
                      ...prev,
                      toEmail: emailList.to
                        .map((email, index) =>
                          index > 0 ? `| ${email}` : email
                        ) // Add `|` before every index except 0
                        .join(" "), // Join all toEmail entries with a space
                      ccEmail: emailList.email_list
                        .map(
                          (emailArray, index) =>
                            emailArray.length > 0
                              ? emailArray.join(", ")
                              : "No Emails" // Replace empty arrays with "No Emails"
                        )
                        .map((emailString, index) =>
                          index > 0 ? `| ${emailString}` : emailString
                        ) // Add `|` before every index except 0
                        .join(" "), // Join the resulting strings with a space
                    }));

                    setIsShow(false);
                  }}
                  type="button"
                  className="btn btn-primary mb-2"
                >
                  Save
                </button>
              </div>
              <div className="form-group global-form row">
                <div className="col-lg-12">
                  <InputField
                    value={values.toEmail}
                    label="To"
                    name="toEmail"
                    type="text"
                    onChange={(e) => setFieldValue("toEmail", e.target.value)} // No trimming here
                    errors={errors}
                  />
                </div>
                <div className="col-lg-12">
                  <InputField
                    value={values.ccEmail}
                    label="Cc"
                    name="ccEmail"
                    type="text"
                    onChange={(e) => setFieldValue("ccEmail", e.target.value)} // No trimming here
                    errors={errors}
                  />
                </div>
                <div>
                  <button
                    type="button"
                    className="btn btn-primary ml-5 mt-5"
                    onClick={handleSubmit}
                    disabled={!isValid}
                  >
                    Add
                  </button>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>

      {/* Email Table */}
      <div className="mt-5">
        {emailList.to.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                <th>To Email</th>
                <th>Cc Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {emailList.to.map((toEmail, index) => (
                <tr key={index}>
                  <td>{toEmail}</td>
                  <td>{emailList.email_list[index].join(", ") || ""}</td>
                  <td className="text-center">
                    <span
                      onClick={() => {
                        handleDelete(index);
                      }}
                    >
                      <IDelete />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
