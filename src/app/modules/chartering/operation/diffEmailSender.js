import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import formatEmailsDynamically, { getEmailInfoandSendMail } from "./helper";
import { marineBaseUrlPythonAPI } from "../../../App";
import useAxiosPost from "../../_helper/customHooks/useAxiosPost";
import Loading from "../../_helper/_loading";
import AttachmentUploaderNew from "../../_helper/attachmentUploaderNew";

// const eee = {
//     "body": "<!DOCTYPE html>\n        <html lang=\"en\">\n        <head>\n            <meta charset=\"UTF-8\">\n            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n            <title>Akij Shipping Lines Ltd (ASLL)</title>\n            <style>\n                body {\n                    font-family: Arial, sans-serif;\n                    font-size: 11px;\n                    line-height: 1.6;\n                    margin: 20px;\n                }\n                .email-container {\n                    margin: 0 auto;\n                }\n                .header {\n                    font-weight: bold;\n                    margin-bottom: 20px;\n                }\n                .content {\n                    margin-bottom: 20px;\n                }\n                .content p {\n                    margin: 5px 0;\n                }\n                .details {\n                    margin-bottom: 20px;\n                }\n                .details p {\n                    margin: 5px 0;\n                }\n                .footer {\n                    margin-top: 20px;\n                    padding-top: 10px;\n                    border-top: 1px solid #ccc;\n                }\n                .footer p {\n                    margin: 5px 0;\n                }\n                .footer .contact-info {\n                    margin-top: 10px;\n                }\n                .footer .contact-info p {\n                    margin: 2px 0;\n                }\n                a {\n                    color: #0000EE;\n                    text-decoration: none;\n                }\n                a:hover {\n                    text-decoration: underline;\n                }\n            </style>\n        </head>\n        <body>\n            <div class=\"email-container\">\n                <div class=\"header\">\n                    2024-09-19T13:00:25.353780Z\n                </div>\n                <div class=\"content\">\n                    <p>Dear Concern, Good day. Greetings from AKIJ SHIPPING LINE LIMITED.<br>Hope this mail finds you well.</p>\n                    <p>We are inviting you to offer your best quotation for the PDA for AKIJ OCEAN to load at the CHITTAGONG for 124 Mts of Limestone</p>\n                    <p>Please submit in this form: <a href=\"https://erp.ibos.io/chartering/operation/epdaLoadPort/create/52/VDS092024784\">Please fill Form</a></p>\n                    <p>Vessel’s itinerary: MV. AKIJ OCEAN \r\n\r\nEX NMAE: AEOLOS\r\n\r\nDWT: 45,736 MT ON 11.62 M DRAFT\r\n\r\nTYPE OF VESSEL: SINGLE DECK GEARED BULK CARRIER \r\n\r\nIMO NO: 9138862, CALL SIGN: 3FHW2 \r\n\r\nBUILT/ BUILDER: 1997 / TSUNEISHI, JAPAN \r\n\r\nFLAG/ REGISTRY/ CLASS: PANAMA/PANAMA/NKK \r\n\r\nP & I CLUB: SKULD \r\n\r\nLOA / LBP: 185.74 M / 177.00 M \r\n\r\nBEAM / DEPTH: 30.40 M / 16.50 M \r\n\r\nGRT / NRT: 25,982 / 14,834 </p>\n                </div>\n                <p>Best Regards,</p>\n                <p>XXXXXXXX</p>\n                <p>[Designation]</p>\n                <div class=\"footer\">\n                    <div class=\"contact-info\">\n                        <p>📞 [Phone Number], 📧 [Email]</p>\n                        <p>🏢 Akij House, 198 Bir Uttam Mir Shawkat Sarak, Tejgaon, Dhaka-1208, Bangladesh</p>\n                        <p>🏢 Level 19, Room-08, Singapore Land Tower, 50 Raffles Place, Singapore 048623</p>\n                    </div>\n                </div>\n            </div>\n        </body>\n        </html>",
//     "email": [
//         [
//             "emdad@ibos.io",
//             "emdad1@ibos.io",
//             "emdad2@ibos.io"
//           ],
//       [
//         "mahedi@ibos.io",
//         "emdad@ibos.io",
//         "ibrahim@ibos.io"
//       ],
//       [
//         "sakib@ibos.io",
//         "emdad@ibos.io",
//         "ibrahim@ibos.io"
//       ]
//     ],
//     "receiver": "tanvir@ibos.io,emdad@ibos.io",
//     "subject": "#VDS092024784 RFQ for PDA for AKIJ OCEAN // Limestone // 124 // CHITTAGONG"
//   }

const DiffEmailSender = ({ emailEditorProps }) => {
  const { intId, singleRowData, cb } = emailEditorProps;

  const [emailData, setEmailData] = useState({
    toEmail: "",
    ccEmail: "",
    subject: "",
    emailBody: "",
    attachment: "",
  });

  console.log("emailData", emailData)

  const [errors, setErrors] = useState({
    to: "",
    cc: "",
    subject: "",
    body: "",
  });

  const [, getEmailInfo, loading] = useAxiosPost();
  const [, onSendEmail, loader] = useAxiosPost();

  useEffect(() => {
    if (intId) {
      const payload = {
        intId: intId,
      };

    //   setEmailData({
    //             toEmail: eee?.receiver.replace(/,/g, ' | ') || "",
    //             ccEmail: formatEmailsDynamically(eee?.email) || "",
    //             subject: eee?.subject || "",
    //             emailBody: eee?.body || "",
    //           });

      getEmailInfo(
        `${marineBaseUrlPythonAPI}${getEmailInfoandSendMail(singleRowData?.columnName)?.emailInfoUrl}`,
        payload,
        (data) => {
          setEmailData({
            toEmail: data?.receiver?.replace(/,/g, ' | ') || "",
            ccEmail: formatEmailsDynamically(data?.email) || "",
            subject: data?.subject || "",
            emailBody: data?.body || "",
          });
        },
        false
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intId]);

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
    if (
      name === "ccEmail" &&
      (emailRegex.test(value) || validateEmails(value))
    ) {
      setErrors((prevErrors) => ({ ...prevErrors, cc: "" }));
    }
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
    if (
      !emailData.ccEmail ||
      (!emailRegex.test(emailData.ccEmail) &&
        !validateEmails(emailData.ccEmail))
    ) {
      newErrors.cc =
        "Please enter a valid single email or comma-separated emails.";
      isValid = false;
    }

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
        intId: intId,
        attachment: emailData?.attachment || "",
      };

      onSendEmail(
        `${marineBaseUrlPythonAPI}${getEmailInfoandSendMail(singleRowData?.columnName)?.sendEmailUrl}`,
        payload,
        cb,
        true
      );
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
      {(loading || loader) && <Loading />}
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

export default DiffEmailSender;
