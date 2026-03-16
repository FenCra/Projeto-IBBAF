Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
shell.CurrentDirectory = scriptDir

serverExe = scriptDir & "\IBBAF-Server.exe"
If Not fso.FileExists(serverExe) Then
  MsgBox "Servidor não encontrado: " & serverExe, vbCritical, "Erro"
  WScript.Quit 1
End If

shell.Run Chr(34) & serverExe & Chr(34), 0, False

WScript.Sleep 1500

shell.Run "cmd /c start http://localhost:3000", 0, False

Set fso = Nothing
Set shell = Nothing
