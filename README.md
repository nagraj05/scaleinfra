<div align="center">

```
███████╗ ██████╗ █████╗ ██╗     ███████╗██╗███╗   ██╗███████╗██████╗  █████╗
██╔════╝██╔════╝██╔══██╗██║     ██╔════╝██║████╗  ██║██╔════╝██╔══██╗██╔══██╗
███████╗██║     ███████║██║     █████╗  ██║██╔██╗ ██║█████╗  ██████╔╝███████║
╚════██║██║     ██╔══██║██║     ██╔══╝  ██║██║╚██╗██║██╔══╝  ██╔══██╗██╔══██║
███████║╚██████╗██║  ██║███████╗███████╗██║██║ ╚████║██║     ██║  ██║██║  ██║
╚══════╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝╚═╝  ╚═══╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝
```

**Visualize, simulate, and analyze complex systems in real-time.**  
Interactive node-based modeling. Real-time dashboard. Advanced analytics. All in one place.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)

</div>

---

## ✦ What is ScaleInfra?

ScaleInfra is a systems simulator platform that lets you build, visualize, and analyze complex systems through an intuitive node-based interface. Create interconnected networks of system components, configure their behaviors, and watch them evolve in real-time. Perfect for infrastructure planning, educational simulations, or prototyping complex workflows.

No complex setup. Just click, connect, and simulate.

---

## ✦ Features

| | |
|---|---|
| 🔗 **Node-Based Modeling** | Drag-and-drop nodes to build your system architecture visually |
| ⚙️ **System Configuration** | Configure node parameters, behaviors, and interactions in real-time |
| 📊 **Live Dashboard** | Monitor system metrics, performance indicators, and real-time analytics |
| 🎯 **Groups & Organization** | Organize complex systems with hierarchical node groups |
| 📝 **Annotations** | Add notes, labels, and documentation directly on the board |
| 💾 **Save & Load** | Persist your simulations to the cloud with Supabase |
| 🔐 **Secure Authentication** | Built-in user authentication via Clerk |
| 📱 **Responsive Design** | Works seamlessly on desktop and tablet devices |

---

## ✦ Requirements

- **Node.js v18+** → [nodejs.org](https://nodejs.org/)
- **Bun** (recommended) or npm/yarn → [bun.sh](https://bun.sh)
- A **Supabase account** → [supabase.com](https://supabase.com)
- A **Clerk account** → [clerk.com](https://clerk.com)

---

## ✦ Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/nagraj05/scaleinfra.git
cd scaleinfra

# 2. Install dependencies
bun install
# or: npm install

# 3. Set up environment variables
# Create a .env.local file with:
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-key
# CLERK_SECRET_KEY=your-clerk-secret
# NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# 4. Run migrations (optional - Supabase setup)
# Configure your database schema via Supabase dashboard

# 5. Launch the dev server
bun run dev
# or: npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ✦ Build for Production

```bash
bun run build
bun run start
```

Or deploy directly to [Vercel](https://vercel.com) with zero configuration.

---

## ✦ Project Structure

```
scaleinfra/
├── app/
│   ├── layout.tsx           ← Root layout with theme & auth
│   ├── page.tsx             ← Landing page
│   ├── dashboard/           ← User dashboard
│   ├── simulator/
│   │   └── [id]/            ← Simulator workspace by ID
│   └── api/                 ← Next.js route handlers
├── components/
│   ├── features/
│   │   ├── simulator/       ← Simulator board & controls
│   │   ├── dashboard/       ← Dashboard components
│   │   └── landing/         ← Landing page components
│   ├── shared/              ← Reusable components
│   └── ui/                  ← shadcn/ui components
├── hooks/
│   ├── use-simulation-engine.ts
│   └── use-mobile.ts
├── lib/
│   ├── supabase.ts
│   ├── utils.ts
│   └── math-utils.ts
├── providers/
│   ├── theme-provider.tsx
│   └── query-provider.tsx
├── public/                  ← Static assets
├── .env.local              ← Environment variables (not committed)
├── tailwind.config.ts      ← Tailwind customization
└── tsconfig.json           ← TypeScript config
```

---

## ✦ Key Components

**Simulator Board** (`components/features/simulator/simulator-board.tsx`)
- Interactive React Flow canvas for building systems
- Supports system nodes, group nodes, and annotations
- Real-time node configuration

**Simulation Engine** (`hooks/use-simulation-engine.ts`)
- Handles system state management
- Processes node interactions and data flow
- Powers real-time visualization

**Dashboard** (`app/dashboard/`)
- Overview of all saved simulations
- Create and manage simulation projects
- Launch simulations for editing

---

## ✦ Customization

### Change the theme
Edit `tailwind.config.ts` for colors, fonts, and design tokens.

### Add new node types
1. Create a new node component in `components/features/simulator/`
2. Register it in the simulator configuration
3. Add corresponding logic to `use-simulation-engine.ts`

### Modify the database schema
Update your Supabase schema via the dashboard or SQL editor, then update TypeScript types accordingly.

---

## ✦ Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS 4
- **Components:** shadcn/ui
- **Visualization:** React Flow (@xyflow)
- **State Management:** TanStack Query
- **Backend:** Next.js Route Handlers
- **Database:** Supabase (PostgreSQL)
- **Auth:** Clerk
- **Animations:** Framer Motion

---

## ✦ Troubleshooting

**Blank page or authentication issues**
→ Check your `.env.local` file. Ensure all Clerk keys are set correctly.

**Nodes not loading on the simulator board**
→ Verify Supabase connection and that your database tables exist.

**Build errors with TypeScript**
→ Run `bun run build` to catch type errors. Ensure all imports are correct.

---

## ✦ Contributing

Contributions are welcome! Please follow the architecture rules in `instructions.md` and maintain TypeScript strict mode.

---

## ✦ Credits

Built with [Next.js](https://nextjs.org/), [React Flow](https://reactflow.dev/), and [Tailwind CSS](https://tailwindcss.com/).  
Authentication by [Clerk](https://clerk.com/). Database by [Supabase](https://supabase.com/).

---

<div align="center">

Made with ♥ for building complex systems, one node at a time.

</div>
