import React from "react";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import IDelete from "./../../../../_helper/_helperIcons/_delete";

function RowTable({ propsObj }) {
  const { rowDto, setRowDto, values, transactionTypeDDL, isView } = propsObj;
  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered global-table">
        {values?.channel?.value === 1 && (
          <Building
            rowDto={rowDto}
            setRowDto={setRowDto}
            isView={isView}
            values={values}
          />
        )}
        {values?.channel?.value === 2 && (
          <Bulk
            rowDto={rowDto}
            setRowDto={setRowDto}
            transactionTypeDDL={transactionTypeDDL}
            isView={isView}
            values={values}
          />
        )}
        {values?.channel?.value === 3 && (
          <Retail
            rowDto={rowDto}
            setRowDto={setRowDto}
            isView={isView}
            values={values}
          />
        )}
      </table>
    </div>
  );
}

export default RowTable;

function Building({ rowDto, setRowDto, isView, values }) {
  return (
    <>
      <thead>
        <tr>
          <th
            style={{
              width: "30px",
            }}
          >
            SL
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            Product
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            Mill Rate
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            Avg. Transport Fare
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            Landing Rate (Mill)
          </th>
          {[144]?.includes(values?.businessUnit?.value) &&
            [2]?.includes(values?.channel?.value) && (
              <th
                style={{
                  width: "120px",
                }}
              >
                Landing Rate (Mkt)
              </th>
            )}
          <th
            style={{
              width: "120px",
            }}
          >
            Avg. Market Offer
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            Remarks
          </th>
          {!isView && (
            <th
              style={{
                width: "80px",
              }}
            >
              Action
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {rowDto?.map((item, index) => {
          return (
            <tr key={index}>
              <td className="text-center"> {index + 1}</td>
              <td>{item?.strDisplayName}</td>
              <td className="text-right">
                {isView ? (
                  item?.numMillRate
                ) : (
                  <InputField
                    style={{ minWidth: "90px" }}
                    value={item?.numMillRate}
                    placeholder="Mill Rate"
                    name="numMillRate"
                    type="number"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].numMillRate = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                )}
              </td>
              <td className="text-right">
                {isView ? (
                  item?.numAvgTransportFare
                ) : (
                  <InputField
                    style={{ minWidth: "90px" }}
                    value={item?.numAvgTransportFare}
                    placeholder="Avg. Transport Fare"
                    name="numAvgTransportFare"
                    type="number"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].numAvgTransportFare = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                )}
              </td>
              <td className="text-right">
                {isView ? (
                  item?.numLandingRate
                ) : (
                  <InputField
                    style={{ minWidth: "90px" }}
                    value={item?.numLandingRate}
                    placeholder="Landing Rate (Mill)"
                    name="numLandingRate"
                    type="number"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].numLandingRate = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                )}
              </td>
              {[144]?.includes(values?.businessUnit?.value) &&
                [2]?.includes(values?.channel?.value) && (
                  <td className="text-right">
                    {isView ? (
                      item?.numLandingRateMkt
                    ) : (
                      <InputField
                        style={{ minWidth: "90px" }}
                        value={item?.numLandingRateMkt}
                        placeholder="Landing Rate (Mkt)"
                        name="numLandingRateMkt"
                        type="number"
                        onChange={(e) => {
                          const copyRowDto = [...rowDto];
                          copyRowDto[index].numLandingRateMkt = e.target.value;
                          setRowDto(copyRowDto);
                        }}
                      />
                    )}
                  </td>
                )}
              <td className="text-right">
                {isView ? (
                  item?.numAvgMarketOffer
                ) : (
                  <InputField
                    style={{ minWidth: "90px" }}
                    value={item?.numAvgMarketOffer}
                    placeholder="Avg. Market Offer"
                    name="numAvgMarketOffer"
                    type="number"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].numAvgMarketOffer = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                )}
              </td>
              <td>
                {isView ? (
                  item?.strRemarks
                ) : (
                  <InputField
                    style={{ minWidth: "90px" }}
                    value={item?.strRemarks}
                    placeholder="Avg. Market Offer"
                    name="strRemarks"
                    type="text"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].strRemarks = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                )}
              </td>
              {!isView && (
                <td>
                  <div className="d-flex justify-content-center align-items-center">
                    <span
                      onClick={() => {
                        const copyRowDto = [...rowDto];
                        copyRowDto.splice(index, 1);
                        setRowDto(copyRowDto);
                      }}
                    >
                      <IDelete />
                    </span>
                  </div>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </>
  );
}
function Bulk({ rowDto, setRowDto, transactionTypeDDL, isView, values }) {
  return (
    <>
      <thead>
        <tr>
          <th
            style={{
              width: "30px",
            }}
          >
            SL
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            Product
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            Mill Rate
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            Market Price
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            Market Name
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            Delivery Point
          </th>
          <th
            style={{
              width: "132px",
            }}
          >
            Transaction Type
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            Avg. Transport Fare
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            Landing Rate (Mill)
          </th>
          {[144]?.includes(values?.businessUnit?.value) &&
            [2]?.includes(values?.channel?.value) && (
              <th
                style={{
                  width: "120px",
                }}
              >
                Landing Rate (Mkt)
              </th>
            )}
          <th
            style={{
              width: "120px",
            }}
          >
            Avg. Market Offer
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            Remarks
          </th>
          {isView ? null : (
            <th
              style={{
                width: "80px",
              }}
            >
              Action
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {rowDto?.map((item, index) => {
          return (
            <tr key={index}>
              <td className="text-center"> {index + 1}</td>
              <td>{item?.strDisplayName}</td>
              <td className="text-right">
                {isView ? (
                  item?.numMillRate
                ) : (
                  <InputField
                    style={{ minWidth: "90px" }}
                    value={item?.numMillRate}
                    placeholder="Mill Rate"
                    name="numMillRate"
                    type="number"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].numMillRate = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                )}
              </td>

              <td className="text-right">
                {isView ? (
                  item?.numMktRate
                ) : (
                  <InputField
                    style={{ minWidth: "90px" }}
                    value={item?.numMktRate}
                    placeholder="Market Price"
                    name="numMktRate"
                    type="number"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].numMktRate = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                )}
              </td>
              <td>
                {isView ? (
                  item?.strMarketName
                ) : (
                  <InputField
                    style={{ minWidth: "90px" }}
                    value={item?.strMarketName}
                    placeholder="Market Name"
                    name="strMarketName"
                    type="text"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].strMarketName = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                )}
              </td>
              <td>
                {isView ? (
                  item?.strDeliveryPoint
                ) : (
                  <InputField
                    style={{ minWidth: "90px" }}
                    value={item?.strDeliveryPoint}
                    placeholder="Delivery Point"
                    name="strDeliveryPoint"
                    type="text"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].strDeliveryPoint = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                )}
              </td>

              <td>
                {isView ? (
                  item?.strTransactionType
                ) : (
                  <NewSelect
                    name="transactionType"
                    options={transactionTypeDDL || []}
                    value={
                      item?.numTransactionTypeId
                        ? {
                            value: item?.numTransactionTypeId,
                            label: item?.strTransactionType,
                          }
                        : ""
                    }
                    onChange={(valueOption) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].numTransactionTypeId =
                        valueOption?.value;
                      copyRowDto[index].strTransactionType = valueOption?.label;
                      setRowDto(copyRowDto);
                    }}
                    menuPosition="fixed"
                  />
                )}
              </td>
              <td className="text-right">
                {isView ? (
                  item?.numAvgTransportFare
                ) : (
                  <InputField
                    style={{ minWidth: "90px" }}
                    value={item?.numAvgTransportFare}
                    placeholder="Avg. Transport Fare"
                    name="numAvgTransportFare"
                    type="number"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].numAvgTransportFare = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                )}
              </td>
              <td className="text-right">
                {isView ? (
                  item?.numLandingRate
                ) : (
                  <InputField
                    style={{ minWidth: "90px" }}
                    value={item?.numLandingRate}
                    placeholder="Landing Rate (Mill)"
                    name="numLandingRate"
                    type="number"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].numLandingRate = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                )}
              </td>
              {[144]?.includes(values?.businessUnit?.value) &&
                [2]?.includes(values?.channel?.value) && (
                  <td className="text-right">
                    {isView ? (
                      item?.numLandingRateMkt
                    ) : (
                      <InputField
                        style={{ minWidth: "90px" }}
                        value={item?.numLandingRateMkt}
                        placeholder="Landing Rate (Mkt)"
                        name="numLandingRateMkt"
                        type="number"
                        onChange={(e) => {
                          const copyRowDto = [...rowDto];
                          copyRowDto[index].numLandingRateMkt = e.target.value;
                          setRowDto(copyRowDto);
                        }}
                      />
                    )}
                  </td>
                )}
              <td className="text-right">
                {isView ? (
                  item?.numAvgMarketOffer
                ) : (
                  <InputField
                    style={{ minWidth: "90px" }}
                    value={item?.numAvgMarketOffer}
                    placeholder="Avg. Market Offer"
                    name="numAvgMarketOffer"
                    type="number"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].numAvgMarketOffer = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                )}
              </td>
              <td>
                {isView ? (
                  item?.strRemarks
                ) : (
                  <InputField
                    style={{ minWidth: "90px" }}
                    value={item?.strRemarks}
                    placeholder="Avg. Market Offer"
                    name="strRemarks"
                    type="text"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].strRemarks = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                )}
              </td>
              {isView ? null : (
                <td>
                  <div className="d-flex justify-content-center align-items-center">
                    <span
                      onClick={() => {
                        const copyRowDto = [...rowDto];
                        copyRowDto.splice(index, 1);
                        setRowDto(copyRowDto);
                      }}
                    >
                      <IDelete />
                    </span>
                  </div>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </>
  );
}
function Retail({ rowDto, setRowDto, isView, values }) {
  return (
    <>
      <thead>
        <tr>
          <th
            style={{
              width: "30px",
            }}
          >
            SL
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            Product
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            DP
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            TP
          </th>

          <th
            style={{
              width: "120px",
            }}
          >
            MRP
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            EDP
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            ETP
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            Avg. Market Offer
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            Remarks
          </th>
          {isView ? null : (
            <th
              style={{
                width: "80px",
              }}
            >
              Action
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {rowDto?.map((item, index) => {
          return (
            <tr key={index}>
              <td className="text-center"> {index + 1}</td>
              <td>{item?.strDisplayName}</td>
              <td className="text-right">
                {isView ? (
                  item?.numDp
                ) : (
                  <InputField
                    style={{ minWidth: "90px" }}
                    value={item?.numDp}
                    placeholder="DP"
                    name="numDp"
                    type="number"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].numDp = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                )}
              </td>

              <td className="text-right">
                {isView ? (
                  item?.numTp
                ) : (
                  <InputField
                    style={{ minWidth: "90px" }}
                    value={item?.numTp}
                    placeholder="TP"
                    name="numTp"
                    type="number"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].numTp = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                )}
              </td>
              <td className="text-right">
                {isView ? (
                  item?.numMrp
                ) : (
                  <InputField
                    style={{ minWidth: "90px" }}
                    value={item?.numMrp}
                    placeholder="MRP"
                    name="numMrp"
                    type="number"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].numMrp = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                )}
              </td>
              <td className="text-right">
                {isView ? (
                  item?.numEdp
                ) : (
                  <InputField
                    style={{ minWidth: "90px" }}
                    value={item?.numEdp}
                    placeholder="EDP"
                    name="numEdp"
                    type="number"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].numEdp = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                )}
              </td>

              <td className="text-right">
                {isView ? (
                  item?.numEtp
                ) : (
                  <InputField
                    style={{ minWidth: "90px" }}
                    value={item?.numEtp}
                    placeholder="ETP"
                    name="numEtp"
                    type="number"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].numEtp = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                )}
              </td>
              <td className="text-right">
                {isView ? (
                  item?.numAvgMarketOffer
                ) : (
                  <InputField
                    style={{ minWidth: "90px" }}
                    value={item?.numAvgMarketOffer}
                    placeholder="Avg. Market Offer"
                    name="numAvgMarketOffer"
                    type="number"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].numAvgMarketOffer = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                )}
              </td>
              <td>
                {isView ? (
                  item?.strRemarks
                ) : (
                  <InputField
                    style={{ minWidth: "90px" }}
                    value={item?.strRemarks}
                    placeholder="Avg. Market Offer"
                    name="strRemarks"
                    type="text"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].strRemarks = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                )}
              </td>
              {isView ? null : (
                <td>
                  <div className="d-flex justify-content-center align-items-center">
                    <span
                      onClick={() => {
                        const copyRowDto = [...rowDto];
                        copyRowDto.splice(index, 1);
                        setRowDto(copyRowDto);
                      }}
                    >
                      <IDelete />
                    </span>
                  </div>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </>
  );
}
