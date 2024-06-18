# In case db doesnt work try:
0. Run the cmd with administrator rights

1. Delete the containers and the volumes
2. Check the port open in windows ^^ : 
# C:\Windows\system32>netstat -ano | find "3306"
# TCP    0.0.0.0:3306           0.0.0.0:0 LISTENING       6068

3. Kill the process with: 
# C:\Windows\system32>taskkill /PID 6068 /f
# SUCCESS: The process with PID 6068 has been terminated.