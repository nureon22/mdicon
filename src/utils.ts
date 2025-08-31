import { LocalCache } from "./localcache";

const iconLocalCache = new LocalCache("mdicon");

export async function getIconData(icon: {
  name: string;
  family: "outlined" | "rounded" | "sharp" | string;
  filled: boolean;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700 | number;
}): Promise<{ viewBox: string; path: string } | null> {
  let { name, family, filled, weight } = icon;

  if (family != "outlined" && family != "rounded" && family != "sharp") {
    family = "outlined";
  }

  if (weight) {
    weight = Math.round(weight / 100) * 100;
    weight = Math.min(Math.max(100, weight), 700);
  }

  let opts = "default";

  if (weight) {
    opts = "wght" + weight;
  }

  if (filled) {
    opts = opts == "default" ? "fill1" : opts + "fill1";
  }

  const cacheName = `${name}:${Number(filled)}`;
  const cachedValue = iconLocalCache.get(cacheName);

  if (cachedValue) {
    const { viewBox, path } = JSON.parse(cachedValue);

    if (typeof viewBox == "string" && typeof path == "string") {
      return { viewBox, path };
    }
  }

  const host = "https://fonts.gstatic.com/s/i/short-term/release";
  const src = `${host}/materialsymbols${family}/${name}/${opts}/24px.svg`;

  return fetch(src).then(async (response) => {
    if (response.ok && response.status == 200) {
      const content = await response.text();

      // Extract required viewBox and path draw attributes insteadof
      // rendering the whole server response blindly
      const viewBox = extractViewBox(content);
      const path = extractPath(content);

      if (viewBox && path) {
        const result = { viewBox, path };
        iconLocalCache.set(
          cacheName,
          JSON.stringify(result),
          Date.now() + 86400 * 7,
        );
        return result;
      }
    }

    return null;
  });
}

function extractViewBox(svg: string): string | null {
  const regx = /viewBox="[^"]+"/;
  const result = regx.exec(svg);

  if (result && result[0]) {
    return result[0].slice(9, -1);
  } else {
    return null;
  }
}

function extractPath(svg: string): string | null {
  const regx = /d="[^"]+"/;
  const result = regx.exec(svg);

  if (result && result[0]) {
    return result[0].slice(3, -1);
  } else {
    return null;
  }
}
