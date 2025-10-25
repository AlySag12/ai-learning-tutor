// Learning Engine - Handles educational logic and progress tracking
class LearningEngine {
constructor() {
this.userProgress = this.loadUserProgress();
this.courses = this.loadCourses();
this.currentSession = {
startTime: Date.now(),
interactions: 0,
questionsAsked: 0,
conceptsLearned: []
};
}
loadUserProgress() {
const defaultProgress = {
level: 12,
streak: 7,
completedLessons: 24,
studyTime: 18 * 60 * 60 * 1000, // 18 hours in milliseconds
skillsLearned: 12,
overallProgress: 73,
currentCourse: {
name: "Advanced JavaScript Concepts",
progress: 4,
totalModules: 7
},
achievements: [
{ id: 'problem_solver', name: 'Problem Solver', description: 'Completed 10
coding challenges', icon: '🎯' },
{ id: 'quick_learner', name: 'Quick Learner', description: 'Finished module in
record time', icon: '📈' },
{ id: 'streak_master', name: 'Streak Master', description: '7 days of consistent
learning', icon: '🔥' }
],
learningStyle: 'visual',
preferredDifficulty: 'intermediate'
};
try {
const saved = localStorage.getItem('learningProgress');
return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress;
} catch (error) {
console.error('Failed to load progress:', error);
return defaultProgress;
}
}
saveUserProgress() {
try {
localStorage.setItem('learningProgress', JSON.stringify(this.userProgress));
} catch (error) {
console.error('Failed to save progress:', error);
}
}
loadCourses() {
return {
javascript: {
name: "Advanced JavaScript Concepts",
modules: [
{ id: 'closures', name: 'Closures', completed: false, current: true },
{ id: 'promises', name: 'Promises & Async/Await', completed: false, current:
false },
{ id: 'prototypes', name: 'Prototypes & Inheritance', completed: false,
current: false },
{ id: 'modules', name: 'ES6 Modules', completed: false, current: false }
]
}
};
}
// Progress tracking methods
updateProgress(type, value) {
switch (type) {
case 'lesson_completed':
this.userProgress.completedLessons++;
this.userProgress.overallProgress = Math.min(100,
this.userProgress.overallProgress + 2);
this.checkForAchievements();
break;
case 'question_answered':
this.currentSession.questionsAsked++;
break;
case 'concept_learned':
if (!this.currentSession.conceptsLearned.includes(value)) {
this.currentSession.conceptsLearned.push(value);
this.userProgress.skillsLearned++;
}
break;
case 'study_time':
this.userProgress.studyTime += value;
break;
}
this.saveUserProgress();
}
checkForAchievements() {
const newAchievements = [];
// Check for new achievements based on progress
if (this.userProgress.completedLessons >= 25 &&
!this.hasAchievement('lesson_master')) {
newAchievements.push({
id: 'lesson_master',
name: 'Lesson Master',
description: 'Completed 25 lessons',
icon: '📚'
});
}
if (this.currentSession.questionsAsked >= 10 &&
!this.hasAchievement('curious_mind')) {
newAchievements.push({
id: 'curious_mind',
name: 'Curious Mind',
description: 'Asked 10 questions in one session',
icon: '🤔'
});
}
// Add new achievements
newAchievements.forEach(achievement => {
this.userProgress.achievements.push(achievement);
this.showAchievementNotification(achievement);
});
if (newAchievements.length > 0) {
this.saveUserProgress();
}
}
hasAchievement(achievementId) {
return this.userProgress.achievements.some(a => a.id === achievementId);
}
showAchievementNotification(achievement) {
// This would trigger a UI notification
if (window.app && window.app.showNotification) {
window.app.showNotification(`🎉 Achievement Unlocked:
${achievement.name}!`, 'success');
}
}
// Learning analytics
analyzeUserPerformance() {
const sessionDuration = Date.now() - this.currentSession.startTime;
const questionsPerHour = (this.currentSession.questionsAsked /
(sessionDuration / (1000 * 60 * 60))).toFixed(1);
return {
sessionDuration: this.formatDuration(sessionDuration),
questionsAsked: this.currentSession.questionsAsked,
questionsPerHour: questionsPerHour,
conceptsLearned: this.currentSession.conceptsLearned.length,
engagementLevel: this.calculateEngagementLevel(),
recommendedBreak: sessionDuration > 45 * 60 * 1000, // 45 minutes
nextRecommendation: this.getNextRecommendation()
};
}
calculateEngagementLevel() {
const sessionDuration = Date.now() - this.currentSession.startTime;
const interactions = this.currentSession.interactions;
const interactionsPerMinute = interactions / (sessionDuration / (1000 * 60));
if (interactionsPerMinute > 2) return 'high';
if (interactionsPerMinute > 1) return 'medium';
return 'low';
}
getNextRecommendation() {
const performance = this.analyzeUserPerformance();
if (performance.recommendedBreak) {
return "Consider taking a 10-15 minute break to maintain focus and retention.";
}
if (performance.engagementLevel === 'low') {
return "Try switching to interactive practice problems to boost engagement.";
}
if (this.currentSession.conceptsLearned.length >= 3) {
return "Great progress! Consider reviewing what you've learned before moving
to new concepts.";
}
return "You're doing well! Continue with the current lesson or ask questions
about anything unclear.";
}
// Adaptive learning methods
adaptDifficultyLevel(userResponse, isCorrect) {
const currentDifficulty = this.userProgress.preferredDifficulty;
if (isCorrect && userResponse.timeToAnswer < 10000) { // Less than 10 seconds
// User is finding it too easy, increase difficulty
if (currentDifficulty === 'beginner') {
this.userProgress.preferredDifficulty = 'intermediate';
} else if (currentDifficulty === 'intermediate') {
this.userProgress.preferredDifficulty = 'advanced';
}
} else if (!isCorrect || userResponse.timeToAnswer > 60000) { // More than 1 minute
// User is struggling, decrease difficulty
if (currentDifficulty === 'advanced') {
this.userProgress.preferredDifficulty = 'intermediate';
} else if (currentDifficulty === 'intermediate') {
this.userProgress.preferredDifficulty = 'beginner';
}
}
this.saveUserProgress();
}
generatePersonalizedContent(topic) {
const style = this.userProgress.learningStyle;
const difficulty = this.userProgress.preferredDifficulty;
const contentTemplates = {
visual: {
beginner: "Let me show you {topic} with simple diagrams and step-by-step
visual examples.",
intermediate: "Here's {topic} explained with interactive code examples and
visual representations.",
advanced: "Let's explore {topic} through complex scenarios and architectural
diagrams."
},
auditory: {
beginner: "I'll explain {topic} using analogies and verbal descriptions you can
easily follow.",
intermediate: "Let's discuss {topic} with detailed explanations and real-world
examples.",
advanced: "I'll walk you through {topic} with comprehensive analysis and
discussion."
},
kinesthetic: {
beginner: "Let's learn {topic} by building simple, hands-on examples
together.",
intermediate: "We'll master {topic} through interactive coding exercises and
practical projects.",
advanced: "Let's dive deep into {topic} with complex, real-world
implementation challenges."
}
};
const template = contentTemplates[style]?.[difficulty] ||
contentTemplates.visual.intermediate;
return template.replace('{topic}', topic);
}
// Spaced repetition system
scheduleReview(concept, performanceScore) {
const now = Date.now();
let nextReview;
// Calculate next review based on performance (spaced repetition algorithm)
if (performanceScore >= 0.9) {
nextReview = now + (7 * 24 * 60 * 60 * 1000); // 7 days
} else if (performanceScore >= 0.7) {
nextReview = now + (3 * 24 * 60 * 60 * 1000); // 3 days
} else if (performanceScore >= 0.5) {
nextReview = now + (1 * 24 * 60 * 60 * 1000); // 1 day
} else {
nextReview = now + (4 * 60 * 60 * 1000); // 4 hours
}
// Store review schedule
const reviews = this.getScheduledReviews();
reviews[concept] = nextReview;
localStorage.setItem('scheduledReviews', JSON.stringify(reviews));
}
getScheduledReviews() {
try {
return JSON.parse(localStorage.getItem('scheduledReviews')) || {};
} catch (error) {
return {};
}
}
getDueReviews() {
const reviews = this.getScheduledReviews();
const now = Date.now();
return Object.entries(reviews)
.filter(([concept, dueTime]) => dueTime <= now)
.map(([concept]) => concept);
}
// Utility methods
formatDuration(milliseconds) {
const seconds = Math.floor(milliseconds / 1000);
const minutes = Math.floor(seconds / 60);
const hours = Math.floor(minutes / 60);
if (hours > 0) {
return `${hours}h ${minutes % 60}m`;
} else if (minutes > 0) {
return `${minutes}m ${seconds % 60}s`;
} else {
return `${seconds}s`;
}
}
recordInteraction() {
this.currentSession.interactions++;
}
// Learning path generation
generateLearningPath(targetSkill, currentLevel) {
const pathTemplates = {
javascript: [
{ name: 'Variables & Data Types', difficulty: 'beginner', estimatedTime: '2h' },
{ name: 'Functions & Scope', difficulty: 'beginner', estimatedTime: '3h' },
{ name: 'Objects & Arrays', difficulty: 'intermediate', estimatedTime: '4h' },
{ name: 'DOM Manipulation', difficulty: 'intermediate', estimatedTime: '5h' },
{ name: 'Async Programming', difficulty: 'advanced', estimatedTime: '6h' },
{ name: 'Advanced Patterns', difficulty: 'advanced', estimatedTime: '8h' }
],
python: [
{ name: 'Python Basics', difficulty: 'beginner', estimatedTime: '3h' },
{ name: 'Data Structures', difficulty: 'intermediate', estimatedTime: '4h' },
{ name: 'Object-Oriented Programming', difficulty: 'intermediate',
estimatedTime: '5h' },
{ name: 'Libraries & Frameworks', difficulty: 'advanced', estimatedTime: '8h' }
]
};
const path = pathTemplates[targetSkill.toLowerCase()] ||
pathTemplates.javascript;
// Customize path based on current level
const difficultyOrder = ['beginner', 'intermediate', 'advanced'];
const startIndex = Math.max(0, difficultyOrder.indexOf(currentLevel) - 1);
return path.slice(startIndex);
}
}
// Initialize learning engine
const learningEngine = new LearningEngine();
