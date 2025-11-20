
## Installation

Install dependencies
```bash
  npm install
```

Start the app
```bash
  npm start
```

By Default you can run it at
```bash
  http://localhost:9999/notifications
```
Or if you want using your own api, please follow this sample structure: [Here](http://13.239.117.240:10077/api/bpjs/notification/list)
```bash
  http://localhost:9999/notifications?apiurl={INSERT_YOUR_API_HERE}
```

Demo version (ready to try) 🚀🚀🚀
[http://13.239.117.240:9999/notifications?apiurl=http://13.239.117.240:10077/api/bpjs/notification/list](http://13.239.117.240:9999/notifications?apiurl=http://13.239.117.240:10077/api/bpjs/notification/list)

To seed user notification data you can run it with
```bash
  curl -X POST http://localhost:9999/api/notifications/{INSERT_USER_ID_HERE}/seed
```
Then to open notification for specific user id you can open
```bash
  http://localhost:9999/notifications/{INSERT_USER_ID_HERE}
```