import React, { Component } from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Grid,
  InputLabel,
  FormControl,
  Input,
  Card,
  CardHeader,
  Tooltip,
  IconButton,
  CardContent,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import CloseIcon from "@material-ui/icons/Close";
import { addFile, getFile, addHealthReport, getHealthReport, removeHealthReport, searchByPage } from "../SailorService";
import { toast } from "react-toastify";
import moment from "moment/moment";
import ValidatePicker from "../../Component/ValidateSelect/ValidatePicker";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import ValidatedDatePicker from "app/views/Component/ValidateSelect/ValidatePicker";
import { ConfirmationDialog } from "egret";


function HealthReport(props) {
  const { dataSailor } = props
  let { t } = useTranslation();
  const [idDelete, setIdDelete] = useState('')
  const [loading, setLoading] = useState(false)
  const [viewOnly, setViewOnly] = useState(dataSailor.viewOnly)
  const [shouldOpenDeleteDialog, setShouldOpenDeleteDialog] = useState(false)
  const [healthReport, setHeathReport] = useState({
    itemList: [],
    page: 0,
  })

  useEffect(() => {
    if (dataSailor?.id) {
      getDataList(dataSailor.id);
    } else {
      handleAdd();
    }
  }, [])

  const getDataList = (id) => {
    getHealthReport(id)
      .then(({ data }) => {
        if (data?.data.length === 0) {
          handleAdd()
        } else {
          setHeathReport({ ...healthReport, itemList: data?.data })
        }
      })
      .catch(err => toast.error(err))
  }

  const handleAdd = () => {
    let item = {
      injectionTimes: "",
      expirationDate: null,
      name: "",
      fileDescription: {},
      urlUpload: "",
      upLoadedFile: "",
      commentDate: null,
    };
    healthReport.itemList.push(item);
    setHeathReport({ ...healthReport, itemList: healthReport.itemList });
  };

  const handleDelete = (idDelete) => {
    setIdDelete(idDelete)
    setShouldOpenDeleteDialog(true)
  };

  const handleChange = (event, index, source) => {
    let item = healthReport.itemList[index];
    if (source) {
      item[source] = event
    }
    item[event?.target?.name] = event?.target?.value;
    setHeathReport({ itemList: healthReport.itemList });
  };

  const handleChangeNumber = (event, index) => {
    let item = healthReport.itemList[index];
    if (/^[0-9]*$/.test(event?.target?.value)) {
      item[event?.target?.name] = parseInt(event?.target?.value) || '';
    }
    setHeathReport({ ...healthReport, itemList: healthReport.itemList });
  }

  const handleImageUpload = (upLoadedFile, index) => {
    let formData = new FormData();
    formData.append("file", upLoadedFile);
    addFile(formData).then(({ data }) => {
      healthReport.itemList[index].fileDescription = data
      setHeathReport({
        ...healthReport,
        itemList: healthReport.itemList
      })
    }).catch(err => toast.error(err))
  };

  const handleConfirmDelete = () => {
    if (healthReport.itemList[idDelete]?.id) {
      removeHealthReport(healthReport.itemList[idDelete].id)
        .then(({ data }) => {
          toast.success(t("general.deleteSuccess"))
          healthReport.itemList.splice(idDelete, 1)
          setShouldOpenDeleteDialog(false)
          getDataList(dataSailor.id)
        })
        .catch((err) => {
          toast.error(err)
        })
    } else {
      healthReport.itemList.splice(idDelete, 1)
      setShouldOpenDeleteDialog(false)
    }
  };

  const handleSubmit = () => {
    setLoading(true)
    addHealthReport(healthReport.itemList, dataSailor.id).then(({ data }) => {
      if (data.code === 200) {
        toast.success(t("general.addSuccess"))
        getDataList(dataSailor.id)
      }
      else {
        toast.error(data.message)
      }
      setLoading(false)
    }).catch(err => {
      toast.error(err.response.data.message)
      setLoading(false)
    })
  };

  return <div>
    {shouldOpenDeleteDialog && (
      <ConfirmationDialog
        title={t("confirm")}
        open={shouldOpenDeleteDialog}
        onConfirmDialogClose={() => setShouldOpenDeleteDialog(false)}
        onYesClick={handleConfirmDelete}
        text={t("Sailor.deleteConfirm")}
        cancel={"Hủy"}
        agree={"Đồng ý"}
      />
    )}
    <ValidatorForm onSubmit={() => handleSubmit()}>
      {healthReport.itemList?.map((item, index) => {
        return (
          <div
            id={index}
            key={index}
            className={index !== 0 ? "mt-10" : ""}>
            <Card elevation={5}>
              <CardHeader
                className="pb-0"
                titleTypographyProps={{
                  variant: "subtitle1",
                  className: "text-info",
                  style: { fontWeight: 500 }
                }}
                title={"Báo cáo " + (index + 1) + ":"}
                action={viewOnly ? null :
                  <Grid
                    container
                    xs={12}
                    justifyContent="flex-end">
                    <Tooltip title="Xóa báo cáo" placement="top">
                      <IconButton
                        size="small"
                        className="mr-8">
                        <CloseIcon
                          variant="contained"
                          color="error"
                          fontSize="small"
                          onClick={() => handleDelete(index)}
                        />
                      </IconButton>
                    </Tooltip >
                  </Grid>
                }
              />
              <CardContent>
                <h6 className="text-info m-0">Ngày tiêm vaccin Covid-19:</h6>
                <Grid xs={12} container spacing={1} className="mb-8">
                  <Grid item xs={4}>
                    <TextValidator
                      fullWidth
                      label={
                        <span>
                          {t("Sailor.injectionTimes")}
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      type="text"
                      name="injectionTimes"
                      value={item?.injectionTimes}
                      onChange={(e) => handleChangeNumber(e, index)}
                      inputProps={{ readOnly: viewOnly }}
                      validators={["required"]}
                      errorMessages={[t("general.required")]}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <ValidatedDatePicker
                      className="m-0"
                      fullWidth
                      format="dd/MM/yyyy"
                      margin="normal"
                      name="expirationDate"
                      label="Ngày tiêm"
                      value={item?.expirationDate || null}
                      onChange={(e) => { handleChange(e, index, "expirationDate"); }}
                      readOnly={viewOnly}
                      inputProps={{ readOly: viewOnly }}
                     
                      minDate={new Date('01/01/1900')}
                      minDateMessage={t("validateMessage.minDate") + "01/01/1900"}
                      maxDate={new Date()}
                      maxDateMessage={t("validateMessage.maxDate") + "hiện tại"}
                      invalidDateMessage={t("validateMessage.invalidDate")}
                      KeyboardButtonProps={{ "aria-label": "change date" }}
                    />
                  </Grid>
                </Grid>
                <h6 className="text-info m-0">Báo cáo y tế:</h6>
                <Grid xs={12} container spacing={1}>
                  <Grid item xs={4}>
                    <TextValidator
                      fullWidth
                      label={
                        <span>
                          {t("Sailor.reportName")}
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      type="text"
                      name="name"
                      value={item?.name || ''}
                      onChange={(e) => handleChange(e, index)}
                      inputProps={{ readOnly: viewOnly }}
                      validators={["required"]}
                      errorMessages={[t("general.required")]}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth={true}>
                      <InputLabel>
                        Upload chứng chỉ
                      </InputLabel>
                      <Input
                        type="text"
                        name="selectedFile"
                        inputProps={{ readOnly: viewOnly }}
                        value={item?.fileDescription?.name || ""}
                        endAdornment={
                          <>
                            {
                              viewOnly ? null :
                                <IconButton size="small" color="primary" aria-label="upload picture" component="label">
                                  <input
                                    hidden
                                    accept="all/*"
                                    type="file"
                                    onChange={(event) => {
                                      handleImageUpload(
                                        event.target.files[0],
                                        index
                                      );
                                    }}
                                  />
                                  <CloudUploadIcon />
                                </IconButton>
                            }
                          </>
                        }
                        margin="normal"
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <ValidatePicker
                      className="m-0"
                      fullWidth
                      format="dd/MM/yyyy"
                      margin="normal"
                      id={"commentDate " + index}
                      name="commentDate"
                      label="Ngày nhận xét"
                      value={item?.commentDate || null}
                      onChange={(e) => handleChange(e, index, "commentDate")}
                      readOnly={viewOnly}
                      inputProps={{ readOnly: viewOnly }}
                      KeyboardButtonProps={{ "aria-label": "change date", }}
                      invalidDateMessage={t("validateMessage.invalidDate")}
                      minDate={new Date('01/01/1900')}
                      minDateMessage={t("validateMessage.minDate") + "01/01/1900"}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </div>
        );
      })}

      {viewOnly ? null :
        <Grid container sm={12} justifyContent="center" className="mt-10 pr-16">
          <Button
            variant="contained"
            color="secondary"
            disabled={loading}
            className="mb-8 mr-12"
            onClick={() => handleAdd()}>
            {t("general.add")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            className="mb-8">
            {t("general.save")}
          </Button>
        </Grid>}
    </ValidatorForm>
  </div>;
}

export default HealthReport;