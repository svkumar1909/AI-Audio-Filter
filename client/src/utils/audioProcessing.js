export const audioProcessing = {
    createAudioContext: () => {
      return new (window.AudioContext || window.webkitAudioContext)();
    },
  
    createRecorder: (stream) => {
      return new MediaRecorder(stream);
    },
  
    audioBufferToBlob: (chunks, mimeType = 'audio/webm') => {
      return new Blob(chunks, { type: mimeType });
    },
  
    createObjectURL: (blob) => {
      return URL.createObjectURL(blob);
    },
  
    revokeObjectURL: (url) => {
      URL.revokeObjectURL(url);
    },
  
    getAudioDuration: async (audioUrl) => {
      return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.src = audioUrl;
        
        audio.onloadedmetadata = () => {
          resolve(audio.duration);
        };
        
        audio.onerror = (err) => {
          reject(err);
        };
      });
    },
  
    analyzeFrequency: async (audioContext, audioBuffer) => {
      // Create an analyzer node
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 2048;
      
      // Create a buffer source and connect it to the analyzer
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(analyzer);
      
      // Create a data array for the analyzer output
      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      analyzer.getByteFrequencyData(dataArray);
      
      return dataArray;
    },
  
    convertBlobToArrayBuffer: (blob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(blob);
      });
    }
  };