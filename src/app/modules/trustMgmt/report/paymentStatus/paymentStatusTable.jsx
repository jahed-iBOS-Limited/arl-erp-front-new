import React from "react";
import { useDispatch } from "react-redux";
import ICustomTable from "../../../_helper/_customTable";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _formatMoney } from "../../../_helper/_formatMoney";
import IView from "../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";

const header = [
  "SL",
  "Application ID",
  "Registration No",
  "Application Date",
  "Account Holder's Name",
  "Address",
  "Hospital/Institutes",
  "Cause Of Donation",
  "Effective Date",
  "Expiry Date",
  "Payment Amount",
  "Actual Payment Date",
  "Payment Date",
  "Attachment",
];

const PaymentTable = ({ rowDto }) => {
  const dispatch = useDispatch();
  return (
    <>
      <ICustomTable ths={header} id="payment-status-table-to-xlsx">
        {rowDto?.length > 0 &&
          rowDto?.map((item, index) => (
            <tr className="text-center" key={index}>
              <td>{++index}</td>
              <td>{item?.intApplicationID}</td>
              <td>{item?.strRegistrationNo}</td>
              <td>{_dateFormatter(item?.dteApplicationDate)}</td>
              <td>{item?.strAccountHolderName}</td>
              <td>{item?.strAddress}</td>
              <td>{item?.strOrganizationName}</td>
              <td>{item?.strDonationPurpose}</td>
              <td>{_dateFormatter(item?.dteEffectiveDate)}</td>
              <td>{_dateFormatter(item?.dteEndDate)}</td>
              <td>{_formatMoney(item?.monAmount)}</td>
              <td>{_dateFormatter(item?.dteActualPaymentDate)}</td>
              <td>{_dateFormatter(item?.dtePaymentDate)}</td>
              <td
                style={{
                  verticalAlign: "middle",
                  textAlign: "center",
                }}
              >
                <div className="">
                  {item?.strAttachmentUrl && (
                    <IView
                      clickHandler={() => {
                        dispatch(
                          getDownlloadFileView_Action(item?.strAttachmentUrl)
                        );
                      }}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
        {rowDto?.length > 0 && (
          <tr>
            <td className="text-right pr-2" colSpan={10}>Total Payment Amount :</td>
            <td className="pl-5" colSpan={4}>
              {_formatMoney(rowDto.reduce(
                (total, item, index, array) => total + item?.monAmount,
                0
              ))}
            </td>
          </tr>
        )}
      </ICustomTable>
    </>
  );
};

export default PaymentTable;
