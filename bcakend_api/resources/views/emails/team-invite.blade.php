<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Team Invitation</title>
</head>
<body>
    <p>Hi,</p>
    <p><strong>{{ $inviterName }}</strong> invited you to join the team <strong>{{ $teamName }}</strong> on Ultra Hustle.</p>
    <p>Your role: <strong>{{ $role }}</strong></p>
    <p>
        <a href="{{ $inviteLink }}">Accept or decline this invite</a>
    </p>
    <p>If you didn’t expect this email, you can ignore it.</p>
</body>
</html>
