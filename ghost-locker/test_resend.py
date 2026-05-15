#!/usr/bin/env python3
"""
Test Resend Integration — Send ONE test email
"""

import os
import sqlite3
from pathlib import Path
import resend
from dotenv import load_dotenv

env_path = Path.home() / 'eevolvv' / '.env.local'
load_dotenv(env_path)

resend.api_key = os.getenv('RESEND_API_KEY')

def test_send():
    """Send a test email to verify Resend works"""
    
    try:
        params = {
            'from': 'Volvv-E <ai@eevolvv.com>',
            'to': ['hello@eevolvv.com'],  # Must be a list
            'subject': '[TEST] Volvv-E Email Engine',
            'text': """This is a test email from the Volvv-E outreach engine.

If you're reading this, Resend integration is working.

Next step: Send to real leads.

—Test System"""
        }
        
        result = resend.Emails.send(params)
        
        print("✅ Test email sent successfully!")
        print(f"   Email ID: {result.get('id')}")
        return True
        
    except Exception as e:
        print(f"❌ Test email failed: {e}")
        return False

if __name__ == '__main__':
    print("🧪 Testing Resend integration...\n")
    test_send()
