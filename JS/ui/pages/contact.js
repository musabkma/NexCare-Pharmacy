export function renderContact({ appEl, showToast }) {
  appEl.innerHTML = `
    <div class="panel fade">
      <div class="section__head" style="margin-bottom:8px;">
        <div>
          <h2 class="section__title">Contact</h2>
          <div class="section__sub">Support form (demo).</div>
        </div>
        <a class="btn" href="#/">Home</a>
      </div>

      <div class="layout">
        <div class="panel">
          <h3 class="panel__title">Send a message</h3>
          <div class="field">
            <label for="cname">Name</label>
            <input id="cname" type="text" placeholder="Your name" />
          </div>
          <div class="field">
            <label for="cemail">Email</label>
            <input id="cemail" type="email" placeholder="you@example.com" />
          </div>
          <div class="field">
            <label for="cmsg">Message</label>
            <textarea id="cmsg" placeholder="How can we help?"></textarea>
          </div>
          <button class="btn btn--primary btn--full" id="send" type="button">Send</button>
          <div class="hint">Messages are simulated (no backend).</div>
        </div>

        <aside class="panel">
          <h3 class="panel__title">Business info</h3>
          <div class="panel__muted" style="line-height:1.65;">
            <div><strong>NexCare Pharmacy</strong></div>
            <div>Premium online pharmacy experience</div>
            <div style="margin-top:10px;">Email: musabkhalidelagib@gmail.com</div>
            <div>Telegram: +249 90 774 7828</div>
            <div style="margin-top:10px;">Hours: Sat‑Thu, 9:00–00:00</div>
            <div style="margin-top:10px;">Friday: 12:00–18:00</div>
          </div>
        </aside>
      </div>
    </div>
  `;

  document.getElementById("send").addEventListener("click", () => {
    showToast({ title: "Sent", message: "Thanks—our team will respond soon (demo)." });
    document.getElementById("cmsg").value = "";
  });
}

