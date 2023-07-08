import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  Card,
  CardContent,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import {
  addPassportAndSailorBook,
  deletePassportAndSailorBook, editPassportAndSailorBook,
  getPassportAndSailorBook,
} from "../SailorService";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import ValidatedDatePicker from "../../Component/ValidateSelect/ValidatePicker";
import { useState, useEffect } from "react";
import moment from "moment";

function PassportAndCrewBook(props) {
  const { dataSailor } = props
  let { t } = useTranslation();
  const [viewOnly, setViewOnly] = useState(false)
  const [loading, setLoading] = useState(false)
  const [crewInfor, setCrewInfor] = useState({
    releaseDateBook: null,
    expirationDatePassport: null,
    releaseDateCrewBook: null,
    expirationDateCrewBook: null,
    passportBook: null,
    publishedPlaceCrewBook: '',
    crewCode: '',
    publishedPlacePassport: '',
    sailorId: '',
    id: ''
  })

  const getPassportAndSailorBookList = (id) => {
    let searchObject = {};
    searchObject.keyword = "";
    searchObject.pageIndex = 1;
    searchObject.pageSize = 999;
    getPassportAndSailorBook(searchObject)
      .then(({ data }) => {
        let passportAndCrew = data?.find(item => item.sailorId === id)
        setCrewInfor({
          ...passportAndCrew
        })
      })
      .catch(err => toast.error(err))
  }

  useEffect(() => {
    setViewOnly(dataSailor?.viewOnly)
    if (dataSailor?.id) {
      getPassportAndSailorBookList(dataSailor.id)
    } else {
      getPassportAndSailorBookList()
    }

  }, [])

  const handleDelete = (id) => {
    if (id) {
      deletePassportAndSailorBook(id).then((res) => {
        if (res?.data.code === 200) {
          toast.success(t("Sailor.passport.delete"));
          clearFormData();
        } else toast.warning(res.data.message)
      }).catch((err) => {
        toast.error(err)
      })
    } else {
      clearFormData();
    }
  }

  const clearFormData = () => {
    setCrewInfor({
      releaseDateBook: null,
      releaseDateCrewBook: null,
      expirationDatePassport: null,
      expirationDateCrewBook: null,
      passportBook: null,
      crewCode: '',
      publishedPlaceCrewBook: '',
      publishedPlacePassport: '',
      sailorId: null,
      id: ''
    })
  }

  const handleChange = (event) => {
    setCrewInfor({ ...crewInfor, [event?.target?.name]: event?.target?.value })
  };

  const handleDateChange = (event, source) => {
    setCrewInfor({ ...crewInfor, [source]: event })
  };

  const handleResponseSubmit = (data) => {
    if (data?.code === 200) {
      toast.success(t("general.saveSuccess"))
      getPassportAndSailorBookList(dataSailor.id)
    }
    else {
      toast.error(data?.message)
    }
    setLoading(false)
  }

  const handleSubmit = () => {
    setLoading(true)
    if (crewInfor?.sailorId) {
      editPassportAndSailorBook(crewInfor, crewInfor.id)
        .then(({ data }) => {
          handleResponseSubmit(data)
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setLoading(false)
        });
    } else {
      addPassportAndSailorBook(crewInfor, dataSailor?.id)
        .then(({ data }) => {
          handleResponseSubmit(data)
        }).catch((err) => {
          toast.error(err.response.data.message);
          setLoading(false)
        });
    }
  };

  return <div>
    <ValidatorForm onSubmit={() => handleSubmit()}>
      <Card elevation={0}>
        <CardContent>
          <Grid xs={12} container spacing={1}>
            <Grid item ms={3} xs={3}>
              <TextValidator
                fullWidth
                multiline
                label={t("Sailor.passport.number")}
                type="text"
                name="passportBook"
                InputProps={{ readOnly: viewOnly }}
                value={crewInfor?.passportBook || ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item ms={3} xs={3}>
              <TextValidator
                fullWidth
                label={
                  <span>
                    {t("Sailor.passport.place")}
                    <span hidden={!crewInfor?.passportBook} style={{ color: "red" }}>
                      *
                    </span>
                  </span>
                }
                type="text"
                name="publishedPlaceCrewBook"
                value={crewInfor?.publishedPlaceCrewBook || ''}
                inputProps={{ readOnly: viewOnly }}
                onChange={handleChange}
                validators={crewInfor?.passportBook ? ["required"] : []}
                errorMessages={crewInfor?.passportBook ? [t("general.required")] : []}
              />
            </Grid>
            <Grid item ms={3} xs={3}>
              <ValidatedDatePicker
                className="m-0"
                fullWidth
                format="dd/MM/yyyy"
                placeholder="dd/MM/yyyy"
                margin="normal"
                id="releaseDateBook"
                label={
                  <span>
                    {t("Sailor.passport.release")}
                    <span hidden={!crewInfor?.passportBook} style={{ color: "red" }}>
                      *
                    </span>
                  </span>
                }
                value={crewInfor?.releaseDateBook || null}
                InputProps={{ readOnly: viewOnly }}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleDateChange(e, "releaseDateBook")}
                KeyboardButtonProps={{ "aria-label": "change date", }}
                invalidDateMessage={"Ngày không hợp lệ"}
                minDate={new Date('01/01/1900')}
                minDateMessage = {t("validateMessage.minDate") + "01/01/1900"}
                maxDate={ new Date()}
                maxDateMessage={t("validateMessage.maxDate") + "ngày hiện tại"}
                validators={crewInfor?.passportBook ? ["required"] : []}
                errorMessages={crewInfor?.passportBook ? [ t("general.required")] : []}
              />
            </Grid>
            <Grid item ms={3} xs={3}>
              <ValidatedDatePicker
                className="m-0"
                fullWidth
                format="dd/MM/yyyy"
                placeholder="dd/MM/yyyy"
                margin="normal"
                id="expirationDatePassport"
                label={
                  <span>
                    {t("Sailor.passport.expiry")}
                    <span hidden={!crewInfor?.passportBook} style={{ color: "red" }}>
                      *
                    </span>
                  </span>
                }
                value={crewInfor?.expirationDatePassport || null}
                InputProps={{ readOnly: viewOnly }}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleDateChange(e, "expirationDatePassport")}
                KeyboardButtonProps={{ "aria-label": "change date" }}
                minDate={crewInfor?.releaseDateBook || new Date()}
                minDateMessage={t("validateMessage.minDate") + "ngày phát hành"}
                invalidDateMessage={t("validateMessage.invalidDate")}
                validators={crewInfor?.passportBook ? ["required"] : []}
                errorMessages={crewInfor?.passportBook ? [ t("general.required")] : []}
              
              />
            </Grid>
          </Grid>
          <Grid xs={12} container spacing={1} className="mb-30">
            <Grid item ms={3} xs={3}>
              <TextValidator
                fullWidth
                label={
                  <span>
                    {t("Sailor.passport.code")}
                    <span style={{ color: "red" }}>
                      *
                    </span>
                  </span>
                }
                type="text"
                name="crewCode"
                multiline
                value={crewInfor?.crewCode}
                inputProps={{ readOnly: viewOnly }}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={[t("general.required")]}
              />
            </Grid>
            <Grid item ms={3} xs={3}>
              <TextValidator
                fullWidth
                label={
                  <span>
                    {t("Sailor.book.place")}
                    <span style={{ color: "red" }}>
                      *
                    </span>
                  </span>
                }
                type="text"
                name="publishedPlacePassport"
                value={crewInfor?.publishedPlacePassport}
                inputProps={{ readOnly: viewOnly }}
                onChange={handleChange}
                validators={["required"]}
                errorMessages={[t("general.required")]}
              />
            </Grid>
            <Grid item ms={3} xs={3}>
              <ValidatedDatePicker
                className="m-0"
                fullWidth
                format="dd/MM/yyyy"
                placeholder="dd/MM/yyyy"
                margin="normal"
                id="releaseDateCrewBook"
                label={
                  <span>
                    {t("Sailor.book.release")}
                    <span style={{ color: "red" }}>
                      *
                    </span>
                  </span>
                }
                value={crewInfor?.releaseDateCrewBook || null}
                InputProps={{ readOnly: viewOnly }}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleDateChange(e, "releaseDateCrewBook")}
                KeyboardButtonProps={{ "aria-label": "change date", }}
                maxDate={new Date()}
                maxDateMessage={t("validateMessage.maxDate") + "hiện tại"}
                minDateMessage={t("validateMessage.minDate") + "01/01/1900"}
                minDate={new Date('01/01/1900')}
                invalidDateMessage={t("validateMessage.invalidDate")}
                validators={["required"]}
                  errorMessages={[t("general.required")]}
              />
            </Grid>
            <Grid item ms={3} xs={3}>
              <ValidatedDatePicker
                className="m-0"
                fullWidth
                format="dd/MM/yyyy"
                placeholder="dd/MM/yyyy"
                margin="normal"
                label={
                  <span>
                    {t("Sailor.book.expiry")}
                  </span>
                }
                value={crewInfor?.expirationDateCrewBook || null}
                InputProps={{ readOnly: viewOnly }}
                InputLabelProps={{ shrink: true }}
                onChange={(e) => handleDateChange(e, "expirationDateCrewBook")}
                KeyboardButtonProps={{ "aria-label": "change date", }}
                minDate={crewInfor?.releaseDateCrewBook || Date.now()}
                minDateMessage={t("validateMessage.minDate") + "ngày phát hành"}
                invalidDateMessage={t("validateMessage.invalidDate")}
               
              />
            </Grid>
          </Grid>
          {viewOnly ? null :
            <Grid container xs={12} spacing={2} justifyContent="center" className="mt-16">
              <Button
                variant="contained"
                className="mr-12"
                color="secondary"
                disabled={loading}
                onClick={() => handleDelete(crewInfor?.id)}
              >
                {t("general.delete")}
              </Button>
              <Button
                variant="contained"
                disabled={loading}
                color="primary"
                type="submit">
                {t("general.save")}
              </Button>
            </Grid>
          }
        </CardContent>
      </Card>

    </ValidatorForm>
  </div>;
}

export default PassportAndCrewBook;
