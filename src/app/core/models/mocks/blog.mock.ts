export interface BlogPagePost {
  id: string;
  title: string;
  content: string;
  author: string;
  publishedDate: string;
  readTime: string;
  imageUrl: string;
  category: string;
  isFeatured: boolean;
}

export interface NewsletterSignup {
  title: string;
  description: string;
  buttonText: string;
}

export const BLOG_PAGE_POSTS: BlogPagePost[] = [
  {
    id: '1',
    title: 'The Job Search Is Broken — Here\'s How Rzume Is Fixing It',
    content: `<p>For most job seekers, the job search is a maze. You apply to dozens of roles, swap between tabs, save jobs in random folders, and promise yourself you\'ll "circle back" on follow-ups you inevitably forget.</p>
      
      <p><strong>The result?</strong><br>
      Missed opportunities. Lost resumes. Forgotten deadlines. Confusion when recruiters reply weeks later and you can\'t remember what you sent them.</p>
      
      <p>You\'re not alone—this is the reality for almost everyone looking for a job today.</p>

      <h2>Why the Job Search Feels Chaotic</h2>
      <p>The modern job hunt pushes people toward spreadsheets, not strategy. Job seekers routinely struggle with:</p>
      <ul>
        <li>Keeping track of all the roles they\'ve applied for</li>
        <li>Remembering when to follow up</li>
        <li>Knowing which resume they used for which job</li>
        <li>Managing documents in messy folders</li>
        <li>Staying consistent week after week</li>
      </ul>
      
      <p>Your job search shouldn\'t feel like detective work.</p>

      <h2>Meet Rzume: A Simpler Way to Job Hunt</h2>
      <p>Rzume was built to eliminate the chaos and keep you organized from day one. We help you bring <strong>"less chaos, more momentum"</strong> to your job hunt. Here\'s what Rzume solves immediately:</p>
      <ul>
        <li><strong>Track multiple job applications in one place</strong></li>
        <li><strong>Smart follow-up reminders so you never miss your moment</strong></li>
        <li><strong>Store and link resumes to each application</strong></li>
        <li><strong>Cloud-based and accessible anywhere</strong></li>
      </ul>
      <p>No setup. No complexity. Just clarity.</p>

      <h2>Built In Public — Shaped by You</h2>
      <p>Rzume isn\'t just another job tracker, we are building in public and releasing updates based on real user feedback. Our roadmap outlines exactly what\'s coming next, from AI resume optimization to a mobile app and job link import. This means the community directly influences what we build.</p>

      <h2>Why Organization Wins Job Offers</h2>
      <p>Recruiters move fast. Hiring cycles move fast. The candidates who succeed aren\'t always the most qualified—they\'re the most consistent and the most prepared.</p>
      
      <p>By giving you a structured, automated, and intuitive system, Rzume helps you:</p>
      <ul>
        <li>Apply more strategically</li>
        <li>Follow up confidently</li>
        <li>Track progress over time</li>
        <li>Stay motivated with insights and reminders</li>
      </ul>
      
      <p>You bring the ambition—we bring the structure. If you\'re tired of the overwhelm, Rzume is the clean slate your job search needs.</p>`,
    author: 'Rzume Team',
    publishedDate: 'November 12, 2025',
    readTime: '5 min read',
    imageUrl: 'assets/images/The Job Search Is Broken — Here’s How Rzume Is Fixing It.jpg',
    category: 'Job Search',
    isFeatured: true
  },
  {
    id: '2',
    title: 'How To Stay Consistent in Your Job Search (Without Burning Out)',
    content: `<p>Job searching isn\'t just about applying—it\'s about staying consistent. But consistency is hard when you\'re juggling deadlines, interviews, follow-ups, and emotional ups and downs. This is exactly the problem Rzume was built to solve.</p>

      <h2>Why Job Seekers Lose Momentum</h2>
      <p>Every job seeker hits the same wall: the longer the search goes on, the harder it becomes to stay organized.</p>
      
      <p>People usually lose momentum because they:</p>
      <ul>
        <li>Forget which roles they applied to</li>
        <li>Miss follow-up windows</li>
        <li>Don\'t have visibility into progress</li>
        <li>Create clutter with multiple resume versions</li>
        <li>Feel overwhelmed by the lack of structure</li>
      </ul>
      
      <p>And once consistency slips, opportunities slip with it.</p>

      <h2>Build a Momentum System With Rzume</h2>
      <p>Rzume gives job seekers an easy way to stay on track—even on days when motivation is low.</p>
      
      <p>Here\'s how:</p>

      <h4>1. Smart Follow-Up Reminders</h4>
      <p>Most candidates forget to follow up, but research shows follow-ups significantly increase your chance of getting noticed. Rzume automatically reminds you when it\'s time to reach out again (3–14 day schedules depending on application stage).</p>

      <h4>2. Track Every Application Without Spreadsheets</h4>
      <p>No more manual updates, no more confusion. Everything lives in one neat dashboard.</p>

      <h4>3. Link Your Resume to Each Application</h4>
      <p>You\'ll always know which version you sent—even weeks later when a recruiter emails you.</p>

      <h4>4. Basic Analytics for Accountability</h4>
      <p>In the current phase, Rzume gives you a simple breakdown of how many applications you\'ve submitted and where each one stands.</p>

      <h4>5. A Clean, Stress-Free Workspace</h4>
      <p>Your job search shouldn\'t feel like a mess. Rzume keeps everything organized so you can focus on results, not admin.</p>

      <h2>Consistency Is a Game-Changer</h2>
      <p>Job seekers who stay consistent:</p>
      <ul>
        <li>Land interviews faster</li>
        <li>Recover from rejections quicker</li>
        <li>Apply to higher-quality roles</li>
        <li>Maintain positive momentum</li>
      </ul>
      
      <p>You don\'t need to hustle harder—just smarter. With Rzume, staying consistent becomes effortless.</p>`,
    author: 'Rzume Team',
    publishedDate: 'November 12, 2025',
    readTime: '4 min read',
    imageUrl: 'assets/images/How To Stay Consistent in Your Job Search (Without Burning Out).png',
    category: 'Productivity',
    isFeatured: false
  },
  {
    id: '3',
    title: '5 Evidence-Backed Habits of Job Seekers Who Get Hired Faster',
    content: `<p>Every day, millions of people search for jobs, but not everyone approaches the search the same way. Research from LinkedIn, Indeed, Glassdoor, and leading career-strategy publications shows that certain habits consistently separate successful job seekers from everyone else.</p>
      
      <p>This article summarizes <strong>five evidence-backed behaviours</strong> that improve job-search outcomes — and how you can integrate them into your own process.</p>

      <h2>1. They Use a Structured System, Not Memory or Spreadsheets</h2>
      <p>According to Glassdoor, the average job seeker applies to <strong>15–25 roles per month</strong>. With that volume, relying on memory quickly leads to missed deadlines, forgotten follow-ups, and lost documents.</p>
      
      <p>Career-coaching platforms consistently recommend using a <strong>centralized tracking system</strong>, because systematic trackers help job seekers:</p>
      <ul>
        <li>stay aware of deadlines</li>
        <li>avoid duplicating applications</li>
        <li>remember which resume version they used</li>
        <li>maintain a weekly view of progress</li>
        <li>stay psychologically organized during a long search</li>
      </ul>
      
      <p>Research from behavioural psychology is clear: people perform better when their environment reduces cognitive load. A structured job-search workspace creates that stability.</p>
      
      <p><strong>Takeaway:</strong> If your job search feels chaotic, the first fix is organization. Use a single tool to track your applications, documents, and follow-up schedule.</p>

      <h2>2. They Tailor Their Resume — Because Employers Can Tell When You Don\'t</h2>
      <p>A frequently cited study from Jobscan found that over <strong>70% of resumes never reach a human reviewer</strong> due to Applicant Tracking Systems (ATS). Another LinkedIn Talent Insights report shows that tailored resumes significantly increase interview rates.</p>
      
      <p>Successful candidates don\'t send the same resume everywhere. They:</p>
      <ul>
        <li>match key skills and keywords from the job description</li>
        <li>highlight measurable achievements</li>
        <li>maintain multiple versions of their resume</li>
        <li>keep their formatting clean and ATS-compatible</li>
        <li>emphasize relevance over length</li>
      </ul>
      
      <p>This practice has been backed by hiring managers as well: tailored applications signal genuine interest and strategic thinking.</p>
      
      <p><strong>Takeaway:</strong> Create 2–3 role-specific versions of your resume (e.g., Product, Marketing, Operations) and link each version to the job you submit.</p>

      <h2>3. They Follow Up — Because Timing Influences Outcomes</h2>
      <p>One of the most widely confirmed patterns in recruiting is simple: <strong>candidates who follow up get more responses</strong>.</p>
      
      <p>Studies cited across Indeed Career Guide and LinkedIn show:</p>
      <ul>
        <li>Recruiters appreciate follow-ups because it demonstrate professionalism.</li>
        <li>Follow-ups within 7–10 days can increase reply rates.</li>
        <li>Many applications don\'t receive responses simply due to volume, not rejection.</li>
      </ul>
      
      <p>A well-timed, polite follow-up often moves your application from "unseen" to "reviewed."</p>
      <p>Yet most job seekers don\'t follow up at all — usually because they forget or feel unsure when to reach out.</p>
      
      <p><strong>Takeaway:</strong> Schedule follow-ups for every application. Consistency improves visibility and shows commitment.</p>

      <h2>4. They Maintain Consistency, Not Intensity</h2>
      <p>Gallup research consistently shows that motivation fluctuates, especially during stressful situations like job searching. Articles that perform well across career blogs emphasize one message: <strong>it\'s not the big bursts of effort that get people hired — it\'s consistency.</strong></p>
      
      <p>Successful candidates typically:</p>
      <ul>
        <li>apply on a predictable weekly rhythm</li>
        <li>set achievable goals</li>
        <li>review their progress</li>
        <li>track rejections and pivots</li>
        <li>balance quality with quantity</li>
        <li>avoid burnout by breaking the search into daily habits</li>
      </ul>
      
      <p>A strong job-search routine has the same benefits as a fitness routine: it compounds.</p>
      
      <p><strong>Takeaway:</strong> Aim for small daily actions (1–3 quality applications) instead of sporadic "application marathons."</p>

      <h2>5. They Use Tools That Reduce Friction, Not Add It</h2>
      <p>Job seekers read more "productivity and job-search systems" articles today than ever before — and for good reason. With the average recruiter spending 6–7 seconds scanning a resume, the margin for error is small.</p>
      
      <p>People perform better when:</p>
      <ul>
        <li>follow-up reminders are automated</li>
        <li>document versions are organized</li>
        <li>analytics show where progress is happening</li>
        <li>tasks are visible, not hidden in notes apps</li>
        <li>the workflow feels clean and predictable</li>
      </ul>
      
      <p>Simple tools make the job search easier. Complex tools create more work.</p>
      
      <p><strong>Takeaway:</strong> Choose tools that make your job search feel lighter — not heavier. Convenience, clarity, and automation matter.</p>

      <h2>Final Thought: Evidence Favors Structure</h2>
      <p>The job search is stressful, but data from career studies points in a clear direction: organization, consistency, and intentionality dramatically improve results.</p>
      
      <p>To summarize:</p>
      
      <table>
        <thead>
          <tr>
            <th>Evidence-Backed Habit</th>
            <th>Why It Works</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Structured tracking</td>
            <td>Reduces mistakes and missed opportunities</td>
          </tr>
          <tr>
            <td>Tailored resumes</td>
            <td>Improves ATS passage and recruiter engagement</td>
          </tr>
          <tr>
            <td>Follow-ups</td>
            <td>Increases reply rates and visibility</td>
          </tr>
          <tr>
            <td>Consistency</td>
            <td>Prevents burnout and builds momentum</td>
          </tr>
          <tr>
            <td>Clear tools</td>
            <td>Keeps the job search manageable and effective</td>
          </tr>
        </tbody>
      </table>
      
      <p>Small habits — done well — turn into interviews, conversations, and offers.</p>
      
      <p>If you\'re ready to bring structure, clarity, and momentum into your job search, now is the time to start building your system.</p>`,
    author: 'Rzume Team',
    publishedDate: 'November 8, 2025',
    readTime: '7 min read',
    imageUrl: 'assets/images/5 Evidence-Backed Habits of Job Seekers Who Get Hired Faster.png',
    category: 'Career Tips',
    isFeatured: false
  }
];

export const NEWSLETTER_SIGNUP: NewsletterSignup = {
  title: 'Organize your job hunt once and for all',
  description: 'If your job search feels scattered or overwhelming, it’s time to try a tool designed specifically for you.',
  buttonText: 'Get Started'
};

export const FEATURED_POST = BLOG_PAGE_POSTS.find((post: BlogPagePost) => post.isFeatured) || BLOG_PAGE_POSTS[0];
export const POPULAR_POSTS = BLOG_PAGE_POSTS.filter((post: BlogPagePost) => !post.isFeatured).slice(0, 4);
