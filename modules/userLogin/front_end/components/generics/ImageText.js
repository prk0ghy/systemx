import cx from "classnames";
const ImageText = ({
	children,
	className
}) => (
	<div className={ cx(className) }>{ children }</div>
);
export default ImageText;
