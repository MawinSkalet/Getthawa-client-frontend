$docsDir = (Resolve-Path "docs").Path
$docxFiles = Get-ChildItem -Path $docsDir -Filter "*.docx"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Exporting DOCX to PDF via Microsoft Word" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan

$word = New-Object -ComObject Word.Application
$word.Visible = $false

try {
    foreach ($file in $docxFiles) {
        $pdfPath = [System.IO.Path]::ChangeExtension($file.FullName, ".pdf")
        Write-Host "Converting: $($file.Name) -> $(Split-Path $pdfPath -Leaf)" -ForegroundColor Yellow
        $doc = $word.Documents.Open($file.FullName, $false, $true)
        $doc.SaveAs([ref]$pdfPath, [ref]17)
        $doc.Close([ref]0)
        Write-Host "  [SUCCESS] Created $(Split-Path $pdfPath -Leaf)" -ForegroundColor Green
    }
} catch {
    Write-Host "Error during PDF export: $_" -ForegroundColor Red
} finally {
    $word.Quit()
    [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  PDF Generation Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
