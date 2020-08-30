addEventListener("fetch", event => {
    event.respondWith(eventHandler(event))
  })
  
  const account_id = ACCOUNT_ID
  const endpoint = 'https://api.cloudflare.com/client/v4/accounts/' + ACCOUNT_ID + '/diagnostics/traceroute'
  const email = EMAIL
  const api_key = API_KEY
  let targets = ['1.1.1.1']
  let colos = []
  let options = {
    "packets_per_ttl": 5,
    "packet_type": "tcp",
    "max_ttl": 15,
    "wait_time": 1,
    "port": 443
  }

  async function eventHandler(event) {
    try {
    //get params from query strings
    const params = {}
    const url = new URL(event.request.url)
    const queryString = url.search.slice(1).split('&')
  
    //format params
    queryString.forEach(item => {
      const kv = item.split('=')
      if (kv[0]) params[kv[0]] = kv[1] || true
    })
    console.log(JSON.stringify(params))

    //if targets is defined in query strings
    if (params.targets) {
      //remove the default targets value
      targets.pop()
      //split the param values into an array
      const target = decodeURIComponent(params.targets).split(',')
      //push each items in the array into targets arrray
      target.forEach(item => {
        targets.push(item)
      })
    }
    
    const cf = await event.request.cf

    //if colos is defined in query strings
    if (params.colos) {
        //split the param values into an array
        const colo = decodeURIComponent(params.colos).split(',')
        //push each items in the array into colos arrray
        colo.forEach(item => {
          colos.push(item.toLowerCase())
        })
        //if colos is defined in query strings but no values set
        if (params.colos === true) {
            colos.pop()
        }
      } else {
      //get the eyeball colo from request.cf object and push to target colos
      colos.push(cf.colo.toLowerCase() + '01')
    }

    //if packets_per_ttl is defined in query strings
    if (params.packets_per_ttl) {
        options.packets_per_ttl = parseInt(params.packets_per_ttl)
    }

    //if max_ttl is defined in query strings
    if (params.max_ttl) {
        options.max_ttl = parseInt(params.max_ttl)
    }

    //if wait_time is defined in query strings
    if (params.wait_time) {
        options.wait_time = parseInt(params.wait_time)
    }

    //if packet_type is defined in query strings
    if (params.packet_type) {
        options.packet_type = params.packet_type.toLowerCase()
    }

    //if port is defined in query strings
    if (params.port) {
        options.port = parseInt(params.port)
    }

    const body = {
        "targets": targets,
        "colos": colos,
        "options": options
      }
    console.log(body)

    const init = {
      body: JSON.stringify(body),
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'X-Auth-Email': email,
        'X-Auth-Key': api_key
      },
    }
    const response = await fetch(endpoint, init)
    return response
    } catch (e) {
        console.error(e.stack)
        return `${e.message}`
    }
  }