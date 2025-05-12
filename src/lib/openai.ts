import { ProjectIdea, GeneratedEmail, UserInput } from '@/types';

const generateProjectPrompt = (input: UserInput) => `
Generate 2-3 unique and impactful project ideas for a ${input.gradeLevel}th grade student interested in ${input.interests.join(', ')}. 
The projects should be:
1. Feasible for a high school student
2. Impressive for college applications
3. Aligned with their interests
4. Possible to complete within 2-3 months

Format the response as a JSON array of project ideas, each with:
- title: string
- description: string
- steps: string[]
- timeline: string
- resources: string[]
`;

const generateEmailPrompt = (input: UserInput, opportunity: string) => `
Write a professional cold outreach email for a ${input.gradeLevel}th grade student interested in ${input.interests.join(', ')}.
The email is regarding: ${opportunity}

Format the response as JSON with:
- subject: string
- body: string
- to: string (suggested recipient type)
- notes: string[] (tips for customization)
`;

export async function generateProjects(input: UserInput): Promise<ProjectIdea[]> {
  try {
    const response = await fetch('/api/generate/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error('Failed to generate projects');
    }

    return response.json();
  } catch (error) {
    console.error('Error generating projects:', error);
    throw error;
  }
}

export async function generateEmail(
  input: UserInput,
  opportunity: string
): Promise<GeneratedEmail> {
  try {
    const response = await fetch('/api/generate/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input, opportunity }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate email');
    }

    return response.json();
  } catch (error) {
    console.error('Error generating email:', error);
    throw error;
  }
}

export { generateProjectPrompt, generateEmailPrompt };
