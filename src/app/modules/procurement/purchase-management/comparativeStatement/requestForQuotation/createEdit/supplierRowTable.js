

import React from "react";
import IDelete from "../../../../../_helper/_helperIcons/_delete";

const SupplierRowTable = ({
  rowDtoTwo,
  removerTwo,
}) => {

  return (
    <div>
      {rowDtoTwo?.length > 0 && (
        <>
        <div className="table-responsive">
          <table className="table table-striped table-bordered mt-3 global-table po-table">
            <thead>
              <tr>
                <th style={{ fontSize: "10px" }}>SL</th>
                <th style={{ fontSize: "10px" }}>Supplier Name</th>
                <th style={{ width: "350px", fontSize: "10px" }}>Supplier Address</th>
                <th style={{ width: "70px", fontSize: "10px" }}>Contact No</th>
                <th style={{ width: "150px", fontSize: "10px" }}>Email</th>
                <th style={{ fontSize: "10px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rowDtoTwo?.map((item, index) => {
                //getUomDDL(item?.item?.value);

                return (
                  <tr key={index}>
                    <td className="text-center align-middle"> {index + 1} </td>
                     <td className="align-middle" style={{ fontSize: "10px" }}>
                        {item?.strBusinessPartnerName || "NA"}
                     </td>
                    <td className="align-middle">{item?.strBusinessPartnerAddress}</td>
                    <td className="align-middle" style={{ fontSize: "10px" }}>
                      {item?.strContactNumber}
                    </td>

                    <td className="text-center align-middle">
                      {item?.strEmail}
                    </td>
                    <td className="text-center align-middle">
                      <IDelete
                        remover={removerTwo}
                        id={item?.intBusinessPartnerId}
                        //id={item}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </>
      )}
    </div>
  );
};

export default SupplierRowTable;
