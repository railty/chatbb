ssh 192.168.168.67 "cd chatbb && mongodump --db=nodebb"
scp -r 192.168.168.67:chatbb/dump/* dump/
mongorestore --username=nodebb --password=nodebb --authenticationDatabase=nodebb --drop
cd NodeBB && ./nodebb upgrade
scp 192.168.168.67:chatbb/nodebb/public/uploads/profile/* NodeBB/public/uploads/profile/
