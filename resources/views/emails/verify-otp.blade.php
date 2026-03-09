<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Email Verification</title>
</head>
<body>
    <p>Hi {{ $fullName }},</p>
    <p>Your Ultra Hustle verification code is:</p>
    <h2 style="letter-spacing: 4px;">{{ $code }}</h2>
    <p>This code expires in {{ $expiresInMinutes }} minutes.</p>
    <p>If you didn’t request this, you can ignore this email.</p>
</body>
</html>
