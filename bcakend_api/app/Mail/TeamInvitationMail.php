<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TeamInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly string $teamName,
        public readonly string $inviterName,
        public readonly string $role,
        public readonly string $inviteLink,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'You have been invited to join a team on Ultra Hustle',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.team-invite',
            with: [
                'teamName' => $this->teamName,
                'inviterName' => $this->inviterName,
                'role' => $this->role,
                'inviteLink' => $this->inviteLink,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
