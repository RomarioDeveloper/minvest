#!/bin/bash
for f in public/*.mp4; do
  filename=$(basename "$f")
  # skip already mobile files if any
  if [[ "$filename" == *"-mobile.mp4" ]]; then
    continue
  fi
  
  mobile_name="${filename%.mp4}-mobile.mp4"
  # Улучшаем качество до 720p и снижаем компрессию (crf 23) для четкости на Retina-экранах
  ffmpeg -y -i "$f" -vf "scale=-2:720" -c:v libx264 -crf 23 -preset fast -an "public/$mobile_name" < /dev/null
done
