import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { marineBaseUrlPythonAPI } from '../../../../../App';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import EmailTemplate from '../../utils/emailTemplate';
import {
  initialStateOfEmailData,
  initialStateOfError,
} from '../../utils/helper';

const EmailEditor = ({ emailEditorProps }) => {
  const { intId, singleRowData, cb } = emailEditorProps;

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [emailData, setEmailData] = useState(initialStateOfEmailData);

  const [errors, setErrors] = useState(initialStateOfError);

  const [, getEmailInfo, loading] = useAxiosPost();
  const [, onSendEmail, loader] = useAxiosPost();

  useEffect(() => {
    if (singleRowData?.actionType === 'SEND MAIL') {
      setEmailData({
        ...emailData,
        toEmail: singleRowData?.strEmail || '',
      });
    } else {
      if (intId) {
        const payload = {
          intId: intId,
          intUserEnrollId: profileData?.employeeId || 0,
        };

        getEmailInfo(
          `${marineBaseUrlPythonAPI}/automation/agency_appointment_portwise_mail_format`,
          payload,
          (data) => {
            setEmailData({
              toEmail: data?.receiver || '',
              ccEmail: data?.email.join(', ') || '',
              subject: data?.subject || '',
              emailBody: data?.body || '',
            });
          },
          false
        );
      }
    }
  }, [intId, singleRowData]);

  // Regular expression to validate a single email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Function to validate multiple email addresses separated by commas
  const validateEmails = (emailString) => {
    const emails = emailString.split(',').map((email) => email.trim());
    return emails.every((email) => emailRegex.test(email));
  };

  // Handle input changes for To, Cc, and Subject fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData((prevState) => ({ ...prevState, [name]: value }));

    // Validation logic for individual fields
    if (name === 'toEmail' && emailRegex.test(value)) {
      setErrors((prevErrors) => ({ ...prevErrors, to: '' }));
    }
    if (
      name === 'ccEmail' &&
      (emailRegex.test(value) || validateEmails(value))
    ) {
      setErrors((prevErrors) => ({ ...prevErrors, cc: '' }));
    }
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
    if (
      !emailData.ccEmail ||
      (!emailRegex.test(emailData.ccEmail) &&
        !validateEmails(emailData.ccEmail))
    ) {
      newErrors.cc =
        'Please enter a valid single email or comma-separated emails.';
      isValid = false;
    }

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
        body: emailData.emailBody,
        intId: intId,
        attachment: emailData?.attachment || '',
        intUserEnrollId: profileData?.employeeId || 0,
      };

      onSendEmail(
        `${marineBaseUrlPythonAPI}/automation/agency_appointment_portwise_mail_sent`,
        payload,
        cb,
        true
      );
    }
  };

  return (
    <EmailTemplate
      loading={loading || loader}
      emailData={emailData}
      handleInputChange={handleBodyChange}
      handleBodyChange={handleBodyChange}
      handleSend={handleSend}
      errors={errors}
      setEmailData={setEmailData}
    />
  );
};

export default EmailEditor;
