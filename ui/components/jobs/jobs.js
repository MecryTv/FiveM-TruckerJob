// Standardwert: kein aktiver Job
let isActiveJob = false;

// Beim Laden der Komponente
$(document).ready(function () {
  // Initialisiere die Ansicht basierend auf isActiveJob
  updateJobView();

  // Event-Listener für den Abbrechen-Button
  $(document).on("click", "#cancel-job-btn", function () {
    isActiveJob = false;
    updateJobView();
    // Sende Nachricht an den Client, dass der Job abgebrochen wurde
    $.post(
      "https://" + GetParentResourceName() + "/cancelJob",
      JSON.stringify({})
    );
  });

  // Hier könntest du Event-Listener für das Annehmen eines Jobs hinzufügen
  // z.B. $(document).on('click', '.accept-job-btn', function() { ... });
  $(document).on("click", ".btn-accept", function () {
    $("#accept-job").fadeIn(200);
  });

  $(document).on("click", "#cancel-accept", function () {
    $("#accept-job").fadeOut(200);
  });

  $(document).on("click", "#confirm-accept", function () {
    // Alle ausgewählten Werte sammeln
    const selected = [];
    $("input[name='truckOption']:checked").each(function () {
      selected.push(this.value);
    });

    if (selected.length === 2) {
      showToast({
        type: "warning",
        title: "Auswahl-Fehler",
        message: "Du kannst nur eine Option auswählen",
        duration: 5000,
      });
      return;
    } else if (selected.length === 0) {
      showToast({
        type: "warning",
        title: "Auswahl-Fehler",
        message: "Du musst eine Option auswählen",
        duration: 5000,
      });
      return;
    }

    // Beispiel: In Console ausgeben
    console.log("Ausgewählte Optionen:", selected);
  });
  // Lausche auf Nachrichten vom FiveM-Client
});

// Funktion zum Aktualisieren der Ansicht je nach isActiveJob
function updateJobView() {
  if (isActiveJob) {
    // Zeige aktiven Job und ändere den Sidebar-Text
    $("#active-job-container").show();
    $("#jobs-list-container").hide();
    $('.menu-item a[href="#jobs"] .label').text("Job");
  } else {
    // Zeige Jobs-Übersicht und setze den Sidebar-Text zurück
    $("#active-job-container").hide();
    $("#jobs-list-container").show();
    $('.menu-item a[href="#jobs"] .label').text("Jobs");
  }
}

const toastContainer = document.getElementById("toast-container"); // MDN: appendChild & createElement arbeiten nur, wenn das Element existiert :contentReference[oaicite:2]{index=2}

/**
 * Zeigt einen Toast mit optionalem Titel.
 * @param {{ type: string, title?: string, message: string, duration?: number }} opts
 */
function showToast({
  type = "info",
  title = "",
  message = "",
  duration = 4000,
}) {
  // a) Toast-Box erzeugen
  const toast = document.createElement("div"); // MDN: createElement erzeugt neues Element :contentReference[oaicite:3]{index=3}
  toast.classList.add("toast", type); // MDN: classList.add manipuliert CSS-Klassen :contentReference[oaicite:4]{index=4}

  // b) Falls Titel gesetzt, Title-Element bauen
  if (title) {
    const t = document.createElement("div");
    t.classList.add("toast-title");
    t.textContent = title;
    toast.appendChild(t); // MDN: appendChild hängt Kind­element an :contentReference[oaicite:5]{index=5}
  }

  // c) Message-Element
  const m = document.createElement("div");
  m.classList.add("toast-message");
  m.textContent = message;
  toast.appendChild(m);

  // d) In DOM einfügen
  toastContainer.appendChild(toast);

  // e) Animation starten
  requestAnimationFrame(() => toast.classList.add("show"));

  // f) Nach duration ausblenden und entfernen
  setTimeout(() => {
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => toast.remove());
  }, duration);
}
