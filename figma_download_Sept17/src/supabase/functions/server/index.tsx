import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-a42f59f3/health", (c) => {
  return c.json({ status: "ok" });
});

// FAQ endpoints

// Get FAQs for a specific solution or general FAQs
app.get("/make-server-a42f59f3/faqs/:key", async (c) => {
  try {
    const key = c.req.param("key");
    const faqs = await kv.get(key);
    
    return c.json({ 
      faqs: faqs || [],
      count: faqs ? faqs.length : 0
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return c.json({ error: "Failed to fetch FAQs", faqs: [] }, 500);
  }
});

// Submit a new question
app.post("/make-server-a42f59f3/questions", async (c) => {
  try {
    const body = await c.req.json();
    const { question, name, email, solutionId, solutionTitle } = body;
    
    if (!question || !question.trim()) {
      return c.json({ error: "Question is required" }, 400);
    }

    // Store the question for moderation
    const questionId = `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const questionData = {
      id: questionId,
      question: question.trim(),
      name: name?.trim() || '',
      email: email?.trim() || '',
      solutionId: solutionId || 'general',
      solutionTitle: solutionTitle || 'General',
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    // Store in pending questions
    const pendingKey = `pending_questions`;
    const existingQuestions = await kv.get(pendingKey) || [];
    existingQuestions.push(questionData);
    await kv.set(pendingKey, existingQuestions);

    console.log(`New question submitted: ${questionId} for solution: ${solutionId}`);
    
    return c.json({ 
      success: true, 
      message: "Question submitted successfully",
      questionId: questionId 
    });
  } catch (error) {
    console.error("Error submitting question:", error);
    return c.json({ error: "Failed to submit question" }, 500);
  }
});

// Admin endpoint to approve and answer questions (for future use)
app.post("/make-server-a42f59f3/admin/answer-question", async (c) => {
  try {
    const body = await c.req.json();
    const { questionId, answer } = body;
    
    if (!questionId || !answer || !answer.trim()) {
      return c.json({ error: "Question ID and answer are required" }, 400);
    }

    // Get pending questions
    const pendingKey = `pending_questions`;
    const pendingQuestions = await kv.get(pendingKey) || [];
    
    // Find the question
    const questionIndex = pendingQuestions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) {
      return c.json({ error: "Question not found" }, 404);
    }

    const question = pendingQuestions[questionIndex];
    
    // Create FAQ entry
    const faq = {
      id: `faq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      question: question.question,
      answer: answer.trim(),
      createdAt: new Date().toISOString(),
    };

    // Add to appropriate FAQ list
    const faqKey = question.solutionId === 'general' ? 'faqs_general' : `faqs_${question.solutionId}`;
    const existingFaqs = await kv.get(faqKey) || [];
    existingFaqs.push(faq);
    await kv.set(faqKey, existingFaqs);

    // Remove from pending questions
    pendingQuestions.splice(questionIndex, 1);
    await kv.set(pendingKey, pendingQuestions);

    console.log(`Question ${questionId} answered and published as FAQ ${faq.id}`);
    
    return c.json({ 
      success: true, 
      message: "Question answered and published",
      faqId: faq.id 
    });
  } catch (error) {
    console.error("Error answering question:", error);
    return c.json({ error: "Failed to answer question" }, 500);
  }
});

// Admin endpoint to get pending questions (for future use)
app.get("/make-server-a42f59f3/admin/pending-questions", async (c) => {
  try {
    const pendingQuestions = await kv.get('pending_questions') || [];
    
    return c.json({ 
      questions: pendingQuestions,
      count: pendingQuestions.length
    });
  } catch (error) {
    console.error("Error fetching pending questions:", error);
    return c.json({ error: "Failed to fetch pending questions" }, 500);
  }
});

Deno.serve(app.fetch);