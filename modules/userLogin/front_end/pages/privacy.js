import BannerLayout, { TextContent } from "components/layouts/BannerLayout";
import Page from "components/shell/Page";
import { useBrand } from "contexts/Brand";
const Privacy = () => {
	const [{
		privacyPreviewHeight,
		privacyPreviewURL,
		privacyPreviewWidth
	}] = useBrand();
	return (
		<Page title="Datenschutz">
			<BannerLayout headline="Datenschutz" height={ privacyPreviewHeight } image={ privacyPreviewURL } width={ privacyPreviewWidth }>
				<TextContent>
					<h1>Datenschutzerklärung für m-Vet.de</h1>
					<p/>
					<h2>1. Serverstatistiken (Logfiles)</h2>
					<p/>
					<p>In den stets anfallenden Serverstatistiken (Server-Logfiles) werden die Daten gespeichert, die Ihr Browser automatisch übermittelt. Dies sind: Browsertyp und -version, Betriebssystem, IP-Adresse, anfragende Domain, Datum, Uhrzeit und abgerufene Seiten/Dateien, übertragene Datenmengen. Informationen dieser Art werden von uns anonymisiert und statistisch ausgewertet, um unsere Angebote und die dahinterstehende Technik zu optimieren. Es ist uns jedoch nicht möglich, diese Daten konkreten Personen zuzuordnen. Auch eine Zusammenführung dieser Daten mit anderen Datenquellen wird von uns nicht vorgenommen. Eine Weitergabe dieser Daten an Dritte findet nicht statt.</p>
					<h2>2. Erhebung und Verarbeitung personenbezogener Daten</h2>
					<p/>
					<p>Wir halten uns an die Grundsätze der Datenvermeidung und Datensparsamkeit. Das Webangebot kann grundsätzlich ohne die Angabe von personenbezogenen Daten genutzt werden. Wo solche Daten (z.B. Name, Adresse oder E-Mail) doch erhoben werden, geschieht das auf Ihre Veranlassung und mit Ihrer ausdrücklichen Zustimmung, z. B. wenn Sie ein Produkt kaufen oder Kontakt mit uns aufnehmen. Ihre Angaben werden stets nur für den jeweils von Ihnen angegebenen Zweck verwendet.</p>
					<h2>3. Cookies & Local Storage</h2>
					<p/>
					<p>Die Seite tagungsbaende.dilewe.de kommt, solange Sie nicht eingeloggt sind, ohne den Einsatz von Cookies aus.</p>
					<p>Sobald Sie sich einloggen wird ein notwendiger Session-Cookie gesetzt ohne den die erforderlichen Funktionalitäten eines Benutzerprofils und Kaufprozesse nicht möglich wäre.&nbsp;</p>
					<h2>4. Speicherdauer & Löschung von Nutzerdaten</h2>
					<p/>
					<p>Das Kriterium für die Dauer der Speicherung von personenbezogenen Daten ist die jeweilige gesetzliche Aufbewahrungsfrist. Nach Ablauf der Frist werden die entsprechenden Daten routinemäßig gelöscht, sofern sie nicht mehr zur Vertragserfüllung oder Vertragsanbahnung erforderlich sind.</p>
					<p>Der Anbieter verarbeitet und speichert personenbezogene Daten der betroffenen Person nur für den Zeitraum, der zur Erreichung des Speicherungszwecks erforderlich ist oder sofern dies durch den Europäischen Richtlinien- und Verordnungsgeber oder einen anderen Gesetzgeber in Gesetzen oder Vorschriften, welchen der für die Verarbeitung Verantwortliche unterliegt, vorgesehen wurde. Entfällt der Speicherungszweck oder läuft eine vom Europäischen Richtlinien- und Verordnungsgeber oder einem anderen zuständigen Gesetzgeber vorgeschriebene Speicherfrist ab, werden die personenbezogenen Daten entsprechend den gesetzlichen Vorschriften gesperrt oder gelöscht.</p>
					<h2>5. Nutzerdatenanalyse (Matomo)</h2>
					<p/>
					<p>Wir benutzen Matomo zur Webanalyse, ein Dienst der InnoCraft Ltd., 150 Willis St, 6011 Wellington, New Zealand, NZBN 6106769, („Matomo“) mittels Cookie-Technologie. Der Schutz Ihrer Daten ist uns wichtig, deshalb hosten wir Ihre Daten selbst und haben Matomo zusätzlich so konfiguriert, dass Ihre IP-Adresse ausschließlich gekürzt erfasst wird. Wir verarbeiten Ihre personenbezogenen Nutzungsdaten daher anonymisiert. Ein Rückschluss auf Ihre Person ist uns nicht möglich. Weitere Informationen zu den Nutzungsbedingungen von Matomo und den datenschutzrechtlichen Regelungen finden Sie unter: <a href="https://matomo.org/privacy/">https://matomo.org/privacy/</a></p>
					<h2>6. Externe Inhalte</h2>
					<p/>
					<p>Die Auslieferung der Inhalte bindet teilweise externe Inhalte als sogenannte “IFrames” ein. Dies wird beispielsweise zum einbinden von YouTube-Videos genutzt. Vor dem Aufbau einer Verbindung zu einem externen Dienst wird die Erlaubnis dafür eingeholt und, wo möglich, eine No Cookie-Domain eingesetzt, um die Privatsphäre der Nutzer zu erhöhen (z.B. bei YouTube).&nbsp;</p>
					<p>Wir machen darauf aufmerksam, dass die Betreiber der externen Inhalte die Daten ihrer Nutzerinnen und Nutzer (z.B. persönliche Informationen, IP-Adresse etc.) entsprechend ihrer Datenverwendungsrichtlinien abspeichern und für geschäftliche Zwecke nutzen. Wir haben keinen Einfluss auf die Datenerhebung und deren weitere Verwendung durch die Betreiber externer Webseiten. So bestehen keine Erkenntnisse darüber, in welchem Umfang, an welchem Ort und für welche Dauer die Daten gespeichert werden, inwieweit die Betreiber bestehenden Löschpflichten nachkommen, welche Auswertungen und Verknüpfungen mit den Daten vorgenommen werden und an wen die Daten weitergegeben werden.</p>
					<h2>7. H5P (Interaktionen)</h2>
					<p/>
					<p>Für die Ausgabe von interaktiven Elementen verwendet m-vet.de die Technologie H5P. Dabei handelt es sich um ein Open-Source-Projekt aus Norwegen. Da wir von der Möglichkeit gebrauch machen, H5P selbst zu hosten, entstehen dabei keinerlei Daten, die an Dritte weitergeleitet werden.</p>
					<h2>8. Open Source Projekt</h2>
					<p/>
					<p>Das Front- und Backend ist eine quelloffene EUPL-1.2-lizensierte Software, welche auf GitHub entwickelt und veröffentlicht wird. Jede Änderung daran ist als Git-commit erfasst und der Öffentlichkeit zugänglich. Dies garantiert volle Transparenz, da jede Änderung verfolgt werden kann.<br/><a href="https://github.com/Digitale-Lernwelten/systemx">https://github.com/Digitale-Lernwelten/systemx<br/></a>Wir nehmen alle Sicherheitsaspekte ernst, wenn Sie Rückmeldungen oder Beiträge zur Sicherheit leisten wollen oder eine Sicherheitslücke vermuten, bitte melden Sie sich gerne vertraulich per E-Mail an <a href="mailto:info@dilewe.de">info@dilewe.de</a></p>
					<h2>9. Ansprechpartner für Datenschutzfragen</h2>
					<p/>
					<p>Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten, bei Auskünften, Berichtigung, Sperrung oder Löschung von Daten sowie Widerruf ggf. erteilter Einwilligungen können Sie sich jederzeit an uns wenden:</p>
					<p>Anbieter und Verantwortlicher im Sinne des Datenschutzgesetzes:</p>
					<p>Hermann Kempf</p>
					<p>Herrenbachstr. 57<br/>86161 Augsburg<br/>info@m-vet.de</p>
					<h2>10. Änderungen unserer Datenschutzerklärung</h2>
					<p/>
					<p>Um zu gewährleisten, dass unsere Datenschutzerklärung stets den aktuellen gesetzlichen Vorgaben entspricht, behalten wir uns jederzeit Änderungen vor. Das gilt auch für den Fall, dass die Datenschutzerklärung aufgrund technischer Anpassungen oder Erweiterungen der Website angepasst werden muss. Wir empfehlen deshalb, die Datenschutzerklärung in regelmäßigen Abständen erneut zu lesen.</p>
				</TextContent>
			</BannerLayout>
		</Page>
	);
};
export default Privacy;
