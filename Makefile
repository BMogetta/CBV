push:
	git pull && git update-index --chmod=+x .github/scripts/commit.sh && git add . && git commit -m "ci: write file and commit script working" && git push

run: |
	deno run --allow-write --allow-read --allow-env .github/scripts/mod.ts ""  "test_api_url" "test_api_key"

PHONY: push run 