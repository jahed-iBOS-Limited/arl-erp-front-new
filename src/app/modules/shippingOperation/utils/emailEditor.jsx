import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { marineBaseUrlPythonAPI } from '../../../../App';
import useAxiosPost from '../../_helper/customHooks/useAxiosPost';
import EmailTemplate from './emailTemplate';
import { generateFileUrl, getEmailInfoandSendMail, initialStateOfEmailData, initialStateOfError } from './helper';

const EmailEditor = ({ emailEditorProps }) => {
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const { intId, singleRowData, cb } = emailEditorProps;

  const [emailData, setEmailData] = useState(initialStateOfEmailData);

  console.log('emailData', emailData);

  const [errors, setErrors] = useState(initialStateOfError);

  const [, getEmailInfo, loading] = useAxiosPost();
  const [, onSendEmail, loader] = useAxiosPost();

  useEffect(() => {
    if (intId) {
      const payload = {
        intId: intId,
        intUserEnrollId: profileData?.employeeId || 0,
      };

      getEmailInfo(
        `${marineBaseUrlPythonAPI}${getEmailInfoandSendMail(singleRowData?.columnName)?.emailInfoUrl
        }`,
        payload,
        (data) => {
          setEmailData({
            toEmail: data?.receiver || '',
            ccEmail: data?.email.join(', ') || '',
            subject: data?.subject || '',
            emailBody: data?.body || '',
          });
        },
        false,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intId]);

  // Regular expression to validate a single email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Handle input changes for To, Cc, and Subject fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData((prevState) => ({ ...prevState, [name]: value }));

    // Validation logic for individual fields
    if (name === 'toEmail' && emailRegex.test(value)) {
      setErrors((prevErrors) => ({ ...prevErrors, to: '' }));
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
        receiver: emailData.toEmail || '',
        email_list: emailData.ccEmail || '',
        subject: emailData.subject || '',
        body: emailData.emailBody || '',
        intId: intId || 0,
        attachment: generateFileUrl(emailData?.attachment || '') || '',
        intUserEnrollId: profileData?.employeeId || 0,
      };

      onSendEmail(
        `${marineBaseUrlPythonAPI}${getEmailInfoandSendMail(singleRowData?.columnName)?.sendEmailUrl
        }`,
        payload,
        cb,
        true,
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
