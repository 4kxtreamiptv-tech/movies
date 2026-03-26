function parseArgs(argv) {
  const args = {
    base: process.env.BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000",
  };

  for (const raw of argv) {
    const a = String(raw).trim();
    if (a.startsWith("--base=")) args.base = a.split("=").slice(1).join("=");
  }

  return args;
}

function log(msg) {
  // eslint-disable-next-line no-console
  console.log(msg);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const url = `${args.base}/api/home/snapshot?force=1`;

  try {
    const res = await fetch(url);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error("Snapshot update failed:", res.status, data?.error || data);
      process.exit(1);
    }

    log(
      `Home snapshot updated: ${data?.generatedAt || "unknown"} (suggestions=${Array.isArray(data?.suggestions) ? data.suggestions.length : 0
      }, latestMovies=${Array.isArray(data?.latestMovies) ? data.latestMovies.length : 0})`
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("Snapshot update error:", e);
    process.exit(1);
  }
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

