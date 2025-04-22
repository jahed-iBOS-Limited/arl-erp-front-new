import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Loading from '../../_helper/_loading';
import AttachmentUploaderNew from '../../_helper/attachmentUploaderNew';
import useAxiosPost from '../../_helper/customHooks/useAxiosPost';
import { marineBaseUrlPythonAPI } from '../../../../App';
import { shallowEqual, useSelector } from 'react-redux';
import {
  emailTemplateStyles,
  generateFileUrl,
  initialStateOfEmailData,
  initialStateOfError,
} from './helper';

const EmailEditorForPublicRoutes = ({
  featureName,
  vesselData,
  payloadInfo,
  cb,
}) => {
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [emailData, setEmailData] = useState(initialStateOfEmailData);

  const [errors, setErrors] = useState(initialStateOfError);

  const [, onSendEmail, loader] = useAxiosPost();

  // Function to remove prefixes and convert camelCase to space-separated words
  const cleanKey = (key) => {
    const keyWithoutPrefix = key.replace(/^(str|int|num)/, ''); // Remove prefixes
    return keyWithoutPrefix.replace(/([a-z])([A-Z])/g, '$1 $2'); // Convert camelCase to spaced words
  };

  // Convert payloadInfo to HTML for ReactQuill
  const convertPayloadToHtml = () => {
    let htmlContent = '';

    Object.entries(payloadInfo).forEach(([key, value]) => {
      const cleanedKey = cleanKey(key); // Apply cleaning to the key

      if (typeof value === 'string' && value.startsWith('http')) {
        // If the value is a URL and contains 'id=', create a clickable link
        if (value.includes('id=') && value.split('id=')[1]) {
          htmlContent += `<p><strong>${cleanedKey}:</strong> <a href="${value}" target="_blank">View Document</a></p>`;
        } else {
          htmlContent += `<p><strong>${cleanedKey}:</strong> </p>`;
        }
      } else {
        // Otherwise, just insert the text content
        htmlContent += `<p><strong>${cleanedKey}:</strong> ${value || ''}</p>`;
      }
    });

    return htmlContent;
  };

  useEffect(() => {
    // Initialize the email body with payloadInfo content
    setEmailData((prevState) => ({
      ...prevState,
      toEmail:
        featureName === 'Dead Weight & Pre-Stowage'
          ? 'operation.asll@akijshipping.com'
          : '',
      subject:
        featureName === 'Dead Weight & Pre-Stowage'
          ? `#VDS01020241058 Dead Weight Calculation & Pre-stowage Plan of ${payloadInfo?.strNameOfVessel} // voyage no: ${payloadInfo?.intVoyageNo}`
          : '',
      emailBody: convertPayloadToHtml(),
    }));
  }, [payloadInfo]);

  // Regular expression to validate a single email address
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Handle input changes for To, Cc, and Subject fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData((prevState) => ({ ...prevState, [name]: value }));

    // Validation logic for individual fields
    if (name === 'toEmail' && emailRegex.test(value)) {
      setErrors((prevErrors) => ({ ...prevErrors, to: '' }));
    }
    // if (
    //   name === "ccEmail" &&
    //   (emailRegex.test(value) || validateEmails(value))
    // ) {
    //   setErrors((prevErrors) => ({ ...prevErrors, cc: "" }));
    // }
    if (name === 'subject' && value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, subject: '' }));
    }
  };

  // Handle email body change and validation
  const handleBodyChange = (value) => {
    setEmailData((prevState) => ({ ...prevState, emailBody: value }));

    // Remove error if the email body is not empty
    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, body: '' }));
    }
  };

  const handleSend = () => {
    let isValid = true;
    const newErrors = { to: '', cc: '', subject: '', body: '' };

    // Check "To" field (single email)
    if (!emailData.toEmail || !emailRegex.test(emailData.toEmail)) {
      newErrors.to = 'Please enter a valid single email address.';
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
      newErrors.subject = 'Subject is required.';
      isValid = false;
    }

    // Check email body
    if (!emailData.emailBody.trim()) {
      newErrors.body = 'Email body cannot be empty.';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      const payload = {
        receiver: emailData.toEmail,
        email_list: emailData.ccEmail,
        subject: emailData.subject,
        intVesselId: vesselData?.intVesselId || 0,
        body: emailData.emailBody,
        attachment: generateFileUrl(emailData?.attachment || '') || '',
        intUserEnrollId: profileData?.employeeId || 0,
      };

      if (featureName === 'Dead Weight & Pre-Stowage') {
        onSendEmail(
          `${marineBaseUrlPythonAPI}/automation/pre_stowage_mail_sent_for_master`,
          payload,
          cb,
          true
        );
      } else {
        onSendEmail(
          `${marineBaseUrlPythonAPI}/automation/common_mail_sender`,
          payload,
          cb,
          true
        );
      }
    }
  };

  return (
    <>
      {loader && <Loading />}
      <div style={emailTemplateStyles.container}>
        <div style={emailTemplateStyles.header}>
          <div style={emailTemplateStyles.field}>
            <label style={emailTemplateStyles.label}>To:</label>
            <input
              type="email"
              name="toEmail"
              placeholder="Recipient's email"
              value={emailData.toEmail}
              onChange={handleInputChange}
              style={emailTemplateStyles.input}
            />
          </div>
          {errors.to && (
            <div style={emailTemplateStyles.error}>{errors.to}</div>
          )}

          <div style={emailTemplateStyles.field}>
            <label style={emailTemplateStyles.label}>Cc:</label>
            <input
              type="text"
              name="ccEmail"
              placeholder="Cc (comma-separated emails or single email)"
              value={emailData.ccEmail}
              onChange={handleInputChange}
              style={emailTemplateStyles.input}
            />
          </div>
          {errors.cc && (
            <div style={emailTemplateStyles.error}>{errors.cc}</div>
          )}

          <div style={emailTemplateStyles.field}>
            <label style={emailTemplateStyles.label}>Subject:</label>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={emailData.subject}
              onChange={handleInputChange}
              style={emailTemplateStyles.input}
            />
          </div>
          {errors.subject && (
            <div style={emailTemplateStyles.error}>{errors.subject}</div>
          )}
        </div>

        <div className="text-right mb-5">
          <AttachmentUploaderNew
            isExistAttachment={emailData.attachment}
            fileUploadLimits={1}
            CBAttachmentRes={(attachmentData) => {
              if (Array.isArray(attachmentData)) {
                setEmailData((prevState) => ({
                  ...prevState,
                  attachment: attachmentData[0]?.id || '',
                }));
              }
            }}
          />
        </div>

        <div style={emailTemplateStyles.quillContainer}>
          <ReactQuill
            value={emailData.emailBody}
            onChange={handleBodyChange}
            style={emailTemplateStyles.quill}
            placeholder="Write here..."
          />
        </div>
        {errors.body && (
          <div style={emailTemplateStyles.bodyError}>{errors.body}</div>
        )}

        <div className="" style={emailTemplateStyles.footer}>
          <button
            className="btn btn-primary"
            onClick={handleSend}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor =
                emailTemplateStyles.buttonHover.backgroundColor)
            }
            onMouseOut={(e) =>
              (e.target.style.backgroundColor =
                emailTemplateStyles.button.backgroundColor)
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
