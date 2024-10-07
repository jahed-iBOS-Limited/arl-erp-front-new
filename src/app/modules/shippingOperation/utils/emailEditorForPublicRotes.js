import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Loading from "../../_helper/_loading";
import AttachmentUploaderNew from "../../_helper/attachmentUploaderNew";
import useAxiosPost from "../../_helper/customHooks/useAxiosPost";
import { marineBaseUrlPythonAPI } from "../../../App";
import { shallowEqual, useSelector } from "react-redux";

const EmailEditorForPublicRoutes = ({ payloadInfo, cb }) => {

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [emailData, setEmailData] = useState({
    toEmail: "",
    ccEmail: "",
    subject: "",
    emailBody: "",
    attachment: "",
  });

  console.log("emailData", emailData);
  console.log("payloadInfo", payloadInfo);

  const [errors, setErrors] = useState({
    to: "",
    cc: "",
    subject: "",
    body: "",
  });

  const [, onSendEmail, loader] = useAxiosPost();

  // // Convert payloadInfo to HTML for ReactQuill
  // const convertPayloadToHtml = () => {
  //   let htmlContent = "";

  //   Object.entries(payloadInfo).forEach(([key, value]) => {
  //     if (typeof value === "string" && value.startsWith("http")) {
  //       // If the value is a URL (e.g., image), insert an <img> tag
  //       htmlContent += `<p><strong>${key}:</strong> <a href="${value}" target="_blank">${value}</a></p>`;
  //     } else {
  //       // Otherwise, just insert the text content
  //       htmlContent += `<p><strong>${key}:</strong> ${value}</p>`;
  //     }
  //   });

  //   return htmlContent;
  // };

   // Function to remove prefixes and convert camelCase to space-separated words
   const cleanKey = (key) => {
    const keyWithoutPrefix = key.replace(/^(str|int|num)/, ""); // Remove prefixes
    return keyWithoutPrefix.replace(/([a-z])([A-Z])/g, "$1 $2"); // Convert camelCase to spaced words
  };

  // Convert payloadInfo to HTML for ReactQuill
  const convertPayloadToHtml = () => {
    let htmlContent = "";

    Object.entries(payloadInfo).forEach(([key, value]) => {
      const cleanedKey = cleanKey(key); // Apply cleaning to the key

      if (typeof value === "string" && value.startsWith("http")) {
        // If the value is a URL and contains 'id=', create a clickable link
        if (value.includes("id=") && value.split("id=")[1]) {
          htmlContent += `<p><strong>${cleanedKey}:</strong> <a href="${value}" target="_blank">View Document</a></p>`;
        } else {
          htmlContent += `<p><strong>${cleanedKey}:</strong> </p>`;
        }
      } else {
        // Otherwise, just insert the text content
        htmlContent += `<p><strong>${cleanedKey}:</strong> ${value || ""}</p>`;
      }
    });

    return htmlContent;
  };

  useEffect(() => {
    // Initialize the email body with payloadInfo content
    setEmailData((prevState) => ({
      ...prevState,
      emailBody: convertPayloadToHtml(),
    }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payloadInfo]);

  // Regular expression to validate a single email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Function to validate multiple email addresses separated by commas
  const validateEmails = (emailString) => {
    const emails = emailString.split(",").map((email) => email.trim());
    return emails.every((email) => emailRegex.test(email));
  };

  // Handle input changes for To, Cc, and Subject fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData((prevState) => ({ ...prevState, [name]: value }));

    // Validation logic for individual fields
    if (name === "toEmail" && emailRegex.test(value)) {
      setErrors((prevErrors) => ({ ...prevErrors, to: "" }));
    }
    // if (
    //   name === "ccEmail" &&
    //   (emailRegex.test(value) || validateEmails(value))
    // ) {
    //   setErrors((prevErrors) => ({ ...prevErrors, cc: "" }));
    // }
    if (name === "subject" && value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, subject: "" }));
    }
  };

  // Handle email body change and validation
  const handleBodyChange = (value) => {
    setEmailData((prevState) => ({ ...prevState, emailBody: value }));

    // Remove error if the email body is not empty
    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, body: "" }));
    }
  };

  const handleSend = () => {
    let isValid = true;
    const newErrors = { to: "", cc: "", subject: "", body: "" };

    // Check "To" field (single email)
    if (!emailData.toEmail || !emailRegex.test(emailData.toEmail)) {
      newErrors.to = "Please enter a valid single email address.";
      isValid = false;
    }

    // Check "Cc" field (single email or comma-separated emails)
    // if (
    //   !emailData.ccEmail ||
    //   (!emailRegex.test(emailData.ccEmail) &&
    //     !validateEmails(emailData.ccEmail))
    // ) {
    //   newErrors.cc =
    //     "Please enter a valid single email or comma-separated emails.";
    //   isValid = false;
    // }

    // Check "Subject" field
    if (!emailData.subject.trim()) {
      newErrors.subject = "Subject is required.";
      isValid = false;
    }

    // Check email body
    if (!emailData.emailBody.trim()) {
      newErrors.body = "Email body cannot be empty.";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      const payload = {
        receiver: emailData.toEmail,
        email_list: emailData.ccEmail,
        subject: emailData.subject,
        body: emailData.emailBody,
        attachment: emailData?.attachment || "",
        intUserEnrollId: profileData?.employeeId || 0
      };

      onSendEmail(`${marineBaseUrlPythonAPI}/automation/common_mail_sender`, payload, cb, true);
    }
  };

  const styles = {
    container: {
      width: "100%",
      margin: "auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    header: {
      marginBottom: "20px",
    },
    field: {
      display: "flex",
      alignItems: "center",
      marginBottom: "10px",
    },
    label: {
      width: "70px",
      fontSize: "14px",
      color: "#333",
    },
    input: {
      flexGrow: 1,
      padding: "10px",
      fontSize: "14px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      outline: "none",
      transition: "border-color 0.2s ease",
    },
    error: {
      color: "red",
      fontSize: "12px",
      marginLeft: "70px",
      marginBottom: "10px",
    },
    bodyError: {
      color: "red",
      fontSize: "12px",
    },
    quillContainer: {
      marginBottom: "60px",
    },
    quill: {
      height: "300px",
      borderRadius: "5px",
    },
    footer: {
      display: "flex",
      justifyContent: "flex-end",
      marginTop: "20px",
    },
    button: {
      backgroundColor: "#007bff",
      color: "#fff",
      padding: "10px 20px",
      fontSize: "14px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
  };

  return (
    <>
      {loader && <Loading />}
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.field}>
            <label style={styles.label}>To:</label>
            <input
              type="email"
              name="toEmail"
              placeholder="Recipient's email"
              value={emailData.toEmail}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          {errors.to && <div style={styles.error}>{errors.to}</div>}

          <div style={styles.field}>
            <label style={styles.label}>Cc:</label>
            <input
              type="text"
              name="ccEmail"
              placeholder="Cc (comma-separated emails or single email)"
              value={emailData.ccEmail}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          {errors.cc && <div style={styles.error}>{errors.cc}</div>}

          <div style={styles.field}>
            <label style={styles.label}>Subject:</label>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={emailData.subject}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          {errors.subject && <div style={styles.error}>{errors.subject}</div>}
        </div>

        <div className="text-right mb-5">
          <AttachmentUploaderNew
            isExistAttachment={emailData.attachment}
            fileUploadLimits={1}
            CBAttachmentRes={(attachmentData) => {
              if (Array.isArray(attachmentData)) {
                setEmailData((prevState) => ({
                  ...prevState,
                  attachment: attachmentData[0]?.id || "",
                }));
              }
            }}
          />
        </div>

        <div style={styles.quillContainer}>
          <ReactQuill
            value={emailData.emailBody}
            onChange={handleBodyChange}
            style={styles.quill}
            placeholder="Write here..."
          />
        </div>
        {errors.body && <div style={styles.bodyError}>{errors.body}</div>}

        <div className="" style={styles.footer}>
          <button
            className="btn btn-primary"
            onClick={handleSend}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor =
                styles.buttonHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor = styles.button.backgroundColor)
            }
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default EmailEditorForPublicRoutes;
