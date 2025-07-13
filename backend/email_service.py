import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
from typing import Optional, List
from datetime import datetime
from models import ContactSubmission
from database import settings_collection
import asyncio

class EmailService:
    def __init__(self):
        self.smtp_server = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        self.smtp_username = os.environ.get('SMTP_USERNAME', '')
        self.smtp_password = os.environ.get('SMTP_PASSWORD', '')
        self.from_email = os.environ.get('FROM_EMAIL', 'noreply@emmanueltobi.dev')
        self.admin_email = os.environ.get('ADMIN_EMAIL', 'emmanuel.tobi@example.com')
    
    async def send_email(self, to_email: str, subject: str, body: str, html_body: Optional[str] = None) -> bool:
        """Send email using SMTP"""
        try:
            # Check if email notifications are enabled
            setting = await settings_collection.find_one({"key": "email_notifications"})
            if not setting or setting.get("value") != "true":
                print("📧 Email notifications disabled")
                return False
            
            # Skip if SMTP credentials are not configured
            if not self.smtp_username or not self.smtp_password:
                print("📧 SMTP credentials not configured, skipping email")
                return False
            
            msg = MIMEMultipart('alternative')
            msg['From'] = self.from_email
            msg['To'] = to_email
            msg['Subject'] = subject
            
            # Add plain text part
            part1 = MIMEText(body, 'plain')
            msg.attach(part1)
            
            # Add HTML part if provided
            if html_body:
                part2 = MIMEText(html_body, 'html')
                msg.attach(part2)
            
            # Send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            server.send_message(msg)
            server.quit()
            
            print(f"✅ Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            print(f"❌ Error sending email: {e}")
            return False
    
    async def send_contact_notification(self, contact: ContactSubmission) -> bool:
        """Send notification to admin about new contact submission"""
        subject = f"New Contact Form Submission - {contact.subject}"
        
        body = f"""
New contact form submission received:

Name: {contact.name}
Email: {contact.email}
Subject: {contact.subject}
Company: {contact.company or 'Not provided'}
Phone: {contact.phone or 'Not provided'}
Project Type: {contact.project_type or 'Not provided'}
Budget: {contact.budget or 'Not provided'}

Message:
{contact.message}

Submitted at: {contact.created_at.strftime('%Y-%m-%d %H:%M:%S')}

---
Emmanuel Tobi Portfolio
"""
        
        html_body = f"""
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; }}
        .header h1 {{ color: white; margin: 0; }}
        .content {{ padding: 20px; }}
        .info-table {{ width: 100%; border-collapse: collapse; margin: 20px 0; }}
        .info-table th, .info-table td {{ border: 1px solid #ddd; padding: 12px; text-align: left; }}
        .info-table th {{ background-color: #f8f9fa; }}
        .message {{ background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }}
        .footer {{ text-align: center; padding: 20px; color: #666; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>New Contact Form Submission</h1>
    </div>
    <div class="content">
        <p>You have received a new contact form submission from your portfolio website.</p>
        
        <table class="info-table">
            <tr><th>Name</th><td>{contact.name}</td></tr>
            <tr><th>Email</th><td>{contact.email}</td></tr>
            <tr><th>Subject</th><td>{contact.subject}</td></tr>
            <tr><th>Company</th><td>{contact.company or 'Not provided'}</td></tr>
            <tr><th>Phone</th><td>{contact.phone or 'Not provided'}</td></tr>
            <tr><th>Project Type</th><td>{contact.project_type or 'Not provided'}</td></tr>
            <tr><th>Budget</th><td>{contact.budget or 'Not provided'}</td></tr>
            <tr><th>Submitted</th><td>{contact.created_at.strftime('%Y-%m-%d %H:%M:%S')}</td></tr>
        </table>
        
        <div class="message">
            <h3>Message:</h3>
            <p>{contact.message}</p>
        </div>
    </div>
    <div class="footer">
        <p>Emmanuel Tobi Portfolio - {contact.created_at.year}</p>
    </div>
</body>
</html>
"""
        
        return await self.send_email(self.admin_email, subject, body, html_body)
    
    async def send_welcome_email(self, contact: ContactSubmission) -> bool:
        """Send welcome email to the person who submitted the contact form"""
        subject = f"Thanks for reaching out, {contact.name}!"
        
        body = f"""
Hi {contact.name},

Thank you for reaching out through my portfolio website! I've received your message about "{contact.subject}" and I appreciate you taking the time to contact me.

I'll review your message and get back to you as soon as possible, usually within 24-48 hours.

In the meantime, feel free to:
- Check out my latest projects: https://emmanueltobi.dev/#projects
- Connect with me on LinkedIn: https://linkedin.com/in/emmanueltobi
- Follow my work on GitHub: https://github.com/emmanueltobi

Best regards,
Emmanuel Tobi
Full Stack Developer

---
This is an automated response. Please don't reply to this email.
"""
        
        html_body = f"""
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; }}
        .header h1 {{ color: white; margin: 0; }}
        .content {{ padding: 30px; }}
        .message-box {{ background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }}
        .links {{ display: flex; justify-content: center; gap: 20px; margin: 20px 0; }}
        .link-button {{ display: inline-block; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>Thank You for Reaching Out!</h1>
    </div>
    <div class="content">
        <p>Hi {contact.name},</p>
        
        <p>Thank you for reaching out through my portfolio website! I've received your message about <strong>"{contact.subject}"</strong> and I appreciate you taking the time to contact me.</p>
        
        <div class="message-box">
            <p><strong>I'll review your message and get back to you as soon as possible, usually within 24-48 hours.</strong></p>
        </div>
        
        <p>In the meantime, feel free to:</p>
        
        <div class="links">
            <a href="https://emmanueltobi.dev/#projects" class="link-button">View My Projects</a>
            <a href="https://linkedin.com/in/emmanueltobi" class="link-button">Connect on LinkedIn</a>
            <a href="https://github.com/emmanueltobi" class="link-button">Follow on GitHub</a>
        </div>
        
        <p>Best regards,<br>
        <strong>Emmanuel Tobi</strong><br>
        Full Stack Developer</p>
    </div>
    <div class="footer">
        <p>This is an automated response. Please don't reply to this email.</p>
        <p>Emmanuel Tobi Portfolio - {contact.created_at.year}</p>
    </div>
</body>
</html>
"""
        
        return await self.send_email(contact.email, subject, body, html_body)
    
    async def send_newsletter_confirmation(self, email: str, name: str, confirmation_token: str) -> bool:
        """Send newsletter subscription confirmation email"""
        subject = "Please confirm your newsletter subscription"
        confirmation_url = f"https://emmanueltobi.dev/api/newsletter/confirm?token={confirmation_token}"
        
        body = f"""
Hi {name or 'there'},

Thank you for subscribing to my newsletter! To complete your subscription, please click the link below:

{confirmation_url}

If you didn't subscribe to this newsletter, please ignore this email.

Best regards,
Emmanuel Tobi
Full Stack Developer
"""
        
        html_body = f"""
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; }}
        .header h1 {{ color: white; margin: 0; }}
        .content {{ padding: 30px; }}
        .confirm-button {{ display: inline-block; padding: 15px 30px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
        .footer {{ text-align: center; padding: 20px; color: #666; font-size: 12px; }}
    </style>
</head>
<body>
    <div class="header">
        <h1>Confirm Your Subscription</h1>
    </div>
    <div class="content">
        <p>Hi {name or 'there'},</p>
        
        <p>Thank you for subscribing to my newsletter! To complete your subscription, please click the button below:</p>
        
        <div style="text-align: center;">
            <a href="{confirmation_url}" class="confirm-button">Confirm Subscription</a>
        </div>
        
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="{confirmation_url}">{confirmation_url}</a></p>
        
        <p>If you didn't subscribe to this newsletter, please ignore this email.</p>
        
        <p>Best regards,<br>
        <strong>Emmanuel Tobi</strong><br>
        Full Stack Developer</p>
    </div>
    <div class="footer">
        <p>Emmanuel Tobi Portfolio - {datetime.now().year}</p>
    </div>
</body>
</html>
"""
        
        return await self.send_email(email, subject, body, html_body)

# Global email service instance
email_service = EmailService()