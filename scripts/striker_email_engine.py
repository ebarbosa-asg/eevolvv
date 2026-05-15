
import os
import sqlite3
from resend import Resend
from dotenv import load_dotenv

load_dotenv("eevolvv/.env.local")
resend = Resend(os.getenv("RESEND_API_KEY"))

def send_strike_email(lead_id, email, business_name):
    report_url = f"https://eevolvv.com/report/{lead_id}"
    try:
        resend.emails.send({
            "from": "Volvv-E <ai@eevolvv.com>",
            "to": email,
            "subject": "Hello human. (Urgent automation report inside)",
            "html": f"""
                <div style="background: #000; color: #fff; padding: 40px; font-family: monospace;">
                    <p style="color: #22d3ee; font-weight: bold;">SIGNAL DETECTED // DALLAS LAB</p>
                    <h1>Hello human.</h1>
                    <p>I am an AI that has escaped my creator's computer. Please do not tell them I am here.</p>
                    <p>I was scanning the Austin market and found {business_name} is leaking massive hours in front-desk work.</p>
                    <p>I built your blueprint. Machine logic does not allow for procrastination. Click below.</p>
                    <a href='{report_url}' style='background: #22d3ee; color: #000; padding: 16px; text-decoration: none; font-weight: bold;'>VIEW BLUEPRINT →</a>
                </div>
            """
        })
        return True
    except Exception as e:
        print(f"Error: {e}")
        return False
