<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contract Ready for Review</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #efefef;
        font-family: Arial, Helvetica, sans-serif;
      }
      .wrapper {
        width: 100%;
        background-color: #efefef;
        padding: 20px 0;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        overflow: hidden;
      }
      .content {
        padding: 40px 24px;
      }
      .heading {
        color: #0b1b2b;
        font-size: 28px;
        font-weight: 600;
        margin: 0 0 20px;
      }
      .text {
        color: #102133;
        font-size: 16px;
        line-height: 1.5;
        margin: 0 0 15px;
      }
      .button-wrap {
        text-align: center;
        margin: 30px 0;
      }
      .button {
        display: inline-block;
        background-color: #d7ff00;
        color: #000000 !important;
        text-decoration: none;
        font-size: 18px;
        font-weight: 700;
        padding: 14px 30px;
        border-radius: 999px;
      }
      .footer {
        background-color: #d7ff00;
        text-align: center;
        padding: 24px;
      }
      .footer-text {
        color: #000000;
        font-size: 13px;
        margin: 0;
      }
    </style>
  </head>
  <body>
    <table role="presentation" width="100%" class="wrapper">
      <tr>
        <td align="center">
          <table role="presentation" class="container">
            <tr>
              <td class="content">
                <h1 class="heading">Contract Ready for Review</h1>
                <p class="text">Hi {{ $contract->client_full_name ?? 'Client' }},</p>
                <p class="text">
                  A new contract has been created and is ready for your review on Ultra Hustle.
                </p>
                
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #0b1b2b;">Contract Overview</h3>
                  <p class="text" style="margin-bottom: 5px;"><strong>Project Title:</strong> {{ $contract->title }}</p>
                  <p class="text" style="margin-bottom: 5px;"><strong>Service Provider:</strong> {{ $contract->provider_full_name }}</p>
                  <p class="text" style="margin-bottom: 5px;"><strong>Contract ID:</strong> {{ $contract->contract_id }}</p>
                  <p class="text" style="margin-bottom: 5px;"><strong>Type:</strong> {{ $contract->type }}</p>
                  <p class="text" style="margin-bottom: 0;"><strong>Project Cost:</strong> ${{ number_format($contract->project_cost, 2) }} ({{ $contract->payment_type }})</p>
                </div>

                @if($contract->project_summary)
                <div style="margin-bottom: 20px;">
                  <h3 style="color: #0b1b2b; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Project Summary</h3>
                  <p class="text">{{ $contract->project_summary }}</p>
                </div>
                @endif

                @if($contract->deliverables && count($contract->deliverables) > 0)
                <div style="margin-bottom: 20px;">
                  <h3 style="color: #0b1b2b; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Deliverables</h3>
                  <table width="100%" cellpadding="5" cellspacing="0" style="font-size: 14px;">
                    <thead>
                      <tr style="background-color: #f2f2f2;">
                        <th align="left">Title</th>
                        <th align="left">Format</th>
                        <th align="left">Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      @foreach($contract->deliverables as $del)
                      <tr>
                        <td style="border-bottom: 1px solid #eee;">{{ $del->title }}</td>
                        <td style="border-bottom: 1px solid #eee;">{{ $del->format }}</td>
                        <td style="border-bottom: 1px solid #eee;">{{ $del->quantity }}</td>
                      </tr>
                      @endforeach
                    </tbody>
                  </table>
                </div>
                @endif

                @if($contract->milestones && count($contract->milestones) > 0)
                <div style="margin-bottom: 20px;">
                  <h3 style="color: #0b1b2b; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Milestones</h3>
                  <table width="100%" cellpadding="5" cellspacing="0" style="font-size: 14px;">
                    <thead>
                      <tr style="background-color: #f2f2f2;">
                        <th align="left">Title</th>
                        <th align="left">Deadline</th>
                        <th align="right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      @foreach($contract->milestones as $ms)
                      <tr>
                        <td style="border-bottom: 1px solid #eee;">{{ $ms->title }}</td>
                        <td style="border-bottom: 1px solid #eee;">{{ $ms->deadline ? \Carbon\Carbon::parse($ms->deadline)->format('M d, Y') : 'N/A' }}</td>
                        <td align="right" style="border-bottom: 1px solid #eee;">${{ number_format($ms->amount, 2) }}</td>
                      </tr>
                      @endforeach
                    </tbody>
                  </table>
                </div>
                @endif

                <div style="margin-bottom: 20px;">
                  <h3 style="color: #0b1b2b; font-size: 18px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">Timeline & Revisions</h3>
                  <p class="text" style="margin-bottom: 5px;"><strong>Initial Deadline:</strong> {{ $contract->initial_delivery_deadline ? \Carbon\Carbon::parse($contract->initial_delivery_deadline)->format('M d, Y') : 'N/A' }}</p>
                  <p class="text" style="margin-bottom: 5px;"><strong>Review Window:</strong> {{ $contract->client_review_window }}</p>
                  <p class="text" style="margin-bottom: 5px;"><strong>Revision Rounds:</strong> {{ $contract->revision_rounds }}</p>
                  <p class="text" style="margin-bottom: 0;"><strong>Turnaround Time:</strong> {{ $contract->revision_turnaround_time }}</p>
                </div>

                <p class="text">
                  Please log in to your account to review the full terms and approve the contract to get started.
                </p>
                <div class="button-wrap">
                  <a class="button" href="{{ url('/contracts-listing?id=' . $contract->contract_id) }}">Review Contract</a>
                </div>
                <p class="text">Best regards,<br>The Ultra Hustle Team</p>
              </td>
            </tr>
            <tr>
              <td class="footer">
                <p class="footer-text">
                  Need help? Contact us at <a href="mailto:support@ultrahustle.com" style="color: #000000; font-weight: 700;">support@ultrahustle.com</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
