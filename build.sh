#!/usr/bin/env bash
# Exit on error
set -o errexit

echo "📦 Installing npm dependencies for portfolio server..."
npm install

# Fallback shim for gunicorn in case Render dashboard Start Command still references gunicorn
mkdir -p ./node_modules/.bin
cat << 'EOF' > ./node_modules/.bin/gunicorn
#!/usr/bin/env bash
echo "🚀 Starting Node.js portfolio server (via gunicorn shim)..."
exec node server.js
EOF
chmod +x ./node_modules/.bin/gunicorn

cat << 'EOF' > ./gunicorn
#!/usr/bin/env bash
echo "🚀 Starting Node.js portfolio server (via gunicorn shim)..."
exec node server.js
EOF
chmod +x ./gunicorn

echo "✅ Build completed successfully!"
