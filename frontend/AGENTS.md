<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->


# Rules:
1. This project uses docker and docker compose. Only stay in the frontend container.
2. NEVER run any shell or bash commands unless its a curl command for testing output from endpoints.
3. NEVER mess with version control or anything related to git or github. All changes will be local.
4. Apply any changes incrementally.
