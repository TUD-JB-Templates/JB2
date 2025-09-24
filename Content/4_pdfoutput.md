# JB 2 Template
## PDF with LaTeX or Typst

To specify which type of PDF you want to build, add this to your `myst.yml` file under `exports`.  
For example:

```yaml
downloads:
  - id: output-pdf
exports:
  - format: typst
    template: ./TUD_pdf_temp
    output: exports/book2.pdf
    id: output-pdf
```


Go to Actions > click on "Myst PDF Builder [LaTeX]" or "Myst PDF Builder [Typst]" > click on "Run workflow" > click on "Run workflow" in the dropdown.

Any error for the Typst action will appear in the summary.
