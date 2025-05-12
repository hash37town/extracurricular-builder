# Extracurricular Builder

A web application that helps students find extracurricular activities, project ideas, and opportunities based on their interests.

## Features

- Generate personalized project ideas based on interests and grade level
- Create email templates for reaching out to organizations
- Find relevant opportunities and competitions
- Modern, responsive UI with accessibility features

## Tech Stack

- Next.js 13 with App Router
- TypeScript
- Tailwind CSS
- OpenAI API
- Jest & React Testing Library

## Development

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Copy `.env.example` to `.env.local` and fill in your environment variables:
```bash
cp .env.example .env.local
```
4. Run the development server:
```bash
npm run dev
```

## Testing

Run the test suite:
```bash
npm test
```

## Deployment

This project is optimized for deployment on [Vercel](https://vercel.com). To deploy:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Add the required environment variables in Vercel's project settings:
   - `OPENAI_API_KEY`
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID` (optional)
   - `NEXT_PUBLIC_ADSENSE_SLOT_ID` (optional)
4. Deploy!
