Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\PC\Desktop\agecalculatorlab-main\assets\articles\how-much-should-i-contribute-to-my-401k\featured-how-much-should-i-contribute.jpg"
$bmp = New-Object System.Drawing.Bitmap($srcPath)

$w = $bmp.Width
$h = $bmp.Height

# Check background color at (10, 10)
$bg = $bmp.GetPixel(10, 10)
Write-Host "Background color at (10,10): R=$($bg.R), G=$($bg.G), B=$($bg.B)"

# Find first column where pixels differ significantly from background
$firstCol = 0
for ($x = 0; $x -lt $w; $x += 10) {
    $diffCount = 0
    for ($y = 50; $y -lt ($h - 50); $y += 20) {
        $p = $bmp.GetPixel($x, $y)
        $diff = [Math]::Abs($p.R - $bg.R) + [Math]::Abs($p.G - $bg.G) + [Math]::Abs($p.B - $bg.B)
        if ($diff -gt 30) {
            $diffCount++
        }
    }
    if ($diffCount -gt 3) {
        $firstCol = $x
        break
    }
}

Write-Host "Content starts at column: $firstCol (out of $w, which is $([Math]::Round($firstCol / $w * 100))% of width)"
$bmp.Dispose()
