const DIRECT_IMAGE_EXTENSIONS = /\.(?:avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i;
const DIRECT_IMAGE_HOSTS = [
  'i.ibb.co',
  'images.unsplash.com',
  'i.imgur.com',
  'i.postimg.cc',
  'iili.io',
  'lh3.googleusercontent.com',
  'blogger.googleusercontent.com',
  'res.cloudinary.com'
];

function stripTrailingPunctuation(value) {
  return String(value || '').replace(/[),.;\]]+$/g, '');
}

export function normalizeImageUrl(value) {
  if (!value || typeof value !== 'string') return '';

  const trimmedUrl = stripTrailingPunctuation(value.trim().replace(/&amp;/g, '&'));
  if (!trimmedUrl) return '';

  try {
    const url = new URL(trimmedUrl);
    const host = url.hostname.toLowerCase().replace(/^www\./, '');

    if (host.includes('google.') && url.pathname.includes('/imgres')) {
      const imgUrlParam = url.searchParams.get('imgurl');
      return imgUrlParam ? normalizeImageUrl(imgUrlParam) : trimmedUrl;
    }

    if ((host === 'imgur.com' || host === 'm.imgur.com') && url.pathname.split('/').filter(Boolean).length === 1) {
      const id = url.pathname.split('/').filter(Boolean)[0];
      if (id && !DIRECT_IMAGE_EXTENSIONS.test(id)) return `https://i.imgur.com/${id}.jpg`;
    }

    if (host === 'ibb.co' && url.searchParams.get('url')) {
      return normalizeImageUrl(url.searchParams.get('url'));
    }

    return url.toString();
  } catch (error) {
    return trimmedUrl;
  }
}

export function splitImageUrls(value) {
  if (Array.isArray(value)) {
    return value.map(normalizeImageUrl).filter(Boolean);
  }

  return String(value || '')
    .split(/\r?\n|,\s*/)
    .map(normalizeImageUrl)
    .filter(Boolean);
}

export function uniqueImageUrls(values) {
  return [...new Set(splitImageUrls(values))];
}

export function extractImageUrls(value) {
  if (!value || typeof value !== 'string') return [];

  const urls = new Set();
  const htmlAttributePattern = /(?:src|href|data-src|data-full|data-original)=["'](https?:\/\/[^"']+)["']/gi;
  const markdownImagePattern = /!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/gi;
  const plainUrlPattern = /(https?:\/\/[^\s"'<>]+)/gi;

  [htmlAttributePattern, markdownImagePattern, plainUrlPattern].forEach((pattern) => {
    let match;
    while ((match = pattern.exec(value)) !== null) {
      const normalized = normalizeImageUrl(match[1]);
      if (normalized) urls.add(normalized);
    }
  });

  const extracted = Array.from(urls);
  const directUrls = extracted.filter(isLikelyDirectImageUrl);
  return directUrls.length ? directUrls : extracted;
}

export function imageCandidates(...values) {
  return uniqueImageUrls(values.flatMap((value) => (Array.isArray(value) ? value : [value])));
}

export function isLikelyDirectImageUrl(value) {
  const normalized = normalizeImageUrl(value);
  if (!normalized) return false;
  if (DIRECT_IMAGE_EXTENSIONS.test(normalized)) return true;

  try {
    const host = new URL(normalized).hostname.toLowerCase().replace(/^www\./, '');
    return DIRECT_IMAGE_HOSTS.some((directHost) => host === directHost || host.endsWith(`.${directHost}`));
  } catch (error) {
    return false;
  }
}
