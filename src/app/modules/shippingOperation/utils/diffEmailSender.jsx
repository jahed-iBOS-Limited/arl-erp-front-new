import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import formatEmailsDynamically, {
  emailTemplateStyles,
  generateFileUrl,
  getEmailInfoandSendMail,
  initialStateOfEmailData,
  initialStateOfError,
} from './helper';
import { marineBaseUrlPythonAPI } from '../../../../App';
import useAxiosPost from '../../_helper/customHooks/useAxiosPost';
import Loading from '../../_helper/_loading';
import AttachmentUploaderNew from '../../_helper/attachmentUploaderNew';
import IViewModal from '../../_helper/_viewModal';
import AddTOCC from './addTOCC';
import { shallowEqual, useSelector } from 'react-redux';

const DiffEmailSender = ({ emailEditorProps }) => {
  const { intId, singleRowData, cb } = emailEditorProps;
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [emailData, setEmailData] = useState(initialStateOfEmailData);

  const [errors, setErrors] = useState(initialStateOfError);

  const [, getEmailInfo, loading] = useAxiosPost();
  const [, onSendEmail, loader] = useAxiosPost();
  const [isShow, setIsShow] = useState(false);
  const [prevEmailList, setPrevEmailList] = useState({
    to: [],
    email_list: [],
  });

  useEffect(() => {
    if (intId) {
      const payload = {
        intId: intId,
        intUserEnrollId: profileData?.employeeId || 0,
      };

      getEmailInfo(
        `${marineBaseUrlPythonAPI}${
          getEmailInfoandSendMail(singleRowData?.columnName)?.emailInfoUrl
        }`,
        payload,
        (data) => {
          setEmailData({
            toEmail: data?.receiver?.replace(/,/g, ' | ') || '',
            ccEmail: formatEmailsDynamically(data?.email) || '',
            subject: data?.subject || '',
            emailBody: data?.body || '',
          });
          setPrevEmailList({
            to: data?.receiver?.length ? data?.receiver?.split(',') : [],
            email_list: data?.email?.length ? data?.email : [],
          });
        },
        false,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intId]);

  // Regular expression to validate a single email address
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Function to validate multiple emails separated by '|'
  const validateToEmails = (emailString) => {
    const emails = emailString.split('|').map((email) => email.trim());
    return emails.every((email) => emailRegex.test(email));
  };

  // Function to validate multiple emails separated by both ',' and '|'
  // const validateCcEmails = (emailString) => {
  //   const emails = emailString.split(/[,|]/).map((email) => email.trim());
  //   return emails.every((email) => emailRegex.test(email));
  // };

  // Handle input changes for To, Cc, and Subject fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmailData((prevState) => ({ ...prevState, [name]: value }));

    // Validation logic for individual fields
    if (
      name === 'toEmail' &&
      (emailRegex.test(value) || validateToEmails(value))
    ) {
      setErrors((prevErrors) => ({ ...prevErrors, to: '' }));
    }
    // if (
    //   name === "ccEmail" &&
    //   (emailRegex.test(value) || validateCcEmails(value))
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

    // Check "To" field (multiple emails separated by |)
    if (!emailData.toEmail || !validateToEmails(emailData.toEmail)) {
      newErrors.to =
        "Please enter at least one valid email. If you add multiple separated by '|'.";
      isValid = false;
    }

    // Check "Cc" field (multiple emails separated by | or ,)
    // if (
    //   !emailData.ccEmail ||
    //   (!emailRegex.test(emailData.ccEmail) &&
    //     !validateCcEmails(emailData.ccEmail))
    // ) {
    //   newErrors.cc =
    //     "Please enter a valid single email or multiple emails separated by ','. If you add for multiple user separated by '|'.";
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
      // Split toEmail into arrays based on '|' character
      const toEmailArray = emailData.toEmail
        .split('|')
        .map((email) => email.trim());

      const ccEmailArray = emailData.ccEmail.split('|').map((cc) => {
        const trimmedCC = cc.trim();
        if (trimmedCC === 'No Emails') {
          return [];
        }
        return trimmedCC.split(',').map((email) => email.trim());
      });

      const email_list = toEmailArray.map((toEmail, index) => {
        const ccEmails = !ccEmailArray[index]?.length
          ? []
          : ccEmailArray[index];
        return [...ccEmails];
      });

      const payload = {
        receiver: toEmailArray.join(', '),
        email_list: JSON.stringify(email_list),
        // email_list: email_list,
        subject: emailData.subject,
        body: emailData.emailBody,
        intId: intId,
        attachment: generateFileUrl(emailData?.attachment || '') || '',
        intUserEnrollId: profileData?.employeeId || 0,
      };

      onSendEmail(
        `${marineBaseUrlPythonAPI}${
          getEmailInfoandSendMail(singleRowData?.columnName)?.sendEmailUrl
        }`,
        payload,
        cb,
        true,
      );
    }
  };

  return (
    <>
      {(loading || loader) && <Loading />}
      <div style={emailTemplateStyles.container}>
        <div style={emailTemplateStyles.header}>
          <div className="text-right">
            <button
              type="button"
              onClick={() => {
                setIsShow(true);
              }}
              className="btn btn-primary mb-3"
            >
              Add Email
            </button>
          </div>
          <div style={emailTemplateStyles.field}>
            <label style={emailTemplateStyles.label}>To:</label>
            <input
              disabled
              type="text"
              name="toEmail"
              // placeholder="Recipient's email (use '|' to separate multiple)"
              value={emailData.toEmail}
              onChange={handleInputChange}
              style={emailTemplateStyles.input}
            />
          </div>
          {errors.to && <div style={emailTemplateStyles.error}>{errors.to}</div>}

          <div style={emailTemplateStyles.field}>
            <label style={emailTemplateStyles.label}>Cc:</label>
            <input
              disabled
              type="text"
              name="ccEmail"
              // placeholder="Cc (comma-separated emails or '|' for multiple)"
              value={emailData.ccEmail}
              onChange={handleInputChange}
              style={emailTemplateStyles.input}
            />
          </div>
          {/* {errors.cc && <div style={emailTemplateStyles.error}>{errors.cc}</div>} */}

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
          {errors.subject && <div style={emailTemplateStyles.error}>{errors.subject}</div>}
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
          />
          {errors.body && <div style={emailTemplateStyles.bodyError}>{errors.body}</div>}
        </div>

        <div style={emailTemplateStyles.footer}>
          <button style={emailTemplateStyles.button} onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
      <div>
        <IViewModal
          show={isShow}
          onHide={() => {
            setIsShow(false);
          }}
        >
          <AddTOCC
            setIsShow={setIsShow}
            setEmailData={setEmailData}
            prevEmailList={prevEmailList}
          />
        </IViewModal>
      </div>
    </>
  );
};

export default DiffEmailSender;
