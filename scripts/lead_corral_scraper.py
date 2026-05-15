#!/usr/bin/env python3
"""
Lead Corral Scraper — Google Maps → SQLite leads DB
Usage:
  python3 lead_corral_scraper.py --query "dental office" --cities "Dallas TX,Houston TX,Austin TX" --limit 50
  python3 lead_corral_scraper.py --query "gym" --cities "Dallas TX" --limit 30
  python3 lead_corral_scraper.py --list   # show all leads
  python3 lead_corral_scraper.py --export leads.csv
"""

import argparse
import csv
import json
import sqlite3
import time
import re
import sys
from datetime import datetime
from pathlib import Path

# ── DB setup ──────────────────────────────────────────────────────────────────

DB_PATH = Path(__file__).parent.parent / "ghost-locker" / "leads.db"
DB_PATH.parent.mkdir(exist_ok=True)

SCHEMA = """
CREATE TABLE IF NOT EXISTS leads (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    business_name   TEXT NOT NULL,
    category        TEXT,
    phone           TEXT,
    website         TEXT,
    address         TEXT,
    city            TEXT,
    state           TEXT,
    rating          REAL,
    review_count    INTEGER,
    google_maps_url TEXT,
    status          TEXT DEFAULT 'raw',
    notes           TEXT,
    scraped_at      TEXT,
    contacted_at    TEXT,
    UNIQUE(business_name, address)
);
CREATE INDEX IF NOT EXISTS idx_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_city   ON leads(city);
CREATE INDEX IF NOT EXISTS idx_cat    ON leads(category);
"""

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.executescript(SCHEMA)
    conn.commit()
    return conn

# ── Scraper ───────────────────────────────────────────────────────────────────

def scrape_google_maps(query: str, city: str, limit: int = 50) -> list[dict]:
    from playwright.sync_api import sync_playwright

    results = []
    search_term = f"{query} in {city}"
    url = f"https://www.google.com/maps/search/{search_term.replace(' ', '+')}"

    print(f"\n  Searching: {search_term}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800}
        )
        page = ctx.new_page()
        page.goto(url, wait_until="networkidle", timeout=30000)
        time.sleep(2)

        # Scroll the results panel to load more
        for _ in range(8):
            try:
                panel = page.locator('[role="feed"]').first
                panel.evaluate("el => el.scrollBy(0, 800)")
                time.sleep(1.2)
                count = page.locator('[role="feed"] > div > div > a').count()
                if count >= limit:
                    break
            except Exception:
                break

        # Extract listings
        cards = page.locator('[role="feed"] > div > div > a').all()
        print(f"  Found {len(cards)} cards, extracting up to {limit}...")

        for card in cards[:limit]:
            try:
                name = card.get_attribute("aria-label") or ""
                href = card.get_attribute("href") or ""

                # Click to load detail panel
                card.click()
                time.sleep(1.8)

                lead = {
                    "business_name": name.strip(),
                    "category":      query,
                    "city":          city.split(",")[0].strip(),
                    "state":         city.split(",")[1].strip() if "," in city else "",
                    "google_maps_url": href,
                    "phone":         "",
                    "website":       "",
                    "address":       "",
                    "rating":        None,
                    "review_count":  None,
                    "scraped_at":    datetime.utcnow().isoformat(),
                }

                # Phone
                try:
                    phone_el = page.locator('[data-tooltip="Copy phone number"]').first
                    lead["phone"] = phone_el.inner_text(timeout=2000).strip()
                except Exception:
                    pass

                # Website
                try:
                    web_el = page.locator('a[data-tooltip="Open website"]').first
                    lead["website"] = web_el.get_attribute("href", timeout=2000) or None
                except Exception:
                    pass

                # Address
                try:
                    addr_el = page.locator('[data-tooltip="Copy address"]').first
                    lead["address"] = addr_el.inner_text(timeout=2000).strip()
                except Exception:
                    pass

                # Rating + reviews
                try:
                    rating_text = page.locator('[role="img"][aria-label*="stars"]').first.get_attribute("aria-label", timeout=2000) or ""
                    m = re.search(r"([\d.]+) stars", rating_text)
                    if m:
                        lead["rating"] = float(m.group(1))
                    rev_el = page.locator('span[aria-label*="reviews"]').first
                    rev_text = rev_el.get_attribute("aria-label", timeout=2000) or ""
                    m2 = re.search(r"([\d,]+) reviews", rev_text)
                    if m2:
                        lead["review_count"] = int(m2.group(1).replace(",", ""))
                except Exception:
                    pass

                if lead["business_name"]:
                    results.append(lead)
                    status = "✓" if lead["phone"] else "·"
                    print(f"  {status} {lead['business_name'][:40]:<40} {lead['phone'] or '(no phone)'}")

            except Exception as e:
                print(f"  ! error on card: {e}")
                continue

        browser.close()

    return results

# ── DB helpers ────────────────────────────────────────────────────────────────

def save_leads(leads: list[dict]) -> tuple[int, int]:
    conn = get_db()
    inserted = 0
    skipped = 0
    for lead in leads:
        try:
            conn.execute("""
                INSERT INTO leads (business_name, category, phone, website, address,
                                   city, state, rating, review_count, google_maps_url, scraped_at)
                VALUES (:business_name,:category,:phone,:website,:address,
                        :city,:state,:rating,:review_count,:google_maps_url,:scraped_at)
            """, lead)
            inserted += 1
        except sqlite3.IntegrityError:
            skipped += 1
    conn.commit()
    conn.close()
    return inserted, skipped

def list_leads(status: str = None, limit: int = 100):
    conn = get_db()
    q = "SELECT * FROM leads"
    params = []
    if status:
        q += " WHERE status = ?"
        params.append(status)
    q += " ORDER BY scraped_at DESC LIMIT ?"
    params.append(limit)
    rows = conn.execute(q, params).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def export_csv(path: str):
    leads = list_leads(limit=10000)
    if not leads:
        print("No leads to export.")
        return
    with open(path, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=leads[0].keys())
        w.writeheader()
        w.writerows(leads)
    print(f"Exported {len(leads)} leads to {path}")

def update_status(lead_id: int, status: str, notes: str = ""):
    conn = get_db()
    conn.execute(
        "UPDATE leads SET status=?, notes=?, contacted_at=? WHERE id=?",
        (status, notes, datetime.utcnow().isoformat() if status == "contacted" else None, lead_id)
    )
    conn.commit()
    conn.close()

def print_summary():
    conn = get_db()
    rows = conn.execute("""
        SELECT status, COUNT(*) as n FROM leads GROUP BY status ORDER BY n DESC
    """).fetchall()
    total = conn.execute("SELECT COUNT(*) FROM leads").fetchone()[0]
    conn.close()
    print(f"\n{'─'*40}")
    print(f"  LEADS DATABASE — {DB_PATH}")
    print(f"{'─'*40}")
    print(f"  Total: {total}")
    for r in rows:
        print(f"  {r['status']:<15} {r['n']}")
    print(f"{'─'*40}\n")

# ── CLI ───────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Lead Corral — Google Maps scraper")
    parser.add_argument("--query",  help="Business type, e.g. 'dental office'")
    parser.add_argument("--cities", help="Comma-separated cities, e.g. 'Dallas TX,Houston TX'")
    parser.add_argument("--limit",  type=int, default=30, help="Max results per city")
    parser.add_argument("--list",   action="store_true", help="Show leads in DB")
    parser.add_argument("--status", help="Filter by status (raw/contacted/replied/qualified/closed)")
    parser.add_argument("--export", help="Export to CSV path")
    parser.add_argument("--mark",   type=int, help="Lead ID to update status")
    parser.add_argument("--set-status", dest="set_status", help="New status for --mark")
    parser.add_argument("--notes",  default="", help="Notes for --mark")
    args = parser.parse_args()

    if args.export:
        export_csv(args.export)
        return

    if args.list:
        leads = list_leads(status=args.status, limit=200)
        print(f"\n{'ID':<5} {'Business':<35} {'Phone':<16} {'City':<15} {'Status':<12} {'Rating'}")
        print("─" * 90)
        for l in leads:
            rating = f"{l['rating']}★ ({l['review_count']})" if l['rating'] else ""
            print(f"{l['id']:<5} {(l['business_name'] or '')[:34]:<35} {(l['phone'] or ''):<16} {(l['city'] or ''):<15} {l['status']:<12} {rating}")
        print_summary()
        return

    if args.mark and args.set_status:
        update_status(args.mark, args.set_status, args.notes)
        print(f"Lead {args.mark} → {args.set_status}")
        return

    if not args.query or not args.cities:
        parser.print_help()
        return

    cities = [c.strip() for c in args.cities.split(",")]
    total_inserted = 0

    for city in cities:
        leads = scrape_google_maps(args.query, city, args.limit)
        inserted, skipped = save_leads(leads)
        total_inserted += inserted
        print(f"\n  {city}: {inserted} new leads saved ({skipped} duplicates skipped)")

    print_summary()
    print("Next step: python3 lead_corral_scraper.py --list")
    print("Export:    python3 lead_corral_scraper.py --export leads.csv")

if __name__ == "__main__":
    main()
