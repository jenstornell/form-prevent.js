class FormPrevent extends HTMLElement {
  constructor() {
    super();

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Get form attributes
  getFormAttributes() {
    let html = "";
    const skip = ["salt"];

    [...this.attributes].forEach((attr) => {
      if (!skip.includes(attr.name)) {
        html += `${attr.name}="${attr.value}" `;
      }
    });
    return html.substr(0, html.length - 1);
  }

  // Remove attributes
  removeAttributes() {
    [...this.attributes].forEach((attr) => {
      this.removeAttribute(attr.name);
    });
  }

  // Handle submit
  async handleSubmit(e) {
    e.preventDefault();

    const formdata = new FormData(this.form);
    const success = this.isSuccessful(formdata);
    const action = e.currentTarget.getAttribute("action");

    this.triggerEventBefore(formdata, success);

    await this.wait(this.sleep * 1000);

    if (!success) {
      this.triggerEventAfter(false);
      return;
    }

    formdata.append("fp_ruleset", this.rulesetPath);
    formdata.append("fp_salt", this.salt);
    formdata.append("fp_sleep", this.sleep);

    let request = new XMLHttpRequest();
    request.open("POST", action);
    request.send(formdata);
    request.onload = () => {
      this.triggerEventAfter(request.response);
    };
  }

  // Trigger event before
  triggerEventBefore(formdata, success) {
    this.customEventBefore = new CustomEvent("submit:before", {
      detail: {
        formdata: success ? formdata : null,
        success: success,
      },
    });
    this.dispatchEvent(this.customEventBefore);
  }

  // Trigger event after
  triggerEventAfter(response) {
    this.customEventAfter = new CustomEvent("submit:after", {
      detail: {
        response: response,
      },
    });
    this.dispatchEvent(this.customEventAfter);
  }

  // Store ruleset
  storeRuleset() {
    const myRequest = new Request(this.rulesetPath);
    fetch(myRequest, { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        this.ruleset = data;
        this.setRulesetValues();
        this.form.addEventListener("submit", this.handleSubmit);
      });
  }

  // Set ruleset values
  setRulesetValues() {
    for (const key in this.ruleset) {
      if (typeof this.ruleset[key].value !== "undefined") {
        const value = window.btoa(this.salt + this.ruleset[key].value);
        this.querySelector(`form [name=${key}]`).value = value;
      }
    }
  }

  // Is successful
  isSuccessful(formdata) {
    let success = true;
    let value = null;
    let match = null;

    for (const key in this.ruleset) {
      try {
        if (typeof this.ruleset[key].value === "undefined") {
          value = formdata.get(key);
          match = this.ruleset[key].match;
        } else {
          value = window.atob(formdata.get(key));
          match = this.salt + this.ruleset[key].match;
        }

        if (value !== match) success = false;
      } catch (e) {
        success = false;
      }
    }
    return success;
  }

  // Sleep
  wait(ms) {
    return new Promise((resolve) => {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(resolve, ms);
    });
  }

  // Connected callback
  connectedCallback() {
    this.salt = this.getAttribute("salt");
    this.sleep = parseInt(this.getAttribute("sleep"));
    this.rulesetPath = this.getAttribute("ruleset");
    this.innerHTML = `
      <form ${this.getFormAttributes()}>
      ${this.innerHTML}
      </form>
    `;
    this.form = this.querySelector("form");
    this.removeAttributes();
    this.storeRuleset();
  }

  // Disconnected callback
  disconnectedCallback() {
    this.removeEventListener("submit:before", this.customEventBefore);
    this.removeEventListener("submit:after", this.customEventAfter);
  }
}

customElements.define("form-prevent", FormPrevent);
