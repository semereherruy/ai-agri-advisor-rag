# Tailwind CSS Fix Instructions

If you're seeing unstyled components, follow these steps:

1. **Stop the development server** (Ctrl+C)

2. **Clear the cache and restart:**
   ```bash
   cd frontend
   rm -rf node_modules/.cache
   npm start
   ```

3. **If that doesn't work, try:**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   npm start
   ```

4. **Verify Tailwind is working:**
   - Check browser console for errors
   - Verify `index.css` is imported in `index.tsx`
   - Check that Tailwind directives (`@tailwind base`, etc.) are in `index.css`

5. **If styles still don't load:**
   - Make sure `postcss.config.js` exists
   - Make sure `tailwind.config.js` has correct content paths
   - Restart the dev server completely

