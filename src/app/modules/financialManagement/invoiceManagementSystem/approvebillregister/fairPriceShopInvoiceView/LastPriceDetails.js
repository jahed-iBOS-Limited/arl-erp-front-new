import React from "react";
import { Popover } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import ICustomTable from "../../../../_helper/_customTable";

const useStyles = makeStyles((theme) => ({
  popover: {
    // pointerEvents: "none",
    zIndex: "99999",
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

const LastPriceDetails = ({ setAnchorEl, anchorEl, currentItem }) => {
  const classes = useStyles();
  const open = Boolean(anchorEl);

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <div>
          <b>Item Name : {currentItem?.itemName}</b>
        </div>
        {/* <b>Last Price List :</b>
        <ul>
          {currentItem?.lastPoInfo?.map((item) => (
            <li>{item?.lastPrice}</li>
          ))}
        </ul> */}
        <ICustomTable ths={["SL", "Last Price", "Supplier Name", "PO Code"]}>
          {currentItem?.lastPoInfo?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item?.lastPrice}</td>
              <td>{item?.supplierName}</td>
              <td>{item?.purchaseOrderCode}</td>
            </tr>
          ))}
        </ICustomTable>
      </Popover>
    </div>
  );
};

export default LastPriceDetails;
