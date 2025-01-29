// import { merge } from "lodash"
import { createFile } from "../../../../_helper/excel/index";




class Cell {
    constructor(label,align,format){
        this.text= label;
        this.alignment=`${align}:middle`;
        this.format=format
    }
    getCell () {
        return  {
            text:this.text,
            fontSize:12,
            border:"all 000000 thin",
            alignment:this.alignment || "",
            textFormat:this.format
        }
    }
}

const getTableData = (row) => {
    const data =row?.map((item, index) => {
      return [

          new Cell(index+1,"center","text").getCell(),
          new Cell(item?.strBankAccountName,"left","text").getCell(),
          new Cell(item?.strBankAccountNo,"left","text").getCell(),
          new Cell(item?.strBankName,"left","text").getCell(),
          new Cell(item?.strBankBranchName,"left","text").getCell(),
          new Cell(item?.strRoutingNumber,"left","text").getCell(),
          new Cell(item?.numAmount,"right","money").getCell(),
      ];
    });
    return data
  };
  

export const formatFour = (values,row,selectedBusinessUnit,total,
    totalInWords, adviceBlobData, fileName) =>{
    const excel = {
        name:"Bank Advice",
        sheets:[
            {
                name:"Bank Advice",
                gridLine: false,
                rows:[
                    // [
                    //     {
                    //         text:dateFormatWithMonthName(_todayDate()),
                    //         fontSize:14,
                    //         cellRange:"A1:G1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     },
                    // ],
                    // [
                    //     {
                    //         text:  "The Manager",
                    //         fontSize:14,
                    //         cellRange:"A1:G1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     },
                    // ],
                    // [
                    //     {
                    //         text: values?.bankAccountNo?.bankName,
                    //         fontSize:14,
                    //         cellRange:"A1:G1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     },
                    // ],
                    // [
                    //     {
                    //         text:values?.bankAccountNo?.address,
                    //         fontSize:14,
                    //         cellRange:"A1:G1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     },
                    // ],
                    // [
                    //     "_blank*1"
                    // ],
                    // [
                    //     {
                    //         text:"Subject:  Fund Transfer through BEFTN",
                    //         fontSize:14,
                    //         bold:true,
                    //         underline:true,
                    //         cellRange:"A1:G1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     },
                    // ],
                    // [
                    //     "_blank*1"
                    // ],
                    // [
                    //     {
                    //         text:"Dear Sir,",
                    //         fontSize:14,
                    //         cellRange:"A1:G1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     },
                    // ],
                    // [
                    //     {
                    //         text:`Please execute the BEFTN transaction as per following information:`,
                    //         fontSize:14,
                    //         cellRange:"A1:G1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     },
                    // ],
                    // [
                    //     "_blank*1"
                    // ],
                    [
                        {
                            text:'SL',
                            fontSize:12,
                            bold:true,
                            border:"all 000000 thin",
                            
                        },
                        {
                            text:'Beneficiary A/C Name',
                            fontSize:12,
                            bold:true,
                            border:"all 000000 thin"
                        },
                        {
                            text:'Beneficiary A/C No',
                            fontSize:12,
                            bold:true,
                            border:"all 000000 thin"
                        },
                        {
                            text:'Bank Names',
                            fontSize:12,
                            bold:true,
                            border:"all 000000 thin"
                        },
                        {
                            text:'Branch Names',
                            fontSize:12,
                            bold:true,
                            border:"all 000000 thin"
                        },
                        {
                            text:'Routing Code',
                            fontSize:12,
                            bold:true,
                            border:"all 000000 thin"
                        },
                        {
                            text:'Amount (BDT) ',
                            fontSize:12,
                            bold:true,
                            border:"all 000000 thin"
                        },
                    ],
                    ...getTableData(row),
                    // [
                    //     {
                    //         text:"Total",
                    //         fontSize:12,
                    //         bold:true,
                    //         border:"all 000000 thin",
                    //         cellRange:"A1:F1",
                    //         merge:true,
                    //     },
                    //     {
                    //         text:total,
                    //         fontSize:12,
                    //         border:"all 000000 thin",
                    //         bold:true,
                    //         alignment:"right:middle",
                    //         textFormat:"money"
                    //     },
                    // ],
                    // [
                    //     "_blank*1"
                    // ],
                    // [
                    //     {
                    //         text:  `In Word : ${totalInWords} Taka Only.`,
                    //         fontSize:14,
                    //         cellRange:"A1:G1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     }
                    // ],
                    // [
                    //     "_blank*1"
                    // ],
                    // [
                    //     {
                    //         text:  `In this regard we hereby authorise you to debit our Account Name “${selectedBusinessUnit?.label}”`,
                    //         fontSize:14,
                    //         cellRange:"A1:G1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     }
                    // ],
                    // [
                    //     {
                    //         text:  `Account No ${values?.bankAccountNo?.bankAccNo} with your bank by the value of the transaction.`,
                    //         fontSize:14,
                    //         cellRange:"A1:G1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     }
                    // ],
                    // [
                    //     "_blank*1"
                    // ],
                    // [
                    //     {
                    //         text:  `Yours Faithfully`,
                    //         fontSize:14,
                    //         cellRange:"A1:G1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     }
                    // ],
                    // [
                    //     "_blank*1"
                    // ],
                    // [
                    //     {
                    //         text:  `For ${selectedBusinessUnit?.label}`,
                    //         fontSize:14,
                    //         bold:true,
                    //         cellRange:"A1:G1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     }
                    // ],
                    // [
                    //     "_blank*2"
                    // ],
                    // [
                    //     {
                    //         text:  `Authorize Signature`,
                    //         fontSize:14,
                    //         cellRange:"A1:C1",
                    //         merge:true
                    //         ,              alignment:"left:middle"
                    //     },
                    //     {
                    //         text:  `Authorize Signature`,
                    //         fontSize:14,
                    //         cellRange:"D1:F1",
                    //         merge:true,
                    //         alignment:"left:middle"
                    //     },
                    // ],



                ]
            }
        ]
    }

    createFile(excel, adviceBlobData, fileName)



}