import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    }
  }

  async generateFollowUpQuestions(context: any, answers: any, metrics: any): Promise<any[]> {
    if (!this.model) return [];

    const prompt = `
      You are a Senior Forensic Business Auditor. 
      Business Context: Sector: ${context.sector}, Type: ${context.businessType}.
      Calculated Metrics: Drain: ${metrics.capacityDrainPct}%, Annual Stock Impact: £${metrics.totalStockImpact}.
      Current Audit Answers: ${JSON.stringify(answers)}

      Task: Generate 3 critical forensic follow-up questions to drill down into the biggest leaks identified.
      Each question must be specific to their industry.
      Return the result as a JSON array of objects with "id", "question", and "reason".
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      // Clean up JSON if AI adds markdown
      const cleanJson = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error('Gemini Error:', error);
      return [];
    }
  }

  async generateStrategicInsight(context: any, answers: any, metrics: any): Promise<any> {
    if (!this.model) return { summary: 'AI Insight not available (Check API Key)', priority: 'High' };

    const prompt = `
      You are a Senior Strategic Advisor.
      Business Context: ${context.sector} - ${context.businessType}.
      Recovery Potential: £${metrics.annualRecovery} per year.
      Full Data: ${JSON.stringify(answers)}

      Task: Provide a high-impact strategic insight to recover their lost margins.
      Return the result as a JSON object with:
      - "keyIssue": A clear statement of the primary forensic leak.
      - "businessExplanation": A detailed explanation of why this is happening.
      - "estimatedImpact": A string describing the financial or operational impact (e.g., "£15,000 annual loss").
      - "recommendations": A JSON array of 1-2 specific, actionable strings.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const cleanJson = text.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.error('Gemini Error:', error);
      return { 
        keyIssue: 'Strategic insight currently stabilizing.', 
        businessExplanation: 'The intelligence engine is processing your operational data to identify the primary margin leak.',
        estimatedImpact: 'Calculating recovery potential...',
        recommendations: ['Review operational waste manual', 'Consult with a 247GBS specialist']
      };
    }
  }

  async generateAggregatedInsight(history: any[]): Promise<string> {
    if (!this.model || history.length === 0) return "Perform more audits to unlock systemic AI insights.";

    const prompt = `
      You are a Lead Forensic Data Analyst. 
      User Audit History: ${JSON.stringify(history)}

      Task: Identify a systemic pattern or trend across these audits. 
      Is efficiency improving? Is a specific sector lagging? 
      Provide a one-sentence high-level "Forensic Intelligence" statement.
      Keep it professional and data-driven.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      return "Systemic pattern analysis is currently stabilizing. Please check back after your next audit.";
    }
  }
}
