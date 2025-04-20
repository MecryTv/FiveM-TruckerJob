// Listen for messages from the client script to toggle the UI
window.addEventListener("message", (event) => {
  if (event.data.type === "ui") {
    const visible = event.data.status;
    document.getElementById("appContainer").style.display = visible
      ? "flex"
      : "none";
  }
});

// Close button: tell client to hide the UI
document.getElementById("closeBtn").addEventListener("click", () => {
  fetch(`https://${GetParentResourceName()}/close`, {
    method: "POST",
  }).then(() => {
    document.getElementById("appContainer").style.display = "none";
  });
});

// Example action button: send an action callback
document.getElementById("actionBtn").addEventListener("click", () => {
  fetch(`https://${GetParentResourceName()}/action`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({ action: "startJob" }),
  })
    .then((resp) => resp.json())
    .then((data) => {
      console.log("Action callback response:", data);
    });
});
