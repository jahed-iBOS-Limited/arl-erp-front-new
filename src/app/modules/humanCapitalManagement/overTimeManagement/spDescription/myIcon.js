import React from "react";
import { makeStyles } from "@material-ui/core";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import "./style.css";

const useStyles = makeStyles((theme) => ({
  root: {
    transform: "translateZ(0px)",
    flexGrow: 1,
  },

  fabColor: {
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  exampleWrapper: {
    position: "relative",
    marginTop: theme.spacing(10),
    marginLeft: theme.spacing(4.2),
  },
  speedDial: {
    position: "absolute",
    "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
      top: theme.spacing(2),
      left: theme.spacing(0),
    },
  },
}));

export default function MyIcon({
  setisShowModalTwo,
  editHandler,
  setFieldValue,
  item,
}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <div className={classes.root}>
      <div className={classes.exampleWrapper}>
        <SpeedDial
          ariaLabel="SpeedDial example"
          className={classes.speedDial}
          hidden={false}
          icon={<MoreVertIcon />}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
          direction="left"
          FabProps={{ className: classes.fabColor }}
        >
          <SpeedDialAction
            key="Edit"
            icon={<EditIcon />}
            tooltipTitle="Edit"
            onClick={(e) => {
              e.preventDefault();
              editHandler(setFieldValue, item);
            }}
          />

          <SpeedDialAction
            key="View"
            icon={<VisibilityIcon style={{ fill: "#138496" }} />}
            tooltipTitle="View"
            onClick={() => {
              setisShowModalTwo(true);
            }}
          />

          <SpeedDialAction
            key="Delete"
            icon={<DeleteIcon style={{ fill: "#C82333" }} />}
            tooltipTitle="Delete"
            onClick={() => {
              alert("Delete Button");
            }}
          />
        </SpeedDial>
      </div>
    </div>
  );
}
