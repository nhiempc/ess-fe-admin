import React from "react";
import TextField from "@material-ui/core/TextField";
import { ValidatorComponent } from "react-material-ui-form-validator";

export default class SelectValidator extends ValidatorComponent {
	renderValidatorComponent() {
		const {
			error,
			errorMessages,
			validators,
			requiredError,
			helperText,
			validatorListener,
			withRequiredValidator,
			containerProps,
			...rest
		} = this.props;

		const { isValid } = this.state;

		return (
			<TextField
				{...rest}
				select
				size="small"
				error={!isValid || error}
				helperText={(!isValid && this.getErrorMessage()) || helperText}
			/>
		);
	}
}
