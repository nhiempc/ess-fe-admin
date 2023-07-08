import React, { Component } from "react";
import {
    Dialog,
    Button,
    Grid,
    DialogActions,
    FormControl,
    Paper,
    DialogTitle,
    DialogContent,
} from "@material-ui/core";
import { GrFormClose } from "react-icons/gr";
import TextField from "@material-ui/core/TextField";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Draggable from "react-draggable";
import NotificationPopup from "../Component/NotificationPopup/NotificationPopup";
import { makeStyles } from "@material-ui/styles";
import { saveItem, updateItem, checkCode } from "./TypeOfSailorService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

class TypeOfShipDialog extends Component {
    state = {
        id: "",
        name: "",
        code: "",
        note: "",
        shouldOpenNotificationPopup: false,
        Notification: "",
    };

    handleDialogClose = () => {
        this.setState({ shouldOpenNotificationPopup: false });
    };

    handleChange = (event, source) => {
        event.persist();
        if (source === "switch") {
            this.setState({ isActive: event.target.checked });
            return;
        }
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleFormSubmit = () => {
        let { id } = this.state;
        let { code } = this.state;
        var { t } = this.props;
        // checkCode(id, code).then((result) => {
        //     //Nếu trả về true là code đã được sử dụng
        //     if (result.data) {
        //         toast.warning(t("general.dupli_code"));
        //         // alert("Code đã được sử dụng");
        //     } else {
        //         //Nếu trả về false là code chưa sử dụng có thể dùng
        if (id) {
            updateItem({
                ...this.state,
            }).then(() => {
                toast.success(t("general.updateSuccess"));
                this.props.handleOKEditClose();
            });
        } else {
            saveItem({
                ...this.state,
            }).then(() => {
                toast.success(t("general.addSuccess"));
                this.props.handleOKEditClose();
            });
        }
        //     }
        // });
    };

    componentWillMount() {
        //getUserById(this.props.uid).then(data => this.setState({ ...data.data }));
        let { open, handleClose, item } = this.props;
        this.setState({ ...item });
    }

    render() {
        let { id, name, code, note, shouldOpenNotificationPopup } = this.state;
        let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
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
                        {id
                            ? t("general.update") + " "
                            : t("general.add") + " thông tin "}
                        loại thuyền viên
                    </h4>
                    <Button
                        aria-label="close"
                        onClick={this.props.handleClose}
                        style={{ top: "0", right: "0", position: "absolute" }}
                    >
                        <GrFormClose size={23} />
                    </Button>
                </DialogTitle>

                <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
                    <DialogContent>
                        <Grid className="" container spacing={2}>
                            <Grid item sm={6} xs={6}>
                                <TextValidator
                                    fullWidth
                                    label={
                                        <span>
                                            <span style={{ color: "red" }}>
                                                *
                                            </span>
                                            {" " +
                                                t("general.name") +
                                                " loại thuyền viên"}
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

                            <Grid item sm={6} xs={6}>
                                <TextValidator
                                    className="w-100 "
                                    label={
                                        <span>
                                            <span style={{ color: "red" }}>
                                                *
                                            </span>
                                            {" " +
                                                t("general.code") +
                                                " loại thuyền viên"}
                                        </span>
                                    }
                                    onChange={this.handleChange}
                                    type="text"
                                    name="code"
                                    value={code}
                                    validators={["required"]}
                                    errorMessages={[t("general.required")]}
                                />
                            </Grid>
                            <Grid item sm={12} xs={12} className="mt-10">
                                <TextField
                                    className="note"
                                    id="standard-textarea"
                                    fullWidth
                                    label={[t("general.note")]}
                                    onChange={this.handleChange}
                                    placeholder="Thêm mô tả"
                                    multiline
                                    name="note"
                                    value={note}
                                    validators={["required"]}
                                    errorMessages={[t("general.required")]}
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
                </ValidatorForm>
            </Dialog>
        );
    }
}

export default TypeOfShipDialog;
