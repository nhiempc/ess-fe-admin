import React, { Component } from "react";
import {
  Button,
  Grid,
  Card,
  CardHeader,
  IconButton,
  Tooltip,
  CardContent,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CloseIcon from "@material-ui/icons/Close";
import { addCompleteTrainingCourse, getCompleteTrainingCourseByIdSailor, removeTraining, searchByPage } from "../SailorService";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment/moment";
import { ConfirmationDialog } from "egret";
import ValidatePicker from "../../Component/ValidateSelect/ValidatePicker";
import ValidatedDatePicker from "../../Component/ValidateSelect/ValidatePicker";

function Training(props) {
  const { dataSailor } = props
  let { t } = useTranslation();
  const [idDelete, setIdDelete] = useState('')
  const [loading, setLoading] = useState(false)
  const [shouldOpenDeleteDialog, setShouldOpenDeleteDialog] = useState(false)
  const [viewOnly, setViewOnly] = useState(dataSailor.viewOnly)
  const [training, setTraining] = useState({
    item: {},
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
    getCompleteTrainingCourseByIdSailor(id)
      .then(({ data }) => {
        if (data?.data.length === 0) {
          handleAdd()
        } else {
          setTraining({ ...training, itemList: data.data })
        }
      })
      .catch(err => toast.error(err))
  }

  const handleAdd = () => {
    let item = {
      course: "",
      codeCourse: "",
      nameCourse: "",
      typeOfCourse: "",
      participatingDepartments: "",
      document: "",
      readingDay: null,
      startDate: null,
      endDate: null,
    };
    training.itemList.push(item);
    setTraining({ ...training, itemList: training.itemList });
  }

  const handleDelete = (idDelete) => {
    setIdDelete(idDelete)
    setShouldOpenDeleteDialog(true)
  };

  const handleChange = (event, index, source) => {
    let item = training?.itemList[index];
    if (source) {
      item[source] = event
    }
    item[event?.target?.name] = event?.target?.value;
    setTraining({ ...training, itemList: training.itemList });
  }

  const handleConfirmDelete = () => {
    if (training?.itemList[idDelete]?.id) {
      removeTraining(training.itemList[idDelete].id)
        .then(({ data }) => {
          toast.success(t("general.deleteSuccess"))
          training.itemList.splice(idDelete, 1)
          setShouldOpenDeleteDialog(false)
          getDataList(dataSailor.id)
        })
        .catch((err) => {
          toast.error(err)
        })
    } else {
      training.itemList.splice(idDelete,1);
      setShouldOpenDeleteDialog(false)
    }
  };

  const handleSubmit = () => {
    setLoading(true)
    addCompleteTrainingCourse(training.itemList, dataSailor.id).then(({ data }) => {
      if (data.code === 200) {
        toast.success(t("general.addSuccess"))
        getDataList(dataSailor.id)
      } else {
        toast.warning(data.message)
      }
      setLoading(false)
    }).catch(err => {
      toast.error(err.response.data.message)
      setLoading(false)
    })
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
      {training.itemList?.map((item, index) => {
        return (
          <div id={index} key={index} className={index !== 0 ? "mt-10" : ""}>
            <Card elevation={5}>
              <CardHeader
                className="pb-0"
                titleTypographyProps={{
                  variant: "subtitle1",
                  className: "text-info",
                  style: { fontWeight: 500 }
                }}
                title={"Khóa đào tạo " + (index + 1) + ":"}
                action={viewOnly ? null :
                  <Grid
                    container
                    xs={12}
                    justifyContent="flex-end">
                    <Tooltip title="Xóa khóa đào tạo" placement="top">
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
                  justifyContent="space-around"
                  spacing={2}>
                  <Grid item xs={4}>
                    <TextValidator
                      fullWidth
                      label={
                        <span>
                          Khóa học
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      type="text"
                      name="nameCourse"
                      value={item?.nameCourse}
                      inputProps={{ readOnly: viewOnly }}
                      onChange={(e) => handleChange(e, index)}
                      validators={["required"]}
                      errorMessages={[t("general.required")]}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <ValidatedDatePicker
                        className="m-0"
                        fullWidth
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="startDate"
                        name="startDate"
                        label="Ngày bắt đầu"
                        inputProps={{ readOnly: viewOnly }}
                        readOnly={viewOnly}
                        value={item?.startDate || null}
                        onChange={(e) => handleChange(e, index, "startDate")}
                        KeyboardButtonProps={{ "aria-label": "change date" }}
                        minDate={new Date('01/01/1900')}
                        minDateMessage={t("validateMessage.minDate") + "01/01/1900"}
                        maxDate={new Date()}
                        maxDateMessage={t("validateMessage.maxDate") + "hiện tại"}
                        invalidDateMessage={t("validateMessage.invalidDate")}
                      
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                  <Grid item xs={4}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <ValidatedDatePicker
                        className="m-0"
                        fullWidth
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="endDate"
                        name="endDate"
                        label="Ngày kết thúc"
                        inputProps={{ readOnly: viewOnly }}
                        value={item?.endDate || null}
                        onChange={(e) => handleChange(e, index, "endDate")}
                        minDate={item?.startDate ? new Date(item?.startDate) : new Date('01/01/1900')}
                        KeyboardButtonProps={{ "aria-label": "change date" }}
                        minDateMessage={ 
                          item?.startDate 
                          ? t("validateMessage.minDate") + "bắt đầu" 
                          : t("validateMessage.minDate") + "01/01/1900"
                        }
                        invalidDateMessage={t("validateMessage.invalidDate")}
                     
                      />
                    </MuiPickersUtilsProvider>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </div>
        )
      })}

      {viewOnly ? null :
        <Grid container sm={12} justifyContent="center" className="mt-10 pr-16">
          <Button
            variant="contained"
            color="secondary"
            className="mb-8 mr-12"
            disabled={loading}
            onClick={() => handleAdd()}>
            {t("general.add")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            type="submit"
            className="mb-8">
            {t("general.save")}
          </Button>
        </Grid>}
    </ValidatorForm>
  </div>;
}

export default Training;
