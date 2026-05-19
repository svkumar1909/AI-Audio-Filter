import whisper
import sys
import json

# AUDIO PATH
audio_path = sys.argv[1]

# OPTIONAL LANGUAGE
language = None

if len(sys.argv) > 2:
    language = sys.argv[2]

# LOAD LARGE MODEL
model = whisper.load_model("base")

# TRANSCRIBE
result = model.transcribe(
    audio_path,
    language=language,
    fp16=False
)

response = {
    "text": result["text"],
    "language": result["language"]
}

print(json.dumps(response))