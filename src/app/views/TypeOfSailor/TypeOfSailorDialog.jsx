import React, { useEffect, useState } from "react";
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
import { saveItem, updateItem } from "./TypeOfSailorService";
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

function TypeOfShipDialog(props) {
    const {
        open,
        t,
        item,
        handleClose
    } = props;

    const [itemSailor, setItemSailor] = useState({...item});

    useEffect(() => {
        ValidatorForm.addValidationRule("isSpecialCharacters", isSpecialCharacters)
        ValidatorForm.addValidationRule("isText", isText)
    }, []);

    const handleChange = (e) => {
        setItemSailor({
            ...itemSailor,
            [e.target.name]: e.target.value,
        })
    }

    const handleFormSubmit = () => {
        let { id } = itemSailor;
        if (id) {
            updateItem(itemSailor).then(({data}) => {
                if(data?.code === appConst.CODE.SUCCESS) {
                    toast.success(t("general.updateSuccess"));
                } else {
                    toast.warning(data?.message)
                }
                props.handleOKEditClose();
            });
        } else {
            saveItem(itemSailor).then(({data}) => {
                if(data?.code === appConst.CODE.SUCCESS) {
                    toast.success(t("general.addSuccess"));
                } else {
                    toast.warning(data?.message)
                }
                props.handleOKEditClose();
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
                        ? t("typeOfSailor.updateDialog")
                        : t("typeOfSailor.addDialog")}
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
                                        <span>{t("typeOfSailor.name")}</span>
                                    </span>
                                }
                                onChange={handleChange}
                                type="text"
                                name="name"
                                value={itemSailor?.name || ""}
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
                                        <span>{t("typeOfSailor.code")}</span>
                                    </span>
                                }
                                onChange={handleChange}
                                type="text"
                                name="code"
                                value={itemSailor?.code || ""}
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
                                label={[t("typeOfSailor.note")]}
                                onChange={handleChange}
                                placeholder="Thêm mô tả"
                                multiline
                                name="note"
                                value={itemSailor?.note || ""}
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

export default TypeOfShipDialog;
