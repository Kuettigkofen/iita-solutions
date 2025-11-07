import pandas as pd
import sys

# Read the Excel file
print("="*80)
print("INSPECTING IITA CLIMATE PUBLICATIONS DATA")
print("="*80)
print()

files_to_check = [
    "IITA climate publications - POPULATED.xlsx",
    "IITA climate publications - COMPLETE.xlsx"
]

for filename in files_to_check:
    try:
        print(f"\n{'='*80}")
        print(f"FILE: {filename}")
        print('='*80)
        
        df = pd.read_excel(filename)
        print(f"\nTotal rows: {len(df)}")
        print(f"\nColumns ({len(df.columns)}):")
        for i, col in enumerate(df.columns, 1):
            print(f"  {i}. {col}")
        
        # Check for DOI, Abstract, Keywords columns (case insensitive)
        doi_cols = [col for col in df.columns if 'doi' in col.lower()]
        abstract_cols = [col for col in df.columns if 'abstract' in col.lower()]
        keyword_cols = [col for col in df.columns if 'keyword' in col.lower()]
        
        print(f"\nDOI columns: {doi_cols}")
        print(f"Abstract columns: {abstract_cols}")
        print(f"Keyword columns: {keyword_cols}")
        
        # Count completion for each combination
        for doi_col in doi_cols:
            for abs_col in abstract_cols:
                for kw_col in keyword_cols:
                    has_doi = df[doi_col].notna().sum()
                    has_abstract = df[abs_col].notna().sum()
                    has_abstract_good = df[abs_col].str.len().fillna(0).gt(50).sum() if df[abs_col].dtype == object else 0
                    has_keywords = df[kw_col].notna().sum()
                    has_keywords_good = df[kw_col].str.len().fillna(0).gt(5).sum() if df[kw_col].dtype == object else 0
                    
                    complete = ((df[doi_col].notna()) & 
                               (df[abs_col].notna() & (df[abs_col].str.len() > 50)) &
                               (df[kw_col].notna() & (df[kw_col].str.len() > 5))).sum()
                    
                    print(f"\n  Combination: {doi_col} + {abs_col} + {kw_col}")
                    print(f"    Has DOI: {has_doi}")
                    print(f"    Has Abstract: {has_abstract} (good quality: {has_abstract_good})")
                    print(f"    Has Keywords: {has_keywords} (good quality: {has_keywords_good})")
                    print(f"    COMPLETE (DOI + Abstract>50 + Keywords>5): {complete}")
        
        # Show first 3 rows sample
        print(f"\n{'='*80}")
        print("SAMPLE DATA (first 3 rows):")
        print('='*80)
        for idx in range(min(3, len(df))):
            print(f"\nRow {idx + 2}:")  # Row 2 because row 1 is header
            if 'TITLE' in df.columns:
                print(f"  TITLE: {str(df.iloc[idx]['TITLE'])[:70]}...")
            for doi_col in doi_cols:
                print(f"  {doi_col}: {df.iloc[idx][doi_col]}")
            for abs_col in abstract_cols:
                val = df.iloc[idx][abs_col]
                if pd.notna(val):
                    print(f"  {abs_col}: EXISTS ({len(str(val))} chars)")
                else:
                    print(f"  {abs_col}: EMPTY")
            for kw_col in keyword_cols:
                val = df.iloc[idx][kw_col]
                if pd.notna(val):
                    print(f"  {kw_col}: EXISTS ({len(str(val))} chars)")
                else:
                    print(f"  {kw_col}: EMPTY")
        
    except Exception as e:
        print(f"ERROR reading {filename}: {e}")

print(f"\n{'='*80}")
print("INSPECTION COMPLETE")
print('='*80)
