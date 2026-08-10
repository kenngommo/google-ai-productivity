@echo off
echo =======================================================
echo Launching Chrome in interactive desktop mode...
echo Profile path: %~dp0scripts\chrome_temp_profile
echo =======================================================
"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="%~dp0scripts\chrome_temp_profile" https://shopee.vn/buyer/login
