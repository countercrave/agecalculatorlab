Add-Type -AssemblyName System.Drawing

$srcPath = "c:\Users\PC\Desktop\agecalculatorlab-main\assets\articles\how-much-should-i-contribute-to-my-401k\featured-how-much-should-i-contribute.jpg"
$outPath = "c:\Users\PC\Desktop\agecalculatorlab-main\scratch_cropped_test.jpg"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)

# We want a 16:9 crop that captures the full artwork height ($src.Height = 768)
# At height = 768, 16:9 width is 768 * 16 / 9 = 1365.33 (which is almost the entire original 1376 width).
# BUT the artwork only takes up the right portion!
# What if the artwork bounding box has height = 700, width = 750?
# If we take a tighter crop around the artwork and upscale to 1200x675:
# Say crop rect: X = 450, Y = 30, Width = 880, Height = 495 (880/495 = 16:9 approx!)
# Or X = 400, Y = 0, Width = 976, Height = 549 (976/549 = 16:9 = 1.777)
# Or let's test X = 480, Y = 20, Width = 880, Height = 495!

$cropX = 420
$cropY = 40
$cropW = 900
$cropH = [int]($cropW * 9 / 16) # 506

Write-Host "Cropping rect: X=$cropX, Y=$cropY, W=$cropW, H=$cropH"

$destW = 1200
$destH = 675
$dest = New-Object System.Drawing.Bitmap($destW, $destH)
$g = [System.Drawing.Graphics]::FromImage($dest)

$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

$srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
$destRect = New-Object System.Drawing.Rectangle(0, 0, $destW, $destH)

$g.DrawImage($src, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)

# Save with 95% quality JPEG
$encoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.FormatDescription -eq "JPEG" }
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]95)

$dest.Save($outPath, $encoder, $encoderParams)

$g.Dispose()
$dest.Dispose()
$src.Dispose()

Write-Host "Cropped image saved to $outPath"
