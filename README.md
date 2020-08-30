# Cloudflare Looking Glass

This is a Workers script that calls the Enterprise Plan API which runs traceroute from 200+ Cloudflare data centers.

## Getting Started

Edit `wrangler.toml` file, add your Cloudflare account ID, email, zone ID and the route you want the Workers script to be deployed to.

Add Cloudflare API key as a secret variable:

```
wrangler secret put API_KEY
```

The script can be deployed by running:

```
wrangler publish
```

