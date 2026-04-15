export function renderPrescriptions({ appEl, showToast }) {
  appEl.innerHTML = `
    <div class="panel fade">
      <div class="section__head" style="margin-bottom:8px;">
        <div>
          <h2 class="section__title">Prescription upload</h2>
          <div class="section__sub">Secure upload simulation (frontend-only).</div>
        </div>
        <a class="btn" href="#/category/pom">View POM catalog</a>
      </div>

      <div class="layout">
        <div class="panel">
          <h3 class="panel__title">Upload your prescription</h3>
          <div class="panel__muted" style="line-height:1.65;">
            In a real system, uploads would be encrypted, verified by a licensed pharmacist, and linked to your account.
            This demo shows the UI flow only.
          </div>

          <div class="field" style="margin-top:14px;">
            <label for="rxFile">Prescription file</label>
            <input id="rxFile" type="file" accept="image/*,.pdf" />
          </div>

          <div class="field">
            <label for="rxNotes">Notes (optional)</label>
            <textarea id="rxNotes" placeholder="Doctor name, dosage details, questions for pharmacist..."></textarea>
          </div>

          <button class="btn btn--primary btn--full" id="rxUpload" type="button">Upload</button>
          <div class="hint">This is a Demo Nothing is actually uploaded—stored nowhere.</div>
        </div>

        <aside class="panel">
          <h3 class="panel__title">What happens next</h3>
          <div class="panel__muted" style="line-height:1.65;">
            - A pharmacist reviews the prescription<br/>
            - Items are approved or clarified<br/>
            - You complete checkout<br/>
            - Discreet delivery
          </div>
        </aside>
      </div>
    </div>
  `;

  document.getElementById("rxUpload").addEventListener("click", () => {
    const file = document.getElementById("rxFile").files?.[0];
    if (!file) {
      showToast({ title: "Select a file", message: "Please choose an image or PDF to continue.", tone: "warn" });
      return;
    }
    showToast({ title: "Uploaded (demo)", message: `Received: ${file.name}` });
    document.getElementById("rxFile").value = "";
    document.getElementById("rxNotes").value = "";
  });
}

