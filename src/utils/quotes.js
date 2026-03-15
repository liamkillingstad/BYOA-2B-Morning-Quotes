/**
 * Fetches a random philosophical or religious quote from external API.
 * Fallback to curated list if API fails.
 */

const FALLBACK_QUOTES = [
  "The unexamined life is not worth living. — Socrates",
  "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. — Ralph Waldo Emerson",
  "The only way to do great work is to love what you do. — Steve Jobs",
  "We are what we repeatedly do. Excellence, then, is not an act, but a habit. — Aristotle",
  "The mind is everything. What you think you become. — Buddha",
  "In the midst of winter, I found there was, within me, an invincible summer. — Albert Camus",
  "The purpose of life is a life of purpose. — Robert Byrne",
  "Be the change that you wish to see in the world. — Mahatma Gandhi",
  "It is during our darkest moments that we must focus to see the light. — Aristotle",
  "The soul becomes dyed with the color of its thoughts. — Marcus Aurelius",
];

export async function fetchQuote() {
  try {
    // ZenQuotes API - free, no key required
    const res = await fetch('https://zenquotes.io/api/random');
    const data = await res.json();
    if (data && data[0] && data[0].q) {
      return `${data[0].q} — ${data[0].a}`;
    }
  } catch (e) {
    console.warn('Quote API failed:', e);
  }

  try {
    // Quotable.io fallback
    const res = await fetch('https://api.quotable.io/random?tags=philosophy|wisdom|life');
    const data = await res.json();
    if (data && data.content) {
      return `${data.content} — ${data.author}`;
    }
  } catch (e) {
    console.warn('Quotable API failed:', e);
  }

  // Use curated fallback
  return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
}
