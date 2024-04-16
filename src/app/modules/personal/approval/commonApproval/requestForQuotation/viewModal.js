import React, { useEffect } from "react";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";

export function ApprovalModal({
  currentRowData,
  approveSubmitlHandler,
  rejectSubmitlHandler,
}) {
  const [viewData, getViewData, loader, setViewData] = useAxiosGet();

  useEffect(() => {
    getViewData(
      `/procurement/RequestForQuotation/GetRequestForQuotationById?RequestForQuotationId=${currentRowData?.transectionId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRowData]);
  return (
    <div>
      {loader && <Loading />}
      <div className="row">
        <div className="col-lg-12">
          <div className="global-form">
            <div className="row d-flex justify-content-between align-items-center">
              <div className="col-lg-9">
                <h1>{currentRowData?.csType}</h1>
              </div>
              <div className="col-lg-3">
                <div className="d-flex justify-content-end ">
                  <button
                    type="button"
                    className="approvalButton btn btn-primary"
                    onClick={() =>
                      approveSubmitlHandler({
                        currentRowData,
                        data: viewData?.supplierRow,
                      })
                    }
                    disabled={
                      currentRowData?.csType !== "Item Wise CS" &&
                      !viewData?.supplierRow?.some((item) => item?.isSelect)
                    }
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    className="approvalButton btn btn-primary mr-1 ml-3"
                    onClick={() =>
                      rejectSubmitlHandler({
                        currentRowData,
                        data: viewData?.supplierRow,
                      })
                    }
                    disabled={
                      currentRowData?.csType !== "Item Wise CS" &&
                      !viewData?.supplierRow?.some((item) => item?.isSelect)
                    }
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              {currentRowData?.csType !== "Item Wise CS" ? (
                <th style={{ width: "20px" }}>
                  <input
                    type="checkbox"
                    id="parent"
                    checked={
                      viewData?.supplierRow?.every((item) => item?.isSelect) ||
                      false
                    }
                    onChange={(e) => {
                      const data = [...viewData?.supplierRow];
                      const modifyData = data?.map((item) => ({
                        ...item,
                        isSelect: e.target.checked,
                      }));
                      setViewData({ ...viewData, supplierRow: modifyData });
                    }}
                    disabled
                  />
                </th>
              ) : null}
              <th>SL</th>
              <th>Business Partner Name</th>
              <th>Contact</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {viewData?.supplierRow?.length > 0 &&
              viewData?.supplierRow?.map((item, i) => (
                <tr>
                  {currentRowData?.csType !== "Item Wise CS" ? (
                    <td>
                      <input
                        id="isSelect"
                        type="checkbox"
                        value={item?.isSelect}
                        checked={item?.isSelect || false}
                        onChange={(e) => {
                          const data = [...viewData?.supplierRow];
                          const modifyData = data.map((item, index) => {
                            if (i === index) {
                              return { ...item, isSelect: e.target.checked };
                            } else {
                              return { ...item, isSelect: false };
                            }
                          });
                          setViewData({ ...viewData, supplierRow: modifyData });
                        }}
                        
                      />
                    </td>
                  ) : null}
                  <td className="text-center">{i + 1}</td>
                  <td>
                    <span className="pl-2">{item.businessPartnerName}</span>
                  </td>
                  <td>
                    <span className="pl-2">{item.contactNumber}</span>
                  </td>
                  <td>
                    <span className="pl-2">{item.businessPartnerAddress}</span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
