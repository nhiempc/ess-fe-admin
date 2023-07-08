import { Button, MenuItem, TextField } from "@material-ui/core";
import moment from "moment";
import React, { Component } from "react";
import { ValidatorForm } from "react-material-ui-form-validator";
// import { searchByPage } from "../Category/CategoryService";
import "./ArticleFilter.css";

export default class ArticleFilter extends Component {
	constructor(props) {
		super(props);

		this.state = {
			text: "",
			status: "",
			publishDate: null,
			category: null,
			categories: [],
			language: "",
		};
	}

	componentDidUpdate(prevProps) {
		if (prevProps.i18n.language !== this.state.language) {
			this.setState(
				{
					language: this.props.i18n.language,
				}
			);
		}
	}

	componentDidMount() {
		ValidatorForm.addValidationRule("isValidDate", value => {
			if (value !== null) {
				const a = moment(value).format("DD/MM/yyyy");
				const b = moment(Date.now()).format("DD/MM/yyyy");
				return a <= b;
			}
			return true;
		});
	}

	handleChange = e => {
		this.setState({
			[e.target.name]: e.target.value,
		});
	};

	handleDateChange = date => {
		this.setState({
			publishDate: date,
		});
	};

	clearFilter = () => {
		this.setState(
			{
				text: "",
				publishDate: null,
				status: null,
				category: null,
			},
			() => this.props.handleFilter(this.state)
		);
	};

	onHandleFilter = () => {
		if (this.state.publishDate !== null) {
			this.setState(
				{
					...this.state,
					publishDate: new Date(this.state.publishDate).setHours(
						0,
						0,
						0,
						0
					),
				},
				() => this.props.handleFilter(this.state)
			);
		} else {
			this.props.handleFilter(this.state);
		}
	};

	render() {
		const { publishDate, category, categories, status } = this.state;
		const { t } = this.props;

		const statusOptions = [
			{
				label: t("article.approve.not"),
				value: 1,
			},
			{
				label: t("article.approve.pen"),
				value: 2,
			},
			{
				label: t("article.approve.yes"),
				value: 3,
			},
		];

		return (
			<ValidatorForm
				ref="form"
				className="filter-container"
				onSubmit={() => this.onHandleFilter()}
			>
				<TextField
					select
					label={t("article.status")}
					name="status"
					value={status}
					onChange={this.handleChange}
				>
					{statusOptions?.map(p => (
						<MenuItem key={p.value} value={p.value}>
							{p.label}
						</MenuItem>
					))}
				</TextField>

				<TextField
					select
					label={t("category.category")}
					name="category"
					value={category}
					onChange={this.handleChange}
				>
					{categories?.map(c => (
						<MenuItem key={c.id} value={c}>
							{c.title}
						</MenuItem>
					))}
				</TextField>

				<div className="btn-action">
					<Button
						variant="contained"
						color="primary"
						className="mr-12"
						onClick={() => this.clearFilter()}
					>
						{t("reset")}
					</Button>
					<Button variant="contained" color="secondary" type="submit">
						{t("search")}
					</Button>
				</div>
			</ValidatorForm>
		);
	}
}
