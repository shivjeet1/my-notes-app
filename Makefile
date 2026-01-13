APP_NAME := my-notes

TAURI_BIN := src-tauri/target/release/app 
BIN_DST := /usr/local/bin/$(APP_NAME)

DESKTOP_FILE := $(APP_NAME).desktop 
DESKTOP_DST := /usr/share/applications/$(DESKTOP_FILE)

ICON_SRC := public/apple-icon.png
ICON_DST := /usr/share/icons/hicolor/256x256/apps/$(APP_NAME).png

.PHONY: install uninstall check clean

check:
	@test -f $(TAURI_BIN) || (echo "Error: No binary found at $(TAURI_BIN). Run 'npx tauri build' first." && exit 1)

install: check
	@echo "Installing $(APP_NAME) . . ."
	sudo install -Dm755 $(TAURI_BIN) $(BIN_DST)
	sudo install -Dm644 $(DESKTOP_FILE) $(DESKTOP_DST)
	sudo install -Dm644 $(ICON_SRC) $(ICON_DST)
	sudo update-desktop-database /usr/share/applications || true
	@echo "Installed $(APP_NAME) from terminal."

uninstall: check
	@echo "Uninstalling $(APP_NAME) . . ."
	sudo rm -rf $(BIN_DST)
	sudo rm -rf $(DESKTOP_DST)
	sudo rm -rf $(ICON_DST)
	sudo update-desktop-database /usr/share/applications || true
	echo "Uninstalled $(APP_NAME) from terminal."

