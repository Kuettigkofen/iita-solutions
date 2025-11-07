#!/usr/bin/env python3
"""
Process all 153 IITA climate publications to verify keywords from DOI sources.
This script tracks progress and saves intermediate results every 25 publications.
"""

import json
import os
from datetime import datetime

# File paths
PUBLICATIONS_FILE = '/home/user/iita-solutions/publications_to_process.json'
RESULTS_FILE = '/home/user/iita-solutions/keyword_verification_progress.json'
FINAL_OUTPUT = '/home/user/iita-solutions/verified_keywords_and_urls.json'

def load_publications():
    """Load the list of publications to process."""
    with open(PUBLICATIONS_FILE, 'r') as f:
        return json.load(f)

def load_progress():
    """Load existing progress if available."""
    if os.path.exists(RESULTS_FILE):
        with open(RESULTS_FILE, 'r') as f:
            return json.load(f)
    return {
        'last_processed_index': -1,
        'results': [],
        'stats': {
            'total_processed': 0,
            'keywords_found': 0,
            'keywords_blank': 0,
            'unable_to_verify': 0
        },
        'last_updated': None
    }

def save_progress(progress_data):
    """Save current progress."""
    progress_data['last_updated'] = datetime.now().isoformat()
    with open(RESULTS_FILE, 'w') as f:
        json.dump(progress_data, f, indent=2)
    print(f"✓ Progress saved: {progress_data['stats']['total_processed']} publications processed")

def add_result(progress_data, pub, keywords, status):
    """Add a result to the progress data."""
    result = {
        'rowNumber': pub['rowNumber'],
        'DOI': pub['DOI'],
        'DOI_URL': f"https://doi.org/{pub['DOI']}",
        'Title': pub['Title'],
        'Keywords': keywords,
        'Status': status,  # 'found', 'blank', 'unable_to_verify'
        'ExistingKeywords': pub['ExistingKeywords']
    }

    progress_data['results'].append(result)
    progress_data['last_processed_index'] = len(progress_data['results']) - 1
    progress_data['stats']['total_processed'] += 1

    if status == 'found':
        progress_data['stats']['keywords_found'] += 1
    elif status == 'blank':
        progress_data['stats']['keywords_blank'] += 1
    else:
        progress_data['stats']['unable_to_verify'] += 1

    return result

def print_progress_report(progress_data):
    """Print a progress report."""
    stats = progress_data['stats']
    total = stats['total_processed']

    if total == 0:
        print("No publications processed yet.")
        return

    print("\n" + "="*60)
    print("KEYWORD VERIFICATION PROGRESS REPORT")
    print("="*60)
    print(f"Total Processed: {total} / 153")
    print(f"Keywords Found: {stats['keywords_found']} ({stats['keywords_found']/total*100:.1f}%)")
    print(f"Keywords Blank: {stats['keywords_blank']} ({stats['keywords_blank']/total*100:.1f}%)")
    print(f"Unable to Verify: {stats['unable_to_verify']} ({stats['unable_to_verify']/total*100:.1f}%)")
    print(f"Last Updated: {progress_data.get('last_updated', 'Never')}")
    print("="*60 + "\n")

def generate_final_output(progress_data):
    """Generate the final JSON output file."""
    output_data = {
        'metadata': {
            'total_publications': 153,
            'processed': progress_data['stats']['total_processed'],
            'keywords_found': progress_data['stats']['keywords_found'],
            'keywords_blank': progress_data['stats']['keywords_blank'],
            'unable_to_verify': progress_data['stats']['unable_to_verify'],
            'completion_date': datetime.now().isoformat()
        },
        'publications': []
    }

    for result in progress_data['results']:
        output_data['publications'].append({
            'rowNumber': result['rowNumber'],
            'DOI_URL': result['DOI_URL'],
            'Keywords': result['Keywords'],
            'Status': result['Status']
        })

    with open(FINAL_OUTPUT, 'w') as f:
        json.dump(output_data, f, indent=2)

    print(f"\n✓ Final output saved to: {FINAL_OUTPUT}")
    print_progress_report(progress_data)

def main():
    """Main processing function."""
    print("IITA Climate Publications - Keyword Verification System")
    print("="*60)

    publications = load_publications()
    progress_data = load_progress()

    print(f"Total publications to process: {len(publications)}")
    print(f"Already processed: {progress_data['stats']['total_processed']}")
    print(f"Remaining: {len(publications) - progress_data['stats']['total_processed']}")
    print()

    # Print current progress
    print_progress_report(progress_data)

    # Instructions for manual processing
    print("\nINSTRUCTIONS FOR MANUAL PROCESSING:")
    print("1. For each publication, search for keywords using WebSearch")
    print("2. Call: add_result(progress_data, pub, keywords, status)")
    print("3. Save every 25 publications: save_progress(progress_data)")
    print("4. When complete: generate_final_output(progress_data)")
    print()

    return publications, progress_data

if __name__ == "__main__":
    publications, progress_data = main()
