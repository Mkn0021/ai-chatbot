<div align="center" style="margin-bottom: 12px;">
	<span style="display: inline-flex; align-items: center; gap: 12px;">
		<svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-top: 6px;">
			<g filter="url(#filter0_di_966_1877)"><path d="M4.53553 16.0355C2.58291 14.0829 2.58291 10.9171 4.53553 8.96447L10.1924 3.30761C12.145 1.35499 15.3108 1.35499 17.2635 3.30761L22.9203 8.96447C24.8729 10.9171 24.8729 14.0829 22.9203 16.0355L17.2635 21.6924C15.3108 23.645 12.145 23.645 10.1924 21.6924L4.53553 16.0355Z" fill="#FB4C01"></path></g>
			<defs>
				<filter id="filter0_di_966_1877" x="0.0712891" y="0.843262" width="27.3135" height="27.3135" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
					<feFlood flood-opacity="0" result="BackgroundImageFix"></feFlood>
					<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
					<feOffset dy="2"></feOffset>
					<feGaussianBlur stdDeviation="1.5"></feGaussianBlur>
					<feComposite in2="hardAlpha" operator="out"></feComposite>
					<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"></feColorMatrix>
					<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_966_1877"></feBlend>
					<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_966_1877" result="shape"></feBlend>
					<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"></feColorMatrix>
					<feOffset dy="2"></feOffset>
					<feGaussianBlur stdDeviation="2"></feGaussianBlur>
					<feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"></feComposite>
					<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 0.664321 0 0 0 0 0.520459 0 0 0 1 0"></feColorMatrix>
					<feBlend mode="normal" in2="shape" result="effect2_innerShadow_966_1877"></feBlend>
				</filter>
			</defs>
		</svg>
		<span style="font-size:2.2rem;font-weight:700;vertical-align:middle;">AI Chatbot</span>
	</span>
	<br/>
	<a href="https://chatbot-mkn0021.vercel.app/" target="_blank">
		<img src="https://img.shields.io/badge/Live%20Demo-Click%20Here-brightgreen?style=for-the-badge" alt="Live Demo" />
	</a>
</div>


Connect your data with AI seamlessly. This platform lets you query, analyze, and automate across your databases using AI models, with full privacy and control. Run locally or in the cloud.


## 🚀 Features

- **Universal Database Integration**  
  Connect to Postgres and other databases for seamless data access.

- **Natural Language Query Chat**  
  Ask questions and get answers from your data using conversational AI.

- **Visual Data Insights**  
  Transform queries into beautiful charts and dashboards for better understanding.

- **Real-Time Query Updates**  
  Get instant notifications and live responses as your AI agent processes data.

- **Organization & Team Management**  
  Manage organizations, teams, and roles for collaborative analytics.

- **Access Control & Permissions**  
  Fine-grained control over who can access and modify data.

- **Authentication**  
  Secure login with email/password and Google OAuth.

- **Works Locally & Securely**  
  Deploy locally or in the cloud with privacy-first architecture.

- **Fast AI Response (<50ms)**  
  Experience lightning-fast answers from your AI models.

- **Demo Healthcare Analytics Database**  
  Test analytics and dashboards with realistic hospital data.

- **API for Custom Integrations**  
  Extend the platform with your own tools and workflows.

- **Multiple AI Providers**  
  Easily connect to OpenAI, Gemini, Claude, HuggingFace, Ollama, and more.

- **Extensible Architecture**  
  Add new providers, models, or tools with minimal effort.

### Advanced AI Chat Features

- Support for multiple AI models (OpenAI, Gemini, Claude, HuggingFace, Ollama, etc.)
- **Local model support** (Ollama, custom models, run AI fully offline)
- **Model selection per chat** (choose your preferred model for each conversation)
- **Multimodal input** (text, files, images)
- **Tool-augmented reasoning** (actions, suggestions, code execution)
- **Private and public chat visibility**
- **Voting and feedback on responses**
- **Auto-resume and chat history**
- **Secure, privacy-first architecture**
- **Streaming responses** (see answers as they generate)
- **Custom prompt templates** (tailor AI behavior)
- **Plugin/tool support** (extend chat with custom tools)
- **Data-aware AI** (AI understands your schema and workflows)
- **Organization-level model settings** (set default models per org)
- **User impersonation for admins** (debug or support users)
- **Advanced analytics and usage stats**

---

## 🔒 Security & Privacy

- **API Key Safety**: For cloud models (OpenAI, Gemini, etc.), your API keys are stored only in your browser's local storage. They are never sent to the server or shared—no risk of leaking your keys.
- **Database Security**: Only `SELECT` queries are allowed for database access, preventing any destructive operations. All queries are validated for safety.
- **Local Model Support**: Run AI models fully offline with Ollama or custom models—no data leaves your machine.
- **Privacy-First Design**: All user data and credentials are protected with modern authentication and encryption standards.

---

## 🛠 Tech Stack

- Next.js 16
- React
- Drizzle ORM & PostgreSQL
- Docker (for local DB)
- pnpm (package manager)
- Radix UI, Lucide Icons, Sonner, Motion
- Zod (validation)
- Better Auth (authentication)

## ⚡ Quick Start

1. Clone the repo
2. Install dependencies: `pnpm install`
3. Copy `.env.example` to `.env` and fill in required variables
4. Start Postgres DB: `docker-compose up -d`
5. Run migrations: `pnpm db:migrate`
6. Start dev server: `pnpm dev`

## 🔑 Environment Variables

- `POSTGRES_URL` - Database connection string
- `BETTER_AUTH_URL` - Auth service URL
- `BETTER_AUTH_SECRET` - Auth secret
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - For Google OAuth

## 🏥 Demo Healthcare Database

See [`lib/db/seed/README.md`](lib/db/seed/README.md) for demo data setup and schema.

## 📚 Folder Structure

- `app/` - Next.js app routes
- `components/` - UI and chat components
- `lib/` - Utilities, AI, DB, API
- `hooks/` - Custom React hooks
- `types/` - TypeScript types
- `middlewares/` - API middlewares

## 🔒 Authentication & Access Control

- Email/password & Google OAuth
- Organization/team management
- Role-based permissions

## 💬 Chat & AI Features

- Natural language chat with database
- Model selection (OpenAI, Gemini, Claude, HuggingFace, Ollama, etc.)
- **Local model support** (Ollama, custom models, run AI fully offline)
- Multimodal input (text, files, images)
- Tool-augmented reasoning
- Private/public chat visibility
- Voting & feedback
- Auto-resume, chat history
- Streaming responses
- Custom prompt templates
- Plugin/tool support
- Data-aware AI

## 📈 Data Visualization

- Charts, dashboards, and analytics
- Real-time updates

## 🧩 API & Integrations

- REST API for custom integrations
- Easily extend with new models/tools

## 🏢 Organization Management

- Team members, roles, permissions
- Database connection per organization
- Organization-level model settings

## 🛡️ Security

- Runs locally or in the cloud
- Data privacy-first design


## 📄 License

MIT
