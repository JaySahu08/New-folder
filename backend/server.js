import express from 'express';
import cors from 'cors';
import multer from 'multer';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import natural from 'natural';
import nlp from 'compromise';
import cheerio from 'cheerio';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, unlinkSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExt = '.' + file.originalname.split('.').pop().toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// AI Analysis Engine
class ResumeAnalyzer {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.stemmer = natural.PorterStemmer;
    this.tfidf = new natural.TfIdf();
  }

  // Extract text from different file types
  async extractTextFromFile(filePath, fileType) {
    try {
      if (fileType === '.pdf') {
        const dataBuffer = readFileSync(filePath);
        const pdfData = await pdfParse(dataBuffer);
        return pdfData.text;
      } else if (fileType === '.docx' || fileType === '.doc') {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;
      } else if (fileType === '.txt') {
        return readFileSync(filePath, 'utf8');
      }
    } catch (error) {
      throw new Error(`Error extracting text: ${error.message}`);
    }
  }

  // Clean and preprocess text
  cleanText(text) {
    return text
      .replace(/[^\w\s]|_/g, ' ')
      .replace(/\s+/g, ' ')
      .toLowerCase()
      .trim();
  }

  // Extract keywords using TF-IDF
  extractKeywords(text, maxKeywords = 20) {
    const cleanedText = this.cleanText(text);
    const sentences = cleanedText.split(/[.!?]+/).filter(s => s.length > 10);
    
    this.tfidf = new natural.TfIdf();
    this.tfidf.addDocument(cleanedText);
    
    const keywords = [];
    this.tfidf.listTerms(0).forEach(item => {
      if (item.term.length > 2 && !this.isStopWord(item.term)) {
        keywords.push({
          term: item.term,
          score: item.tfidf
        });
      }
    });
    
    return keywords
      .sort((a, b) => b.score - a.score)
      .slice(0, maxKeywords)
      .map(item => item.term);
  }

  // Common stop words
  isStopWord(word) {
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'as', 'is', 'was', 'are', 'were', 'be', 'been',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'can', 'its', 'their', 'what'
    ]);
    return stopWords.has(word);
  }

  // Extract skills using pattern matching
  extractSkills(text) {
    const skillsDatabase = [
      // Programming Languages
      'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'php', 'ruby',
      'swift', 'kotlin', 'go', 'rust', 'scala', 'r', 'matlab',
      
      // Frontend
      'react', 'angular', 'vue', 'svelte', 'next.js', 'nuxt.js', 'html', 'css',
      'sass', 'less', 'bootstrap', 'tailwind', 'webpack', 'vite',
      
      // Backend
      'node.js', 'express', 'nestjs', 'django', 'flask', 'spring', 'laravel',
      'ruby on rails', 'asp.net', 'fastapi',
      
      // Databases
      'mysql', 'postgresql', 'mongodb', 'redis', 'sqlite', 'oracle', 'sql server',
      'cassandra', 'dynamodb', 'firebase',
      
      // Cloud & DevOps
      'aws', 'azure', 'google cloud', 'docker', 'kubernetes', 'jenkins', 'git',
      'terraform', 'ansible', 'linux', 'nginx', 'apache',
      
      // Mobile
      'react native', 'flutter', 'android', 'ios', 'xcode',
      
      // AI/ML
      'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy',
      'opencv', 'nlp', 'computer vision',
      
      // Soft Skills
      'leadership', 'communication', 'teamwork', 'problem solving', 'creativity',
      'adaptability', 'time management', 'critical thinking', 'collaboration'
    ];

    const foundSkills = skillsDatabase.filter(skill => 
      new RegExp(`\\b${skill}\\b`, 'i').test(text)
    );

    return foundSkills;
  }

  // Extract experience information
  extractExperience(text) {
    const experiencePatterns = [
      /(\d+)\s*\+\s*years?/gi,
      /(\d+)\s*-\s*(\d+)\s*years?/gi,
      /(\d+)\s*years?/gi
    ];

    let maxExperience = 0;
    
    experiencePatterns.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        const years = parseInt(match[1]) || 0;
        maxExperience = Math.max(maxExperience, years);
      });
    });

    return maxExperience;
  }

  // Calculate match score
  calculateMatchScore(resumeText, jobDescription) {
    const resumeKeywords = this.extractKeywords(resumeText);
    const jobKeywords = this.extractKeywords(jobDescription);
    
    const resumeSkills = this.extractSkills(resumeText);
    const jobSkills = this.extractSkills(jobDescription);
    
    // Keyword matching
    const matchedKeywords = jobKeywords.filter(keyword => 
      resumeKeywords.includes(keyword)
    );
    const keywordScore = (matchedKeywords.length / Math.max(jobKeywords.length, 1)) * 40;
    
    // Skill matching
    const matchedSkills = jobSkills.filter(skill => 
      resumeSkills.includes(skill)
    );
    const skillScore = (matchedSkills.length / Math.max(jobSkills.length, 1)) * 40;
    
    // Experience matching
    const resumeExp = this.extractExperience(resumeText);
    const jobExp = this.extractExperience(jobDescription);
    const expScore = jobExp > 0 ? (Math.min(resumeExp, jobExp) / jobExp) * 20 : 10;
    
    return Math.min(100, keywordScore + skillScore + expScore);
  }

  // Generate detailed analysis
  generateAnalysis(resumeText, jobDescription) {
    const resumeKeywords = this.extractKeywords(resumeText);
    const jobKeywords = this.extractKeywords(jobDescription);
    const resumeSkills = this.extractSkills(resumeText);
    const jobSkills = this.extractSkills(jobDescription);
    
    const matchedKeywords = jobKeywords.filter(keyword => 
      resumeKeywords.includes(keyword)
    );
    const missingKeywords = jobKeywords.filter(keyword => 
      !resumeKeywords.includes(keyword)
    );
    
    const matchedSkills = jobSkills.filter(skill => 
      resumeSkills.includes(skill)
    );
    const missingSkills = jobSkills.filter(skill => 
      !resumeSkills.includes(skill)
    );

    const overallScore = this.calculateMatchScore(resumeText, jobDescription);

    return {
      fitScore: Math.round(overallScore),
      keywordAnalysis: {
        matched: matchedKeywords.slice(0, 15),
        missing: missingKeywords.slice(0, 10),
        totalMatches: matchedKeywords.length,
        totalRequired: jobKeywords.length
      },
      skillsAnalysis: {
        matched: matchedSkills,
        missing: missingSkills,
        resumeSkills: resumeSkills.slice(0, 15),
        jobSkills: jobSkills.slice(0, 15)
      },
      experienceAnalysis: {
        resumeExperience: this.extractExperience(resumeText),
        jobRequiredExperience: this.extractExperience(jobDescription)
      },
      suggestions: this.generateSuggestions(missingKeywords, missingSkills, overallScore),
      strengths: this.identifyStrengths(resumeText, jobDescription),
      improvements: this.identifyImprovements(missingKeywords, missingSkills)
    };
  }

  generateSuggestions(missingKeywords, missingSkills, score) {
    const suggestions = [];
    
    if (missingKeywords.length > 0) {
      suggestions.push(`Add these important keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
    }
    
    if (missingSkills.length > 0) {
      suggestions.push(`Consider highlighting these skills: ${missingSkills.slice(0, 3).join(', ')}`);
    }
    
    if (score < 70) {
      suggestions.push("Focus on aligning your experience more closely with the job requirements");
    }
    
    if (score > 80) {
      suggestions.push("Great match! Consider adding quantifiable achievements to stand out");
    }
    
    suggestions.push("Use action verbs and specific metrics to demonstrate impact");
    suggestions.push("Ensure your resume is ATS-friendly with clear section headings");
    
    return suggestions;
  }

  identifyStrengths(resumeText, jobDescription) {
    const strengths = [];
    const skills = this.extractSkills(resumeText);
    const experience = this.extractExperience(resumeText);
    
    if (skills.length > 8) {
      strengths.push("Diverse and comprehensive skill set");
    }
    
    if (experience >= 3) {
      strengths.push(`Substantial professional experience (${experience}+ years)`);
    }
    
    if (resumeText.toLowerCase().includes('lead') || resumeText.toLowerCase().includes('manage')) {
      strengths.push("Demonstrated leadership capabilities");
    }
    
    if (resumeText.match(/\d+%/) || resumeText.match(/\$\d+/)) {
      strengths.push("Quantifiable achievements highlighted");
    }
    
    return strengths.length > 0 ? strengths : ["Strong foundational qualifications for this role"];
  }

  identifyImprovements(missingKeywords, missingSkills) {
    const improvements = [];
    
    if (missingKeywords.length > 5) {
      improvements.push("Increase keyword density for better ATS compatibility");
    }
    
    if (missingSkills.length > 0) {
      improvements.push(`Develop experience with: ${missingSkills.slice(0, 3).join(', ')}`);
    }
    
    improvements.push("Add more specific metrics and results to quantify achievements");
    improvements.push("Use industry-standard terminology and keywords");
    
    return improvements;
  }
}

// Initialize analyzer
const analyzer = new ResumeAnalyzer();

// Routes
app.post('/api/analyze/text', async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    
    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        success: false,
        error: 'Resume text and job description are required'
      });
    }

    if (resumeText.length < 50 || jobDescription.length < 50) {
      return res.status(400).json({
        success: false,
        error: 'Both resume and job description should have meaningful content'
      });
    }
    
    const analysis = analyzer.generateAnalysis(resumeText, jobDescription);
    
    res.json({
      success: true,
      analysis: analysis
    });
  } catch (error) {
    console.error('Text analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze resume: ' + error.message
    });
  }
});

app.post('/api/analyze/file', upload.single('resume'), async (req, res) => {
  try {
    const { jobDescription } = req.body;
    
    if (!req.file || !jobDescription) {
      return res.status(400).json({
        success: false,
        error: 'Resume file and job description are required'
      });
    }

    if (jobDescription.length < 50) {
      // Clean up uploaded file
      if (existsSync(req.file.path)) {
        unlinkSync(req.file.path);
      }
      return res.status(400).json({
        success: false,
        error: 'Job description should have meaningful content'
      });
    }
    
    const filePath = req.file.path;
    const fileType = '.' + req.file.originalname.split('.').pop().toLowerCase();
    
    // Extract text from file
    const resumeText = await analyzer.extractTextFromFile(filePath, fileType);
    
    if (!resumeText || resumeText.trim().length < 50) {
      // Clean up uploaded file
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
      return res.status(400).json({
        success: false,
        error: 'Could not extract sufficient text from the resume file'
      });
    }
    
    // Analyze the resume
    const analysis = analyzer.generateAnalysis(resumeText, jobDescription);
    
    // Clean up uploaded file after analysis
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }
    
    res.json({
      success: true,
      analysis: analysis
    });
  } catch (error) {
    // Clean up file if error occurs
    if (req.file && existsSync(req.file.path)) {
      unlinkSync(req.file.path);
    }
    
    console.error('File analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze resume: ' + error.message
    });
  }
});

app.post('/api/contact', (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }
    
    // In a real application, you would save this to a database
    // and send an email notification
    console.log('Contact form submission:', { name, email, subject, message });
    
    res.json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process contact form'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    message: 'NeuroHire API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 NeuroHire backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔍 API ready for resume analysis`);
});