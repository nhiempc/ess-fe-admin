import React, { Component, useEffect, useState } from "react";
import {
    Dialog,
    Button,
    Grid,
    DialogActions,
    Paper,
    DialogTitle,
    DialogContent,
} from "@material-ui/core";
import { GrFormClose } from "react-icons/gr";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Draggable from "react-draggable";
import { saveItem, updateItem } from "./CoursesService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isSpecialCharacters, isText } from "app/appFunction";
import { appConst } from "app/AppConst";

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

function CoursesDialog(props) {
    const {
        open,
        t,
        item,
        handleClose
    } = props;

    const [itemCourse, setItemCourse] = useState({...item});

    useEffect(() => {
        ValidatorForm.addValidationRule("isSpecialCharacters", isSpecialCharacters)
        ValidatorForm.addValidationRule("isText", isText)
    }, []);

    const handleChange = (e) => {
        setItemCourse({
            ...itemCourse,
            [e.target.name]: e.target.value,
        })
    }

    const handleFormSubmit = () => {
        const { id, code, name, note } = itemCourse;
        const courseInfo = {
            id: id,
            name: name,
            code: code,
            note: note
        }

        if (id) {
            updateItem(courseInfo)
                .then(({data}) => {
                    if (appConst.CODE.SUCCESS === data?.code) {
                        toast.success(t("general.updateSuccess"));
                    } else {
                        toast.warning(data?.message);
                    }
                    props.handleOKEditClose();
                })
                .catch(() => {
                    toast.error(t("general.error"));
                });
        } else {
            saveItem(courseInfo)
                .then(({data}) => {
                    if (appConst.CODE.SUCCESS === data?.code) {
                        toast.success(t("general.addSuccess"));
                    } else {
                        toast.warning(data?.message);
                    }
                    props.handleOKEditClose();
                })
                .catch(() => {
                    toast.error(t("general.error"));
                });
        }
    };

    return (
        <Dialog
            open={open}
            PaperComponent={PaperComponent}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle
                style={{ cursor: "move", paddingBottom: "0px" }}
                id="draggable-dialog-title"
            >
                <h4 className="">
                    {item?.id
                        ? t("courses.updateDialog")
                        : t("courses.addDialog")}
                </h4>
                <Button
                    aria-label="close"
                    onClick={handleClose}
                    style={{ top: "0", right: "0", position: "absolute" }}
                >
                    <GrFormClose size={23} />
                </Button>
            </DialogTitle>

            <ValidatorForm onSubmit={handleFormSubmit}>
                <DialogContent>
                    <Grid className="" container spacing={2}>
                        <Grid item sm={6} xs={6}>
                            <TextValidator
                                className="w-100 "
                                label={
                                    <span>
                                        <span className="colorRed">*</span>
                                        <span>{t("courses.name")}</span>
                                    </span>
                                }
                                onChange={handleChange}
                                type="text"
                                name="name"
                                value={itemCourse?.name || ""}
                                validators={[
                                    "required",
                                    "isText",
                                    "matchRegexp:^.{1,255}$"
                                ]}
                                errorMessages={[
                                    t("general.required"),
                                    t("general.isText"),
                                    t("general.isCharactersLength255")
                                ]}
                            />
                        </Grid>

                        <Grid item sm={6} xs={6}>
                            <TextValidator
                                className="w-100 "
                                label={
                                    <span>
                                        <span className="colorRed">*</span>
                                        <span>{t("courses.code")}</span>
                                    </span>
                                }
                                onChange={handleChange}
                                type="text"
                                name="code"
                                value={itemCourse?.code || ""}
                                validators={[
                                    "required",
                                    "matchRegexp:^[a-zA-Z0-9-_]*$",
                                    "matchRegexp:^.{1,255}$"]}
                                errorMessages={[
                                    t("general.required"),
                                    "Chỉ bao gồm các ký tự A-Z, a-z, 0-9, -, _",
                                    t("general.isCharactersLength255")
                                ]}
                            />
                        </Grid>
                        <Grid item sm={12} xs={12} className="mt-10">
                            <TextValidator
                                className="w-100"
                                id="standard-textarea"
                                fullWidth
                                label={[t("courses.note")]}
                                onChange={handleChange}
                                placeholder="Thêm mô tả"
                                multiline
                                name="note"
                                value={itemCourse?.note || ""}
                                validators={["isSpecialCharacters", "matchRegexp:^.{1,255}$"]}
                                errorMessages={[t("general.isSpecialCharacters"), t("general.isCharactersLength255")]}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <div className="flex flex-space-between flex-middle mt-12">
                        <Button
                            variant="contained"
                            className="mr-12"
                            color="secondary"
                            onClick={handleClose}
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
            </ValidatorForm>
        </Dialog>
    );
}

export default CoursesDialog;
