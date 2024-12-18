import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import formatEmailsDynamically, {
  generateFileUrl,
  getEmailInfoandSendMail,
} from './helper';
import { marineBaseUrlPythonAPI } from '../../../App';
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
  const [emailData, setEmailData] = useState({
    toEmail: '',
    ccEmail: '',
    subject: '',
    emailBody: '',
    attachment: '',
  });

  console.log('emailData', emailData);

  const [errors, setErrors] = useState({
    to: '',
    cc: '',
    subject: '',
    body: '',
  });

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

  const styles = {
    container: {
      width: '100%',
      margin: 'auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    },
    header: {
      marginBottom: '20px',
    },
    field: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
    },
    label: {
      width: '70px',
      fontSize: '14px',
      color: '#333',
    },
    input: {
      flexGrow: 1,
      padding: '10px',
      fontSize: '14px',
      borderRadius: '5px',
      border: '1px solid #ccc',
      outline: 'none',
      transition: 'border-color 0.2s ease',
    },
    error: {
      color: 'red',
      fontSize: '12px',
      marginLeft: '70px',
      marginBottom: '10px',
    },
    bodyError: {
      color: 'red',
      fontSize: '12px',
    },
    quillContainer: {
      marginBottom: '60px',
    },
    quill: {
      height: '300px',
      borderRadius: '5px',
    },
    footer: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '20px',
    },
    button: {
      backgroundColor: '#007bff',
      color: '#fff',
      padding: '10px 20px',
      fontSize: '14px',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#0056b3',
    },
  };

  return (
    <>
      {(loading || loader) && <Loading />}
      <div style={styles.container}>
        <div style={styles.header}>
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
          <div style={styles.field}>
            <label style={styles.label}>To:</label>
            <input
              disabled
              type="text"
              name="toEmail"
              // placeholder="Recipient's email (use '|' to separate multiple)"
              value={emailData.toEmail}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          {errors.to && <div style={styles.error}>{errors.to}</div>}

          <div style={styles.field}>
            <label style={styles.label}>Cc:</label>
            <input
              disabled
              type="text"
              name="ccEmail"
              // placeholder="Cc (comma-separated emails or '|' for multiple)"
              value={emailData.ccEmail}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          {/* {errors.cc && <div style={styles.error}>{errors.cc}</div>} */}

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
                  attachment: attachmentData[0]?.id || '',
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
          />
          {errors.body && <div style={styles.bodyError}>{errors.body}</div>}
        </div>

        <div style={styles.footer}>
          <button style={styles.button} onClick={handleSend}>
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
