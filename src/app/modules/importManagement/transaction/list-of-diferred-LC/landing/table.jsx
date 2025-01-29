import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import Loading from "../../../../_helper/_loading";
import ICustomTable from "../../../../_helper/_customTable";
import PaginationTable from "../../../../_helper/_tablePagination";
import NewSelect from "../../../../_helper/_select";

const header = [
  "SL",
  "Unit",
  "Bank",
  "LC No",
  "LC Date",
  "LC Type",
  "Benificiary",
  "Invoice No",
  "Inv Date",
  "Shipment",
  "Acc Date",
  "Start Date",
  "Tenor Days",
  "Mat. Date",
  "Bank Rate",
  "Libor Rate",
  "Invoice Amount",
  "Currency",
];

const ListOfDiferredLC = () => {
  const [gridData] = useState();
  const [isloading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  return (
    <>
      <Card>
        <CardHeader title="List Of Deferred LC"></CardHeader>
        <CardBody>
          {isloading && <Loading />}
          <div className="row">
            <div className="col-lg-2">
              <NewSelect name="unit" label="Unit" placeholder="Unit" />
            </div>
            <div className="col-lg-3">
              <NewSelect name="Bank" label="Bank" placeholder="Bank" />
            </div>
            <div className="col-lg-2 pt-5">
              <button className="btn btn-primary">Show All LC</button>
            </div>
          </div>

          <ICustomTable ths={header}>
            <tr>
              <td style={{ width: "30px" }} className="text-center">
                1
              </td>
              <td>
                <span className="pl-2">Amendment no</span>
              </td>
              <td>
                <span className="pl-2">Reason</span>
              </td>
              <td>
                <span className="pl-2">Date</span>
              </td>
              <td>
                <span className="pl-2">Amendment no</span>
              </td>
              <td>
                <span className="pl-2">Reason</span>
              </td>
              <td>
                <span className="pl-2">Date</span>
              </td>
              <td>
                <span className="pl-2">Amendment no</span>
              </td>
              <td>
                <span className="pl-2">Reason</span>
              </td>
              <td>
                <span className="pl-2">Date</span>
              </td>
              <td>
                <span className="pl-2">Amendment no</span>
              </td>
              <td>
                <span className="pl-2">Reason</span>
              </td>
              <td>
                <span className="pl-2">Date</span>
              </td>
              <td>
                <span className="pl-2">Amendment no</span>
              </td>
              <td>
                <span className="pl-2">Reason</span>
              </td>
              <td>
                <span className="pl-2">Date</span>
              </td>
              <td>
                <span className="pl-2">Reason</span>
              </td>
              <td>
                <span className="pl-2">Date</span>
              </td>
            </tr>
            {/* );
              })} */}
          </ICustomTable>

          {/* Pagination Code */}
          {gridData?.data?.length > 0 && (
            <PaginationTable
              count={gridData?.totalCount}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
            />
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default ListOfDiferredLC;
