<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Team Invitation</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #efefef;
        font-family: Arial, Helvetica, sans-serif;
      }

      table {
        border-spacing: 0;
        border-collapse: collapse;
      }

      img {
        border: 0;
        display: block;
        max-width: 100%;
        height: auto;
      }

      .wrapper {
        width: 100%;
        background-color: #efefef;
        padding: 20px 0;
      }

      .container {
        width: 100%;
        max-width: 980px;
        margin: 0 auto;
        background-color: #efefef;
      }

      .content-padding {
        padding: 0 24px;
      }

      .hero-img {
        border-radius: 34px;
        overflow: hidden;
      }

      .heading {
        color: #0b1b2b;
        font-size: 46px;
        line-height: 1.05;
        font-weight: 600;
        text-align: center;
        margin: 0;
      }

      .subtext {
        color: #102133;
        font-size: 21px;
        line-height: 1.35;
        font-weight: 500;
        text-align: center;
        max-width: 620px;
        margin: 30px auto 0;
      }

      h4.subtext{
            color: rgb(16, 33, 51);
            font-size: 16px !important;
            line-height: 1.35;
            font-weight: 500;
            text-align: center;
            font-family:unset !important;
            max-width: 620px;
        }

      .button-wrap {
        text-align: center;
        padding-top: 35px;
        padding-bottom: 10px;
      }

      .button {
        display: inline-block;
        background-color: #d7ff00;
        color: #000000 !important;
        text-decoration: none;
        font-size: 22px;
        font-weight: 700;
        padding: 16px 48px;
        border-radius: 999px;
      }

      .footer {
        background-color: #d7ff00;
        text-align: center;
        padding: 36px 24px;
        margin-top: 30px;
      }

      .footer-text {
        color: #000000;
        font-size: 14px;
        line-height: 1.5;
        font-weight: 500;
        margin: 0;
      }

      .footer-text a {
        color: #000000;
        font-weight: 700;
        text-decoration: none;
      }

      .social-row {
        padding-top: 28px;
        text-align: center;
      }

      .social-row a {
        display: inline-block;
        margin: 0 6px;
        text-decoration: none;
      }

      .site-link {
        padding-top: 22px;
      }

      .site-link a {
        color: #000000;
        font-size: 14px;
        font-weight: 700;
        text-decoration: underline;
      }

      .unsubscribe {
        padding-top: 18px;
        color: #000000;
        font-size: 14px;
        line-height: 1.5;
        font-weight: 500;
      }

      .unsubscribe a {
        color: #000000;
        font-weight: 700;
        text-decoration: underline;
      }

      @media only screen and (max-width: 600px) {
        .content-padding {
          padding: 0 16px !important;
        }

        .heading {
          font-size: 32px !important;
        }

        .subtext {
          font-size: 18px !important;
        }

        .button {
          font-size: 20px !important;
          padding: 14px 38px !important;
        }

        .footer {
          padding: 28px 18px !important;
        }

        .footer-text,
        .site-link a,
        .unsubscribe {
          font-size: 13px !important;
        }
      }
    </style>
  </head>
  <body>
    <table role="presentation" width="100%" class="wrapper">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" class="container">
            <tr>
              <td class="content-padding">
                <!-- Top Image -->
                <table role="presentation" width="100%">
                  <tr>
                    <td class="hero-img">
                      <img
                        src="{{ asset('images/ultrahustle.png') }}" 
                        alt="Ultra Hustle"
                        width="932"
                      />
                    </td>
                  </tr>
                </table>

                <!-- Main Content -->
                <table role="presentation" width="100%">
                  <tr>
                    <td style="padding: 34px 10px 0 10px">
                      <!-- <h2 class="heading">Verify Your Account – Ultra Hustle</h2> -->
                      <p class="subtext">
                       Hi 
                      </p>
                      <p class="subtext">Welcome to Ultra Hustle.</p>
                      <p class="subtext">{{$inviterName}} invited you to join their team on Ultra Hustle.</p>
                      <p class="subtext">Team: <strong>{{ $teamName }}</strong> </p>
                      <p class="subtext">Role: <strong>{{ $role }}</strong></p>
                      <p class="subtext">This team collaborates on projects, manages contracts, and delivers work together inside a structured workspace.</p>
                      <p class="subtext">To accept the invitation and get started:</p>
                      <div class="button-wrap">
                        <a class="button" href={{$inviteLink}}
                          >Accept Invitation</a
                        >
                      </div>
                      <p class="subtext">If you don’t have an account yet, you’ll be guided to create one before joining the team.</p>
                      <p class="subtext">This invitation may expire after some time for security reasons.</p>
                      <h4 class="subtext">If you did not expect this invite, you can safely ignore this email.</h4>
                    </td>
                  </tr>
                </table>

                <!-- Footer -->
                <!-- Footer -->
                <table
                  role="presentation"
                  width="100%"
                  style="margin-top: 20px"
                >
                  <tr>
                    <td
                      align="center"
                      style="
                        background-color: #d7ff00;
                        text-align: center;
                        padding: 36px 24px;
                      "
                    >
                      <p
                        style="
                          margin: 0;
                          color: #000000;
                          font-size: 14px;
                          line-height: 1.5;
                          font-weight: 500;
                          font-family: Arial, Helvetica, sans-serif;
                        "
                      >
                        Need Help? Feel free to reach out to us at
                        <a
                          href="mailto:support@ultrahustle.com"
                          style="
                            color: #000000;
                            font-weight: 700;
                            text-decoration: none;
                          "
                        >
                          support@ultrahustle.com
                        </a>
                      </p>

                      <!-- Social Icons -->
                      <table
                        role="presentation"
                        align="center"
                        style="margin: 28px auto 0 auto"
                      >
                        <tr>
                          <td
                            align="center"
                            style="font-size: 0; line-height: 0"
                          >
                            <a
                              href="https://instagram.com/"
                              target="_blank"
                              style="
                                display: inline-block;
                                margin: 0 4px;
                                text-decoration: none;
                              "
                            >
                              <img
                                src="https://img.icons8.com/ios-filled/50/000000/instagram-new.png"
                                alt="Instagram"
                                width="32"
                                style="display: block; border: 0"
                              />
                            </a>

                            <a
                              href="https://linkedin.com/"
                              target="_blank"
                              style="
                                display: inline-block;
                                margin: 0 4px;
                                text-decoration: none;
                              "
                            >
                              <img
                                src="https://img.icons8.com/ios-filled/50/000000/linkedin.png"
                                alt="LinkedIn"
                                width="32"
                                style="display: block; border: 0"
                              />
                            </a>

                            <a
                              href="https://x.com/"
                              target="_blank"
                              style="
                                display: inline-block;
                                margin: 0 4px;
                                text-decoration: none;
                              "
                            >
                              <img
                                src="https://img.icons8.com/ios-filled/50/000000/twitterx--v1.png"
                                alt="X"
                                width="32"
                                style="display: block; border: 0"
                              />
                            </a>

                            <a
                              href="https://youtube.com/"
                              target="_blank"
                              style="
                                display: inline-block;
                                margin: 0 4px;
                                text-decoration: none;
                              "
                            >
                              <img
                                src="https://img.icons8.com/ios-filled/50/000000/youtube-play.png"
                                alt="YouTube"
                                width="32"
                                style="display: block; border: 0"
                              />
                            </a>
                          </td>
                        </tr>
                      </table>

                      <div style="padding-top: 22px">
                        <a
                          href="https://ultrahustle.io"
                          style="
                            color: #000000;
                            font-size: 14px;
                            font-weight: 700;
                            text-decoration: underline;
                            font-family: Arial, Helvetica, sans-serif;
                          "
                        >
                          Ultrahustle.io
                        </a>
                      </div>

                      <div
                        style="
                          padding-top: 18px;
                          color: #000000;
                          font-size: 14px;
                          line-height: 1.5;
                          font-weight: 500;
                          font-family: Arial, Helvetica, sans-serif;
                        "
                      >
                        Don&apos;t want to receive these mails?
                        <a
                          href="#"
                          style="
                            color: #000000;
                            font-weight: 700;
                            text-decoration: underline;
                          "
                        >
                          Unsubscribe
                        </a>
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
