Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\PC\Desktop\agecalculatorlab-main\assets\articles\how-much-should-i-contribute-to-my-401k\featured-how-much-should-i-contribute.jpg"
$img = [System.Drawing.Image]::FromFile($srcPath)
Write-Host "Source Dimensions: $($img.Width) x $($img.Height)"
$img.Dispose()
