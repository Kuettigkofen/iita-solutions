import pandas as pd
import json

# Read the Excel file
df = pd.read_excel("IITA climate publications - COMPLETE.xlsx")

# Identify incomplete publications
incomplete_mask = (
    df['DOI'].isna() |
    df['Abstract'].isna() |
    (df['Abstract'].str.len() <= 50) |
    df['Keywords'].isna() |
    (df['Keywords'].str.len() <= 5)
)

incomplete_df = df[incomplete_mask].copy()

# Filter out rows where the '#' column is NaN
incomplete_df = incomplete_df[incomplete_df['#'].notna()].copy()

print(f"Total incomplete publications to process: {len(incomplete_df)}")
print()

# Create list for web searches
publications_to_search = []

for idx, row in incomplete_df.iterrows():
    row_num = int(row['#'])
    title = row['TITLE']
    authors = row['AUTHORS']
    year = int(row['YEAR']) if pd.notna(row['YEAR']) else None

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
        "authors": authors if pd.notna(authors) else "",
        "year": year,
        "current_doi": row['DOI'] if pd.notna(row['DOI']) else None,
        "missing": missing
    }

    publications_to_search.append(pub_info)

# Sort by row number
publications_to_search.sort(key=lambda x: x['row_number'])

# Save to JSON for the search script
output = {
    "total_count": len(publications_to_search),
    "publications": publications_to_search
}

with open("publications_to_search.json", "w", encoding="utf-8") as f:
    json.dump(output, f, indent=2, ensure_ascii=False)

print(f"Created publications_to_search.json with {len(publications_to_search)} publications")
print()
print("Publications to search:")
for pub in publications_to_search:
    print(f"Row {pub['row_number']:3d}: {pub['title'][:70]}")
    print(f"         Missing: {', '.join(pub['missing'])}")
