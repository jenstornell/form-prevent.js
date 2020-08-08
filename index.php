<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <form-prevent id="hello" action="http://localhost/libraries/form-autoprevent/api.php" ruleset="form1.json" salt="4420d1918bbcf7686defdf9560bb5087d20076de5f77b7cb4c3b40bf46ec428b">
    <input type="text" value="ooopa" name="foobar">

    <label for="fname">First name:</label><br>
    <input type="text" id="fname" name="fname" value="John"><br>

    <label for="lname">Last name:</label><br>
    <input type="text" id="lname" name="lname" value="Doe"><br><br>

    <input type="submit" value="Submit">
  </form-prevent>

  <script src="assets/js/form-prevent.js?t=<?= time(); ?>"></script>
  <script>
    document.querySelector('form-prevent').addEventListener('submit:before', (e) => {
      console.log(e.detail);
    });

    document.querySelector('form-prevent').addEventListener('submit:after', (e) => {
      console.log(e.detail);
    });
  </script>
</body>

</html>