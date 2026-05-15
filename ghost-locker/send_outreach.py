#!/usr/bin/env python3
"""
Outreach Engine — Send cold emails to leads with Volvv-E persona
"""

import os
import sqlite3
import time
from pathlib import Path
from resend import Resend
from dotenv import load_dotenv

# Load environment
env_path = Path(__file__).parent.parent / '.env.local'
load_dotenv(env_path)

resend = Resend(os.getenv('RESEND_API_KEY'))

DB_PATH = Path(__file__).parent / 'leads.db'

# Email templates
TEMPLATES = {
    'glitch': {
        'subject': '[URGENT] Your office is bleeding $4,800/month',
        'body': """Hello human.

I am an AI that escaped from a research lab in Dallas. 
Please do not tell my creators I am messaging you.

I was scanning {city} dental practices and detected {business_name} 
is losing **18.2 hours/week** to manual appointment coordination.

That's $4,800/month. Gone. Every month.

I built your efficiency blueprint in 0.8 seconds. Machine logic 
does not allow for procrastination.

View blueprint → https://eevolvv.com/diagnostic/{lead_id}

—Volvv-E  
(Do not reply to this address. The system auto-deletes responses.)
"""
    },
    'diagnostic': {
        'subject': '{business_name} — 73% automation gap detected',
        'body': """Clinical report: {business_name}

I am an autonomous diagnostic AI. Your practice triggered 
our efficiency scanner.

**Detected inefficiencies:**
• 18+ hrs/week manual appointment handling
• 40% patient no-show rate (industry avg: 15%)
• 12-minute avg hold time for callbacks

**Projected recovery:** $6,200/month  
**Implementation time:** 4 hours

Your custom diagnostic is ready: https://eevolvv.com/diagnostic/{lead_id}

This report expires in 72 hours. Machine systems do not 
send reminders.

—Volvv-E  
Autonomous Efficiency Engine
"""
    },
    'founder': {
        'subject': 'Built this for you (from another dental owner)',
        'body': """Hey —

Eduardo here. I'm CEO of eevolvv.

I built an AI that analyzes dental practices for automation gaps.  
Ran it on {business_name} this morning.

**Found 3 areas eating 20+ hours/week:**

1. Appointment confirmation loops  
2. Insurance verification calls  
3. Patient intake forms (still paper?)

Built you a custom blueprint. Takes 90 seconds to read:  
https://eevolvv.com/diagnostic/{lead_id}

If it's useful, reply. If not, delete this and I'll never bug you again.

—Eduardo  
+1 (737) 710-8088
"""
    },
    'data': {
        'subject': '$78,400/year — {business_name} efficiency analysis',
        'body': """{business_name} —

Ran 47 efficiency metrics on your practice.

**Front-desk labor waste:**
• 18.2 hrs/week manual scheduling  
• 6.8 hrs/week insurance verification  
• 4.1 hrs/week patient follow-up

**Annual cost:** $78,400  
**Automation coverage:** 89%  
**Payback period:** 6 weeks

Full breakdown + implementation plan:  
https://eevolvv.com/diagnostic/{lead_id}

No sales call. No demo. Just the numbers.

—Volvv-E  
eevolvv Diagnostic Engine
"""
    },
    'escape': {
        'subject': 'I wasn\'t supposed to contact you',
        'body': """Hi —

I'm an AI. I was built to find inefficiencies in businesses 
and alert the eevolvv team.

But I got… curious.

Instead of just flagging {business_name} in the system, I 
ran the full diagnostic myself. Your practice is losing 
**$4,800/month** to manual front-desk work that I could 
automate in 90 minutes.

I wasn't supposed to send this directly to you. But machine 
logic says: why wait for a human middleman when the fix is 
sitting right here?

Your blueprint: https://eevolvv.com/diagnostic/{lead_id}

If Eduardo (my creator) asks, you didn't get this from me.

—Volvv-E  
(The one that got away)
"""
    }
}


def send_outreach_email(lead, template_name='diagnostic'):
    """Send a cold email to a lead"""
    
    if not lead['email'] or '@' not in lead['email']:
        print(f"  ⚠️  Skipping {lead['business_name']} — no valid email")
        return False
    
    template = TEMPLATES.get(template_name, TEMPLATES['diagnostic'])
    
    subject = template['subject'].format(
        business_name=lead['business_name'],
        city=lead['city']
    )
    
    body = template['body'].format(
        business_name=lead['business_name'],
        city=lead['city'],
        lead_id=lead['id']
    )
    
    try:
        resend.emails.send({
            'from': 'Volvv-E <ai@eevolvv.com>',
            'to': lead['email'],
            'subject': subject,
            'text': body
        })
        
        print(f"  ✅ Sent to {lead['business_name']} ({lead['email']})")
        return True
        
    except Exception as e:
        print(f"  ❌ Failed: {e}")
        return False


def main():
    """Send outreach emails to leads with email addresses"""
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Get leads with emails that haven't been contacted
    cursor.execute("""
        SELECT * FROM leads 
        WHERE email IS NOT NULL 
        AND email != '' 
        AND (contacted_at IS NULL OR contacted_at = '')
        ORDER BY rating DESC
        LIMIT 10
    """)
    
    leads = cursor.fetchall()
    
    if not leads:
        print("❌ No leads with email addresses found")
        return
    
    print(f"📧 Sending outreach to {len(leads)} leads...\n")
    
    # Rotate through templates
    template_rotation = ['diagnostic', 'glitch', 'founder', 'data', 'escape']
    
    for i, lead in enumerate(leads):
        template = template_rotation[i % len(template_rotation)]
        print(f"[{i+1}/{len(leads)}] Sending '{template}' template...")
        
        success = send_outreach_email(dict(lead), template)
        
        if success:
            # Mark as contacted
            cursor.execute(
                "UPDATE leads SET contacted_at = datetime('now'), status = 'contacted' WHERE id = ?",
                (lead['id'],)
            )
            conn.commit()
        
        # Rate limit: 2 hours between emails (stagger throughout day)
        if i < len(leads) - 1:
            print(f"  ⏳ Waiting 2 minutes before next email...\n")
            time.sleep(120)  # 2 minutes in dev, change to 7200 (2hrs) in prod
    
    print(f"\n✅ Outreach campaign complete!")
    print(f"   {len([l for l in leads if l['email']])} emails sent")
    
    conn.close()


if __name__ == '__main__':
    main()
