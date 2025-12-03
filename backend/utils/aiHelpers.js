const natural = require('natural');
const TfIdf = natural.TfIdf;

/**
 * Calculate similarity between two text documents using TF-IDF
 */
function calculateSimilarity(text1, text2) {
  const tfidf = new TfIdf();
  
  tfidf.addDocument(text1.toLowerCase());
  tfidf.addDocument(text2.toLowerCase());
  
  // Get terms from both documents
  const terms1 = [];
  const terms2 = [];
  
  tfidf.listTerms(0).forEach(item => terms1.push(item.term));
  tfidf.listTerms(1).forEach(item => terms2.push(item.term));
  
  // Calculate cosine similarity
  const allTerms = [...new Set([...terms1, ...terms2])];
  
  const vector1 = allTerms.map(term => tfidf.tfidf(term, 0));
  const vector2 = allTerms.map(term => tfidf.tfidf(term, 1));
  
  const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
  const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));
  
  if (magnitude1 === 0 || magnitude2 === 0) return 0;
  
  return (dotProduct / (magnitude1 * magnitude2)) * 100;
}

/**
 * Extract skills from text
 */
function extractSkills(text) {
  const commonSkills = [
    'javascript', 'python', 'java', 'react', 'node', 'nodejs', 'angular', 'vue',
    'sql', 'mysql', 'mongodb', 'postgresql', 'aws', 'azure', 'docker', 'kubernetes',
    'git', 'html', 'css', 'typescript', 'php', 'ruby', 'go', 'rust', 'swift',
    'kotlin', 'flutter', 'react native', 'django', 'flask', 'spring', 'express',
    'tailwind', 'bootstrap', 'sass', 'webpack', 'redux', 'graphql', 'rest api',
    'agile', 'scrum', 'ci/cd', 'testing', 'jest', 'junit', 'selenium'
  ];
  
  const lowerText = text.toLowerCase();
  const foundSkills = commonSkills.filter(skill => 
    lowerText.includes(skill.toLowerCase())
  );
  
  return [...new Set(foundSkills)];
}

/**
 * Calculate match score between user profile and job
 */
function calculateMatchScore(userSkills, userExperience, job) {
  let score = 0;
  
  // Skills matching (70% weight)
  const jobSkills = job.skills || [];
  const jobDescription = `${job.title} ${job.description} ${job.requirements || ''}`;
  const extractedJobSkills = extractSkills(jobDescription);
  
  const allJobSkills = [...new Set([...jobSkills, ...extractedJobSkills])];
  
  if (allJobSkills.length > 0 && userSkills.length > 0) {
    const matchingSkills = userSkills.filter(skill => 
      allJobSkills.some(jobSkill => 
        jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(jobSkill.toLowerCase())
      )
    );
    
    const skillScore = (matchingSkills.length / allJobSkills.length) * 70;
    score += skillScore;
  }
  
  // Experience matching (30% weight)
  if (userExperience && job.experience) {
    const experienceMatch = 30; // Simplified - can be enhanced
    score += experienceMatch * 0.5;
  }
  
  return Math.min(Math.round(score), 100);
}

/**
 * Get job recommendations for a user
 */
async function getJobRecommendations(userProfile, jobs, appliedJobIds = []) {
  const userSkills = userProfile.skills || [];
  const userText = `${userSkills.join(' ')} ${userProfile.name}`;
  
  const scoredJobs = jobs.map(job => {
    const jobText = `${job.title} ${job.description} ${job.requirements || ''} ${(job.skills || []).join(' ')}`;
    
    // Calculate similarity
    const similarity = calculateSimilarity(userText, jobText);
    
    // Calculate match score
    const matchScore = calculateMatchScore(userSkills, userProfile.experience, job);
    
    // Combined score
    const combinedScore = (similarity * 0.4) + (matchScore * 0.6);
    
    return {
      ...job.toJSON(),
      recommendationScore: Math.round(combinedScore),
      matchingSkills: userSkills.filter(skill => 
        jobText.toLowerCase().includes(skill.toLowerCase())
      )
    };
  });
  
  // Sort by score and filter out applied jobs
  return scoredJobs
    .filter(job => !appliedJobIds.includes(job.job_id))
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 10);
}

/**
 * Generate job description using AI-like templates
 */
function generateJobDescription(title, skills, experience, jobType = 'Full-time') {
  const templates = {
    intro: [
      `We are seeking a talented ${title} to join our dynamic team.`,
      `Join our innovative company as a ${title}.`,
      `Exciting opportunity for a ${title} to make an impact.`
    ],
    responsibilities: [
      `Develop and maintain high-quality software solutions`,
      `Collaborate with cross-functional teams`,
      `Write clean, maintainable, and efficient code`,
      `Participate in code reviews and technical discussions`,
      `Contribute to architectural decisions`,
      `Mentor junior team members`
    ],
    requirements: [
      `${experience} of relevant experience`,
      `Strong problem-solving skills`,
      `Excellent communication abilities`,
      `Experience working in Agile environments`,
      `Bachelor's degree in Computer Science or related field`
    ]
  };
  
  const intro = templates.intro[Math.floor(Math.random() * templates.intro.length)];
  
  const description = `
${intro}

**Key Responsibilities:**
${templates.responsibilities.slice(0, 4).map((r, i) => `${i + 1}. ${r}`).join('\n')}

**Required Skills:**
${skills.map((s, i) => `${i + 1}. ${s}`).join('\n')}

**Requirements:**
${templates.requirements.map((r, i) => `${i + 1}. ${r}`).join('\n')}

**Job Type:** ${jobType}

We offer competitive compensation, excellent benefits, and a collaborative work environment where you can grow your career.
  `.trim();
  
  return description;
}

module.exports = {
  calculateSimilarity,
  extractSkills,
  calculateMatchScore,
  getJobRecommendations,
  generateJobDescription
};
