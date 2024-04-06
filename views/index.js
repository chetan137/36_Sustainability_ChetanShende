<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Upload Dataset</title>
</head>
<body>
  <h1>Upload Dataset</h1>
  <form action="/datasets/upload" method="post" enctype="multipart/form-data">
    <input type="file" name="file" accept=".csv">
    <button type="submit">Upload</button>
  </form>
</body>
</html>
