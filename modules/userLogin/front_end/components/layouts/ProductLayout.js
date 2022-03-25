import { useTranslation } from "next-i18next";
import { useCallback, useState } from "react";
import styles from "./ProductLayout.module.css";
const ProductLayout = ({
	panel0,
	panel1
}) => {
	const { t } = useTranslation("common");
	const [tab, setTab] = useState(0);
	const setTab0 = useCallback(() => {
		setTab(0);
	}, [setTab]);
	const setTab1 = useCallback(() => {
		setTab(1);
	}, [setTab]);
	const tab0 = tab === 0
		? styles.tab0active
		: styles.tab0;
	const tab1 = tab === 1
		? styles.tab1active
		: styles.tab1;
	return (
		<div className={ styles.tabContainer }>
			<nav className={ styles.tabHead }>
				<div className={ tab0 }>
					<button onClick={ setTab0 } type="button">
						{ t("products|event") }
					</button>
				</div>
				<div className={ tab1 }>
					<button onClick={ setTab1 } type="button">
						{ t("products|proceedings") }
					</button>
				</div>
			</nav>
			<div className={ styles.tabBody }>
				{
					tab === 0
						? (
							<>
								<p className={ styles.info0 }>{ t("products|includesProceedings") }</p>
								<div className={ styles.panel }>{ panel0 }</div>
							</>
						)
						: (
							<>
								<p className={ styles.info1 }>{ t("products|pastProceedings") }</p>
								<div className={ styles.panel }>{ panel1 }</div>
							</>
						)
				}
			</div>
		</div>
	);
};
export default ProductLayout;
