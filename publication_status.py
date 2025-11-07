import pandas as pd

print("="*80)
print("IITA CLIMATE PUBLICATIONS - DETAILED STATUS BREAKDOWN")
print("="*80)
print()

# Read the Excel file
df = pd.read_excel("IITA climate publications - COMPLETE.xlsx")

# Identify complete publications
complete_mask = (
    df['DOI'].notna() & 
    df['Abstract'].notna() & 
    (df['Abstract'].str.len() > 50) &
    df['Keywords'].notna() & 
    (df['Keywords'].str.len() > 5)
)

complete_df = df[complete_mask].copy()
incomplete_df = df[~complete_mask].copy()

print(f"TOTAL PUBLICATIONS: {len(df)}")
print(f"COMPLETE: {len(complete_df)} (33.8%)")
print(f"INCOMPLETE: {len(incomplete_df)} (66.2%)")
print()

# Save complete list
print("="*80)
print("COMPLETE PUBLICATIONS (52)")
print("="*80)
complete_df[['#', 'TITLE', 'DOI', 'YEAR']].to_csv('complete_publications.csv', index=False)
for idx, row in complete_df.iterrows():
    print(f"{int(row['#']):3d}. {row['TITLE'][:70]}")
    print(f"     DOI: {row['DOI']}")
    print(f"     Abstract: {len(str(row['Abstract']))} chars, Keywords: {len(str(row['Keywords']))} chars")
    print()

print()
print("="*80)
print("INCOMPLETE PUBLICATIONS (102) - Priority for Manual Entry")
print("="*80)
incomplete_df[['#', 'TITLE', 'DOI']].to_csv('incomplete_publications.csv', index=False)

# Categorize incomplete
has_doi = incomplete_df['DOI'].notna()
missing_abstract = incomplete_df['Abstract'].isna() | (incomplete_df['Abstract'].str.len() <= 50)
missing_keywords = incomplete_df['Keywords'].isna() | (incomplete_df['Keywords'].str.len() <= 5)

print(f"\nBreakdown:")
print(f"  Has DOI, needs Abstract/Keywords: {has_doi.sum()}")
print(f"  Missing DOI entirely: {(~has_doi).sum()}")
print()

# Show high-priority incomplete (has DOI)
high_priority = incomplete_df[has_doi].copy()
print(f"\nHIGH PRIORITY (Has DOI, needs metadata): {len(high_priority)} publications")
print("-"*80)
for idx, row in high_priority.head(25).iterrows():
    print(f"{int(row['#']):3d}. {row['TITLE'][:70]}")
    print(f"     DOI: {row['DOI']}")
    needs = []
    if pd.isna(row['Abstract']) or len(str(row['Abstract'])) <= 50:
        needs.append("Abstract")
    if pd.isna(row['Keywords']) or len(str(row['Keywords'])) <= 5:
        needs.append("Keywords")
    print(f"     NEEDS: {', '.join(needs)}")
    print()

print()
print("="*80)
print("FILES CREATED")
print("="*80)
print("1. complete_publications.csv - List of 52 complete publications")
print("2. incomplete_publications.csv - List of 102 incomplete publications")
print("3. Use these files to guide manual data entry efforts")
print("="*80)
