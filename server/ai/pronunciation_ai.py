import sys
import json
import librosa
import numpy as np

# ======================================
# AUDIO PATH
# ======================================

audio_path = sys.argv[1]

# ======================================
# LOAD AUDIO
# ======================================

audio, sr = librosa.load(
    audio_path,
    sr=16000
)

# ======================================
# AUDIO FEATURES
# ======================================

# ENERGY
energy = np.mean(
    librosa.feature.rms(y=audio)
)

# ZERO CROSSING RATE
zcr = np.mean(
    librosa.feature.zero_crossing_rate(audio)
)

# DURATION
duration = librosa.get_duration(
    y=audio,
    sr=sr
)

# SPEECH RATE
speech_rate = len(audio) / duration

# SPECTRAL CENTROID
spectral_centroid = np.mean(
    librosa.feature.spectral_centroid(
        y=audio,
        sr=sr
    )
)

# ======================================
# FLUENCY SCORE
# ======================================

fluency = int(

    min(
        100,

        max(
            1,

            (
                speech_rate / 32000
            ) * 100
        )
    )
)

# ======================================
# CONFIDENCE SCORE
# ======================================

confidence = int(

    min(
        100,

        max(
            1,

            energy * 1000
        )
    )
)

# ======================================
# PRONUNCIATION SCORE
# ======================================

pronunciation = int(

    min(
        100,

        max(
            1,

            (
                (
                    1 - zcr
                ) * 100
            )
        )
    )
)

# ======================================
# CLARITY SCORE
# ======================================

clarity = int(

    min(
        100,

        max(
            1,

            spectral_centroid / 50
        )
    )
)

# ======================================
# OVERALL SCORE
# ======================================

overall = int(

    (
        fluency +
        confidence +
        pronunciation +
        clarity
    ) / 4
)

# ======================================
# FINAL RESPONSE
# ======================================

response = {

    "fluency": fluency,

    "confidence": confidence,

    "pronunciation": pronunciation,

    "clarity": clarity,

    "overall": overall
}

print(
    json.dumps(response)
)