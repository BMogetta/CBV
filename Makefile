push:
	git pull && git update-index --chmod=+x .github/scripts/commit.sh && git add . && git commit -m "ci: write file and commit script working" && git push

PHONY: push