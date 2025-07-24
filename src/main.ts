import { getIconData } from "./utils";

export default class MDIcon extends HTMLElement {
  isFirstMount = true;

  connectedCallback() {
    if (this.isFirstMount) {
      this.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
      `;
      this.isFirstMount = false;
      this.refreshIcon();
    }
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case "icon":
      case "filled":
        if (!this.isFirstMount) {
          this.refreshIcon();
        }
        break;
      case "size":
        this.setIconSize(Number(newValue || "24"));
        break;
    }
    console.log("attributeChangedCallback");
  }

  setIconSize(size: number) {
    if (!Number.isNaN(size)) {
      this.style.width = size + "px";
      this.style.height = size + "px";
    }
  }

  async refreshIcon() {
    const icon = this.getAttribute("icon");
    const filled =
      this.getAttribute("filled") == "" ||
      this.getAttribute("filled") == "true";

    if (icon) {
      const iconData = await getIconData(icon, filled);

      if (iconData) {
        this.innerHTML = `
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="${iconData["viewBox"]}"
            fill="currentColor"
            width="100%"
            height="100%"
          ">
            <path d="${iconData["path"]}"/>
          </svg>
        `;
      }
    }
  }

  /** preload a list of icons to use them later */
  static preloadIcons(icons: { icon: string; filled: boolean }[]) {
    for (const icon of icons) {
      getIconData(icon.icon, icon.filled);
    }
  }

  static observedAttributes = ["icon", "filled", "size"];
}

if (typeof window === "object") {
  Object.defineProperty(window, "MDIcon", {
    configurable: true,
    enumerable: true,
    writable: true,
    value: MDIcon,
  });
  customElements.define("md-icon", MDIcon);
}
