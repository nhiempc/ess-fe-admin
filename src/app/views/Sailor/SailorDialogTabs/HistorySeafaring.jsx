import React, { Component } from "react";
import {
    Dialog,
    Button,
    Grid,
    InputLabel,
    FormControl,
    MenuItem,
    Select,
    Checkbox,
    TextField,
    FormControlLabel,
    Collapse,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
// import { getUserByUsername, saveUser, addNewUser, getAllRoles } from "./UserService";
// import AsynchronousAutocomplete from "../utilities/AsynchronousAutocomplete";
import {
    KeyboardDatePicker,
    MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import color from "material-ui/colors/amber";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function HistorySeafaring(props) {
  const { viewOnly, id } = props
  let { t } = useTranslation();
  const [historySeafaring, setHitorySafaering] = useState({})

  useEffect(() => {


  }, [props])

  const handleSubmit = () => {};

  return (
  <Grid xs={12} ms={12} container spacing={2} className="mb-8">
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Thăng chức"
                        type="text"
                        name="promote"
                        inputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Cơ quan quản lý"
                        type="text"
                        name="manager"
                        inputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="CBA"
                        type="text"
                        name="cba"
                        inputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Hợp đồng"
                        type="text"
                        name="contract"
                        inputProps={{ readOnly: true }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Cơ quan thủy thủ đoàn"
                        type="text"
                        name="sailorAgency"
                        inputProps={{ readOnly: true }}
                    />
                </Grid>
            </Grid>)
}

export default HistorySeafaring;