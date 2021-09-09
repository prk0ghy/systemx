import * as configuration from "./configuration.mjs";

const resetRequests = {};

const addDeletionRequest = async id => {
	const user = await feuser.getByID(id);
	if (!user) {
		return false;
	}
	const hash = configuration.makeid(32);
	resetRequests[hash] = user.ID|0;
	const deletionURL = configuration.absoluteUrl("/userDelete/" + hash);
	const mailText = "Um Ihr Konto unwiederruflich zu löschen, besuchen Sie bitte folgenden Link: " + deletionURL;
	//let mailHtml = "<h3>Passwort Löschen</h3><p>Um Ihr Konto unwiederruflich zu löschen, besuchen Sie bitte folgenden Link: <a href=""+deletionURL+"">"+deletionURL+"</a></p>";
	//mail.send("proexly@proexly-test.de", user.email, "Passwort Zuruecksetzen", mailText, mailHtml);
	console.log(mailText);
	return true;
};

export const reqLogin = async context => {
	const values = {};
	const session = frontEndSession.get(context);
	values.title = "Login";
	values.loggedIn = false;
	values.status = "Bitte gib deine Zugangsdaten ein.";
	values.pwresethref = configuration.prefixUrl("/pwreset");
	values.loginhref = configuration.absoluteUrl("/login");
	values.logouthref = configuration.absoluteUrl("/logout");
	if (!session && context.method === "POST" && context.request.body && context.request.body.username) {
		if (await frontEndSession.checkPassword(context)) {
			context.redirect(context.request.body.redirect);
			return;
		} else {
			values.status = "Passwort ungültig, bitte versuche es erneut!";
		}
	} else if (session) {
		values.status = "Du bist bereits angemeldet";
		values.loggedIn = true;
	}
	context.body = "GET Login";
	//await template.renderPage("login", values, false, context);
};

export const checkUserSettings = async context => {
	const prefix = configuration.prefixUrl("/userSettings");
	const ppath = context.request.path.substr(0, prefix.length).trim();
	const sprefix = prefix + "/";
	if (prefix !== ppath && sprefix !== ppath) {
		return false;
	}
	const user = await frontEndSession.getUser(context);
	if (!user) {
		return false;
	}
	return user.passwordExpired !== 1;
};

export const reqFilter = async (context, next) => {
	const session = frontEndSession.get(context);
	if (session) {
		return next(context);
	}
	else{
		return reqLogin(context);
	}
};

const reqRegister = async context => {
	const values = {};
	values.errors = [];
	values.redirect = "";
	values.status = "Bitte geben Sie ihre E-Mail-Adresse und ein Passwort für Ihr neues Benutzerkonto ein.";
	values.title = "Registrierung";
	const session = frontEndSession.get(context);
	if (session) {
		/* Registering a new account while logged in should not be possible. */
		context.redirect("/");
		return;
	}
	if (context.method === "POST" && context.request.body) {
		if (!context.request.body.email) {
			values.errors.push("Bitte geben Sie Ihre E-Mail-Adresse ein.");
		}
		if (!context.request.body.password) {
			values.errors.push("Bitte geben Sie ein Passwort ein.");
		}
		const email = context.request.body.email;
		const password = context.request.body.password;
		if (password.length < 8) {
			values.errors.push("Ihr Passwort muss mindestens acht Zeichen lang sein.");
		}
		const user = await feuser.getByName(email);
		if (user) {
			values.errors.push("Die von Ihnen angegebene E-Mail-Adresse befindet sich bereits im System, bitte verwenden Sie eine andere oder melden Sie sich an.");
		}
		if (!values.errors.length) {
			const userID = await feuser.add(email, email, password);
			await frontEndSession.start(context, userID);
			context.redirect("/");
		}
	}
	context.body = await template.renderPage("register", values, false, context);
};

const reqGetUserSettings = async context => {
	const user = await frontEndSession.getUser(context);
	const values = {};
	values.title = "Ihre Daten";
	values.status = "";
	values.user = user;
	values.user.products = await feuser.getActiveProducts(user.ID);
	if (context.feuserStatus !== undefined) {values.status = context.feuserStatus;}
	context.body = await template.renderPage("feuserSettings", values, false, context);
};

const reqPostUserSettings = async context => {
	const user = await frontEndSession.getUser(context);
	switch (context.request.body.verb) {
	default:
		console.warn(`Unknown user settings verb: ${context.request.body.verb}`);
		break;
	case "pwExpire":
		if (await feuser.tryLogin(user.name, context.request.body.password) !== null) {
			feuser.expirePW(user.ID);
			context.redirect(context.request.originalUrl);
			return null;
		}
		context.feuserStatus = `<p class="error">Passwort nicht korrekt, bitte &uuml;berpr&uuml;fen Sie ihre Eingabe.</p>`;
		break;
	case "deleteUser":
		context.feuserStatus = "<p>Eine E-Mail mit einem Link zum l&ouml;schen all ihrer Daten wurde ihnen soeben gesendet.</p>";
		addDeletionRequest(user.ID);
		break;
	}
	return await reqGetUserSettings(context);
};

const reqUserDeletePage = async context => {
	const values = {};
	const hash = context.params.hash;
	const user = await frontEndSession.getUser(context);
	values.title = "Alle Daten löschen";
	values.status = "<p>Bitte pr&uuml;fen Sie den Link und stellen Sie sicher, dass Sie angemeldet sind, damit wir Ihr Konto vollst&auml;ndig l&ouml;schen k&ouml;nnen.</p>";
	if (resetRequests[hash] !== undefined && resetRequests[hash] === user.ID) {
		if (context.method === "POST" && context.request.body !== undefined && context.request.body.confirm !== undefined) {
			values.status = "<p>Ihr Konto wurde vollst&auml;ndig und unwiederruflich gel&ouml;scht, vielen Dank dass Sie das mBook genutzt haben.</p>";
			feuser.deleteUser(user.ID);
			delete resetRequests[hash];
			frontEndSession.stop(context);
		}
		else {
			values.status = `
				<p>Sind Sie sicher, dass Sie Ihr Konto und alle dazugeh&ouml;rigen Daten l&ouml;schen wollen?</p>
				<form method="post" action="${context.request.originalUrl}" class="login-form">
					<input type="submit" class=delete name=confirm value="Konto Löschen"/>
				</form>
			`;
		}
	}
	context.body = await template.renderPage("userDelete", values, false, context);
};

