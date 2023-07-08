import { EgretLoadable } from "egret";
import { withTranslation } from "react-i18next";
import ConstantList from "../../appConfig";
const RegisterApply = EgretLoadable({
	loader: () => import("./RegisterApply"),
});
const ViewComponent = withTranslation()(RegisterApply);

const RegisterApplyRouter = [
	{
		path: ConstantList.ROOT_PATH + "RegisterApply",
		exact: true,
		component: ViewComponent,
	},
];

export default RegisterApplyRouter
;

