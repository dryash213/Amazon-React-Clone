import pandas as pd
import json
import time
from google import genai
from google.genai import types

# ---------------------------------------------------------
# 1. SETUP AND INITIALIZATION
# ---------------------------------------------------------
client = genai.Client(
    api_key="" 
)
model = "gemini-flash-latest"

source_text = "Sample source text detailing terms of use, cost, search functionality, etc."

generate_content_config = types.GenerateContentConfig(
    response_mime_type="application/json",
    thinking_config=types.ThinkingConfig(
        thinking_level="HIGH",
    ),
)

# --- CORRECTED LOADING LOGIC ---
print("Reading Excel file...")
# sheet_name=None is CRITICAL. It tells pandas to read ALL sheets into a Dictionary.
all_sheets = pd.read_excel('input_test/tpl_tpl_verification.xlsx', sheet_name='SourceCodes')

# SAFETY CHECK: If all_sheets is a DataFrame (not a dict), wrap it in a dict
if isinstance(all_sheets, pd.DataFrame):
    print("Warning: strictly single sheet detected. Converting to dictionary format.")
    all_sheets = {"Sheet1": all_sheets}

processed_sheets = {}

# ---------------------------------------------------------
# 2. HELPER FUNCTION TO CLEAN JSON
# ---------------------------------------------------------
def clean_json_output(raw_text):
    text = raw_text.strip()
    if text.startswith("```json"): text = text[7:]
    elif text.startswith("```"): text = text[3:]
    if text.endswith("```"): text = text[:-3]
    return text.strip()

# ---------------------------------------------------------
# 3. PROCESS EACH SHEET
# ---------------------------------------------------------
for sheet_name, df in all_sheets.items():
    print(f"\n--- Processing Data from sheet: {sheet_name} ---")
    
    # Double check that df is a DataFrame. If it's a Series (rare edge case), convert to frame.
    if isinstance(df, pd.Series):
        df = df.to_frame()

    print(df.head())
    
    # Extract headers. This will now work because we ensured df is a DataFrame.
    columns_list = df.columns.tolist()
    
    # UNIFIED PROMPT
    prompt = f"""Role & Objective:
    You are an expert data analyst and automated JSON processing engine. 
    You are provided with a SOURCE TEXT and an INPUT JSON array representing rows of an Excel sheet.
    
    Determine which of the following two scenarios applies and execute the corresponding action:

    SCENARIO A: Assessment Questionnaire (Data Filling)
    - Condition: The JSON contains specific operational questions and empty answer slots (e.g., `null` or blank).
    - Action: Evaluate the SOURCE TEXT. Deduce the answer for each question (use "Yes", "No", or "N/A"). Replace the `null` values with your answers. Retain the exact same number of rows.

    SCENARIO B: Empty or Sparse Template (Data Generation)
    - Condition: The JSON primarily consists of structural columns (provided in COLUMN HEADERS) but has very few or zero actual data rows. It may be completely empty `[]` or have a single sparse row.
    - Action: GENERATE EXACTLY 30 ROWS of realistic, contextually relevant dummy data (or "helps needed" data) based on the SOURCE TEXT and the COLUMN HEADERS. Ensure every column is meaningfully populated for all 30 rows.

    STRICT OUTPUT CONSTRAINTS:
    - Return EXACTLY and ONLY a valid JSON array (`[ {{...}}, {{...}} ]`).
    - The output must be compatible with `pandas.DataFrame(json_data)`.
    - Do not include conversational filler.
    - If SCENARIO B applies, use the exact strings from COLUMN HEADERS as your keys.

    ---
    **INPUT DATA:**

    <SOURCE_TEXT>
    {source_text}
    </SOURCE_TEXT>

    <COLUMN_HEADERS>
    {columns_list}
    </COLUMN_HEADERS>

    <INPUT_JSON>
    {df.to_json(orient='records')}
    </INPUT_JSON>
    """

    # ---------------------------------------------------------
    # 4. CALL GEMINI API
    # ---------------------------------------------------------
    contents = [
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=prompt)],
        ),
    ]

    print("Generating response from Gemini...")
    full_response = ""
    try:
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=generate_content_config,
        ):
            print(chunk.text, end="") 
            full_response += chunk.text
        
        print("\n\nParsing JSON response...")

        # ---------------------------------------------------------
        # 5. PARSE JSON AND STORE
        # ---------------------------------------------------------
        cleaned_response = clean_json_output(full_response)
        data = json.loads(cleaned_response)
        ddf = pd.DataFrame(data)
        processed_sheets[sheet_name] = ddf 
        print(f"Successfully parsed sheet: {sheet_name}")

    except Exception as e:
        print(f"Error processing sheet {sheet_name}: {e}")
        processed_sheets[sheet_name] = df # Fallback

    print("Pausing for 25 seconds...")
    time.sleep(25) 

# ---------------------------------------------------------
# 6. WRITE TO EXCEL
# ---------------------------------------------------------
print("\nWriting to Excel...")
try:
    with pd.ExcelWriter('POC_Filled_Mapping_Gemini3.1.xlsx') as writer:
        for s_name, processed_df in processed_sheets.items():
            processed_df.to_excel(writer, sheet_name=s_name, index=False)
    print("File saved successfully.")
except Exception as e:
    print(f"Error writing file: {e}")
