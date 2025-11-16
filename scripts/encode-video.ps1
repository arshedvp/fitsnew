Param(
  [string]$InputPath = "client\public\bg-video.mp4"
)

function Check-FFmpeg {
  $ff = Get-Command ffmpeg -ErrorAction SilentlyContinue
  if (-not $ff) {
    Write-Error "ffmpeg not found in PATH. Please install ffmpeg and ensure it's available in your PATH."
    exit 2
  }
}

Check-FFmpeg

$webmOut = "client\public\bg-video-low.webm"
$mp4Out = "client\public\bg-video-low.mp4"

Write-Host "Encoding low-bitrate webm (two-pass VP9) -> $webmOut"
# Use source framerate where possible (avoid converting 24->30fps) and keep resolution at 1280 wide
& ffmpeg -y -i $InputPath -vf "fps=24,scale=1280:-1" -b:v 0 -crf 30 -pass 1 -an -f webm NUL
& ffmpeg -y -i $InputPath -vf "fps=24,scale=1280:-1" -b:v 0 -crf 30 -pass 2 -an $webmOut

Write-Host "Encoding h264 mp4 (single-pass CRF) -> $mp4Out"
# Single-pass H.264 with CRF for a good quality/size tradeoff (lower res to reduce decode cost)
& ffmpeg -y -i $InputPath -vf "fps=24,scale=1280:-1" -c:v libx264 -crf 28 -preset medium -an $mp4Out

Write-Host "Encoding complete. Output files:"
Write-Host "  $webmOut"
Write-Host "  $mp4Out"
