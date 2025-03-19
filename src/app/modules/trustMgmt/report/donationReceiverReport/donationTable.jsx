import React from "react";
import { useDispatch } from "react-redux";
import ICustomTable from "../../../_helper/_customTable";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IView from "../../../_helper/_helperIcons/_view";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";

const header = ["SL", "Application ID", "Registration No", "Application Date", "Account Holder's Name", "Address", "Hospital/Institutes", "Cause Of Donation", "Effective Date", "Expiry Date", "Payment Amount", "Actual Payment Date", "Payment Date", "Attachment"];

const DonationTable = ({ rowDto }) => {
  const dispatch = useDispatch();
  return (
    <>
      <h6 style={{marginBottom: 0, paddingTop: "30px"}}>Information About Donation Receiver:</h6>
      <ICustomTable ths={header}>
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
              <td>{item?.strDonationType}</td>
              <td>{_dateFormatter(item?.dteEffectiveDate)}</td>
              <td>{_dateFormatter(item?.dteEndDate)}</td>
              <td>{item?.monAmount}</td>
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
                        dispatch(getDownlloadFileView_Action(item?.strAttachmentUrl));
                      }}
                    />
                  )}
                </div>
              </td>
            </tr>
          ))}
      </ICustomTable>
    </>
  );
};

export default DonationTable;
