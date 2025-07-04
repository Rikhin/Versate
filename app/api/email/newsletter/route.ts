import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Send welcome email with Versa information
    const { data, error } = await resend.emails.send({
      from: "Versa <info@versate.pro>",
      to: [email],
      subject: "Welcome to Versa! 🚀 Your Complete Guide to Success",
      replyTo: email,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Versa</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .container {
              background: white;
              border-radius: 20px;
              padding: 40px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
            }
            .logo {
              font-size: 2.5em;
              font-weight: bold;
              background: linear-gradient(45deg, #667eea, #764ba2);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 10px;
            }
            .subtitle {
              color: #666;
              font-size: 1.1em;
            }
            .section {
              margin: 30px 0;
              padding: 25px;
              border-radius: 15px;
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              border-left: 4px solid #667eea;
            }
            .section h3 {
              color: #2d3748;
              margin-bottom: 15px;
              font-size: 1.3em;
            }
            .feature-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin: 25px 0;
            }
            .feature {
              background: white;
              padding: 20px;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.05);
              border: 1px solid #e2e8f0;
            }
            .feature-icon {
              font-size: 2em;
              margin-bottom: 10px;
            }
            .feature h4 {
              color: #2d3748;
              margin-bottom: 8px;
              font-size: 1.1em;
            }
            .feature p {
              color: #666;
              font-size: 0.9em;
              margin: 0;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(45deg, #667eea, #764ba2);
              color: white;
              padding: 15px 30px;
              text-decoration: none;
              border-radius: 25px;
              font-weight: bold;
              margin: 20px 0;
              text-align: center;
            }
            .stats {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 15px;
              margin: 30px 0;
            }
            .stat {
              text-align: center;
              padding: 20px;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            }
            .stat-number {
              font-size: 2em;
              font-weight: bold;
              color: #667eea;
            }
            .stat-label {
              color: #666;
              font-size: 0.9em;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              color: #666;
            }
            @media (max-width: 600px) {
              .feature-grid {
                grid-template-columns: 1fr;
              }
              .stats {
                grid-template-columns: 1fr;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Versa</div>
              <div class="subtitle">Your Gateway to Academic Excellence</div>
            </div>

            <div class="section">
              <h3>🎯 What is Versa?</h3>
              <p>Versa is the ultimate platform connecting ambitious students with researchers, college admission counselors, Y-Combinator affiliates, summer programs, competitions, and a thriving community of like-minded peers.</p>
            </div>

            <div class="section">
              <h3>✨ Key Features</h3>
              <div class="feature-grid">
                <div class="feature">
                  <div class="feature-icon">🤝</div>
                  <h4>Smart Team Matching</h4>
                  <p>AI-powered matching connects you with teammates who share your skills, interests, and goals.</p>
                </div>
                <div class="feature">
                  <div class="feature-icon">💬</div>
                  <h4>Real-Time Collaboration</h4>
                  <p>Built-in chat, file sharing, and project management tools keep your team organized and productive.</p>
                </div>
                <div class="feature">
                  <div class="feature-icon">🏆</div>
                  <h4>Competition Support</h4>
                  <p>Access resources, deadlines, and guidelines for 25+ prestigious academic competitions.</p>
                </div>
                <div class="feature">
                  <div class="feature-icon">🎓</div>
                  <h4>Expert Network</h4>
                  <p>Connect with researchers, admission counselors, and Y-Combinator affiliates for mentorship.</p>
                </div>
              </div>
            </div>

            <div class="section">
              <h3>📊 Platform Statistics</h3>
              <div class="stats">
                <div class="stat">
                  <div class="stat-number">25+</div>
                  <div class="stat-label">Supported Competitions</div>
                </div>
                <div class="stat">
                  <div class="stat-number">1000+</div>
                  <div class="stat-label">Active Students</div>
                </div>
                <div class="stat">
                  <div class="stat-number">500+</div>
                  <div class="stat-label">Expert Connections</div>
                </div>
              </div>
            </div>

            <div class="section">
              <h3>🚀 How It Works</h3>
              <ol style="padding-left: 20px;">
                <li><strong>Sign Up & Create Profile:</strong> Tell us your interests, skills, and goals</li>
                <li><strong>Connect & Collaborate:</strong> Message, join teams, and work together</li>
                <li><strong>Achieve & Grow:</strong> Win competitions, publish research, and build your network</li>
              </ol>
            </div>

            <div class="section">
              <h3>💎 Pricing Plans</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin: 20px 0;">
                <div style="text-align: center; padding: 15px; background: white; border-radius: 10px; border: 2px solid #e2e8f0;">
                  <h4 style="margin: 0 0 10px 0; color: #667eea;">Free</h4>
                  <div style="font-size: 1.5em; font-weight: bold; margin-bottom: 5px;">$0</div>
                  <div style="font-size: 0.9em; color: #666;">Basic features</div>
                </div>
                <div style="text-align: center; padding: 15px; background: white; border-radius: 10px; border: 2px solid #667eea;">
                  <h4 style="margin: 0 0 10px 0; color: #667eea;">Pro</h4>
                  <div style="font-size: 1.5em; font-weight: bold; margin-bottom: 5px;">$12/mo</div>
                  <div style="font-size: 0.9em; color: #666;">Advanced features</div>
                </div>
                <div style="text-align: center; padding: 15px; background: white; border-radius: 10px; border: 2px solid #e2e8f0;">
                  <h4 style="margin: 0 0 10px 0; color: #667eea;">Enterprise</h4>
                  <div style="font-size: 1.5em; font-weight: bold; margin-bottom: 5px;">$49/mo</div>
                  <div style="font-size: 0.9em; color: #666;">For organizations</div>
                </div>
              </div>
            </div>

            <div style="text-align: center; margin: 40px 0;">
              <a href="https://colabboard-zf.vercel.app/sign-up" class="cta-button">Join Versa Now</a>
            </div>

            <div class="footer">
              <p>Thank you for joining the Versa community! We're excited to help you achieve your academic and professional goals.</p>
              <p style="margin-top: 15px; font-size: 0.9em;">
                <a href="https://colabboard-zf.vercel.app" style="color: #667eea;">Visit Versa</a> | 
                <a href="mailto:hello@versa.com" style="color: #667eea;">Contact Us</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message || error }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 