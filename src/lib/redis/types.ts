import { z } from 'zod';

// Define the schema for scraped data
export const WebScrapedDataSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  title: z.string(),
  content: z.string(),
  category: z.string(),
  labels: z.array(z.string()),
  timestamp: z.number(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type WebScrapedData = z.infer<typeof WebScrapedDataSchema>;

// Define index schemas for efficient querying
export const CategoryIndexSchema = z.object({
  category: z.string(),
  dataIds: z.array(z.string()),
});

export const LabelIndexSchema = z.object({
  label: z.string(),
  dataIds: z.array(z.string()),
});

export type CategoryIndex = z.infer<typeof CategoryIndexSchema>;
export type LabelIndex = z.infer<typeof LabelIndexSchema>;
