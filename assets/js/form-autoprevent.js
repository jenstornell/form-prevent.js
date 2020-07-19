class FormAutoprevent extends EventTarget {
  constructor(options) {
    super();
    this.o = options;
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Render
  render() {
    this.setHtml();
  }

  // Set html
  setHtml() {
    fetch("form1.html")
      .then((response) => {
        return response.text();
      })
      .then((html) => {
        document.querySelector(this.o.selector).innerHTML = html;
        this.setValidators();
      });
  }

  // Set validators
  setValidators() {
    fetch("form1.json")
      .then((response) => response.json())
      .then((data) => {
        this.validators = data;

        for (const key in this.validators) {
          const selector = `${this.o.selector} form [name="${key}"]`;
          const value = window.btoa(this.validators[key].value);

          document.querySelector(selector).value = value;
        }

        this.setEvent();
      });
  }

  // Set event
  setEvent() {
    const element = document.querySelector(`${this.o.selector} form`);

    element.addEventListener("submit", this.handleSubmit);
  }

  // Get form data
  getFormData() {
    return new FormData(document.querySelector(`${this.o.selector} form`));
  }

  handleSubmit(e) {
    e.preventDefault();

    const form = this.getFormData();
    const success = this.isSuccessful(form);

    this.triggerCustomEvent(form, success);
  }

  // Is successful
  isSuccessful(form) {
    let success = true;

    for (const key in this.validators) {
      const value = window.atob(form.get(key));
      const match = this.validators[key].match;

      if (value !== match) success = false;
    }
    return success;
  }

  // Trigger custom event
  triggerCustomEvent(form, success) {
    this.customEvent = new CustomEvent("form_submit", {
      detail: {
        form: success ? form : null,
        success: success,
      },
    });
    this.dispatchEvent(this.customEvent);
  }
}
