import pandas as pd
import json

# Read the Excel file
df = pd.read_excel("IITA climate publications - COMPLETE.xlsx")

# Identify incomplete publications (missing DOI, Abstract, or Keywords)
incomplete_mask = (
    df['DOI'].isna() |
    df['Abstract'].isna() |
    (df['Abstract'].str.len() <= 50) |
    df['Keywords'].isna() |
    (df['Keywords'].str.len() <= 5)
)

incomplete_df = df[incomplete_mask].copy()

print("="*80)
print(f"TOTAL INCOMPLETE PUBLICATIONS: {len(incomplete_df)}")
print("="*80)
print()

# List all incomplete publications with exact row numbers
publications_to_process = []

for idx, row in incomplete_df.iterrows():
    row_num = int(row['#'])
    title = row['TITLE']
    authors = row['AUTHORS']
    year = row['YEAR']

    # Determine what's missing
    missing = []
    if pd.isna(row['DOI']):
        missing.append("DOI")
    if pd.isna(row['Abstract']) or len(str(row['Abstract'])) <= 50:
        missing.append("Abstract")
    if pd.isna(row['Keywords']) or len(str(row['Keywords'])) <= 5:
        missing.append("Keywords")

    pub_info = {
        "row_number": row_num,
        "title": title,
        "authors": authors,
        "year": int(year) if pd.notna(year) else None,
        "current_doi": row['DOI'] if pd.notna(row['DOI']) else None,
        "missing": missing
    }

    publications_to_process.append(pub_info)

    print(f"Row {row_num:3d}: {title[:70]}")
    print(f"         Authors: {authors}, Year: {year}")
    print(f"         Missing: {', '.join(missing)}")
    print()

# Save to JSON
output = {
    "total_incomplete": len(incomplete_df),
    "publications": publications_to_process
}

with open("incomplete_publications_list.json", "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print("="*80)
print(f"Saved {len(publications_to_process)} incomplete publications to incomplete_publications_list.json")
print("="*80)
