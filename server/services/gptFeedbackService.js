import dotenv from 'dotenv';

dotenv.config();

import OpenAI from 'openai';

const openai = new OpenAI({

  apiKey:
    process.env.OPENAI_API_KEY
});

export const generateAIFeedback =
  async ({

    transcript,

    targetText,

    pronunciationScore,

    fluencyScore,

    confidenceScore,

    detectedLanguage

  }) => {

    try {

      const prompt = `

You are an AI pronunciation evaluator.

Analyze the user's speech performance.

Target sentence:
${targetText || 'No target sentence provided'}

Transcript:
${transcript}

Detected Language:
${detectedLanguage}

Scores:
- Pronunciation: ${pronunciationScore}/100
- Fluency: ${fluencyScore}/100
- Confidence: ${confidenceScore}/100

Generate:
1. Pronunciation evaluation
2. Fluency feedback
3. Confidence analysis
4. Suggestions for improvement

Keep response concise and professional.

`;

      const completion =
        await openai.chat.completions.create({

          model: 'gpt-4.1-mini',

          messages: [

            {
              role: 'system',

              content:
                'You are an expert AI speech evaluator.'
            },

            {
              role: 'user',

              content: prompt
            }
          ],

          temperature: 0.7,

          max_tokens: 180
        });

      return completion
        .choices[0]
        .message
        .content;

    } catch (error) {

      console.log(
        'GPT FEEDBACK ERROR:',
        error
      );

      // =====================================
      // FALLBACK FEEDBACK
      // =====================================

      let feedback = '';

      // Pronunciation
      if (pronunciationScore >= 85) {

        feedback +=
          'Your pronunciation is excellent and very clear. ';
      }

      else if (pronunciationScore >= 65) {

        feedback +=
          'Your pronunciation is good, but some words need clearer articulation. ';
      }

      else {

        feedback +=
          'Your pronunciation needs improvement. Try speaking slowly and clearly. ';
      }

      // Fluency
      if (fluencyScore >= 85) {

        feedback +=
          'Your fluency is smooth and natural. ';
      }

      else if (fluencyScore >= 65) {

        feedback +=
          'Your fluency is decent, but pacing can improve. ';
      }

      else {

        feedback +=
          'Try reducing pauses and maintaining a steady speaking pace. ';
      }

      // Confidence
      if (confidenceScore >= 85) {

        feedback +=
          'You sound confident while speaking. ';
      }

      else if (confidenceScore >= 65) {

        feedback +=
          'Your confidence is moderate. More practice will help. ';
      }

      else {

        feedback +=
          'Speak louder and more confidently for better communication. ';
      }

      // Transcript-based suggestion
      if (
        transcript &&
        transcript.length > 20
      ) {

        feedback +=
          'Focus on sentence clarity and proper word stress while speaking.';
      }

      else {

        feedback +=
          'Try speaking complete sentences for better analysis.';
      }

      return feedback;
    }
  };