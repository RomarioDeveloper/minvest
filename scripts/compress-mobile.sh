#!/bin/bash
mkdir -p public/mobile
for f in public/*.mp4; do
  filename=$(basename "$f")
  # skip already mobile files if any
  if [[ "$filename" == *"-mobile.mp4" ]]; then
    continue
  fi
  
  mobile_name="${filename%.mp4}-mobile.mp4"
  # Compress to 480p, low bitrate for mobile
  ffmpeg -y -i "$f" -vf "scale=-2:480" -c:v libx264 -crf 28 -preset veryfast -an "public/$mobile_name" < /dev/null
done
