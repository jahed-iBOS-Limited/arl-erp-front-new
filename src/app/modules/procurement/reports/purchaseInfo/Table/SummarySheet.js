import React from "react";

const fakeData = [
    {
      plantName: 'Plant 1',
      warehouseName: 'Warehouse A',
      itemName: 'Item X',
      orderValue: 100,
      orderQuantity: 50,
      costPerUom: 2.5,
      costPerMaunds: 5,
    },
    {
      plantName: 'Plant 2',
      warehouseName: 'Warehouse B',
      itemName: 'Item Y',
      orderValue: 150,
      orderQuantity: 30,
      costPerUom: 3.0,
      costPerMaunds: 6,
    },
    {
      plantName: 'Plant 3',
      warehouseName: 'Warehouse C',
      itemName: 'Item Z',
      orderValue: 200,
      orderQuantity: 20,
      costPerUom: 3.5,
      costPerMaunds: 7,
    },
  ];
  



function SummarySheet({ gridData }) {
  let numVatAmount = 0,
    numVatPercentage = 0,
    numBasePrice = 0,
    numOrderQty = 0,
    numTotalValue = 0;
  return (
    <>
      <div className="row ">
        <div className="col-lg-12">
          {gridData?.length >= 0 && (
            <table className="table table-striped table-bordered global-table table-font-size-sm">
              <thead>
                <tr>
                  <th style={{ width: "30px" }}>SL</th>
                  <th>Plant</th>
                  <th>Warehouse</th>
                  <th>Item</th>
                  <th>UOM</th>
                  <th>Quantity</th>
                  <th>Value</th>
                  <th>Cost/KG</th>
                  <th>Cost/Maunds</th>
                </tr>
              </thead>
              <tbody>


              {/* [
                {
                    "plantId": 17,
                    "plantName": "Akij House",
                    "warehouseId": 36,
                    "warehouseName": "ARL Corporate",
                    "purchaseOrderDate": "2023-05-02T00:00:00",
                    "itemId": 94990,
                    "itemName": "Mobile Bill",
                    "uomId": 130,
                    "uomName": "JOB",
                    "orderQuantity": 1,
                    "orderValue": 2863,
                    "costPerUom": 0,
                    "costPerMaunds": 0
                }] */}


                {fakeData?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">{item.plantName}</td>
                      <td className="text-left">
                        {item?.warehouseName}
                      </td>
                      <td className="text-center">
                        {item.itemName}
                      </td>
                      <td className="text-right">
                        {item.uomName}
                      </td>
                      <td className="text-right">
                        {item.orderQuantity}
                      </td>
                      <td className="text-right">
                        {item.orderValue}
                      </td>
                      <td className="text-right">
                        {item.costPerUom}
                      </td>
                      <td className="text-right">
                        {item.costPerMaunds}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default SummarySheet;
