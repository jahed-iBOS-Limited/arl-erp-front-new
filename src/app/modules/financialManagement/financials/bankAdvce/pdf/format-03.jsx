import React from 'react';
import { dateFormatWithMonthName } from '../../../../_helper/_dateFormate';
import numberWithCommas from '../../../../_helper/_numberWithCommas';

const FormatThree = ({
  values,
  selectedBusinessUnit,
  adviceReportData,
  total,
  totalInWords,
  APIUrl,
  fontSize,
  subjectTitle,
}) => {
  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center my-3">
        <div
          style={{
            position: 'absolute',
            left: '75px',
            top: '0',
          }}
        >
          <img
            style={{ width: '65px' }}
            src={`${APIUrl}/domain/Document/DownlloadFile?id=${selectedBusinessUnit?.imageId}`}
            alt=""
          />
        </div>
        <h1
          style={{
            textDecoration: 'underline',
            fontSize: '14px',
          }}
        >
          {selectedBusinessUnit?.label}
        </h1>
        <h3
          style={{
            textDecoration: 'underline',
            fontSize: '12px',
          }}
        >
          Akij House, 198 Bir Uttam, Gulshan Link Road, Tejgaon, Dhaka-1208.
        </h3>
      </div>
      <div className="salaryAdvice" style={{ marginTop: '30px' }}>
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-between">
            <p style={{ fontSize: '10px' }} className="font-weight-bold">
              To
            </p>
            <p style={{ fontSize: '10px' }} className="font-weight-bold">
              Date: {dateFormatWithMonthName(values?.dateTime)}
            </p>
          </div>
          <p style={{ fontSize: '10px' }} className="font-weight-bold">
            The Manager
          </p>
        </div>
        <p style={{ fontSize: '10px' }} className="font-weight-bold">
          {values?.bankAccountNo?.bankName}
        </p>
        <p style={{ fontSize: '10px' }} className="font-weight-bold">
          {values?.bankAccountNo?.address}
        </p>
        <p
          className="font-weight-bold"
          style={{
            textDecoration: 'underline',
            fontSize: '10px',
          }}
        >
          Subject :{subjectTitle}
        </p>
        <p
          style={{ fontSize: '10px' }}
          className="dearSirSpace font-weight-bold"
        >
          Dear Sir,
        </p>
        <p style={{ fontSize: '10px' }} className="font-weight-bold">
          {`We do hereby requesting you to make
  payment by transferring the amount to the
  respective Account Holder as shown below
  in detailed by debiting our CD Account No.
  ${values?.bankAccountNo?.bankAccNo}`}
        </p>
        <p style={{ fontSize: '10px' }} className="font-weight-bold">
          Detailed particulars of each Account Holder:
        </p>
      </div>
      <table
        className="table table-striped table-bordered  advice-table table-font-size-sm"
        // style={{ width: "100%" }}
      >
        <thead>
          <tr>
            <td
              style={{
                width: '115px',
                border: '1px solid #000',
                textAlign: 'center',
              }}
            >
              Account Name
            </td>
            <td
              style={{
                width: '53px',
                border: '1px solid #000',
                textAlign: 'center',
              }}
            >
              Code No
            </td>
            <td
              style={{
                width: '120px',
                border: '1px solid #000',
                textAlign: 'center',
              }}
            >
              Bank Name
            </td>
            <td
              style={{
                width: '70px',
                border: '1px solid #000',
                textAlign: 'center',
              }}
            >
              Branch Name
            </td>
            <td
              style={{
                width: '50px',
                border: '1px solid #000',
                textAlign: 'center',
              }}
            >
              A/C Type
            </td>
            <td
              style={{
                width: '80px',
                border: '1px solid #000',
                textAlign: 'center',
              }}
            >
              Account No
            </td>
            <td
              style={{
                width: '57px',
                border: '1px solid #000',
                textAlign: 'center',
              }}
            >
              Amount{' '}
            </td>
            <td
              style={{
                width: '70px',
                border: '1px solid #000',
                textAlign: 'center',
              }}
            >
              Payment Info
            </td>
            <td
              style={{
                width: '110px',
                border: '1px solid #000',
                textAlign: 'center',
              }}
            >
              Comments
            </td>
            <td
              style={{
                width: '80px',
                border: '1px solid #000',
                textAlign: 'center',
              }}
            >
              Routing No
            </td>
            <td
              style={{
                width: '80px',
                border: '1px solid #000',
                textAlign: 'center',
              }}
            >
              Instrument No
            </td>
            <td
              style={{
                width: '35px',
                border: '1px solid #000',
                textAlign: 'center',
              }}
            >
              Sl No
            </td>
            <td
              style={{
                border: '1px solid #000',
                textAlign: 'center',
                width: '100px',
              }}
            >
              Debit Account
            </td>
          </tr>
        </thead>

        {/* tbody */}
        <tbody>
          {adviceReportData?.map((itm, index) => {
            return (
              <tr key={index}>
                <td
                  style={{
                    border: '1px solid #000',
                  }}
                  className="text-left"
                >
                  <div
                    className="pl-1"
                    style={{
                      ...(fontSize && { fontSize }),
                    }}
                  >
                    {itm?.strBankAccountName}
                  </div>
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                  }}
                >
                  <div
                    style={{
                      ...(fontSize && { fontSize }),
                    }}
                  >
                    {itm?.strPayeCode}
                  </div>
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                  }}
                >
                  <div
                    className="pl-1"
                    style={{
                      ...(fontSize && { fontSize }),
                    }}
                  >
                    {itm?.strBankName}
                  </div>
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                  }}
                >
                  <div
                    className="pl-1"
                    style={{
                      ...(fontSize && { fontSize }),
                    }}
                  >
                    {itm?.strBankBranchName}
                  </div>
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                  }}
                >
                  <div
                    className="pl-1"
                    style={{
                      ...(fontSize && { fontSize }),
                    }}
                  >
                    {itm?.strBankAccType}
                  </div>
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                  }}
                >
                  <div
                    className="text-right pr-2"
                    style={{
                      ...(fontSize && { fontSize }),
                    }}
                  >
                    <span className="d-none">{` ${'\u200C'} `}</span>
                    <span>{itm?.strBankAccountNo}</span>
                  </div>
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                  }}
                >
                  <div
                    className="text-right pr-2"
                    style={{
                      ...(fontSize && { fontSize }),
                    }}
                  >
                    {numberWithCommas(itm?.numAmount)}
                  </div>
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                  }}
                >
                  <div
                    className="text-left"
                    style={{
                      ...(fontSize && { fontSize }),
                    }}
                  >
                    {itm?.strPaymentReff || 'N/A'}
                  </div>
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                  }}
                >
                  <div
                    className="pl-1"
                    style={{
                      ...(fontSize && { fontSize }),
                    }}
                  >
                    {itm?.strComments}
                  </div>
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                  }}
                >
                  <div
                    className="text-right pr-2"
                    style={{
                      ...(fontSize && { fontSize }),
                    }}
                  >
                    <span className="d-none">{` ${'\u200C'} `}</span>
                    <span>{itm?.strRoutingNumber}</span>
                  </div>
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                  }}
                >
                  <div
                    className="text-left"
                    style={{
                      ...(fontSize && { fontSize }),
                    }}
                  >
                    {itm?.strInstrumentNo}
                  </div>
                </td>
                <td
                  style={{
                    border: '1px solid #000',
                  }}
                >
                  <div
                    className="text-center"
                    style={{
                      ...(fontSize && { fontSize }),
                    }}
                  >
                    {' '}
                    {index + 1}
                  </div>
                </td>

                <td
                  style={{
                    border: '1px solid #000',
                    textAlign: 'center',
                  }}
                >
                  {values?.bankAccountNo?.bankAccNo}
                </td>
              </tr>
            );
          })}
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td
              className="font-weight-bold"
              style={{
                border: '1px solid #000',
                fontWeight: 'bold',
              }}
            >
              <div className="font-weight-bold text-left pl-2 text-right">
                Total
              </div>
            </td>
            <td
              align="right"
              className="font-weight-bold"
              style={{
                border: '1px solid #000',
                fontWeight: 'bold',
              }}
            >
              <div className="font-weight-bold text-right">
                {adviceReportData.length > 0 && numberWithCommas(total)}
              </div>
            </td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            {values?.advice?.info === 'scb' && (
              <td
                style={{
                  border: '1px solid #000',
                  textAlign: 'center',
                }}
              >
                {/* {values?.bankAccountNo?.bankAccNo} */}
              </td>
            )}
          </tr>
        </tbody>
      </table>
      <p
        className="font-weight-bold mt-5"
        style={{
          textTransform: 'capitalize',
          fontSize: '11px',
        }}
      >
        In Word: {adviceReportData.length > 0 && totalInWords} Taka Only
      </p>
      <p className="font-weight-bold" style={{ fontSize: '11px' }}>
        For {selectedBusinessUnit?.label}
      </p>
      <div className="font-weight-bold " style={{ marginTop: '60px' }}>
        <div className="d-flex">
          <h6
            style={{
              marginRight: '50px',
              fontSize: '11px',
            }}
          >
            Authorize Signature
          </h6>
          <h6
            style={{
              marginRight: '50px',
              fontSize: '11px',
            }}
          >
            Authorize Signature
          </h6>
        </div>
      </div>
    </>
  );
};

export default FormatThree;
