# monitoring
monitoring tool to monitor urls from given list.

add urls line by line to `status/sites` e.g.:
```
https://github.com/
https://xdebug.org/
https://www.dict.cc/
```

setup cronjob:
```
*/1 * * * * cd /path/to/monitoring/status/ && ./status.sh > /dev/null
```

open tool with Chrome in kiosk mode (macOS):
```
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --kiosk /path/to/monitoring/index.html --disable-web-security --user-data-dir="/tmp" --disable-features=TranslateUI
```
