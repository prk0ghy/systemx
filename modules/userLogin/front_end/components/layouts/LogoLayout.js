import styles from "./LogoLayout.module.css";
import Picture from "../generics/Picture";
const LogoLayout = ({ children }) => {
	const picture = {
		alt: "m-Vet Logo",
		height: "188",
		src: "/mvet/ui/logo.svg",
		width: "188"
	};
	return (
		<>
			<div className={ styles.bannerContainer }>
				<div className={ styles.laced }>
					<Picture className={ styles.image } { ...picture }/>
					<div className={ styles.big }>mVet</div>
				</div>
			</div>
			<div className={ styles.text }>
				{ children }
			</div>
		</>
	);
};
export default LogoLayout;
