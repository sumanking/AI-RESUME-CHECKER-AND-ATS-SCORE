document.getElementById("resumeForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const fileInput = document.getElementById("resumeFile");
    const jobDescInput = document.getElementById("jobDescription");

    if (!fileInput.files.length) {
        alert("Please upload your resume.");
        return;
    }

    const resultDiv = document.getElementById("result");
    const analysisText = document.getElementById("analysisText");

    resultDiv.classList.remove("hidden");
    analysisText.innerHTML = "Analyzing your resume...";

    const formData = new FormData();
    formData.append("resume", fileInput.files[0]);
    formData.append("jobDescription", jobDescInput.value);

    try {
        const response = await fetch("/analyze", {
            method: "POST",
            body: formData
        });

        if (!response.ok) throw new Error("Failed to analyze resume");

        const data = await response.json();
        analysisText.innerHTML = data.feedback;
    } catch (err) {
        console.error(err);
        analysisText.innerHTML = "❌ Error analyzing resume. Please try again.";
    }
});
