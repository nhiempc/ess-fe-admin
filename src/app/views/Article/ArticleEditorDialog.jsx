import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle, Grid,
	Paper,
	InputLabel,
	FormControl,
	MenuItem,
	Select,
	Icon,
	Divider,
	Card
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { Block, CloudUpload, FlashOnRounded, Save } from "@material-ui/icons";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import React, { Component } from "react";
import Draggable from "react-draggable";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import AppConst from '../../AppConst'
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConstantList from "../../appConfig";
import ValidatePicker from "../Component/ValidateSelect/ValidatePicker";
import {
	addNewArticle,
	updateArticle
} from "./ArticleService";

import {
	searchByPage
} from "../Category/CategoryService";

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

const requireLabel = item => {
	return (
		<>
			{item}
			<span style={{ color: "red", fontWeight: "bold" }}>*</span>
		</>
	);
};

class ArticleEditorDialog extends Component {
	state = {
		item: {},
		content: "",
		title: "",
		summary: "",
		titleImageUrl: "",
		files: [],
		listImage: [],
		urlVideo: "",
		publishDate: null,
		view: "",
		subtitle: "",
		slug: "",
		noteAvatarImage: "",
		realAuthor: "",
		note: "",
		tags: "",
		source: "",
		listArticleCategory: [],
		category: '',
		categoryDto: null,
		avatarImage: null,
		shouldOpenSelectTopic: false,
		shouldOpenUploadFile: false,
		id: null,
		language: this.props.i18n.language === "vi" ? 1 : 0,
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

	handleSelectChange = (event, actions) => {
		console.log(event.target)
		this.setState({
			...this.state,
			[event.target.name]: event.target.value,
		})
	}
	handleFormSubmit = () => {
		// console.log(this.state.files);
		// for (let file of this.state.listImage) {
		// 	this.setState({
		// 		listImage: [
		// 			...this.state.listImage,
		// 			{
		// 				imageUrl: file.file.name
		// 			}
		// 		]
		// 	})
		// }
		const { t } = this.props;
		const { id } = this.state;

		if (id) {
			updateArticle({
				...this.state,
			})
				.then(() => {
					toast.success(t("general.updateSuccess"));
					this.props.handleOKDialog();
				})
				.catch(() => {
					toast.error(t("general.error"));
					this.props.handleClose();
				});
		} else {
			addNewArticle({
				...this.state,
			})
				.then(() => {
					toast.success(t("general.addSuccess"));
					this.props.handleOKDialog();
				})
				.catch(() => {
					toast.error(t("general.error"));
				});
		}
	};

	componentDidMount() {
		if (this.props.item) {
			this.setState({ ...this.props.item });
		}
		this.getListArticleCategory();
	}

	openParentPopup = () => {
		this.setState({
			shouldOpenSelectTopic: true,
		});
	};

	handleSelectItem = (e, value) => {
		this.setState({
			categories: value,
		});
	};

	handleDialogClose = () => {
		this.setState({
			shouldOpenSelectTopic: false,
			shouldOpenUploadFile: false,
		});
	};

	handleDateChange = (value, source) => {
		this.setState({ publishDate: value });
	};

	handleUploadFile = (e, type) => {
		let { t } = this.props;
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
				console.log(data);
				this.setState({
					titleImageUrl: data.name
				});
				toast.info(t("general.uploadSuccess"));
			})
			.catch(() => toast.error("Tải lên ảnh bị lỗi"));
	};

	handleFileSelect = (event) => {
		let files = event.target.files;
		console.log(event.target.files);
		let list = [...this.state.listImage];
		let index;
		// let list = [];

		for (const iterator of files) {
			console.log(iterator);
			index = list.push({
				file: iterator
			});
			console.log(index);
		}
		this.setState({
			listImage: list,
		}, () => {
			if (files) {
				this.uploadSingleFile(index - 1)
			}
		});
	};

	uploadSingleFile = async (index) => {
		let { t } = this.props;
		let allFiles = [...this.state.listImage];

		let file = this.state.listImage[index];
		if (file.file == undefined) {
			return;
		}

		const url =
			ConstantList.API_ENPOINT +
			"/public/api/image";
		let formData = new FormData();
		formData.append("file", file.file);

		const config = {
			headers: {
				"Content-Type": "multipart/form-data",
			},
		};
		await axios.post(url, formData, config).then((successResponse) => {
			console.log(successResponse.data.name);
			toast.info(t("general.uploadSuccess"));
			allFiles[index] = { imageUrl: successResponse.data.name };
			// setTimeout(() => {
				this.setState({
					listImage: allFiles,
				});
			// }, 50)
		}).catch((e) => {
			if (e.response?.status === 409) {
				toast.error(t("general.fileExist"));
			} else if (e.response?.status === 400) {
				toast.error(t("general.uploadFail"));
			}
			allFiles.splice(index, 1);
			this.setState(
				{
					listImage: [...allFiles]
				},
				() => { }
			);
		});
	};

	handleSingleRemove = (index) => {
		let listImage = [...this.state.listImage];
		listImage.splice(index, 1);
		this.setState(
			{
				listImage: [...listImage],
			},
			() => { }
		);
	};

	handleSingleRemoveItem = (index) => {
		let listImage = [...this.state.listImage];
		listImage.splice(index, 1);
		this.setState(
			{
				listImage: [...listImage],
			},
			() => { }
		);
	};





	handleChangeContent = data => {
		this.setState({
			content: data,
		});
		console.log(data);
	};

	handleChangeStatus = e => {
		this.setState({
			status: Number.parseInt(e.target.value),
		});
	};

	getListArticleCategory = () => {
		var searchObject = {};
		searchObject.keyword = "";
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = 999;
		searchByPage(searchObject).then(({ data }) => {
			this.setState({
				listArticleCategory: [...data.content],
			});
		});
	};

	render() {
		const { open, handleClose, t, i18n } = this.props;
		const {
			id,
			content,
			title,
			summary,
			publishDate,
			view,
			subtitle,
			slug,
			noteAvatarImage,
			realAuthor,
			note,
			tags,
			source,
			listArticleCategory,
			shouldOpenUploadFile,
			categoryDto,
			category
		} = this.state;
		let isEmpty = this.state.listImage.length === 0;

		return (
			<Dialog
				onClose={handleClose}
				open={open}
				fullScreen
				fullWidth
				PaperComponent={PaperComponent}
			>
				<DialogTitle
					style={{ cursor: "move" }}
					id="draggable-dialog-title"
				>
					{(id ? t("general.update") : t("general.add")) +
						" " +
						t("article.articleTitle")}
				</DialogTitle>

				<ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
					<DialogContent dividers className="overflowX-hidden overflowY-hidden">
						<Grid container spacing={3} justifyContent="space-between">
							<Grid item sm={8} xs={12}>
								<TextValidator
									size="small"
									className="w-100 mb-16"
									label={requireLabel(t("article.title"))}
									onChange={this.handleChange}
									type="text"
									name="title"
									value={title}
									validators={["required"]}
									errorMessages={[`${t("general.required")}`]}
								/>
								{/* <TextValidator
									size="small"
									className="w-100 mb-16"
									label={t("article.subtitle")}
									onChange={this.handleChange}
									type="text"
									name="subtitle"
									value={subtitle}
								/> */}
								<TextValidator
									size="small"
									className="w-100 mb-16"
									label={t("article.summary")}
									onChange={this.handleChange}
									type="text"
									name="summary"
									value={summary}
								/>
								{/* <TextValidator
									size="small"
									className="w-100 mb-16"
									label={"slug"}
									onChange={this.handleChange}
									type="text"
									name="slug"
									value={slug}
								/> */}
								<Grid
									item
									container
									spacing={2}
									alignItems="flex-end"
									className="mb-20"
								>
									{/* <Grid item xs={4} sm={4}>
										<TextValidator
											size="small"
											className="w-100"
											label={t("article.tags")}
											onChange={this.handleChange}
											type="text"
											name="tags"
											value={tags}
										/>
									</Grid> */}
									<Grid item sm={4}>
										<ValidatePicker
											size="small"
											type="text"
											autoOk
											format="dd/MM/yyyy"
											className="w-100"
											id="date-picker-inline"
											label={t("article.publishDate")}
											value={
												publishDate ? publishDate : null
											}
											onChange={resultDate =>
												this.handleDateChange(
													resultDate,
													"publishDate"
												)
											}
											fullWidth
										/>
									</Grid>
									<Grid item sm={4}>
										<FormControl
											className="w-100"
										>
											<InputLabel id="demo-simple-select-label">{t("Dashboard.subcategory.article")}</InputLabel>
											<Select
												id="categories-simple-select"
												className="w-100"
												name="category"
												value={category}
												onChange={(event, actions) => this.handleSelectChange(event, actions)}
											>
												{
													AppConst.LIST_CATEGORIES.map((item) => {
														return (<MenuItem value={item.value}>{item.label}</MenuItem>)
													})
												}
											</Select>
										</FormControl>
									</Grid>
									<Grid item xs={12} className="mt-10">
										<label htmlFor="upload-single-file" className="mt-10">

											<Button
												disabled={this.props.disabled}
												size="small"
												className="capitalize background__color"
												component="span"
												variant="contained"
											//color="primary"
											>
												<div className="flex flex-middle">
													<span>{t("general.select_file_image")}</span>
												</div>
											</Button>

										</label>
										<input
											disabled={this.props.disabled}
											className="display-none"
											onChange={this.handleFileSelect}
											onClick={e => { e.target.value = null }}
											id="upload-single-file"
											type="file"
										/>
										<div className="px-16"></div>

										<Card className="mb-24 mt-12" elevation={2}>
											<div className="p-16">
												<Grid
													container
													spacing={2}
													justify="center"
													alignItems="center"
													direction="row"
												>
													<Grid item lg={6} md={6}>
														{t("general.file_name")}
													</Grid>
													<Grid item lg={4} md={4}>
														{t("general.action")}
													</Grid>
												</Grid>
											</div>
											<Divider></Divider>

											{isEmpty && (
												<p className="px-16 center">{t("general.empty_file")}</p>
											)}

											{
											this.state.listImage &&
												this.state.listImage.map((row, index) => {
													return (
														<div className="px-16 py-16" key={row?.imageUrl}>
															<Grid
																container
																spacing={2}
																justify="center"
																alignItems="center"
																direction="row"
															>
																<Grid item lg={6} md={6} sm={12} xs={12}>
																	{row?.imageUrl}
																</Grid>
																<Grid item lg={1} md={1} sm={12} xs={12}>
																	{row?.error && <Icon color="error">error</Icon>}
																</Grid>
																<Grid item lg={4} md={4} sm={12} xs={12}>
																	<div className="flex">

																		<Button
																			disabled={this.props.disabled}
																			className="mx-8 bg-error"
																			variant="contained"
																			onClick={() => this.handleSingleRemoveItem(index)}
																		>
																			{t("general.remove")}
																		</Button>

																	</div>
																</Grid>
															</Grid>
														</div>
													);
												})
												// : 
												// this.state.files.map((row, index) => {
												// 	return (
												// 		<div className="px-16 py-16" key={row?.file?.name}>
												// 			<Grid
												// 				container
												// 				spacing={2}
												// 				justify="center"
												// 				alignItems="center"
												// 				direction="row"
												// 			>
												// 				<Grid item lg={6} md={6} sm={12} xs={12}>
												// 					{row?.file?.name}
												// 				</Grid>
												// 				<Grid item lg={1} md={1} sm={12} xs={12}>
												// 					{row?.error && <Icon color="error">error</Icon>}
												// 				</Grid>
												// 				<Grid item lg={4} md={4} sm={12} xs={12}>
												// 					<div className="flex">

												// 						<Button
												// 							disabled={this.props.disabled}
												// 							className="mx-8 bg-error"
												// 							variant="contained"
												// 							onClick={() => this.handleSingleRemove(index)}
												// 						>
												// 							{t("general.remove")}
												// 						</Button>

												// 					</div>
												// 				</Grid>
												// 			</Grid>
												// 		</div>
												// 	);
												// })
											}
										</Card>
									</Grid>
								</Grid>
								{/* <Editor
									size="small"
									className="mb-16 mt-16"
									value={content}
									placeholder={t("Article.content")}
									name="content"
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
												console.log(file);
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
								></Editor> */}
							</Grid>

							<Grid item sm={4} xs={12}>
								<div
									className="mb-18 w-80"
									style={{
										position: "relative",
										left: "50%",
									}}
								>
									{this.state.titleImageUrl && (
										<span>
											<img
												src={ConstantList.API_ENPOINT + "/public/api/image/" + this.state.titleImageUrl}
												alt=""
												className="x-center"
												style={{
													objectFit: "contain",
													width: "100%",
													height: "200px",
												}}
											/>
										</span>
									)}
									{!this.state.titleImageUrl && (
										<div
											className="x-center"
											style={{
												border: "1px solid black",
												width: "100%",
												height: "206px",
											}}
										></div>
									)}
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
											margin: "30px 0",
										}}
										onClick={this.upload}
										className="x-center"
									>
										<CloudUpload className="mr-10" />
										{t("article.image")}
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
								<TextValidator
									size="small"
									className="w-100 mb-16"
									label={t("article.noteAvatarImage")}
									onChange={this.handleChange}
									type="text"
									name="noteAvatarImage"
									value={noteAvatarImage}
								/>
								<TextValidator
									size="small"
									className="w-100 mb-16"
									label={t("article.realAuthor")}
									// label={requireLabel(
									// 	t("article.realAuthor")
									// )}
									onChange={this.handleChange}
									type="text"
									name="realAuthor"
									value={realAuthor}
									// validators={["required"]}
									// errorMessages={[`${t("general.required")}`]}
								/>
								{/* <TextValidator
									className="w-100 mb-16"
									label={t("article.note")}
									onChange={this.handleChange}
									type="text"
									name="note"
									value={note}
								/> */}
								<TextValidator
									size="small"
									className="w-100 mb-16"
									label={t("article.source")}
									onChange={this.handleChange}
									type="text"
									name="source"
									value={source}
								/>
								{/* <TextValidator
									size="small"
									className="w-100"
									label={t("article.view")}
									onChange={this.handleChange}
									type="text"
									name="view"
									value={view}
								/> */}
							</Grid>


						</Grid>
					</DialogContent>

					<DialogActions>
						<div className="flex flex-middle">
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
								className="mr-8"
								variant="contained"
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

export default ArticleEditorDialog;
