for file in *.wav; do
    ffmpeg -i "$file" -q:a 0 -map a "${file%.wav}.mp3"
done
