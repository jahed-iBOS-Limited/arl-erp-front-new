import React from "react";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import moment from "moment";
import IViewModal from "./../../../../_helper/_viewModal";
import ViewRegistrationInvoice from "./viewInvoice";

const LandingTable = ({ obj }) => {
  const [isViewModal, setIsViewModal] = React.useState(false);
  const [clickRowData, setClickRowData] = React.useState({});
  const { gridData } = obj;
  const history = useHistory();

  return (
    <div className='table-responsive'>
      <table className='table table-striped table-bordered global-table'>
        <thead>
          <tr>
            <th>SL</th>
            <th>Voyage No</th>
            <th>Vessel Type</th>
            <th>Vessel Name</th>
            <th>Voyage Owne</th>
            <th>Reg</th>
            <th>Custom SL</th>
            <th>Load Port</th>
            <th>Arrived Time</th>
            {/* <th>Cargo Name</th> */}
            <th>Quantity</th>
            <th>Stevedore</th>
            {/* <th>Cargo Own</th> */}
            <th>Remark</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {gridData?.data?.map((item, index) => (
            <tr key={index}>
              <td className='text-center'> {index + 1}</td>
              <td>{item?.voyageNo}</td>
              <td>{item?.vesselType}</td>
              <td>{item?.vesselName}</td>
              <td>{item?.voyageOwnerName}</td>
              <td>{item?.registrationNumber}</td>
              <td>{item?.customSl}</td>
              <td>{item?.loadPortName}</td>
              <td>
                {moment(item?.arrivedDateTime).format("YYYY-DD-MM, hh:mm A")}
              </td>
              {/* <td>{item?.cargoName}</td> */}
              <td>{item?.quantity}</td>
              <td>{item?.stevedore}</td>
              {/* <td>{item?.cargoOwner}</td> */}
              <td>{item?.remarks}</td>
              <td>
                <div
                  className='d-flex justify-content-around'
                  style={{
                    gap: "8px",
                  }}
                >
                  <span
                    onClick={() => {
                      history.push(
                        `/ShippingAgency/Configuration/Registration/edit/${item?.registrationId}`
                      );
                    }}
                  >
                    <IEdit />
                  </span>

                  <span
                    onClick={() => {
                      setIsViewModal(true);
                      setClickRowData(item);
                    }}
                  >
                    <IView />
                  </span>
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
              setIsViewModal(false);
              setClickRowData({});
            }}
          >
            <ViewRegistrationInvoice registrationId={clickRowData?.registrationId}/>
          </IViewModal>
        </>
      )}
    </div>
  );
};

export default LandingTable;
