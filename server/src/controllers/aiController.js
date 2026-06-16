const { GoogleGenerativeAI } = require('@google/generative-ai');

const getGenAI = () => {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new Error('GEMINI_API_KEY is not configured. Please add it to your .env file.');
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
};

const generateContent = async (prompt) => {
  const genAI = getGenAI();
  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-3.5-flash'];
  let lastError;

  for (const modelName of models) {
    try {
      console.log(`🤖 Attempting content generation with model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text) {
        console.log(`✅ Success with model: ${modelName}`);
        return text;
      }
    } catch (error) {
      console.warn(`⚠️ Model ${modelName} failed: ${error.message}`);
      lastError = error;
    }
  }

  throw new Error(`AI generation failed. Last error: ${lastError ? lastError.message : 'Unknown error'}`);
};

// @desc    Generate professional summary
// @route   POST /api/ai/summary
// @access  Private
const generateSummary = async (req, res) => {
  try {
    const { name, role, skills, experience, projects, yearsOfExperience } = req.body;

    const prompt = `Generate a compelling, ATS-optimized professional summary for a resume.

Person: ${name || 'a professional'}
Role/Title: ${role || 'Software Developer'}
Years of Experience: ${yearsOfExperience || 'N/A'}
Technical Skills: ${Array.isArray(skills) ? skills.join(', ') : skills || 'Not specified'}
Experience: ${JSON.stringify(experience || [])}
Projects: ${JSON.stringify(projects || [])}

Requirements:
- Write 3-4 impactful sentences
- Start with a strong opening statement
- Include key technical skills naturally
- Mention notable achievements or experience
- Be specific and quantifiable where possible
- Use active voice and power words
- Make it ATS-friendly with relevant keywords
- Do NOT use first person (I, my, me)
- Return ONLY the summary text, no labels or formatting`;

    const summary = await generateContent(prompt);
    res.json({ success: true, summary: summary.trim() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate project description
// @route   POST /api/ai/project-description
// @access  Private
const generateProjectDescription = async (req, res) => {
  try {
    const { projectName, techStack, githubLink, liveDemo, role } = req.body;

    if (!projectName) {
      return res.status(400).json({ success: false, message: 'Project name is required' });
    }

    const prompt = `Generate a professional, ATS-optimized project description for a resume.

Project Name: ${projectName}
Technologies Used: ${Array.isArray(techStack) ? techStack.join(', ') : techStack || 'Not specified'}
Developer Role: ${role || 'Full Stack Developer'}
GitHub: ${githubLink || 'N/A'}
Live Demo: ${liveDemo || 'N/A'}

Requirements:
- Write 2-3 concise bullet points (use • as bullet)
- Start each bullet with a strong action verb (Built, Developed, Implemented, Designed, Integrated, etc.)
- Highlight technical complexity and problem-solving
- Mention specific technologies naturally
- Include measurable impact if possible
- Keep each bullet under 20 words
- Return ONLY the bullet points, nothing else`;

    const description = await generateContent(prompt);
    res.json({ success: true, description: description.trim() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Suggest additional skills
// @route   POST /api/ai/skill-suggestions
// @access  Private
const suggestSkills = async (req, res) => {
  try {
    const { currentSkills, role, experience } = req.body;

    const prompt = `Suggest additional technical and soft skills for a resume.

Current Role/Target Role: ${role || 'Software Developer'}
Current Skills: ${Array.isArray(currentSkills) ? currentSkills.join(', ') : currentSkills || 'None'}
Experience Level: ${experience || 'Mid-level'}

Requirements:
- Suggest 8-12 relevant technical skills they might be missing
- Suggest 4-6 relevant soft skills
- Focus on high-demand, ATS-friendly skills
- Group them as Technical and Soft
- Return ONLY valid JSON in this exact format:
{
  "technical": ["skill1", "skill2", ...],
  "soft": ["skill1", "skill2", ...]
}`;

    const text = await generateContent(prompt);
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ success: false, message: 'Failed to parse skill suggestions' });
    }
    
    const skills = JSON.parse(jsonMatch[0]);
    res.json({ success: true, skills });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate improvement suggestions
// @route   POST /api/ai/improve
// @access  Private
const generateImprovements = async (req, res) => {
  try {
    const { resume } = req.body;

    if (!resume) {
      return res.status(400).json({ success: false, message: 'Resume data is required' });
    }

    const prompt = `Analyze this resume and provide specific improvement suggestions.

Resume Data:
${JSON.stringify(resume, null, 2)}

Provide a detailed analysis covering:
1. Missing or weak sections
2. Summary improvements
3. Experience description improvements (use STAR method)
4. Skill gaps and additions
5. ATS optimization recommendations
6. Overall formatting suggestions

Return ONLY valid JSON in this exact format:
{
  "overall": "Brief overall assessment",
  "strengths": ["strength1", "strength2"],
  "improvements": [
    {
      "section": "Section name",
      "issue": "What's wrong",
      "suggestion": "How to fix it",
      "priority": "high|medium|low"
    }
  ],
  "atsKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword1", "keyword2"]
}`;

    const text = await generateContent(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return res.status(500).json({ success: false, message: 'Failed to parse improvements' });
    }
    
    const improvements = JSON.parse(jsonMatch[0]);
    res.json({ success: true, improvements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Calculate ATS score
// @route   POST /api/ai/ats-score
// @access  Private
const calculateATSScore = async (req, res) => {
  try {
    const { resume } = req.body;

    if (!resume) {
      return res.status(400).json({ success: false, message: 'Resume data is required' });
    }

    const prompt = `Calculate an ATS (Applicant Tracking System) compatibility score for this resume.

Resume Data:
${JSON.stringify(resume, null, 2)}

Evaluate based on:
1. Completeness of sections (30 points): personal info, summary, experience, education, skills, projects
2. Keyword density (25 points): industry-relevant keywords, action verbs
3. Formatting suitability (20 points): clean structure, no tables/graphics issues
4. Skills match (15 points): technical skills relevance and quantity
5. Content quality (10 points): measurable achievements, clear descriptions

Return ONLY valid JSON:
{
  "score": 85,
  "breakdown": {
    "completeness": 25,
    "keywords": 20,
    "formatting": 18,
    "skills": 12,
    "contentQuality": 10
  },
  "suggestions": [
    "Add more quantifiable achievements",
    "Include a skills section with 10+ technical skills"
  ],
  "grade": "B+",
  "summary": "Your resume is well-structured but needs more keywords"
}`;

    const text = await generateContent(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      return res.status(500).json({ success: false, message: 'Failed to calculate ATS score' });
    }
    
    const atsData = JSON.parse(jsonMatch[0]);
    res.json({ success: true, atsData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate experience description
// @route   POST /api/ai/experience-description
// @access  Private
const generateExperienceDescription = async (req, res) => {
  try {
    const { company, role, duration, technologies } = req.body;

    const prompt = `Generate a professional experience description for a resume.

Company: ${company || 'Company'}
Role: ${role || 'Developer'}
Duration: ${duration || 'N/A'}
Technologies: ${technologies || 'N/A'}

Requirements:
- Write 3 concise bullet points starting with strong action verbs
- Use • as bullet point character
- Include technical details and impact
- Keep each bullet under 20 words
- ATS-optimized language
- Return ONLY the bullet points`;

    const description = await generateContent(prompt);
    res.json({ success: true, description: description.trim() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generateSummary,
  generateProjectDescription,
  suggestSkills,
  generateImprovements,
  calculateATSScore,
  generateExperienceDescription
};
