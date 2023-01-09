push:
	git pull && git update-index --chmod=+x .github/scripts/commit.sh && git add . && git commit -m "test" && git push

PHONY: push