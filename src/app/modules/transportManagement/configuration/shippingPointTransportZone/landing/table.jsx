import React from "react";
import { useHistory } from "react-router-dom";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import PaginationTable from "../../../../_helper/_tablePagination";

export default function Table({ obj }) {
  const {
    values,
    pageNo,
    rowData,
    pageSize,
    setPageNo,
    setPageSize,
    confirmToCancel,
    paginationHandler,
  } = obj;
  const history = useHistory();
  return (
    <div className="row">
      <div className="col-lg-12">
      <div className="table-responsive">
      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
          <thead>
            <tr>
              <th>SL</th>
              <th>Ship Point</th>
              <th>Route Name</th>
              <th>TransPort Zone Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.wareHouseZones?.map((itm, idx) => {
              return (
                <tr key={idx}>
                  <td className="text-center">{idx + 1}</td>
                  <td>{itm?.shipPointName}</td>
                  <td>{itm?.routeName}</td>
                  <td>{itm?.transPortZoneName}</td>
                  <td className="d-flex justify-content-around">
                    <IEdit
                      onClick={(e) => {
                        history.push({
                          pathname: `/transport-management/configuration/shippingpointtransportzone/edit/${itm?.intAutoId}`,
                          state: itm,
                        });
                      }}
                    />
                    <IDelete
                      remover={() => confirmToCancel(itm?.intAutoId, values)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
        {rowData?.wareHouseZones?.length > 0 && (
          <PaginationTable
            count={rowData?.wareHouseZones?.length}
            setPositionHandler={paginationHandler}
            paginationState={{
              pageNo,
              setPageNo,
              pageSize,
              setPageSize,
            }}
            values={values}
          />
        )}
      </div>
    </div>
  );
}
