Add-Type -AssemblyName System.Drawing

Get-ChildItem -Path "assets/articles" -Recurse -Include "*.jpg", "*.png", "*.webp" | ForEach-Object {
    try {
        $bmp = [System.Drawing.Bitmap]::FromFile($_.FullName)
        $w = $bmp.Width
        $h = $bmp.Height
        
        $whiteOrUniformCount = 0
        $totalSamples = 0
        $firstCol = $bmp.GetPixel([int]($w * 0.05), [int]($h * 0.5))
        
        for ($y = 0.2; $y -le 0.8; $y += 0.1) {
            for ($x = 0.05; $x -le 0.25; $x += 0.05) {
                $totalSamples++
                $c = $bmp.GetPixel([int]($w * $x), [int]($h * $y))
                $isWhite = ($c.R -gt 240 -and $c.G -gt 240 -and $c.B -gt 240)
                $isUniform = ([Math]::Abs($c.R - $firstCol.R) + [Math]::Abs($c.G - $firstCol.G) + [Math]::Abs($c.B - $firstCol.B)) -lt 30
                if ($isWhite -or $isUniform) {
                    $whiteOrUniformCount++
                }
            }
        }
        
        $rightVar = 0
        $prev = $bmp.GetPixel([int]($w * 0.55), [int]($h * 0.5))
        for ($x = 0.55; $x -le 0.95; $x += 0.05) {
            $c = $bmp.GetPixel([int]($w * $x), [int]($h * 0.5))
            $rightVar += [Math]::Abs($c.R - $prev.R) + [Math]::Abs($c.G - $prev.G) + [Math]::Abs($c.B - $prev.B)
            $prev = $c
        }

        if (($whiteOrUniformCount / $totalSamples) -gt 0.85 -and $rightVar -gt 80) {
            Write-Output "$($_.FullName) | Dims: ${w}x${h} | Var: $rightVar"
        }
        $bmp.Dispose()
    } catch {}
}
