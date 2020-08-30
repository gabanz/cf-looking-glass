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

# How to Use

Add the parameters in the query string.

| Parameter | Definition | Example |
| ------------- |:-------------:|:-------------:|
| targets | hostname or IP address, separated by comma | 1.1.1.1,google.com |
| colos | Cloudflare data center in IATA code of the nearest major international airport, separated by comma | sin02,nrt01 |
| packets_per_ttl | number of packets sent at each TTL. min:0, max:10 | 5 |
| packet_type | icmp, tcp, udp, gre, gre+icmp | icmp |
| max_ttl | Maximum time to live. min:0, max:64 | 10 |
| wait_time | time in seconds to wait for a response. min:1, max:5 | 1 |
| port | For UDP and TCP, specifies the destination port. For ICMP, specifies the initial ICMP sequence value. min/default:0 (will choose the best value to use for each protocol), max:65535 | 443 |

Example:

```
curl -s "https://faizazhar.com/projects/traceroute?targets=1.1.1.1%2Cgoogle.com&colos=sin02%2Cnrt01&packet_type=icmp"
```