import React from "react";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";

function RowTable({ propsObj }) {
  const { rowDto, setRowDto, values } = propsObj;
  return (
    <div className='table-responsive'>
      <table className='table table-striped table-bordered global-table'>
        {values?.channel?.value === 1 && (
          <Building rowDto={rowDto} setRowDto={setRowDto} />
        )}
        {values?.channel?.value === 2 && (
          <Bulk rowDto={rowDto} setRowDto={setRowDto} />
        )}
        {values?.channel?.value === 3 && (
          <Retail rowDto={rowDto} setRowDto={setRowDto} />
        )}
      </table>
    </div>
  );
}

export default RowTable;

function Building({ rowDto, setRowDto }) {
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
            Landing Rate
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            Avg. Market Office
          </th>
        </tr>
      </thead>
      <tbody>
        {rowDto?.map((item, index) => {
          return (
            <tr key={index}>
              <td className='text-center'> {index + 1}</td>
              <td>{item?.demo}</td>
              <td>
                <InputField
                  value={item?.demo}
                  placeholder='Mill Rate'
                  name='millRate'
                  type='number'
                  onChange={(e) => {
                    const copyRowDto = [...rowDto];
                    copyRowDto[index].millRate = e.target.value;
                    setRowDto(copyRowDto);
                  }}
                />
              </td>
              <td>
                <InputField
                  value={item?.demo}
                  placeholder='Avg. Transport Fare'
                  name='avgTransportFare'
                  type='number'
                  onChange={(e) => {
                    const copyRowDto = [...rowDto];
                    copyRowDto[index].avgTransportFare = e.target.value;
                    setRowDto(copyRowDto);
                  }}
                />
              </td>
              <td>
                <InputField
                  value={item?.demo}
                  placeholder='Landing Rate'
                  name='landingRate'
                  type='number'
                  onChange={(e) => {
                    const copyRowDto = [...rowDto];
                    copyRowDto[index].landingRate = e.target.value;
                    setRowDto(copyRowDto);
                  }}
                />
              </td>
              <td>
                <InputField
                  value={item?.demo}
                  placeholder='Avg. Market Office'
                  name='avgMarketOffice'
                  type='number'
                  onChange={(e) => {
                    const copyRowDto = [...rowDto];
                    copyRowDto[index].avgMarketOffice = e.target.value;
                    setRowDto(copyRowDto);
                  }}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </>
  );
}
function Bulk({ rowDto, setRowDto }) {
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
              width: "120px",
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
            Landing Rate
          </th>
          <th
            style={{
              width: "120px",
            }}
          >
            Avg. Market Office
          </th>
        </tr>
      </thead>
      <tbody>
        {rowDto?.map((item, index) => {
          return (
            <tr key={index}>
              <td className='text-center'> {index + 1}</td>
              <td>{item?.demo}</td>
              <td>
                <InputField
                  value={item?.demo}
                  placeholder='Mill Rate'
                  name='millRate'
                  type='number'
                  onChange={(e) => {
                    const copyRowDto = [...rowDto];
                    copyRowDto[index].millRate = e.target.value;
                    setRowDto(copyRowDto);
                  }}
                />
              </td>

              <td>
                <InputField
                  value={item?.demo}
                  placeholder='Market Price'
                  name='marketPrice'
                  type='number'
                  onChange={(e) => {
                    const copyRowDto = [...rowDto];
                    copyRowDto[index].marketPrice = e.target.value;
                    setRowDto(copyRowDto);
                  }}
                />
              </td>
              <td>
                <InputField
                  value={item?.demo}
                  placeholder='Market Name'
                  name='marketName'
                  type='text'
                  onChange={(e) => {
                    const copyRowDto = [...rowDto];
                    copyRowDto[index].marketName = e.target.value;
                    setRowDto(copyRowDto);
                  }}
                />
              </td>
              <td>
                <InputField
                  value={item?.demo}
                  placeholder='Delivery Point'
                  name='deliveryPoint'
                  type='text'
                  onChange={(e) => {
                    const copyRowDto = [...rowDto];
                    copyRowDto[index].deliveryPoint = e.target.value;
                    setRowDto(copyRowDto);
                  }}
                />
              </td>

              <td>
                <NewSelect
                  name='transactionType'
                  options={
                    [
                      {
                        value: 1,
                        label: "Cash",
                      },
                      {
                        value: 2,
                        label: "Credit",
                      },
                      {
                        label: "Both",
                        value: 3,
                      },
                    ] || []
                  }
                  value={
                    item?.transactionTypeId
                      ? {
                          value: item?.transactionTypeId,
                          label: item?.transactionTypeName,
                        }
                      : ""
                  }
                  label='Transaction Type'
                  onChange={(valueOption) => {
                    const copyRowDto = [...rowDto];
                    copyRowDto[index].transactionTypeId = valueOption?.value;
                    copyRowDto[index].transactionTypeName = valueOption?.label;
                    setRowDto(copyRowDto);
                  }}
                />
              </td>
              <td>
                <InputField
                  value={item?.demo}
                  placeholder='Avg. Transport Fare'
                  name='avgTransportFare'
                  type='number'
                  onChange={(e) => {
                    const copyRowDto = [...rowDto];
                    copyRowDto[index].avgTransportFare = e.target.value;
                    setRowDto(copyRowDto);
                  }}
                />
              </td>
              <td>
                <InputField
                  value={item?.demo}
                  placeholder='Landing Rate'
                  name='landingRate'
                  type='number'
                  onChange={(e) => {
                    const copyRowDto = [...rowDto];
                    copyRowDto[index].landingRate = e.target.value;
                    setRowDto(copyRowDto);
                  }}
                />
              </td>
              <td>
                <InputField
                  value={item?.demo}
                  placeholder='Avg. Market Office'
                  name='avgMarketOffice'
                  type='number'
                  onChange={(e) => {
                    const copyRowDto = [...rowDto];
                    copyRowDto[index].avgMarketOffice = e.target.value;
                    setRowDto(copyRowDto);
                  }}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </>
  );
}

function Retail({ rowDto, setRowDto }) {
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
        </tr>
      </thead>
      <tbody>
        {rowDto?.map((item, index) => {
          return (
            <tr key={index}>
              <td className='text-center'> {index + 1}</td>
              <td>{item?.demo}</td>
              <td>
                <InputField
                  value={item?.demo}
                  placeholder='DP'
                  name='dp'
                  type='number'
                  onChange={(e) => {
                    const copyRowDto = [...rowDto];
                    copyRowDto[index].dp = e.target.value;
                    setRowDto(copyRowDto);
                  }}
                />
              </td>

              <td>
                <InputField
                  value={item?.demo}
                  placeholder='TP'
                  name='tp'
                  type='number'
                  onChange={(e) => {
                    const copyRowDto = [...rowDto];
                    copyRowDto[index].tp = e.target.value;
                    setRowDto(copyRowDto);
                  }}
                />
              </td>
              <td>
                <InputField
                  value={item?.demo}
                  placeholder='MRP'
                  name='mrp'
                  type='number'
                  onChange={(e) => {
                    const copyRowDto = [...rowDto];
                    copyRowDto[index].mrp = e.target.value;
                    setRowDto(copyRowDto);
                  }}
                />
              </td>
              <td>
                <InputField
                  value={item?.demo}
                  placeholder='EDP'
                  name='edp'
                  type='number'
                  onChange={(e) => {
                    const copyRowDto = [...rowDto];
                    copyRowDto[index].edp = e.target.value;
                    setRowDto(copyRowDto);
                  }}
                />
              </td>

              <td>
                <InputField
                  value={item?.demo}
                  placeholder='ETP'
                  name='etp'
                  type='number'
                  onChange={(e) => {
                    const copyRowDto = [...rowDto];
                    copyRowDto[index].etp = e.target.value;
                    setRowDto(copyRowDto);
                  }}
                />
              </td>
              <td>
                <InputField
                  value={item?.demo}
                  placeholder='Avg. Market Offer'
                  name='avgMarketOffer'
                  type='number'
                  onChange={(e) => {
                    const copyRowDto = [...rowDto];
                    copyRowDto[index].avgMarketOffer = e.target.value;
                    setRowDto(copyRowDto);
                  }}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </>
  );
}
