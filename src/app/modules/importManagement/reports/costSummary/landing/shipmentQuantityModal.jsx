import React from 'react';
import InsurancePolicyForm from '../../../transaction/shipmentAndPacking/collapsePanels/shipment/form/addEditForm';
const ShipmenmtQuantityModal = ({ shipmentId, checkbox, poNo, lcNo }) => {
  return (
    <InsurancePolicyForm
      type={'view'}
      id={shipmentId}
      poNumber={poNo}
      lcNumber={lcNo}
    />
    // <div className={classes.root}>
    //     <ICustomCard title="Shipment And Packing Policy">
    //         {checkbox === "shipmentInformation" &&
    //             <Accordion
    //                 className="general-ledger-collapse-custom"
    //                 expanded={expanded === "panel2"}
    //                 onChange={handleChange("panel2")}
    //             >
    //                 <AccordionSummary
    //                     expandIcon={<ExpandMoreIcon />}
    //                     aria-controls="panel2bh-content"
    //                     id="panel2bh-header"
    //                 >
    //                     <Typography className={classes.heading}>
    //                         {/* Shipment */}
    //                     </Typography>
    //                 </AccordionSummary>
    //                 <AccordionDetails>
    //                     <div>

    //                     </div>
    //                 </AccordionDetails>
    //             </Accordion>
    //         }
    //     </ICustomCard>
    // </div>
  );
};

export default ShipmenmtQuantityModal;
