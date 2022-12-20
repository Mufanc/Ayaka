.PHONY : install ayaka-app ayaka-cli clean

install: ayaka-app ayaka-cli

ayaka-app:
	cd ayaka-app; pnpm install; pnpm run build

ayaka-cli:
	cargo install --path ayaka-cli

clean:
	rm -rf ayaka-app/dist
	cd ayaka-cli; cargo clean
