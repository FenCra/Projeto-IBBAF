Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
shell.CurrentDirectory = scriptDir
shell.Run "powershell -NoProfile -WindowStyle Hidden -Command ""$c=Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue; if($c){$p=$c|Where-Object {$_.State -eq 'Listen'}|Select-Object -First 1 -ExpandProperty OwningProcess; if($p -and $p -ne 0){Stop-Process -Id $p -Force}}""", 0, True
shell.Run Chr(34) & scriptDir & "\IBBAF-Server.exe" & Chr(34), 0, False
WScript.Sleep 1000
shell.Run "http://localhost:3000", 1, False

Set fso = Nothing
Set shell = Nothing
