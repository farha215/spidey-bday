#!/bin/bash
export PATH="$HOME/.local/bin:$PATH"
cd /home/farha/Documents/spidey-bday
git add -A
git commit -m "🕷️ update: $(date '+%H:%M:%S')"
git push origin main
echo ""
echo "✅ Deployed! Live at: https://farha215.github.io/spidey-bday/"
echo "⏳ GitHub Pages takes ~30s to update."
