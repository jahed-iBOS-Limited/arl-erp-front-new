import React, { useEffect } from "react";
import { useState } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../_helper/_viewModal";
import ViewRowItem from "./View";

export default function SubmittedRow({ code }) {
  const [gridList, getGridList] = useAxiosGet();
  const [currentRowId, setCurrentRowId] = useState(null);
  const [isShowRowItemModal, setIsShowRowItemModal] = useState(false);
  const [item, setItem] = useState({});

  useEffect(() => {
    getGridList(
      `/asset/LandingView/GetRenewalInfoByRenewalCode?RenewalCode=${code?.renewalCode}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <div className="text-center mt-2">
        <strong>Code : {code?.renewalCode}</strong>
      </div>
      <div className="table-responsive mt-5">
        <table className="table table-striped table-bordered global-table mt-0">
          <thead>
            <tr>
              <th>SL</th>
              <th>Asset Name</th>
              <th>Service Name</th>
              <th>Renewal Date</th>
              <th>Validity Date</th>
              <th>Next Renewal Date</th>
              <th>Amount</th>
              <th className="text-right pr-1" style={{ width: 80 }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {gridList?.length
              ? gridList?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td>{item?.strAssetName}</td>
                      <td>{item?.renewalServiceName}</td>
                      <td className="text-center">
                        {item?.dteRenewalDate &&
                          _dateFormatter(item?.dteRenewalDate)}
                      </td>
                      <td className="text-center">
                        {item?.dteValidityDate &&
                          _dateFormatter(item?.dteValidityDate)}
                      </td>
                      <td className="text-center">
                        {item?.dteValidityDate &&
                          _dateFormatter(item?.dteNextRenewalDate)}
                      </td>
                      <td className="text-center">{item?.numTotalAmount}</td>

                      <td className="text-center">
                        <div className="d-flex align-items-center justify-content-center">
                          <span className="mx-1">
                            <IView
                              clickHandler={(e) => {
                                setCurrentRowId(item?.renewalId);
                                setIsShowRowItemModal(true);
                                setItem(item);
                              }}
                            />
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              : null}
          </tbody>
        </table>
        <div>
          <IViewModal
            show={isShowRowItemModal}
            onHide={() => {
              setIsShowRowItemModal(false);
              setCurrentRowId(null);
              setItem({});
            }}
            title="Renewal Attribute View"
          >
            <ViewRowItem currentRowId={currentRowId} item={item} />
          </IViewModal>
        </div>
      </div>
    </>
  );
}
