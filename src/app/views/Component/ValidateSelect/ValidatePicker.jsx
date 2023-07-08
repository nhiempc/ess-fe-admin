import DateFnsUtils from "@date-io/date-fns";
import {
	KeyboardDatePicker,
	MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import React from "react";
import { ValidatorComponent } from "react-material-ui-form-validator";
import viLocale from "date-fns/locale/vi";
class ValidatedDatePicker extends ValidatorComponent {
	renderValidatorComponent() {
		const {
			errorMessages,
			validators,
			requiredError,
			helperText,
			validatorListener,
			...rest
		} = this.props;

		const { isValid } = this.state;

		return (
			<MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
				{this.props.value ?
					< KeyboardDatePicker
						{...rest}
						InputLabelProps={{
							shrink: true,
						}}
					/>
					:
					< KeyboardDatePicker
						{...rest}
						error={!isValid}
						helperText={(!isValid && this.getErrorMessage()) || helperText}
					/>
				}
			</MuiPickersUtilsProvider>
		);
	}
}

export default ValidatedDatePicker;
