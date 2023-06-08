import React from 'react'
import InsurancePolicyForm from '../../../transaction/shipmentAndPacking/collapsePanels/shipment/form/addEditForm';
const ShipmenmtQuantityModal = ({ shipmentId, checkbox, poNo, lcNo }) => {
    return (
        <InsurancePolicyForm type={"view"} id={shipmentId} poNumber={poNo} lcNumber={lcNo} />
        // <div className={classes.root}>
        //     <ICustomCard title="Shipment And Packing Policy">
        //         {checkbox === "shipmentInformation" &&
        //             <ExpansionPanel
        //                 className="general-ledger-collapse-custom"
        //                 expanded={expanded === "panel2"}
        //                 onChange={handleChange("panel2")}
        //             >
        //                 <ExpansionPanelSummary
        //                     expandIcon={<ExpandMoreIcon />}
        //                     aria-controls="panel2bh-content"
        //                     id="panel2bh-header"
        //                 >
        //                     <Typography className={classes.heading}>
        //                         {/* Shipment */}
        //                     </Typography>
        //                 </ExpansionPanelSummary>
        //                 <ExpansionPanelDetails>
        //                     <div>
                                
        //                     </div>
        //                 </ExpansionPanelDetails>
        //             </ExpansionPanel>
        //         }
        //     </ICustomCard>
        // </div>
    )
}

export default ShipmenmtQuantityModal