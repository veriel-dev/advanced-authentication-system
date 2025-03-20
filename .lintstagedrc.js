module.exports = {
  // Backend files
  'backend-hexagonal/**/*.{ts,js}': [
    'cd backend-hexagonal && pnpm prettier --write',
    'cd backend-hexagonal && pnpm eslint --fix',
  ],
  
  // Frontend files
  'frontend-react/**/*.{ts,tsx,js,jsx}': [
    'cd frontend-react && pnpm prettier --write',
    'cd frontend-react && pnpm eslint --fix',
  ],
};