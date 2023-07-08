import {
  Button, Dialog, DialogActions, DialogTitle, Grid, Paper, Checkbox, FormControlLabel,
  TextField
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { Component } from "react";
import Draggable from "react-draggable";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  searchByPage
} from "../Currency/CurrencyService";
import { getAll } from '../ShipOwnerRegister/ShipOwnerRegisterService';
import {
  saveItem, searchByPagePositionTitle, searchByPagePositionTitleLevel, searchByPageTypeOfShip, updateItem, checkCode
} from "./JobService";
import { searchByPage as searchCertificate } from '../Certificate/CertificateService'
import { searchByPage as searchShips } from '../Ships/ShipsService'
import ValidatePicker from "../Component/ValidateSelect/ValidatePicker";
import axios from "axios";
import ConstantList from "../../appConfig";
import { CloudUpload } from "@material-ui/icons";
import { Editor } from '@tinymce/tinymce-react';
import SelectPositionPopup from "./SelectPositionPopup";
import MaterialTable, { MTableToolbar } from "material-table";
import "./Job.css";


toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

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


class JobDialog extends Component {
  state = {
    id: "",
    name: "",
    code: "",
    description: "",
    type: "",
    bestJob: false,
    applicationDeadline: null,
    estimadArrivalTime: null,
    listCurrency: [],
    positionTitleDto: {},
    listPositionTitleLevel: [],
    listCertificate: [],
    listPositionTitle: [],
    listTypeOfShip: [],
    listShipOwner: [],
    listShips: [],
    currency: null,
    shouldOpenNotificationPopup: false,
    shouldOpenPositionSelect: false,
    Notification: "",
    registerApplyDto: null,
    certificateL: null,
    titleImageUrl: null,
    imagePath: "",
    jobPositionTitles: [],
    ships: null,
    seaport: ""
  };

  search() {
    var searchObject = {};
    searchObject.pageIndex = 0;
    searchObject.pageSize = 999999;

    searchByPage(searchObject).then(res => {
      this.setState({ listCurrency: [...res.data.content] })
    }).catch(err => { console.log(err) });

  }

  searchByPageTypeOfShip() {
    var searchObject = {};
    searchObject.pageIndex = 0;
    searchObject.pageSize = 999999;
    searchByPageTypeOfShip(searchObject).then(res => {
      this.setState({ listTypeOfShip: [...res.data.content] })
    }).catch(err => { console.log(err) });
  }

  searchByPageCertificate() {
    var searchObject = {};
    searchObject.pageIndex = 0;
    searchObject.pageSize = 999999;
    searchCertificate(searchObject).then(res => {
      this.setState({ listCertificate: [...res.data.content] })

    }).catch(err => { console.log(err) });
  }

  searchByPageShips() {
    var searchObject = {};
    searchObject.pageIndex = 1;
    searchObject.pageSize = 999999;
    searchShips(searchObject).then(res => {
      this.setState({ listShips: [...res.data.content] })

    }).catch(err => { console.log(err) });
  }
  searchByPagePositionTitle() {
    var searchObject = {};
    searchObject.pageIndex = 1;
    searchObject.pageSize = 999999;
    searchByPagePositionTitle(searchObject).then(res => {
      this.setState({ listPositionTitle: [...res.data.content] })
    }).catch(err => { console.log(err) });
  }
  handleDateChange = (selectIssuaDate) => {
    this.setState({ applicationDeadline: selectIssuaDate })
  }
  handleEstimadDateChange = (selectEstimadDate) => {
    this.setState({ estimadArrivalTime: selectEstimadDate })
  }
  handleUploadFile = (e, type) => {
    let url = ConstantList.API_ENPOINT + "/public/api/image";
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    axios.post(url, formData, config)
      .then(({ data }) => {
        this.setState({
          titleImageUrl: data.name,
          imagePath: data.name
        });
        toast.success("Tải ảnh lên thành công");
      })
      .catch(() => toast.error("Tải lên ảnh bị lỗi"));
  };

  searchByPagePositionTitleLevel() {
    var searchObject = {};
    searchObject.pageIndex = 0;
    searchObject.pageSize = 999999;
    searchByPagePositionTitleLevel(searchObject).then(res => {
      this.setState({ listPositionTitleLevel: [...res.data.content] })
    }).catch(err => { console.log(err) });
  }

  handleDialogClose = () => {
    this.setState({ shouldOpenNotificationPopup: false });
  };

  handleOpenSelectPopup = () => {
    this.setState({
      shouldOpenPositionSelect: true
    })
  }

  handleCloseSelectPopup = () => {
    this.setState({
      shouldOpenPositionSelect: false
    })
  }

  handleSelectPosition = (listItem) => {
    let { jobPositionTitles } = this.state;
    let { positionTitleDto } = this.state;
    // let roundStrainItem = {
    //   strain: null
    // };

    // list mới findIndex list cũ = > xóa

    if (jobPositionTitles != null && jobPositionTitles.length > 0) {
      jobPositionTitles.map((rsItem) => {
        let index = listItem.findIndex((item) => item.id == rsItem.positionTitleDto?.id);
        if (index == -1) {
          let i = jobPositionTitles.indexOf(rsItem);
          jobPositionTitles.splice(i);
        }
      });
    }

    // list cũ findIndex list mới => k tìm thấy  = > thêm
    if (listItem != null && listItem.length > 0) {
      listItem.map((item) => {
        let index = jobPositionTitles.findIndex(
          (position) => position.positionTitleDto?.id == item.id
        );
        if (index == -1) {
          let positionItem = {
            positionTitleDto: null,
          };
          positionItem.positionTitleDto = item;
          // console.log("positionItem",positionItem);
          jobPositionTitles.push(positionItem);
        }
      });
    }
    this.setState(
      { positionTitleDto: positionTitleDto, jobPositionTitles: jobPositionTitles },
      () => { }
    );
    // console.log(this.state.ListPosition)
    this.handleCloseSelectPopup();
  };

  handleChangeContent = data => {
    this.setState({
      description: data,
    });
  };

  //toggleDetailPanel?: (panelIndex?: number) => void
  handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
    if (source === "bestJob") {
      this.setState({ bestJob: event.target.checked });
      return;
    }
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleChangeValue = (rowData, event, name) => {
    console.log(rowData.positionTitleDto.id)
    console.log(this.state.jobPositionTitles);
    console.log(name);
    let jobPositionTitles = this.state.jobPositionTitles;
    let index = jobPositionTitles.findIndex((pos) => rowData.positionTitleDto.id == pos.positionTitleDto.id);
    console.log(index);

    if (name == "salary") {
      jobPositionTitles[index] = {
        ...jobPositionTitles[index],
        salary: event.target.value
      }
    }
    if (name == "recruitedEmployees") {
      jobPositionTitles[index] = {
        ...jobPositionTitles[index],
        recruitedEmployees: event.target.value
      }
    }

    this.setState({
      jobPositionTitles: jobPositionTitles,
      [rowData.positionTitleDto.id]: event.target.value,
    });
  };

  onCurrencyChange = (values) => {
    this.setState({
      currency: values
    });
  }
  onCertificateChange = (values) => {
    this.setState({
      certificate: values
    });
  }

  onRegisterApplyChange = (values) => {
    this.setState({
      registerApplyDto: values
    });
  }

  onShips = (values) => {
    this.setState({
      ships: values
    });
  }
  onTypeOfShipChange = (values) => {
    this.setState({
      typeOfShip: values
    });
  }

  onPositionTitleChange = (values) => {
    this.setState({
      jobPositionTitles: values
    });
  }

  onPositionTitleLevelChange = (values) => {
    this.setState({
      positionTitleLevel: values
    });
  }
  handleFormSubmit = () => {
    let { id, code } = this.state;
    var { t } = this.props;
    const submitForm = { ...this.state, positionUuidSet: this.state.jobPositionTitles.map((item) => item?.id) }
    if (submitForm?.name?.length < 255) {
      checkCode(id, code).then((result) => {
        if (result.data) {
          toast.warning(t("general.dupli_code"));
        } else {
          if (id) {
            updateItem({
              ...submitForm,
            }).then(() => {
              toast.success(t("general.updateSuccess"));
              this.props.handleOKEditClose();
            });
          } else {
            // debugger
            saveItem({
              ...submitForm,
            }).then(() => {
              toast.success(t("general.addSuccess"));
              this.props.handleOKEditClose();
            });
          }
        }
      })
    } else {
      toast.error("Tên không được quá dài")
    }
  };
  searchShipOwner() {
    getAll().then(({ data }) => {
      // console.log(data)
      if (data) {
        this.setState({
          listShipOwner: data
        })
      }
    }).catch(() => {
      toast.error('Lấy thông tin chủ tàu thất bại')
    })
  }

  componentDidMount() {
    let { item } = this.props;
    if (item) {
      let jobPositionTitles = item.jobPositionTitles ? item.jobPositionTitles.map((item1) => ({
        ...item1,
        positionTitleDto:item1.positionTitleDto,
        salary:item1.salary,
        recruitedEmployees:item1.recruitedEmployees
      })) : []
      this.setState({ ...item, jobPositionTitles });
    }
    this.search();
    this.searchByPagePositionTitle();
    this.searchShipOwner();
    this.searchByPagePositionTitleLevel();
    this.searchByPageTypeOfShip();
    this.searchByPageCertificate();
    this.searchByPageShips();

  }

  render() {
    let {
      id,
      name,
      subDescription,
      code,
      salary,
      listCurrency,
      listTypeOfShip,
      listPositionTitle,
      jobPositionTitles,
      listPositionTitleLevel,
      listCertificate,
      listShips,
      certificate,
      listShipOwner,
      registerApplyDto,
      minSalary,
      maxSalary,
      typeOfShip,
      shouldOpenPositionSelect,
      positionTitleLevel,
      description,
      currency,
      recruitedEmployees,
      applicationDeadline,
      estimadArrivalTime,
      bestJob,
      ships,
      seaport, item
    } = this.state;
    let { open, handleClose, handleOKEditClose, t, i18n, } = this.props;

    let columns = [
      {
        title: t("general.positionTitle"),
        field: "name",
        align: "left",
        width: "100",
        // render: (rowData) => (edit?(rowData?.name ? rowData?.name : "") :(rowData?.positionTitleDto?.name ? rowData?.positionTitleDto?.name : "")),
        render: (rowData) => (rowData?.positionTitleDto?.name ? rowData?.positionTitleDto?.name : ""),
      },
      {
        title: t("general.salary"),
        field: "salary",
        align: "left",
        width: "100",
        render: (rowData) => (
          <TextValidator
            className="w-100 "
            // label={
            //   <span>
            //     <span style={{ color: "red" }}>*</span>
            //     {t("general.salary")}
            //   </span>
            // }
            onChange={(source) => this.handleChangeValue(rowData, source, "salary")}
            type="number"
            name="salary"
            value={rowData.salary}
          // validators={["required"]}
          // errorMessages={[t("general.required")]}
          />
        ),
      },
      {
        title: t("general.numberRecruit"),
        field: "source",
        align: "left",
        width: "100",
        render: (rowData) => (
          <TextValidator
            className="w-100"
            // label={
            //   <span>
            //     <span style={{ color: "red" }}>*</span>
            //     {t("general.numberRecruit")}
            //   </span>
            // }
            onChange={(source) => this.handleChangeValue(rowData, source, "recruitedEmployees")}
            type="number"
            name="recruitedEmployees"
            value={rowData.recruitedEmployees}
          // validators={["required"]}
          // errorMessages={[t("general.required")]}
          />
        ),
      },
    ];
    return (
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          style={{ cursor: "move", paddingBottom: "0px" }}
          id="draggable-dialog-title"
        >
          <h4 className="">{id ? t("general.update") : t("general.add")}</h4>
        </DialogTitle>

        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
          <Grid style={{
            overflowY: "default", padding: "1px 28px"
          }}
          >
            <Grid className="" container spacing={2}>
              <Grid item sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span>
                      {t("general.name")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="name"
                  value={name}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid>
              <FormControlLabel
                label={t("Job.bestJob")}
                value={bestJob}
                className="mb-16"
                name="bestJob"
                onChange={bestJob => this.handleChange(bestJob, "bestJob")}
                control={<Checkbox
                  checked={bestJob}
                />}

              />

              <Grid item sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span>
                      {t("general.description")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="subDescription"
                  value={subDescription}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid>



              <Grid item sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span>
                      {t("general.code")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="code"
                  value={code}
                  disabled={id}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid>

              <Grid item sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span>
                      {t("Job.seaport")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="seaport"
                  value={seaport}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid>

              <Grid item sm={12} xs={12} className="position-Select-Btn">
                {/* <Autocomplete
                  options={listPositionTitle ? listPositionTitle : []}
                  value={jobPositionTitles ? jobPositionTitles : []}
                  multiple
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => { this.onPositionTitleChange(value) }}
                  renderInput={(params) => <TextField {...params} label={t("general.positionTitle")}
                  />}
                /> */}
                <div className="position-Select-label">
                  {t("general.positionTitle")}
                </div>
                <Button
                  variant="contained"
                  className="mr-12"
                  color="primary"
                  onClick={() => this.setState({
                    shouldOpenPositionSelect: true
                  })}
                >
                  {t("general.select")}
                </Button>
              </Grid>

              {
                shouldOpenPositionSelect &&
                (
                  <SelectPositionPopup
                    t={t}
                    open={shouldOpenPositionSelect}
                    jobPositionTitles={this.state.jobPositionTitles}
                    handleClose={this.handleCloseSelectPopup}
                    handleSelect={this.handleSelectPosition}
                  />
                )
              }

              <Grid item xs={12}>
                <MaterialTable
                  data={item ? item : this.state.jobPositionTitles}
                  columns={columns}
                  options={{
                    selection: false,
                    actionsColumnIndex: -1,
                    paging: false,
                    search: false,
                    rowStyle: (rowData) => ({
                      backgroundColor:
                        rowData.tableData.id % 2 === 1
                          ? "#EEE"
                          : "#FFF",
                    }),
                    headerStyle: {
                      backgroundColor: "#fff",
                      color: "rgba(0,0,0,0.7)",
                    },
                    padding: "dense",
                    toolbar: false,
                    draggable: false,
                  }}
                  components={{
                    Toolbar: (props) => (
                      <div style={{ witdth: "100%" }}>
                        <MTableToolbar {...props} />
                      </div>
                    ),
                  }}
                  onSelectionChange={(rows) => {
                    //set
                    this.setState({ sampleCommon: rows });
                  }}
                  localization={{
                    body: {
                      emptyDataSourceMessage: `${t(
                        "general.emptyDataMessageTable"
                      )}`,
                    },
                  }}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      {t("general.minSalary")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="number"
                  name="minSalary"
                  value={minSalary}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      {t("general.maxSalary")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="number"
                  name="maxSalary"
                  value={maxSalary}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <Autocomplete options={listTypeOfShip ? listTypeOfShip : []}
                  value={typeOfShip}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => { this.onTypeOfShipChange(value) }}
                  renderInput={(params) => <TextField {...params} label={t("general.typeOfShip")}
                  />}
                />
              </Grid>

              {/* <Grid item sm={6} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span>
                      {t("general.salary")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="number"
                  name="salary"
                  value={salary}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid> */}

              <Grid item sm={6} xs={12}>
                <Autocomplete
                  options={listCurrency ? listCurrency : []}
                  value={currency}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => { this.onCurrencyChange(value) }}
                  renderInput={(params) => <TextField {...params} label={t("general.currency")}
                  />}
                />
              </Grid>

              <Grid item sm={6} xs={12}>
                <Autocomplete
                  options={listCertificate ? listCertificate : []}
                  value={certificate}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => { this.onCertificateChange(value) }}
                  renderInput={(params) => <TextField {...params} label={t("general.certificate")}
                  />}
                />
              </Grid>

              {/* <Grid item sm={6} xs={12}>
                <TextValidator
                  className="w-100"
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span>
                      {t("general.numberRecruit")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="number"
                  name="recruitedEmployees"
                  value={recruitedEmployees}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid> */}


              <Grid item sm={6} xs={12}>
                <Autocomplete
                  options={listShips ? listShips : []}
                  value={ships}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => { this.onShips(value) }}
                  renderInput={(params) => <TextField {...params} label={t("Dashboard.fleetOfShips")}
                  />}
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
                      {t("general.recruitmentDeadline")}
                    </span>
                  }
                  value={
                    applicationDeadline ? applicationDeadline : null
                  }
                  onChange={
                    this.handleDateChange
                  }
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
                      {t("general.estimadArrivalTime")}
                    </span>
                  }
                  value={
                    estimadArrivalTime ? estimadArrivalTime : null
                  }
                  onChange={
                    this.handleEstimadDateChange
                  }
                />

              </Grid>

              <Grid item sm={12} xs={12}>
                <Editor
                  size="small"
                  className="mb-16 mt-16"
                  value={description}
                  placeholder={t("Article.content")}
                  name="description"
                  apiKey="0uobe2c4huxovpadx797l0a3gr7nk29aup9ft8qp1rhyc90d"
                  init={{
                    language:
                      i18n.language === "en"
                        ? "en_US"
                        : "vi_VN",
                    language_url: "/lang/vi_VN.js",
                    height: 400,
                    plugins: [
                      " fullscreen advlist autolink lists link image charmap print preview anchor " +
                      " searchreplace visualblocks code fullscreen " +
                      " insertdatetime media table paste code help wordcount ",
                    ],
                    paste_data_images: true,
                    image_advtab: true,
                    automatic_uploads: true,
                    media_live_embeds: true,
                    file_picker_types: "image media",
                    file_picker_callback: function (cb) {
                      const input =
                        document.createElement("input");
                      input.setAttribute("type", "file");
                      input.setAttribute(
                        "accept",
                        "image/*, video/*"
                      );
                      input.onchange = function () {
                        const file = this.files[0];
                        if (
                          file.type.includes("image")
                        ) {
                          let urlImage =
                            ConstantList.API_ENPOINT +
                            "/public/api/image";
                          let formData =
                            new FormData();
                          formData.append(
                            "file",
                            file
                          );
                          const config = {
                            headers: {
                              "Content-Type":
                                "multipart/form-data",
                            },
                          };
                          axios
                            .post(
                              urlImage,
                              formData,
                              config
                            )
                            .then(({ data }) => {
                              cb(
                                ConstantList.API_ENPOINT +
                                "/public/api/image/" +
                                data.name
                              );
                            });
                        } else {
                          let urlVideo =
                            ConstantList.API_ENPOINT +
                            "/public/api/video/uploadVideo";

                          let formData =
                            new FormData();
                          formData.append(
                            "file",
                            file
                          );
                          const config = {
                            headers: {
                              "Content-Type":
                                "multipart/form-data",
                            },
                          };
                          axios
                            .post(
                              urlVideo,
                              formData,
                              config
                            )
                            .then(({ data }) => {
                              cb(
                                ConstantList.API_ENPOINT +
                                "/public/api/video/downloadVideo/" +
                                data.id,
                                {
                                  source:
                                    ConstantList.API_ENPOINT +
                                    "/public/api/video/downloadVideo/" +
                                    data.id,
                                }
                              );
                            });
                        }
                      };
                      input.click();
                    },
                    toolbar:
                      " fullscreen undo redo | formatselect | bold italic backcolor | image | media " +
                      " alignleft aligncenter alignright alignjustify | " +
                      " bullist numlist outdent indent | removeformat | help ",
                    fullscreen_native: true,
                  }}
                  onEditorChange={value => {
                    this.handleChangeContent(value);
                  }}
                ></Editor>
              </Grid>
              <Grid item sm={12} xs={12} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ minWidth: "fit-content" }}>
                  <label
                    htmlFor="avatarImage"

                    onClick={this.upload}
                  // className="x-center"
                  >
                    <div style={{
                      display: "flex", alignItems: "center", background: "#ffcb89",
                      borderRadius: "999px",
                      padding: "7px 14px", width: "fit-content", cursor: "pointer",
                    }}>

                      <CloudUpload className="mr-10 " />
                      <span> {t("article.image")}</span>
                    </div>
                  </label>
                  <input
                    type="file"
                    id="avatarImage"
                    name="avatarImage"
                    accept="image/*"
                    onChange={e => {
                      this.handleUploadFile(e, "image");
                    }}
                    style={{ display: "none" }}
                  />
                </div>
                <div className=" ml-10">
                  <span> {(this.state.imagePath !== "" && this.state.imagePath !== null) && this.state.imagePath}</span>
                </div>
              </Grid>


            </Grid>
          </Grid>
          <DialogActions>
            <div className="flex flex-space-between flex-middle mt-12">
              <Button
                variant="contained"
                className="mr-12"
                color="secondary"
                onClick={() => this.props.handleClose()}
              >
                {t("general.cancel")}
              </Button>
              <Button
                variant="contained"
                style={{ marginRight: "15px" }}
                color="primary"
                type="submit"
              >
                {t("general.save")}
              </Button>
            </div>
          </DialogActions>
        </ValidatorForm >




      </Dialog >
    );
  }
}

export default JobDialog;
