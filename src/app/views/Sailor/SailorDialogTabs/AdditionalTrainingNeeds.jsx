import React, { Component } from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Grid,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  Input,
  Card,
  CardHeader,
  Tooltip,
  IconButton,
  CardContent,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import AddIcon from "@material-ui/icons/Add"
import CloseIcon from "@material-ui/icons/Close";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import ValidatePicker from "../../Component/ValidateSelect/ValidatePicker";
import { addFile, getFile, addAdditionalTrainingNeeds, getAddTraining, removeAddTraining, searchByPage } from "../SailorService";
import { toast } from "react-toastify";
import moment from "moment/moment";
import { ConfirmationDialog } from "egret";
import ValidatedDatePicker from "../../Component/ValidateSelect/ValidatePicker";


function AdditionalTrainingNeeds(props) {

  const { id, dataSailor } = props
  let { t } = useTranslation();
  const [idDelete, setIdDelete] = useState('')
  const [loading, setLoading] = useState(false)
  const [viewOnly, setViewOnly] = useState(dataSailor.viewOnly)
  const [shouldOpenDeleteDialog, setShouldOpenDeleteDialog] = useState(false)
  const [addTraining, setAddTraining] = useState({
    item: {},
    itemList: [],
    page: 0,
  })

  const statusOptions = [
    { id: 1, name: "Đã hoàn thành", status: true },
    { id: 0, name: "Chưa hoàn thành", status: false },
  ]

  useEffect(() => {
    if (dataSailor?.id) {
      getDataList(dataSailor.id);
    } else {
      handleAdd();
    }
  }, [])

  const getDataList = (id) => {
    getAddTraining(id)
      .then(({ data }) => {
        if (data?.data.length === 0) {
          handleAdd()
        } else {
          setAddTraining({ ...addTraining, itemList: data.data })
        }
      })
      .catch(err => toast.error(err))
  }
  const handleAdd = () => {
    let item = {
      day: null,
      trainingContent: "",
      status: '',
      fileDescription: {},
      completionDate: null,
      upLoadedFile: '',
      certificateUrl: "",
      note: "",
    };
    addTraining.itemList.push(item);
    setAddTraining({ ...addTraining, itemList: addTraining.itemList });
  };

  const handleDelete = (idDelete) => {
    setIdDelete(idDelete)
    setShouldOpenDeleteDialog(true)
  };

  const handleChange = (event, index, source) => {
    let item = addTraining.itemList[index];
    if (source) {
      item[source] = event
    } else{
      item[event?.target?.name] = event?.target?.value;
    }
    setAddTraining({ ...addTraining, itemList: addTraining.itemList });
  };

  const handleFileUpload = (upLoadedFile, index) => {
    let formData = new FormData();
    formData.append("file", upLoadedFile);
    addFile(formData).then(({ data }) => {
      addTraining.itemList[index].fileDescription = data
      setAddTraining({
        ...addTraining,
        itemList: addTraining.itemList
      })
    }).catch(err => toast.error(err))
  };

  const handleConfirmDelete = () => {
    if (addTraining.itemList[idDelete]?.id) {
      removeAddTraining(addTraining.itemList[idDelete].id)
        .then(({ data }) => {
          toast.success("Xóa thành công")
          addTraining.itemList.splice(idDelete, 1)
          setShouldOpenDeleteDialog(false)
          getDataList(dataSailor.id)
        })
        .catch((err) => {
          toast.error(err)
        })
    } else {
      addTraining.itemList.splice(idDelete, 1)
      setShouldOpenDeleteDialog(false)
    }
  };

  const handleSubmit = () => {
    setLoading(true)
    if (dataSailor?.id) {
      addAdditionalTrainingNeeds(addTraining.itemList, dataSailor.id)
        .then(({ data }) => {
          if (data.code === 200) {
            toast.success(t("general.addSuccess"))
            getDataList(dataSailor.id)
          }
          else {
            toast.warning(data.message)
          }
        }).catch(err => {
          toast.error(err.response.data.message)
        })
      setLoading(false)
    } else {
      toast.warning(t("Sailor.addNewFirst"))
    }
  }
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
      {addTraining.itemList?.map((item, index) => {
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
                title={"Nhu cầu " + (index + 1) + ":"}
                action={viewOnly ? null :
                  <Grid
                    container
                    xs={12}
                    justifyContent="flex-end">
                    <Tooltip title="Xóa nhu cầu" placement="top">
                      <IconButton
                        size="small"
                        className="mr-8">
                        <CloseIcon
                          variant="contained"
                          color="error"
                          fontSize="small"
                          onClick={() =>
                            handleDelete(index)
                          }
                        />
                      </IconButton>
                    </Tooltip >
                  </Grid>
                }
              />
              <CardContent>
                <Grid
                  xs={12}
                  ms={12}
                  container
                  justifyContent="space-between"
                  spacing={2}
                  className="mb-8">
                  <Grid item xs={4}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <ValidatedDatePicker
                        className="m-0"
                        fullWidth
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="day"
                        name="day"
                        label="Ngày bắt đầu"
                        value={item?.day || null}
                        readOnly={viewOnly}
                        inputProps={{ readOnly: viewOnly }}
                        onChange={(e) => {
                          handleChange(e, index, "day");
                        }}
                        KeyboardButtonProps={{"aria-label": "change date",}}
                        validators={["required"]}
                        errorMessages={[t("general.required")]}
                        minDateMessage={t("validateMessage.minDate") + "01/01/1900"}
                        minDate={new Date('01/01/1900')}
                        invalidDateMessage={t("validateMessage.invalidDate")}
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={4}>
                    <TextValidator
                      fullWidth

                      label=
                      {<span>
                        {t("Nội dung đào tạo")}
                        <span style={{ color: "red" }}>
                          *
                        </span>
                      </span>}
                      type="text"
                      value={item?.trainingContent}
                      onChange={(e) => handleChange(e, index)}
                      name="trainingContent"
                      validators={["required"]}
                      errorMessages={[t("general.required")]}
                      inputProps={{ readOnly: viewOnly }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth={true}>
                      <InputLabel htmlFor="status">
                        Tình trạng
                      </InputLabel>
                      <Select
                        value={item?.status}
                        inputProps={{
                          name: "status",
                          id: "status",
                        }}
                        readOnly={viewOnly}
                        onChange={(e) =>
                          handleChange(e, index)
                        }>
                        {statusOptions.map((item) => {
                          return (
                            <MenuItem
                              key={item?.id}
                              value={item?.id}>
                              {item?.name}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid
                  xs={12}
                  ms={12}
                  container
                  justifyContent="space-between"
                  spacing={2}>
                  <Grid item xs={4}>
                      <ValidatedDatePicker
                        className="m-0"
                        fullWidth
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="completionDate"
                        name="completionDate"
                        label="Ngày kết thúc"
                        value={item?.completionDate || null}
                        inputProps={{ readOnly: viewOnly }}
                        readOnly={viewOnly}
                        onChange={(e) => {
                          handleChange(
                            e, index, "completionDate"
                          );
                        }}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        minDate={item?.day ? new Date(item?.day) : ''}
                        minDateMessage={t("validateMessage.minDate") + "bắt đầu"}
                        invalidDateMessage={t("validateMessage.invalidDate")}
                        validators={["required"]}
                        errorMessages={[t("general.required")]}
                      />
                  </Grid>
                  <Grid item xs={8}>
                    <FormControl fullWidth={true}>
                      <InputLabel>Upload chứng chỉ</InputLabel>
                      <Input
                        readOnly
                        type="text"
                        value={item?.fileDescription?.name || ''}
                        margin="normal"
                        inputProps={{ readOnly: viewOnly }}
                        endAdornment={
                          <>
                            {
                              viewOnly ? null :
                                <IconButton size="small" color="primary" aria-label="upload picture" component="label">
                                  <input
                                    hidden
                                    accept="all/*"
                                    id="upload-file"
                                    type="file"
                                    inputProps={{ readOnly: viewOnly }}
                                    onChange={(event) => {
                                      handleFileUpload(
                                        event.target.files[0],
                                        index)
                                    }}
                                  />
                                  <CloudUploadIcon />
                                </IconButton>
                            }
                          </>
                        }
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextValidator
                      fullWidth
                      label={
                        <span>
                          {t("Nhận xét")}
                          <span style={{ color: "red" }}>
                            *
                          </span>
                        </span>
                      }
                      type="text"
                      name="note"
                      value={item?.note}
                      onChange={(e) => handleChange(e, index)}
                      validators={["required"]}
                      errorMessages={[t("general.required")]}
                      className="dotted"
                      multiline
                      InputProps={{
                        disableUnderline: true,
                      }}
                      inputProps={{ readOnly: viewOnly }}
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
            disabled={loading}
            color="primary"
            type="submit"
            className="mb-8">
            {t("general.save")}
          </Button>
        </Grid>}
    </ValidatorForm>
  </div>;
}
  
export default AdditionalTrainingNeeds;