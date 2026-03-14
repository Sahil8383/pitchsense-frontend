// Scenario
export interface Persona {
  name: string;
  title: string;
  company: string;
  personality: string;
}

export interface RubricCompetency {
  id: string;
  name: string;
  description: string;
  weight: number; // 1-100, must sum to 100
}

export interface ScenarioContext {
  product: string;
  dealDetails: string;
  specialConditions?: string;
}

export interface Scenario {
  id: string;
  persona: Persona;
  context: ScenarioContext;
  rubric: RubricCompetency[];
  createdAt?: string; // ISO 8601
}

// Session & Messages
export interface Message {
  id: string;
  role: 'seller' | 'buyer';
  content: string;
  timestamp: string; // ISO 8601
  wordCount?: number;
}

export interface Session {
  id: string;
  scenarioId: string;
  scenario?: Scenario;
  messages: Message[];
  status: 'active' | 'completed';
  createdAt?: string;
  completedAt?: string;
}

// Analytics (WebSocket payload)
export interface AnalyticsUpdate {
  fillerWordCount: number;
  fillerWordTotal: number;
  talkRatio: { seller: number; buyer: number };
  monologueFlag: boolean;
  messageIndex?: number;
  buyerInterestPercent?: number | null;
}

// Evaluation
export interface CompetencyScore {
  competencyId: string;
  competencyName: string;
  score: number; // 1-5
  feedback: string;
  weight: number;
}

export interface Evaluation {
  id: string;
  sessionId: string;
  overallScore: number; // weighted 0-100
  competencies: CompetencyScore[];
  createdAt?: string;
  analyticsSummary?: {
    totalFillerWords: number;
    talkRatio: { seller: number; buyer: number };
    monologueCount: number;
  };
}

// API request/response helpers
export interface CreateScenarioInput {
  persona: Persona;
  context: ScenarioContext;
  rubric: RubricCompetency[];
}

export interface SendMessageInput {
  content: string;
}

export interface SendMessageResponse {
  message: Message;
}
