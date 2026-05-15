#!/usr/bin/env python3
"""
Email Extractor — Scrape emails from lead websites
"""

import re
import sqlite3
import requests
from bs4 import BeautifulSoup
from pathlib import Path
import time

DB_PATH = Path(__file__).parent / 'leads.db'

def extract_email_from_website(url):
    """Scrape website and extract email using common patterns"""
    try:
        # Add timeout and user agent
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
        
        response = requests.get(url, timeout=10, headers=headers, allow_redirects=True)
        response.raise_for_status()
        
        html = response.text
        soup = BeautifulSoup(html, 'html.parser')
        
        # Pattern 1: Look for mailto: links
        mailto_links = soup.find_all('a', href=re.compile(r'^mailto:', re.I))
        if mailto_links:
            email = mailto_links[0]['href'].replace('mailto:', '').split('?')[0].strip()
            return email.lower()
        
        # Pattern 2: Regex search for email patterns in visible text
        text = soup.get_text()
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        
        # Filter out common noise (no-reply, privacy, etc.)
        valid_emails = [
            e for e in emails 
            if not any(x in e.lower() for x in ['noreply', 'privacy', 'example', 'test', 'spam'])
        ]
        
        if valid_emails:
            # Prefer contact/info/hello emails
            for email in valid_emails:
                if any(x in email.lower() for x in ['contact', 'info', 'hello', 'admin']):
                    return email.lower()
            return valid_emails[0].lower()
        
        # Pattern 3: Check contact page
        contact_links = soup.find_all('a', string=re.compile(r'contact', re.I))
        for link in contact_links[:2]:  # Try first 2 contact links
            contact_url = link.get('href', '')
            if contact_url.startswith('/'):
                contact_url = url.rstrip('/') + contact_url
            
            if contact_url.startswith('http'):
                try:
                    contact_response = requests.get(contact_url, timeout=5, headers=headers)
                    contact_soup = BeautifulSoup(contact_response.text, 'html.parser')
                    contact_text = contact_soup.get_text()
                    emails = re.findall(email_pattern, contact_text)
                    valid = [e for e in emails if 'noreply' not in e.lower()]
                    if valid:
                        return valid[0].lower()
                except:
                    pass
        
        return None
        
    except Exception as e:
        print(f"  ❌ Error scraping {url}: {e}")
        return None


def main():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Get leads without emails
    cursor.execute("""
        SELECT id, business_name, website 
        FROM leads 
        WHERE (email IS NULL OR email = '') 
        AND website IS NOT NULL 
        AND website != ''
    """)
    
    leads = cursor.fetchall()
    print(f"🔍 Extracting emails for {len(leads)} leads...\n")
    
    success = 0
    failed = 0
    
    for lead_id, business_name, website in leads:
        print(f"Scraping: {business_name[:40]}...")
        email = extract_email_from_website(website)
        
        if email:
            cursor.execute("UPDATE leads SET email = ? WHERE id = ?", (email, lead_id))
            conn.commit()
            print(f"  ✅ Found: {email}\n")
            success += 1
        else:
            print(f"  ⚠️  No email found\n")
            failed += 1
        
        # Rate limit: 2 seconds between requests
        time.sleep(2)
    
    print(f"\n📊 Results:")
    print(f"  ✅ Success: {success}")
    print(f"  ❌ Failed:  {failed}")
    
    conn.close()

if __name__ == "__main__":
    main()
