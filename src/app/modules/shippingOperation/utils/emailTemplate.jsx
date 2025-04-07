import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { emailTemplateStyles } from './helper';
import Loading from '../../_helper/_loading';
import AttachmentUploaderNew from '../../_helper/attachmentUploaderNew';

const EmailTemplate = ({
  loading,
  emailData,
  handleInputChange,
  handleBodyChange,
  handleSend,
  errors,
  setEmailData,
}) => {
  return (
    <>
      {loading && <Loading />}
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

export default EmailTemplate;
