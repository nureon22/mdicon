import { LocalCache } from "./localcache";

const iconLocalCache = new LocalCache("mdicon");

export async function getIconData(
  name: string,
  filled: boolean,
): Promise<{ viewBox: string; path: string } | null> {
  const cacheName = `${name}:${Number(filled)}`;
  const cachedValue = iconLocalCache.get(cacheName);

  if (cachedValue) {
    const { viewBox, path } = JSON.parse(cachedValue);

    if (typeof viewBox == "string" && typeof path == "string") {
      return { viewBox, path };
    }
  }

  const host = "https://fonts.gstatic.com/s/i/short-term/release";
  const src = `${host}/materialsymbolsoutlined/${name}/${filled ? "fill1" : "default"}/24px.svg`;

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
