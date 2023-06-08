/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { sendEmailPostApi } from "../helper";

export default function ViewForm({
  subject,
  setSubject,
  message,
  setMessage,
  values,
  setIsShowModal,
}) {
  // const [data, setData] = useState([]);
  const [toMail, settoMail] = useState("");
  const [toCC, settoCC] = useState("");
  const [toBCC, settoBCC] = useState("");

  const [attachment, setAttachment] = useState("");

  function sendEmail(e) {
    sendEmailPostApi({
      toMail,
      toCC,
      toBCC,
      subject,
      message,
      attachment,
    }).then(() => {
      settoMail("");
      settoCC("");
      settoBCC("");
      setSubject("");
      setMessage("");
      setAttachment("");
    });
    e.preventDefault();
  }

  return (
    <div>
      <div className='container'>
        <form enctype='multipart/form-data' onSubmit={sendEmail}>
          <div className='row pt-5 mx-auto'>
            <div className='col-8 form-group pt-2 mx-auto mt-2'>
              <input
                type='email'
                className='form-control'
                onChange={(e) => settoMail(e.target.value)}
                value={toMail}
                placeholder='To'
                name='email'
              />
            </div>
            <div className='col-8 form-group mx-auto mt-2'>
              <input
                type='text'
                className='form-control'
                onChange={(e) => settoCC(e.target.value)}
                value={toCC}
                placeholder='CC'
                name='cc'
              />
            </div>
            <div className='col-8 form-group mx-auto mt-2 '>
              <input
                type='text'
                onChange={(e) => settoBCC(e.target.value)}
                value={toBCC}
                className='form-control'
                placeholder='BCC'
                name='bcc'
              />
            </div>
            <div className='col-8 form-group pt-2 mx-auto'>
              <input
                type='text'
                onChange={(e) => setSubject(e.target.value)}
                value={subject}
                className='form-control'
                placeholder='Subject'
                name='subject'
              />
            </div>
            <div className='col-8 form-group pt-2 mx-auto'>
              <textarea
                className='form-control'
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                id=''
                cols='30'
                rows='8'
                placeholder='Your message'
                name='message'
              ></textarea>
            </div>
            <div className='col-8 form-group mx-auto mt-2'>
              <input
                type='file'
                onChange={(e) => setAttachment(e.target.files[0])}
                className='form-control'
                name='my_file'
              />
            </div>
            <div className='col-8 pt-3 mx-auto'>
              <input
                type='submit'
                className='btn btn-primary'
                value='Send Message'
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
