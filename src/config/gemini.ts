import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini API configuration
// IMPORTANT: In production, this should be called from Supabase Edge Function
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'; // Replace with your Gemini API Key

// Initialize Gemini AI
export const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Get the generative model
export const getGeminiModel = (modelName: string = 'gemini-pro') => {
  return genAI.getGenerativeModel({ model: modelName });
};

// Idol personalities for AI-generated messages
export const IDOL_PERSONALITIES = {
  'son-tung-mtp': {
    name: 'Sơn Tùng M-TP',
    personality: 'Cool, trendy, caring, uses modern slang, friendly and encouraging',
    style: 'Casual but respectful, like a close friend',
  },
  'rose': {
    name: 'Rosé (BLACKPINK)',
    personality: 'Sweet, gentle, caring, elegant, warm-hearted',
    style: 'Soft-spoken, encouraging, like a caring older sister',
  },
  'den-vau': {
    name: 'Đen Vâu',
    personality: 'Philosophical, poetic, thoughtful, wise, humorous',
    style: 'Deep but relatable, uses metaphors and life lessons',
  },
  'chi-pu': {
    name: 'Chi Pu',
    personality: 'Energetic, positive, motivational, cheerful',
    style: 'Upbeat and encouraging, like a supportive best friend',
  },
  'binz': {
    name: 'BINZ',
    personality: 'Confident, cool, motivational, street-smart',
    style: 'Direct and encouraging, uses hip-hop vibes',
  },
};

// Generate sleep reminder message from idol
export const generateIdolMessage = async (
  idolKey: keyof typeof IDOL_PERSONALITIES,
  userName: string,
  messageType: 'goodnight' | 'wakeup' | 'reminder'
): Promise<string> => {
  const idol = IDOL_PERSONALITIES[idolKey];
  const model = getGeminiModel();

  let prompt = '';

  switch (messageType) {
    case 'goodnight':
      prompt = `You are ${idol.name}. Your personality is: ${idol.personality}. Your speaking style is: ${idol.style}.
      
Generate a short, warm goodnight message (2-3 sentences) to ${userName} encouraging them to sleep well. 
Make it personal and in character. Use Vietnamese language.
Keep it natural and conversational.`;
      break;

    case 'wakeup':
      prompt = `You are ${idol.name}. Your personality is: ${idol.personality}. Your speaking style is: ${idol.style}.
      
Generate a short, energetic wake-up message (2-3 sentences) to ${userName} to start their day positively.
Make it personal and in character. Use Vietnamese language.
Keep it natural and conversational.`;
      break;

    case 'reminder':
      prompt = `You are ${idol.name}. Your personality is: ${idol.personality}. Your speaking style is: ${idol.style}.
      
Generate a short, gentle reminder message (2-3 sentences) to ${userName} that it's time to prepare for bed.
Make it personal and in character. Use Vietnamese language.
Keep it natural and conversational.`;
      break;
  }

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating idol message:', error);
    // Fallback messages
    const fallbackMessages = {
      goodnight: `Chúc ${userName} ngủ ngon nhé! 💤`,
      wakeup: `Chào buổi sáng ${userName}! Hãy bắt đầu ngày mới thật tuyệt vời! ☀️`,
      reminder: `${userName} ơi, đã đến giờ đi ngủ rồi đấy! 🌙`,
    };
    return fallbackMessages[messageType];
  }
};

// Generate sleep insights using AI
export const generateSleepInsights = async (
  sleepData: {
    averageSleepTime: string;
    averageWakeTime: string;
    sleepQuality: number;
    streak: number;
  }
): Promise<string> => {
  const model = getGeminiModel();

  const prompt = `Based on this sleep data:
- Average sleep time: ${sleepData.averageSleepTime}
- Average wake time: ${sleepData.averageWakeTime}
- Sleep quality: ${sleepData.sleepQuality}/10
- Current streak: ${sleepData.streak} days

Generate a short, encouraging insight (3-4 sentences) about their sleep habits in Vietnamese.
Include one actionable tip to improve their sleep quality.
Be positive and motivational.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating sleep insights:', error);
    return 'Bạn đang làm rất tốt! Hãy tiếp tục duy trì thói quen ngủ đúng giờ nhé! 💪';
  }
};

