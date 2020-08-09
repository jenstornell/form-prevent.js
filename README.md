# form-prevent.js

_Version 0.2_

A small vanilla javascript HTML web component to prevent automatic form spam.

- It has plenty of ways to prevent form spam on the client side.
- Everything is happening behind the scenes, to not disturb the user.
- Vanilla javascript HTML web component that does not depend on anything.
- HTML rules will still apply, like required fields etc.

**_This does NOT replace server side validation_**

| Protection                 | Description                                                                    |
| -------------------------- | ------------------------------------------------------------------------------ |
| **Form generated with js** | Many bots will not see forms generated with javascript.                        |
| **Ruleset file**           | In a ruleset file you can specify the validation rules of your form.           |
| **Honeypots**              | In the ruleset file you can set honeypots.                                     |
| **Matching values**        | In the ruleset file you can set values that are required to match.             |
| **Salt**                   | As an extra layer, you can add a salt.                                         |
| **Encoded values**         | The matching values are encoded to be more cryptic.                            |
| **Encoded urls**           | Both action and ruleset urls are encoded to prevent scraping.                  |
| **Sleep**                  | You can have the form wait for a number of seconds before submitting the form. |

## Usage

### HTML

Somewhere within `<body></body>` in your HTML file.

```html
<form-prevent
  secret1="aHR0cHM6Ly9leGFtcGxlLmNvbS95b3VyLXNlcnZlci1hcGkucGhw"
  secret2="cnVsZXNldC5qc29u"
  salt="4420d1918bbcf7686defdf9560bb5087d20076de5f77b7cb4c3b40bf46ec428b"
>
  <input type="text"" name="username" />

  <input type="hidden" name="honeypot" value="" />
  <input type="hidden" name="has_to_be_blue" value="Doe" />

  <input type="submit" value="Submit" />
</form-prevent>
```

- **`secret1`** - Base64 encoded string of form **action** url. The secret1 contains the action url which is `api.php`.
- **`secret2`** - Base64 encoded string of **ruleset** url. The secret2 contains the ruleset url which is `ruleset.json`.
- **`salt`** - Whatever you want
- **`sleep` (optional)** - Time to wait before submitting form. Defaults to 2 seconds.

To encode something to Base64, you can use this tool: https://base64.alanreed.org/.

**To make the form useful at all, you need to catch the form response. That is done with an event called `submit:after` (see events)**

### Javascript

Optimal in most cases is to place the javascript just before `</body>`.

```js
<script src="assets/js/form-prevent.js"></script>
```

### Ruleset

In the `<form-prevent ruleset="ruleset.json">` you specify the path you your ruleset json file. It can look like below.

```json
{
  "honeypot": {
    "match": ""
  },
  "has_to_be_blue": {
    "value": "blue",
    "match": "blue"
  }
}
```

## Events

When the data is submitted events are called, one before and one after. Place these scripts right before `</body>`.

### `submit:before`

Fired just before a form is submitted. It may be used to check some other validation rules if needed.

```html
<script>
  document
    .querySelector("form-prevent")
    .addEventListener("submit:before", (e) => {
      console.log(e.detail);
    });
</script>
```

### `submit:after`

Fired when the data has been submitted and has the collected data in `e.detail`.

```html
<script>
  document
    .querySelector("form-prevent")
    .addEventListener("submit:after", (e) => {
      console.log(e.detail);
    });
</script>
```

## Donate

To support this project you can donate here https://www.paypal.me/DevoneraAB

## License

MIT
