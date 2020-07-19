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
    fetch(this.o.template)
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
    fetch(this.o.ruleset)
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

  // Handle submit
  handleSubmit(e) {
    e.preventDefault();

    const formdata = this.getFormData();
    const success = this.isSuccessful(formdata);

    this.triggerEventBefore(formdata, success);

    let request = new XMLHttpRequest();
    request.open("POST", "http://localhost/libraries/form-autoprevent/api.php");
    request.send(formdata);
    request.onload = () => {
      this.triggerEventAfter(request.response);
    };
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
  triggerEventBefore(form, success) {
    this.customEventBefore = new CustomEvent("form:before", {
      detail: {
        form: success ? form : null,
        success: success,
      },
    });
    this.dispatchEvent(this.customEventBefore);
  }

  // Trigger event after
  triggerEventAfter(response) {
    this.customEventAfter = new CustomEvent("form:after", {
      detail: {
        response: response,
      },
    });
    this.dispatchEvent(this.customEventAfter);
  }
}
