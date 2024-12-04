import React from 'react';
import IViewModal from '../../../../_helper/_viewModal';
import ICustomCard from '../../../../_helper/_customCard';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import { imarineBaseUrl } from '../../../../../App';
import Loading from '../../../../_helper/_loading';

export default function BankDetailsModal({
  isModalOpen,
  setIsModalOpen,
  selectedItem,
}) {
  const [bankAddressById, GetBankAddressById, isLoading] = useAxiosGet();
  React.useEffect(() => {
    GetBankAddressById(
      `${imarineBaseUrl}/domain/ShippingService/GetGlobalBankById?bankId=${selectedItem?.bankId}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem]);
  return (
    <IViewModal
      title="Bank Details Modal"
      show={isModalOpen}
      onHide={() => {
        setIsModalOpen(false);
      }}
    >
      {isLoading && <Loading />}
      <ICustomCard
        title={'Bank Details'}
        backHandler={() => {
          setIsModalOpen(false);
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          <p>
            Bank Name: <span>{bankAddressById?.bankName}</span>
            <br />
            Primary Address: <span>{bankAddressById?.primaryAddress}</span>
            <br />
            Country: <span>{bankAddressById?.country}</span>
            <br />
            City: <span>{bankAddressById?.city}</span>
            <br />
          </p>
          <p>
            Phone Number: <span>{bankAddressById?.phoneNo}</span>
            <br />
            Email: <span>{bankAddressById?.email}</span>
            <br />
            Website: <span>{bankAddressById?.website}</span>
            <br />
            Swift Code: <span>{bankAddressById?.swiftcode}</span>
            <br />
            Currency: <span>{bankAddressById?.currency}</span>
            <br />
          </p>
        </div>
        {/* gbankAddress table */}
        <div className="table-responsive">
          <table className="table table-bordered global-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Bank Name</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {bankAddressById?.gbankAddress?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.bankName}</td>
                  <td>{item.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ICustomCard>
    </IViewModal>
  );
}
