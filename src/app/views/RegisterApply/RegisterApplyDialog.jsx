import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  Icon,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Paper,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Tabs,
  Tab,
  Box,
  AppBar,
  Typography,
} from "@material-ui/core";
import moment from "moment";
import TextField from '@material-ui/core/TextField';
import { withStyles } from "@material-ui/core/styles";
import { makeStyles } from "@material-ui/core";
import {
  Add,
  Block,
  Save,
  Search,
  Description,
  GetApp,
} from "@material-ui/icons";
import { ConfirmationDialog } from "egret";
import { CloudUpload } from "@material-ui/icons";
import MaterialTable, {
  MTableToolbar,
  Chip,
  MTableBody,
  MTableHeader,
} from "material-table";
import React, { Component } from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import ValidatePicker from "../Component/ValidateSelect/ValidatePicker";
import {
  addRegisterApply,
  updateRegisterApply,
  deleteRegisterApply,
  uploadImage
} from "./RegisterApplyServices";
import ConstantList from "../../appConfig";
import {
  addRegisterApplyPosition,
  updateRegisterApplyPosition,
  deleteRegisterApplyPosition,
  searchByPagePosition
} from "./RegisterPositionServices";
import {
  addRegisterApplyCertificate,
  updateRegisterApplyCertificate,
  deleteRegisterApplyCertificate,
  searchByPageCertificate
} from "./RegisterCertificateServices"
import PropTypes from "prop-types";
import RegisterPoitionDialog
  from "./RegisterPositionDialog";
import RegisterCertificateDialog from "./RegisterCertificateDialog";
import { saveAs } from "file-saver";

toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const LightTooltip = withStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    backgroundColor: theme.palette.common.black,
  },
}))(Tooltip);

function MaterialButton(props) {
  const { t } = useTranslation();
  const item = props.item;
  return (
    <div className="none_wrap">
      <LightTooltip
        title={t("general.editIcon")}
        placement="bottom"
        enterDelay={300}
        leaveDelay={200}
        arrow
      >
        <IconButton size="small" onClick={() => props.onSelect(item, 0)}>
          <Icon fontSize="small" color="primary">
            edit
          </Icon>
        </IconButton>
      </LightTooltip>
      <LightTooltip
        title={t("general.deleteIcon")}
        placement="bottom"
        enterDelay={300}
        leaveDelay={200}
        arrow
      >
        <IconButton size="small" onClick={() => props.onSelect(item, 1)}>
          <Icon fontSize="small" color="error">
            delete
          </Icon>
        </IconButton>
      </LightTooltip>
    </div>
  );
}
// function tableBestTimeHeader(){
//   const { t } = useTranslation();
//   return (
//     <TableHead
//       style={{
//         backgroundColor: "#2a80c8",
//         overflow: "auto",
//       }}
//     >
//       <TableRow>
//         <TableCell
//           rowSpan={1}
//           className="border t-center"
//           width="10px"
//           style={{ minWidth: "10px", color: "white" }}
//         >
//           {t("dengueLocation.operation")}
//         </TableCell>


//         <TableCell
//           rowSpan={2}
//           width="200px"
//           style={{ minWidth: "200px", color: "white" }}
//           className="border t-center"
//         >
//           {t("RoyalLocation.name")}
//         </TableCell>

//       </TableRow>
//     </TableHead>);
// }



function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="span">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};


class RegisterApplyDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: "",
      name: "",
      dateOfBirth: null,
      email: "",
      phoneNumber: "",
      address: "",
      desiredSalary: 0,
      shouldOpenConfirmationDialog: false,
      shouldOpenPossitionDialog: false,
      shouldOpenCertificateDialog: false,
      shouldOpenConfirmPositionDialog: false,
      shouldOpenConfirmCertificateDialog: false,
      certificateSearch: "",
      possitionSearch: "",
      tabActive: 1,
      positionId: "",
      certificateId: "",
      positions: [],
      certificates: [],
      registerApply: {
        id: "",
        name: "",
        dateOfBirth: null,
        email: "",
        phoneNumber: "",
        address: "",
        desiredSalary: 0,
        type: 1,
        imagePath: ""
      }
    };
  }

  componentDidMount() {
    if (this.props.item) {
      this.setState({
        ...this.props.item,
        registerApply: this.props.item,
        id: this.props.item?.id,
        positions: this.props.item?.positions,
        certificates: this.props.item?.certificates
      })
    }
  }

  // getAdministrativeUnit = () => {
  //   const { administrativeUnit } = this.props.item;
  //   if (administrativeUnit) {
  //     getById(administrativeUnit.id).then(({ data }) => {
  //       this.setState({
  //         dengueLocation: {
  //           ...this.state.dengueLocation,
  //           ward: administrativeUnit,
  //           district: data.parent,
  //           province: data.parent.parent,
  //         },
  //       });
  //     });
  //   }
  // };
  handleChangeData = (value) => {
    let { registerApply } = this.state;
    registerApply.dateOfBirth = value;
    this.setState({ registerApply: registerApply })
  }
  handleSelectAdministrativeUnit = (value, source) => {
    if ("province" === source) {
      this.setState({
        dengueLocation: {
          ...this.state.dengueLocation,
          province: value,
        },
      });

      if (value != null) {
        this.setState({
          districtOfResidenceSearch: {
            pageSize: 999,
            pageIndex: 0,
            parentId: value.id,
          },
          district: null,
          ward: null,
        });
      } else {
        this.setState({ district: null });
        this.setState({ ward: null });
        this.setState({
          districtOfResidenceSearch: {
            pageSize: 999,
            pageIndex: 0,
          },
        });
        this.setState({
          wardOfResidenceSearch: {
            pageSize: 999,
            pageIndex: 0,
          },
        });
      }
    }
    if ("district" === source) {
      this.setState({
        dengueLocation: {
          ...this.state.dengueLocation,
          district: value,
        },
      });
      if (value != null) {
        this.setState({
          wardOfResidenceSearch: {
            pageSize: 999,
            pageIndex: 0,
            parentId: value.id,
          },
          ward: null,
        });
      } else {
        this.setState({ ward: null });
        this.setState({
          wardOfResidenceSearch: {
            pageSize: 999,
            pageIndex: 0,
          },
        });
      }
    }
    if ("ward" === source) {
      this.setState({
        dengueLocation: {
          ...this.state.dengueLocation,
          ward: value,
        },
      });
    }
  };
  handleFileSelect = (event) => {
    event.preventDefault();
    let files = event.target.files;
    let file = files[0];
    let list = [];
    if (
      file.type !== "image/jpg" &&
      file.type !== "image/jpeg" &&
      file.type !== "image/png"
    ) {
      toast.error("File incorrect format!");
    } else {
      if (file.size >= 7097152) {
        toast.error("File can't be larger than 7mb!");
      } else {
        for (const iterator of files) {
          list.push({
            file: iterator,
            uploading: false,
            error: false,
            progress: 0,
          });
        }
        this.setState(
          {
            files: list,
          },
          () => {
            let file = list[0];
            const formData = new FormData();
            if (file != null) {
              formData.append("file", file.file);
              uploadImage(formData).then(({ data }) => {
                this.setState({
                   ...this.state,
                   registerApply : {
                     ...this.state.registerApply,
                     imagePath : data.name
                   }
                  });
              });
            }
          }
        );
      }
    }
  };

  handleFormSubmit = () => {
    let { id } = this.state;
    const { t } = this.props;
    if (this.props.item) {
      updateRegisterApply(this.state.registerApply)
        .then(() => {
          toast.success(t("general.updateSuccess"));
          this.props.handleOKEditClose();
        })
        .catch(() => {
          toast.error(t("general.error"));
          this.props.handleClose();
        });
    } else {
      addRegisterApply(this.state.registerApply)
        .then((data) => data.data)
        .then((data) => {
            this.state.positions && this.state.positions.forEach((item) => {
              const newItem = {
                ...item,
                registerApply: data,
              };
              addRegisterApplyPosition(newItem);
            });
            this.state.certificates && this.state.certificates.forEach((item) => {
              const newItem = {
                ...item,
                registerApply: data,
              };
              addRegisterApplyCertificate(newItem);
            });
        })
        .then(() => {
          toast.success(t("general.addSuccess"));
          this.props.handleOKEditClose();
        })
        .catch(() => {
          toast.error(t("general.error"));
          this.props.handleClose();
        });
    }
  };


  handleDateChange = (value) => {
    this.setState({ dateOfBirth: value });
  };

  handleItemChange = (e) => {
    this.setState({
      royalLocationDto: {
        ...this.state.royalLocationDto,
        [e.target.name]: e.target.value,
      },
    });
  };

  handleDialogClose = () => {
    this.setState({
      shouldOpenConfirmationDialog: false,
      shouldOpenPossitionDialog: false,
      shouldOpenCertificateDialog: false,
      shouldOpenConfirmPositionDialog: false,
      shouldOpenConfirmCertificateDialog: false,
    });
  };

  handleOKCertificateDialog = () => {
    this.setState(
      {
        shouldOpenCertificateDialog: false,
      },
      () => this.updateCertificateData()
    );
  };
  handleOKPositionDialog = () => {
    this.setState(
      {
        shouldOpenPossitionDialog: false,
      },
      () => this.updatePositionData()
    );
  };

  handleOpenDengueItemDialog = () => {
    this.setState({
      ...this.state,
      shouldOpenDengueItemDialog: true,
    });
  };

  // Table Item
  updateListData = (itemData, source) => {
    if (source === "position") {
      const index = this.state.positions.findIndex(
        (i) => i.tableData.id === itemData?.tableData?.id
      );
      let newList = [...this.state.positions];

      if (index !== -1) {
        newList[index] = itemData;
        this.setState({
          positions: newList,
        });
      } else {
        this.setState({
          positions: [...this.state.positions, itemData],
        });
      }
    } else if (source === "certificate") {
      const index = this.state.certificates.findIndex(
        (i) => i.tableData.id === itemData?.tableData?.id
      );
      let newList = [...this.state.certificates];

      if (index !== -1) {
        newList[index] = itemData;
        this.setState({
          certificates: newList,
        });
      } else {
        this.setState({
          certificates: [...this.state.certificates, itemData],
        });
      }
    }
  };

  updateCertificateData = () => {
    let searchObject = {};
    // searchObject.dengueLocation = this.props.item;
    searchObject.pageIndex = 1;
    searchObject.pageSize = 10000;
    searchObject.idRegisterApply = this.state.id;
    searchByPageCertificate(searchObject).then(({ data }) => {
      this.setState({
        certificates: data.content,
      });
    });
  };
  updatePositionData = () => {
    let searchObject = {};
    // searchObject.dengueLocation = this.props.item;
    searchObject.pageIndex = 1;
    searchObject.pageSize = 10000;
    searchObject.idRegisterApply = this.state.id;
    searchByPagePosition(searchObject).then(({ data }) => {
      this.setState({
        positions: data.content,
      });
    });
  };

  // updateLocalCuisineData = () => {
  //   let searchObject = {};
  //   // searchObject.dengueLocation = this.props.item;
  //   searchObject.pageIndex = 1;
  //   searchObject.type = 3;
  //   searchObject.pageSize = 10000;
  //   searchByPagePatient(searchObject).then(({ data }) => {
  //     this.setState({
  //       localCuisineList: data.content,
  //     });
  //   });
  // };

  handleSearchInputChange = (e, source) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
    if (e.target.value === "") {
      this.search(source);
    }
  };

  handleKeyDownEnterSearch = (e, source) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      this.search(source);
      e.preventDefault();
    }
  };

  search = (source) => {
    if (source === "certificate") {
      let searchObject = {};
      searchObject.idRegisterApply = this.state.id;
      searchObject.pageIndex = 1;
      searchObject.pageSize = 1000;
      searchByPageCertificate(searchObject).then(({ data }) => {
        this.setState({
          certificates: data.content,
        });
      });
    } else if (source === "position") {
      let searchObject = {};
      searchObject.idRegisterApply = this.state.id;
      searchObject.pageIndex = 1;
      searchObject.pageSize = 1000;
      searchByPagePosition(searchObject).then(({ data }) => {
        this.setState({
          positions: data.content,
        });
      });
    }
  };

  handleChangeRowsPerPage = (event) => {
    this.setState(
      {
        rowsPerPage: parseInt(event.target.value, 10),
        page: 1,
      },
      () => this.updateTableData()
    );
  };

  handleChangePage = (event, newPage) => {
    this.setState(
      {
        page: newPage,
      },
      () => this.updateTableData()
    );
  };

  handleEditItem = (item, source) => {
    if (source === "position") {
      this.setState({
        ...this.state,
        itemEdit: item,
        shouldOpenPossitionDialog: true,
      });
    } else if (source === "certificate") {
      this.setState({
        ...this.state,
        itemEdit: item,
        shouldOpenCertificateDialog: true
      });
    }
  }

  handleDeleteVector = (id, rowId) => {
    if (id) {
      this.setState({
        itemId: id,
        shouldOpenConfirmationDialog: true,
      });
    } else {
      const a = [...this.state.itemList];
      const b = a.findIndex((item) => item.tableData.id === rowId);
      a.splice(b, 1);
      this.setState({
        itemList: a,
      });
    }
  };

  // handleConfirmationResponse = () => {
  //   let { t } = this.props;

  //   deleteRegisterApplyCertificate(this.state.itemId)
  //     .then(() => {
  //       toast.success(t("general.deleteSuccess"));
  //       this.updateTableData();
  //       this.handleDialogClose();
  //     })
  //     .catch(() => toast.error(t("general.error")));
  // };



  handleDeletePatient = (id, rowId) => {
    if (id) {
      this.setState({
        itemId: id,
        shouldOpenConfirmationDialog: true,
      });
    } else {
      const a = [...this.state.patientList];
      const b = a.findIndex((item) => item.tableData.id === rowId);
      a.splice(b, 1);
      this.setState({
        patientList: a,
      });
    }
  };

  // handleConfirmDeletePatient = () => {
  //   let { t } = this.props;

  //   deleteDengueLocationItem(this.state.itemId)
  //     .then(() => {
  //       toast.success(t("general.deleteSuccess"));
  //       this.updatePatientData();
  //       this.handleDialogClose();
  //     })
  //     .catch(() => toast.error(t("general.error")));
  // };

  handleDeletePosition = (id, rowId) => {
    if (id) {
      this.setState({
        positionId: id,
        shouldOpenConfirmPositionDialog: true,
      });
    } else {
      const a = [...this.state.positions];
      const b = a.findIndex((item) => item.tableData.id === rowId);
      a.splice(b, 1);
      this.setState({
        positions: a,
      });
    }
  };
  handleDeleteCertificate = (id, rowId) => {
    if (id) {
      this.setState({
        certificateId: id,
        shouldOpenConfirmCertificateDialog: true,
      });
    } else {
      const a = [...this.state.certificates];
      const b = a.findIndex((item) => item.tableData.id === rowId);
      a.splice(b, 1);
      this.setState({
        certificates: a,
      });
    }
  };

  handleConfirmationDeletePosition = () => {
    let { t } = this.props;

    deleteRegisterApplyPosition(this.state.positionId)
      .then(() => {
        toast.success(t("general.deleteSuccess"));
        this.updatePositionData();
        this.handleDialogClose();
      })
      .catch(() => toast.error(t("general.error")));
  };
  handleConfirmationDeleteCertificate = () => {
    let { t } = this.props;

    deleteRegisterApplyCertificate(this.state.certificateId)
      .then(() => {
        toast.success(t("general.deleteSuccess"));
        this.updateCertificateData();
        this.handleDialogClose();
      })
      .catch(() => toast.error(t("general.error")));
  };

  handleTabChange = (event, newValue) => {
    if (this.props.item) {
      this.setState({
        tabActive: newValue,
      });
    } else {
      this.setState({
        tabActive: newValue,
      });
    }
  };
  handleChange = (event) => {
    this.setState({
      registerApply: {
        ...this.state.registerApply,
        [event.target.name]: event.target.value,
      }
    });
  };
  onOpenImportExcel = (source) => {
    if (source === "vector") {
      this.setState({
        excelURL: "/api/dengue-location-item/importExcel",
        openImportExcelDialog: true,
      });
    } else {
      this.setState({
        excelURL: "/api/patientInformation/importExcel",
        openImportExcelDialog: true,
      });
    }
  };

  handleCloseImport = () => {
    this.setState({
      openImportExcelDialog: false,
    });
  };

  render() {
    const { t, open, handleClose } = this.props;

    const {
      itemEdit,
      shouldOpenCertificateDialog,
      shouldOpenPossitionDialog,
      shouldOpenConfirmCertificateDialog,
      shouldOpenConfirmPositionDialog,
      tabActive,
      text    } = this.state;
    let positionColumns = [
      {
        title: t("general.action"),
        field: "custom",
        align: "left",
        width: "100",
        headerStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: (rowData) => (
          <MaterialButton
            item={rowData}
            onSelect={(rowData, method) => {
              if (method === 0) {
                this.handleEditItem(rowData, "position");
              } else if (method === 1) {
                this.handleDeletePosition(rowData.id, rowData.tableData.id);
              } else {
                alert("Call Selected Here:" + rowData.id);
              }
            }}
          />
        ),
      },
      {
        title: t("Position.name"),
        field: "custom",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData => rowData?.position?.name
      },
      {
        title: t("Position.note"),
        field: "note",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
    ];

    let certificateColumns = [
      {
        title: t("general.action"),
        field: "custom",
        align: "left",
        width: "100",
        headerStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "100px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: (rowData) => (
          <MaterialButton
            item={rowData}
            onSelect={(rowData, method) => {
              if (method === 0) {
                this.handleEditItem(rowData, "certificate");
              } else if (method === 1) {
                this.handleDeleteCertificate(rowData.id, rowData.tableData.id);
              } else {
                alert("Call Selected Here:" + rowData.id);
              }
            }}
          />
        ),
      },
      {
        title: t("Certificate.name"),
        field: "name",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("Certificate.certificate"),
        field: "custom",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: rowData => rowData?.certificate?.name

      },
      {
        title: t("Certificate.issueDate"),
        field: "custom",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
        render: (rowData) => {
          return moment(rowData.issueDate).format('DD-MM-yyyy');
        }
      },
      {
        title: t("Certificate.level"),
        field: "level",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
      {
        title: t("Certificate.note"),
        field: "note",
        align: "left",
        width: "150",
        headerStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
        },
        cellStyle: {
          minWidth: "150px",
          paddingLeft: "10px",
          paddingRight: "0px",
          textAlign: "left",
        },
      },
    ];
    return (
      <Dialog
        open={open}
        fullWidth
        maxWidth="lg"
        onClose={handleClose}
        PaperComponent={PaperComponent}
      >
        {/* {shouldOpenDengueItemDialog && (
          <Re
            open={shouldOpenDengueItemDialog}
            handleClose={this.handleDialogClose}
            handleOKDialog={this.handleOKVectorDialog}
            t={t}
            item={itemEdit}
            updateTableData={this.updateListData}
            parent={this.state.royalLocationDto}
          />
        )} */}

        {shouldOpenPossitionDialog && (
          <RegisterPoitionDialog
            open={shouldOpenPossitionDialog}
            handleClose={this.handleDialogClose}
            handleOKDialog={this.handleOKPositionDialog}
            t={t}
            item={itemEdit}
            updateTableData={this.updateListData}
            parent={this.state.registerApply}
          />
        )}
        {shouldOpenCertificateDialog && (
          <RegisterCertificateDialog
            open={shouldOpenCertificateDialog}
            handleClose={this.handleDialogClose}
            handleOKDialog={this.handleOKCertificateDialog}
            t={t}
            item={itemEdit}
            updateTableData={this.updateListData}
            parent={this.state.registerApply}
          />
        )}


        {/* {shouldOpenLocalCuisineDialog && (
          <LocalCuisineDialog
            open={shouldOpenLocalCuisineDialog}
            handleClose={this.handleDialogClose}
            handleOKDialog={this.handleOKVectorDialog}
            t={t}
            item={itemEdit}
            updateTableData={this.updateListData}
            parent={this.state.royalLocationDto}
          />
        )} */}

        {shouldOpenConfirmPositionDialog && (
          <ConfirmationDialog
            open={shouldOpenConfirmPositionDialog}
            onConfirmDialogClose={this.handleDialogClose}
            title={t("general.confirm")}
            text={t("general.deleteConfirm")}
            onYesClick={this.handleConfirmationDeletePosition}
            agree={t("general.agree")}
            cancel={t("general.cancel")}
          />
        )}

        {shouldOpenConfirmCertificateDialog && (
          <ConfirmationDialog
            open={shouldOpenConfirmCertificateDialog}
            onConfirmDialogClose={this.handleDialogClose}
            title={t("general.confirm")}
            text={t("general.deleteConfirm")}
            onYesClick={this.handleConfirmationDeleteCertificate}
            agree={t("general.agree")}
            cancel={t("general.cancel")}
          />
        )}
        <DialogTitle
          style={{ cursor: "move", backgroundColor: "#f9fafb", paddingTop: "5px", paddingBottom: "5px" }}
          id="draggable-dialog-title"
        >
          <p
          >
            {t("Dashboard.RegisterApply")}
          </p>
        </DialogTitle>
        <ValidatorForm
          ref="form"
          onSubmit={this.handleFormSubmit}
          onError={(err) => console.log(err)}
        >
          <DialogContent style={{ paddingTop: "0px", paddingBottom: "0px" }}>
            <Grid container spacing={1} className="">
              <div index={0} style={{
                flexGrow: 1,
                width: "100%",
              }}>
                <AppBar position="static" color="default">
                  <Tabs
                    value={tabActive}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleTabChange}
                  >
                    {/* <Tab label={t("RoyalLocation.name")}  value="one"/> */}
                    <Tab
                      label={t("RegisterApply.infoRegister")}
                      value={1}
                    />
                    <Tab label={t("RegisterApply.position")} value={2} />
                    <Tab label={t("RegisterApply.certificate")} value={3} />

                  </Tabs>
                </AppBar>
                <TabPanel value={tabActive} index={1} style={{ height: "400px" }}>
                  <Grid container spacing={2} className="pt-30">
                    <Grid item md={3} sm={6} xs={12}>
                      <div
                        className="mb-18 flex flex-column flex-middle"
                      >
                        {this.state.registerApply.imagePath && (
                          <span>
                            <img
                              src={
                                ConstantList.API_ENPOINT +
                                "/public/api/image/" +
                                this.state.registerApply.imagePath
                              }
                              alt="Avatar"
                              style={{
                                objectFit: "cover",
                                width: "200px",
                                height: "200px",
                                borderRadius : "50%"
                              }}
                            />
                          </span>
                        )}
                        {!this.state.registerApply.imagePath && (
                          <div
                            style={{
                              border: "1px solid #DBDBDB",
                              width: "200px",
                              height: "200px",
                              borderRadius : "50%"
                            }}
                          ></div>
                        )}
                        <div>
                        <label
                          htmlFor="avatarImage"
                          style={{
                            background: "#ffcb89",
                            borderRadius: "999px",
                            padding: "7px 14px",
                            width: "fit-content",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={this.upload}
                          className="mt-16"
                        >
                          <CloudUpload className="mr-10" />
                          {t("user.avatar")}
                        </label>
                        </div>
                        <input
                          type="file"
                          id="avatarImage"
                          name="avatarImage"
                          accept="image/*"
                          onChange={this.handleFileSelect}
                          style={{ display: "none" }}
                        />
                      </div>
                    </Grid>
                    <Grid item sm={8} xs={12} container spacing={2}>
                      <Grid item sm={6} xs={12}>
                        <TextValidator
                          label={
                            <span>
                              <span style={{ color: "red" }}>*</span>
                              {t("RegisterApply.name")}
                            </span>
                          }
                          className="w-100"
                          onChange={this.handleChange}
                          type="text"
                          name="name"
                          value={this.state.registerApply?.name}
                          validators={["required"]}
                          errorMessages={[t("general.required")]}
                        />
                      </Grid>
                      <Grid item sm={6} xs={12}>
                        <TextValidator
                          className="w-100"
                          label={
                            <span>
                              <span style={{ color: "red" }}>*</span>
                              {t("RegisterApply.phoneNumber")}
                            </span>
                          }
                          onChange={this.handleChange}
                          type="number"
                          name="phoneNumber"
                          value={this.state.registerApply?.phoneNumber}
                          validators={["required"]}
                          errorMessages={[
                            t("general.required"),
                          ]}
                        />
                      </Grid>
                      <Grid item sm={6} xs={12}>
                        <TextValidator
                          style={{
                            position: "relative",
                          }}
                          className="w-100"
                          label={
                            <span>
                              <span style={{ color: "red" }}>*</span>
                              {t("RegisterApply.address")}
                            </span>
                          }
                          onChange={this.handleChange}
                          type="text"
                          name="address"
                          value={this.state.registerApply?.address}
                          validators={["required"]}
                          errorMessages={[
                            t("general.required"),
                          ]}
                        />
                      </Grid>
                      <Grid item sm={6} xs={12}>
                        <ValidatePicker
                          type="text"
                          format="dd/MM/yyyy"
                          className="w-100"
                          id="date-picker-inline"
                          label={
                            <span>
                              <span style={{ color: "red" }}>*</span>
                              {t("RegisterApply.dateOfBirth")}
                            </span>
                          }
                          value={
                            this.state.registerApply?.dateOfBirth
                          }
                          onChange={
                            this.handleChangeData
                          }
                          disableFuture
                          validators={["required"]}
                          errorMessages={[
                            t("general.required"),
                          ]}
                        />
                      </Grid>
                      <Grid item sm={6} xs={12}>
                        <TextValidator
                          style={{
                            position: "relative",
                          }}
                          className="w-100"
                          label={
                            <span>
                              <span style={{ color: "red" }}>*</span>
                              {t("RegisterApply.desiredSalary")}
                            </span>
                          }
                          onChange={this.handleChange}
                          type="number"
                          name="desiredSalary"
                          value={this.state.registerApply?.desiredSalary}
                          validators={["required"]}
                          errorMessages={[
                            t("general.required"),
                          ]}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={tabActive} index={2} style={{ height: "450px" }}>
                  <Grid
                    container
                    spacing={2}
                    alignItems="flex-end"
                    justifyContent="space-between"
                  >
                    <Grid
                      item
                      sm={8}
                      md={9}
                      lg={9}
                      className="flex flex-align-end"
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "50px" }}
                        startIcon={<Add />}
                        onClick={() => this.handleEditItem(null, "position")}
                      >
                        {t("general.add")}
                      </Button>
                    </Grid>
                    <Grid item sm={4} md={3} lg={3}>
                      <FormControl className="w-100" size="small">
                        <InputLabel htmlFor="standard-adornment">
                          {t("general.enterSearch")}
                        </InputLabel>
                        <Input
                          id="standard-basic"
                          type="text"
                          name="text"
                          value={text}
                          label={t("general.enterSearch")}
                          onChange={this.handleTextChange}
                          onKeyDown={this.handleKeyDownEnterSearch}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onClick={() => this.search(text)}
                              >
                                <Search />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={12}>
                      <MaterialTable
                        data={this.state.positions ? this.state.positions : []}
                        labelRowsPerPage={t("general.rows_per_page")}
                        columns={positionColumns}
                        // parentChildData={(row, rows) => {
                        //   var list = rows.find((a) => a.id === row.parentId);
                        //   return list;
                        // }}
                        localization={{
                          body: {
                            emptyDataSourceMessage: `${t(
                              "general.emptyDataMessageTable"
                            )}`,
                          },
                          toolbar: {
                            // nRowsSelected: `${t('general.selects')}`,
                            nRowsSelected: `${t("general.selects")}`,
                          },
                        }}
                        options={{
                          selection: true,
                          actionsColumnIndex: -1,
                          paging: false,
                          search: false,
                          rowStyle: (rowData, index) => ({
                            backgroundColor:
                              index % 2 === 1 ? "#EEE" : "#FFF",
                          }),
                          maxBodyHeight: "450px",
                          minBodyHeight: "370px",
                          headerStyle: {
                            backgroundColor: "#2a80c8",
                            color: "#fff",
                            height: "50px",
                          },
                          padding: "dense",
                          toolbar: false,
                        }}
                        components={{
                          Toolbar: (props) => <MTableToolbar {...props} />,
                        }}
                        onSelectionChange={(rows) => {
                          this.data = rows;
                        }}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
                <TabPanel value={tabActive} index={3} style={{ height: "450px" }}>
                  <Grid
                    container
                    spacing={2}
                    alignItems="flex-end"
                    justifyContent="space-between"
                  >
                    <Grid
                      item
                      sm={8}
                      md={9}
                      lg={9}
                      className="flex flex-align-end"
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: "50px" }}
                        startIcon={<Add />}
                        onClick={() => this.handleEditItem(null, "certificate")}
                      >
                        {t("general.add")}
                      </Button>
                    </Grid>
                    <Grid item sm={4} md={3} lg={3}>
                      <FormControl className="w-100" size="small">
                        <InputLabel htmlFor="standard-adornment">
                          {t("general.enterSearch")}
                        </InputLabel>
                        <Input
                          id="standard-basic"
                          type="text"
                          name="text"
                          value={text}
                          label={t("general.enterSearch")}
                          onChange={this.handleTextChange}
                          onKeyDown={this.handleKeyDownEnterSearch}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onClick={() => this.search(text)}
                              >
                                <Search />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </FormControl>
                    </Grid>

                    <Grid item md={12}>
                      <MaterialTable
                        data={this.state.certificates ? this.state.certificates : []}
                        labelRowsPerPage={t("general.rows_per_page")}
                        columns={certificateColumns}
                        parentChildData={(row, rows) => {
                          var list = rows.find((a) => a.id === row.parentId);
                          return list;
                        }}
                        localization={{
                          body: {
                            emptyDataSourceMessage: `${t(
                              "general.emptyDataMessageTable"
                            )}`,
                          },
                          toolbar: {
                            // nRowsSelected: `${t('general.selects')}`,
                            nRowsSelected: `${t("general.selects")}`,
                          },
                        }}
                        options={{
                          selection: true,
                          actionsColumnIndex: -1,
                          paging: false,
                          search: false,
                          rowStyle: (rowData, index) => ({
                            backgroundColor:
                              index % 2 === 1 ? "#EEE" : "#FFF",
                          }),
                          maxBodyHeight: "450px",
                          minBodyHeight: "370px",
                          headerStyle: {
                            backgroundColor: "#2a80c8",
                            color: "#fff",
                            height: "50px",
                          },
                          padding: "dense",
                          toolbar: false,
                        }}
                        components={{
                          Toolbar: (props) => <MTableToolbar {...props} />,
                        }}
                        onSelectionChange={(rows) => {
                          this.data = rows;
                        }}
                      />
                    </Grid>
                  </Grid>
                </TabPanel>
              </div>
            </Grid>
          </DialogContent>

          <DialogActions>
            <div className="flex flex-middle mr-8">
              <Button
                startIcon={<Block />}
                variant="contained"
                className="mr-12"
                color="secondary"
                onClick={() => this.props.handleClose()}
              >
                {t("general.cancel")}
              </Button>
              <Button
                startIcon={<Save />}
                variant="contained"
                className="mr-8"
                color="primary"
                type="submit"
              >
                {t("general.save")}
              </Button>
            </div>
          </DialogActions>
        </ValidatorForm>
      </Dialog>
    );
  }
}
export default RegisterApplyDialog;
