import smtplib
import os
import mimetypes
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders

# Create the email message
msg = MIMEMultipart()
msg['From'] = os.getenv('ALERT_SENDER_EMAIL', 'rajnandurkar2020@gmail.com')
msg['To'] = os.getenv('ALERT_RECIPIENT_EMAIL', 'rajnandurkar2020@gmail.com')
msg['Subject'] = 'DockerTool Cgroup Diagnostic Log File'

# Get the path to the log file
log_file_path = os.path.join(os.path.dirname(__file__), 'log.json')

# Set the body of the email
body = 'Attached: DockerTool automated cgroup telemetry diagnostic report.'
msg.attach(MIMEText(body, 'plain'))

# Open the log file and attach it to the email if it exists
if os.path.exists(log_file_path):
    with open(log_file_path, 'rb') as attachment:
        mime_type, _ = mimetypes.guess_type(log_file_path)
        mime_type, mime_subtype = (mime_type or 'application/json').split('/', 1)

        part = MIMEBase(mime_type, mime_subtype)
        part.set_payload(attachment.read())
        encoders.encode_base64(part)
        part.add_header('Content-Disposition', 'attachment', filename=os.path.basename(log_file_path))
        msg.attach(part)

# Send the email via TLS-encrypted SMTP
smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
smtp_port = int(os.getenv('SMTP_PORT', 587))
smtp_username = os.getenv('SMTP_USERNAME', 'rajnandurkar2020@gmail.com')
smtp_password = os.getenv('SMTP_PASSWORD', '')

if smtp_password:
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(msg)
    print('Email sent successfully via TLS SMTP')
else:
    print('Diagnostic log email ready (set SMTP_PASSWORD to dispatch)')
