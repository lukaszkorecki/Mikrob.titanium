#!/bin/bash
jsl -nologo -process ./class/blip/blip.interface.js
jsl -nologo -process ./class/blip/blip.js
jsl -nologo -process ./class/blip/blipi.js
jsl -nologo -process ./class/blip/updates.js
jsl -nologo -process ./class/flaker/status.js
jsl -nologo -process ./class/flaker/flaker.interface.js
jsl -nologo -process ./class/flaker/flaker.js
jsl -nologo -process ./class/twitter/twitter.interface.js
jsl -nologo -process ./class/twitter/status.js
jsl -nologo -process ./class/twitter/twitter.js
jsl -nologo -process ./class/application/service.js
jsl -nologo -process ./class/application/interface.js
jsl -nologo -process ./class/application/application.js
jsl -nologo -process ./class/application/paginator.js
jsl -nologo -process ./class/application/http_connector.js
jsl -nologo -process ./class/application/database_connector.js
