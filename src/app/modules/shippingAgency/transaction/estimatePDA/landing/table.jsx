import React from 'react';
import { useHistory } from 'react-router-dom';
import IEdit from '../../../../_helper/_helperIcons/_edit';
import IView from '../../../../_helper/_helperIcons/_view';
import IViewModal from '../../../../_helper/_viewModal';
import ViewInvoice from './viewInvoice';
import ViewRegistrationInvoice from '../../../configuration/registration/landing/viewInvoice';

const LandingTable = ({ obj }) => {
  const { gridData } = obj;
  const history = useHistory();
  const [isViewModal, setViewModal] = React.useState(false);
  const [viewClickRowItem, setViewClickRowItem] = React.useState({});
  const [isViewModalReg, setIsViewModalReg] = React.useState(false);

  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th>SL</th>
            <th>SBU</th>
            <th>Vessel</th>
            <th>Voyage No</th>
            <th>Working Port</th>
            <th>Customer Name</th>
            {/* <th>Activity</th> */}
            <th>Currency</th>
            <th>Exchange Rate</th>
            <th>Estimated Amount</th>
            <th>Final Amount</th>
            <th>Actual Amount</th>
            <th
              style={{
                width: '70px',
              }}
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {gridData?.data?.map((item, index) => (
            <tr key={index}>
              <td className="text-center"> {index + 1}</td>
              <td>{item?.sbuName}</td>
              <td>{item?.vesselName}</td>
              <td>{item?.voyageNo}</td>
              <td>{item?.workingPortName}</td>
              <td>{item?.customerName}</td>
              {/* <td>{item?.activity}</td> */}
              <td>{item?.currency}</td>
              <td>{item?.exchangeRate}</td>
              <td>{item?.estimatedAmount}</td>
              <td>{item?.finalAmount}</td>
              <td>{item?.actualAmount}</td>
              <td>
                <div
                  className="d-flex"
                  style={{
                    gap: '8px',
                  }}
                >
                  <span
                    onClick={() => {
                      history.push(
                        `/ShippingAgency/Transaction/EstimatePDA/edit/${item?.estimatePdaid}`
                      );
                    }}
                  >
                    <IEdit />
                  </span>

                  <span
                    onClick={() => {
                      setViewModal(true);
                      setViewClickRowItem(item);
                    }}
                  >
                    <IView />
                  </span>
                  {item?.registrationId ? (
                    <span
                      onClick={() => {
                        setIsViewModalReg(true);
                        setViewClickRowItem(item);
                      }}
                    >
                      <IView title="Registration View" />
                    </span>
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isViewModal && (
        <>
          <IViewModal
            show={isViewModal}
            onHide={() => {
              setViewModal(false);
              setViewClickRowItem({});
            }}
          >
            <ViewInvoice estimatePdaid={viewClickRowItem?.estimatePdaid} />
          </IViewModal>
        </>
      )}
      {isViewModalReg && (
        <>
          <IViewModal
            show={isViewModalReg}
            onHide={() => {
              setIsViewModalReg(false);
              setViewClickRowItem({});
            }}
          >
            <ViewRegistrationInvoice
              registrationId={viewClickRowItem?.registrationId}
            />
          </IViewModal>
        </>
      )}
    </div>
  );
};

export default LandingTable;
