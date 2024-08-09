import { neon } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import OpenAI from "openai";


export const createDbConnection = (databaseUrl: string): NeonHttpDatabase => {
    const sql = neon(databaseUrl);
    return drizzle(sql);
};

export const createOpenAIClient = (apiKey: string): OpenAI => {
    return new OpenAI({ apiKey });
};

export const parseCSV = (text: string): Record<string, string>[] => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    return lines.slice(1).map(line => {
      const values = line.split(',');
      return headers.reduce((obj, header, index) => {
        obj[header] = values[index]?.trim() ?? '';
        return obj;
      }, {} as Record<string, string>);
    });
  }
  