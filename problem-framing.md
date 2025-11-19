# Problem Framing

## Domain: Personalized Learning & Concept Mastery

As students, we all want to not just memorize material for exams but truly understand what we learn. Whether it’s a math formula, a chemistry reaction, or a programming concept, we’ve found that active practice helps ideas stick far better than passive review. Traditional apps like Quizlet or Khan Academy are useful, but they lack the problem-solving depth and satisfaction that come from real challenges. We want studying to feel like focused, bite-sized, and rewarding, turning small wins into lasting mastery as we "level up" in our understanding.

## Problem: Passive Review and Fragmented Learning

Many students struggle to build long-term mastery of topics because most study tools promote passive review instead of active problem-solving. We jump between notes, flashcards, and videos, but rarely get to apply ideas under real challenge, leading to fragile knowledge that quickly fades. Even platforms with exercises, like Quizlet or Khan Academy, don’t adapt across subjects or track deep conceptual growth. The result is scattered study sessions across too many apps—with no single space that personalizes practice, reinforces weak spots, or shows steady, meaningful progress.

## Evidence:

- [Active learning is more effective than traditional passive learning](https://www.cmu.edu/news/stories/archives/2021/october/active-learning.html): Engaging students through interactive activities, discussions, feedback and AI-enhanced technologies resulted in improved academic performance compared to traditional lectures, lessons or readings.

- [Initial learning using active learning methods outperform passive ones](https://pmc.ncbi.nlm.nih.gov/articles/PMC7383800/): Current literature suggests that, at least during initial learning, active learning methods outperform passive ones because of improved student engagement, self‐esteem, and attitude.

- [Gamification of learning achieves more positive attitudes related to the subject](https://pmc.ncbi.nlm.nih.gov/articles/PMC10611935/#:~:text=Gamification%20improves%20the%20attitude%20about,square%20between%200.01%20and%200.06)): Gamification improved students' attitudes regarding the difficulty of the statistics in a medium effect size and statistics value and cognitive competency in a weak effect size.

- [Interactive and engaging apps an improve academic competency](https://pmc.ncbi.nlm.nih.gov/articles/PMC8800936/): Their study results showed that although academic assistance is the primary motivation behind educational apps, students also reported that interactive and engaging educational apps had improved their academic competency. Camilleri & Camilleri [23] also recommend the gamification of educational apps, as many students expressed that entertaining content also motivates them while choosing educational apps.

- [Fragmented digital experience among learning apps has become an inconvenience](https://www.prnewswire.com/news-releases/new-research-report-unveils-educational-app-overload-in-k12-schools-302397684.html): In districts that have not selected a single, integrated system, most schools utilize between 10 and 15 educational apps with some student and parent component, creating a fragmented digital experience for their students and families.

## Comparables:

- [LeetCode • Programming challenges](https://leetcode.com): LeetCode offers an effective challenge-based model for coding practice with clear progression and feedback. However, it’s limited to computer science and doesn’t extend its approach to other academic subjects.

- [Khan Academy • Structured lessons](https://www.khanacademy.org): Khan Academy provides excellent instructional videos and guided exercises. Yet, its focus leans toward passive learning and lacks user-driven or adaptive challenges that promote active problem-solving.

- [Quizlet • Flashcard learning](https://quizlet.com): Quizlet hosts a massive library of user-created flashcards, making memorization quick and accessible. However, it prioritizes recall over reasoning, offering little opportunity for conceptual application or adaptive practice.

## Features:

- ***Concept Challenges:*** Instead of passively rereading notes or watching videos, users engage with bite-sized, challenge-based questions that test both understanding and recall. Each concept becomes an interactive problem that strengthens long-term retention through active application. This feature keeps learning focused, energizing, and rewarding by turning study sessions into small, meaningful wins.

- ***Adaptive Difficulty Ladder:*** As users progress, the app adjusts the challenge level in real time based on performance. Easier questions build confidence, while harder ones deepen understanding without overwhelming. This feature ensures that every learner moves at their own pace, maintaining motivation and consistent growth.

- ***AI-Generated Practice Sets:*** Users can select a topic or weakness, and the app instantly generates personalized problem sets. Each set is tailored to reinforce concepts that need more attention and revisit them later through spaced repetition. This feature helps learners focus efficiently, making practice time more effective and goal-driven.

- ***Concept Maps:*** Visual maps connect related ideas—showing how one concept leads to another across subjects. Users can see how a single formula, mechanism, or model fits into the larger picture of what they’re learning. This feature helps transform isolated facts into an integrated understanding of the subject.

- ***Spaced Repetition Engine:*** Rather than reviewing everything at once, the app resurfaces key concepts at optimal intervals to strengthen memory. Users see what they’re about to forget—right when it matters most. This feature makes studying smarter and more sustainable by reinforcing mastery over time.

- ***Reflection Journal:*** After each session, users can jot down what they learned, what challenged them, and what finally clicked. This feature transforms passive review into active reflection, helping learners consolidate insights and track their personal growth across subjects.

- ***Goal Planner:*** Users can set daily or weekly mastery goals—like completing five challenges or revisiting three key topics—and track their progress toward completion. This feature encourages consistency and builds a sense of accountability, turning learning into a sustainable routine rather than a last-minute sprint.

## Ethical Analysis:

### **Stakeholders**

1. **Observation:** Students with varying learning abilities (such as ADHD, dyslexia, or visual impairments) may find it difficult to use challenge-based systems that rely on dense text or timed interactions.
**Design Response:** Introduce accessibility features like a *focus mode*, dyslexia-friendly fonts, adjustable timers, and full screen-reader compatibility. This ensures that every learner, regardless of ability, can engage with content meaningfully and comfortably.

2. **Observation:** Parents or educators who view student progress could misinterpret raw scores or streaks as measures of intelligence, creating pressure or discouragement.
**Design Response:** Replace numeric scores with qualitative mastery tiers (e.g., *Emerging → Solid → Mastered*) and provide contextual progress trends to help observers understand growth over time rather than simple performance.

3. **Observation:** Without moderation, users could misuse AI-generated question tools to create inaccurate or biased content.
**Design Response:** Implement a feedback loop where flagged challenges are reviewed and improved through educator verification and algorithmic quality checks, maintaining fairness and trust in shared content.

---

### **Time**

1. **Observation:** Over time, streak-based gamification may lead to burnout or anxiety if users feel penalized for missing sessions.
**Design Response:** Add *rest days* and adaptive reminders that encourage consistency without guilt. Shifting from rigid streaks to flexible weekly goals supports long-term, sustainable learning habits.

2. **Observation:** As learners mature, the app’s personalization algorithms may overfit to their prior data, limiting exposure to new types of problems.
**Design Response:** Build transparency into AI recommendations through a “Why this question?” button that explains suggestion logic and encourages users to explore beyond algorithmic comfort zones.

3. **Observation:** Heavy reliance on AI-generated practice could make learners dependent on the system instead of developing self-guided study habits.
**Design Response:** Introduce a *self-author mode* where users create or edit their own challenges, prompting creativity and critical thinking while gradually building independence from AI support.

---

### **Pervasiveness**

1. **Observation:** If widely adopted, the app could unintentionally contribute to global educational homogenization—students everywhere learning through the same examples and cultural contexts.
**Design Response:** Offer regional content settings with localized examples, units, and culturally relevant references to ensure that global adoption still respects local diversity.

2. **Observation:** Students in low-bandwidth or rural areas may be excluded if the app depends on a constant internet connection.
**Design Response:** Enable offline downloadable challenge sets and lightweight “text-first” study modes so learners can practice anywhere without connectivity barriers.

3. **Observation:** As the user base grows, algorithms might converge toward the median learner profile, leaving advanced or struggling users underserved.
**Design Response:** Allow full customization of pacing, difficulty, and review intervals so each user can tailor their learning experience to their own level and goals.

---

### **Values**

**Observation:** The app promotes autonomy and mastery, but gamified elements like XP and streaks could shift focus from learning to score-chasing.
**Design Response:** Redesign achievements to celebrate perseverance and insight instead of speed—awards such as *Concept Builder* or *Deep Thinker* emphasize depth and effort over quantity.

**Observation:** Continuous data collection raises privacy concerns around academic profiling or third-party data use.
**Design Response:** Store all progress data locally or with encryption, anonymize aggregated analytics, and allow users to export or permanently delete their data at any time.

**Observation:** The adaptive and accessible design can meaningfully expand educational equity for students without institutional support.
**Design Response:** Keep core features—like challenge practice, reflection, and spaced repetition—free and ad-free to ensure that personalized, high-quality learning remains accessible to all.
