#!/usr/bin/env python3
"""
Batch verification system for IITA climate publications keywords.
Processes publications systematically and tracks verification status.
"""

import json
import pandas as pd
from datetime import datetime

# File paths
EXCEL_FILE = '/home/user/iita-solutions/IITA climate publications - COMPLETE.xlsx'
PROGRESS_FILE = '/home/user/iita-solutions/verification_progress.json'
FINAL_OUTPUT = '/home/user/iita-solutions/verified_keywords_and_urls.json'

def load_publications():
    """Load publications from Excel with existing keywords."""
    df = pd.read_excel(EXCEL_FILE)

    publications = []
    for idx, row in df.iterrows():
        if pd.notna(row.get('DOI')):
            doi = str(row['DOI']).strip()
            keywords_1 = str(row['Keywords']) if pd.notna(row.get('Keywords')) else ''
            keywords_2 = str(row['KEYWORDS']) if pd.notna(row.get('KEYWORDS')) else ''
            keywords = keywords_1 if keywords_1 and keywords_1 != 'nan' else keywords_2

            publications.append({
                'rowNumber': idx + 2,
                'DOI': doi,
                'DOI_URL': f'https://doi.org/{doi}',
                'Title': str(row['TITLE']) if pd.notna(row.get('TITLE')) else '',
                'ExistingKeywords': keywords if keywords != 'nan' else '',
                'VerifiedKeywords': '',
                'Status': 'pending',  # pending, verified, updated, unable_to_verify
                'Notes': ''
            })

    return publications

def save_progress(publications):
    """Save verification progress."""
    stats = {
        'verified': sum(1 for p in publications if p['Status'] == 'verified'),
        'updated': sum(1 for p in publications if p['Status'] == 'updated'),
        'unable_to_verify': sum(1 for p in publications if p['Status'] == 'unable_to_verify'),
        'pending': sum(1 for p in publications if p['Status'] == 'pending')
    }

    data = {
        'last_updated': datetime.now().isoformat(),
        'stats': stats,
        'publications': publications
    }

    with open(PROGRESS_FILE, 'w') as f:
        json.dump(data, f, indent=2)

    print(f"\n✓ Progress saved:")
    print(f"  Verified: {stats['verified']}")
    print(f"  Updated: {stats['updated']}")
    print(f"  Unable to verify: {stats['unable_to_verify']}")
    print(f"  Pending: {stats['pending']}")

    return data

def generate_search_queries(pub):
    """Generate targeted search queries for a publication."""
    doi = pub['DOI']

    # Try different search strategies based on publisher
    if 'mdpi.com' in doi or '10.3390' in doi:
        return [
            f'site:mdpi.com {doi} keywords',
            f'{doi} keywords mdpi'
        ]
    elif '10.1371' in doi:  # PLOS
        return [
            f'site:journals.plos.org {doi} keywords',
            f'{doi} keywords PLOS'
        ]
    elif '10.1016' in doi:  # ScienceDirect/Elsevier
        return [
            f'site:sciencedirect.com {doi} keywords',
            f'{doi} keywords sciencedirect'
        ]
    elif '10.1186' in doi:  # BioMed Central
        return [
            f'site:biomedcentral.com {doi} keywords',
            f'{doi} keywords biomedcentral'
        ]
    else:
        # Generic searches
        return [
            f'{doi} keywords abstract',
            f'site:researchgate.net {doi} keywords'
        ]

def load_progress():
    """Load existing progress if available."""
    try:
        with open(PROGRESS_FILE, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        return None

def generate_final_json(publications):
    """Generate final JSON output."""
    output = {
        'metadata': {
            'total_publications': len(publications),
            'verified': sum(1 for p in publications if p['Status'] == 'verified'),
            'updated': sum(1 for p in publications if p['Status'] == 'updated'),
            'unable_to_verify': sum(1 for p in publications if p['Status'] == 'unable_to_verify'),
            'completion_date': datetime.now().isoformat()
        },
        'publications': [
            {
                'rowNumber': p['rowNumber'],
                'DOI_URL': p['DOI_URL'],
                'Keywords': p['VerifiedKeywords'] if p['VerifiedKeywords'] else p['ExistingKeywords'],
                'Status': p['Status'],
                'Notes': p['Notes']
            }
            for p in publications
        ]
    }

    with open(FINAL_OUTPUT, 'w') as f:
        json.dump(output, f, indent=2)

    print(f"\n✓ Final output saved to: {FINAL_OUTPUT}")
    print(f"\nFinal Statistics:")
    print(f"  Total: {output['metadata']['total_publications']}")
    print(f"  Verified (matches existing): {output['metadata']['verified']}")
    print(f"  Updated (different from existing): {output['metadata']['updated']}")
    print(f"  Unable to verify: {output['metadata']['unable_to_verify']}")

def main():
    print("="*80)
    print("IITA Climate Publications - Keyword Verification System")
    print("="*80)

    # Check if progress exists
    progress = load_progress()
    if progress:
        print(f"\nFound existing progress from {progress['last_updated']}")
        print(f"Stats: {progress['stats']}")
        choice = input("\nContinue from saved progress? (y/n): ")
        if choice.lower() == 'y':
            publications = progress['publications']
        else:
            publications = load_publications()
    else:
        publications = load_publications()

    print(f"\nTotal publications to verify: {len(publications)}")
    print(f"Pending: {sum(1 for p in publications if p['Status'] == 'pending')}")

    # Show next 5 to verify
    pending = [p for p in publications if p['Status'] == 'pending']
    if pending:
        print(f"\nNext 5 publications to verify:")
        for i, pub in enumerate(pending[:5]):
            print(f"\n{i+1}. Row {pub['rowNumber']}")
            print(f"   DOI: {pub['DOI']}")
            print(f"   Existing Keywords: {pub['ExistingKeywords'][:100]}...")
            print(f"   Search queries:")
            for query in generate_search_queries(pub):
                print(f"     - {query}")

    return publications

if __name__ == "__main__":
    publications = main()
