// Local Node.js entry point; Vercel uses src/index.ts instead.
import app from "./app.js";
const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Server running on port ${port}`));
