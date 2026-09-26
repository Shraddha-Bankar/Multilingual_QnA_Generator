import os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from typing import List, Dict
from app.models.schemas import QnAPair

class ExcelGenerator:
    @classmethod
    def generate_multilingual_workbook(
        cls,
        english_pairs: List[QnAPair],
        hindi_pairs: List[QnAPair],
        marathi_pairs: List[QnAPair],
        output_filepath: str
    ) -> str:
        """
        Creates a professionally formatted Excel workbook:
        - Exactly 3 worksheets: 'English', 'Hindi', 'Marathi'
        - Exactly 2 columns per sheet: 'Questions' and 'Answers'
        - Header styling, text wrapping, auto column widths, freeze header row, and borders.
        """
        wb = openpyxl.Workbook()
        
        # Remove default sheet
        default_sheet = wb.active
        
        sheets_data = [
            ("English", english_pairs),
            ("Hindi", hindi_pairs),
            ("Marathi", marathi_pairs),
        ]

        header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
        header_fill = PatternFill(start_color="1E293B", end_color="1E293B", fill_type="solid")
        
        data_font = Font(name="Calibri", size=10, color="1E293B")
        
        # Subtle light gray borders
        thin_border_side = Side(border_style="thin", color="E2E8F0")
        data_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
        
        align_header = Alignment(horizontal="left", vertical="center", wrap_text=True)
        align_data = Alignment(horizontal="left", vertical="top", wrap_text=True)

        for sheet_idx, (sheet_title, pairs) in enumerate(sheets_data):
            if sheet_idx == 0:
                ws = default_sheet
                ws.title = sheet_title
            else:
                ws = wb.create_sheet(title=sheet_title)

            # Add Headers (Exactly two columns: Questions and Answers)
            ws["A1"] = "Questions"
            ws["B1"] = "Answers"

            # Apply Header Styles
            for col_letter in ["A", "B"]:
                cell = ws[f"{col_letter}1"]
                cell.font = header_font
                cell.fill = header_fill
                cell.alignment = align_header
                cell.border = data_border
            
            ws.row_dimensions[1].height = 28

            # Populate Q&A rows
            for row_idx, pair in enumerate(pairs, start=2):
                cell_q = ws[f"A{row_idx}"]
                cell_a = ws[f"B{row_idx}"]

                cell_q.value = pair.question
                cell_a.value = pair.answer

                cell_q.font = data_font
                cell_a.font = data_font

                cell_q.alignment = align_data
                cell_a.alignment = align_data

                cell_q.border = data_border
                cell_a.border = data_border

                # Alternating row background for readability
                if row_idx % 2 == 1:
                    zebra_fill = PatternFill(start_color="F8FAFC", end_color="F8FAFC", fill_type="solid")
                    cell_q.fill = zebra_fill
                    cell_a.fill = zebra_fill

            # Freeze the top header row
            ws.freeze_panes = "A2"

            # Enable auto-filter
            max_row = max(len(pairs) + 1, 2)
            ws.auto_filter.ref = f"A1:B{max_row}"

            # Set column widths
            ws.column_dimensions["A"].width = 46
            ws.column_dimensions["B"].width = 75

        # Ensure directory exists
        os.makedirs(os.path.dirname(os.path.abspath(output_filepath)), exist_ok=True)
        wb.save(output_filepath)
        return output_filepath
