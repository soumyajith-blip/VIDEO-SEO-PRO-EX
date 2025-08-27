document.getElementById("generateBtn").addEventListener("click", async () => {
  const title = document.getElementById("title").value.trim();
  const keywords = document.getElementById("keywords").value.trim();
  const platform = document.getElementById("platform").value;
  const btnText = document.getElementById("btnText");
  const spinner = document.getElementById("loadingSpinner");

  if (!title || !keywords) {
    showMessage("Please fill in all fields!");
    return;
  }

  btnText.classList.add("hidden");
  spinner.classList.remove("hidden");

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, keywords, platform })
    });

    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();

    document.getElementById("tagsResult").textContent = data.tags;
    document.getElementById("hashtagsResult").textContent = data.hashtags;
    document.getElementById("descriptionResult").textContent = data.description;

    document.getElementById("outputSection").classList.remove("hidden");
  } catch (err) {
    showMessage("Error: " + err.message);
  } finally {
    btnText.classList.remove("hidden");
    spinner.classList.add("hidden");
  }
});

function showMessage(msg) {
  const box = document.getElementById("messageBox");
  box.textContent = msg;
  box.classList.remove("hidden");
  setTimeout(() => box.classList.add("hidden"), 4000);
}