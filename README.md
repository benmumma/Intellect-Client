## Intellect-Client Supabase Migration (Legacy/New Toggle)

The app can target either the legacy Supabase instance or a new Supabase instance without code changes.

- __Toggle__: Set `REACT_APP_USE_NEW_SUPABASE` to `'true'` (new) or `'false'` (legacy) in `.env`.
- __Env Vars__:
  - Legacy: `REACT_APP_II_SUPABASE_URL`, `REACT_APP_II_SUPABASE_ANON_KEY`
  - New: `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY` (fallbacks supported: `REACT_APP_NEW_SUPABASE_URL`, `REACT_APP_NEW_SUPABASE_ANON_KEY`)
  - Backend base: `REACT_APP_SERVER_URL`, `REACT_APP_SERVER_PORT` (compose `API_BASE_URL`)
- __Buckets__: `ii_lessons` and `ii_chats` (legacy) → `ii-lessons` and `ii-chats` (new). Components select the bucket dynamically.
- __API dbInstance__: Frontend calls to Intellect Inbox endpoints include `dbInstance: 'current' | 'new'` based on the toggle.
  - Updated endpoints/components:
    - `intellectinbox/chat` → `src/intellect_inbox/lesson_page/ChatForm.jsx`, `src/intellect_inbox/lesson_page/HighlightMenu.jsx`
    - `intellectinbox/createCurriculum` → `src/intellect_inbox/courses/course_creation/CourseCreationForm.jsx`
    - `intellectinbox/createNextLesson` → `src/intellect_inbox/courses/course_row/CourseActions.jsx`
    - `intellectinbox/testFullProcess`, `intellectinbox/learnAnythingNow` → `src/intellect_inbox/components/buttons/AdHocLessonButton.jsx`

### Quick Test
1) Set `.env`:
   - Legacy: `REACT_APP_USE_NEW_SUPABASE=false`
   - New: `REACT_APP_USE_NEW_SUPABASE=true`
2) `npm start` and verify:
   - Auth, profile load, lessons list, lesson open, storage downloads, chat, and course creation.

## Centralized Auth (Mumapps-Auth) Toggle

You can toggle between Supabase Auth (legacy) and centralized Mumapps-Auth without code changes.

- __Toggle__: `REACT_APP_USE_CENTRALIZED_AUTH` set to `'true'` (centralized) or `'false'` (Supabase Auth).
- __Env Vars__:
  - `REACT_APP_USE_CENTRALIZED_AUTH=true|false`
  - `REACT_APP_AUTH_URL` and `REACT_APP_AUTH_PORT` for local/staging auth service (e.g., `localhost` + `5432`). If a full URL is provided in `REACT_APP_AUTH_URL` (e.g., `http://localhost:5432` or `https://auth.mumma.co`), it will be respected. If `REACT_APP_AUTH_URL` is not set, the default origin is `https://auth.mumma.co`.
  - Port omission rule: when the effective port is 80 or 443, it is omitted from the URL.
- __Core Files__:
  - `src/auth/CentralizedAuthLib.js` — checks auth status via centralized service, handles sign-in/out redirects.
  - `src/auth/useCentralizedAuth.js` — React hook exposing `{ isAuthenticated, user, hasIntellectAccess, loading, signIn, signOut }`.
  - `src/App.jsx` — `ProtectedRoute` gates routes using centralized auth when toggle is on, including premium access gating.
  - `src/intellect_inbox/context/IntellectInboxContext.jsx` — auto-creates a default `ii_users` row on first login (Supabase session path).

### Test Centralized Auth
1) Add to `.env.local`:
   - `REACT_APP_USE_CENTRALIZED_AUTH=true`
   - Local dev example: `REACT_APP_AUTH_URL=localhost` and `REACT_APP_AUTH_PORT=5432`
   - Staging/Prod example: `REACT_APP_AUTH_URL=https://auth.staging.mumma.co` (no port needed). If `REACT_APP_AUTH_URL` is omitted, the app will use `https://auth.mumma.co`.
2) `npm start`.
3) Navigate to a protected route. You should be prompted to sign in via centralized auth. After login:
   - If subscription grants access to Intellect Inbox, protected content loads.
   - If not, you’ll see a manage-subscription message.

Note: The app still uses Supabase for data (profiles, lessons, storage). The centralized auth governs app access and session; data CRUD continues via the configured Supabase instance.

### Premium Plan and Subscription Flow

- Pricing: Single Premium plan at $1.99/month. No credits or pay-as-you-go purchases.
- Upgrade/Manage: All subscription management is centralized at `MANAGE_ACCOUNT_URL` (computed from `REACT_APP_AUTH_URL`).
- User tiers: Only `free` and `premium` (plus `admin`). Legacy `standard` is deprecated and mapped to `free` limits in `src/constants/limits.js`.
- Front-end gating: Premium-only features check `user_tier === 'premium' || user_tier === 'admin'`.
- UI links: Buttons and prompts should link to Manage Account rather than local `/manage` routes.

Env variables involved:
- `REACT_APP_AUTH_URL` (and optional `REACT_APP_AUTH_PORT`) → used to build `MANAGE_ACCOUNT_URL`.
- `REACT_APP_USE_CENTRALIZED_AUTH=true` to enable centralized auth/session bridging.

Legacy notes:
- Legacy Stripe-based manage/checkout flows and one-time purchases remain archived in `src/intellect_inbox/pages/ManageAccount.jsx` but are not routed in `src/App.jsx`.
- `src/intellect_inbox/pages/SubscriptionSuccess.jsx` remains for archival; success/management now happens via Mumapps-Auth.

### Centralized Auth → Supabase Session Bridge

When `REACT_APP_USE_CENTRALIZED_AUTH=true`, the front-end now initializes the Supabase client session using the access and refresh tokens from the centralized auth session. This enables direct Supabase reads/writes (RLS) from the client to work under centralized auth.

- Helper functions in `src/constants/supabaseClient.js`:
  - `setIISupabaseSession(session)` — calls `supabase.auth.setSession({ access_token, refresh_token })` with tokens from centralized auth.
  - `clearIISupabaseSession()` — signs out the local Supabase client.
- Wiring in `src/intellect_inbox/context/IntellectInboxContext.jsx`:
  - On centralized auth changes, we set/clear the Supabase session before fetching user data/lessons.
  - Supabase auth listeners are disabled when centralized auth is on to avoid conflicts.
- Sign-out behavior:
  - `HeaderBar.jsx` and `IntellectInboxMain.jsx` defer to centralized sign-out when enabled; otherwise, they sign out of Supabase directly.

This mirrors the robust pattern used in Mumapps-Client and fixes failures of direct Supabase calls under centralized auth.

#### Immediate signed-in UI behavior

- When centralized auth confirms a valid session, `src/intellect_inbox/context/IntellectInboxContext.jsx` immediately dispatches `userStatus: 'signed_in'` with minimal user info so `src/intellect_inbox/IntellectInboxMain.jsx` can render the app shell while profile/lessons load in the background.
- `loadingSession` is set to `false` after centralized auth handling completes. Subsequent background fetches (`fetchUserData()`, `fetchUserLessons()`) hydrate the full state.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:5001](http://localhost:5001) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
