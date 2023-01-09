push:
	git pull && chown 777 .github/scripts/commit.sh &&git add . && git commit -m "test" && git push

PHONY: push