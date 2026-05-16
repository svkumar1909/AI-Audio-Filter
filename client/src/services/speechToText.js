import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const transcribeAudio = async (filePath) => {
  try {
    const response = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "gpt-4o-mini-transcribe", // fast + cheap
    });

    return response.text;

  } catch (error) {
    console.error("Transcription Error:", error.message);
    return "";
  }
};