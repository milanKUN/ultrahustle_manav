<?php

namespace App\Mail;

use App\Models\Contract;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContractReviewMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public readonly Contract $contract,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Contract Ready for Review: ' . $this->contract->title,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contract-review',
            with: [
                'contract' => $this->contract,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
