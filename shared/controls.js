/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const ipc = require("electron").ipcRenderer;
document.onreadystatechange = (event) => {
	if (document.readyState == "complete") {
		handleWindowControls();
	}
};
function handleWindowControls() {
	/* Make minimise/maximise/restore/close buttons work when they are clicked */
	document.getElementById("min-button").addEventListener("click", event => {
		ipc.send("min");
	});
	document.getElementById("max-button").addEventListener("click", event => {
		ipc.send("max");
	});
	document.getElementById("restore-button").addEventListener("click", event => {
		ipc.send("unmax");
	});
	document.getElementById("close-button").addEventListener("click", event => {
		ipc.send("close");
	});
	ipc.send("version");
	ipc.on("version-reply", (event, arg) => {
		const titlespan = document.getElementById("titlespan");
		titlespan.innerHTML = ("Cosmolauncher v" + arg);
	});
	/* Toggle maximise/restore buttons when maximisation/unmaximisation occurs */
	toggleMaxRestoreButtons();
	win.on("maximize", toggleMaxRestoreButtons);
	win.on("unmaximize", toggleMaxRestoreButtons);

	function toggleMaxRestoreButtons() {
		if (win.isMaximized()) {
			document.body.classList.add("maximized");
		} else {
			document.body.classList.remove("maximized");
		}
	}
}